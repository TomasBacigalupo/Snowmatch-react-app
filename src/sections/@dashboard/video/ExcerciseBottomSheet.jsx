import { Button, Drawer, Paper, SwipeableDrawer, Typography } from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from "src/redux/store";
import { clearUploadVideoState, createVideo } from "src/redux/slices/video";
import { useTranslation } from "react-i18next";
import useLocales from "src/hooks/useLocales";
import useAuth from "src/hooks/useAuth";
import { PATH_AUTH } from "src/routes/paths";
import { useNavigate } from "react-router";
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor';
import { VideoPicker } from '@coderpradp/capacitor-plugin-video-picker';
import VideoTrimmer from "./VideoTrimmer";
import { m } from 'framer-motion';
import Logo from "src/components/Logo";

import { FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { LoadingButton } from "@mui/lab";
import { column } from "stylis";
import ProgressComponent from "./ProgressComponent";
import AcademyWelcome from 'src/sections/@dashboard/video/AcademyWelcome';
import Markdown from "src/components/Markdown";
import VideoStory from "./VideoStory";
import StoryPlayer from "./StoryPlayer";
import DoDontList from "./DoDoNotList";
import Login from "src/pages/auth/Login";



const RootStyle = styled('div')(({ theme }) => ({
    right: 0,
    bottom: 0,
    zIndex: 99999,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

export default function ExcerciseBottomSheet({ open, onClose, onOpen, course, demoUrl, level }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    const { translate } = useLocales();
    const steps = ['Ejercicio', 'Tu video', 'Subir'];
    const theme = useTheme();
    const [videoCourse, setVideoCourse] = useState(course);

    const [openWelcome, setOpenWelcome] = useState(false);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const videoRef = useRef(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loadingCompresor, setLoadingCompresor] = useState(false)
    const [_progress, setProgress] = useState(0);
    const today = new Date().toISOString().split("T")[0];
    const isPremium = user?.premiumExpiration > today

    const handleCloseAcademywelcome = () => {
        setOpenWelcome(false)
    }
    const onAddToPremium = () => {

    }

    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.video)


    const handleUpload = useCallback(async () => {
        console.log("handeleUpload")
        console.log("selectedFile", selectedFile)
        setLoadingCompresor(true)

        const file = selectedFile;
        const fetchedFile = await fetch(file.webPath);
        const blobFile = await fetchedFile.blob();

        console.log("blobFile", blobFile.type);

        // Load FFmpeg.wasm
        const ffmpeg = new FFmpeg({ log: true });
        await ffmpeg.load();

        // Add progress listener
        ffmpeg.on('progress', (progressData) => {
            setProgress(Number(progressData.progress * 100).toFixed(2));
        });

        // Instead of writing to virtual file system, process the Blob directly
        const inputFileData = await blobFile.arrayBuffer();  // Convert Blob to ArrayBuffer

        // Initialize FFmpeg input as ArrayBuffer
        await ffmpeg.writeFile('input.mp4', new Uint8Array(inputFileData));

        // Set up FFmpeg command to compress the video
        const outputFileName = 'compressed_video.mp4';

        await ffmpeg.exec([
            '-i', 'input.mp4',  // Input file
            '-b:v', '3000k',    // Lower video bitrate
            '-r', '30',          // Limitar a 30 FPS
            '-preset', 'fast',   // Compresión rápida pero eficiente
            '-b:a', '64k',     // Lower audio bitrate
            '-movflags', '+faststart', // Permite reproducción inmediata
            '-vf', 'scale=-2:720',  // Redimensionar a 720p manteniendo relación de aspecto
            outputFileName
        ]);

        // await ffmpeg.exec([
        //     '-i', 'input.mp4',  // Archivo de entrada
        //     '-vf', 'scale=-2:720',  // Redimensionar a 720p manteniendo relación de aspecto
        //     '-c:v', 'libx264',   // Códec de video optimizado para móviles
        //     '-preset', 'fast',   // Compresión rápida pero eficiente
        //     '-crf', '28',        // Factor de calidad (más alto = más compresión)
        //     '-b:v', '600k',      // Bitrate de video optimizado
        //     '-maxrate', '800k',  // Control de picos de bitrate
        //     '-bufsize', '1200k', // Buffer de bitrate
        //     '-r', '30',          // Limitar a 30 FPS
        //     '-c:a', 'aac',       // Códec de audio compatible con móviles
        //     '-b:a', '64k',       // Bitrate de audio optimizado
        //     '-movflags', '+faststart', // Permite reproducción inmediata
        //     'output.mp4'
        // ]);

        // Read the compressed file from FFmpeg's virtual filesystem
        const compressedFileData = await ffmpeg.readFile(outputFileName);

        // Convert the compressed file data back to a Blob
        const compressedBlobFile = new Blob([compressedFileData.buffer], { type: 'video/mp4' });

        console.log("compressedBlobFile", compressedBlobFile.type);

        dispatch(createVideo(compressedBlobFile, level));
        setActiveStep(2);

    }, [selectedFile, setLoadingCompresor, setActiveStep, dispatch]);

    const resetUploadState = () => {
        setSelectedFile(null);
        setVideoPreviewUrl(null);
        setVideoDuration(0);
        setVideoCourse('');
        setActiveStep(0);
        setOpenWelcome(false);
        setLoadingCompresor(false);
        setProgress(0);
    };

    useEffect(() => {
        if (activeStep === 2 && isLoading === false) {
            setActiveStep(3);
        }
    }, [isLoading]);

    useEffect(() => {
        if (!open) {
            resetUploadState();
            dispatch(clearUploadVideoState());
        }
    }, [open]);

    const onCloseWrapper = () => {
        resetUploadState();
        setActiveStep(0);
        onClose();
    }

    const handleTrim = async (start, end) => {
        if (!videoPreviewUrl) return;
        const trimmedVideo = await VideoEditor.trim(videoPreviewUrl, start, end);
        if (trimmedVideo) {
            console.log("Trimmed video ready for upload:", trimmedVideo);
            setSelectedFile(trimmedVideo);
        }
    };

    useEffect(() => console.log("this is teh course"), [course])

    const uploadVideo = async () => {
        try {
            await Camera.requestPermissions();

            const videos = await VideoPicker.pick();
            const file = videos.files[0];

            setVideoPreviewUrl(file.webPath);
            setSelectedFile(file);

            console.log("file.path", file.path);

        } catch (error) {
            console.error('Error uploading video:', error.message);
        }
    };

    console.log(course, level)

    const renderStep = useCallback(() => {
        switch (activeStep) {
            case 0:
                return (
                    <Box my={2} display="flex" height='100%' flexDirection="column" sx={{ position: 'relative' }}>
                        <Box mb={2} display="flex" flexDirection="column" sx={{ flex: 1, overflow: 'auto', pb: 10 }}>
                            <StoryPlayer />
                            <Box>
                                <Paper
                                    sx={{
                                        border: '2px solid',
                                        borderColor: 'primary.dark',
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 4
                                    }}
                                >
                                    <Markdown>
                                        {translate(`course.${level}.objective`)}
                                    </Markdown>
                                </Paper>
                            </Box>

                            {/* <Box sx={{ p: 3 }}>
                                <DoDontList
                                    title={translate('course.exercise.howToPass')}
                                    doItems={[
                                        translate(`course.${level}.do.1`),
                                        translate(`course.${level}.do.2`),
                                        translate(`course.${level}.do.3`),
                                    ]}
                                    dontItems={[
                                        translate(`course.${level}.dont.1`),
                                        translate(`course.${level}.dont.2`),
                                        translate(`course.${level}.dont.3`),
                                    ]}
                                />
                            </Box> */}
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Box
                                    component="img"
                                    src="/assets/avatars/snow-ai.png"
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        objectFit: "cover",
                                        borderRadius: '50%',
                                        border: (theme) => `4px solid ${theme.palette.primary.main}`,
                                        boxShadow: (theme) => theme.customShadows?.z8,
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        }
                                    }}
                                />
                                <Box>
                                    <Typography variant="h3" sx={{ color: "primary.dark" }}>
                                        {translate('course.exercise.aiCorrection')}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                                        Snow es un instructor de esqui AI
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    mt: 4,
                                    p: 3,
                                    backgroundColor: 'background.neutral',
                                    borderRadius: 2,
                                    border: (theme) => `1px solid ${theme.palette.divider}`
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1, color: 'primary.dark' }}>
                                    ¿Querés una revisión más detallada?
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    También vas a poder solicitar que un instructor de SnowMatch te dé sus correcciones personalizadas.
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                px: 2,
                                marginBottom: 'env(safe-area-inset-bottom)',
                                zIndex: 1000,
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    py: 2,
                                }}
                                fullWidth
                                onClick={async () => {
                                    await uploadVideo();
                                    setActiveStep(activeStep + 1)
                                }}
                            >
                                {translate('course.exercise.selectVideo')}
                            </Button>
                        </Box>
                    </Box>
                );
            case 1:
                return (
                    <Box my={2} display="flex" height='100%' flexDirection="column" justifyContent='space-between'>
                        <Box my={2}>
                            {videoPreviewUrl && (
                                <VideoTrimmer videoUrl={videoPreviewUrl} />
                            )}
                        </Box>

                        {_progress > 0 && <ProgressComponent _progress={_progress} />}

                        <LoadingButton
                            loading={loadingCompresor}
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                setLoadingCompresor(true)
                                handleUpload()
                            }}
                            sx={{ py: 2, my: 2 }}
                        >
                            Subir Video
                        </LoadingButton>

                    </Box>

                );
            case 2:
                return (
                    <RootStyle>
                        <m.div
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: 360 }}
                            transition={{
                                duration: 2,
                                ease: 'easeInOut',
                                repeatDelay: 1,
                                repeat: Infinity,
                            }}
                        >
                            <Logo disabledLink sx={{ width: 64, height: 64 }} />
                        </m.div>

                        <Box
                            component={m.div}
                            animate={{
                                scale: [1.2, 1, 1, 1.2, 1.2],
                                rotate: [270, 0, 0, 270, 270],
                                opacity: [0.25, 1, 1, 1, 0.25],
                                borderRadius: ['25%', '25%', '50%', '50%', '25%'],
                            }}
                            transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: '25%',
                                position: 'absolute',
                                border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
                            }}
                        />

                        <Box
                            component={m.div}
                            animate={{
                                scale: [1, 1.2, 1.2, 1, 1],
                                rotate: [0, 270, 270, 0, 0],
                                opacity: [1, 0.25, 0.25, 0.25, 1],
                                borderRadius: ['25%', '25%', '50%', '50%', '25%'],
                            }}
                            transition={{
                                ease: 'linear',
                                duration: 3.2,
                                repeat: Infinity,
                            }}
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '25%',
                                position: 'absolute',
                                border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
                            }}
                        />
                    </RootStyle>
                );
            case 3:
                return (
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        textAlign="center"
                        sx={{
                            padding: 4,
                            backgroundColor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: (theme) => theme.customShadows?.z8,
                            maxWidth: 600,
                            mx: 'auto',
                            my: 2
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/avatars/snow-ai.png"
                            sx={{
                                width: 120,
                                height: 120,
                                mb: 3,
                                borderRadius: '50%',
                                border: (theme) => `4px solid ${theme.palette.primary.main}`,
                                boxShadow: (theme) => theme.customShadows?.z8,
                            }}
                        />

                        <CheckCircleIcon
                            sx={{
                                fontSize: 48,
                                color: 'success.main',
                                mb: 2,
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                backgroundColor: 'background.paper',
                                borderRadius: '50%',
                                padding: 0.5
                            }}
                        />

                        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            ¡Video subido con éxito! 🎉
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                            Snow está analizando tu video. Te notificaremos cuando termine la corrección.
                        </Typography>

                        <Box
                            sx={{
                                width: '100%',
                                p: 3,
                                mb: 3,
                                backgroundColor: 'background.neutral',
                                borderRadius: 1,
                                border: (theme) => `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                ¿Querés una revisión más detallada?
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Podés solicitar que un profesor de SnowMatch revise tu video usando ProChecks para obtener feedback personalizado.
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={onCloseWrapper}
                                sx={{
                                    flex: 1,
                                    textTransform: 'none',
                                    py: 1.5
                                }}
                            >
                                Más tarde
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onCloseWrapper}
                                sx={{
                                    flex: 1,
                                    textTransform: 'none',
                                    py: 1.5
                                }}
                            >
                                Solicitar Revisión
                            </Button>
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    }, [activeStep, videoCourse, videoPreviewUrl, loadingCompresor, course, _progress, isPremium]);
    if (open) {
        return (
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onCloseWrapper}
                onOpen={onOpen}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
                PaperProps={{
                    sx: {
                        height: '100%',
                        maxHeight: '100%',
                        paddingBottom: 'env(safe-area-inset-bottom)'
                    },
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ paddingTop: 'env(safe-area-inset-top)' }}>
                    <Button onClick={onCloseWrapper} sx={{
                        padding: '0px',
                        fontWeight: 'normal',
                        color: 'black',
                        textDecoration: 'underline',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                        textAlign: 'left',
                        width: '100px'
                    }}>
                        {translate('course.exercise.cancel')}
                    </Button>
                    <Typography variant="h4" align="center" sx={{ flexGrow: 1 }}>
                        {translate(`course.${level}.title`)}
                    </Typography>
                    <Box width='100px' mr={2}>

                    </Box> {/* Placeholder to balance the space */}
                </Box>
                <Box
                    sx={{
                        padding: theme.spacing(2),
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                    }}
                >
                    {/* <Box mb={2}>
                        <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box> */}

                    
                    <Drawer open={!user} onClose={onCloseWrapper} anchor="bottom" PaperProps={{
                        sx: {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                        }
                    }}>
                    {!user && <>
                        <Login fromModal={true} />
                    </>}
                    </Drawer>
                    {open && renderStep()}
                </Box>
            </SwipeableDrawer>
        )
    } else {
        return <></>
    }
}
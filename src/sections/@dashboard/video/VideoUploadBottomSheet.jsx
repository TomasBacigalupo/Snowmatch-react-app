import { Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Step, StepLabel, Stepper, SwipeableDrawer, TextField, Typography } from "@mui/material";
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
import ReactPlayer from "react-player";
import { m } from 'framer-motion';
import Logo from "src/components/Logo";

import { FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { LoadingButton } from "@mui/lab";
import { column } from "stylis";


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

export default function VideoUploadBottomSheet({ open, onClose, onOpen, course, demoUrl }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user && open) {
        navigate(PATH_AUTH.login, { replace: true });
    }

    const { translate } = useLocales();
    const steps = ['Ejercicio', 'Tu video', 'Subir'];
    const theme = useTheme();
    const [videoCourse, setVideoCourse] = useState(course);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const videoRef = useRef(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loadingCompresor, setLoadingCompresor] = useState(false)
    const [_progress, setProgress] = useState(0);

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
            '-b:v', '500k',    // Lower video bitrate
            '-b:a', '64k',     // Lower audio bitrate
            outputFileName
        ]);

        // Read the compressed file from FFmpeg's virtual filesystem
        const compressedFileData = await ffmpeg.readFile(outputFileName);

        // Convert the compressed file data back to a Blob
        const compressedBlobFile = new Blob([compressedFileData.buffer], { type: 'video/mp4' });

        console.log("compressedBlobFile", compressedBlobFile.type);

        dispatch(createVideo(compressedBlobFile, videoCourse || 'BUMPS'));
        setActiveStep(2);

    }, [selectedFile, setLoadingCompresor, setActiveStep, dispatch]);

    const resetUploadState = () => {
        setSelectedFile(null);
        setVideoPreviewUrl(null);
        setVideoDuration(0);
        setVideoCourse('');
        setActiveStep(0);
    };

    useEffect(() => {
        if (activeStep === 2 && isLoading === false) {
            setActiveStep(3);
        }
    }, [isLoading]);

    useEffect(() => {
        if (!open) {
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

    const renderStep = useCallback(() => {
        switch (activeStep) {
            case 0:
                return (
                    <Box my={2} display="flex" height='100%' flexDirection="column" justifyContent='space-between'>
                        <Box my={2} display="flex" flexDirection="column" >
                            <Box mb={2}>
                                <ReactPlayer
                                    url={demoUrl}
                                    width='100%'
                                    controls
                                />
                            </Box>
                            <Typography variant="h2" textAlign='left'>
                                {translate(`course.${course}.title`)}
                            </Typography>
                            <Typography variant="subtitle1" textAlign='left'>
                                {translate(`course.${course}.description`)}
                            </Typography>
                            <Typography variant="body1" textAlign='left'>
                                {translate(`course.${course}.fundamentals`)}
                            </Typography>
                        </Box>

                        <Button variant="contained" sx={{ py: 2, my: 2 }} fullWidth onClick={async () => {
                            await uploadVideo();
                            setActiveStep(activeStep + 1)
                        }}>
                            Start Challange
                        </Button>
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

                        {_progress > 0 &&<Box width='100%' display='felx' justifyContent="center" alignItems="center" flexDirectiob="column">
                            <LinearProgress variant="determinate" sx={{
                                width: '100%'
                            }} valueBuffer={_progress} value={_progress}/>
                            <Typography textAlign="center" variant="bory">Analizando..</Typography>
                        </Box>}

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
                            Upload
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
                        sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}
                    >
                        <CheckCircleIcon
                            sx={{ fontSize: 64, color: 'green', mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom>
                            Great job! 🎉
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Your video has been uploaded successfully. You’ll receive an email once it has been reviewed by your instructor.
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 3 }}>
                            In the meantime, feel free to explore other content or upload another video.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onCloseWrapper}
                            sx={{ textTransform: 'none' }}
                        >
                            Close
                        </Button>
                    </Box>
                );
            default:
                return null;
        }
    }, [activeStep, videoCourse, videoPreviewUrl, loadingCompresor, course, _progress]);
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
                    Cancelar
                </Button>
                <Typography variant="h4" gutterBottom align="center" sx={{ flexGrow: 1 }}>
                    Subí tu video
                </Typography>
                <Box width='100px' /> {/* Placeholder to balance the space */}
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
                <Box mb={2}>
                    <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                {renderStep()}
            </Box>
        </SwipeableDrawer>
    )
}
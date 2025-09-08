import { Button, Paper, SwipeableDrawer, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from "src/redux/store";
import { clearUploadVideoState, createVideo } from "src/redux/slices/video";
import useLocales from "src/hooks/useLocales";
import useAuth from "src/hooks/useAuth";
import { PATH_AUTH } from "src/routes/paths";
import { useNavigate } from "react-router";
import { Camera } from '@capacitor/camera';
import { VideoPicker } from '@coderpradp/capacitor-plugin-video-picker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import AcademyWelcome from 'src/sections/@dashboard/video/AcademyWelcome';

// Import step components
import { 
    ChallengeStep, 
    VideoTrimmingStep, 
    VideoUploadingStep, 
    VideoSuccessStep 
} from "./steps";


export default function VideoUploadBottomSheet({ open, onClose, onOpen, course, demoUrl }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user && open) {
        navigate(PATH_AUTH.login, { replace: true });
    }

    const { translate } = useLocales();
    const theme = useTheme();
    const [openWelcome, setOpenWelcome] = useState(false);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [loadingCompresor, setLoadingCompresor] = useState(false)
    const [_progress, setProgress] = useState(0);

    const handleCloseAcademywelcome = () => {
        setOpenWelcome(false)
    }
    const onAddToPremium = () => { }

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
            '-b:v', '600k',    // Lower video bitrate
            '-r', '30',          // Limitar a 30 FPS
            '-preset', 'fast',   // Compresión rápida pero eficiente
            '-b:a', '64k',     // Lower audio bitrate
            '-movflags', '+faststart', // Permite reproducción inmediata
            '-vf', 'scale=-2:720',  // Redimensionar a 720p manteniendo relación de aspecto
            outputFileName
        ]);

        // Read the compressed file from FFmpeg's virtual filesystem
        const compressedFileData = await ffmpeg.readFile(outputFileName);

        // Convert the compressed file data back to a Blob
        const compressedBlobFile = new Blob([compressedFileData.buffer], { type: 'video/mp4' });

        console.log("compressedBlobFile", compressedBlobFile.type);

        dispatch(createVideo(compressedBlobFile, course));
        setActiveStep(2);

    }, [selectedFile, setLoadingCompresor, setActiveStep, dispatch]);

    const resetUploadState = () => {
        setSelectedFile(null);
        setVideoPreviewUrl(null);
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
                    <ChallengeStep 
                        course={course}
                        demoUrl={demoUrl}
                        onNext={async () => {
                            await uploadVideo();
                            setActiveStep(activeStep + 1);
                        }}
                    />
                );
            case 1:
                return (
                    <VideoTrimmingStep 
                        videoPreviewUrl={videoPreviewUrl}
                        onUpload={() => {
                            setLoadingCompresor(true);
                            handleUpload();
                        }}
                        loadingCompresor={loadingCompresor}
                        progress={_progress}
                    />
                );
            case 2:
                return <VideoUploadingStep />;
            case 3:
                return <VideoSuccessStep onClose={onCloseWrapper} />;
            default:
                return null;
        }
    }, [activeStep, course, demoUrl, videoPreviewUrl, loadingCompresor, _progress, handleUpload, onCloseWrapper]);

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
                    overflowX: 'hidden', // Evita el desplazamiento horizontal
                },
            }}
        >
            <Box display="flex" alignItems="center" sx={{ paddingTop: 'env(safe-area-inset-top)', position: 'relative' }}>
                <Button onClick={onCloseWrapper} sx={{ position: 'absolute', left: 0, zIndex: 1 }}>
                    <ArrowBackIcon />
                </Button>
                <Typography variant="h4" sx={{ width: '100%', textAlign: 'center' }}>
                    {translate(`course.${course}.title`)}
                </Typography>
                <Box width='100px' sx={{ position: 'absolute', right: 16, zIndex: 1 }}>
                    {course != "GENERAL" && <Paper
                        sx={{
                            border: '2px solid', // Borde
                            backgroundColor: 'primary.dark', // Color primario oscuro
                            borderRadius: 2, // Bordes redondeados
                            px: 1, // Padding
                        }}>
                        <Typography color="white" textAlign="center" fontWeight="bold">
                            100 pts
                        </Typography>
                    </Paper>
                    }
                </Box>
            </Box>
            <Box
                sx={{
                    padding: theme.spacing(2),
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    overflowX: 'hidden', // Evita el desplazamiento horizontal
                }}
            >
                {open && renderStep()}
            </Box>
            {openWelcome && <AcademyWelcome
                open={openWelcome}
                onClose={handleCloseAcademywelcome}
                onAddToPremium={onAddToPremium}
            />}
        </SwipeableDrawer>
    )

}
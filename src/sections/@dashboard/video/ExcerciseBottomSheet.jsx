import { Button, Drawer, SwipeableDrawer, Typography } from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from "src/redux/store";
import { clearUploadVideoState, createVideo } from "src/redux/slices/video";
import { useTranslation } from "react-i18next";
import useLocales from "src/hooks/useLocales";
import useAuth from "src/hooks/useAuth";
import { PATH_AUTH } from "src/routes/paths";
import { useNavigate } from "react-router";
import { VideoEditor } from '@awesome-cordova-plugins/video-editor';
import { FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { LoadingButton } from "@mui/lab";
import Login from "src/pages/auth/Login";

// Import step components
import { 
    ExerciseStep, 
    VideoStep, 
    LocationStep, 
    CompressionStep,
    UploadingStep, 
    SuccessStep 
} from "./steps";



export default function ExcerciseBottomSheet({ open, onClose, onOpen, course, demoUrl, level }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    const { translate } = useLocales();
    const steps = ['Ejercicio', 'Tu video', 'Ubicación', 'Comprimiendo', 'Subir'];
    const theme = useTheme();
    const [videoCourse, setVideoCourse] = useState(course);

    const [openWelcome, setOpenWelcome] = useState(false);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
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


    const blobFromSelected = async (file) => {
        if (file instanceof File || file instanceof Blob) {
            return file instanceof File ? file : file;
        }
        if (file?.webPath) {
            const res = await fetch(file.webPath);
            return res.blob();
        }
        throw new Error('No valid video file');
    };

    const startCompression = useCallback(async () => {
        console.log("startCompression")
        console.log("selectedFile", selectedFile)
        setLoadingCompresor(true)
        setActiveStep(3); // Move to compression step

        const blobFile = await blobFromSelected(selectedFile);

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

        // Read the compressed file from FFmpeg's virtual filesystem
        const compressedFileData = await ffmpeg.readFile(outputFileName);

        // Convert the compressed file data back to a Blob
        const compressedBlobFile = new Blob([compressedFileData.buffer], { type: 'video/mp4' });

        console.log("compressedBlobFile", compressedBlobFile.type);

        // Move to uploading step and start upload
        setActiveStep(4);
        dispatch(createVideo(compressedBlobFile, level, latitude, longitude));

    }, [selectedFile, setLoadingCompresor, setActiveStep, dispatch, level, latitude, longitude]);

    const resetUploadState = () => {
        if (videoPreviewUrl && String(videoPreviewUrl).startsWith('blob:')) {
            URL.revokeObjectURL(videoPreviewUrl);
        }
        setSelectedFile(null);
        setVideoPreviewUrl(null);
        setVideoDuration(0);
        setVideoCourse('');
        setActiveStep(0);
        setSelectedLocation(null);
        setOpenWelcome(false);
        setLoadingCompresor(false);
        setProgress(0);
    };

    useEffect(() => {
        if (activeStep === 4 && isLoading === false) {
            setActiveStep(5);
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

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
    };

    useEffect(() => console.log("this is teh course"), [course])

    const uploadVideo = async () => {
        try {
            const file = await new Promise((resolve, reject) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.onchange = () => {
                    const f = input.files?.[0];
                    if (f) resolve(f);
                    else reject(new Error('No file selected'));
                };
                input.oncancel = () => reject(new Error('Cancelled'));
                input.click();
            });
            const url = URL.createObjectURL(file);
            setVideoPreviewUrl(url);
            setSelectedFile(file);
            setActiveStep(1); // Move to video trimming step
        } catch (error) {
            console.error('Error selecting video:', error?.message || error);
        }
    };

    console.log(course, level)

    const renderStep = useCallback(() => {
        switch (activeStep) {
            case 0:
                return (
                    <ExerciseStep 
                        onNext={uploadVideo}
                        level={level}
                    />
                );
            case 1:
                return (
                    <VideoStep 
                        videoPreviewUrl={videoPreviewUrl}
                        onUpload={() => {
                            setActiveStep(2); // Go to LocationStep instead of uploading directly
                        }}
                        loadingCompresor={loadingCompresor}
                        progress={_progress}
                    />
                );
            case 2:
                return (
                    <LocationStep 
                        onNext={() => {
                            startCompression();
                        }}
                        onBack={() => setActiveStep(1)}
                        setLatitude={setLatitude}
                        setLongitude={setLongitude}
                        onLocationSelect={handleLocationSelect}
                    />
                );
            case 3:
                return (
                    <CompressionStep 
                        progress={_progress}
                        onCancel={onCloseWrapper}
                        onBack={() => setActiveStep(2)}
                    />
                );
            case 4:
                return <UploadingStep />;
            case 5:
                return <SuccessStep onClose={onCloseWrapper} />;
            default:
                return null;
        }
    }, [activeStep, videoPreviewUrl, loadingCompresor, _progress, level, startCompression, onCloseWrapper]);
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
import { Button, FormControl, Input, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, SwipeableDrawer, TextField, Typography } from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
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

    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.video)


    const handleUpload = () => {

        dispatch(createVideo(selectedFile, videoCourse || 'BUMPS'));
        setActiveStep(2);

    };

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
            await Camera.requestPermissions()

            const _video = await VideoPicker.pick();
            const file = _video.files[0];

            if (!file) return;

            const tempVideoUrl = file.webPath;
            console.log('object url created', tempVideoUrl)
            const video = document.createElement('video');
            video.src = tempVideoUrl;

            setSelectedFile(file);
            setVideoPreviewUrl(tempVideoUrl);
            // setVideoDuration(video.duration);

            console.log("video", video)
            setSelectedFile(video)
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

    const renderStep = useCallback(() => {
        switch (activeStep) {
            case 0:
                return (
                    <Box my={2} display="flex" height='100%' flexDirection="column" justifyContent='space-between'>
                        <Box my={2} display="flex" flexDirection="column" >
                            <Box mb={2}>
                                <video
                                    src={demoUrl}
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
                            {selectedFile && videoPreviewUrl && (
                                <VideoTrimmer videoUrl={videoPreviewUrl} onTrim={handleTrim} />
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleUpload}
                            sx={{ py: 2, my: 2 }}
                            disabled={!((videoCourse && videoCourse.trim()) || course)}
                        >
                            Upload
                        </Button>

                    </Box>

                );
            case 2:
                return (
                    <Typography variant="body1" mt={2} textAlign="center">
                        Uploading...
                    </Typography>
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
    }, [activeStep, videoCourse, videoPreviewUrl, course]);
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
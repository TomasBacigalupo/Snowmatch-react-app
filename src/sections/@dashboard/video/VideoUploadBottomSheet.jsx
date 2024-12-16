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
import { UploadSingleFile } from "src/components/upload";

const MAX_VIDEO_SIZE_MB = 30; // for example, 30MB limit
const MAX_VIDEO_DURATION_SEC = 30;

const EmptyStateBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
}));

export default function VideoUploadBottomSheet({ open, onClose, onOpen, course }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user && open) {
        navigate(PATH_AUTH.login, { replace: true });
    }

    const { translate } = useLocales();
    const steps = ['Seleccionar', 'Revisar', 'Subir'];
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
        if (selectedFile && ((videoCourse && videoCourse.trim()) || course)) {
            console.log('Uploading file:', selectedFile, 'with title:', videoCourse);
            dispatch(createVideo(selectedFile, videoCourse || course));
            setActiveStep(2);
        } else {
            alert('Please select a file and enter a title');
        }
    };

    const resetUploadState = () => {
        setSelectedFile(null);
        setVideoPreviewUrl(null);
        setVideoDuration(0);
        setVideoCourse('');
        setActiveStep(0);
    };

    const handleFileSelect = useCallback((event) => {
        console.log('handleFileSelect');
        const file = event.target.files[0];
        if (!file) return; // Prevent errors if no file is selected

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
            alert('Video is too large. Max size is 30MB.');
            event.target.value = ""; // Reset the input
            return;
        }

        const tempVideoUrl = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = tempVideoUrl;

        if (video.duration > MAX_VIDEO_DURATION_SEC) {
            alert(`Video duration exceeds ${MAX_VIDEO_DURATION_SEC} seconds.`);
            event.target.value = ""; // Reset the input
            return;
        }
        setSelectedFile(file);
        setVideoPreviewUrl(tempVideoUrl);
        setVideoDuration(video.duration);
        setActiveStep(1);

        setActiveStep(1);
        // Reset the input after handling the file to allow re-selecting the same file
        event.target.value = "";
    }, [setSelectedFile, setVideoPreviewUrl, setVideoDuration]);

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

    const renderStep = useCallback(() => {
        switch (activeStep) {
            case 0:
                return (
                    <Box my={2} display="flex" flexDirection="column" alignItems="center">

                        <EmptyStateBox>
                            <Box my={2}>
                                <Typography variant="body1" textAlign="center">
                                    {translate('video_upload_bottom_sheet.upload_video')}
                                </Typography>
                                <Typography variant="body2" textAlign="center">
                                    {translate('video_upload_bottom_sheet.max_size', { size: MAX_VIDEO_SIZE_MB })}
                                </Typography>
                            </Box>
                            <Box mx={2}>
                                <label class="custom-file-upload">
                                    <input accept="video/*" type="file" onChange={handleFileSelect} style={{ display: 'none' }} />
                                    <Button variant="outlined" component="span" fullWidth>
                                        {translate('video_upload_bottom_sheet.select_video')}
                                    </Button>
                                </label>
                            </Box>
                        </EmptyStateBox>
                        <Typography mt={2} variant="body" textAlign="center">
                            {translate('video_upload_bottom_sheet.description')}
                        </Typography>
                    </Box>
                );
            case 1:
                return (
                    <>
                        {!course && <Box my={2}>
                            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                                <InputLabel id="video-course-label">Video Course</InputLabel>
                                <Select
                                    labelId="video-course-label"
                                    value={videoCourse}
                                    onChange={(e) => setVideoCourse(e.target.value)}
                                    label="Video Course"
                                    required
                                >
                                    <MenuItem value="Beginner">Beginner</MenuItem>
                                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                                    <MenuItem value="Advanced">Advanced</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>}
                        {course && <Box my={2}>
                            <Typography variant="body1" textAlign="center">
                                {course}
                            </Typography>
                        </Box>}
                        {videoPreviewUrl && (
                            <Box my={2}>
                                <video
                                    ref={videoRef}
                                    src={videoPreviewUrl}
                                    controls
                                    style={{ width: '100%', maxHeight: '300px' }}
                                />
                            </Box>
                        )}
                        <Box mt={2} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpload}
                                fullWidth={isMobile}
                                disabled={!((videoCourse && videoCourse.trim()) || course)}
                            >
                                Upload
                            </Button>
                        </Box>
                    </>
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
                            onClick={onClose}
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
            onClose={onClose}
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
                <Button onClick={onClose} sx={{
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
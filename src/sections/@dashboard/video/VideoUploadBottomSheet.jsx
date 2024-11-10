import { Button, Input, Step, StepLabel, Stepper, SwipeableDrawer, TextField, Typography } from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from "src/redux/store";
import { clearUploadVideoState, createVideo } from "src/redux/slices/video";

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

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
            alert('Video is too large. Max size is 30MB.');
            return;
        }

        const tempVideoUrl = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = tempVideoUrl;

        video.onloadedmetadata = () => {
            if (video.duration > MAX_VIDEO_DURATION_SEC) {
                alert(`Video duration exceeds ${MAX_VIDEO_DURATION_SEC} seconds.`);
                return;
            }
            setSelectedFile(file);
            setVideoPreviewUrl(tempVideoUrl);
            setVideoDuration(video.duration);
            setActiveStep(1);
        };
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

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box my={2} display="flex" flexDirection="column" alignItems="center">
                        <Input
                            accept="video/*"
                            id="contained-button-file"
                            type="file"
                            onChange={handleFileSelect}
                        />
                        <EmptyStateBox>
                            <Box my={2}>
                                <Typography variant="body1" textAlign="center">
                                    Subí tu video esquiando
                                </Typography>
                                <Typography variant="body2" textAlign="center">
                                    Subí tu video esquiando
                                </Typography>
                            </Box>
                            <Box mx={2}>
                                <label htmlFor="contained-button-file">
                                    <Button variant="outlined" component="span" fullWidth>
                                        Select Video (Max 30 seconds)
                                    </Button>
                                </label>
                            </Box>
                        </EmptyStateBox>

                    </Box>
                );
            case 1:
                return (
                    <>
                        <Typography variant="body2" mt={1} textAlign="center">
                            Selected: {selectedFile.name} ({videoDuration.toFixed(1)} seconds)
                        </Typography>
                        {!course && <Box my={2}>
                            <TextField
                                fullWidth
                                label="Video Title"
                                variant="outlined"
                                value={videoCourse}
                                onChange={(e) => setVideoCourse(e.target.value)}
                                required
                            />
                        </Box>}
                        {course && <Box my={2}>
                            <Typography variant="body1" textAlign="center">
                                {course}
                            </Typography>
                        </Box>}
                        {videoPreviewUrl && (
                            <Box my={2}>
                                <Typography variant="h6" gutterBottom align="center">
                                    Video Preview
                                </Typography>
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
            default:
                return null;
        }
    };
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
            <Box
                sx={{
                    padding: theme.spacing(2),
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                }}
            >
                <Typography variant="h4" gutterBottom align="center">
                    Subí tu video
                </Typography>
                <Box my={2}>
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
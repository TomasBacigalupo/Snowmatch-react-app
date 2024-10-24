import { Button, Divider, IconButton, Input, List, ListItem, ListItemText, Step, StepLabel, Stepper, SwipeableDrawer, TextField, Typography } from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import { GridCloseIcon } from "@mui/x-data-grid";
import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';


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

export default function VideoUploadBottomSheet({ open, onClose, onOpen, title }) {
    const steps = ['Seleccionar', 'Revisar', 'Subir'];
    const theme = useTheme();
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isVideoDetailOpen, setIsVideoDetailOpen] = useState(false);
    const [videoTitle, setVideoTitle] = useState(title);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const videoRef = useRef(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    const handleUpload = () => {
        if (selectedFile && (videoTitle.trim() || title)) {
            console.log('Uploading file:', selectedFile, 'with title:', videoTitle);
            setActiveStep(2);
            setTimeout(() => {
                alert('Video uploaded successfully!');
                resetUploadState();
                onClose();
            }, 1000);
        } else {
            alert('Please select a file and enter a title');
        }
    };

    const resetUploadState = () => {
        setSelectedFile(null);
        setVideoPreviewUrl(null);
        setVideoDuration(0);
        setVideoTitle('');
        setActiveStep(0);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];

        const tempVideoUrl = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = tempVideoUrl;

        video.onloadedmetadata = () => {
            if (video.duration <= 30) {
                setSelectedFile(file);
                setVideoPreviewUrl(tempVideoUrl);
                setVideoDuration(video.duration);
                setActiveStep(1);
            } else {
                alert('Please select a video that is 30 seconds or shorter.');
                URL.revokeObjectURL(tempVideoUrl);
            }
        };
    };

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
                        {!title && <Box my={2}>
                            <TextField
                                fullWidth
                                label="Video Title"
                                variant="outlined"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                required
                            />
                        </Box>}
                        {title && <Box my={2}>
                            <Typography variant="body1" textAlign="center">
                                {title}
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
                                disabled={!(videoTitle.trim() || title)}
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
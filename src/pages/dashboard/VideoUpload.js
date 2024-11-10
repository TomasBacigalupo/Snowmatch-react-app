import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button, Box, useMediaQuery, Stepper, Step, StepLabel, SwipeableDrawer, Container, Grid, Card, CardContent, CardMedia, List, ListItem, ListItemText, Divider, IconButton, TextField, SvgIcon, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Page from '../../components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import useLocales from 'src/hooks/useLocales';
import { PATH_GUEST } from 'src/routes/paths';
import CloseIcon from '@mui/icons-material/Close';


import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import VideoUploadBottomSheet from 'src/sections/@dashboard/video/VideoUploadBottomSheet';
import { useDispatch, useSelector } from 'src/redux/store';
import { getVideos } from 'src/redux/slices/video';
import { AnalyticsCurrentSubject, AnalyticsUserProgress } from 'src/sections/@dashboard/general/analytics';
import Markdown from 'src/components/Markdown';

const Input = styled('input')({
    display: 'none',
});

const steps = ['Seleccionar', 'Revisar', 'Subir'];
const stepsHowTo = [
    {
        label: 'Subí tu video',
        description: `Subí un video tuyo esquiando donde se pueda apreciar tu técnica.`,
    },
    {
        label: 'Espera las correcciones de un Pro',
        description:
            'Un profesor te enviará comentarios sobre tu técnica y ejercicios para mejorar.',
    },
    {
        label: 'Probalo en la pista',
        description: `Con las recomendaciones del profesor, y ejercicios para mejorar, podés volver a subir tu video y mejorar tu técnica.`,
    },
];

// Sample data for uploaded videos (now including comments)
const sampleUploadedVideos = [
    { id: 1, title: 'My First Video', status: 'Processed', url: 'https://example.com/video1.mp4', thumbnail: 'https://example.com/thumbnail1.jpg', comments: ['Great form!', 'Try to keep your back straight.'] },
    { id: 2, title: 'Practice Session', status: 'Processing', url: 'https://example.com/video2.mp4', thumbnail: 'https://example.com/thumbnail2.jpg', comments: [] },
];

const StyledUploadButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(1.5, 3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

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

export default function VideoUpload() {
    const { translate } = useLocales()
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [activeHowToStep, setActiveHowToStep] = useState(0);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoTitle, setVideoTitle] = useState('');
    const videoRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [uploadedVideos, setUploadedVideos] = useState(sampleUploadedVideos);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isVideoDetailOpen, setIsVideoDetailOpen] = useState(false);
    const [selectedLevelTitle, setSelectedLevelTitle] = useState('');

    const dispatch = useDispatch();
    const { videos } = useSelector((state) => state.video);

    useEffect(() => {
        dispatch(getVideos());
    }, [dispatch]);

    useEffect(() => {
        if (videos) {
            setUploadedVideos(videos);
            console.log('Videos:', videos);
        }
    }, [videos]);



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

    const handleUpload = () => {
        if (selectedFile && videoTitle.trim()) {
            console.log('Uploading file:', selectedFile, 'with title:', videoTitle);
            setActiveStep(2);
            setTimeout(() => {
                alert('Video uploaded successfully!');
                resetUploadState();
                setIsOpen(false);
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

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setIsVideoDetailOpen(true);
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
                        <Box my={2}>
                            <TextField
                                fullWidth
                                label="Video Title"
                                variant="outlined"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                required
                            />
                        </Box>
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
                                disabled={!videoTitle.trim()}
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


    const handleNext = () => {
        setActiveHowToStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveHowToStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveHowToStep(0);
    };

    const TrophyIcon = styled(SvgIcon)(({ theme, completed }) => ({
        color: completed ? theme.palette.grey[500] : theme.palette.warning.main,
        fontSize: '2rem',
    }));

    const Trophy = ({ level, ...props }) => (
        <SvgIcon {...props} height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
            <path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="1.5rem" fill="black">{level}</text>
        </SvgIcon>
    );

    const Level = ({ level, title, description, completed, onClick, score, minScore, maxScore }) => (
        <Grid item xs={6} sm={6} md={4} >
            <Card height='250px'>
                <Box
                    padding={2}
                    height='250px'
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent='space-between'
                    onClick={() => {
                        setSelectedLevelTitle(title)
                        onClick()
                    }}>
                    <TrophyIcon component={Trophy} level={level} completed={!completed} />
                    {completed && <Typography variant="body2" color="textSecondary">{score}</Typography>}
                    {!completed && <Typography variant="body2" color="textSecondary">IQ: {minScore} - {maxScore} </Typography>}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2">
                        {description}
                    </Typography>

                    {!completed && <Typography variant="body2"
                        sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'black' }}
                    >{translate('videoCoachScreen.completeLevel')}</Typography>}
                    {completed && <Typography variant="body2"
                        sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'black' }}
                    >{translate('videoCoachScreen.tryBetterScore')}</Typography>}
                </Box>
            </Card>
        </Grid>
    );

    const levels = [
        { level: 1, course: 'BUMPS', completed: true, score: 8 },
        { level: 2, course: 'CARVING_FUNDAMENTALS', score: 10, completed: true },
        { level: 3, course: 'PISTE_PRECISION', minScore: 5, maxScore: 10, completed: false },
        { level: 4, course: 'OFF_PISTE_BASICS', minScore: 5, maxScore: 10, completed: false },
        { level: 5, course: 'SLALOM', minScore: 5, maxScore: 10, completed: false },
        { level: 6, course: 'FREESTYLE_FUNDAMENTALS', minScore: 5, maxScore: 10, completed: false },
    ];


    const renderHowTo = () => {
        return (
            <Box sx={{ maxWidth: 400 }}>
                <Stepper activeStep={activeHowToStep} orientation="vertical">
                    {stepsHowTo.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                optional={
                                    index === steps.length - 1 ? (
                                        <Typography variant="caption">Último paso</Typography>
                                    ) : null
                                }
                            >
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                <Typography>{step.description}</Typography>
                                <Box sx={{ mb: 2 }}>
                                    {index !== steps.length - 1 ? <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Terminar' : 'Continuar'}
                                    </Button> : <Button
                                        variant="contained"
                                        onClick={() => setIsOpen(true)}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Subir Video
                                    </Button>}

                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Atrás
                                    </Button>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>All steps completed - you&apos;re finished</Typography>
                        <Button onClick={() => { }} sx={{ mt: 1, mr: 1 }}>
                            Reset
                        </Button>
                    </Paper>
                )}
            </Box>
        )
    }
    const [tab, setTab] = useState('profile');
    const handleChange = (event, newCategory) => {
        setTab(newCategory);
    }
    if (tab === 'profile') {
        return (
            <Page title="My Progress">
                <Container>
                    <ToggleButtonGroup
                        color="primary"
                        value={tab}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                        sx={{
                            width: '100%',
                            borderRadius: 10,
                            justifyContent: 'space-between',
                        }}
                    >
                        <ToggleButton
                            value="profile"
                            sx={{
                                width: '100%',
                                borderRadius: 15,
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                '&.MuiButtonBase-root': {
                                    borderRadius: '100px !important',
                                },
                            }}
                        >
                            {translate('videoCoachScreen.profile')}
                        </ToggleButton>
                        <ToggleButton
                            value="uploaded"
                            sx={{
                                width: '100%',
                                borderRadius: 15,
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                '&.MuiButtonBase-root': {
                                    borderRadius: '100px !important',
                                },
                            }}
                        >
                            {translate('videoCoachScreen.uploaded_videos')}
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <AnalyticsUserProgress />
                    {/* Updated section for displaying uploaded videos or message */}

                    <Grid container spacing={1} justifyContent='space-between'>
                        {levels.map((level) => (
                            <Level
                                key={level.course}
                                level={level.level}
                                title={translate(`course.${level.course}.title`)}
                                description={translate(`course.${level.course}.description`)}
                                completed={level.completed}
                                onClick={() => {
                                    setOpen(true);
                                }}
                                score={level.score}
                                minScore={level.minScore}
                                maxScore={level.maxScore}
                            />
                        ))}
                    </Grid>

                </Container>

                <SwipeableDrawer
                    anchor="bottom"
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    onOpen={() => setIsOpen(true)}
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

                {/* Updated SwipeableDrawer for video details */}
                <SwipeableDrawer
                    anchor="bottom"
                    open={isVideoDetailOpen}
                    onClose={() => setIsVideoDetailOpen(false)}
                    onOpen={() => setIsVideoDetailOpen(true)}
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
                        {selectedVideo && (
                            <>
                                <Box display="flex" justifyContent="flex-end" mb={2}>
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        onClick={() => setIsVideoDetailOpen(false)}
                                        aria-label="close"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="h4" gutterBottom align="center">
                                    {selectedVideo.title}
                                </Typography>
                                <Box my={2}>
                                    <video
                                        src={'https://s3.us-east-1.amazonaws.com/dev.videos.snowmatch.pro/' + selectedVideo.videoUrl}
                                        controls
                                        style={{ width: '100%', maxHeight: '300px' }}
                                    />
                                </Box>
                                <Typography variant="h6" gutterBottom>
                                    Score: {selectedVideo.score}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Comments:
                                </Typography>
                                <List>
                                    {selectedVideo.comments?.length > 0 ? (
                                        selectedVideo.comments.map((comment, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem>
                                                    <ListItemText primary={comment} />
                                                </ListItem>
                                                {index < selectedVideo.comments.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <ListItem>
                                            <ListItemText primary="No comments yet." />
                                        </ListItem>
                                    )}
                                </List>
                            </>
                        )}
                    </Box>
                </SwipeableDrawer>
                <VideoUploadBottomSheet
                    title={selectedLevelTitle}
                    onOpen={() => setOpen(true)}
                    open={open}
                    onClose={() => setOpen(false)} />
            </Page>
        );
    }

    return (
        <Page title="My Progress">
            <Container>
                <ToggleButtonGroup
                    color="primary"
                    value={tab}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    sx={{
                        width: '100%',
                        borderRadius: 10,
                        justifyContent: 'space-between',
                    }}
                >
                    <ToggleButton
                        value="profile"
                        sx={{
                            width: '100%',
                            borderRadius: 15,
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            '&.MuiButtonBase-root': {
                                borderRadius: '100px !important',
                            },
                        }}
                    >
                        {translate('videoCoachScreen.profile')}
                    </ToggleButton>
                    <ToggleButton
                        value="uploaded"
                        sx={{
                            width: '100%',
                            borderRadius: 15,
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            '&.MuiButtonBase-root': {
                                borderRadius: '100px !important',
                            },
                        }}
                    >
                        {translate('videoCoachScreen.uploaded_videos')}
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Updated section for displaying uploaded videos or message */}
                <Box >
                    {uploadedVideos?.filter(video => !video?.reviewed)?.length > 0 && (
                        <Box my={2}>
                            <Typography variant="h6" mt={4}>
                                {translate(`videoCoachScreen.videosPending`)}
                            </Typography>
                        </Box>
                    )}
                    {uploadedVideos?.filter(video => !video?.reviewed)?.length > 0 && (
                        <Grid container spacing={3}>
                            {uploadedVideos?.filter(video => !video?.reviewed).map((video) => (
                                <Grid item xs={12} sm={6} md={4} key={video.id}>
                                    <StyledCard onClick={() => handleVideoClick(video)}>
                                        <CardMedia
                                            component="div"
                                            height="140"
                                            image={video.videoUrl}
                                            alt={video.title}
                                        >
                                            <video
                                                src={'https://s3.us-east-1.amazonaws.com/dev.videos.snowmatch.pro/' + video.videoUrl}
                                                style={{ width: '100%', maxHeight: 140, objectFit: 'cover' }}
                                            />
                                        </CardMedia>
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1">
                                                {translate(`course.${video.course}.title`)}
                                            </Typography>
                                            {video.reviewed && (<Typography variant="body2" color="text.secondary">
                                                {translate(`videoCoachScreen.score`)} {video.score}
                                            </Typography>)}
                                            {!video.reviewed && (<Typography variant="body2" color="text.secondary">
                                                {translate(`videoCoachScreen.waiting_review`)}
                                            </Typography>)}
                                        </CardContent>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    {uploadedVideos?.length === 0 && (
                        <Box textAlign="center" mt={4}>
                            <Typography variant="h6">
                                No videos uploaded yet.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpen(true)}
                                sx={{ mt: 2 }}
                            >
                                Upload a Video
                            </Button>
                        </Box>
                    )}

                    {uploadedVideos?.filter(video => video?.reviewed)?.length > 0 && (
                        <Box my={2}><Typography variant="h6" mt={4}>
                            Videos Calificados
                        </Typography>
                        </Box>
                    )}
                    {uploadedVideos?.filter(video => video?.reviewed)?.length > 0 && (
                        <Grid container spacing={3}>
                            {uploadedVideos.map((video) => (
                                <Grid item xs={12} sm={6} md={4} key={video.id}>
                                    <StyledCard onClick={() => handleVideoClick(video)}>
                                        <CardMedia
                                            component="div"
                                            height="140"
                                            image={video.videoUrl}
                                            alt={video.title}
                                        >
                                            <video
                                                src={'https://s3.us-east-1.amazonaws.com/dev.videos.snowmatch.pro/' + video.videoUrl}
                                                style={{ width: '100%', maxHeight: 140, objectFit: 'cover' }}
                                            />
                                        </CardMedia>
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1">
                                                {translate(`course.${video.course}.title`)}
                                            </Typography>
                                            {video.reviewed && (<Typography variant="body2" color="text.secondary">
                                                {translate(`videoCoachScreen.score`)} {video.score}
                                            </Typography>)}
                                            {!video.reviewed && (<Typography variant="body2" color="text.secondary">
                                                {translate(`videoCoachScreen.waiting_review`)}
                                            </Typography>)}
                                        </CardContent>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Container>
            {/* Updated SwipeableDrawer for video details */}
            <SwipeableDrawer
                anchor="bottom"
                open={isVideoDetailOpen}
                onClose={() => setIsVideoDetailOpen(false)}
                onOpen={() => setIsVideoDetailOpen(true)}
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
                    {selectedVideo && (
                        <>
                            <Box display="flex" justifyContent="flex-end" mb={2}>
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={() => setIsVideoDetailOpen(false)}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Typography variant="h4" gutterBottom align="center">
                                {translate(`course.${selectedVideo.course}.title`)}
                            </Typography>
                            <Box my={2}>
                                <video
                                    src={'https://s3.us-east-1.amazonaws.com/dev.videos.snowmatch.pro/' + selectedVideo.videoUrl}
                                    controls
                                    style={{ width: '100%', maxHeight: '300px' }}
                                />
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {translate('videoCoachScreen.score')} {selectedVideo.score}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {translate('videoCoachScreen.review')}
                            </Typography>
                            <Markdown>
                                {selectedVideo.comment}
                            </Markdown>
                        </>
                    )}
                </Box>
            </SwipeableDrawer>
            <VideoUploadBottomSheet
                title={selectedLevelTitle}
                onOpen={() => setOpen(true)}
                open={open}
                onClose={() => setOpen(false)} />
        </Page>
    );

}
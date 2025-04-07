import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button, Box, useMediaQuery, Stepper, Step, StepLabel, SwipeableDrawer, Container, Grid, Card, CardContent, CardMedia, List, ListItem, ListItemText, Divider, IconButton, TextField, SvgIcon, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Page from '../../components/Page';
import { useSearchParams } from 'react-router-dom';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import useLocales from 'src/hooks/useLocales';
import { PATH_DASHBOARD, PATH_GUEST } from 'src/routes/paths';
import CloseIcon from '@mui/icons-material/Close';


import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import VideoUploadBottomSheet from 'src/sections/@dashboard/video/VideoUploadBottomSheet';
import { useDispatch, useSelector } from 'src/redux/store';
import { getVideos } from 'src/redux/slices/video';
import { AnalyticsCurrentSubject, AnalyticsUserProgress } from 'src/sections/@dashboard/general/analytics';
import Markdown from 'src/components/Markdown';
import Breadcrumbs from 'src/components/Breadcrumbs';
import ReactPlayer from 'react-player';

const Input = styled('input')({
    display: 'none',
});

const steps = ['Seleccionar', 'Revisar', 'Subir'];

const courseLevels = {
    'PIST': [
        { course: 'PIST_1', level: 1, title: 'Principiante', description: 'Aprender a esquiar en pista', completed: true, score: 8, demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov' },
        { course: 'PIST_2', level: 2, title: 'Intermedio', description: 'Clavado de bastón', completed: true, score: 10, demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Tip_Como+hacer+el+clavado+de+baston.mp4' },
        { course: 'PIST_3', level: 3, title: 'Avanzado', description: 'Dominar técnica en pista', completed: false },
    ],
    'BUMPS': [
        { course: 'BUMPS_1', level: 1, title: 'Principiante', description: 'Aprender a esquiar en bumps', completed: false },
        { course: 'BUMPS_2', level: 2, title: 'Intermedio', description: 'Mejorar técnica en bumps', completed: false },
        { course: 'BUMPS_3', level: 3, title: 'Avanzado', description: 'Dominar técnica en bumps', completed: false },
    ],
    'FREE_RIDE': [
        { course: 'FREE_RIDE_1', level: 1, title: 'Principiante', description: 'Aprender a esquiar en free ride', completed: false },
        { course: 'FREE_RIDE_2', level: 2, title: 'Intermedio', description: 'Mejorar técnica en free ride', completed: false },
        { course: 'FREE_RIDE_3', level: 3, title: 'Avanzado', description: 'Dominar técnica en free ride', completed: false },
    ],
    'FREE_STYLE': [
        { course: 'FREE_STYLE_1', level: 1, title: 'Principiante', description: 'Aprender a esquiar en free style', completed: false },
        { course: 'FREE_STYLE_2', level: 2, title: 'Intermedio', description: 'Mejorar técnica en free style', completed: false },
        { course: 'FREE_STYLE_3', level: 3, title: 'Avanzado', description: 'Dominar técnica en free style', completed: false },
    ],
};

// Sample data for uploaded videos (now including comments)
const sampleUploadedVideos = [
    { id: 1, title: 'My First Video', status: 'Processed', url: 'https://example.com/video1.mp4', thumbnail: 'https://example.com/thumbnail1.jpg', comments: ['Great form!', 'Try to keep your back straight.'] },
    { id: 2, title: 'Practice Session', status: 'Processing', url: 'https://example.com/video2.mp4', thumbnail: 'https://example.com/thumbnail2.jpg', comments: [] },
];



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

export default function CourseLevels() {

    const [searchParams] = useSearchParams();

    // Get query parameter by key
    const course = searchParams.get("course");

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
    const [selectedCourse, setSelectdCourse] = useState('');





    const dispatch = useDispatch();
    const { videos } = useSelector((state) => state.video);

    useEffect(() => {
        dispatch(getVideos());
    }, [dispatch]);

    useEffect(() => {
        if (videos && videos.length > 0) {
            setUploadedVideos(videos);
            console.log('Videos:', videos);
            let _levels = levels;
            videos.forEach((video) => {
                if (video.score > 0) {
                    _levels = _levels.map((level) => {
                        if (level.course === video.course) {
                            return { ...level, completed: true, score: video.score };
                        }
                        return level;
                    });
                } else {
                    _levels = _levels.map((level) => {
                        if (level.course === video.course) {
                            return { ...level, completed: false, status: 'PENDING', score: video.score };
                        }
                        return level;
                    });
                }
            });
            setLevels(_levels);
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
                                <ReactPlayer
                                    url={videoPreviewUrl}
                                    controls
                                    playing={false}
                                    light={true}
                                    width="100%"
                                    height="auto"
                                    maxHeight="300px"
                                />
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

    const Level = ({ course, level, title, description, completed, onClick, score, minScore, maxScore, status }) => (
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
                        if (status != "PENDING") {
                            setSelectedLevelTitle(title)
                            setSelectdCourse(course)
                            onClick()
                        }
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

                    {!completed && status != 'PENDING' && <Typography variant="body2"
                        sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'black' }}
                    >{translate('videoCoachScreen.completeLevel')}</Typography>}
                    {!completed && status === 'PENDING' && <Typography variant="body2"
                        sx={{ color: 'black' }}
                    >{translate('videoCoachScreen.pendingReview')}</Typography>}
                    {completed && <Typography variant="body2"
                        sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'black' }}
                    >{translate('videoCoachScreen.tryBetterScore')}</Typography>}
                </Box>
            </Card>
        </Grid>
    );

    const [levels, setLevels] = useState([
        { level: 1, course: 'PIST', completed: false, score: 8 },
        { level: 2, course: 'BUMPS', score: 10, minScore: 0, maxScore: 100, completed: false },
        { level: 3, course: 'FREE_RIDE', minScore: 0, maxScore: 100, completed: false, },
        { level: 4, course: 'FREE_STYLE', minScore: 0, maxScore: 100, completed: false, },
    ]);

    const [tab, setTab] = useState('profile');
    const [demoUrl, setDemoUrl] = useState('');

    return (
        <Page title="My Progress">

            <Container>
                <HeaderBreadcrumbs
                    heading={translate(`course.${course}.title`)}
                    links={[
                        {
                            name: translate(`progress.title`),
                            href: PATH_DASHBOARD.root,
                        },
                        { name: translate(`course.${course}.title`) },
                    ]}
                />
                {/* Updated section for displaying uploaded videos or message */}
                <Grid container spacing={1} justifyContent='space-between'>
                    {courseLevels[course].map((level) => (
                        <Level
                            course={level.course}
                            key={level.course}
                            level={level.level}
                            title={translate(`course.${level.course}.title`)}
                            description={translate(`course.${level.course}.description`)}
                            completed={level.completed}
                            onClick={() => {
                                setDemoUrl(level.demoUrl);
                                setOpen(true);
                            }}
                            score={level.score}
                            minScore={level.minScore}
                            maxScore={level.maxScore}
                            status={level.status}
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
                                    src={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${selectedVideo.videoUrl}`}
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
                demoUrl={demoUrl}
                title={selectedLevelTitle}
                course={selectedCourse}
                onOpen={() => setOpen(true)}
                open={open}
                onClose={() => setOpen(false)} />
        </Page>
    );




}
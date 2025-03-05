import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button, Box, useMediaQuery, Container, Grid, Card, CardContent, CardMedia, TextField, SvgIcon, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Page from '../../components/Page';
import useLocales from 'src/hooks/useLocales';

import VideoUploadBottomSheet from 'src/sections/@dashboard/video/VideoUploadBottomSheet';
import { useDispatch, useSelector } from 'src/redux/store';
import { getVideos } from 'src/redux/slices/video';
import { AnalyticsUserProgress, AnalyticsWidgetSummary } from 'src/sections/@dashboard/general/analytics';
import { useNavigate } from 'react-router-dom';
import VideoReviewedBottomSheet from 'src/sections/@dashboard/video/VideoReviewedBottomSheet';
import PerformanceChart from 'src/sections/@dashboard/general/analytics/PerformanceChart';
import AnalyticsChallangeWidget from 'src/sections/@dashboard/general/analytics/AnalyticsChallangeWidget';
import LeaderBoardRightDrawer from 'src/sections/@dashboard/video/LeaderBoardRightDrawer';
import { buyProduct, getProducts } from 'src/services/inAppPurchaseService'
import PremiumContainer from 'src/sections/payment/Premiumcontainer';
// ----------------------------------------------------------------------



const Input = styled('input')({
    display: 'none',
});

const userScores = [
    { date: "2024-02-10", score: 85 },
    { date: "2024-02-12", score: 80 },
    { date: "2024-02-15", score: 70 },
    { date: "2024-02-18", score: 60 },
    { date: "2024-02-20", score: 55 },
];

const allScores = [95, 85, 75, 65, 55, 50, 45, 40, 35, 30, 25, 20];

const sampleUploadedVideos = [
    { id: 1, title: 'My First Video', status: 'Processed', url: 'https://example.com/video1.mp4', thumbnail: 'https://example.com/thumbnail1.jpg', comments: ['Great form!', 'Try to keep your back straight.'] },
    { id: 2, title: 'Practice Session', status: 'Processing', url: 'https://example.com/video2.mp4', thumbnail: 'https://example.com/thumbnail2.jpg', comments: [] },
];

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
    const [isLeaderBoardOpen, setIsLeaderBoardOpen] = useState(false);
    const [selectedLevelTitle, setSelectedLevelTitle] = useState('');
    const [selectedCourse, setSelectdCourse] = useState('');
    const [selectedChallange, setSelectedChallenge] = useState('');
    const navigate = useNavigate();

    const [bestCarvingChallange, setBestCarvingChallange] = useState(45);
    const [carvingChallangeResults, setCarvingChallangeResults] = useState([50, 80, 120, 150, 200, 180, 140]);

    const [bestBumpsChallange, setBestBumpsChallange] = useState(35);
    const [bumpsChallangeResults, setBumpsChallangeResults] = useState([50, 80, 120, 150, 200, 180, 140]);


    const dispatch = useDispatch();
    const { videos } = useSelector((state) => state.video);


    useEffect(() => {
        dispatch(getVideos());
    }, [dispatch]);

    useEffect(() => {
        if (videos) {

            setCarvingChallangeResults(videos.filter(v => v.course === "AI_CHALLANGE_1").sort((a, b) => a.id - b.id) // Sort by video.id in ascending order
                .map(v => v.score));
            const bestScore = Math.max(...videos.filter(v => v.course === "AI_CHALLANGE_1").map(v => v.score));
            setBestCarvingChallange(bestScore || 0);

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

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setIsVideoDetailOpen(true);
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
    const CircularProgressWithLabel = ({ value }) => (
        <Box position="relative" display="inline-flex">
            <CircularProgress size={80} variant="determinate" value={value} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
    const Level = ({ course, level, title, description, completed, onClick, score, minScore, maxScore, status, progress }) => {

        return (
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <Box
                        padding={2}

                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                    // onClick={() => {
                    //     navigate(`/match/videoCoach/courses?course=${course}`);
                    // }}
                    >
                        <Box display="flex"
                            height='100%'
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center">
                            <CircularProgressWithLabel value={progress} />

                        </Box>
                        {/* <TrophyIcon component={Trophy} level={level} completed={!completed} /> */}

                        <Box
                            paddingLeft={2}
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="flex-start"
                        // onClick={() => {
                        //     navigate(`/match/videoCoach/courses?course=${course}`);
                        // }}
                        >
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                {title}
                            </Typography>
                            <Typography variant="body2">{description}</Typography>
                        </Box>

                    </Box>
                </Card>
            </Grid>
        );
    };

    const [levels, setLevels] = useState([
        { level: 1, course: 'CARVING', completed: false, score: 8, progress: 10 },
        { level: 2, course: 'BUMPS', score: 10, minScore: 0, maxScore: 100, progress: 39, completed: false },
        { level: 3, course: 'SHORT_TURNS', minScore: 0, maxScore: 100, progress: 86, completed: false, },
        { level: 4, course: 'FREE_STYLE', minScore: 0, maxScore: 100, progress: 33, completed: false, },
    ]);

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

                    {/* Updated section for displaying uploaded videos or message */}

                    <Grid container spacing={1} justifyContent='space-between'>
                        <Grid item><LeaderBoardRightDrawer
                            open={isLeaderBoardOpen}
                            onClose={() => setIsLeaderBoardOpen(false)}
                            onOpen={() => setIsLeaderBoardOpen(true)}
                            selectedChallange={selectedChallange}
                            course={"AI_CHALLANGE_1"}
                        /></Grid>
                        <Grid item xs={12}>
                            <AnalyticsChallangeWidget title="Carving Challange" total={bestCarvingChallange} chartData={carvingChallangeResults} onLeaderboardClick={() => setIsLeaderBoardOpen(true)} />
                        </Grid>
                        {/* muy bueno pero no tiene uso hoy: <PerformanceChart userScores={userScores} allScores={allScores} userScore={55} /> */}
                        {/* <Grid item xs={12}>
                            <AnalyticsUserProgress />
                        </Grid> */}
                        {levels.map((level) => (
                            <Level
                                course={level.course}
                                key={level.course}
                                level={level.level}
                                title={translate(`course.${level.course}.title`)}
                                description={translate(`course.${level.course}.description`)}
                                completed={level.completed}
                                onClick={() => {
                                    navigate(`/`);
                                    // setOpen(true);
                                }}
                                score={level.score}
                                minScore={level.minScore}
                                maxScore={level.maxScore}
                                status={level.status}
                                progress={level.progress}
                            />
                        ))}
                    </Grid>
                </Container>

                <VideoUploadBottomSheet
                    title={selectedLevelTitle}
                    course={selectedCourse}
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
                <Box>
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
                                        <CardMedia component="div">
                                            {console.log("preview del video", `${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video.videoUrl}.jpg`)}
                                            <img
                                                src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video.videoUrl}.jpg`}
                                                height="140"
                                                style={{ width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                controls={false}
                                                muted
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
                            {uploadedVideos.filter(video => video?.reviewed).map((video) => (
                                <Grid item xs={12} sm={6} md={4} key={video.id}>
                                    <StyledCard onClick={() => handleVideoClick(video)}>
                                        <CardMedia component="div">
                                            <img
                                                src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video.videoUrl}.jpg`}
                                                height="140"
                                                style={{ width: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                controls={false}
                                                muted
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
            <VideoReviewedBottomSheet
                open={isVideoDetailOpen}
                onClose={() => setIsVideoDetailOpen(false)}
                onOpen={() => setIsVideoDetailOpen(true)}
                selectedVideo={selectedVideo}
            />
        </Page>
    );

}
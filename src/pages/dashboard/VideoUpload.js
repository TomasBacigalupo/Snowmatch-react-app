import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button, Box, useMediaQuery, Container, Grid, Card, CardContent, CardMedia, TextField, SvgIcon, ToggleButtonGroup, ToggleButton, CircularProgress, CardActions, Paper, IconButton } from '@mui/material';
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
import useAuth from 'src/hooks/useAuth';
import { Help, HelpOutline } from '@mui/icons-material';
import LastVideo from 'src/sections/@dashboard/video/LastVideo';
import ProCheckBox from 'src/sections/@dashboard/video/ProCheckBox';
import LatestTips from 'src/sections/@dashboard/video/LatestTips';
import VideoDemo from 'src/sections/@dashboard/video/VideoDemo';
import UploadedVideosList from 'src/sections/@dashboard/video/UploadedVideosList';
import StyledContainer from 'src/sections/@dashboard/video/StyledContainer';
import VideoToggleView from 'src/sections/@dashboard/video/VideoToggleView';
import SkiProgressBox from 'src/sections/@dashboard/video/SkiProgressBox';
import MapLeaderboard from 'src/sections/@dashboard/general/app/MapLeaderboard';

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

    const [showHeader, setShowHeader] = useState(false);

    useEffect(() => {
        if (!videos || videos.length === 0) {
            dispatch(getVideos());
        }
    }, [dispatch]);

    useEffect(() => {
        if (videos && videos.length > 0) {
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

    useEffect(() => {
        const handleScroll = () => {
            const show = window.scrollY > 100;
            setShowHeader(show);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setIsVideoDetailOpen(true);
    };



    const [levels, setLevels] = useState([
        { level: 1, course: 'CARVING', completed: false, score: 8, progress: 10 }
    ]);

    const [tab, setTab] = useState('profile');
    const handleChange = (event, newCategory) => {
        setTab(newCategory);
    }


    return (
        <Page title="My Progress">
            <Container
                sx={{
                    overflowX: 'hidden',
                    maxWidth: '100%',
                    pt: 0,
                    mt: 0
                }}
            >
                {videos?.length > 0 && <Box className="white-card">
                    <VideoToggleView
                        videos={videos}
                        tab={tab}
                        onTabChange={handleChange}
                    />
                </Box>}

                {tab === 'profile' ?
                    <StyledContainer>
                        <Grid container spacing={1} justifyContent='space-between' padding={0}>
                    
                                     <LeaderBoardRightDrawer
                                open={isLeaderBoardOpen}
                                onClose={() => setIsLeaderBoardOpen(false)}
                                onOpen={() => setIsLeaderBoardOpen(true)}
                                selectedChallange={selectedChallange}
                                course={"AI_CHALLENGE_1"}
                            />
                            {!videos || videos.length === 0 && (
                                <Grid item xs={12} sx={{
                                    pt: 0,
                                    '&.MuiGrid-item': {
                                        paddingTop: '0 !important'
                                    }
                                }}>
                                    <VideoDemo />
                                </Grid>
                            )}
                            {videos && videos.length > 0 &&carvingChallangeResults && carvingChallangeResults.length > 0 && (
                                <Grid item xs={12}>
                                    <Box className="white-card">
                                        <AnalyticsChallangeWidget
                                            title="Carving Challange"
                                            total={bestCarvingChallange}
                                            chartData={carvingChallangeResults}
                                            onLeaderboardClick={() => setIsLeaderBoardOpen(true)}
                                        />
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Box className="white-card">
                                    <ProCheckBox />
                                </Box>
                            </Grid>

                            {videos && videos.length > 0 && (
                                <Grid item xs={12}>
                                    <Box className="white-card">
                                        <LastVideo
                                            video={[...videos]
                                                .sort((a, b) => b.id - a.id)
                                                .slice(0, 1)[0]}
                                        />
                                    </Box>
                                </Grid>
                            )}
                            {videos && (
                                <Grid item xs={12}>
                                    <Box className="white-card">
                                        <LatestTips
                                            videos={[...videos]}
                                        />
                                    </Box>
                                </Grid>
                            )}
                            <Box sx={{width:'100%'}} onClick={() => setIsLeaderBoardOpen(true)}>
                                                        <MapLeaderboard />
                                                        </Box>

                        </Grid>
                    </StyledContainer> : <UploadedVideosList
                        videos={uploadedVideos}
                        onVideoClick={handleVideoClick}
                        showHeader={showHeader}
                    />}

                <VideoUploadBottomSheet
                    title={selectedLevelTitle}
                    course={selectedCourse}
                    onOpen={() => setOpen(true)}
                    open={open}
                    onClose={() => setOpen(false)}
                />

                <VideoReviewedBottomSheet
                    open={isVideoDetailOpen}
                    onClose={() => setIsVideoDetailOpen(false)}
                    onOpen={() => setIsVideoDetailOpen(true)}
                    selectedVideo={selectedVideo}
                />
            </Container>
        </Page>
    );
}
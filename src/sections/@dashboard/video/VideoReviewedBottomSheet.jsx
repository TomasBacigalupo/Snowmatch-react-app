import React, { useEffect, useState } from "react";
import { Avatar, Box, IconButton, Divider, Typography, SwipeableDrawer, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactPlayer from "react-player";
import Markdown from "src/components/Markdown";
import useLocales from "src/hooks/useLocales";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "src/redux/store";
import { proCheck, videoExists } from "src/redux/slices/video";
import { useSelector } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import Logo from "src/components/Logo";
import ReviewRequestBox from "./ReviewRequestBox";
import { VideoReviewStatus } from "./VideoReviewStatus";
import VideoAnalyticsChart from "./VideoAnalyticsChart";
import SnowMatchIntelligenceBox from "./SnowMatchIntelligenceBox";
import { useSnackbar } from "notistack";
import MobileHeader from "src/components/MobileHeader";

export default function VideoReviewedBottomSheet({ open, onClose, onOpen, selectedVideo }) {
    const theme = useTheme();
    const { translate } = useLocales();
    const [isPlaying, setIsPlaying] = useState(false);
    const dispatch = useDispatch();
    const { analizeExists, isLoadingExists } = useSelector(state => state.video);
    const [isProCheckRequested, setIsProCheckRequested] = useState(selectedVideo?.isProCheckRequested);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (selectedVideo) {
            setIsProCheckRequested(selectedVideo.proCheck)
            console.log(selectedVideo);
            dispatch(videoExists("snowmatchvideosanalisados", `videos_analizados/${selectedVideo.videoUrl}.mp4`))
        }
    }, [selectedVideo]);

    useEffect(() => {
        console.log("analizeExistsa", analizeExists);
        console.log("isLoadingExists", isLoadingExists)
    }, [analizeExists, isLoadingExists])

    const handleRequestProCheck = () => {
        dispatch(proCheck(selectedVideo.id))
        setIsProCheckRequested(true);
        enqueueSnackbar(translate('notifications.procheck_requested'))
    }

    return (
        <SwipeableDrawer
            anchor="right"
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
                    paddingTop: 'env(safe-area-inset-bottom)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                    width: '100vw',
                    maxWidth: '100%',
                },
            }}
        >
            {selectedVideo && (
                <MobileHeader onBack={onClose} title={translate(`course.${selectedVideo.course}.title`)}/>
            )}
            <Box
                sx={{
                    width: '100vw',
                    maxWidth: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                }}
            >
                {selectedVideo && (
                    <>
                        {/* Video */}
                        <Box mb={2}>
                            {!isPlaying ? (
                                <Box
                                    position="relative"
                                    width="100%"
                                    maxHeight="300px"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setIsPlaying(true)}
                                >
                                    {/* Thumbnail Image */}
                                    <Box
                                        component="img"
                                        src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${selectedVideo.videoUrl}.jpg`}
                                        alt="Video Thumbnail"
                                        sx={{
                                            width: "100%",
                                            maxHeight: "300px",
                                            objectFit: "cover",
                                        }}
                                    />
                                    {/* Play Button Overlay */}
                                    <Box
                                        position="absolute"
                                        top="50%"
                                        left="50%"
                                        sx={{
                                            transform: "translate(-50%, -50%)",
                                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                                            borderRadius: "50%",
                                            width: "60px",
                                            height: "60px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <PlayArrowIcon sx={{ fontSize: 40, color: "white" }} />
                                    </Box>
                                </Box>
                            ) : (
                                <ReactPlayer
                                    url={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${selectedVideo.videoUrl}`}
                                    playing={isPlaying}
                                    controls
                                    style={{ maxHeight: '300px', maxWidth: '100%', }}
                                    onPause={() => setIsPlaying(false)}
                                    onPlay={() => setIsPlaying(true)}
                                />
                            )}
                        </Box>
                        <Box p={2}>
                            {/* Score - Updated with circular design */}
                            <Box 
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 3,
                                    backgroundColor: theme.palette.background.neutral,
                                    borderRadius: 2,
                                    p: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        background: `conic-gradient(${theme.palette.primary.main} ${selectedVideo.score}%, ${theme.palette.grey[200]} 0)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            width: '85%',
                                            height: '85%',
                                            borderRadius: '50%',
                                            background: theme.palette.background.paper,
                                        }
                                    }}
                                >
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            position: 'relative',
                                            fontWeight: 'bold',
                                            color: theme.palette.primary.main 
                                        }}
                                    >
                                        {parseInt(selectedVideo.score, 10)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                                        {translate('videoCoachScreen.score')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {selectedVideo.score >= 80 ? translate('videoCoachScreen.excellentPerformance') :
                                         selectedVideo.score >= 60 ? translate('videoCoachScreen.goodPerformance') :
                                         translate('videoCoachScreen.needsImprovement')}
                                    </Typography>
                                </Box>
                            </Box>

                            {selectedVideo.analysisData && <VideoAnalyticsChart turnData={selectedVideo.analysisData} />}

                            {/* Revisor */}
                            {selectedVideo.reviewer && (
                                <>
                                    <Divider sx={{ my: 2 }} />

                                    {/* Info del reviewer */}
                                    <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                        <Avatar src={selectedVideo.reviewer.imageLink} sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
                                            {selectedVideo.reviewer.name[0]}
                                            {selectedVideo.reviewer.lastname[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6">
                                                {selectedVideo.reviewer.name} {selectedVideo.reviewer.lastname}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {translate("teacher.level")} {selectedVideo.reviewer.level}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Comentario estilo chat */}
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.grey[200],
                                            padding: theme.spacing(2),
                                            borderRadius: 2,
                                            alignSelf: 'flex-start',
                                            width: "100%"
                                        }}
                                    >
                                        <Markdown
                                            components={{
                                                h1: (props) => <Typography variant="h6" {...props} />,
                                                h2: (props) => <Typography variant="h6" {...props} />,
                                                h3: (props) => <Typography variant="h6" {...props} />,
                                                h4: (props) => <Typography variant="h6" {...props} />,
                                                h5: (props) => <Typography variant="h6" {...props} />,
                                                h6: (props) => <Typography variant="h6" {...props} />,
                                                ul: (props) => <ul style={{ listStyleType: 'disc', marginLeft: '1px' }} {...props} />,
                                                li: (props) => <li style={{ fontSize: '14px', marginLeft: '1px', marginTop: '5px' }} {...props} />,
                                            }}
                                        >
                                            {selectedVideo.comment}
                                        </Markdown>
                                    </Box>
                                </>
                            )}
                        </Box>

                        <SnowMatchIntelligenceBox video={selectedVideo} />

                        {!selectedVideo.proCheck && !isProCheckRequested && !selectedVideo.reviewed && <Box marginTop={5}>
                            <ReviewRequestBox onRequestReview={handleRequestProCheck} />
                        </Box>}
                        {(isProCheckRequested) && !selectedVideo.reviewed && <Box>
                            <VideoReviewStatus
                                proCheck={isProCheckRequested}
                                reviewed={selectedVideo.reviewed}
                                onRequestReview={handleRequestProCheck}
                            />
                        </Box>}
                    </>
                )}
            </Box>
        </SwipeableDrawer>
    );
}
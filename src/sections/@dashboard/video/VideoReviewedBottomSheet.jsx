import React, { useEffect, useState } from "react";
import { Avatar, Box, IconButton, Divider, Typography, SwipeableDrawer, Button, CircularProgress } from "@mui/material";
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
    const [isVideoLoading, setIsVideoLoading] = useState(true);
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

    const handleVideoLoad = () => {
        setIsVideoLoading(false);
    };

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
                <MobileHeader onBack={onClose} title={translate(`Video comments`)} />
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
                        <Box position="relative">
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
                                <Box position="relative">
                                    {isVideoLoading && (
                                        <Box
                                            position="absolute"
                                            top="50%"
                                            left="50%"
                                            sx={{
                                                transform: "translate(-50%, -50%)",
                                                zIndex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <CircularProgress size={40} />
                                            <Typography variant="body2" color="white" sx={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                                {translate('Loading video...')}
                                            </Typography>
                                        </Box>
                                    )}
                                    <ReactPlayer
                                        url={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${selectedVideo.videoUrl}`}
                                        playing={isPlaying}
                                        controls
                                        style={{ maxHeight: '300px', maxWidth: '100%' }}
                                        onPause={() => setIsPlaying(false)}
                                        onPlay={() => setIsPlaying(true)}
                                        onReady={handleVideoLoad}
                                        onBuffer={() => setIsVideoLoading(true)}
                                        onBufferEnd={() => setIsVideoLoading(false)}
                                    />
                                </Box>
                            )}
                        </Box>
                        {selectedVideo.analysisData && <VideoAnalyticsChart turnData={selectedVideo.analysisData} />}
                        <Box px={2}>
                            {/* Score - Clean mobile design */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {translate('videoCoachScreen.score')}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        {parseInt(selectedVideo?.videoComments[0]?.score, 10)}
                                    </Typography>
                                </Box>

                                {/* Progress bar */}
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '6px',
                                        backgroundColor: theme.palette.grey[100],
                                        borderRadius: '3px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: `${selectedVideo?.videoComments[0]?.score}%`,
                                            backgroundColor: selectedVideo?.videoComments[0]?.score >= 80 
                                                ? theme.palette.success.main 
                                                : selectedVideo?.videoComments[0]?.score >= 60 
                                                    ? theme.palette.warning.main 
                                                    : theme.palette.error.main,
                                            borderRadius: '3px',
                                            transition: 'width 0.3s ease-in-out',
                                        }}
                                    />
                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {selectedVideo?.videoComments[0]?.score >= 80 ? translate('videoCoachScreen.excellentPerformance') :
                                        selectedVideo?.videoComments[0]?.score >= 60 ? translate('videoCoachScreen.goodPerformance') :
                                            translate('videoCoachScreen.needsImprovement')}
                                </Typography>

                                {selectedVideo?.videoComments[0]?.score >= 80 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            color: theme.palette.success.main,
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        ★ {translate('videoCoachScreen.excellentPerformance')}
                                    </Box>
                                )}
                            </Box>

                            <SnowMatchIntelligenceBox video={selectedVideo} />

                            {/* Revisor */}
                            {selectedVideo.reviewed &&
                                selectedVideo.videoComments.length > 0 &&
                                selectedVideo.videoComments.map(comment => (
                                    <>
                                        <Divider sx={{ my: 2 }} />

                                        {/* Info del reviewer */}
                                        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                            <Avatar src={comment.user.imageLink} sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
                                                {comment.user.name[0]}
                                                {comment.user.lastname[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6">
                                                    {comment.user.name} {comment.user.lastname}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {translate("teacher.level")} {comment.user.level}
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
                                                width: "100%",
                                                position: 'relative',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: '-8px',
                                                    bottom: '20px',
                                                    width: 0,
                                                    height: 0,
                                                    borderTop: '8px solid transparent',
                                                    borderBottom: '8px solid transparent',
                                                    borderRight: `8px solid ${theme.palette.grey[200]}`,
                                                }
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
                                                {comment.comment}
                                            </Markdown>
                                        </Box>
                                    </>
                                ))}
                        </Box>

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
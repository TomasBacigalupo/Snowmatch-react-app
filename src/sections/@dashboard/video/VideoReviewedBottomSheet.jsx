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
                        <Box px={2}>
                            {/* Score - Updated with circular design */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 3,
                                    borderRadius: 3,
                                    p: 2,
                                    background: theme.palette.background.paper,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '4px',
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main} ${selectedVideo?.videoComments[0]?.score}%, ${theme.palette.grey[200]} 0)`,
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: 90,
                                        height: 90,
                                        borderRadius: '100%',
                                        background: `conic-gradient(${theme.palette.primary.main} ${selectedVideo?.videoComments[0]?.score}%, ${theme.palette.grey[200]} 0)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            width: '85%',
                                            height: '85%',
                                            borderRadius: '50%',
                                            background: theme.palette.background.paper,
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            position: 'relative',
                                            fontWeight: 'bold',
                                            fontSize: '2.5rem',
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {parseInt(selectedVideo?.videoComments[0]?.score, 10)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        {translate('videoCoachScreen.score')}
                                        {selectedVideo?.videoComments[0]?.score >= 80 && (
                                            <Box
                                                component="span"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    fontSize: '0.9rem',
                                                    fontWeight: 500,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}
                                            >
                                                ★ {translate('videoCoachScreen.excellentPerformance')}
                                            </Box>
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            lineHeight: 1.5,
                                            maxWidth: '300px'
                                        }}
                                    >
                                        {selectedVideo?.videoComments[0]?.score >= 80 ? translate('videoCoachScreen.excellentPerformance') :
                                            selectedVideo?.videoComments[0]?.score >= 60 ? translate('videoCoachScreen.goodPerformance') :
                                                translate('videoCoachScreen.needsImprovement')}
                                    </Typography>
                                </Box>
                            </Box>

                            {selectedVideo.analysisData && <VideoAnalyticsChart turnData={selectedVideo.analysisData} />}
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
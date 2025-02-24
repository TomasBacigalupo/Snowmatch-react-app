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

export default function VideoReviewedBottomSheet({ open, onClose, onOpen, selectedVideo }) {
    const theme = useTheme();
    const { translate } = useLocales();
    const [isPlaying, setIsPlaying] = useState(false);
    const dispatch = useDispatch();
    const { analizeExists, isLoadingExists } = useSelector(state => state.video);
    const [ isProCheckRequested, setIsProCheckRequested ]  = useState(selectedVideo?.proCheck);
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
        enqueueSnackbar("ProCheck Solicitado")
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
                        {/* Botón de cierre */}
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="relative"
                            mt={2}
                            mx={2}
                            sx={{ borderBottom: "2px solid #EBEBEB" }} // Línea inferior estilo Airbnb
                        >

                            {/* Botón de cierre - Alineado a la izquierda */}
                            <Box mr="auto">
                                <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                                    <ArrowBack />
                                </IconButton>
                            </Box>

                            {/* Título del curso - Centrado basado en su propio tamaño */}
                            <Typography
                                variant="h4"
                                sx={{
                                    position: "absolute",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    fontWeight: 600,
                                    color: "#222222" // Color oscuro como Airbnb 
                                }}
                            >
                                {translate(`course.${selectedVideo.course}.title`)}
                            </Typography>
                        </Box>

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
                            {/* Score */}
                            <Typography variant="h6" gutterBottom>
                                {translate('videoCoachScreen.score')} {selectedVideo.score}
                            </Typography>

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
                                        <Markdown>{selectedVideo.comment}</Markdown>
                                    </Box>
                                </>
                            )}
                        </Box>

                        <SnowMatchIntelligenceBox video={selectedVideo}/>

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
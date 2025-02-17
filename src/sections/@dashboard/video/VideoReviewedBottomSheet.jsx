import React, { useEffect, useState } from "react";
import { Avatar, Box, IconButton, Divider, Typography, SwipeableDrawer, Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactPlayer from "react-player";
import Markdown from "src/components/Markdown";
import useLocales from "src/hooks/useLocales";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "src/redux/store";
import { videoExists } from "src/redux/slices/video";
import { useSelector } from "react-redux";
import { ArrowBack } from "@mui/icons-material";
import Logo from "src/components/Logo";

export default function VideoReviewedBottomSheet({ open, onClose, onOpen, selectedVideo }) {
    const theme = useTheme();
    const { translate } = useLocales();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayingAnalized, setIsPlayingAlaized] = useState(false);
    const dispatch = useDispatch();
    const [snowMatchIntelligenceOpen, setSnowMatchIntelligenceOpen] = useState(false)
    const { analizeExists, isLoadingExists } = useSelector(state => state.video)

    useEffect(() => {
        if (selectedVideo) {
            dispatch(videoExists("snowmatchvideosanalisados", `videos_analizados/${selectedVideo.videoUrl}.mp4`))
        }
    }, [selectedVideo]);

    useEffect(() => {
        console.log("analizeExistsa", analizeExists);
        console.log("isLoadingExists", isLoadingExists)
    }, [analizeExists, isLoadingExists])


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

                        <Box
                            sx={{
                                margin: 2,
                                marginBottom: 6,
                                border: "1px solid #E0E0E0",
                                borderRadius: "12px",
                                padding: "16px",
                                maxWidth: "400px",
                                backgroundColor: "white",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                            }}
                        >
                            {/* Header con icono y título */}
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Logo />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    SnowMatch Intelligence
                                </Typography>
                            </Box>

                            {/* Descripción */}
                            <Typography variant="body1" color="text.primary" mb={2}>
                                Short but intense ride with power spikes! You crushed higher power zones and hit a 3-day activity logging streak.
                            </Typography>

                            {/* Botón */}
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    color: "white",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                }}
                                onClick={() => setSnowMatchIntelligenceOpen(true)}
                            >
                                See Video
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
            <SwipeableDrawer
                anchor="bottom"
                open={snowMatchIntelligenceOpen}
                onClose={() => setSnowMatchIntelligenceOpen(false)}
                onOpen={() => setSnowMatchIntelligenceOpen(true)}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
                PaperProps={{
                    sx: {
                        height: '80%',
                        maxHeight: '80%',
                        width: '100vw',
                        maxWidth: '100%',
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                        padding: 2,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                        height: "100%",
                    }}
                >
                    {/* Encabezado con Cierre */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={600}>
                            SnowMatch Intelligence
                        </Typography>
                        <IconButton onClick={() => setSnowMatchIntelligenceOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    {selectedVideo &&
                        <Box mb={2}>
                            {!isPlayingAnalized ? (
                                <Box
                                    position="relative"
                                    width="100%"
                                    maxHeight="300px"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setIsPlayingAlaized(true)}
                                >
                                    {/* Thumbnail Image */}
                                    <Box
                                        component="img"
                                        src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${selectedVideo?.videoUrl}.jpg`}
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
                                    url={`${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${selectedVideo?.videoUrl}.mp4`}
                                    playing={isPlayingAnalized}
                                    controls
                                    style={{ maxHeight: '300px', maxWidth: '100%', }}
                                    onPause={() => setIsPlaying(false)}
                                    onPlay={() => setIsPlaying(true)}
                                />
                            )}
                            {console.log("test", `${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${selectedVideo?.videoUrl}.mp4`)}
                        </Box>
                    }
                </Box>
            </SwipeableDrawer>
        </SwipeableDrawer>
    );
}
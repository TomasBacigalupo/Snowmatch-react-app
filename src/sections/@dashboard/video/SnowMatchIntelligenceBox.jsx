import { Box, Button, Divider, IconButton, SwipeableDrawer, Typography } from "@mui/material"
import Logo from "src/components/Logo"

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from "react-player";
import { useState } from "react";
import Markdown from "src/components/Markdown";

const SnowMatchIntelligenceBox = ({ video }) => {

    const [isPlayingAnalized, setIsPlayingAlaized] = useState(false);
    const [snowMatchIntelligenceOpen, setSnowMatchIntelligenceOpen] = useState(false);
    console.log("video", video);
    return <Box
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
        {video?.aiComment &&
            <Typography variant="body1" color="text.primary" mb={2}>
                {video?.aiComment?.slice(0, 145)}...
            </Typography>
        }

        {!video?.aiComment &&
            <Typography variant="body1" color="text.primary" mb={2}>
                Mira el analizis de tu video en tiempo real
            </Typography>
        }

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
            Análisis completo
        </Button>
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
                    height: '100%',
                    maxHeight: '100%',
                    width: '100vw',
                    maxWidth: '100%',
                    paddingTop: "env(safe-area-inset-top)"
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
                <Box px={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                        SnowMatch Intelligence
                    </Typography>
                    <IconButton onClick={() => setSnowMatchIntelligenceOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mt: 2 }} />
                {video &&
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
                                    src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video?.videoUrl}.jpg`}
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
                                url={`${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${video?.videoUrl}.mp4`}
                                playing={isPlayingAnalized}
                                controls
                                style={{ maxHeight: '300px', maxWidth: '100%', }}
                                onPause={() => isPlayingAnalized(false)}
                                onPlay={() => isPlayingAnalized(true)}
                            />
                        )}
                        <Box px={2} pt={2}>
                            <Markdown>{video?.aiComment}</Markdown>
                        </Box>
                    </Box>
                }
            </Box>
        </SwipeableDrawer>
    </Box>
}

export default SnowMatchIntelligenceBox;
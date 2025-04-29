import { Box, Button, Divider, IconButton, SwipeableDrawer, Typography } from "@mui/material"
import Logo from "src/components/Logo"

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from "react-player";
import { useState } from "react";
import Markdown from "src/components/Markdown";
import useLocales from "src/hooks/useLocales";
import { useTheme } from "@mui/material/styles";

const safeSliceMarkdown = (text, length) => {
    if (!text) return "";
    if (text.length <= length) return text;
    let sliced = text.slice(0, length);
    return sliced.substring(0, sliced.lastIndexOf(" ")) + "..."; // Corta en el último espacio
};

const SnowMatchIntelligenceBox = ({ video }) => {
    const { translate } = useLocales();
    const theme = useTheme();
    const [isPlayingAnalized, setIsPlayingAlaized] = useState(false);
    const [snowMatchIntelligenceOpen, setSnowMatchIntelligenceOpen] = useState(false);
    console.log("video", video);
    return <Box
        sx={{
            margin: 2,
            marginBottom: 6,
            maxWidth: '400px',
            position: 'relative',
            padding: '1px', // Space for the gradient border
            borderRadius: '16px',
            background: `linear-gradient(45deg, 
                ${theme.palette.primary.light}22, 
                ${theme.palette.primary.main}44,
                ${theme.palette.info.main}22,
                ${theme.palette.success.light}44,
                ${theme.palette.primary.light}22)`,
            backgroundSize: '400% 400%',
            animation: 'gradient 8s ease infinite',
            '@keyframes gradient': {
                '0%': {
                    backgroundPosition: '0% 50%'
                },
                '50%': {
                    backgroundPosition: '100% 50%'
                },
                '100%': {
                    backgroundPosition: '0% 50%'
                }
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '16px',
                padding: '1px',
                background: `linear-gradient(45deg, 
                    ${theme.palette.primary.light}, 
                    ${theme.palette.primary.main},
                    ${theme.palette.info.main},
                    ${theme.palette.success.light},
                    ${theme.palette.primary.light})`,
                backgroundSize: '400% 400%',
                animation: 'gradient 8s ease infinite',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'xor',
                '-webkit-mask': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                '-webkit-mask-composite': 'xor',
                pointerEvents: 'none'
            }
        }}
    >
        <Box
            sx={{
                padding: '24px',
                borderRadius: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                zIndex: 1,
                height: '100%',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 28px rgba(0, 0, 0, 0.12)',
                }
            }}
        >
            {/* Header with icon and title - updated styling */}
            <Box 
                display="flex" 
                alignItems="center" 
                gap={1.5} 
                mb={2}
                sx={{
                    '& .MuiTypography-root': {
                        fontSize: '1.25rem',
                        letterSpacing: '-0.02em'
                    }
                }}
            >
                <Logo sx={{ width: 32, height: 32 }} />
                <Typography variant="subtitle1" fontWeight={700}>
                    {translate('snowmatch.intelligence.title')}
                </Typography>
            </Box>

            {/* Description - updated styling */}
            {video?.videoComments && video?.videoComments[0]?.comment &&
                <Markdown
                    components={{
                        h1: (props) => <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }} {...props} />,
                        h2: (props) => <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }} {...props} />,
                        h3: (props) => <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }} {...props} />,
                        h4: (props) => <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }} {...props} />,
                        h5: (props) => <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }} {...props} />,
                        h6: (props) => <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }} {...props} />,
                        ul: (props) => <ul style={{ listStyleType: 'disc', marginLeft: '1px' }} {...props} />,
                        li: (props) => <li style={{ fontSize: '14px', marginLeft: '1px', marginTop: '5px', color: theme.palette.text.secondary }} {...props} />,
                    }}
                >
                    {safeSliceMarkdown(video?.videoComments[0]?.comment, 145)}
                </Markdown>
            }

            {!video?.aiComment &&
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        mb: 3
                    }}
                >
                    {translate('snowmatch.intelligence.description')}
                </Typography>
            }

            {/* Button - updated with Apple-like styling */}
            <Button
                variant="contained"
                fullWidth
                sx={{
                    mt: 2,
                    height: '48px',
                    color: 'white',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: `linear-gradient(135deg, 
                        ${theme.palette.primary.main}, 
                        ${theme.palette.primary.dark},
                        ${theme.palette.info.main})`,
                    backgroundSize: '200% 200%',
                    animation: 'gradientButton 5s ease infinite',
                    '@keyframes gradientButton': {
                        '0%': {
                            backgroundPosition: '0% 50%'
                        },
                        '50%': {
                            backgroundPosition: '100% 50%'
                        },
                        '100%': {
                            backgroundPosition: '0% 50%'
                        }
                    },
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)',
                    },
                    '&:active': {
                        transform: 'translateY(1px)',
                    }
                }}
                onClick={() => setSnowMatchIntelligenceOpen(true)}
            >
                {translate('snowmatch.intelligence.analyze')}
            </Button>
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
                            >{video?.videoComments[0]?.comment}</Markdown>
                        </Box>
                    </Box>
                }
            </Box>
        </SwipeableDrawer>
    </Box>
}

export default SnowMatchIntelligenceBox;
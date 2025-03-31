import { Box, Card, CardMedia, Typography, Button, IconButton } from '@mui/material';
import { m } from 'framer-motion';
import useLocales from 'src/hooks/useLocales';
import ShareIcon from '@mui/icons-material/Share';

const pulseKeyframes = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}
`;

const style = document.createElement('style');
style.innerHTML = pulseKeyframes;
document.head.appendChild(style);

function VideoCard({ video, setIsVideoDetailOpen }) {
    const { translate } = useLocales();
    // Assuming statusInfo is determined based on video.status
    const statusInfo = {
        color: '#someColor', // Define your status colors
        text: video.status   // Or your status text
    };

    const needsProCheck = !video.proCheck;
    const waitingProCheck = video.proCheck && !video.reviewed;
    const proChecked = video.proCheck && video.reviewed;
    const score = video.score;

    const renderStatusInfo = () => {
        if (waitingProCheck) {
            return (<Typography>{translate('video.status.waitingProCheck')}</Typography>)
        }
        if (proChecked) {
            return (<Typography>{translate('video.status.proChecked')}</Typography>)
        }
        if (score) {
            return (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        mb: 0.5
                    }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 800, 
                                color: 'primary.main',
                                lineHeight: 1,
                                fontSize: '2rem',
                            }}
                        >
                            {parseInt(score, 10)}
                        </Typography>
                        <Typography 
                            component="span"
                            sx={{ 
                                fontSize: '1.2rem',
                                lineHeight: 1,
                                color: 'primary.main',
                            }}
                        >
                            ❄️
                        </Typography>
                    </Box>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'text.secondary',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                        }}
                    >
                        {translate('video.status.score')}
                    </Typography>
                </Box>
            )
        }
        return (<></>)
    }

    const renderCTA = () => {
        if (waitingProCheck) {
            return (<Button variant="outlined" fullWidth>{translate('video.action.showAnalysis')}</Button>)
        }
        if (needsProCheck) {
            return (<Button
                fullWidth
                variant="outlined"
                disabled={video.status === 'processing'}
                sx={{
                    py: 1,
                    px: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                }}
            >
                {translate('video.action.proCheck')}
            </Button>)
        }
        return (<></>)
    }

    return (
        <Card
            component={m.div}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsVideoDetailOpen(true)}
            sx={{
                display: 'flex',
                height: "140px",
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#fff',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.06)',
                position: 'relative',
                '&:hover': {
                    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                }
            }}
        >
            <CardMedia
                component="img"
                image={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video.videoUrl}.jpg`}
                alt="Video Thumbnail"
                sx={{
                    width: '180px',
                    height: '140px',
                    objectFit: 'cover',
                    borderRight: '1px solid rgba(0,0,0,0.06)'
                }}
            />

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    p: 1
                }}
            >
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: `${statusInfo.color}15`,
                        borderRadius: '6px',
                        px: 1.5,
                        py: 0.75,
                        mb: 2
                    }}
                >
                    {renderStatusInfo()}
                </Box>
                {renderCTA()}
            </Box>
        </Card>
    );
}

export default VideoCard;

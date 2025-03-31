import { Box, Typography, Grid, Divider, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import useLocales from 'src/hooks/useLocales';
import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import UploadedVideoCard from './UploadedVideoCard';

const ScrollAppBar = styled(AppBar)(({ theme, show }) => ({
    paddingTop: 'env(safe-area-inset-top)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid',
    borderColor: theme.palette.grey[200],
    boxShadow: 'none',
    transform: show ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 0.3s ease',
    zIndex: 9999,
}));

const VideoSection = ({ title, videos, onVideoClick, translate, setShowHeader }) => (
    <Box sx={{ mb: 4 }}>
        <Typography 
            variant="h6" 
            sx={{ 
                mb: 2,
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#1d1d1f'
            }}
        >
            {title}
        </Typography>
        <Grid container spacing={2}>
            {videos.map((video, index) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <UploadedVideoCard 
                            video={video} 
                            setIsVideoDetailOpen={() => {
                                setShowHeader(false);
                                onVideoClick(video);
                            }}
                        />
                    </m.div>
                </Grid>
            ))}
        </Grid>
    </Box>
);

const UploadedVideosList = ({ videos, onVideoClick, showHeader: propShowHeader }) => {
    const { translate } = useLocales();
    const [showHeader, setShowHeader] = useState(propShowHeader);
    
    // Handle scroll events after video click
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowHeader(scrollPosition > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sync with prop changes
    useEffect(() => {
        setShowHeader(propShowHeader);
    }, [propShowHeader]);

    const pendingVideos = videos?.filter(video => !video?.reviewed) || [];
    const reviewedVideos = videos?.filter(video => video?.reviewed) || [];

    if (!videos?.length) {
        return (
            <Box 
                sx={{ 
                    textAlign: 'center',
                    py: 8,
                    backgroundColor: '#f5f5f7',
                    borderRadius: 2
                }}
            >
                <Typography 
                    variant="h6"
                    sx={{ 
                        color: '#1d1d1f',
                        mb: 1
                    }}
                >
                    {translate('uploadedVideos.empty.title')}
                </Typography>
                <Typography 
                    variant="body2"
                    sx={{ color: '#86868b' }}
                >
                    {translate('uploadedVideos.empty.description')}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 2 }}>
            <ScrollAppBar 
                position="fixed" 
                show={showHeader}
                sx={{ 
                    top: { xs: 0, sm: 64 },
                    zIndex: 9999,
                }}
            >
                <Toolbar 
                    sx={{ 
                        minHeight: '56px !important',
                        position: 'relative',
                        zIndex: 9999,
                        justifyContent: 'center',
                        px: 2
                    }}
                >
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ 
                            zIndex: 9999,
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                color: '#1d1d1f',
                                fontWeight: 600,
                                fontSize: '1rem',
                                position: 'relative',
                                zIndex: 9999,
                                textAlign: 'center',
                                width: '100%'
                            }}
                        >
                            {translate('uploadedVideos.title')}
                        </Typography>
                    </m.div>
                </Toolbar>
            </ScrollAppBar>

            {pendingVideos.length > 0 && (
                <VideoSection 
                    title={translate('uploadedVideos.reviewed')}
                    videos={pendingVideos}
                    onVideoClick={onVideoClick}
                    translate={translate}
                    setShowHeader={setShowHeader}
                />
            )}
            
            {reviewedVideos.length > 0 && (
                <>
                    {pendingVideos.length > 0 && <Divider sx={{ my: 4 }} />}
                    <VideoSection 
                        title="Videos Calificados"
                        videos={reviewedVideos}
                        onVideoClick={onVideoClick}
                        translate={translate}
                        setShowHeader={setShowHeader}
                    />
                </>
            )}
        </Box>
    );
};

export default UploadedVideosList;

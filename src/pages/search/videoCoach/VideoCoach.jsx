import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography, Card, CardActionArea, CardMedia, CardContent, Chip, Stack, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedVideos } from 'src/redux/slices/video';
import useLocales from 'src/hooks/useLocales';

export default function VideoCoachLanding() {
    const navigate = useNavigate();
    const { lng } = useParams();
    const dispatch = useDispatch();
    const { translate } = useLocales();
    
    const [loading, setLoading] = useState(false);
    
    // Get videos from Redux store
    const videos = useSelector((state) => state.video.videos);

    const lang = lng || 'es';

    const uploadUrl = `/${lang}/video-onboarding`;
    const instructorUrl = `/${lang}/instructor`;

    const seo = {
        title: translate('videoCoachPage.seo.title'),
        description: translate('videoCoachPage.seo.description'),
        url: `https://snowmatch.com/${lang}/video-coach`,
        keywords: translate('videoCoachPage.seo.keywords'),
        canonical: `https://snowmatch.com/${lang}/video-coach`
    };

    const examples = [
        {
            title: translate('videoCoachPage.examples.carving'),
            url: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/vcortadas.mov',
            thumb: '/assets/icons/pc.jpg',
            tag: translate('videoCoachPage.examples.tag')
        },
        {
            title: translate('videoCoachPage.examples.bumps'),
            url: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/Jaime2.mov',
            thumb: '/assets/icons/pc.jpg',
            tag: translate('videoCoachPage.examples.tag')
        },
        {
            title: translate('videoCoachPage.examples.braking'),
            url: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/frenada.mp4',
            thumb: '/assets/icons/pc.jpg',
            tag: translate('videoCoachPage.examples.tag')
        },
    ];

    const success = translate('videoCoachPage.success.items', { returnObjects: true });

    // Fetch videos on component mount
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                await dispatch(fetchFeedVideos(0, 3)); // Fetch first 3 videos
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [dispatch]);

    const JSONLD = () => {
        const steps = translate('videoCoachPage.howItWorks.steps', { returnObjects: true }) || [];
        const json = {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: translate('videoCoachPage.jsonld.name'),
            description: translate('videoCoachPage.jsonld.description'),
            step: [
                steps[0] ? { '@type': 'HowToStep', name: steps[0].title, url: seo.url, text: steps[0].description } : null,
                steps[1] ? { '@type': 'HowToStep', name: steps[1].title, text: steps[1].description } : null,
                steps[2] ? { '@type': 'HowToStep', name: steps[2].title, text: steps[2].description } : null
            ]
        };
        // Remove nulls if any
        json.step = json.step.filter(Boolean);
        return (
            <script type="application/ld+json">
                {JSON.stringify(json)}
            </script>
        );
    };

    return (
        <>
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta name="keywords" content={seo.keywords} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:url" content={seo.url} />
                <link rel="canonical" href={seo.canonical} />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <JSONLD />

            <Box sx={{ background: '#fff' }}>
                <Container sx={{ py: { xs: 6, md: 10 } }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography component="h1" variant="h2" sx={{ mb: 2, fontWeight: 800 }}>
                                {translate('videoCoachPage.hero.title')}
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
                                {translate('videoCoachPage.hero.subtitle')}
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button variant="contained" color="primary" onClick={() => navigate(uploadUrl)}>
                                    {translate('videoCoachPage.hero.ctaUpload')}
                                </Button>
                                <Button variant="outlined" color="inherit" onClick={() => navigate(instructorUrl)}>
                                    {translate('videoCoachPage.hero.ctaInstructor')}
                                </Button>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                <Chip label={translate('videoCoachPage.hero.chips.aiFeedback')} />
                                <Chip label={translate('videoCoachPage.hero.chips.proUnder1h')} />
                                <Chip label={translate('videoCoachPage.hero.chips.anyResort')} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2, 
                                overflowX: 'auto', 
                                pb: 1,
                                maxHeight: '500px',
                                '&::-webkit-scrollbar': {
                                    display: 'none',
                                },
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}>
                                {examples.map((ex, i) => (
                                    <Box key={i} sx={{ 
                                        minWidth: 200, 
                                        maxWidth: '80vw', 
                                        width: { xs: '60vw', sm: '40vw', md: '30vw' },
                                        flexShrink: 0, 
                                        maxHeight: '500px' 
                                    }}>
                                        <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', maxHeight: '500px' }}>
                                            <CardActionArea href={ex.url} target="_blank" rel="noopener noreferrer" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <CardMedia 
                                                    component="video" 
                                                    src={ex.url} 
                                                    poster={ex.thumb} 
                                                    muted 
                                                    playsInline 
                                                    loop 
                                                    sx={{ 
                                                        aspectRatio: '9/16', 
                                                        objectFit: 'cover',
                                                        flex: 1,
                                                        maxHeight: '400px'
                                                    }} 
                                                />
                                                <CardContent sx={{ p: 1.5, flexShrink: 0 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip label={ex.tag} size="small" />
                                                        <Typography variant="body2" noWrap>{ex.title}</Typography>
                                                    </Stack>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ background: '#f7f7f8' }}>
                <Container sx={{ py: { xs: 6, md: 10 } }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>{translate('videoCoachPage.howItWorks.title')}</Typography>
                    <Grid container spacing={3}>
                        {(
                            (translate('videoCoachPage.howItWorks.steps', { returnObjects: true }) || [])
                                .map((step, index) => ({
                                    icon: index === 0 ? '📹' : index === 1 ? <img src="/assets/avatars/snow-ai.png" alt="Snow AI" style={{ width: 64, height: 64, borderRadius: '50%' }} /> : '👨‍🏫',
                                    t: step.title,
                                    d: step.description
                                }))
                        ).map((s, idx) => (
                            <Grid key={idx} item xs={12} md={4}>
                                <Card sx={{ p: 3, borderRadius: 3, height: '100%', textAlign: 'center' }}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                        {typeof s.icon === 'string' ? (
                                            <Typography variant="h2">{s.icon}</Typography>
                                        ) : (
                                            s.icon
                                        )}
                                    </Box>
                                    <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>{s.t}</Typography>
                                    <Typography color="text.secondary">{s.d}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button 
                            size="large" 
                            variant="contained" 
                            color="primary" 
                            onClick={() => navigate(uploadUrl)}
                            sx={{ px: 4, py: 1.5 }}
                        >
                            {translate('videoCoachPage.howItWorks.cta')}
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Box sx={{ background: '#fff' }}>
                <Container sx={{ py: { xs: 6, md: 10 } }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>{translate('videoCoachPage.success.title')}</Typography>
                    <Grid container spacing={3}>
                        {success.map((s, i) => (
                            <Grid key={i} item xs={12} md={4}>
                                <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>{s.name}</Typography>
                                    <Typography variant="body1">{s.text}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ background: '#f7f7f8' }}>
                <Container sx={{ py: { xs: 6, md: 10 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>{translate('videoCoachPage.feed.title')}</Typography>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => navigate('/match/feed')}
                            sx={{ textTransform: 'none' }}
                        >
                            {translate('videoCoachPage.feed.viewMore')}
                        </Button>
                    </Box>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {videos.slice(0, 3).map((video) => (
                            <Grid key={video.id} item xs={12} md={4}>
                                <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            image={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video.videoUrl}.jpg`}
                                            alt="Video Thumbnail"
                                            sx={{ 
                                                height: 250,
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: 8,
                                            right: 8,
                                            display: 'flex',
                                            gap: 1,
                                            justifyContent: 'space-between'
                                        }}>
                                            {video.videoComments?.find(c => c.aiComment) && (
                                                <Box sx={{
                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                    backdropFilter: 'blur(8px)',
                                                    borderRadius: '20px',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <Box sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        backgroundImage: 'url(/assets/avatars/snow-ai.png)',
                                                        backgroundSize: 'cover'
                                                    }} />
                                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                                        {translate('videoCoachPage.feed.aiScore')}: {video.videoComments.find(c => c.aiComment).score}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    <CardContent sx={{ p: 2 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <Box sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                backgroundImage: video.user.imageS3 ? `url(${video.user.imageS3})` : 'none',
                                                backgroundColor: video.user.imageS3 ? 'transparent' : 'grey.300',
                                                backgroundSize: 'cover'
                                            }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {video.user.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {new Date(video.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    ❤️ {video.likesCount}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    💬 {video.videoComments?.length || 0}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>

            <Box sx={{ background: '#0a0a0a', color: '#fff' }}>
                <Container sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>{translate('videoCoachPage.finalCta.title')}</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.85, mb: 3 }}>{translate('videoCoachPage.finalCta.subtitle')}</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button size="large" variant="contained" color="primary" onClick={() => navigate(uploadUrl)}>{translate('videoCoachPage.finalCta.ctaUpload')}</Button>
                        <Button size="large" variant="outlined" color="inherit" onClick={() => navigate(instructorUrl)}>{translate('videoCoachPage.finalCta.ctaInstructor')}</Button>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}


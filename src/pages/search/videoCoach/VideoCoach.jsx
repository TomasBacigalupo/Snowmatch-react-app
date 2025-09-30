import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography, Card, CardActionArea, CardMedia, CardContent, Chip, Stack, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedVideos } from 'src/redux/slices/video';

export default function VideoCoachLanding() {
    const navigate = useNavigate();
    const { lng } = useParams();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false);
    
    // Get videos from Redux store
    const videos = useSelector((state) => state.video.videos);

    const lang = lng || 'es';

    const uploadUrl = '/match/videoCoach/upload';
    const instructorUrl = `/${lang}/instructor`;

    const seo = {
        title: 'SnowMatch VideoCoach | Subí tu video y recibí feedback en minutos',
        description: 'Subí tu video esquiando o haciendo snowboard y recibí feedback de Snow (nuestra IA). Suscribite a Premium y obtené correcciones de instructores certificados en menos de 1 hora en cualquier centro de ski.',
        url: `https://snowmatch.com/${lang}/video-coach`,
        keywords: 'VideoCoach, análisis de video ski, análisis snowboard, IA nieve, feedback ski, instructores certificados, SnowMatch',
        canonical: `https://snowmatch.com/${lang}/video-coach`
    };

    const examples = [
        {
            title: 'Carving • Intermedio-Avanzado',
            url: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/vcortadas.mov',
            thumb: '/assets/icons/pc.jpg',
            tag: 'Ejemplo real'
        },
        {
            title: 'Bumps • Intermedio',
            url: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/Jaime2.mov',
            thumb: '/assets/icons/pc.jpg',
            tag: 'Ejemplo real'
        },
        {
            title: 'Frenada • Principiante',
            url: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/frenada.mp4',
            thumb: '/assets/icons/pc.jpg',
            tag: 'Ejemplo real'
        },
    ];

    const success = [
        { name: 'Camila — Catedral', text: '"Mejoré más en una semana que en todo el invierno pasado."' },
        { name: 'Guido — La Hoya', text: '"Los puntos clave de Snow me ordenaron la técnica."' },
        { name: 'Mariana — Chapelco', text: '"El ProCheck en menos de una hora fue un golazo."' },
    ];

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
        const json = {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Cómo funciona SnowMatch VideoCoach',
            description: 'Subí tu video y recibí feedback automático de IA y correcciones Premium de instructores certificados.',
            step: [
                {
                    '@type': 'HowToStep',
                    name: 'Subí tu video',
                    url: seo.url,
                    text: 'Grabá 5–30s donde se vea tu cuerpo completo y subilo a SnowMatch.'
                },
                {
                    '@type': 'HowToStep',
                    name: 'Recibí feedback de IA (Snow)',
                    text: 'Obtené análisis automático: puntos fuertes, oportunidades y recomendaciones.'
                },
                {
                    '@type': 'HowToStep',
                    name: 'Premium: Corrección de un instructor',
                    text: 'Suscribite para recibir feedback humano en < 1 hora en cualquier centro de ski.'
                }
            ]
        };
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
                                SnowMatch VideoCoach
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
                                Subí tu video. Recibí feedback de nuestra IA Snow. Suscribite a Premium y obtené correcciones de instructores certificados en menos de una hora.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button variant="contained" color="primary" onClick={() => navigate(uploadUrl)}>
                                    Subir mi video
                                </Button>
                                <Button variant="outlined" color="inherit" onClick={() => navigate(instructorUrl)}>
                                    ¿Sos Instructor? Corrección de alumnos
                                </Button>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                                <Chip label="Feedback IA" />
                                <Chip label="Pro en < 1h" />
                                <Chip label="En cualquier centro de ski" />
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
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>Cómo funciona</Typography>
                    <Grid container spacing={3}>
                        {[{
                            icon: '📹',
                            t: '1. Subí tu video',
                            d: 'Elegí un clip de 20–40s donde se vea tu cuerpo completo mientras te movés.'
                        }, {
                            icon: <img src="/assets/avatars/snow-ai.png" alt="Snow AI" style={{ width: 64, height: 64, borderRadius: '50%' }} />,
                            t: '2. Snow (IA) te da feedback',
                            d: 'Recibí análisis automático con puntos clave y recomendaciones.'
                        }, {
                            icon: '👨‍🏫',
                            t: '3. Premium: Feedback humano',
                            d: 'Instructores certificados te corrigen en menos de una hora, estés donde estés.'
                        }].map((s, idx) => (
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
                            Subir mi primer video
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Box sx={{ background: '#fff' }}>
                <Container sx={{ py: { xs: 6, md: 10 } }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>Casos de éxito</Typography>
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
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>Videos de usuarios</Typography>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={() => navigate('/match/feed')}
                            sx={{ textTransform: 'none' }}
                        >
                            Ver más videos
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
                                                        Snow: {video.videoComments.find(c => c.aiComment).score}
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
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Listo para mejorar tu técnica</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.85, mb: 3 }}>Subí tu video ahora y recibí feedback en minutos</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button size="large" variant="contained" color="primary" onClick={() => navigate(uploadUrl)}>Subir mi video</Button>
                        <Button size="large" variant="outlined" color="inherit" onClick={() => navigate(instructorUrl)}>Soy Instructor: Quiero corregir</Button>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}


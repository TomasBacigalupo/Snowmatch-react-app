import { Box, Container, Typography, Button, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const IphoneFrame = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '280px',
    height: '580px',
    margin: '0 auto',
    borderRadius: '40px',
    padding: '10px',
    background: '#1a1a1a',
    boxShadow: '0 0 40px rgba(0,0,0,0.2)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '150px',
        height: '30px',
        background: '#1a1a1a',
        borderRadius: '0 0 20px 20px',
        zIndex: 1,
    },
}));

const Screen = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    borderRadius: '30px',
    overflow: 'hidden',
    background: '#fff',
    position: 'relative',
}));

const AppImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    padding: '10px',
    marginTop: '5px',
    boxSizing: 'border-box',
});

const StoreButton = styled('img')({
    height: '48px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});

const DownloadAppSection = ({ resort }) => {
    return (
        <Box
            component="section"
            aria-labelledby="download-app-heading"
            sx={{
                py: { xs: 8, md: 12 },
                background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        gap: 6,
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            id="download-app-heading"
                            component="h2"
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '3.5rem' },
                                fontWeight: 700,
                                mb: 3,
                                textAlign: { xs: 'center', md: 'left' },
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                backgroundClip: 'text',
                                textFillColor: 'transparent',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Tu camino para aprender a esquiar en {resort} empieza con SnowMatch
                        </Typography>
                        <Typography
                            component="p"
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                mb: 4,
                                fontWeight: 400,
                                lineHeight: 1.6,
                            }}
                        >
                            Conecta con instructores certificados en {resort}, reserva tus clases de esquí online y mejora tu técnica con Snow, nuestro asistente de inteligencia artificial.
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            flexWrap: 'wrap',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            alignItems: 'center'
                        }}>
                            <Link 
                                href="https://apps.apple.com/ar/app/snowmatch/id6741247513?l=en-GB&itscg=30200&itsct=apps_box_badge&mttnsubad=6741247513" 
                                style={{ display: 'inline-block' }}
                                aria-label="Descargar SnowMatch en App Store"
                            >
                                <img 
                                    src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1745884800" 
                                    alt="Download on the App Store" 
                                    style={{ width: '245px', height: '82px', verticalAlign: 'middle', objectFit: 'contain' }} 
                                />
                            </Link>
                            <Box sx={{ 
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img 
                                    src="/qr-code.png"
                                    alt="Escanea para descargar SnowMatch" 
                                    style={{ 
                                        width: '100px', 
                                        height: '100px',
                                        marginBottom: '8px'
                                    }} 
                                />
                                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                                    Escanea para descargar
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <IphoneFrame>
                            <Screen>
                                <AppImage
                                    src="/screenshot.png"
                                    alt="SnowMatch App - Reserva clases de esquí y snowboard"
                                    loading="lazy"
                                />
                            </Screen>
                        </IphoneFrame>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default DownloadAppSection;

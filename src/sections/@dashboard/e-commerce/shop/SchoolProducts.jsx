import { Box, Typography, Skeleton, Drawer, IconButton, Button, Grid, Divider, Link } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Policies, TimeDetails } from '../teacher-details';
import Iconify from 'src/components/Iconify';
import useLocales from 'src/hooks/useLocales';
import PersonIcon from '@mui/icons-material/Person';
import TerrainIcon from '@mui/icons-material/Terrain';

const IconWrapperStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    justifyContent: 'center',
    height: theme.spacing(8),
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// Traducción y explicación de niveles
const LEVELS = {
    FIRST_TIME: {
        label: 'Primera vez',
        description: 'Nunca esquié. Ideal para quienes nunca han tenido contacto con el esquí.'
    },
    BEGINNER: {
        label: 'Principiante (pistas verdes)',
        description: 'Puedes esquiar en pistas verdes. Controlas la velocidad y puedes frenar, pero aún estás aprendiendo las bases.'
    },
    INTERMEDIATE: {
        label: 'Intermedio (pistas azules)',
        description: 'Te desenvuelves bien en pistas azules. Puedes girar y controlar la velocidad con confianza.'
    },
    ADVANCED: {
        label: 'Avanzado (pistas rojas)',
        description: 'Esquías cómodamente en pistas rojas. Manejas bien la técnica y puedes esquiar a mayor velocidad.'
    },
    EXPERT: {
        label: 'Experto (pistas negras)',
        description: 'Dominas todas las pistas, incluyendo las negras. Tienes excelente técnica y experiencia.'
    },
};

export default function SchoolProducts({ products, isLoading }) {
    const theme = useTheme();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [levelDrawerOpen, setLevelDrawerOpen] = useState(false);
    const [levelInfo, setLevelInfo] = useState({ label: '', description: '' });
    const { translate } = useLocales();

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedProduct(null);
    };

    const LoadingSkeleton = () => (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'hidden' }}>
            {[1, 2, 3, 4].map((item) => (
                <Box key={item} sx={{ width: 140, flexShrink: 0 }}>
                    <Skeleton variant="rounded" width={140} height={140} sx={{ mb: 1, borderRadius: 3 }} />
                    <Skeleton variant="text" width="80%" sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="60%" />
                </Box>
            ))}
        </Box>
    );

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Box
                sx={{
                    overflowX: 'auto',
                    px: 1,
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    msOverflowStyle: 'none',  /* IE and Edge */
                    scrollbarWidth: 'none',  /* Firefox */
                }}
            >
                {isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    <Box sx={{ display: 'flex', gap: 2, }}>
                        {products.map((product) => (
                            <Box
                                key={product.id}
                                onClick={() => handleProductClick(product)}
                                sx={{
                                    width: 140,
                                    flexShrink: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    boxShadow: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        borderRadius: 3,
                                        backgroundImage: `url(${product.imageLink})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        mb: 1,
                                    }}
                                />
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5, width: '100%' }} noWrap>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ width: '100%' }} noWrap>
                                    {product.description}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                PaperProps={{
                    sx: {
                        width: '100%',
                        p: 0,
                        position: 'relative',
                    },
                }}
            >
                {selectedProduct && (
                    <Box sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                    }}>
                        <Box sx={{
                            position: 'fixed',
                            top: `calc(6px + env(safe-area-inset-top))`,
                            left: 16,
                            zIndex: 2,
                        }}>
                            <IconButton
                                onClick={handleCloseDrawer}
                                sx={{
                                    bgcolor: 'background.paper',
                                    '&:hover': { bgcolor: 'background.paper' },
                                    boxShadow: 1,
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                width: '100%',
                                height: 380,
                                backgroundImage: `url(${selectedProduct.imageLink})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                                marginTop: '-env(safe-area-inset-top)',
                                zIndex: 0,
                            }}
                        />

                        <Box sx={{
                            py: 3,
                            flex: 1,
                            overflowY: 'auto',
                            position: 'relative',
                            zIndex: 1,
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            boxShadow: 3,
                            bgcolor: 'background.paper',
                            pb: `calc(80px + env(safe-area-inset-bottom))`,
                            width: '100%',
                            marginTop: -20,
                        }}>
                            <Box sx={{ px: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ width: 40, height: 6, borderRadius: 3, bgcolor: 'grey.300', mb: 1 }} />
                                    <Typography variant="h5" fontWeight={600} sx={{ mt: 2, mb: 1, textAlign: 'center', mx: 'auto' }}>
                                        {selectedProduct.name}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                        Descripción
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {selectedProduct.description}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        p: 0,
                                        bgcolor: 'background.paper',
                                        borderRadius: 3,
                                        // sin sombra ni borde
                                        px: 0,
                                        py: 2.5,
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, textAlign: 'left' }}>
                                        Requisitos
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <PersonIcon sx={{ fontSize: 28, bgcolor: 'common.white', color: 'common.black', borderRadius: '50%', p: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                    Rango de Edad
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {selectedProduct.ageFrom >= 18 ? 'Adultos' : `${selectedProduct.ageFrom} - ${selectedProduct.ageTo} años`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <TerrainIcon sx={{ fontSize: 28, bgcolor: 'common.white', color: 'common.black', borderRadius: '50%', p: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                    Nivel Requerido
                                                </Typography>
                                                <Link
                                                    component="button"
                                                    underline="always"
                                                    color="text.secondary"
                                                    variant="body1"
                                                    fontWeight={500}
                                                    onClick={() => {
                                                        const info = LEVELS[selectedProduct.studentLevel] || { label: selectedProduct.studentLevel, description: '' };
                                                        setLevelInfo(info);
                                                        setLevelDrawerOpen(true);
                                                    }}
                                                >
                                                    Desde {LEVELS[selectedProduct.studentLevel]?.label || selectedProduct.studentLevel}
                                                </Link>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider  />
                            <TimeDetails />
                            <Divider />
                            <Policies />
                            <Divider />
                            {[
                                {
                                    title: 'verified',
                                    description: 'verifiedDescription',
                                    icon: 'ic:round-verified',
                                },
                                {
                                    title: 'warranty',
                                    description: 'warrantyDescription',
                                    icon: 'ic:round-verified-user',
                                },
                            ].map((item) => (
                                <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                                    <IconWrapperStyle>
                                        <Iconify icon={item.icon} width={36} height={36} />
                                    </IconWrapperStyle>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {translate("teacherDetails." + item.title)}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{translate('teacherDetails.' + item.description)}</Typography>
                                </Box>
                            ))}
                        </Box>



                        {/* Sticky Footer */}
                        <Box
                            sx={{
                                position: 'fixed',
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                pb: `calc(0px + env(safe-area-inset-bottom))`,
                                pointerEvents: 'none',
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: 99,
                                    boxShadow: 3,
                                    px: 2,
                                    py: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '90%',
                                    maxWidth: 480,
                                    pointerEvents: 'auto',
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography component="span" sx={{ fontWeight: 700, fontSize: 20 }}>
                                        ${selectedProduct.price.toLocaleString('es-AR')}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        borderRadius: 99,
                                        px: 4,
                                        fontWeight: 700,
                                        fontSize: 18,
                                        boxShadow: 'none',
                                        minWidth: 120,
                                    }}
                                    onClick={() => {
                                        const message = `Hola, me interesa reservar: ${selectedProduct.name} en Catedral`;
                                        const whatsappUrl = `https://wa.me/+5492944263223?text=${encodeURIComponent(message)}`;
                                        window.open(whatsappUrl, '_blank');
                                    }}
                                >
                                    Reservar
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Drawer>

            {/* Drawer para explicación de nivel */}
            <Drawer
                anchor="bottom"
                open={levelDrawerOpen}
                onClose={() => setLevelDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        p: 3,
                        pb: `calc(32px + env(safe-area-inset-bottom))`,
                        maxWidth: 480,
                        mx: 'auto',
                    },
                }}
            >
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, textAlign: 'center' }}>
                    {levelInfo.label}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {levelInfo.description}
                </Typography>
            </Drawer>
        </Box>
    );
}

SchoolProducts.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            imageLink: PropTypes.string.isRequired,
            availableCount: PropTypes.number,
        })
    ).isRequired,
    isLoading: PropTypes.bool.isRequired,
};

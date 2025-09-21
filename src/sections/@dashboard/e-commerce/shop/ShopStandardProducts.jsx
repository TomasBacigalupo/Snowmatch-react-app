import PropTypes from 'prop-types';
// @mui
import { Box, Grid, Typography, IconButton, Drawer, Card, CardMedia, CardContent, Stack, Chip, Button, Divider, Rating, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ChevronRight, Close, ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// components
import { SkeletonProductItem, SkeletonProductCategory } from '../../../../components/skeleton';
//
import ShopTeacherCard from './ShopTeacherCard';
import { get, orderBy } from 'lodash';
import ShopStandardProductCard from './ShopStandardProductCard';
import useLocales from 'src/hooks/useLocales';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProductsByBusinessId } from 'src/redux/slices/business';
import ShopCategorizedProductCard from './ShopCategorizedProductCard';
import { fCurrency } from 'src/utils/formatNumber';
import { getFreeTeachers } from 'src/redux/slices/teachers';
import ShopCategorizedProductAvatarCard from './ShopCategorizedProductAvatarCard';
import SchoolProducts from './SchoolProducts';
import InstructorDetailsDrawer from '../../feed/InstructorDetailsDrawer';
import RentalProductCard from '../../../../components/rental/RentalProductCard';
import { getRentalItems } from 'src/redux/slices/rental';
// ----------------------------------------------------------------------

ShopStandardProducts.propTypes = {
    teachers: PropTypes.array.isRequired,
    loading: PropTypes.bool,
};

export default function ShopStandardProducts({ loading }) {
    const { translate, currentLang } = useLocales();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products } = useSelector((state) => state.business);
    const { teachers, sortBy, filters, teachersWithEvents, category, isLoading } = useSelector((state) => { return state.teachers })
    const { items: rentalItems, isLoading: rentalLoading } = useSelector((state) => state.rental);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [equipmentDrawerOpen, setEquipmentDrawerOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        // prod
        const businessId = filters.resort === "Lago Hermoso" ? 8 : 13;
        dispatch(getProductsByBusinessId(businessId));
    }, [filters.resort]);

    useEffect(() => {
        dispatch(getFreeTeachers(filters.from, filters.to, filters.resort, filters.category, 0));
        //dispatch(getTeachersWithEvents(filters));
    }, [dispatch, filters]);

    // Fetch rental items when resort changes
    useEffect(() => {
        if (filters.resort === "Cerro Catedral") {
            dispatch(getRentalItems({ 
                resortId: 'CERRO_CATEDRAL',
                status: 'ACTIVE',
                size: 20 
            }));
        }
    }, [dispatch, filters.resort]);

    const handleTeacherClick = (teacher) => {
        setSelectedTeacher(teacher);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedTeacher(null);
    };

    const handleRentalClick = () => {
        const resortSlug = filters.resort === "Cerro Catedral" ? "cerro-catedral" : "bariloche";
        navigate(`/rental/${resortSlug}`);
    };

    const handleEquipmentClick = (equipment) => {
        setSelectedEquipment(equipment);
        setEquipmentDrawerOpen(true);
        setSelectedSize('');
        setIsFavorite(false);
    };

    const handleCloseEquipmentDrawer = () => {
        setEquipmentDrawerOpen(false);
        setSelectedEquipment(null);
        setSelectedSize('');
        setIsFavorite(false);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            // Show error message
            return;
        }
        // Add to cart logic here
        const selectedVariant = selectedEquipment.variants.find(v => v.id === selectedSize);
        console.log('Added to cart:', selectedEquipment, selectedVariant);
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                },
                maxWidth: '100vw',
                overflow: 'hidden',
                width: '100%',
            }}
        >
            {loading && products && <SkeletonProductCategory />}
            {loading && products && <SkeletonProductCategory />}
            {loading && products && <SkeletonProductCategory />}
            {!loading && filters.resort === "Cerro Catedral" && <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>{!loading && filters.resort === "Cerro Catedral" &&
                    <ShopCategorizedProductCard
                        product={products.find(product => product.id === 143)}
                        level='gold'
                    />}
                </Grid>
                <Grid item xs={12} md={6} lg={4}>{!loading && filters.resort === "Cerro Catedral" && <ShopCategorizedProductAvatarCard
                    product={products.find(product => product.id === 144)}
                    level='silver'
                    avatar='/assets/avatars/chona-con-adulto.png'
                />}
                </Grid>
                <Grid item xs={12} md={6} lg={4}> {!loading && filters.resort === "Cerro Catedral" && <ShopCategorizedProductAvatarCard
                    product={products.find(product => product.id === 145)}
                    level='bronze'
                    avatar='/assets/avatars/chona-con-niño.png'
                />}
                </Grid>
                {filters.resort === "Cerro Catedral"  && <Grid item xs={12}>
                    <Typography variant='h6'>
                        Packs de SnowMatch
                    </Typography>
                </Grid>}
            </Grid>}
            {!loading && filters.resort === "Lago Hermoso" && <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>{!loading && filters.resort === "Lago Hermoso" &&
                    <ShopCategorizedProductCard
                        product={products.find(product => product.id === 67)}
                        level='gold'
                    />}
                </Grid>
                <Grid item xs={12} md={6} lg={4}>{!loading && filters.resort === "Lago Hermoso" && <ShopCategorizedProductAvatarCard
                    product={products.find(product => product.id === 66)}
                    level='silver'
                    time={2}
                    avatar='/assets/avatars/chona-con-adulto.png'
                />}
                </Grid>
                <Grid item xs={12} md={6} lg={4}> {!loading && filters.resort === "Lago Hermoso" && <ShopCategorizedProductAvatarCard
                    product={products.find(product => product.id === 61)}
                    level='bronze'
                    time={2}
                    avatar='/assets/avatars/chona-con-niño.png'
                />}
                </Grid>
                {filters.resort === "Cerro Catedral"  && <Grid item xs={12}>
                    <Typography variant='h6'>
                        Packs de SnowMatch
                    </Typography>
                </Grid>}
            </Grid>}
            {filters.resort === "Lago Hermoso" && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h6'>
                            SnowMatch packs Lago Hermoso
                        </Typography>
                    </Grid>
                </Grid>
            )}
            {
                (filters.resort === "Cerro Catedral" || filters.resort === "Lago Hermoso") && <SchoolProducts products={products} isLoading={isLoading} />
            }
            
            {/* Equipment Rental Section for Cerro Catedral */}
            {filters.resort === "Cerro Catedral" && rentalItems && rentalItems.length > 0 && (
                <Box sx={{ overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant='h6' sx={{ mr: 1 }}>
                            Alquiler de Equipos
                        </Typography>
                        <IconButton 
                            onClick={handleRentalClick}
                            sx={{ 
                                color: 'black',
                                p: 0,
                                '&:hover': { 
                                    backgroundColor: 'transparent'
                                }
                            }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            
                            width: '100%',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {rentalLoading ? (
                            [...Array(4)].map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        minWidth: 220,
                                        maxWidth: 220,
                                        flexShrink: 0,
                                    }}
                                >
                                    <SkeletonProductItem />
                                </Box>
                            ))
                        ) : (
                            rentalItems.map((equipment) => (
                                <Box
                                    key={equipment.id}
                                    sx={{
                                        minWidth: 220,
                                        maxWidth: 220,
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        '& .MuiCard-root': {
                                            height: 'auto',
                                            minHeight: 'unset',
                                        },
                                        '& .MuiCardMedia-root': {
                                            height: 100,
                                        },
                                        '& .MuiCardContent-root': {
                                            p: 1.5,
                                        },
                                        '& .MuiTypography-h6': {
                                            fontSize: '0.875rem',
                                            mb: 0.5,
                                            fontWeight: 600,
                                        },
                                        '& .MuiTypography-body2': {
                                            fontSize: '0.75rem',
                                            lineHeight: 1.3,
                                        },
                                    }}
                                    onClick={() => handleEquipmentClick(equipment)}
                                >
                                    <RentalProductCard
                                        product={equipment}
                                        location="cerro-catedral"
                                    />
                                </Box>
                            ))
                        )}
                    </Box>
                </Box>
            )}
            
            {(filters.resort === "Cerro Catedral" || filters.resort === "Lago Hermoso") && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant='h6' sx={{ mr: 1 }}>
                                O elegí tu pro ideal
                            </Typography>
                            <IconButton 
                                onClick={() => {
                                    const resortSlug = filters.resort === "Cerro Catedral" ? "cerro-catedral" : "bariloche";
                                    const langPath = `/${currentLang.value}`;
                                    navigate(`${langPath}/search/${resortSlug}/ski-pros`);
                                }}
                                sx={{ 
                                    color: 'black',
                                    p: 0,
                                    '&:hover': { 
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                <ChevronRight />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            )}
            <Box
                sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    },
                    width: '100%',
                }}
            >
                {loading ? [...Array(5)].map((product, index) => <SkeletonProductItem key={index} />) : teachers.map((teacher, index) =>
                    teacher ? <ShopTeacherCard key={index} teacher={teacher} onTeacherClick={handleTeacherClick} /> : <SkeletonProductItem key={index} />
                )}
            </Box>

            <InstructorDetailsDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                instructor={selectedTeacher}
            />

            {/* Equipment Details Drawer */}
            <Drawer
                anchor="right"
                open={equipmentDrawerOpen}
                onClose={handleCloseEquipmentDrawer}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: 400 } },
                }}
            >
                {selectedEquipment && (
                    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {selectedEquipment.name || selectedEquipment.title}
                            </Typography>
                            <IconButton onClick={handleCloseEquipmentDrawer}>
                                <Close />
                            </IconButton>
                        </Stack>

                        {/* Image */}
                                                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={selectedEquipment.imageUrl || (selectedEquipment.images && selectedEquipment.images[0]) || '/assets/rental/default-ski.jpg'}
                                    alt={selectedEquipment.name || selectedEquipment.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Card>

                        {/* Price and Rating */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    ${selectedEquipment.pricePerDay || selectedEquipment.fromPricePerDay}/día
                                </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Rating value={selectedEquipment.rating} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary">
                                    ({selectedEquipment.reviews})
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Description */}
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {selectedEquipment.description}
                        </Typography>

                        {/* Category and Skill Levels */}
                        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                            <Chip label={selectedEquipment.category} size="small" color="primary" variant="outlined" />
                            {selectedEquipment.variants && selectedEquipment.variants.length > 0 && (
                                <Chip 
                                    label={selectedEquipment.variants[0].skillLevel} 
                                    size="small" 
                                    color="secondary" 
                                    variant="outlined" 
                                />
                            )}
                        </Stack>

                        {/* Variants Info */}
                        {selectedEquipment.variants && selectedEquipment.variants.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Variantes Disponibles:
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {selectedEquipment.variants.map((variant) => (
                                        <Chip 
                                            key={variant.id} 
                                            label={`${variant.size} (${variant.unitsAvailable}/${variant.unitsTotal})`} 
                                            size="small" 
                                            variant="outlined"
                                            color={variant.unitsAvailable > 0 ? "default" : "error"}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <Divider sx={{ my: 3 }} />

                        {/* Size Selection */}
                        {selectedEquipment.variants && selectedEquipment.variants.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Seleccionar Variante
                                </Typography>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Variante</InputLabel>
                                    <Select
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                        label="Variante"
                                    >
                                        {selectedEquipment.variants
                                            .filter(variant => variant.unitsAvailable > 0)
                                            .map((variant) => (
                                                <MenuItem key={variant.id} value={variant.id}>
                                                    {variant.size} - {variant.skillLevel} ({variant.unitsAvailable} disponibles)
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

                        {/* Status */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Estado:
                            </Typography>
                            <Chip 
                                label={selectedEquipment.status} 
                                size="small" 
                                color={selectedEquipment.status === 'ACTIVE' ? 'success' : 'default'}
                                variant="outlined"
                            />
                        </Box>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} sx={{ mt: 'auto', pt: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                                onClick={handleFavorite}
                                sx={{ flex: 1 }}
                            >
                                Favorito
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<ShoppingCart />}
                                onClick={handleAddToCart}
                                disabled={!selectedSize}
                                sx={{ flex: 2 }}
                            >
                                Agregar al Carrito
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Drawer>

        </Box>
    );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  CheckCircle,
  LocalShipping,
  Settings,
  Security,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useRentalCart } from '../../contexts/RentalCartContext';
import { RentalProductSchema } from '../../components/seo/RentalSchemas';
import StickyCart from '../../components/rental/StickyCart';
import { getRentalItem } from '../../redux/slices/rental';

// ----------------------------------------------------------------------

const locations = {
  bariloche: { name: 'Bariloche', region: 'Río Negro' },
  chapelco: { name: 'Chapelco', region: 'Neuquén' },
  'cerro-catedral': { name: 'Cerro Catedral', region: 'Río Negro' },
  'las-lenas': { name: 'Las Leñas', region: 'Mendoza' },
  'valle-nevado': { name: 'Valle Nevado', region: 'Chile' },
  portillo: { name: 'Portillo', region: 'Chile' },
};

export default function RentalProductDetail() {
  const { location, productSlug } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  
  const { addItem, getDaysCount } = useRentalCart();
  const { currentItem: product, isLoading: loading } = useSelector((state) => state.rental);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBootSize, setSelectedBootSize] = useState('');
  const [bootSizeSystem, setBootSizeSystem] = useState('US');

  const daysCount = getDaysCount();
  const pricePerDay = product?.pricePerDay || 0;
  const totalPrice = pricePerDay * daysCount;

  // Load product from API
  useEffect(() => {
    if (productSlug) {
      dispatch(getRentalItem(productSlug));
    }
  }, [dispatch, productSlug]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedBootSize) {
      // Show error message
      return;
    }

    const item = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: totalPrice,
      pricePerDay,
      size: selectedSize,
      bootSize: selectedBootSize,
      bootSizeSystem,
      quantity: 1,
      image: product.images[0],
              includes: product.includes || [],
      daysCount,
    };

    addItem(item);
    // Show success message or navigate to cart
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const locationInfo = locations[location];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Producto no encontrado
        </Alert>
      </Container>
    );
  }

  if (!locationInfo) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Ubicación no encontrada
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.title} - Alquiler en {locationInfo.name} | Snowmatch</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.title} - Alquiler en ${locationInfo.name}`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0]} />
      </Helmet>

      <RentalProductSchema product={product} location={locationInfo.name} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/rental/${location}`)}
          sx={{ mb: 3, textTransform: 'none', color: 'black' }}
        >
          Volver a equipos
        </Button>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
              <img
                src={product.images[0] || '/assets/rental/default-ski.jpg'}
                alt={product.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
              
              {/* Favorite Button */}
              <IconButton
                onClick={handleFavorite}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              >
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>

              {/* Level Badge */}
              <Chip
                label={product.level && product.level[0] ? product.level[0] : (product.skillLevel || 'All Levels')}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  fontWeight: 600,
                  bgcolor: 'black',
                  color: 'white',
                }}
              />

              {/* Type Badge */}
              <Chip
                label={product.type}
                size="small"
                variant="outlined"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Title and Rating */}
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {product.title}
                </Typography>
                
                {/* Rating section removed */}

                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ${totalPrice}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  por {daysCount} {daysCount === 1 ? 'día' : 'días'} • ${pricePerDay} por día
                </Typography>

                {daysCount >= 3 && (
                  <Chip
                    label={`-10% descuento por ${daysCount}+ días`}
                    size="small"
                    color="success"
                    sx={{ mt: 1, fontWeight: 600 }}
                  />
                )}
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  <strong>Ideal para:</strong> {product.idealFor}
                </Typography>
              </Box>

              {/* Includes */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Incluye:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {product.includes && product.includes.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      size="medium"
                      icon={<CheckCircle />}
                      sx={{ fontSize: '0.9rem' }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Size Selection */}
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Selecciona tu talla
                </Typography>

                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Talla de esquí</InputLabel>
                    <Select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      label="Talla de esquí"
                    >
                      {product.sizes && product.sizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size} cm
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Stack direction="row" spacing={2}>
                    <FormControl sx={{ minWidth: 100 }}>
                      <InputLabel>Sistema</InputLabel>
                      <Select
                        value={bootSizeSystem}
                        onChange={(e) => setBootSizeSystem(e.target.value)}
                        label="Sistema"
                      >
                        <MenuItem value="US">US</MenuItem>
                        <MenuItem value="EU">EU</MenuItem>
                        <MenuItem value="MP">MP</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Talla de bota</InputLabel>
                      <Select
                        value={selectedBootSize}
                        onChange={(e) => setSelectedBootSize(e.target.value)}
                        label="Talla de bota"
                      >
                        {product.bootSizes && product.bootSizes[bootSizeSystem] && product.bootSizes[bootSizeSystem].map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
              </Card>

              {/* Add to Cart Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedBootSize}
                startIcon={<ShoppingCart />}
                sx={{
                  borderRadius: 2,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {!selectedSize || !selectedBootSize ? 'Selecciona talla' : 'Agregar al carrito'}
              </Button>

              {/* Features */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Características:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {product.features && product.features.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      size="medium"
                      variant="outlined"
                      sx={{ fontSize: '0.9rem' }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      
      {/* Floating Cart */}
      <StickyCart variant="bottom" />
    </>
  );
} 
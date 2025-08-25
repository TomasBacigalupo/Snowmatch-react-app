import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Rating,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import {
  FilterList,
  Close,
  LocationOn,
  CalendarToday,
  Group,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import RentalProductCard from '../../components/rental/RentalProductCard';
import StickyCart from '../../components/rental/StickyCart';
import { RentalServiceSchema, RentalBreadcrumbSchema } from '../../components/seo/RentalSchemas';
import { useRentalCart } from '../../contexts/RentalCartContext';
import { getRentalItems } from '../../redux/slices/rental';

// ----------------------------------------------------------------------

const locations = {
  bariloche: { name: 'Bariloche', region: 'Río Negro' },
  chapelco: { name: 'Chapelco', region: 'Neuquén' },
  'cerro-catedral': { name: 'Cerro Catedral', region: 'Río Negro' },
  'las-lenas': { name: 'Las Leñas', region: 'Mendoza' },
  'valle-nevado': { name: 'Valle Nevado', region: 'Chile' },
  portillo: { name: 'Portillo', region: 'Chile' },
};

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const types = ['Ski', 'Snowboard', 'Touring'];

// ----------------------------------------------------------------------

export default function RentalLocation() {
  const { location } = useParams();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  
  const { deliveryDate, pickupDate, deliveryTime, adults, kids } = useRentalCart();
  const { items: products, isLoading: loading } = useSelector((state) => state.rental);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    level: [],
    type: [],
    priceRange: [0, 200],
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Load products from API
  useEffect(() => {
    if (location) {
      // Convert location slug to enum format
      const resortIdMap = {
        'cerro-catedral': 'CERRO_CATEDRAL',
        'cerro-castor': 'CERRO_CASTOR',
        'chapelco': 'CHAPELCO',
        'la-hoya': 'LA_HOYA',
        'las-lenas': 'LAS_LEÑAS',
        'cerro-bayo': 'CERRO_BAYO'
      };
      
      const resortId = resortIdMap[location] || location;
      
      dispatch(getRentalItems({ 
        resortId: resortId,
        status: 'ACTIVE',
        size: 50 
      }));
    }
  }, [dispatch, location]);

  // Apply filters
  useEffect(() => {
    let filtered = products || [];

    if (filters.level.length > 0) {
      filtered = filtered.filter(product =>
        product.level && product.level.some(level => filters.level.includes(level))
      );
    }

    if (filters.type.length > 0) {
      filtered = filtered.filter(product =>
        filters.type.includes(product.type)
      );
    }

    filtered = filtered.filter(product =>
      product.pricePerDay >= filters.priceRange[0] &&
      product.pricePerDay <= filters.priceRange[1]
    );

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const [productDrawerOpen, setProductDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product, action = 'cart') => {
    if (action === 'drawer') {
      // Open product detail drawer in mobile
      setSelectedProduct(product);
      setProductDrawerOpen(true);
    } else {
      // Add to cart directly
      console.log('Added to cart:', product);
    }
  };

  const locationInfo = locations[location];

  if (!locationInfo) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Ubicación no encontrada
        </Alert>
      </Container>
    );
  }

      const priceRange = `$${Math.min(...products.map(p => p.pricePerDay || p.fromPricePerDay))} - $${Math.max(...products.map(p => p.pricePerDay || p.fromPricePerDay))}`;

  return (
    <>
      <Helmet>
        <title>Alquiler de Esquí en {locationInfo.name} | Snowmatch</title>
        <meta name="description" content={`Alquiler premium de equipos de esquí y snowboard en ${locationInfo.name}. Entrega a domicilio y ajuste profesional incluido.`} />
        <meta property="og:title" content={`Alquiler de Esquí en ${locationInfo.name} | Snowmatch`} />
        <meta property="og:description" content={`Alquiler premium de equipos de esquí y snowboard en ${locationInfo.name}.`} />
      </Helmet>

      <RentalServiceSchema location={locationInfo.name} priceRange={priceRange} />
      <RentalBreadcrumbSchema location={locationInfo.name} />

      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {locationInfo.region}
          </Typography>

          {/* Search Summary */}
          {(deliveryDate || pickupDate || adults || kids) && (
            <Card sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                {deliveryDate && pickupDate && (
                  <Chip
                    icon={<CalendarToday />}
                    label={`${new Date(deliveryDate).toLocaleDateString('es-ES')} - ${new Date(pickupDate).toLocaleDateString('es-ES')}`}
                    variant="outlined"
                  />
                )}
                {(adults || kids) && (
                  <Chip
                    icon={<Group />}
                    label={`${adults + kids} ${adults + kids === 1 ? 'persona' : 'personas'}`}
                    variant="outlined"
                  />
                )}
                {deliveryTime && (
                  <Chip
                    label={`Entrega: ${deliveryTime}`}
                    variant="outlined"
                  />
                )}
              </Stack>
            </Card>
          )}

          {/* Filters Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" paddingTop={2}>
            
            {isMobile ? (
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filtros
              </Button>
            ) : (
              <Stack direction="row" spacing={2}>
                {filters.level.length > 0 && (
                  <Chip
                    label={`Nivel: ${filters.level.join(', ')}`}
                    onDelete={() => handleFilterChange('level', [])}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.type.length > 0 && (
                  <Chip
                    label={`Tipo: ${filters.type.join(', ')}`}
                    onDelete={() => handleFilterChange('type', [])}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 200) && (
                  <Chip
                    label={`Precio: $${filters.priceRange[0]} - $${filters.priceRange[1]}`}
                    onDelete={() => handleFilterChange('priceRange', [0, 200])}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  
                </Typography>

                <Stack spacing={3}>
                  {/* Level Filter */}
                  <FormControl fullWidth>
                    <InputLabel>Nivel</InputLabel>
                    <Select
                      multiple
                      value={filters.level}
                      onChange={(e) => handleFilterChange('level', e.target.value)}
                      label="Nivel"
                    >
                      {levels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Type Filter */}
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      multiple
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      label="Tipo"
                    >
                      {types.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Price Range */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Precio por día
                    </Typography>
                    <Slider
                      value={filters.priceRange}
                      onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={200}
                      valueLabelFormat={(value) => `$${value}`}
                    />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption">${filters.priceRange[0]}</Typography>
                      <Typography variant="caption">${filters.priceRange[1]}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          )}

          {/* Products Grid */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {loading ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={12} sm={6} lg={4} key={item}>
                    <Card sx={{ height: 400, borderRadius: 3 }}>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                        <Skeleton variant="text" height={24} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <RentalProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart} 
                      location={location}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No se encontraron equipos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Intenta ajustar los filtros para ver más opciones
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setFilters({ level: [], type: [], priceRange: [0, 200] })}
                >
                  Limpiar filtros
                </Button>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: { width: 320, p: 3 },
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Stack>

          <Divider />

          <FormControl fullWidth>
            <InputLabel>Nivel</InputLabel>
            <Select
              multiple
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              label="Nivel"
            >
              {levels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              multiple
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              label="Tipo"
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Precio por día
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              valueLabelFormat={(value) => `$${value}`}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption">${filters.priceRange[0]}</Typography>
              <Typography variant="caption">${filters.priceRange[1]}</Typography>
            </Stack>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => setFilterDrawerOpen(false)}
          >
            Aplicar filtros
          </Button>
        </Stack>
      </Drawer>

      {/* Product Detail Drawer */}
      <Drawer
        anchor="right"
        open={productDrawerOpen}
        onClose={() => setProductDrawerOpen(false)}
        PaperProps={{
          sx: { width: '100%', maxWidth: '100%', p: 0 },
        }}
      >
        {selectedProduct && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Detalles del equipo
                </Typography>
                <IconButton onClick={() => setProductDrawerOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>
            </Box>

            {/* Product Image */}
            <Box sx={{ position: 'relative', height: 250 }}>
              <img
                                                src={selectedProduct.imageUrl || (selectedProduct.images && selectedProduct.images[0]) || '/assets/rental/default-ski.jpg'}
                                  alt={selectedProduct.name || selectedProduct.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Chip
                label={selectedProduct.level && selectedProduct.level[0] ? selectedProduct.level[0] : (selectedProduct.skillLevel || 'All Levels')}
                size="small"
                color="primary"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Product Content */}
            <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {selectedProduct.name || selectedProduct.title}
              </Typography>
              
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Rating value={selectedProduct.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  {selectedProduct.rating} ({selectedProduct.reviews} reseñas)
                </Typography>
              </Stack>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedProduct.description}
              </Typography>

              <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic' }}>
                <strong>Ideal para:</strong> {selectedProduct.idealFor}
              </Typography>

              {/* Includes */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Incluye:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedProduct.includes && selectedProduct.includes.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Features */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Características:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedProduct.features && selectedProduct.features.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Bottom Action */}
            <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => {
                  // Add to cart logic here
                  console.log('Add to cart:', selectedProduct);
                  setProductDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Agregar al carrito
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Sticky Cart */}
      <StickyCart variant={isMobile ? 'bottom' : 'right'} />
    </>
  );
} 
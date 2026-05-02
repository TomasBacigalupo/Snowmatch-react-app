import { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tooltip,
  Badge,
} from '@mui/material';
import { Star, ShoppingCart, Info } from '@mui/icons-material';
import { useRentalCart } from '../../contexts/RentalCartContext';
import TruncatedGearText from './TruncatedGearText';

// ----------------------------------------------------------------------

export default function ProductCard({ product, onAddToCart }) {
  const { addItem, getDaysCount } = useRentalCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBootSize, setSelectedBootSize] = useState('');
  const [bootSizeSystem, setBootSizeSystem] = useState('US');
  const [showUpsell, setShowUpsell] = useState(false);

  const daysCount = getDaysCount();
  // Handle both old (fromPricePerDay) and new (pricePerDay) formats
  const pricePerDay = product.pricePerDay || product.fromPricePerDay;
  const totalPrice = pricePerDay * daysCount;

  // Get product title - handle both old (title) and new (name) formats
  const productTitle = product.name || product.title || 'Producto';

  // Get product image - handle both old (images array) and new (imageUrl) formats
  const productImage = product.imageUrl || (product.images && product.images[0]) || '/assets/rental/default-ski.jpg';

  const handleAddToCart = () => {
    if (!selectedSize || !selectedBootSize) {
      // Show error or validation message
      return;
    }

    const item = {
      id: product.id,
      title: productTitle,
      description: product.description,
      price: totalPrice,
      pricePerDay,
      size: selectedSize,
      bootSize: selectedBootSize,
      bootSizeSystem,
      quantity: 1,
      image: productImage,
              includes: product.includes || [],
      daysCount,
    };

    addItem(item);
    
    if (onAddToCart) {
      onAddToCart(item);
    }

    // Show upsell modal
    setShowUpsell(true);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.customShadows.z24,
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={productImage}
          alt={productTitle}
          sx={{ objectFit: 'cover' }}
        />
        
        {/* Level Badge */}
        <Chip
          label={product.level && product.level[0] ? product.level[0] : 'All Levels'}
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontWeight: 600,
          }}
        />

        {/* Type Badge */}
        <Chip
          label={product.type}
          size="small"
          variant="outlined"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            bgcolor: 'background.paper',
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Title and Rating */}
        <Box sx={{ mb: 2 }}>
          <TruncatedGearText variant="h6" text={productTitle} sx={{ fontWeight: 600, mb: 1 }} />
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.rating} ({product.reviews})
            </Typography>
          </Stack>
        </Box>

        {/* Description */}
        <TruncatedGearText
          variant="body2"
          text={product.description}
          color="text.secondary"
          sx={{ mb: 2 }}
        />

        {/* Ideal For */}
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
          <strong>Ideal para:</strong> {product.idealFor}
        </Typography>

        {/* Includes */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Incluye:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {product.includes && product.includes.map((item) => (
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

        <Divider sx={{ my: 2 }} />

        {/* Size Selection */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <FormControl fullWidth size="small">
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

          <Stack direction="row" spacing={1}>
            <FormControl size="small" sx={{ minWidth: 80 }}>
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

            <FormControl fullWidth size="small">
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

        {/* Price */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${totalPrice}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              por {daysCount} {daysCount === 1 ? 'día' : 'días'}
            </Typography>
          </Stack>
          
          <Typography variant="body2" color="text.secondary">
            ${pricePerDay} por día
          </Typography>

          {daysCount >= 3 && (
            <Chip
              label={`-10% descuento por ${daysCount}+ días`}
              size="small"
              color="success"
              sx={{ mt: 1 }}
            />
          )}
        </Box>

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
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Agregar al carrito
        </Button>

                {/* Features */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
                          {product.features && product.features.map((feature) => (
            <Chip
              key={feature}
              label={feature}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
} 
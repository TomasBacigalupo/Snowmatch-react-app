import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import TruncatedGearText from './TruncatedGearText';

// ----------------------------------------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: 'none',
}));

// Default images from austria directory
const DEFAULT_IMAGES = [
  '/assets/rental/austria/ski/1.png',
  '/assets/rental/austria/ski/2.png',
  '/assets/rental/austria/ski/3.png',
];

export default function RentalProductCard({ product, onAddToCart, location }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get product image - handle both old (images array) and new (imageUrl) formats
  const productImage = useMemo(() => {
    if (product.imageUrl) {
      return product.imageUrl;
    }
    if (product.images && product.images[0]) {
      return product.images[0];
    }
    // Return a random default image
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  }, [product.imageUrl, product.images]);

  // Get product title - handle both old (title) and new (name) formats
  const productTitle = product.name || product.title || 'Producto';

  const handleCardClick = (e) => {
    if (isMobile) {
      // Open drawer in mobile
      if (onAddToCart) {
        onAddToCart(product, 'drawer');
      }
    } else {
      // Navigate to product detail page in desktop
      const productSlug = product.id.replace(/\s+/g, '-').toLowerCase();
      navigate(`/rental/${location}/${productSlug}`);
    }
  };

  return (
    <StyledCard onClick={handleCardClick}>
      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={productImage}
          alt={productTitle}
          sx={{ objectFit: 'cover' }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Title */}
        <TruncatedGearText
          variant="h6"
          text={productTitle}
          sx={{ fontWeight: 700, mb: 2, fontSize: '1.1rem' }}
        />

        {/* Description */}
        <TruncatedGearText variant="body2" text={product.description} color="text.secondary" />
      </CardContent>
    </StyledCard>
  );
} 
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, IconButton, Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight, LocationOn, Star } from '@mui/icons-material';
import axiosInstance from 'src/utils/axios';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: theme.spacing(3),
  padding: theme.spacing(2, 0),
  scrollbarWidth: 'thin',
  scrollbarColor: '#c1c1c1 transparent',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c1c1c1',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: '#a8a8a8',
    },
  },
  '&::-webkit-scrollbar-corner': {
    backgroundColor: 'transparent',
  },
}));

const ResortCard = styled(Card)(({ theme }) => ({
  minWidth: '320px',
  maxWidth: '320px',
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #e0e0e0',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    '& .resort-image': {
      transform: 'scale(1.05)',
    },
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '200px',
  overflow: 'hidden',
  '& .resort-image': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
  zIndex: 1,
}));

const ContentContainer = styled(CardContent)(({ theme }) => ({
  padding: '20px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const ResortTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.2,
  marginBottom: '8px',
  color: '#222',
  fontFamily: '"Circular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}));

const LocationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
}));

const LocationText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#717171',
  fontWeight: 400,
  marginLeft: '4px',
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#222',
  lineHeight: 1.4,
  marginBottom: '16px',
  flexGrow: 1,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto',
}));

const StarRating = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  color: '#222',
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  width: '48px',
  height: '48px',
  zIndex: 10,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-50%) scale(1.05)',
  },
  '&.scroll-left': {
    left: theme.spacing(2),
  },
  '&.scroll-right': {
    right: theme.spacing(2),
  },
}));

const SkeletonCard = styled(Card)(({ theme }) => ({
  minWidth: '320px',
  maxWidth: '320px',
  height: '400px',
  borderRadius: '16px',
  overflow: 'hidden',
}));

// ----------------------------------------------------------------------

export default function HomeResorts() {
  const { currentLang } = useLocales();
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('api/enums/resorts/to-index');
        console.log('Resorts API response:', response.data);
        setResorts(response.data);
      } catch (err) {
        console.error('Error fetching resorts:', err);
        setError('Error al cargar los resorts');
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, []);

  const scrollContainerRef = React.useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Card width + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: currentScroll + (direction === 'right' ? scrollAmount : -scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  const renderSkeletonCards = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <SkeletonCard key={index}>
        <Skeleton variant="rectangular" height="200px" />
        <CardContent sx={{ padding: '20px' }}>
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="70%" height={20} sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="30%" height={20} />
          </Box>
        </CardContent>
      </SkeletonCard>
    ));
  };

  const getResortImage = (resort) => {
    // Try different possible image fields
    return resort.image || resort.imageUrl || resort.coverImage || resort.photo || '/assets/bariloche.jpg';
  };

  const getResortLocation = (resort) => {
    // Try different possible location fields
    return resort.location || resort.city || resort.region || resort.address || 'Ubicación no especificada';
  };

  const getResortDescription = (resort) => {
    // Try different possible description fields
    return resort.description || resort.summary || resort.overview || 'Descubre este increíble resort de esquí';
  };

  return (
    <SectionContainer>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 600,
              color: '#222',
              fontFamily: '"Circular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              mb: 2
            }}
          >
            Descubre los Mejores Resorts
          </Typography>
          <Typography
            variant="h5"
            sx={{ 
              color: '#717171',
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Encuentra tu destino perfecto para esquiar y vivir experiencias únicas
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {!loading && resorts.length > 1 && (
            <>
              <ScrollButton 
                className="scroll-left" 
                onClick={() => handleScroll('left')}
                aria-label="Scroll izquierda"
              >
                <ChevronLeft />
              </ScrollButton>
              <ScrollButton 
                className="scroll-right" 
                onClick={() => handleScroll('right')}
                aria-label="Scroll derecha"
              >
                <ChevronRight />
              </ScrollButton>
            </>
          )}

          <ScrollContainer ref={scrollContainerRef}>
            {loading ? (
              renderSkeletonCards()
            ) : error ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', py: 4 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : (
              resorts.map((resort) => (
                <ResortCard 
                  key={resort.id || resort.slug} 
                  component={RouterLink} 
                  to={`/${currentLang.value}/resort/${resort.slug || resort.id}`}
                  sx={{ textDecoration: 'none' }}
                >
                  <ImageContainer>
                    <img
                      src={getResortImage(resort)}
                      alt={`${resort.name} - ${getResortLocation(resort)}`}
                      className="resort-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/assets/bariloche.jpg';
                      }}
                    />
                    <Overlay />
                  </ImageContainer>
                  
                  <ContentContainer>
                    <Box>
                      <ResortTitle component="h3">
                        {resort.name}
                      </ResortTitle>
                      
                      <LocationContainer>
                        <LocationOn sx={{ fontSize: '16px', color: '#717171' }} />
                        <LocationText>
                          {getResortLocation(resort)}
                        </LocationText>
                      </LocationContainer>
                      
                      <DescriptionText>
                        {getResortDescription(resort)}
                      </DescriptionText>
                    </Box>
                    
                    <RatingContainer>
                      <StarRating>
                        <Star sx={{ fontSize: '16px', color: '#FFD700' }} />
                        <Typography variant="body2" sx={{ color: '#222', fontWeight: 500 }}>
                          {resort.rating || '4.8'}
                        </Typography>
                      </StarRating>
                      
                      <PriceText>
                        Desde ${resort.priceFrom || resort.minPrice || '50'}/día
                      </PriceText>
                    </RatingContainer>
                  </ContentContainer>
                </ResortCard>
              ))
            )}
          </ScrollContainer>
        </Box>
      </Container>
    </SectionContainer>
  );
}

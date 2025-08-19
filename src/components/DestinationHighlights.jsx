import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import Iconify from './Iconify';

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: '#ffffff',
  position: 'relative',
}));

const HighlightCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4),
  borderRadius: 20,
  background: '#ffffff',
  border: '1px solid #f0f0f0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: '#1890FF',
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    border: '1px solid #e0e0e0',
    '&::before': {
      transform: 'scaleX(1)',
    },
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: 16,
  background: '#ffffff',
  border: '1px solid #f0f0f0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
    border: '1px solid #e0e0e0',
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#1890FF',
  marginBottom: theme.spacing(1),
  fontSize: '2.5rem',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#000000',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: '#666666',
  maxWidth: 700,
  margin: '0 auto',
  fontSize: '1.2rem',
  lineHeight: 1.6,
  fontWeight: 400,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8f9fa',
  color: '#1890FF',
  fontSize: 28,
  border: '2px solid #e9ecef',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: '#1890FF',
    color: 'white',
    border: '2px solid #1890FF',
  },
}));

const DestinationHighlights = ({ destination, highlights, stats }) => {
  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <SectionTitle variant="h2">
            Sobre {destination}
          </SectionTitle>
          <SectionSubtitle variant="h5">
            Descubre por qué este destino es perfecto para tu viaje de ski
          </SectionSubtitle>
        </Box>

        {stats && (
          <Box sx={{ mb: 10 }}>
            <Grid container spacing={3} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <StatCard>
                    <StatValue variant="h3">
                      {stat.value}
                    </StatValue>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#666666',
                        fontWeight: 500,
                        fontSize: '1rem',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </StatCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Grid container spacing={4}>
          {highlights.map((highlight, index) => (
            <Grid item xs={12} md={6} key={index}>
              <HighlightCard>
                <CardContent sx={{ p: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 3 }}>
                    <IconWrapper>
                      <Iconify icon={highlight.icon} />
                    </IconWrapper>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#000000',
                        fontSize: '1.4rem',
                      }}
                    >
                      {highlight.title}
                    </Typography>
                  </Stack>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666666', 
                      mb: 3,
                      lineHeight: 1.6,
                      fontSize: '1rem',
                    }}
                  >
                    {highlight.description}
                  </Typography>
                  {highlight.features && (
                    <Stack spacing={1.5}>
                      {highlight.features.map((feature, featIndex) => (
                        <Typography 
                          key={featIndex} 
                          variant="body2" 
                          sx={{ 
                            color: '#000000',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            fontWeight: 500,
                            fontSize: '0.95rem',
                          }}
                        >
                          <Iconify 
                            icon="eva:checkmark-circle-2-fill" 
                            sx={{ 
                              color: '#10b981', 
                              fontSize: 18,
                              flexShrink: 0,
                            }} 
                          />
                          {feature}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </HighlightCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default DestinationHighlights; 
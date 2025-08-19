import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
} from '@mui/material';
import Iconify from './Iconify';

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: '#fafafa',
  position: 'relative',
}));

const ServiceCard = styled(Card)(({ theme }) => ({
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

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8f9fa',
  color: '#1890FF',
  fontSize: 32,
  border: '2px solid #e9ecef',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: '#1890FF',
    color: 'white',
    border: '2px solid #1890FF',
  },
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

const ConsultButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #1890FF 0%, #74CAFF 100%)',
  color: 'white',
  border: 'none',
  boxShadow: '0 8px 25px rgba(24, 144, 255, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #0C53B7 0%, #1890FF 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(24, 144, 255, 0.4)',
    border: 'none',
  },
}));

const IncludedServices = ({ services, onConsultClick }) => {
  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <SectionTitle variant="h2">
            ¿Qué incluye tu viaje?
          </SectionTitle>
          <SectionSubtitle variant="h5">
            Todo organizado para que solo te preocupes por disfrutar
          </SectionSubtitle>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ServiceCard>
                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                  <IconWrapper>
                    <Iconify icon={service.icon} />
                  </IconWrapper>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 700,
                      color: '#000000',
                      fontSize: '1.3rem',
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666666', 
                      mb: 2,
                      lineHeight: 1.6,
                      fontSize: '1rem',
                    }}
                  >
                    {service.description}
                  </Typography>
                  {service.details && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1890FF', 
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      {service.details}
                    </Typography>
                  )}
                </CardContent>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <ConsultButton
            variant="contained"
            size="large"
            onClick={onConsultClick}
          >
            Consultar disponibilidad
          </ConsultButton>
        </Box>
      </Container>
    </RootStyle>
  );
};

export default IncludedServices; 
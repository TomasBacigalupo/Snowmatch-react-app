import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import Iconify from './Iconify';

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: '#ffffff',
  position: 'relative',
}));

const USPCard = styled(Card)(({ theme }) => ({
  height: '100%',
  textAlign: 'center',
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
  width: 90,
  height: 90,
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1890FF 0%, #74CAFF 100%)',
  color: 'white',
  fontSize: 36,
  boxShadow: '0 10px 30px rgba(24, 144, 255, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: '0 15px 40px rgba(24, 144, 255, 0.4)',
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

const USPGrid = ({ benefits }) => {
  return (
    <RootStyle>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <SectionTitle variant="h2">
            ¿Por qué elegir Snowmatch?
          </SectionTitle>
          <SectionSubtitle variant="h5">
            Todo lo que necesitas para tu viaje de ski en un solo lugar
          </SectionSubtitle>
        </Box>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <USPCard>
                <CardContent sx={{ p: 0 }}>
                  <IconWrapper>
                    <Iconify icon={benefit.icon} />
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
                    {benefit.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666666',
                      lineHeight: 1.6,
                      fontSize: '1rem',
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </CardContent>
              </USPCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  );
};

export default USPGrid; 
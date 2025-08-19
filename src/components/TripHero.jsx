import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Stack,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DateRangePicker } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es, ptBR } from 'date-fns/locale';
import Iconify from './Iconify';
import { useWhatsAppLink } from '../hooks/useWhatsAppLink';
import useLocales from '../hooks/useLocales';

const HeroRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  minHeight: '90vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #1890FF 0%, #74CAFF 25%, #ffffff 50%)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(24, 144, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '80vh',
  },
}));

const BackgroundImage = styled('div')(({ theme, imageUrl }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.15,
  zIndex: 0,
  filter: 'brightness(1.2) contrast(1.1)',
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(8),
    alignItems: 'center',
  },
}));

            const BookingCard = styled(Card)(({ theme }) => ({
              padding: theme.spacing(4),
              borderRadius: 24,
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              },
              [theme.breakpoints.down('md')]: {
                marginTop: theme.spacing(4),
                marginBottom: theme.spacing(4),
                padding: theme.spacing(3),
              },
            }));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
  },
}));

const WhatsAppButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #1890FF 0%, #74CAFF 100%)',
  boxShadow: '0 8px 25px rgba(24, 144, 255, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #0C53B7 0%, #1890FF 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(24, 144, 255, 0.4)',
  },
}));

const TripHero = ({ 
  destination, 
  title, 
  subtitle, 
  heroImage, 
  altText,
  phone = '+5492944567890' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentLang } = useLocales();
  
                const [dateRange, setDateRange] = useState([null, null]);
  const [pax, setPax] = useState({
    adultos: 2,
    menores: 0,
  });
  const [nivel, setNivel] = useState('intermedio');

  const pageUrl = window.location.href;
                const whatsappLink = useWhatsAppLink({
                phone,
                destino: destination,
                dates: {
                  checkin: dateRange[0],
                  checkout: dateRange[1],
                },
                pax,
                nivel,
                pageUrl,
              });

  const handleWhatsAppClick = () => {
    // Tracking event
                    if (window.gtag) {
                  window.gtag('event', 'cta_whatsapp_click', {
                    destination,
                    dates: dateRange[0] && dateRange[1] ? `${dateRange[0]} - ${dateRange[1]}` : 'undefined',
                    pax: `${pax.adultos} adultos, ${pax.menores} menores`,
                    nivel,
                  });
                }
    window.open(whatsappLink, '_blank');
  };

  const getLocale = () => {
    switch (currentLang.value) {
      case 'pt':
        return ptBR;
      default:
        return es;
    }
  };

  return (
    <HeroRoot>
      <BackgroundImage imageUrl={heroImage} />
                        <ContentWrapper maxWidth="lg">
                    <Box sx={{ pt: { xs: 8, md: 0 } }}>
                      <Typography
                        variant="h1"
                        sx={{
                          color: '#000000',
                          fontWeight: 800,
                          fontSize: { xs: '2.8rem', md: '4rem' },
                          mb: 3,
                          lineHeight: 1.1,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#666666',
                          fontWeight: 400,
                          fontSize: { xs: '1.3rem', md: '1.6rem' },
                          mb: 4,
                          lineHeight: 1.4,
                          maxWidth: 600,
                        }}
                      >
                        {subtitle}
                      </Typography>
        </Box>

        <BookingCard>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4, 
              fontWeight: 700,
              color: '#000000',
              textAlign: 'center',
            }}
          >
            Armar mi viaje
          </Typography>
          
          <Stack spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getLocale()}>
              <DateRangePicker
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                renderInput={(startProps, endProps) => (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <StyledTextField {...startProps} fullWidth />
                    <Typography variant="body2" sx={{ color: '#666666', fontWeight: 500 }}>
                      hasta
                    </Typography>
                    <StyledTextField {...endProps} fullWidth />
                  </Stack>
                )}
                minDate={new Date()}
              />
            </LocalizationProvider>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <StyledFormControl fullWidth>
                <InputLabel>Adultos</InputLabel>
                <Select
                  value={pax.adultos}
                  label="Adultos"
                  onChange={(e) => setPax(prev => ({ ...prev, adultos: e.target.value }))}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'adulto' : 'adultos'}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <StyledFormControl fullWidth>
                <InputLabel>Menores</InputLabel>
                <Select
                  value={pax.menores}
                  label="Menores"
                  onChange={(e) => setPax(prev => ({ ...prev, menores: e.target.value }))}
                >
                  {[0, 1, 2, 3, 4].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'menor' : 'menores'}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Stack>

            <StyledFormControl fullWidth>
              <InputLabel>Nivel de ski</InputLabel>
              <Select
                value={nivel}
                label="Nivel de ski"
                onChange={(e) => setNivel(e.target.value)}
              >
                <MenuItem value="principiante">Principiante</MenuItem>
                <MenuItem value="intermedio">Intermedio</MenuItem>
                <MenuItem value="avanzado">Avanzado</MenuItem>
                <MenuItem value="experto">Experto</MenuItem>
              </Select>
            </StyledFormControl>

            <WhatsAppButton
              variant="contained"
              size="large"
              onClick={handleWhatsAppClick}
              fullWidth
            >
              Armar mi viaje
            </WhatsAppButton>
          </Stack>
        </BookingCard>
      </ContentWrapper>
    </HeroRoot>
  );
};

export default TripHero; 
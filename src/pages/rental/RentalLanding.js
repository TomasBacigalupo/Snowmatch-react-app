import { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Rating,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Helmet } from 'react-helmet-async';
import {
  LocalShipping,
  Settings,
  Refresh,
  Star,
  CheckCircle,
  Support,
  Security,
  Speed,
} from '@mui/icons-material';
import RentalSearchCard from '../../components/rental/RentalSearchCard';
import FAQAccordion from '../../components/rental/FAQAccordion';
import { RentalOrganizationSchema } from '../../components/seo/RentalSchemas';

// ----------------------------------------------------------------------

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

const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #1890FF 0%, #74CAFF 100%)',
  color: '#000000',
  boxShadow: '0 8px 25px rgba(24, 144, 255, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #0C53B7 0%, #1890FF 100%)',
    color: '#000000',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(24, 144, 255, 0.4)',
  },
  '&:disabled': {
    background: '#CCCCCC',
    color: '#666666',
    transform: 'none',
    boxShadow: 'none',
  },
}));

const benefits = [
  {
    icon: LocalShipping,
    title: 'Entrega a domicilio',
    description: 'Te llevamos el equipo al hotel, departamento o al pie del cerro',
  },
  {
    icon: Settings,
    title: 'Ajuste profesional',
    description: 'Ajuste en sitio por técnicos certificados incluido',
  },
  {
    icon: Refresh,
    title: 'Cambios sin costo',
    description: 'Cambios de equipo durante tu estadía sin cargo adicional',
  },
  {
    icon: Support,
    title: 'Soporte en pista',
    description: 'Asistencia técnica disponible en el cerro',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Elegí tu equipo',
    description: 'Selecciona entre esquí, snowboard y accesorios según tu nivel',
  },
  {
    step: '2',
    title: 'Coordinamos la entrega',
    description: 'Te entregamos en el lugar y horario que prefieras',
  },
  {
    step: '3',
    title: 'Esquiá, nosotros retiramos',
    description: 'Disfruta tu día y nosotros retiramos el equipo al finalizar',
  },
];

const testimonials = [
  {
    name: 'María González',
    location: 'Bariloche',
    rating: 5,
    comment: 'Excelente servicio. El equipo llegó perfecto y el ajuste fue impecable. Definitivamente volveré a usar Snowmatch.',
    avatar: '/assets/avatars/avatar_1.png',
  },
  {
    name: 'Carlos Rodríguez',
    location: 'Chapelco',
    rating: 5,
    comment: 'Muy profesional. La entrega fue puntual y el equipo estaba en perfectas condiciones. Altamente recomendado.',
    avatar: '/assets/avatars/avatar_2.png',
  },
  {
    name: 'Ana Martínez',
    location: 'Las Leñas',
    rating: 4,
    comment: 'Gran experiencia. El proceso fue muy fácil y el equipo funcionó perfectamente. El soporte en pista fue genial.',
    avatar: '/assets/avatars/avatar_3.png',
  },
];

// ----------------------------------------------------------------------

export default function RentalLanding() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchCardRef = useRef();
  
  const [dateRange, setDateRange] = useState([null, null]);
  const [location, setLocation] = useState('');
  const [pax, setPax] = useState({
    adultos: 1,
    menores: 0,
  });

  const scrollToSearch = () => {
    searchCardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = () => {
    if (location && dateRange[0] && dateRange[1]) {
      // Navigate to location page with search params
      const searchParams = new URLSearchParams({
        delivery_date: dateRange[0].toISOString().split('T')[0],
        pickup_date: dateRange[1].toISOString().split('T')[0],
        adults: pax.adultos,
        kids: pax.menores,
      });
      window.location.href = `/rental/${location}?${searchParams.toString()}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>Alquiler Premium de Esquí | Snowmatch</title>
        <meta name="description" content="Alquiler premium de equipos de esquí y snowboard con entrega a domicilio. Ajuste profesional incluido. Bariloche, Chapelco, Las Leñas y más." />
        <meta property="og:title" content="Alquiler Premium de Esquí | Snowmatch" />
        <meta property="og:description" content="Alquiler premium de equipos de esquí y snowboard con entrega a domicilio. Ajuste profesional incluido." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://snowmatch.com/rental" />
        <meta property="og:image" content="https://snowmatch.com/assets/rental-hero.jpg" />
      </Helmet>

      <RentalOrganizationSchema />

      {/* Hero Section */}
      <HeroRoot>
        <BackgroundImage imageUrl="/assets/bariloche.jpg" />
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
              Rental premium de esquí, entregado donde estés
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
              Te lo llevamos al hotel, depto o al pie del cerro. Ajuste profesional incluido.
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
              Encuentra tu equipo perfecto
            </Typography>
            
            <Stack spacing={3}>
              <StyledFormControl fullWidth>
                <InputLabel>Destino</InputLabel>
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  label="Destino"
                >
                  <MenuItem value="bariloche">Bariloche</MenuItem>
                  <MenuItem value="chapelco">Chapelco</MenuItem>
                  <MenuItem value="cerro-catedral">Cerro Catedral</MenuItem>
                  <MenuItem value="las-lenas">Las Leñas</MenuItem>
                  <MenuItem value="valle-nevado">Valle Nevado</MenuItem>
                  <MenuItem value="portillo">Portillo</MenuItem>
                </Select>
              </StyledFormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DateRangePicker
                  value={dateRange}
                  onChange={(newValue) => {
                    setDateRange(newValue);
                    if (newValue[0] && newValue[1]) {
                      setTimeout(() => {
                        const event = new MouseEvent('mousedown', {
                          bubbles: true,
                          cancelable: true,
                          view: window
                        });
                        document.body.dispatchEvent(event);
                      }, 100);
                    }
                  }}
                  minDate={new Date()}
                  localeText={{ start: 'Desde', end: 'Hasta' }}
                  slots={{ textField: StyledTextField }}
                  slotProps={{ textField: { fullWidth: true } }}
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
                  <InputLabel>Niños</InputLabel>
                  <Select
                    value={pax.menores}
                    label="Niños"
                    onChange={(e) => setPax(prev => ({ ...prev, menores: e.target.value }))}
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} {num === 0 ? 'niños' : num === 1 ? 'niño' : 'niños'}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Stack>

              <SearchButton
                variant="contained"
                size="large"
                onClick={handleSearch}
                fullWidth
                disabled={!location || !dateRange[0] || !dateRange[1]}
              >
                Ver equipos disponibles
              </SearchButton>
            </Stack>
          </BookingCard>
        </ContentWrapper>
      </HeroRoot>

      {/* Benefits Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.neutral' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
            }}
          >
            ¿Por qué elegir Snowmatch?
          </Typography>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.main',
                    }}
                  >
                    <benefit.icon sx={{ fontSize: 32 }} />
                  </Avatar>
                  
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {benefit.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
            }}
          >
            Cómo funciona
          </Typography>

          <Grid container spacing={4}>
            {howItWorks.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 3,
                    position: 'relative',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      fontWeight: 700,
                    }}
                  >
                    {step.step}
                  </Avatar>
                  
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary">
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.neutral' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
            }}
          >
            Lo que dicen nuestros clientes
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 3,
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 56, height: 56 }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.location}
                        </Typography>
                      </Box>
                    </Stack>

                    <Rating value={testimonial.rating} readOnly />

                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <FAQAccordion />
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              ¿Listo para tu próxima aventura?
            </Typography>
            
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Reserva tu equipo ahora y disfruta de la mejor experiencia de esquí
            </Typography>

                         <Button
               variant="contained"
               size="large"
               onClick={handleSearch}
               disabled={!location || !dateRange[0] || !dateRange[1]}
               sx={{
                 py: 2,
                 px: 6,
                 fontSize: '1.2rem',
                 fontWeight: 600,
                 borderRadius: 2,
                 bgcolor: 'white',
                 color: 'primary.main',
                 '&:hover': {
                   bgcolor: 'grey.100',
                 },
               }}
             >
               Empezar ahora
             </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
} 
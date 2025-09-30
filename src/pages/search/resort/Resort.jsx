import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Stack, Grid, Card, CardContent, Button, Chip, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { m } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useLocales from 'src/hooks/useLocales';
import { MotionViewport, varFade } from 'src/components/animate';
import Image from 'src/components/Image';
import Iconify from 'src/components/Iconify';
import RecommendedTeachers from 'src/sections/home/RecommendedTeachers';
import FaqsByContext from 'src/sections/home/FAQSByContext';
import { formatSlug } from 'src/utils/slugHelper';
import { resortTransformation } from 'src/utils/resortTransformation';
import TopTeachersSection from 'src/components/TopTeachersSection';

// ----------------------------------------------------------------------

// Airbnb-style Hero Section
const HeroRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    minHeight: '60vh',
  },
}));

const HeroImage = styled('div')(({ theme, imageUrl }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.3,
  zIndex: 0,
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'left',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

// Airbnb-style Cards
const LessonTypeCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  border: '1px solid #e0e0e0',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
    borderColor: '#000',
  },
}));


const InstructorSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#f7f7f7',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
}));

const VideoCoachSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  padding: theme.spacing(10, 0),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  color: '#222222',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    fontSize: '1.75rem',
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  color: '#717171',
  marginBottom: theme.spacing(4),
  lineHeight: 1.5,
}));

const AirbnbButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1.5, 3),
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
}));

// ----------------------------------------------------------------------

export default function ResortLanding() {
  const { translate } = useLocales();
  const theme = useTheme();
  const navigate = useNavigate();
  const { resort } = useParams();
  
  const [resortData, setResortData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockResortData = {
      name: resortTransformation(resort),
      slug: resort,
      image: `/assets/${resort}.png`,
      description: `Centro de esquí ${resortTransformation(resort)} con instructores certificados y las mejores pistas de Argentina.`,
      location: 'Argentina',
      lessonTypes: [
        { type: 'ski', label: 'Ski', icon: 'eva:car-outline' },
        { type: 'snowboard', label: 'Snowboard', icon: 'eva:car-outline' },
      ],
      categories: [
        { type: 'private', label: 'Clases Privadas', description: 'Atención personalizada' },
        { type: 'group', label: 'Clases Grupales', description: 'Aprende con otros' },
        { type: 'children', label: 'Clases para Niños', description: 'Especializado en niños' },
      ],
    };

    const mockTeachers = [
      {
        id: 1,
        name: 'Carlos',
        lastname: 'Mendoza',
        imageLink: '/assets/avatars/avatar_1.jpg',
        stars: 4.9,
        level: 'Experto',
        information: 'Instructor certificado con 8 años de experiencia',
        email: 'carlos@example.com',
        resorts: [resortTransformation(resort)],
      },
      {
        id: 2,
        name: 'Ana',
        lastname: 'Rodriguez',
        imageLink: '/assets/avatars/avatar_2.jpg',
        stars: 4.8,
        level: 'Avanzado',
        information: 'Especializada en clases para niños y principiantes',
        email: 'ana@example.com',
        resorts: [resortTransformation(resort)],
      },
      {
        id: 3,
        name: 'Miguel',
        lastname: 'Torres',
        imageLink: '/assets/avatars/avatar_3.jpg',
        stars: 4.9,
        level: 'Experto',
        information: 'Especialista en freestyle y snowboard extremo',
        email: 'miguel@example.com',
        resorts: [resortTransformation(resort)],
      },
    ];

    setResortData(mockResortData);
    setTeachers(mockTeachers);
    setLoading(false);
  }, [resort]);

  const handleLessonTypeClick = (lessonType) => {
    navigate(`/${resort}/${lessonType.type}`);
  };

  const handleInstructorClick = () => {
    navigate('/instructor');
  };

  const handleVideoCoachClick = () => {
    navigate('/video-coach');
  };

  if (loading || !resortData) {
    return <Box>Loading...</Box>;
  }

  return (
    <>
      <Helmet>
        <title>{`${resortData.name} - Clases de Ski y Snowboard | SnowMatch`}</title>
        <meta name="description" content={`Aprende ski y snowboard en ${resortData.name} con los mejores instructores certificados de Argentina. Clases privadas y grupales disponibles.`} />
      </Helmet>

      {/* Hero Section - Airbnb Style */}
      <HeroRoot>
        <HeroImage imageUrl={resortData.image} />
        <ContentWrapper maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <m.div variants={varFade().inLeft}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 600,
                    color: '#222222',
                    mb: 2,
                    lineHeight: 1.2,
                  }}
                >
                  {resortData.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#717171',
                    mb: 4,
                    fontSize: '1.25rem',
                    lineHeight: 1.5,
                  }}
                >
                  {resortData.description}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                  <Chip
                    icon={<Iconify icon="eva:pin-outline" />}
                    label={resortData.location}
                    sx={{ 
                      backgroundColor: '#f7f7f7',
                      color: '#222222',
                      border: '1px solid #e0e0e0',
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    icon={<Iconify icon="eva:star-outline" />}
                    label="Instructores Certificados"
                    sx={{ 
                      backgroundColor: '#f7f7f7',
                      color: '#222222',
                      border: '1px solid #e0e0e0',
                      fontWeight: 500,
                    }}
                  />
                </Stack>
                <AirbnbButton
                  variant="contained"
                  size="large"
                  onClick={() => navigate(`/${resort}/ski`)}
                  sx={{
                    backgroundColor: '#222222',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#000000',
                    },
                  }}
                >
                  Ver Instructores
                </AirbnbButton>
              </m.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <m.div variants={varFade().inRight}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  }}
                >
                  <Image
                    src={resortData.image}
                    alt={resortData.name}
                    sx={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </m.div>
            </Grid>
          </Grid>
        </ContentWrapper>
      </HeroRoot>

      {/* Top Teachers Section */}
      <TopTeachersSection
        teachers={teachers}
        title={`Los mejores instructores en ${resortData.name}`}
        subtitle="Conecta con instructores certificados y experimentados"
        fullBlack={false}
      />

      {/* Lesson Types Section - Airbnb Style */}
      <Box sx={{ py: 10, backgroundColor: '#f7f7f7' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <SectionTitle>
              Tipos de clases disponibles
            </SectionTitle>
            <SectionSubtitle>
              Elige la modalidad que mejor se adapte a tu estilo de aprendizaje
            </SectionSubtitle>
          </Box>

          <Grid container spacing={4}>
            {resortData.categories.map((category, index) => (
              <Grid item xs={12} md={4} key={category.type}>
                <LessonTypeCard onClick={() => handleLessonTypeClick(category)}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '12px',
                        backgroundColor: '#222222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <Iconify
                        icon="eva:person-outline"
                        width={32}
                        height={32}
                        sx={{ color: 'white' }}
                      />
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#222222' }}>
                      {category.label}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#717171', lineHeight: 1.5 }}>
                      {category.description}
                    </Typography>
                    <AirbnbButton 
                      variant="outlined" 
                      fullWidth
                      sx={{
                        borderColor: '#222222',
                        color: '#222222',
                        '&:hover': {
                          borderColor: '#000000',
                          backgroundColor: '#f7f7f7',
                        },
                      }}
                    >
                      Ver clases
                    </AirbnbButton>
                  </CardContent>
                </LessonTypeCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Are You An Instructor Section - Airbnb Style */}
      <InstructorSection>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <SectionTitle sx={{ color: '#222222' }}>
              ¿Eres instructor?
            </SectionTitle>
            <SectionSubtitle sx={{ color: '#717171', mb: 6 }}>
              Únete a nuestra plataforma y conecta con estudiantes de todo el mundo. 
              Ofrece tus servicios como instructor certificado y crece tu negocio.
            </SectionSubtitle>
            
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: '#222222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Iconify icon="eva:checkmark-circle-2-outline" width={24} height={24} sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#222222', mb: 1 }}>
                    Registro gratuito
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#717171' }}>
                    Comienza sin costo alguno
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: '#222222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Iconify icon="eva:people-outline" width={24} height={24} sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#222222', mb: 1 }}>
                    Más estudiantes
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#717171' }}>
                    Amplía tu base de clientes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: '#222222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Iconify icon="eva:credit-card-outline" width={24} height={24} sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#222222', mb: 1 }}>
                    Pagos seguros
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#717171' }}>
                    Recibe pagos de forma segura
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <AirbnbButton
              variant="contained"
              size="large"
              onClick={handleInstructorClick}
              sx={{
                backgroundColor: '#222222',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#000000',
                },
              }}
            >
              Registrarse como instructor
            </AirbnbButton>
          </Box>
        </Container>
      </InstructorSection>

      {/* Video Coach Section - Airbnb Style */}
      <VideoCoachSection>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <SectionTitle>
                Video Coach
              </SectionTitle>
              <SectionSubtitle sx={{ mb: 4 }}>
                Mejora tu técnica con nuestro sistema de análisis de video. 
                Sube tus videos y recibe feedback personalizado de instructores profesionales.
              </SectionSubtitle>
              
              <Stack spacing={3} sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      backgroundColor: '#f7f7f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                    }}
                  >
                    <Iconify icon="eva:video-outline" width={20} height={20} sx={{ color: '#222222' }} />
                  </Box>
                  <Typography variant="body1" sx={{ color: '#222222', fontWeight: 500 }}>
                    Análisis de técnica en video
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      backgroundColor: '#f7f7f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                    }}
                  >
                    <Iconify icon="eva:message-circle-outline" width={20} height={20} sx={{ color: '#222222' }} />
                  </Box>
                  <Typography variant="body1" sx={{ color: '#222222', fontWeight: 500 }}>
                    Feedback personalizado
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      backgroundColor: '#f7f7f7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                    }}
                  >
                    <Iconify icon="eva:trending-up-outline" width={20} height={20} sx={{ color: '#222222' }} />
                  </Box>
                  <Typography variant="body1" sx={{ color: '#222222', fontWeight: 500 }}>
                    Seguimiento de progreso
                  </Typography>
                </Box>
              </Stack>
              
              <AirbnbButton
                variant="contained"
                size="large"
                onClick={handleVideoCoachClick}
                sx={{
                  backgroundColor: '#222222',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#000000',
                  },
                }}
              >
                Probar Video Coach
              </AirbnbButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                }}
              >
                <Image
                  src="/assets/video-coach-preview.jpg"
                  alt="Video Coach Preview"
                  sx={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'white',
                      transform: 'translate(-50%, -50%) scale(1.1)',
                    },
                  }}
                >
                  <Iconify icon="eva:play-fill" width={40} height={40} sx={{ color: '#222222' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </VideoCoachSection>

      {/* Resort FAQs Section - Airbnb Style */}
      <Box sx={{ py: 10, backgroundColor: '#f7f7f7' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <SectionTitle>
              Preguntas frecuentes
            </SectionTitle>
            <SectionSubtitle>
              Encuentra respuestas a las preguntas más comunes sobre {resortData.name}
            </SectionSubtitle>
          </Box>
          <FaqsByContext resort={resort} />
        </Container>
      </Box>
    </>
  );
}


import { m } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack, Grid, Select, Hidden, Card, Avatar, Chip } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../routes/paths';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import TextIconLabel from '../../components/TextIconLabel';
import { MotionContainer, varFade } from '../../components/animate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import useLocales from 'src/hooks/useLocales';
import { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelect } from 'src/components/hook-form';
import HomeLearnToSki from './HomeLearnToSki';
import HoverButton from 'src/components/HoverButton';
// A/B Testing
import { getHomeHeroCTAVariant, trackHomeHeroCTAClick } from '../../utils/abTesting';
import '../../utils/testABTesting'; // Load test functions for development

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  background: `
    radial-gradient(circle at 20% 80%, rgba(51, 153, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 51, 102, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(153, 255, 255, 0.06) 0%, transparent 50%),
    linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)
  `,
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden', // importante para que las pistas que salen del hero no creen scroll
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
  },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  width: '100%',
  maxWidth: '1200px',
  [theme.breakpoints.up('md')]: {
    textAlign: 'center',
  },
}));

const HeroOverlayStyle = styled(m.img)({
  zIndex: 9,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const HeroImgStyle = styled(m.div)(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  zIndex: 10,
  width: '100%',
  margin: 'auto',
  position: 'absolute',
  [theme.breakpoints.up('lg')]: {
    right: '8%',
    width: 'auto',
    height: '48vh',
  },
}));

// ------------------ SkiTracks Component ------------------

const TracksWrapper = styled('div')({
  position: 'absolute',
  inset: 0,
  zIndex: 6, // detrás del contenido principal (zIndex 10)
  pointerEvents: 'none', // para que no interfieran con clicks
  overflow: 'hidden',
});

// Una curva base tipo "S" que luego posicionamos y escalamos
function SkiTracks() {
  // animación común para las tracks: se dibujan de arriba hacia abajo y se difuminan lentamente
  const commonTransition = (delay = 0, dur = 20) => ({
    strokeDashoffset: [1000, 0, 0], // se dibuja de arriba hacia abajo y se mantiene visible
    opacity: [0, 0.55, 0.55, 0], // aparece, se mantiene visible más tiempo, luego se difumina lentamente
    transition: {
      duration: dur,
      repeat: Infinity,
      ease: 'linear',
      delay,
      times: [0, 0.4, 0.8, 1], // 40% del tiempo para dibujar, 40% visible, 20% para desvanecer
    },
  });

  // paths con formas sutiles (puedes editar las curvas)
  // cada path usa stroke con baja opacidad para parecer huella en la nieve
  return (
    <TracksWrapper aria-hidden>
      {/* Track 1 - izquierda (slalom) */}
      <m.svg
        width="280"
        viewBox="0 0 200 700"
        style={{ position: 'absolute', left: '6%', top: '-15%', zIndex: 6 }}
      >
        <m.path
          d="M10 30 C50 80, 90 50, 130 100 C170 150, 130 200, 90 250 C50 300, 90 350, 130 400 C170 450, 130 500, 90 550 C50 600, 90 650, 130 700"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000 1000"
          style={{ opacity: 0.18 }}
          animate={commonTransition(0, 24)}
        />
        <m.path
          d="M15 30 C55 80, 95 50, 135 100 C175 150, 135 200, 95 250 C55 300, 95 350, 135 400 C175 450, 135 500, 95 550 C55 600, 95 650, 135 700"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000 1000"
          style={{ opacity: 0.18 }}
          animate={commonTransition(0, 24)}
        />
      </m.svg>

      {/* Track 2 - centro-izquierda (slalom fino) */}
      <m.svg
        width="220"
        viewBox="0 0 200 700"
        style={{ position: 'absolute', left: '22%', top: '-5%', zIndex: 6 }}
      >
        <m.path
          d="M20 20 C60 70, 100 40, 140 90 C180 140, 140 190, 100 240 C60 290, 100 340, 140 390 C180 440, 140 490, 100 540 C60 590, 100 640, 140 690"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000 1000"
          style={{ opacity: 0.14 }}
          animate={commonTransition(3, 20)}
        />
        <m.path
          d="M24 20 C64 70, 104 40, 144 90 C184 140, 144 190, 104 240 C64 290, 104 340, 144 390 C184 440, 144 490, 104 540 C64 590, 104 640, 144 690"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000 1000"
          style={{ opacity: 0.14 }}
          animate={commonTransition(3, 20)}
        />
      </m.svg>

      {/* Track 3 - centro-derecha (slalom pronunciado) */}
      <m.svg
        width="320"
        viewBox="0 0 250 700"
        style={{ position: 'absolute', right: '18%', top: '-20%', zIndex: 6 }}
      >
        <m.path
          d="M10 40 C50 90, 90 60, 130 110 C170 160, 130 210, 90 260 C50 310, 90 360, 130 410 C170 460, 130 510, 90 560 C50 610, 90 660, 130 710"
          fill="none"
          stroke="#0f172a"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000 1000"
          style={{ opacity: 0.16 }}
          animate={commonTransition(1.5, 28)}
        />
        <m.path
          d="M16 40 C56 90, 96 60, 136 110 C176 160, 136 210, 96 260 C56 310, 96 360, 136 410 C176 460, 136 510, 96 560 C56 610, 96 660, 136 710"
          fill="none"
          stroke="#0f172a"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000 1000"
          style={{ opacity: 0.16 }}
          animate={commonTransition(1.5, 28)}
        />
      </m.svg>

      {/* Track 4 - derecha (slalom sutil) */}
      <m.svg
        width="240"
        viewBox="0 0 200 700"
        style={{ position: 'absolute', right: '6%', top: '-10%', zIndex: 6 }}
      >
        <m.path
          d="M30 10 C70 60, 110 30, 150 80 C190 130, 150 180, 110 230 C70 280, 110 330, 150 380 C190 430, 150 480, 110 530 C70 580, 110 630, 150 680"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000 1000"
          style={{ opacity: 0.12 }}
          animate={commonTransition(5, 22)}
        />
        <m.path
          d="M34 10 C74 60, 114 30, 154 80 C194 130, 154 180, 114 230 C74 280, 114 330, 154 380 C194 430, 154 480, 114 530 C74 580, 114 630, 154 680"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000 1000"
          style={{ opacity: 0.12 }}
          animate={commonTransition(5, 22)}
        />
      </m.svg>
    </TracksWrapper>
  );
}

// ----------------------------------------------------------------------

export default function HomeHero() {
  const { translate, currentLang } = useLocales();
  const [value, setValue] = useState(0);
  const [ctaVariant, setCtaVariant] = useState('variant1');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFindInstructors = () => {
    navigate(PATH_GUEST.independent);
  };

  const handleVideoFeedback = () => {
    // Track A/B test conversion
    trackHomeHeroCTAClick(ctaVariant);
    
    // Navigate to video onboarding page
    navigate(`/${currentLang.value}/video-onboarding`);
  };

  // Initialize A/B test variant on component mount
  useEffect(() => {
    const variant = getHomeHeroCTAVariant();
    setCtaVariant(variant);
  }, []);

  const defaultValues = {
    resort: "Catedral",
  };

  const methods = useForm({
    resolver: yupResolver({}),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
    setError
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <MotionContainer>
      <RootStyle>
        {/* Aquí se agregan las huellas animadas */}
        <SkiTracks />

        <Container maxWidth="lg">
          <ContentStyle>
            {/* Main Headline */}
            <m.div variants={varFade().in}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                  fontWeight: 900,
                  lineHeight: 1.2,
                  color: '#1e293b',
                  mb: 2,
                  maxWidth: '900px',
                  mx: 'auto',
                  letterSpacing: '-0.02em',
                }}
              >
                {translate('homeHero.headlinePart1')}{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 900
                  }}
                >
                  {translate('homeHero.headlinePart2')}
                </Box>
              </Typography>
            </m.div>

            {/* Description */}
            <m.div variants={varFade().in}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: '#334155',
                  maxWidth: '600px',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                {translate('homeHero.description')}
              </Typography>
            </m.div>

            {/* Customer Proof */}
            <m.div variants={varFade().in}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
                <Stack direction="row" spacing={-1}>
                  <Avatar sx={{ width: 32, height: 32, border: '2px solid white' }}>
                    <AccountCircleIcon />
                  </Avatar>
                  <Avatar sx={{ width: 32, height: 32, border: '2px solid white' }}>
                    <AccountCircleIcon />
                  </Avatar>
                  <Avatar sx={{ width: 32, height: 32, border: '2px solid white' }}>
                    <AccountCircleIcon />
                  </Avatar>
                </Stack>
                <Typography variant="body1" sx={{ color: '#475569', fontWeight: 500 }}>
                  {translate('homeHero.happyCustomers')}
                </Typography>
              </Stack>
            </m.div>

            {/* Call to Action Buttons */}
            <m.div variants={varFade().in}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                sx={{ mb: 3 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleVideoFeedback}
                  sx={{
                    background: 'linear-gradient(135deg, #1890FF 0%, #74CAFF 50%, #1890FF 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(24, 144, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0C53B7 0%, #1890FF 50%, #0C53B7 100%)',
                      boxShadow: '0 12px 40px rgba(24, 144, 255, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                  }}
                >
                  {translate(`homeHero.ctaVariants.${ctaVariant}`)}
                </Button>
              </Stack>
            </m.div>

            {/* Available For Section */}
            <m.div variants={varFade().in}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="overline" sx={{ color: '#475569', fontSize: '0.75rem', fontWeight: 600 }}>
                  {translate('homeHero.availableOn')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  {/* App Store Badge */}
                  <Box
                    component="a"
                    href="#"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 3,
                      py: 1.5,
                      bgcolor: '#000',
                      color: 'white',
                      borderRadius: 2,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      minWidth: 180,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <Iconify icon="bi:apple" width={28} height={28} />
                    <Stack spacing={0.2} alignItems="flex-start">
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
                        {translate('homeHero.downloadOnThe')}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1 }}>
                        {translate('homeHero.appStore')}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Google Play Badge */}
                  <Box
                    component="a"
                    href="#"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 3,
                      py: 1.5,
                      bgcolor: '#000',
                      color: 'white',
                      borderRadius: 2,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      minWidth: 180,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <Iconify icon="bi:google-play" width={28} height={28} />
                    <Stack spacing={0.2} alignItems="flex-start">
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', lineHeight: 1 }}>
                        {translate('homeHero.getItOn')}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1 }}>
                        {translate('homeHero.googlePlay')}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </m.div>
          </ContentStyle>
        </Container>
      </RootStyle>
    </MotionContainer>
  );
}
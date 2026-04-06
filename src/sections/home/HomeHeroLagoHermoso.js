import { m } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack, Grid, Select, Card, Avatar } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import TextIconLabel from '../../components/TextIconLabel';
import { MotionContainer, varFade } from '../../components/animate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import useLocales from 'src/hooks/useLocales';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelect } from 'src/components/hook-form';
import HomeFilterTeachers from './HomeFilterTeachers';
import HoverButton from 'src/components/HoverButton';
import HomeFilterTeachersBariloche from './HomeFilterTeachersBariloche';
import HomeFilterTeachersLagoHermoso from './HomeFilterTeachersLagoHermoso';


// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: 'white',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
  },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15)
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

// ----------------------------------------------------------------------

export default function HomeHeroLagoHermoso() {
  const { translate } = useLocales()
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const SKI_RESORTS = [
    "Aconcagua",
    "Batea Mahuida",
    "Calafate Mountain Park",
    "Caviahue",
    "Cerro Bayo",
    "Cerro Castor",
    "Cerro Catedral",
    "Chapelco",
    "La Hoya",
    "Las Leñas",
    "Las Pendientes",
    "Los Penitentes",
    "Los Puquios",
    "Monte Bianco",
    "Patagonia Heliski",
    "Perito Moreno",
    "Vallecitos"
  ]

  const defaultValues = {
    resort: "Catedral",
  }

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
    console.log(data)
  }
  return (
    <MotionContainer sx={{
      height: '100vh',
      backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%), ' + 'url(/assets/bariloche.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      
      <Container sx={{
        height: '100%',
        width: '100%',
      }}>
        <ContentStyle>
          <Grid container spacing={2} justifyContent='center' alignItems='space-between' sx={{
            textAlign: 'center',
            height: '100%',
          }}>
            <Grid item xs={12} container spacing={6}>
              <Grid item xs={12}>
                <Typography variant="h1" sx={{ color: 'white' }}>
                  Clases de ski en Lago Hermoso
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                  Reservá tu clase de ski en el Lago Hermoso en menos de un minuto con SnowMatch.
                </Typography>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
            <br /><br />
              <HomeFilterTeachersLagoHermoso />
            </Grid>
            <br /><br /><br /><br /><br /><br />
            <Grid item xs={6}>
              <a href="hhttps://snowmatch.pro/match/teacher/167" style={{
                color: 'white',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }} > Azul </a>
            </Grid>
            <Grid item xs={6}>
              <a href="https://snowmatch.pro/match/teacher/682" style={{
                color: 'white',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }} > Francisco </a>
            </Grid>
            <Grid item xs={6}>
              <a href="https://snowmatch.pro/match/product/148" style={{
                color: 'white',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }} > Niños </a>
            </Grid>
            <Grid item xs={6}>
              <a href="https://snowmatch.pro/match/product/147" style={{
                color: 'white',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }} > Familias </a>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  );
}

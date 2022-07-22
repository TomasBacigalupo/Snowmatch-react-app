import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack, Grid, Select } from '@mui/material';
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

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
  },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left',
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

// ----------------------------------------------------------------------

export default function HomeHero() {
  const {translate} = useLocales()
  const [value, setValue] = useState(0);

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
    <MotionContainer>
      <RootStyle>
        <HeroOverlayStyle
          alt="overlay"
          src="/assets/overlay.svg"
          variants={varFade().in}
        />

        <Container>
          <ContentStyle>
            <Grid container spacing={0}>
              <Grid item xs={12} md={6.5}>
                <HomeFilterTeachers />
              </Grid>
              <Grid item xs={12} md={5.5}>
                <m.div variants={varFade().inRight}>
                  <Typography variant="h1" sx={{ color: 'common.white' }}>
                    {translate('landingPRO.heroTitle1')}<br />
                    {translate('landingPRO.heroTitle2')}
                    <Typography component="span" variant="h1" sx={{ color: 'primary.main' }}>
                      &nbsp;SnowMatch
                    </Typography>
                  </Typography>
                </m.div>

                <m.div variants={varFade().inRight}>

                  <Typography sx={{ color: 'common.white' }}>
                    {translate('landingPRO.desc1')}
                  </Typography>
                  <Typography sx={{ color: 'common.white' }}>
                    {translate('landingPRO.desc2')}
                  </Typography>
                  <Typography sx={{ color: 'common.white' }}>
                    {translate('landingPRO.desc3')}
                  </Typography>

                </m.div>
                <br/>
                <m.div variants={varFade().inRight}>
                  <Button
                    size="large"
                    variant="contained"
                    component={RouterLink}
                    to={"/auth/register"}
                    sx={{ marginBottom: '10px' }}
                    startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}
                  >
                    {translate('landingPRO.getStarted')}
                  </Button>
                </m.div>
              </Grid>
              

            </Grid>
            

            
            {/* <Stack spacing={2.5} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={
                    <Image
                      alt="whatsApp icon"
                      src="https://minimal-assets-api.vercel.app/assets/images/home/ic_facebook_small.svg"
                      sx={{ width: 20, height: 20, mr: 1 }}
                    />
                  }
                  value={
                    <Link
                      href="https://www.sketch.com/s/76388a4d-d6e5-4b7f-8770-e5446bfa1268"
                      target="_blank"
                      rel="noopener"
                      color="common.white"
                      sx={{ typography: 'body2' }}
                    >
                      Preview Sketch
                    </Link>
                  }
                />
              </m.div>

              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={
                    <Image
                      alt="sketch icon"
                      src="https://minimal-assets-api.vercel.app/assets/images/home/ic_figma_small.svg"
                      sx={{ width: 20, height: 20, mr: 1 }}
                    />
                  }
                  value={
                    <Link
                      href="https://www.figma.com/file/x7earqGD0VGFjFdk5v2DgZ/%5BPreview%5D-Minimal-Web?node-id=866%3A55474"
                      target="_blank"
                      rel="noopener"
                      color="common.white"
                      sx={{ typography: 'body2' }}
                    >
                      Preview Figma
                    </Link>
                  }
                />
              </m.div>
            </Stack> */}

            {/* TODO: ski center icons */}
            {/* <Stack spacing={2.5}>
              <m.div variants={varFade().inRight}>
                <Typography variant="overline" sx={{ color: 'primary.light' }}>
                  Available For
                </Typography>
              </m.div>

              <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                {['ic_sketch', 'ic_figma', 'ic_js', 'ic_ts', 'ic_nextjs'].map((resource) => (
                  <m.img
                    key={resource}
                    variants={varFade().inRight}
                    src={`https://minimal-assets-api.vercel.app/assets/images/home/${resource}.svg`}
                  />
                ))}
              </Stack>
            </Stack> */}
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  );
}

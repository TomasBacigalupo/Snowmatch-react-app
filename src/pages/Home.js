// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeAdvertisement,
} from '../sections/home';
import useAuth from 'src/hooks/useAuth';
import { useEffect } from 'react';
import HomeStats from 'src/sections/home/HomeStats';
import HomePartners from 'src/sections/home/HomePartners';
import HomeStatsHero from 'src/sections/home/HomeStatsHero';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  
  const {user} = useAuth()
 
  useEffect(() => {
    if (user){
      if(user.role === "TEACHER"){
        window.location.href = "/dashboard"
      }
    }
  },[user])
  
  return (
    <Page title="Match a PRO">
      <Helmet>
        <title>Clases de ski y Experiencias</title>
        <meta name="description" content="Clases de ski en Cerro Catedral" />
        <meta property="og:title" content="Clases de ski en el Cerro Catedral para todos los niveles" />
        <meta property="og:description" content="Reservá tu clase en Bariloche en menos de un minuto con SnowMatch. Más de 30 instructores habilitados. ¡Cupos limitados!" />
        <meta property="og:image" content="https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg" />
        <meta property="og:url" content="https://snowmatch.pro" />
        <meta property="og:site_name" content="SnowMatch" />
        <meta property="og:locale" content="es_ES" />
      </Helmet>
      <RootStyle>
        <HomeHero />
        <ContentStyle>
          <HomeStatsHero/>
          <HomePartners/>
          <HomeMinimal />
          <HomeAdvertisement />
          {/* <HomeMinimal />

          <HomeHugePackElements />

          <HomeDarkMode />

          <HomeColorPresets />

          <HomeCleanInterfaces />

          <HomePricingPlans />

          <HomeLookingFor />

          <HomeAdvertisement /> */}
          
        </ContentStyle> 
        
      </RootStyle>
    </Page>
  );
}

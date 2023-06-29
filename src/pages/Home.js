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

// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeAdvertisement,
  HomeHeroBariloche,
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

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      if (user.role === "TEACHER") {
        window.location.href = "/dashboard"
      }
    }
  }, [user])

  return (
    <Page title="Match a PRO">
      <Helmet>
        <title>Clases de ski en Bariloche | SnowMatch</title>
        <meta name="description" content="Clases de ski en Cerro Catedral" />
        <meta property="og:title" content="Clases de ski en Bariloche para todos los niveles" />
        <meta property="og:description" content="Reservá tu clase en Bariloche en menos de un minuto con SnowMatch. Más de 100 instructores habilitados. Clases de ski y snowboard evitando colas y demoras. ¡Cupos limitados!" />
        <meta property="og:image" content="https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg" />
        <meta property="og:url" content="https://snowmatch.pro" />
        <meta property="og:site_name" content="SnowMatch" />
        <meta property="og:locale" content="es_ES" />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://snowmatch.pro/",
            "name": "Snowmatch",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://snowmatch.pro/?s={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "url": "https://snowmatch.pro/match/independent?resort=Cerro%20Catedral"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "url": "https://snowmatch.pro/match/product/143"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "url": "https://snowmatch.pro/match/teacher/14"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "url": "https://snowmatch.pro/match/product/144"
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "url": "https://snowmatch.pro/match/product/145"
                },
                {
                  "@type": "ListItem",
                  "position": 6,
                  "url": "https://snowmatch.pro/match/product/148"
                },
                {
                  "@type": "ListItem",
                  "position": 7,
                  "url": "https://snowmatch.pro/match/product/147"
                },
                {
                  "@type": "ListItem",
                  "position": 8,
                  "url": "https://snowmatch.pro/match/product/146"
                },
                {
                  "@type": "ListItem",
                  "position": 9,
                  "url": "https://snowmatch.pro/match/product/149"
                }
              ]
            }
          }
          `}
        </script>
      </Helmet>
      <RootStyle>
        <HomeHeroBariloche />
        <ContentStyle>
          <HomeStatsHero />
          <HomePartners />
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

// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeAdvertisement,
  HomePricingPlans,
} from '../sections/home';
import HomeWhySnowmatch from 'src/sections/home/HomeWhySnowmatch';
import useAuth from 'src/hooks/useAuth';
import { useEffect, useMemo } from 'react';
import HomeStats from 'src/sections/home/HomeStats';
import HomePartners from 'src/sections/home/HomePartners';
import HomeStatsHero from 'src/sections/home/HomeStatsHero';
import HomeCoaches from 'src/sections/home/HomeCoaches';
import { Helmet } from 'react-helmet-async';
import useLocales from 'src/hooks/useLocales';
import { useLocation } from 'react-router-dom';

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

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// ----------------------------------------------------------------------

export default function HomePage() {

  const { user } = useAuth()
  const { onChangeLang } = useLocales();
  const query = useQuery();

  useEffect(() => {
    const lng = query.get('lng');
    if (lng) {
      // Validar que el idioma sea uno de los soportados: es, en, pt
      const validLanguages = ['es', 'en', 'pt'];
      if (validLanguages.includes(lng.toLowerCase())) {
        onChangeLang(lng.toLowerCase());
      }
    }
  }, [query, onChangeLang]);

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
        <title>Clases de ski y Experiencias</title>
        <meta name="description" content="Clases de ski en Cerro Catedral" />
        <meta property="og:title" content="Clases de ski en el Cerro Catedral para todos los niveles" />
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
        {/* Carga el script externo */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17189136540"></script>

        {/* Inserta el script de configuración como string */}
        <script>
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-17189136540');
  `}
        </script>
      </Helmet>
      <RootStyle>
        <HomeHero />
        <ContentStyle>
          <HomeStatsHero />
          <HomeWhySnowmatch />
          <HomeCoaches />
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
          <HomePricingPlans />

        </ContentStyle>

      </RootStyle>
    </Page>
  );
}

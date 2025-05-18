// @mui
import { styled } from '@mui/material/styles';
// components
// sections
import useAuth from 'src/hooks/useAuth';
import { useEffect, useState } from 'react';
import HomeStats from 'src/sections/home/HomeStats';
import HomePartners from 'src/sections/home/HomePartners';
import HomeStatsHero from 'src/sections/home/HomeStatsHero';
import { Helmet } from 'react-helmet-async';
import { HomeAdvertisement, HomeHero } from 'src/sections/home';
import Page from 'src/components/Page';
import { useParams } from 'react-router';
import ResortDisciplineHero from 'src/sections/home/ResortDisciplineHero';
import { useDispatch, useSelector } from 'src/redux/store';
import { getFreeTeachers } from 'src/redux/slices/teachers';
import useLocales from 'src/hooks/useLocales';
import FaqsByContext from 'src/sections/home/FAQSByContext';
import DownloadAppSection from 'src/sections/home/DounloawdAppSection';

// ----------------------------------------------------------------------

const RESORT_OPTIONS = [
    { id: 'Cerro Catedral', slugs: ['cerro-catedral', 'catedral'] },
    { id: 'Chapelco', slugs: ['cerro-chapelco', 'chapelco'] },
    { id: 'La Hoya', slugs: ['cerro-la-hoya', 'la-hoya'] },
    { id: 'Las Leñas', slugs: ['cerro-las-lenas', 'las-lenas'] },
    { id: 'Caviahue', slugs: ['cerro-caviahue', 'caviahue'] },
    { id: 'Cerro Bayo', slugs: ['cerro-bayo', 'bayo'] },
    { id: 'Cerro Castor', slugs: ['cerro-castor', 'castor'] },
    { id: 'Lago Hermoso', slugs: ['lago-hermoso', 'hermoso'] },
    { id: 'Las Pendientes', slugs: ['las-pendientes', 'pendientes'] },
    { id: 'Perito Moreno', slugs: ['perito-moreno', 'moreno'] },
    { id: 'Aconcagua', slugs: ['aconcagua', 'concagua'] },
    { id: 'Batea Mahuida', slugs: ['batea-mahuida', 'mahuida'] },
    { id: 'Calafate Mountain Park', slugs: ['calafate-mountain-park', 'mountain-park'] },
    { id: 'Vallecitos', slugs: ['vallecitos', 'vallecito'] },
    { id: 'Monte Bianco', slugs: ['monte-bianco'] },
    { id: 'Patagonia Heliski', slugs: ['patagonia-heliski', 'heliski'] },
    { id: 'Los Penitentes', slugs: ['los-penitentes', 'penitentes'] },
    { id: 'Los Puquios', slugs: ['los-puquios', 'puquios'] },
    { id: 'Monte Fitz Roy', slugs: ['monte-fitz-roy', 'fitz-roy'] },
    { id: 'Cerro Norris', slugs: ['cerro-norris', 'norris'] },
    { id: 'Cerro Torre', slugs: ['cerro-torre', 'torre'] },
    { id: 'Cerro Negro', slugs: ['cerro-negro', 'negro'] },
    { id: 'Las Leñas', slugs: ['las-leñas', 'lenas'] },
];

const RootStyle = styled('div')(() => ({
    height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function SearchPage() {
    const { resort: resortSlug } = useParams();
    const [resort, setResort] = useState(resortSlug);

    useEffect(() => {
        const resort = RESORT_OPTIONS.find(r => r.slugs.includes(resortSlug))
        if (resort) {
            setResort(resort.id)
        }
    }, [resortSlug])

    return (
        <Page title="Match a PRO">
            <Helmet>
                <title>Clases de ski y snowboard</title>
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
                  "url": "https://snowmatch.pro/clases/catedral/ski"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "url": "https://snowmatch.pro/clases/catedral/snowboard"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "url": "https://snowmatch.pro/clases/chapelco/ski"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "url": "https://snowmatch.pro/clases/catedral/ski"
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
                <ResortDisciplineHero />
                <ContentStyle>
                    <HomeStatsHero />
                    <DownloadAppSection resort={resort} />
                    <FaqsByContext />
                    <HomeAdvertisement />
                </ContentStyle>
            </RootStyle>
        </Page>
    );
}

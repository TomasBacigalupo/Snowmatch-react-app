// @mui
import { styled } from '@mui/material/styles';
// components
// sections
import useAuth from 'src/hooks/useAuth';
import { useEffect, useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Page from 'src/components/Page';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'src/redux/store';
import { getFreeTeachers } from 'src/redux/slices/teachers';
import useLocales from 'src/hooks/useLocales';
import LoadingScreen from 'src/components/LoadingScreen';

// Lazy loaded components
const HomeStats = lazy(() => import('src/sections/home/HomeStats'));
const HomePartners = lazy(() => import('src/sections/home/HomePartners'));
const HomeStatsHero = lazy(() => import('src/sections/home/HomeStatsHero'));
const HomeAdvertisement = lazy(() => import('src/sections/home/HomeAdvertisement'));
const HomeHero = lazy(() => import('src/sections/home/HomeHero'));
const ResortDisciplineHero = lazy(() => import('src/sections/home/ResortDisciplineHero'));
const FaqsByContext = lazy(() => import('src/sections/home/FAQSByContext'));
const DownloadAppSection = lazy(() => import('src/sections/home/DounloawdAppSection'));
const ResortsAndLessonsSection = lazy(() => import('src/sections/home/ResortsAndLessonsSection'));
const StudentTestimonials = lazy(() => import('src/sections/home/StudentTestimonials'));

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

const getClassType = (type) => {
  switch (type) {
    case 'privada':
      return 'Clase Privada';
    case 'grupal':
      return 'Clase Grupal';
    case 'nenes':
      return 'Clase para Niños';
    case 'adolescentes':
      return 'Clase para Adolescentes';
    case 'menores':
      return 'Clase para Menores';
    case 'juveniles':
      return 'Clase para Juveniles';
    default:
      return 'Clase';
  }
}

const getCanonicalSlug = (slug) => {
  const resort = RESORT_OPTIONS.find((r) => r.slugs.includes(slug));
  return resort?.slugs[0] || slug; // usamos el slug canónico (el primero)
};

export default function SearchPage() {
  const { resort: resortSlug, discipline, type } = useParams();
  const [resort, setResort] = useState(resortSlug);

  useEffect(() => {
    const resort = RESORT_OPTIONS.find(r => r.slugs.includes(resortSlug))
    if (resort) {
      setResort(resort.id)
    }
  }, [resortSlug])

  const getDisciplineName = (disc) => {
    switch (disc) {
      case 'ski':
        return 'Ski';
      case 'snowboard':
        return 'Snowboard';
      default:
        return 'Ski y Snowboard';
    }
  }

  const getAmenityFeatures = () => {
    const features = [];
    if (type) {
      features.push({
        "@type": "LocationFeatureSpecification",
        "name": getClassType(type),
        "value": true
      });
    } else {
      features.push(
        {
          "@type": "LocationFeatureSpecification",
          "name": "Clases Privadas",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Clases Grupales",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Clases para Niños",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Clases para Adolescentes",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Clases para Menores",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Clases para Juveniles",
          "value": true
        }
      );
    }
    return features;
  }

  return (
    <Page title={`Clases de ${discipline || 'ski y snowboard'} en ${resort} - SnowMatch`}>
      <Helmet>
        <title>{`Clases de ${discipline || 'ski y snowboard'} en ${resort} - Reserva Online | SnowMatch`}</title>
        <meta name="description" content={`Reserva clases de ${discipline || 'ski y snowboard'} en ${resort}. Instructores certificados, clases privadas y grupales. ¡Reserva online y evita colas!`} />
        <meta name="keywords" content={`clases de ${discipline || 'ski y snowboard'}, ${resort}, instructores certificados, clases privadas, clases grupales, reserva online`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Clases de ${discipline || 'ski y snowboard'} en ${resort} - Reserva Online | SnowMatch`} />
        <meta property="og:description" content={`Reserva clases de ${discipline || 'ski y snowboard'} en ${resort}. Instructores certificados, clases privadas y grupales. ¡Reserva online y evita colas!`} />
        <meta property="og:image" content="https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg" />
        <meta property="og:url" content={`https://snowmatch.pro/clases/${resortSlug}${discipline ? '/' + discipline : ''}${type ? '/' + type : ''}`} />
        <meta property="og:site_name" content="SnowMatch" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Clases de ${discipline || 'ski y snowboard'} en ${resort} - Reserva Online | SnowMatch`} />
        <meta name="twitter:description" content={`Reserva clases de ${discipline || 'ski y snowboard'} en ${resort}. Instructores certificados, clases privadas y grupales. ¡Reserva online y evita colas!`} />
        <meta name="twitter:image" content="https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg" />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://snowmatch.pro/clases/${getCanonicalSlug(resortSlug)}${discipline ? '/' + discipline : ''}${type ? '/' + type : ''}`}
        />
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {`
                    {
                        "@context": "https://schema.org",
                        "@type": "SportsActivityLocation",
                        "name": "SnowMatch - ${getClassType(type)} de ${getDisciplineName(discipline)} en ${resort}",
                        "description": "${getClassType(type)} de ${getDisciplineName(discipline)} en ${resort} para todos los niveles",
                        "url": "https://snowmatch.pro/clases/${resortSlug}${discipline ? '/' + discipline : ''}${type ? '/' + type : ''}",
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "AR",
                            "addressRegion": "Patagonia"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "-41.1335",
                            "longitude": "-71.3103"
                        },
                        "offers": {
                            "@type": "AggregateOffer",
                            "priceCurrency": "ARS",
                            "availability": "https://schema.org/InStock",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "${getClassType(type)} de ${getDisciplineName(discipline)} en ${resort}",
                                "description": "${getClassType(type)} de ${getDisciplineName(discipline)} en ${resort}",
                                "serviceType": "Clases de esquí",
                                "provider": {
                                    "@type": "Organization",
                                    "name": "SnowMatch",
                                    "url": "https://snowmatch.pro",
                                    "logo": "https://snowmatch.pro/logo/snowmatch.png"
                                }
                            }
                        },
                        "sport": ${discipline ? `["${getDisciplineName(discipline)}"]` : '["Ski", "Snowboard"]'},
                        "amenityFeature": ${JSON.stringify(getAmenityFeatures())},
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "reviewCount": "150"
                        }
                    }
                    `}
        </script>
      </Helmet>
      <RootStyle>
        <Suspense fallback={<LoadingScreen />}>
          <ResortDisciplineHero
            initialResort={resort}
            initialDiscipline={discipline}
            initialType={type}
          />
        </Suspense>
        <ContentStyle>
          <Suspense fallback={<LoadingScreen />}>
            <HomeStatsHero />
          </Suspense>
          <Suspense fallback={<LoadingScreen />}>
            <DownloadAppSection resort={resort} />
          </Suspense>
          <Suspense fallback={<LoadingScreen />}>
            <StudentTestimonials />
          </Suspense>
          <Suspense fallback={<LoadingScreen />}>
            <FaqsByContext />
          </Suspense>
          <Suspense fallback={<LoadingScreen />}>
            <ResortsAndLessonsSection />
          </Suspense>
          <Suspense fallback={<LoadingScreen />}>
            <HomeAdvertisement />
          </Suspense>
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}

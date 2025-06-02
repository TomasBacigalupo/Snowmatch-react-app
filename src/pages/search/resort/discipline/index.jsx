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
  { id: 'Buenos Aires', slugs: ['buenos-aires', 'la-plata'] },
  {
    id: 'Cerro Catedral', slugs: ['cerro-catedral', 'catedral', 'catedral-de-bariloche',
      'bariloche', 'san-carlos-de-bariloche', 'argentina', 'rio-negro', 'patagonia', 'patagonia-argentina', 'la-patagonia',
      'el-sur', 'sur', 'sur-de-argentina', 'el-sur-de-argentina'
    ]
  },
  { id: 'Chapelco', slugs: ['cerro-chapelco', 'chapelco', 'san-martin-de-los-andes', 'neuquen'] },
  { id: 'La Hoya', slugs: ['cerro-la-hoya', 'la-hoya', 'esquel'] },
  { id: 'Las Leñas', slugs: ['cerro-las-lenas', 'las-lenas', 'mendoza', 'san-rafael'] },
  { id: 'Caviahue', slugs: ['cerro-caviahue', 'caviahue'] },
  { id: 'Cerro Bayo', slugs: ['cerro-bayo', 'bayo', 'villa-la-angostura', 'el-bayo', 'villa', 'la-villa'] },
  { id: 'Cerro Castor', slugs: ['cerro-castor', 'castor', 'ushuaia', 'tierra-del-fuego'] },
  { id: 'Lago Hermoso', slugs: ['lago-hermoso', 'hermoso', 'cerro-lago-hermoso', 'san-martin', 'lago-hermoso-ski'] },
  { id: 'Las Pendientes', slugs: ['las-pendientes', 'pendientes'] },
  { id: 'Perito Moreno', slugs: ['perito-moreno', 'moreno', 'el-bolson', 'laderas', 'laderas-perito-moreno', 'bolson'], },
  { id: 'Aconcagua', slugs: ['aconcagua', 'concagua'] },
  { id: 'Batea Mahuida', slugs: ['batea-mahuida', 'mahuida', 'cerro-batea-mahuida'] },
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
  { id: 'Las Leñas', slugs: ['las-leñas', 'las-lenas', 'norte-de-argentina', 'el-norte-de-argentina', 'el-norte', 'norte'] },

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



const getCanonicalSlug = (slug) => {
  return slug; // usamos el slug canónico (el primero)
};

export default function SearchPage() {
  const { resort: resortSlug, discipline, type } = useParams();
  const [resort, setResort] = useState(resortSlug);
  const { translate } = useLocales();
  const getClassType = (type) => {
    if (!type) return 'Clase';

    // Map the type to its translation key
    const typeMap = {
      'grupales': 'grupales',
      'privadas': 'privadas',
      'niños': 'niños',
      'adultos': 'adultos',
      'amigos': 'amigos',
      'familias': 'familias',
      'estudiantes': 'estudiantes',
      'profesionales': 'profesionales',
      'principiantes': 'principiante',
      'expertos': 'expertos',
      'free-ride': 'free-ride',
      'freeride': 'freeride',
      'fuera-de-pista': 'fuera-de-pista',
      'pista': 'pista',
      'bumps': 'bumps',
      'freestyle': 'freestyle',
      'slalom': 'slalom',
      'park': 'park',
      'saltos': 'saltos'
    };

    const translationKey = typeMap[type];
    if (!translationKey) return 'Clase';

    return `Clase ${translate(`landingPRO.${translationKey}`)}`;
  }
  useEffect(() => {
    const resort = RESORT_OPTIONS.find(r => r.slugs.includes(resortSlug))
    if (resort) {
      setResort(resort.id)
    }
  }, [resortSlug])

  const getDisciplineName = (disc) => {
    switch (disc) {
      case 'ski':
      case 'esqui':
        return 'Ski';
      case 'snow':
      case 'snowboard':
        return 'Snowboard';
      case 'sky':
      case 'eski':
        return 'Ski';
      case 'esqui-y-snowboard':
      case 'esquí-y-snowboard':
      case 'esqui-y-snow':
      case 'ski-y-snow':
        return 'Ski y Snowboard';
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
          "name": translate('landingPRO.privadas'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.grupales'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.niños'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.adultos'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.amigos'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.familias'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.estudiantes'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.profesionales'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.principiante'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.expertos'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.free-ride'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.freeride'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.fuera-de-pista'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.pista'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.bumps'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.freestyle'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.slalom'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.park'),
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": translate('landingPRO.saltos'),
          "value": true
        }
      );
    }
    return features;
  }

  return (
    <Page title={`Clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'} en ${translate(`landingPRO.${resortSlug}`)} - SnowMatch`}>
      <Helmet>
        <title>{`Clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'} en ${translate(`landingPRO.${resortSlug}`)} - Reserva Online | SnowMatch`}</title>
        <meta name="description" content={`Reserva clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'} en ${resort}. Instructores certificados, clases privadas y grupales. ¡Reserva online y evita colas!`} />
        <meta name="keywords" content={`clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'}, ${resort}, instructores certificados, clases privadas, clases grupales, reserva online`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'} en ${resort} - Reserva Online | SnowMatch`} />
        <meta property="og:description" content={`Reserva clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'} en ${resort}. Instructores certificados, clases privadas y grupales. ¡Reserva online y evita colas!`} />
        <meta property="og:image" content="https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg" />
        <meta property="og:url" content={`https://snowmatch.pro/${resortSlug}${discipline ? `/${discipline}` : ''}${type ? '/' + type : ''}`} />
        <meta property="og:site_name" content="SnowMatch" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'} en ${resort} - Reserva Online | SnowMatch`} />
        <meta name="twitter:description" content={`Reserva clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'} en ${resort}. Instructores certificados, clases privadas y grupales. ¡Reserva online y evita colas!`} />
        <meta name="twitter:image" content="https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg" />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://snowmatch.pro/${getCanonicalSlug(resortSlug)}${discipline ? '/' + discipline : ''}${type ? '/' + type : ''}`}
        />
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {`
                    {
                        "@context": "https://schema.org",
                        "@type": "SportsActivityLocation",
                        "name": "SnowMatch - ${getClassType(type)} ${discipline ? 'de ' + translate(`landingPRO.${discipline}`) : 'de ski y snowboard'} en ${translate(`landingPRO.${resortSlug}`)}",
                        "description": "${getClassType(type)} ${discipline ? 'de ' + translate(`landingPRO.${discipline}`) : 'de ski y snowboard'} en ${translate(`landingPRO.${resortSlug}`)} para todos los niveles",
                        "url": "https://snowmatch.pro/${resortSlug}${discipline ? '/' + discipline : ''}${type ? '/' + type : ''}",
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
                                "name": "${getClassType(type)} ${discipline ? 'de ' + translate(`landingPRO.${discipline}`) : 'de ski y snowboard'} en ${translate(`landingPRO.${resortSlug}`)}",
                                "description": "${getClassType(type)} ${discipline ? 'de ' + translate(`landingPRO.${discipline}`) : 'de ski y snowboard'} en ${translate(`landingPRO.${resortSlug}`)}",
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

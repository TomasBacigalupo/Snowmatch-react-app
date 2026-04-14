import { useEffect } from 'react';
import { m } from 'framer-motion';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Page from '../components/Page';
import useLocales from '../hooks/useLocales';
import Iconify from '../components/Iconify';
import { MotionViewport, varContainer, varFade } from '../components/animate';
import { snowmatchBookingWhatsAppUrl, SNOWMATCH_BOOKING_WHATSAPP_PHONE } from '../utils/snowmatchWhatsApp';

const VALID_LANGS = ['es', 'en', 'pt', 'fr'];

const OG_IMAGE = 'https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg';

const HOW_IT_WORKS_IMAGE = '/assets/how-it-works.png';

function localeFromLang(lang) {
  const map = { es: 'es_ES', en: 'en_US', pt: 'pt_BR', fr: 'fr_FR' };
  return map[lang] || 'en_US';
}

function bookingWaHref(translate, resortName = null) {
  const msg = resortName
    ? translate('languageHome.whatsapp.bookMessageResort', { resort: resortName })
    : translate('languageHome.whatsapp.bookMessage');
  return snowmatchBookingWhatsAppUrl(msg);
}

const FEATURED_RESORTS = [
  {
    slug: 'cerro-catedral',
    labelKey: 'languageHome.resorts.cerroCatedral',
    image: '/assets/bariloche.jpg',
    imageAltKey: 'languageHome.images.resortCerroCatedral',
  },
  {
    slug: 'chapelco',
    labelKey: 'languageHome.resorts.chapelco',
    image: '/assets/chapelco.png',
    imageAltKey: 'languageHome.images.resortChapelco',
  },
  {
    slug: 'las-lenas',
    labelKey: 'languageHome.resorts.lasLenas',
    image: '/assets/bayo.png',
    imageAltKey: 'languageHome.images.resortLasLenas',
  },
  {
    slug: 'valle-nevado',
    labelKey: 'languageHome.resorts.valleNevado',
    image: '/assets/perito-moreno.png',
    imageAltKey: 'languageHome.images.resortValleNevado',
  },
];

const FEATURE_CARDS = [
  { i: 1, icon: 'eva:people-fill', image: '/assets/how-to/screens.webp', imageAltKey: 'languageHome.images.feature1' },
  { i: 2, icon: 'eva:map-fill', image: '/assets/chapelco.png', imageAltKey: 'languageHome.images.feature2' },
  { i: 3, icon: 'eva:shield-fill', image: '/assets/how-to/filtros.webp', imageAltKey: 'languageHome.images.feature3' },
];

const HeroFloatSmall = styled(m.div)(({ theme }) => ({
  position: 'absolute',
  width: '42%',
  maxWidth: 200,
  zIndex: 2,
  bottom: theme.spacing(-1),
  right: theme.spacing(0),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  overflow: 'hidden',
  boxShadow: theme.customShadows.z24,
  border: `4px solid ${theme.palette.background.paper}`,
}));

const HeroFloatMain = styled(m.div)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: 520,
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  overflow: 'hidden',
  boxShadow: theme.customShadows.z20,
}));

export default function LanguageHome() {
  const { lng } = useParams();
  const { onChangeLang, translate } = useLocales();

  const lang = (lng || 'en').toLowerCase();

  useEffect(() => {
    if (lng && VALID_LANGS.includes(lng.toLowerCase())) {
      onChangeLang(lng.toLowerCase());
    }
  }, [lng, onChangeLang]);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  const baseUrl = 'https://snowmatch.pro';
  const canonicalPath = `/${lang}/`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const faqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4, 5].map((i) => ({
      '@type': 'Question',
      name: translate(`languageHome.faq.q${i}`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: translate(`languageHome.faq.a${i}`),
      },
    })),
  });

  const websiteJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SnowMatch',
    url: canonicalUrl,
    description: translate('languageHome.seo.description'),
    inLanguage: lang,
    publisher: {
      '@type': 'Organization',
      name: 'SnowMatch',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: 'https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg',
      },
    },
  });

  if (lng && !VALID_LANGS.includes(lang)) {
    return <Navigate to="/en" replace />;
  }

  return (
    <Page title={translate('languageHome.seo.title')}>
      <Helmet>
        <html lang={lang} />
        <title>{translate('languageHome.seo.title')}</title>
        <meta name="description" content={translate('languageHome.seo.description')} />
        <meta name="keywords" content={translate('languageHome.seo.keywords')} />
        <link rel="canonical" href={canonicalUrl} />
        {VALID_LANGS.map((code) => (
          <link key={code} rel="alternate" hrefLang={code} href={`${baseUrl}/${code}/`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={translate('languageHome.seo.ogTitle')} />
        <meta property="og:description" content={translate('languageHome.seo.ogDescription')} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content={translate('languageHome.seo.ogImageAlt')} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="SnowMatch" />
        <meta property="og:locale" content={localeFromLang(lang)} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={translate('languageHome.seo.ogTitle')} />
        <meta name="twitter:description" content={translate('languageHome.seo.ogDescription')} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script type="application/ld+json">{websiteJsonLd}</script>
        <script type="application/ld+json">{faqJsonLd}</script>
      </Helmet>

      <Box component="main">
        {/* Hero */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            background: (theme) =>
              `linear-gradient(165deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.background.default} 45%, ${theme.palette.background.paper} 100%)`,
            pt: { xs: 10, md: 14 },
            pb: { xs: 6, md: 10 },
          }}
        >
          <Box
            component={m.div}
            aria-hidden
            sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
          >
            <Box
              component={m.div}
              animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.2, 0.12] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              sx={{
                position: 'absolute',
                top: { xs: '-15%', md: '-20%' },
                right: { xs: '-30%', md: '-10%' },
                width: { xs: '70%', md: '45%' },
                aspectRatio: '1',
                borderRadius: '50%',
                background: (theme) => `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />
            <Box
              component={m.div}
              animate={{ scale: [1, 1.12, 1], opacity: [0.08, 0.16, 0.08] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              sx={{
                position: 'absolute',
                bottom: { xs: '5%', md: '10%' },
                left: { xs: '-25%', md: '-5%' },
                width: { xs: '55%', md: '35%' },
                aspectRatio: '1',
                borderRadius: '50%',
                background: (theme) => `radial-gradient(circle, ${theme.palette.info.light} 0%, transparent 70%)`,
                filter: 'blur(48px)',
              }}
            />
          </Box>

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  component={m.div}
                  initial="initial"
                  animate="animate"
                  variants={varContainer({ staggerIn: 0.1 })}
                  sx={{
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  <Box component={m.div} variants={varFade().inRight}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.2 }}>
                      SnowMatch
                    </Typography>
                  </Box>
                  <Box component={m.div} variants={varFade().inRight}>
                    <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, lineHeight: 1.15, mt: 1 }}>
                      {translate('languageHome.hero.headline')}
                    </Typography>
                  </Box>
                  <Box component={m.div} variants={varFade().inRight}>
                    <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 520, mt: 2, mx: { xs: 'auto', md: 0 } }}>
                      {translate('languageHome.hero.subheadline')}
                    </Typography>
                  </Box>
                  <Box component={m.div} variants={varFade().inRight}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Button
                        component="a"
                        href={bookingWaHref(translate)}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        size="large"
                        sx={{ px: 4, py: 1.5, fontWeight: 700 }}
                      >
                        {translate('languageHome.hero.cta')}
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative', minHeight: { xs: 320, sm: 380, md: 420 }, px: { xs: 2, md: 0 } }}>
                  <HeroFloatMain
                    initial={{ opacity: 0, y: 48, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                  >
                    <m.div
                      animate={{ y: [0, -14, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Box
                        component="img"
                        src="/assets/bariloche.jpg"
                        alt={translate('languageHome.images.heroPrimary')}
                        sx={{ width: 1, height: { xs: 260, sm: 300, md: 340 }, objectFit: 'cover', display: 'block' }}
                      />
                    </m.div>
                  </HeroFloatMain>
                  <HeroFloatSmall
                    initial={{ opacity: 0, x: 56, rotate: 6 }}
                    animate={{ opacity: 1, x: 0, rotate: 3 }}
                    transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.25 }}
                  >
                    <m.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                    >
                      <Box
                        component="img"
                        src={OG_IMAGE}
                        alt={translate('languageHome.images.heroSecondary')}
                        sx={{ width: 1, height: 140, objectFit: 'cover', display: 'block' }}
                      />
                    </m.div>
                  </HeroFloatSmall>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Value props */}
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
          <Container maxWidth="lg" component={MotionViewport} disableAnimatedMobile={false}>
            <Box component={m.div} variants={varFade().inUp}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 4, textAlign: 'center' }}>
                {translate('languageHome.features.title')}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {FEATURE_CARDS.map(({ i, icon, image, imageAltKey }) => (
                <Grid item xs={12} md={4} key={i}>
                  <Box component={m.div} variants={varFade().inUp}>
                    <Card
                      component={m.div}
                      whileHover={{ y: -8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: (theme) => theme.customShadows.z8,
                        overflow: 'hidden',
                      }}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <Box
                          component={m.div}
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                          sx={{ lineHeight: 0 }}
                        >
                          <Box
                            component="img"
                            src={image}
                            alt={translate(imageAltKey)}
                            sx={{ width: 1, height: 180, objectFit: 'cover', display: 'block' }}
                          />
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={1.5}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1.5,
                              bgcolor: 'primary.lighter',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Iconify icon={icon} width={26} sx={{ color: 'primary.main' }} />
                          </Box>
                          <Typography variant="h6" component="h3">
                            {translate(`languageHome.features.card${i}Title`)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {translate(`languageHome.features.card${i}Body`)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Tarifas (anchor targets for header menu) */}
        <Box
          component="section"
          aria-labelledby="language-home-tarifas"
          sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}
        >
          <Container maxWidth="lg" component={MotionViewport} disableAnimatedMobile={false}>
            <Box component={m.div} variants={varFade().inUp}>
              <Typography
                id="language-home-tarifas"
                variant="h2"
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1, textAlign: 'center' }}
              >
                {translate('languageHome.tarifas.sectionTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4, maxWidth: 560, mx: 'auto' }}>
                {translate('languageHome.tarifas.sectionSubtitle')}
              </Typography>
            </Box>
            <Stack spacing={4}>
              <Box
                id="tarifas-adultos"
                component={m.div}
                variants={varFade().inUp}
                sx={{ scrollMarginTop: { xs: 88, md: 96 } }}
              >
                <Typography variant="h6" component="h3" fontWeight={700} gutterBottom>
                  {translate('languageHome.tarifas.adultos')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {translate('languageHome.tarifas.adultosBody')}
                </Typography>
                <Button
                  component="a"
                  href={`https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}?text=${encodeURIComponent(translate('languageHome.tarifas.requestRateMessageAdultos'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, fontWeight: 600 }}
                >
                  {translate('languageHome.tarifas.requestRateButton')}
                </Button>
              </Box>
              <Box
                id="tarifas-ninos"
                component={m.div}
                variants={varFade().inUp}
                sx={{ scrollMarginTop: { xs: 88, md: 96 } }}
              >
                <Typography variant="h6" component="h3" fontWeight={700} gutterBottom>
                  {translate('languageHome.tarifas.ninos')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {translate('languageHome.tarifas.ninosBody')}
                </Typography>
                <Button
                  component="a"
                  href={`https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}?text=${encodeURIComponent(translate('languageHome.tarifas.requestRateMessageNinos'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, fontWeight: 600 }}
                >
                  {translate('languageHome.tarifas.requestRateButton')}
                </Button>
              </Box>
              <Box
                id="tarifas-equipos"
                component={m.div}
                variants={varFade().inUp}
                sx={{ scrollMarginTop: { xs: 88, md: 96 } }}
              >
                <Typography variant="h6" component="h3" fontWeight={700} gutterBottom>
                  {translate('languageHome.tarifas.equipos')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {translate('languageHome.tarifas.equiposBody')}
                </Typography>
                <Button
                  component="a"
                  href={`https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}?text=${encodeURIComponent(translate('languageHome.tarifas.requestRateMessageEquipos'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, fontWeight: 600 }}
                >
                  {translate('languageHome.tarifas.requestRateButton')}
                </Button>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Escuela (anchor targets for header menu) */}
        <Box
          component="section"
          aria-labelledby="language-home-escuela"
          sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}
        >
          <Container maxWidth="lg" component={MotionViewport} disableAnimatedMobile={false}>
            <Box component={m.div} variants={varFade().inUp}>
              <Typography
                id="language-home-escuela"
                variant="h2"
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1, textAlign: 'center' }}
              >
                {translate('languageHome.escuela.sectionTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4, maxWidth: 560, mx: 'auto' }}>
                {translate('languageHome.escuela.sectionSubtitle')}
              </Typography>
            </Box>
            <Stack spacing={4}>
              <Box
                id="escuela-clases"
                component={m.div}
                variants={varFade().inUp}
                sx={{ scrollMarginTop: { xs: 88, md: 96 } }}
              >
                <Typography variant="h6" component="h3" fontWeight={700} gutterBottom>
                  {translate('languageHome.escuela.clases')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {translate('languageHome.escuela.clasesBody')}
                </Typography>
                <Button
                  component="a"
                  href={`https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}?text=${encodeURIComponent(translate('languageHome.escuela.requestRateMessageClases'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, fontWeight: 600 }}
                >
                  {translate('languageHome.tarifas.requestRateButton')}
                </Button>
              </Box>
              <Box
                id="escuela-rental"
                component={m.div}
                variants={varFade().inUp}
                sx={{ scrollMarginTop: { xs: 88, md: 96 } }}
              >
                <Typography variant="h6" component="h3" fontWeight={700} gutterBottom>
                  {translate('languageHome.escuela.rental')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {translate('languageHome.escuela.rentalBody')}
                </Typography>
                <Button
                  component="a"
                  href={`https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}?text=${encodeURIComponent(translate('languageHome.escuela.requestRateMessageRental'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, fontWeight: 600 }}
                >
                  {translate('languageHome.tarifas.requestRateButton')}
                </Button>
              </Box>
              <Box
                id="escuela-ninos"
                component={m.div}
                variants={varFade().inUp}
                sx={{ scrollMarginTop: { xs: 88, md: 96 } }}
              >
                <Typography variant="h6" component="h3" fontWeight={700} gutterBottom>
                  {translate('languageHome.escuela.ninos')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {translate('languageHome.escuela.ninosBody')}
                </Typography>
                <Button
                  component="a"
                  href={`https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}?text=${encodeURIComponent(translate('languageHome.escuela.requestRateMessageNinos'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, fontWeight: 600 }}
                >
                  {translate('languageHome.tarifas.requestRateButton')}
                </Button>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Resorts */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg" component={MotionViewport} disableAnimatedMobile={false}>
            <Box component={m.div} variants={varFade().inUp}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1, textAlign: 'center' }}>
                {translate('languageHome.resorts.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4, maxWidth: 560, mx: 'auto' }}>
                {translate('languageHome.resorts.subtitle')}
              </Typography>
            </Box>
            <Grid container spacing={2.5}>
              {FEATURED_RESORTS.map(({ slug, labelKey, image, imageAltKey }) => (
                <Grid item xs={12} sm={6} md={3} key={slug}>
                  <Box component={m.div} variants={varFade().inUp}>
                    <Card
                      component={m.div}
                      whileHover={{ y: -6, transition: { duration: 0.25 } }}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: (theme) => theme.customShadows.z12,
                        height: '100%',
                      }}
                    >
                      <CardActionArea
                        component="a"
                        href={bookingWaHref(translate, translate(labelKey))}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ height: '100%', alignItems: 'stretch' }}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <Box
                            component={m.img}
                            src={image}
                            alt={translate(imageAltKey)}
                            sx={{ width: 1, height: 168, objectFit: 'cover', display: 'block' }}
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{
                              position: 'absolute',
                              left: 16,
                              bottom: 12,
                              right: 16,
                              color: 'common.white',
                              fontWeight: 700,
                              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                            }}
                          >
                            {translate(labelKey)}
                          </Typography>
                        </Box>
                        <CardContent sx={{ py: 1.5, px: 2 }}>
                          <Typography variant="body2" color="primary" fontWeight={600}>
                            {translate('languageHome.hero.cta')} →
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How it works */}
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container maxWidth="lg" component={MotionViewport} disableAnimatedMobile={false}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={5} sx={{ order: { xs: 2, md: 1 } }}>
                <Box
                  component={m.div}
                  variants={varFade().inLeft}
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: (theme) => theme.customShadows.z16,
                  }}
                >
                  <m.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: 'center center' }}
                  >
                    <Box
                      component="img"
                      src={HOW_IT_WORKS_IMAGE}
                      alt={translate('languageHome.images.howSide')}
                      sx={{ width: 1, height: { xs: 280, md: 400 }, objectFit: 'cover', display: 'block' }}
                    />
                  </m.div>
                </Box>
              </Grid>
              <Grid item xs={12} md={7} sx={{ order: { xs: 1, md: 2 } }}>
                <Box component={m.div} variants={varFade().inRight}>
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
                    {translate('languageHome.how.title')}
                  </Typography>
                </Box>
                <Stack spacing={3}>
                  {[1, 2, 3].map((i) => (
                    <Box component={m.div} key={i} variants={varFade().inRight}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box
                          component={m.div}
                          whileHover={{ scale: 1.08 }}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                          }}
                        >
                          {i}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {translate(`languageHome.how.step${i}Title`)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {translate(`languageHome.how.step${i}Body`)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* FAQ */}
        <Box component="section" sx={{ py: { xs: 6, md: 10 } }} aria-labelledby="language-home-faq">
          <Container maxWidth="md" component={MotionViewport} disableAnimatedMobile={false}>
            <Box component={m.div} variants={varFade().inUp}>
              <Typography id="language-home-faq" variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 4, textAlign: 'center' }}>
                {translate('languageHome.faq.sectionTitle')}
              </Typography>
            </Box>
            <Stack spacing={3}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i} component={m.div} variants={varFade().inUp}>
                  <Box component="article">
                    <Typography variant="subtitle1" fontWeight={700} component="h3" gutterBottom>
                      {translate(`languageHome.faq.q${i}`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {translate(`languageHome.faq.a${i}`)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>

        {/* Bottom CTA */}
        <Box
          id="reservar"
          sx={{
            scrollMarginTop: { xs: 88, md: 96 },
            py: { xs: 8, md: 10 },
            background: (theme) => theme.palette.gradients.primary,
            color: (theme) => theme.palette.primary.contrastText,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component={m.div}
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '55%',
              maxWidth: 420,
              aspectRatio: '1',
              borderRadius: '50%',
              background: (theme) => alpha(theme.palette.common.white, 0.06),
              border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
            }}
          />
          <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }} component={MotionViewport} disableAnimatedMobile={false}>
            <Stack spacing={2} alignItems="center" textAlign="center" component={m.div} variants={varFade().inUp}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {translate('languageHome.bottom.title')}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.92 }}>
                {translate('languageHome.bottom.subtitle')}
              </Typography>
              <Button
                component="a"
                href={bookingWaHref(translate)}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="inherit"
                size="large"
                sx={{
                  mt: 1,
                  color: 'primary.main',
                  bgcolor: 'background.paper',
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                {translate('languageHome.hero.cta')}
              </Button>
              <Typography variant="caption" sx={{ opacity: 0.85, pt: 1 }}>
                <Link component={RouterLink} to={`/${lang}/contact-us`} color="inherit" underline="hover">
                  {translate('languageHome.bottom.contact')}
                </Link>
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Page>
  );
}

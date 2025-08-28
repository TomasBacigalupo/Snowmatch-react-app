import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import useLocales from '../hooks/useLocales';

export default function InstructorLanding() {
  const { translate } = useLocales();
  const { i18n } = useTranslation();
  const location = useLocation();
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const esUrl = `${origin}/instructor`;
  const enUrl = `${origin}/en/instructor`;
  const ptUrl = `${origin}/pt/instructor`;
  const frUrl = `${origin}/fr/instructor`;

  // Language detection and setting
  useEffect(() => {
    // Extract language from pathname (e.g., /en/instructor -> 'en')
    const pathSegments = location.pathname.split('/');
    const languageFromPath = pathSegments[1]; // First segment after domain
    
    if (languageFromPath && ['en', 'es', 'pt', 'fr'].includes(languageFromPath)) {
      // Set language based on URL path
      i18n.changeLanguage(languageFromPath);
      
      // Also update localStorage for persistence
      localStorage.setItem('i18nextLng', languageFromPath);
      
      console.log(`Language set to: ${languageFromPath} from URL path: ${location.pathname}`);
    }
  }, [location.pathname, i18n]);

  // Get translated data
  const benefits = translate('instructorLanding.benefits.list', { returnObjects: true });
  const steps = translate('instructorLanding.howItWorks.steps', { returnObjects: true });

  const allFeatures = [
    translate('instructorLanding.plans.features.professionalProfile'),
    translate('instructorLanding.plans.features.support247'),
    translate('instructorLanding.plans.features.unlimitedBookings'),
    translate('instructorLanding.plans.features.personalLink'),
    translate('instructorLanding.plans.features.blogNewsletter'),
    translate('instructorLanding.plans.features.emailRecommendations'),
    translate('instructorLanding.plans.features.priorityQueue'),
    translate('instructorLanding.plans.features.socialMedia'),
  ];

  const plans = [
    {
      name: 'Lite',
      price: translate('instructorLanding.plans.pricing.lite'),
      features: [
        translate('instructorLanding.plans.features.unlimitedBookings'),
        translate('instructorLanding.plans.features.professionalProfile'),
        translate('instructorLanding.plans.features.support247'),
      ],
      highlight: false,
    },
    {
      name: 'Basic',
      price: translate('instructorLanding.plans.pricing.basic'),
      features: [
        translate('instructorLanding.plans.features.unlimitedBookings'),
        translate('instructorLanding.plans.features.professionalProfile'),
        translate('instructorLanding.plans.features.mediumVisibility'),
        translate('instructorLanding.plans.features.personalLink'),
        translate('instructorLanding.plans.features.professionalProfile'),
        translate('instructorLanding.plans.features.securePayments'),
        translate('instructorLanding.plans.features.commission10'),
        translate('instructorLanding.plans.features.support247'),
      ],
      highlight: true,
    },
    {
      name: 'Pro',
      price: translate('instructorLanding.plans.pricing.pro'),
      features: [
        translate('instructorLanding.plans.features.unlimitedBookings'),
        translate('instructorLanding.plans.features.professionalProfile'),
        translate('instructorLanding.plans.features.highVisibility'),
        translate('instructorLanding.plans.features.personalLink'),
        translate('instructorLanding.plans.features.blogNewsletter'),
        translate('instructorLanding.plans.features.emailRecommendations'),
        translate('instructorLanding.plans.features.priorityQueue'),
        translate('instructorLanding.plans.features.moreResorts'),
        translate('instructorLanding.plans.features.improvedRanking'),
        translate('instructorLanding.plans.features.socialMedia'),
        translate('instructorLanding.plans.features.support247'),
      ],
      highlight: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{translate('instructorLanding.title')}</title>
        <meta
          name="description"
          content={translate('instructorLanding.description')}
        />
        <link rel="canonical" href={esUrl} />
        <link rel="alternate" hrefLang="es" href={esUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="pt" href={ptUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        <meta property="og:title" content={translate('instructorLanding.title')} />
        <meta property="og:description" content={translate('instructorLanding.ogDescription')} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero */}
        <Box
          sx={{
            pt: { xs: 10, md: 14 },
            pb: { xs: 8, md: 12 },
            background: (theme) =>
              `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
            color: 'common.white',
          }}
        >
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                  {translate('instructorLanding.hero.title')}
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
                  {translate('instructorLanding.hero.subtitle')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" size="large" href="/auth/register">
                    {translate('instructorLanding.hero.ctaPrimary')}
                  </Button>
                  <Button variant="outlined" size="large" color="inherit" href="#benefits">
                    {translate('instructorLanding.hero.ctaSecondary')}
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card sx={{ bgcolor: 'grey.800', color: 'common.white' }}>
                  <CardContent>
                    <Typography variant="overline" sx={{ opacity: 0.72 }}>
                      {translate('instructorLanding.hero.card.label')}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                      {translate('instructorLanding.hero.card.title')}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.72 }}>
                      {translate('instructorLanding.hero.card.description')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Benefits */}
        <Container id="benefits" sx={{ py: { xs: 8, md: 10 } }}>
          <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 800 }}>
            {translate('instructorLanding.benefits.title')}
          </Typography>
          <Grid container spacing={3}>
            {benefits.map((b) => (
              <Grid key={b.title} item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <CheckCircleIcon color="success" />
                      <Typography variant="h6">{b.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {b.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* How it works */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container>
            <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 800 }}>
              {translate('instructorLanding.howItWorks.title')}
            </Typography>
            <Grid container spacing={3}>
              {steps.map((s) => (
                <Grid key={s.step} item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="overline" color="text.secondary">
                        {s.step}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {s.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Plans */}
        <Container sx={{ py: { xs: 8, md: 10 } }}>
          <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 800 }}>
            {translate('instructorLanding.plans.title')}
          </Typography>
          <Grid container spacing={3}>
            {plans.map((p) => (
              <Grid key={p.name} item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', borderWidth: p.highlight ? 2 : 1, borderStyle: 'solid', borderColor: p.highlight ? 'primary.main' : 'divider', position: 'relative' }}>
                  {p.highlight && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        zIndex: 1,
                      }}
                    >
                      {translate('instructorLanding.plans.recommended')}
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="overline" color={p.highlight ? 'primary.main' : 'text.secondary'}>
                      {p.name}
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>
                      {p.price}
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      {allFeatures.map((feature) => {
                        const hasFeature = p.features.includes(feature);
                        return (
                          <Stack key={feature} direction="row" spacing={1} alignItems="center">
                            {hasFeature ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="disabled" fontSize="small" />
                            )}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: hasFeature ? 'text.primary' : 'text.disabled'
                              }}
                            >
                              {feature}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                    <Button fullWidth variant={p.highlight ? 'contained' : 'outlined'} href="/auth/register">
                      {translate('instructorLanding.plans.choose')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* FAQs */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container>
            <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 800 }}>
              {translate('instructorLanding.faqs.title')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} mx="auto">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">{translate('instructorLanding.faqs.faq1.question')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {translate('instructorLanding.faqs.faq1.answer')}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">{translate('instructorLanding.faqs.faq2.question')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {translate('instructorLanding.faqs.faq2.answer')}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">{translate('instructorLanding.faqs.faq3.question')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {translate('instructorLanding.faqs.faq3.answer')}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA */}
        <Container sx={{ py: { xs: 8, md: 10 } }}>
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    {translate('instructorLanding.cta.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {translate('instructorLanding.cta.description')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack
                    spacing={2}
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ width: '100%' }}
                  >
                    <Button
                      variant="contained"
                      href="/auth/register"
                      fullWidth
                    >
                      {translate('instructorLanding.cta.primaryButton')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      href="/contact-us"
                      fullWidth
                    >
                      {translate('instructorLanding.cta.secondaryButton')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}


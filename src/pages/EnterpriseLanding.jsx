import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { m } from 'framer-motion';
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
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BusinessIcon from '@mui/icons-material/Business';
import LayersIcon from '@mui/icons-material/Layers';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import useTabs from '../hooks/useTabs';
import { MotionViewport, varFade } from '../components/animate';
import useLocales from '../hooks/useLocales';
import React from 'react';

// ----------------------------------------------------------------------

export default function EnterpriseLanding() {
  const { translate } = useLocales();
  const { currentTab, onChangeTab } = useTabs('school');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    center: '',
    country: '',
    interest: '',
    message: '',
  });

  // SEO Data
  const seoData = {
    title: `Enterprise - ${translate('enterprise.hero.title')} | Snowmatch`,
    description: translate('enterprise.hero.subtitle'),
    keywords: 'snowmatch enterprise, gestión centros esquí, software rental esquí, escuela esquí, plataforma enterprise, gestión deportes nieve',
    canonicalUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/enterprise`,
    ogImage: `${typeof window !== 'undefined' ? window.location.origin : ''}/assets/enterprise-og.jpg`,
    twitterImage: `${typeof window !== 'undefined' ? window.location.origin : ''}/assets/enterprise-twitter.jpg`,
  };

  // JSON-LD Structured Data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Snowmatch Enterprise",
    "description": translate('enterprise.hero.subtitle'),
    "url": seoData.canonicalUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Solicita una demo personalizada"
    },
    "provider": {
      "@type": "Organization",
      "name": "Snowmatch",
      "url": "https://snowmatch.pro",
      "logo": `${typeof window !== 'undefined' ? window.location.origin : ''}/logo/fullBlack.svg`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+54-9-2944703443",
        "contactType": "customer service",
        "availableLanguage": ["Spanish", "English"]
      }
    },
    "featureList": [
      "Gestión de clases de esquí",
      "Sistema de rental",
      "Procesamiento de pagos",
      "Check-in digital",
      "Sistema de reseñas",
      "Optimización SEO",
      "Análisis de video con IA",
      "Soporte 24/7"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": translate('enterprise.testimonials.testimonial1.name')
        },
        "reviewBody": translate('enterprise.testimonials.testimonial1.quote'),
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": translate('enterprise.testimonials.testimonial2.name')
        },
        "reviewBody": translate('enterprise.testimonials.testimonial2.quote'),
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ]
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": translate('enterprise.faqs.faq1.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translate('enterprise.faqs.faq1.answer')
        }
      },
      {
        "@type": "Question",
        "name": translate('enterprise.faqs.faq2.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translate('enterprise.faqs.faq2.answer')
        }
      },
      {
        "@type": "Question",
        "name": translate('enterprise.faqs.faq3.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translate('enterprise.faqs.faq3.answer')
        }
      },
      {
        "@type": "Question",
        "name": translate('enterprise.faqs.faq4.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translate('enterprise.faqs.faq4.answer')
        }
      },
      {
        "@type": "Question",
        "name": translate('enterprise.faqs.faq5.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translate('enterprise.faqs.faq5.answer')
        }
      },
      {
        "@type": "Question",
        "name": translate('enterprise.faqs.faq6.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": translate('enterprise.faqs.faq6.answer')
        }
      }
    ]
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Snowmatch",
    "url": "https://snowmatch.pro",
    "logo": `${typeof window !== 'undefined' ? window.location.origin : ''}/logo/fullBlack.svg`,
    "description": "Plataforma integral para la gestión de centros de esquí y deportes de nieve",
    "foundingDate": "2020",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+54-9-2944703443",
      "contactType": "customer service",
      "availableLanguage": ["Spanish", "English"],
      "areaServed": "Worldwide"
    },
    "sameAs": [
      "https://www.instagram.com/snowmatch.pro",
      "https://www.facebook.com/snowmatch.pro",
      "https://www.linkedin.com/company/snowmatch"
    ]
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://snowmatch.pro"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Enterprise",
        "item": seoData.canonicalUrl
      }
    ]
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": seoData.title,
    "description": seoData.description,
    "url": seoData.canonicalUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Snowmatch",
      "url": "https://snowmatch.pro"
    },
    "about": {
      "@type": "Thing",
      "name": "Software de gestión para centros de esquí"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Centros de esquí y deportes de nieve"
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Snowmatch Enterprise"
    }
  };

  const integrationModes = [
    {
      value: 'school',
      label: translate('enterprise.integrationModes.school.title'),
      icon: <SchoolIcon />,
      description: translate('enterprise.integrationModes.school.description'),
      features: translate('enterprise.integrationModes.school.features', { returnObjects: true }),
    },
    {
      value: 'rental',
      label: translate('enterprise.integrationModes.rental.title'),
      icon: <StorefrontIcon />,
      description: translate('enterprise.integrationModes.rental.description'),
      features: translate('enterprise.integrationModes.rental.features', { returnObjects: true }),
    },
    {
      value: 'both',
      label: translate('enterprise.integrationModes.both.title'),
      icon: <BusinessIcon />,
      description: translate('enterprise.integrationModes.both.description'),
      features: translate('enterprise.integrationModes.both.features', { returnObjects: true }),
    },
    {
      value: 'layer',
      label: translate('enterprise.integrationModes.layer.title'),
      icon: <LayersIcon />,
      description: translate('enterprise.integrationModes.layer.description'),
      features: translate('enterprise.integrationModes.layer.features', { returnObjects: true }),
    },
  ];

  const modules = [
    {
      title: translate('enterprise.modules.classes.title'),
      description: translate('enterprise.modules.classes.description'),
      icon: 'eva:people-fill',
    },
    {
      title: translate('enterprise.modules.rental.title'),
      description: translate('enterprise.modules.rental.description'),
      icon: 'eva:shopping-bag-fill',
    },
    {
      title: translate('enterprise.modules.payments.title'),
      description: translate('enterprise.modules.payments.description'),
      icon: 'eva:credit-card-fill',
    },
    {
      title: translate('enterprise.modules.checkin.title'),
      description: translate('enterprise.modules.checkin.description'),
      icon: 'eva:checkmark-circle-fill',
    },
    {
      title: translate('enterprise.modules.reviews.title'),
      description: translate('enterprise.modules.reviews.description'),
      icon: 'eva:star-fill',
    },
    {
      title: translate('enterprise.modules.seo.title'),
      description: translate('enterprise.modules.seo.description'),
      icon: 'eva:trending-up-fill',
    },
    {
      title: translate('enterprise.modules.ai.title'),
      description: translate('enterprise.modules.ai.description'),
      icon: 'eva:video-fill',
    },
    {
      title: translate('enterprise.modules.support.title'),
      description: translate('enterprise.modules.support.description'),
      icon: 'eva:headphones-fill',
    },
  ];

  const steps = [
    {
      step: '01',
      title: translate('enterprise.howItWorks.step1.title'),
      description: translate('enterprise.howItWorks.step1.description'),
    },
    {
      step: '02',
      title: translate('enterprise.howItWorks.step2.title'),
      description: translate('enterprise.howItWorks.step2.description'),
    },
    {
      step: '03',
      title: translate('enterprise.howItWorks.step3.title'),
      description: translate('enterprise.howItWorks.step3.description'),
    },
  ];

  const benefits = translate('enterprise.benefits.list', { returnObjects: true });

  const testimonials = [
    {
      quote: translate('enterprise.testimonials.testimonial1.quote'),
      name: translate('enterprise.testimonials.testimonial1.name'),
      role: translate('enterprise.testimonials.testimonial1.role'),
      center: translate('enterprise.testimonials.testimonial1.center'),
    },
    {
      quote: translate('enterprise.testimonials.testimonial2.quote'),
      name: translate('enterprise.testimonials.testimonial2.name'),
      role: translate('enterprise.testimonials.testimonial2.role'),
      center: translate('enterprise.testimonials.testimonial2.center'),
    },
    {
      quote: translate('enterprise.testimonials.testimonial3.quote'),
      name: translate('enterprise.testimonials.testimonial3.name'),
      role: translate('enterprise.testimonials.testimonial3.role'),
      center: translate('enterprise.testimonials.testimonial3.center'),
    },
  ];

  const faqs = [
    {
      question: translate('enterprise.faqs.faq1.question'),
      answer: translate('enterprise.faqs.faq1.answer'),
    },
    {
      question: translate('enterprise.faqs.faq2.question'),
      answer: translate('enterprise.faqs.faq2.answer'),
    },
    {
      question: translate('enterprise.faqs.faq3.question'),
      answer: translate('enterprise.faqs.faq3.answer'),
    },
    {
      question: translate('enterprise.faqs.faq4.question'),
      answer: translate('enterprise.faqs.faq4.answer'),
    },
    {
      question: translate('enterprise.faqs.faq5.question'),
      answer: translate('enterprise.faqs.faq5.answer'),
    },
    {
      question: translate('enterprise.faqs.faq6.question'),
      answer: translate('enterprise.faqs.faq6.answer'),
    },
  ];

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Performance optimization: Lazy load images
  const [imagesLoaded, setImagesLoaded] = useState(false);

  React.useEffect(() => {
    // Simulate image loading for better performance
    const timer = setTimeout(() => setImagesLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsApp = () => {
    const message = `🚀 *Consulta Enterprise - Snowmatch*

Hola Snowmatch, me interesa conocer más sobre la plataforma Enterprise.

👤 *Información básica:*
• Nombre: ${formData.name || 'Por completar'}
• Centro de esquí: ${formData.center || 'Por completar'}
• Interés: ${formData.interest ? (
    formData.interest === 'school' ? 'Solo Escuela' : 
    formData.interest === 'rental' ? 'Solo Rental' : 
    formData.interest === 'both' ? 'Escuela + Rental' : 
    formData.interest === 'layer' ? 'Capa Snowmatch' : 'No especificado'
  ) : 'Por completar'}

📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}
🌐 *Página:* ${typeof window !== 'undefined' ? window.location.href : 'Enterprise Landing'}`;
    
    const url = `https://wa.me/5492944703443?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    
    // Construir el mensaje de WhatsApp con toda la información
    const whatsappMessage = `🚀 *Nueva solicitud de demo Enterprise - Snowmatch*

👤 *Información del contacto:*
• Nombre: ${formData.name}
• Email: ${formData.email}
• Centro de esquí: ${formData.center}
• País: ${formData.country}

🎯 *Interés:*
• ${formData.interest === 'school' ? 'Solo Escuela' : 
    formData.interest === 'rental' ? 'Solo Rental' : 
    formData.interest === 'both' ? 'Escuela + Rental' : 
    formData.interest === 'layer' ? 'Capa Snowmatch' : 'No especificado'}

💬 *Mensaje adicional:*
${formData.message || 'Sin mensaje adicional'}

📅 *Fecha de solicitud:* ${new Date().toLocaleDateString('es-ES')}
🌐 *Página:* ${typeof window !== 'undefined' ? window.location.href : 'Enterprise Landing'}`;

    // Codificar el mensaje para WhatsApp
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/5492944703443?text=${encodedMessage}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
    
    // Cerrar el modal
    setDemoModalOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      center: '',
      country: '',
      interest: '',
      message: '',
    });
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content="Snowmatch" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="es" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Canonical */}
        <link rel="canonical" href={seoData.canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Snowmatch" />
        <meta property="og:locale" content="es_ES" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.twitterImage} />
        <meta name="twitter:site" content="@snowmatch_pro" />
        <meta name="twitter:creator" content="@snowmatch_pro" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#1976d2" />
        <meta name="msapplication-TileColor" content="#1976d2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Snowmatch Enterprise" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
        </script>
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </Helmet>

      <Box >
        {/* Hero */}
        <Box
          component="section"
          aria-labelledby="hero-heading"
          sx={{
            pt: { xs: 10, md: 14 },
            pb: { xs: 8, md: 12 },
            background: 'linear-gradient(180deg, #1890FF 0%, #74CAFF 25%, #ffffff 50%)',
            color: 'text.primary',
            position: 'relative',
            overflow: 'hidden',
            '& .MuiTypography-root': {
              color: 'text.primary',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(24, 144, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              zIndex: 1,
            },
          }}
        >
          <Container component={MotionViewport} sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
              <m.div variants={varFade().inUp}>
                <Typography 
                  id="hero-heading"
                  variant="h2" 
                  component="h1"
                  sx={{ fontWeight: 800, mb: 2 }}
                >
                  {translate('enterprise.hero.title')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
                  {translate('enterprise.hero.subtitle')}
                </Typography>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} justifyContent="center">
                  <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => setDemoModalOpen(true)}
                    aria-label={translate('enterprise.hero.ctaPrimary')}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {translate('enterprise.hero.ctaPrimary')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    color="inherit" 
                    href="#how-it-works"
                    aria-label={translate('enterprise.hero.ctaSecondary')}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {translate('enterprise.hero.ctaSecondary')}
                  </Button>
                </Stack>
              </m.div>
              <m.div variants={varFade().inUp}>
                <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                  <Chip 
                    label={translate('enterprise.hero.badge1')} 
                    color="primary" 
                    variant="filled"
                    sx={{ bgcolor: 'primary.main', color: 'common.white' }}
                  />
                  <Chip 
                    label={translate('enterprise.hero.badge2')} 
                    color="primary" 
                    variant="filled"
                    sx={{ bgcolor: 'primary.main', color: 'common.white' }}
                  />
                  <Chip 
                    label={translate('enterprise.hero.badge3')} 
                    color="primary" 
                    variant="filled"
                    sx={{ bgcolor: 'primary.main', color: 'common.white' }}
                  />
                </Stack>
              </m.div>
            </Box>
          </Container>
        </Box>

        {/* Integration Modes */}
        <Container component="section" aria-labelledby="integration-heading" sx={{ py: { xs: 8, md: 10 } }}>
          <Box component={MotionViewport}>
                      <m.div variants={varFade().inUp}>
            <Typography 
              id="integration-heading"
              variant="h2" 
              component="h2"
              align="center" 
              sx={{ mb: 6, fontWeight: 800 }}
            >
              {translate('enterprise.integrationModes.title')}
            </Typography>
          </m.div>
            
            <m.div variants={varFade().inUp}>
              <Tabs
                value={currentTab}
                onChange={onChangeTab}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 4 }}
              >
                {integrationModes.map((mode) => (
                  <Tab
                    key={mode.value}
                    value={mode.value}
                    label={mode.label}
                    icon={mode.icon}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </m.div>
          </Box>

          {integrationModes.map((mode) => {
            const isMatched = mode.value === currentTab;
            return isMatched && (
              <m.div key={mode.value} variants={varFade().inUp}>
                <Card sx={{ p: 4 }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                        {mode.label}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {mode.description}
                      </Typography>
                      <Stack spacing={1} sx={{ mb: 3 }}>
                        {mode.features.map((feature) => (
                          <Stack key={feature} direction="row" spacing={1} alignItems="center">
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Typography variant="body2">{feature}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                                          <Button 
                      variant="contained" 
                      size="large"
                      onClick={() => setDemoModalOpen(true)}
                    >
                      {translate('enterprise.integrationModes.cta')}
                    </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          height: 400,
                          borderRadius: 2,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        {mode.value === 'layer' ? (
                          // Diagrama de integración
                          <Box sx={{ height: '100%', position: 'relative' }}>
                            <img
                              src="/assets/enterprise/diagrama.png"
                              alt="Diagrama de integración con tu sistema existente"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 8,
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                right: 16,
                                bgcolor: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                p: 2,
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="bold">
                                🔗 Capa Snowmatch
                              </Typography>
                              <Typography variant="body2">
                                Integración con tu sistema existente mediante API
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          // Mockup de la plataforma - Mostrar imagen según el modo
                          <Box sx={{ height: '100%', position: 'relative' }}>
                            {mode.value === 'rental' && (
                              // Solo Rental - Mostrar imagen de alquiler
                              <Box sx={{ height: '100%', position: 'relative' }}>
                                <img
                                  src="/assets/enterprise/rental.png"
                                  alt="Plataforma de alquiler de equipos"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    right: 16,
                                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    p: 2,
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    🎿 Plataforma de Alquiler de Equipos
                                  </Typography>
                                  <Typography variant="body2">
                                    Sistema completo para gestión de equipos de ski y snowboard con filtros avanzados
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                            
                            {mode.value === 'school' && (
                              // Solo Escuela - Mostrar imagen de clases
                              <Box sx={{ height: '100%', position: 'relative' }}>
                                <img
                                  src="/assets/enterprise/school.png"
                                  alt="Plataforma de reservas de clases"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    right: 16,
                                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    p: 2,
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    🏂 Sistema de Reservas de Clases
                                  </Typography>
                                  <Typography variant="body2">
                                    Gestión completa de instructores, packs y reservas de clases
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                            
                            {mode.value === 'both' && (
                              // Escuela + Rental - Mostrar imagen combinada
                              <Box sx={{ height: '100%', position: 'relative' }}>
                                <img
                                  src="/assets/enterprise/school+rental.png"
                                  alt="Plataforma completa escuela + rental"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    right: 16,
                                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                                    color: 'white',
                                    p: 2,
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    🎿🏂 Plataforma Completa
                                  </Typography>
                                  <Typography variant="body2">
                                    Sistema integrado de alquiler de equipos y reservas de clases
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </m.div>
            );
          })}
        </Container>

        {/* Main Modules */}
        <Box component="section" aria-labelledby="modules-heading" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container component={MotionViewport}>
            <m.div variants={varFade().inUp}>
              <Typography 
                id="modules-heading"
                variant="h2" 
                component="h2"
                align="center" 
                sx={{ mb: 6, fontWeight: 800 }}
              >
                {translate('enterprise.modules.title')}
              </Typography>
            </m.div>
            <Grid container spacing={3}>
              {modules.map((module, index) => (
                <Grid key={module.title} item xs={12} sm={6} md={4}>
                  <m.div variants={varFade().inUp}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'common.white',
                            }}
                          >
                            <CheckCircleIcon />
                          </Box>
                          <Typography variant="h6">{module.title}</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {module.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </m.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How it works */}
        <Container component="section" aria-labelledby="how-it-works-heading" id="how-it-works" sx={{ py: { xs: 8, md: 10 } }}>
          <m.div variants={varFade().inUp}>
            <Typography 
              id="how-it-works-heading"
              variant="h2" 
              component="h2"
              align="center" 
              sx={{ mb: 6, fontWeight: 800 }}
            >
              {translate('enterprise.howItWorks.title')}
            </Typography>
          </m.div>
          <Grid container spacing={3}>
            {steps.map((s, index) => (
              <Grid key={s.step} item xs={12} sm={6} md={4}>
                <m.div variants={varFade().inUp}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="overline" color="text.secondary">
                        {s.step}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </m.div>
              </Grid>
            ))}
          </Grid>
          <m.div variants={varFade().inUp}>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setDemoModalOpen(true)}
              >
                {translate('enterprise.howItWorks.cta')}
              </Button>
            </Box>
          </m.div>
        </Container>

        {/* Business Benefits */}
        <Box component="section" aria-labelledby="benefits-heading" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container component={MotionViewport}>
            <m.div variants={varFade().inUp}>
              <Typography 
                id="benefits-heading"
                variant="h2" 
                component="h2"
                align="center" 
                sx={{ mb: 6, fontWeight: 800 }}
              >
                {translate('enterprise.benefits.title')}
              </Typography>
            </m.div>
            
            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { value: '+40%', label: translate('enterprise.benefits.stats.moreBookings') },
                { value: '-60%', label: translate('enterprise.benefits.stats.lessQueues') },
                { value: '+25%', label: translate('enterprise.benefits.stats.conversion') },
                { value: '24/7', label: translate('enterprise.benefits.stats.support') }
              ].map((stat, index) => (
                <Grid key={index} item xs={12} sm={6} md={3}>
                  <m.div variants={varFade().inUp}>
                    <Card sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Card>
                  </m.div>
                </Grid>
              ))}
            </Grid>

            {/* Benefits list */}
            <Grid container spacing={3}>
              {benefits.map((benefit, index) => (
                <Grid key={benefit} item xs={12} sm={6} md={4}>
                  <m.div variants={varFade().inUp}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon color="success" />
                      <Typography variant="body1">{benefit}</Typography>
                    </Stack>
                  </m.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials */}
        <Box component="section" aria-labelledby="testimonials-heading" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container component={MotionViewport}>
            <m.div variants={varFade().inUp}>
              <Typography 
                id="testimonials-heading"
                variant="h2" 
                component="h2"
                align="center" 
                sx={{ mb: 6, fontWeight: 800 }}
              >
                {translate('enterprise.testimonials.title')}
              </Typography>
            </m.div>
            <Grid container spacing={3}>
              {testimonials.map((testimonial, index) => (
                <Grid key={testimonial.name} item xs={12} md={4}>
                  <m.div variants={varFade().inUp}>
                    <Card sx={{ height: '100%', p: 3 }}>
                      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                        "{testimonial.quote}"
                      </Typography>
                      <Stack>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                        <Typography variant="body2" color="primary.main">
                          {testimonial.center}
                        </Typography>
                      </Stack>
                    </Card>
                  </m.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* FAQs */}
        <Container component="section" aria-labelledby="faqs-heading" sx={{ py: { xs: 8, md: 10 } }}>
          <m.div variants={varFade().inUp}>
            <Typography 
              id="faqs-heading"
              variant="h2" 
              component="h2"
              align="center" 
              sx={{ mb: 6, fontWeight: 800 }}
            >
              {translate('enterprise.faqs.title')}
            </Typography>
          </m.div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} mx="auto">
              {faqs.map((faq, index) => (
                <m.div key={index} variants={varFade().inUp}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </m.div>
              ))}
            </Grid>
          </Grid>
        </Container>

        {/* Final CTA */}
        <Box component="section" aria-labelledby="final-cta-heading" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container component={MotionViewport}>
            <m.div variants={varFade().inUp}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                                          <Typography 
                      id="final-cta-heading"
                      variant="h2" 
                      component="h2"
                      sx={{ fontWeight: 800, mb: 1 }}
                    >
                      {translate('enterprise.finalCta.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {translate('enterprise.finalCta.subtitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>{translate('enterprise.finalCta.contact')}</strong> tomas@snowmatch.pro | WhatsApp +54 9 2944703443
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={2}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => setDemoModalOpen(true)}
                          fullWidth
                        >
                          {translate('enterprise.finalCta.ctaPrimary')}
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={<WhatsAppIcon />}
                          onClick={handleWhatsApp}
                          fullWidth
                        >
                          {translate('enterprise.finalCta.ctaSecondary')}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </m.div>
          </Container>
        </Box>
      </Box>

      {/* Demo Modal */}
      <Dialog 
        open={demoModalOpen} 
        onClose={() => setDemoModalOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="demo-modal-title"
        aria-describedby="demo-modal-description"
      >
        <DialogTitle id="demo-modal-title">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {translate('enterprise.demoModal.title')}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleDemoSubmit}>
          <DialogContent id="demo-modal-description">
            <Stack spacing={3}>
              <TextField
                fullWidth
                label={translate('enterprise.demoModal.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label={translate('enterprise.demoModal.email')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label={translate('enterprise.demoModal.center')}
                value={formData.center}
                onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label={translate('enterprise.demoModal.country')}
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
              <TextField
                fullWidth
                select
                label={translate('enterprise.demoModal.interest')}
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                required
              >
                <MenuItem value="school">{translate('enterprise.demoModal.options.school')}</MenuItem>
                <MenuItem value="rental">{translate('enterprise.demoModal.options.rental')}</MenuItem>
                <MenuItem value="both">{translate('enterprise.demoModal.options.both')}</MenuItem>
                <MenuItem value="layer">{translate('enterprise.demoModal.options.layer')}</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label={translate('enterprise.demoModal.message')}
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={translate('enterprise.demoModal.messagePlaceholder')}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button variant="outlined" onClick={() => setDemoModalOpen(false)}>
              {translate('enterprise.demoModal.cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {translate('enterprise.demoModal.submit')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
} 
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { MotionViewport, varFade } from '../components/animate';
import useLocales from '../hooks/useLocales';
import React from 'react';

// Custom CSS animations for enhanced visual experience
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes shimmer {
    0%, 100% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
  
  .enhanced-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .enhanced-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
  
  .enhanced-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .enhanced-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(56, 189, 248, 0.5);
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #8b5cf6 100%);
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// ----------------------------------------------------------------------

export default function TravelAgencyLanding() {
  const { translate } = useLocales();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState({
    lessonType: '', // 'group' or 'private'
    peopleCount: '',
    dates: {
      start: '',
      end: ''
    },
    includesEquipment: false,
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Language detection and setting
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const languageFromPath = pathSegments[1];
    
    if (languageFromPath && ['en', 'es', 'pt'].includes(languageFromPath)) {
      i18n.changeLanguage(languageFromPath);
      localStorage.setItem('i18nextLng', languageFromPath);
      console.log(`Language set to: ${languageFromPath} from URL path: ${location.pathname}`);
    }
  }, [location.pathname, i18n]);

  // SEO Data
  const seoData = {
    title: `${translate('agency.hero.title')} | Snowmatch`,
    description: translate('agency.hero.subtitle'),
    keywords: 'agencias de viajes, clases de esquí, equipos de esquí, snowmatch, experiencias de nieve, turismo, ski lessons, travel agencies, snow sports',
    canonicalUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}${location.pathname}`,
    ogImage: `${typeof window !== 'undefined' ? window.location.origin : ''}/assets/agencias-og.jpg`,
    twitterImage: `${typeof window !== 'undefined' ? window.location.origin : ''}/assets/agencias-twitter.jpg`,
  };

  // JSON-LD Structured Data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Snowmatch para Agencias de Viajes",
    "description": translate('agency.hero.subtitle'),
    "url": seoData.canonicalUrl,
    "provider": {
      "@type": "Organization",
      "name": "Snowmatch",
      "url": "https://snowmatch.pro",
      "logo": `${typeof window !== 'undefined' ? window.location.origin : ''}/logo/fullBlack.svg`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+54-9-2944703443",
        "contactType": "customer service",
        "availableLanguage": ["Spanish", "English", "Portuguese"],
        "areaServed": "Worldwide"
      }
    },
    "serviceType": "Ski Lessons and Equipment Rental for Travel Agencies",
    "areaServed": {
      "@type": "Place",
      "name": "Argentina",
      "containedInPlace": {
        "@type": "Place",
        "name": "South America"
      }
    },
    "offers": {
      "@type": "Offer",
      "description": "Ski lessons and equipment rental services for travel agencies",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0]
    },
    "category": [
      "Travel Services",
      "Ski Lessons",
      "Equipment Rental",
      "Tourism"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Travel Agencies",
      "geographicArea": {
        "@type": "Place",
        "name": "Argentina and International"
      }
    }
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
      "availableLanguage": ["Spanish", "English", "Portuguese"],
      "areaServed": "Worldwide",
      "email": "tomas@snowmatch.pro"
    },
    "sameAs": [
      "https://www.instagram.com/snowmatch.pro",
      "https://www.facebook.com/snowmatch.pro",
      "https://www.linkedin.com/company/snowmatch"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AR",
      "addressRegion": "Río Negro"
    }
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
        "name": "Agencias de Viajes",
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
      "name": "Servicios de esquí para agencias de viajes"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Agencias de viajes y turismo"
    },
    "mainEntity": {
      "@type": "Service",
      "name": "Snowmatch para Agencias"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": i18n.language || 'es'
  };

  const steps = [
    {
      label: translate('agency.quote.steps.step1.label'),
      description: translate('agency.quote.steps.step1.description')
    },
    {
      label: translate('agency.quote.steps.step2.label'),
      description: translate('agency.quote.steps.step2.description')
    },
    {
      label: translate('agency.quote.steps.step3.label'),
      description: translate('agency.quote.steps.step3.description')
    },
    {
      label: translate('agency.quote.steps.step4.label'),
      description: translate('agency.quote.steps.step4.description')
    }
  ];

  const benefits = [
    {
      icon: <SupportAgentIcon />,
      title: translate('agency.benefits.support24.title'),
      description: translate('agency.benefits.support24.description')
    },
    {
      icon: <VerifiedUserIcon />,
      title: translate('agency.benefits.verified.title'),
      description: translate('agency.benefits.verified.description')
    },
    {
      icon: <TrendingUpIcon />,
      title: translate('agency.benefits.help.title'),
      description: translate('agency.benefits.help.description')
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: translate('agency.howItWorks.step1.title'),
      description: translate('agency.howItWorks.step1.description')
    },
    {
      step: '02',
      title: translate('agency.howItWorks.step2.title'),
      description: translate('agency.howItWorks.step2.description')
    },
    {
      step: '03',
      title: translate('agency.howItWorks.step3.title'),
      description: translate('agency.howItWorks.step3.description')
    }
  ];

  const testimonials = [
    {
      quote: translate('agency.testimonials.testimonial1.quote'),
      name: translate('agency.testimonials.testimonial1.name'),
      role: translate('agency.testimonials.testimonial1.role'),
      agency: translate('agency.testimonials.testimonial1.agency')
    },
    {
      quote: translate('agency.testimonials.testimonial2.quote'),
      name: translate('agency.testimonials.testimonial2.name'),
      role: translate('agency.testimonials.testimonial2.role'),
      agency: translate('agency.testimonials.testimonial2.agency')
    }
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setQuoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field, value) => {
    setQuoteData(prev => ({
      ...prev,
      dates: {
        ...prev.dates,
        [field]: value
      }
    }));
  };

  const handleWhatsAppSubmit = () => {
    const message = `🏔️ *Cotización para Agencia de Viajes - Snowmatch*

👤 *Información de la agencia:*
• Agencia: ${quoteData.agencyName}
• Contacto: ${quoteData.contactName}
• Email: ${quoteData.email}
• Teléfono: ${quoteData.phone}

🎿 *Detalles del servicio:*
• Tipo de clase: ${quoteData.lessonType === 'group' ? 'Clases grupales' : 'Clases particulares'}
• Cantidad de personas: ${quoteData.peopleCount}
• Fecha inicio: ${quoteData.dates.start}
• Fecha fin: ${quoteData.dates.end}
• Incluye equipos: ${quoteData.includesEquipment ? 'Sí' : 'No'}

💬 *Mensaje adicional:*
${quoteData.message || 'Sin mensaje adicional'}

📅 *Fecha de solicitud:* ${new Date().toLocaleDateString('es-ES')}
🌐 *Página:* ${typeof window !== 'undefined' ? window.location.href : 'Agencias Landing'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5492944703443?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Reset form and close modal
    setQuoteData({
      lessonType: '',
      peopleCount: '',
      dates: { start: '', end: '' },
      includesEquipment: false,
      agencyName: '',
      contactName: '',
      email: '',
      phone: '',
      message: ''
    });
    setActiveStep(0);
    setQuoteModalOpen(false);
  };

  const handleHeroWhatsApp = () => {
    const message = `🏔️ *Consulta para Agencia de Viajes - Snowmatch*

Hola, me interesa conocer más sobre los servicios de Snowmatch para agencias de viajes.

📅 *Fecha de solicitud:* ${new Date().toLocaleDateString('es-ES')}
🌐 *Página:* ${typeof window !== 'undefined' ? window.location.href : 'Agencias Landing'}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5492944703443?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOpenQuoteModal = () => {
    setQuoteModalOpen(true);
    setActiveStep(0);
  };

  const handleCloseQuoteModal = () => {
    setQuoteModalOpen(false);
    setActiveStep(0);
    // Reset form when closing
    setQuoteData({
      lessonType: '',
      peopleCount: '',
      dates: { start: '', end: '' },
      includesEquipment: false,
      agencyName: '',
      contactName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    p: 3, 
                    cursor: 'pointer',
                    border: quoteData.lessonType === 'group' ? '2px solid #38bdf8' : '1px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': { borderColor: '#38bdf8' }
                  }}
                  onClick={() => handleInputChange('lessonType', 'group')}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {translate('agency.quote.lessonTypes.group.title')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {translate('agency.quote.lessonTypes.group.description')}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    p: 3, 
                    cursor: 'pointer',
                    border: quoteData.lessonType === 'private' ? '2px solid #38bdf8' : '1px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': { borderColor: '#38bdf8' }
                  }}
                  onClick={() => handleInputChange('lessonType', 'private')}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {translate('agency.quote.lessonTypes.private.title')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {translate('agency.quote.lessonTypes.private.description')}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label={translate('agency.quote.form.peopleCount')}
                type="number"
                value={quoteData.peopleCount}
                onChange={(e) => handleInputChange('peopleCount', e.target.value)}
                inputProps={{ min: 1, max: 20 }}
                helperText={translate('agency.quote.form.peopleCountHelper')}
              />
            </Stack>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={translate('agency.quote.form.startDate')}
                    type="date"
                    value={quoteData.dates.start}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={translate('agency.quote.form.endDate')}
                    type="date"
                    value={quoteData.dates.end}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              
              <FormControl fullWidth>
                <InputLabel>{translate('agency.quote.form.includesEquipment')}</InputLabel>
                <Select
                  value={quoteData.includesEquipment}
                  onChange={(e) => handleInputChange('includesEquipment', e.target.value)}
                  label={translate('agency.quote.form.includesEquipment')}
                >
                  <MenuItem value={true}>{translate('agency.quote.form.equipmentYes')}</MenuItem>
                  <MenuItem value={false}>{translate('agency.quote.form.equipmentNo')}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label={translate('agency.quote.form.agencyName')}
                value={quoteData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label={translate('agency.quote.form.contactName')}
                value={quoteData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label={translate('agency.quote.form.email')}
                type="email"
                value={quoteData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label={translate('agency.quote.form.phone')}
                value={quoteData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label={translate('agency.quote.form.message')}
                multiline
                rows={3}
                value={quoteData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={translate('agency.quote.form.messagePlaceholder')}
              />
            </Stack>
          </Box>
        );

      default:
        return null;
    }
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
        <meta name="language" content={i18n.language || 'es'} />
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
        <meta property="og:locale" content={i18n.language === 'en' ? 'en_US' : i18n.language === 'pt' ? 'pt_BR' : 'es_ES'} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.twitterImage} />
        <meta name="twitter:site" content="@snowmatch_pro" />
        <meta name="twitter:creator" content="@snowmatch_pro" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#38bdf8" />
        <meta name="msapplication-TileColor" content="#38bdf8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Snowmatch Agencias" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="AR-R" />
        <meta name="geo.placename" content="Argentina" />
        <meta name="geo.position" content="-41.1335;-71.3103" />
        <meta name="ICBM" content="-41.1335, -71.3103" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
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
        
        {/* Custom CSS for enhanced visual experience */}
        <style>{customStyles}</style>
      </Helmet>

      <Box>
        {/* Hero Section */}
        <Box
          component="section"
          aria-labelledby="hero-heading"
          sx={{
            pt: { xs: 12, md: 16 },
            pb: { xs: 10, md: 14 },
            background: `
              linear-gradient(135deg, 
                #0f1419 0%, 
                #1a2332 25%, 
                #2d3748 50%, 
                #4a5568 75%, 
                #e2e8f0 100%
              ),
              radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)
            `,
            color: 'common.white',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container component={MotionViewport} sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
              <m.div variants={varFade().inUp}>
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 4,
                      background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
                      borderRadius: 2,
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)',
                    }}
                  />
                  
                  <Typography 
                    id="hero-heading"
                    variant="h1" 
                    component="h1"
                    sx={{ 
                      fontWeight: 900,
                      mb: 2,
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
                      lineHeight: 1.1,
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {translate('agency.hero.title')}
                  </Typography>
                </Box>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    opacity: 0.95, 
                    mb: 5,
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.9)',
                    maxWidth: 700,
                    mx: 'auto',
                    fontWeight: 400,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {translate('agency.hero.subtitle')}
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  sx={{ mb: 6 }} 
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button 
                    variant="contained" 
                    size="large" 
                    onClick={handleHeroWhatsApp}
                    aria-label={translate('agency.hero.ctaPrimary')}
                    sx={{ 
                      px: 6, 
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                      boxShadow: '0 8px 32px rgba(56, 189, 248, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(56, 189, 248, 0.6)',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)',
                      },
                    }}
                  >
                    {translate('agency.hero.ctaPrimary')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    color="inherit" 
                    onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
                    aria-label={translate('agency.hero.ctaSecondary')}
                    sx={{ 
                      px: 6, 
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderWidth: 2,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'common.white',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.6)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {translate('agency.hero.ctaSecondary')}
                  </Button>
                </Stack>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Stack 
                  direction="row" 
                  spacing={2} 
                  flexWrap="wrap" 
                  justifyContent="center"
                  sx={{ mb: 2 }}
                >
                  {[
                    translate('agency.hero.badge1'),
                    translate('agency.hero.badge2'),
                    translate('agency.hero.badge3')
                  ].map((badge, index) => (
                    <Chip 
                      key={index}
                      label={badge} 
                      color="primary" 
                      variant="filled"
                      sx={{ 
                        bgcolor: 'rgba(56, 189, 248, 0.15)',
                        color: 'common.white',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        backdropFilter: 'blur(10px)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        px: 2,
                        py: 1,
                        '&:hover': {
                          bgcolor: 'rgba(56, 189, 248, 0.25)',
                          borderColor: 'rgba(56, 189, 248, 0.5)',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </m.div>
            </Box>
          </Container>
        </Box>


        {/* Beneficios para Agencias */}
        <Box component="section" aria-labelledby="beneficios-heading" id="beneficios" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container component={MotionViewport}>
            <m.div variants={varFade().inUp}>
              <Typography 
                id="beneficios-heading"
                variant="h2" 
                component="h2"
                align="center" 
                sx={{ mb: 6, fontWeight: 800 }}
              >
                {translate('agency.benefits.title')}
              </Typography>
            </m.div>
            
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid key={index} item xs={12} md={4}>
                  <m.div variants={varFade().inUp}>
                    <Card sx={{ 
                      height: '100%', 
                      p: 4,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      }
                    }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'common.white',
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 32px rgba(56, 189, 248, 0.3)',
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {benefit.description}
                      </Typography>
                    </Card>
                  </m.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Cómo funciona */}
        <Container component="section" aria-labelledby="how-it-works-heading" sx={{ py: { xs: 8, md: 10 } }}>
          <m.div variants={varFade().inUp}>
            <Typography 
              id="how-it-works-heading"
              variant="h2" 
              component="h2"
              align="center" 
                sx={{ mb: 6, fontWeight: 800 }}
              >
                {translate('agency.howItWorks.title')}
              </Typography>
          </m.div>
          <Grid container spacing={4}>
            {howItWorks.map((step, index) => (
              <Grid key={step.step} item xs={12} md={4}>
                <m.div variants={varFade().inUp}>
                  <Card sx={{ 
                    height: '100%', 
                    p: 4,
                    textAlign: 'center',
                    position: 'relative',
                  }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'common.white',
                        mx: 'auto',
                        mb: 3,
                        fontWeight: 700,
                        fontSize: '1.2rem',
                      }}
                    >
                      {step.step}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                  </Card>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Testimonios */}
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
                {translate('agency.testimonials.title')}
              </Typography>
            </m.div>
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid key={index} item xs={12} md={6}>
                  <m.div variants={varFade().inUp}>
                    <Card sx={{ 
                      height: '100%', 
                      p: 4,
                      position: 'relative',
                    }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                        ))}
                      </Stack>
                      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        "{testimonial.quote}"
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Stack>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                          {testimonial.agency}
                        </Typography>
                      </Stack>
                    </Card>
                  </m.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Final */}
        <Box component="section" aria-labelledby="final-cta-heading" sx={{ py: { xs: 8, md: 10 } }}>
          <Container component={MotionViewport}>
            <m.div variants={varFade().inUp}>
              <Card sx={{ 
                p: 6, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                color: 'common.white',
                borderRadius: 4,
              }}>
                <Typography 
                  id="final-cta-heading"
                  variant="h2" 
                  component="h2"
                  sx={{ fontWeight: 800, mb: 2 }}
                >
                  {translate('agency.finalCta.title')}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  {translate('agency.finalCta.subtitle')}
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleOpenQuoteModal}
                    sx={{
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'common.white',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {translate('agency.finalCta.ctaPrimary')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<WhatsAppIcon />}
                    onClick={handleWhatsAppSubmit}
                    sx={{
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: 'common.white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {translate('agency.finalCta.ctaSecondary')}
                  </Button>
                </Stack>
                <Typography variant="body2" sx={{ mt: 4, opacity: 0.8 }}>
                  <strong>{translate('agency.finalCta.contact')}</strong> tomas@snowmatch.pro | WhatsApp +54 9 2944703443
                </Typography>
              </Card>
            </m.div>
          </Container>
        </Box>
      </Box>

      {/* Modal de Cotización */}
      <Dialog 
        open={quoteModalOpen} 
        onClose={handleCloseQuoteModal}
        maxWidth="md"
        fullWidth
        aria-labelledby="quote-modal-title"
        aria-describedby="quote-modal-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
            overflow: 'auto'
          }
        }}
      >
        <DialogTitle id="quote-modal-title" sx={{ pb: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {translate('agency.quote.title')}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ opacity: 0.8 }}
            >
              {translate('agency.quote.subtitle')}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent id="quote-modal-description" sx={{ pt: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {step.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleWhatsAppSubmit : handleNext}
                      sx={{ 
                        mr: 1,
                        background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)',
                        }
                      }}
                      endIcon={index === steps.length - 1 ? <WhatsAppIcon /> : <ArrowForwardIcon />}
                    >
                      {index === steps.length - 1 ? translate('agency.quote.form.sendWhatsApp') : translate('agency.quote.form.continue')}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      {translate('agency.quote.form.back')}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseQuoteModal}
            color="inherit"
          >
            {translate('general.cancel') || 'Cancelar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

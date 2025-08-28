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
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import useTabs from '../hooks/useTabs';
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
  
  @keyframes slideInUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
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

export default function EnterpriseLanding() {
  const { translate } = useLocales();
  const { currentTab, onChangeTab } = useTabs('school');
  const location = useLocation(); // Get current location
  const { i18n } = useTranslation(); // Get i18n instance
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    center: '',
    country: '',
    interest: '',
    message: '',
  });

  // Language detection and setting
  useEffect(() => {
    // Extract language from pathname (e.g., /en/enterprise -> 'en')
    const pathSegments = location.pathname.split('/');
    const languageFromPath = pathSegments[1]; // First segment after domain
    
    if (languageFromPath && ['en', 'es', 'pt'].includes(languageFromPath)) {
      // Set language based on URL path
      i18n.changeLanguage(languageFromPath);
      
      // Also update localStorage for persistence
      localStorage.setItem('i18nextLng', languageFromPath);
      
      console.log(`Language set to: ${languageFromPath} from URL path: ${location.pathname}`);
    }
  }, [location.pathname, i18n]);

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
      icon: <PeopleIcon />,
    },
    {
      title: translate('enterprise.modules.rental.title'),
      description: translate('enterprise.modules.rental.description'),
      icon: <ShoppingBagIcon />,
    },
    {
      title: translate('enterprise.modules.payments.title'),
      description: translate('enterprise.modules.payments.description'),
      icon: <CreditCardIcon />,
    },
    {
      title: translate('enterprise.modules.checkin.title'),
      description: translate('enterprise.modules.checkin.description'),
      icon: <CheckCircleOutlineIcon />,
    },
    {
      title: translate('enterprise.modules.reviews.title'),
      description: translate('enterprise.modules.reviews.description'),
      icon: <StarIcon />,
    },
    {
      title: translate('enterprise.modules.seo.title'),
      description: translate('enterprise.modules.seo.description'),
      icon: <TrendingUpIcon />,
    },
    {
      title: translate('enterprise.modules.ai.title'),
      description: translate('enterprise.modules.ai.description'),
      icon: <VideoLibraryIcon />,
    },
    {
      title: translate('enterprise.modules.support.title'),
      description: translate('enterprise.modules.support.description'),
      icon: <HeadphonesIcon />,
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
        
        {/* Custom CSS for enhanced visual experience */}
        <style>{customStyles}</style>
      </Helmet>

      <Box >
        {/* Hero */}
        <Box
          component="section"
          aria-labelledby="hero-heading"
          sx={{
            pt: { xs: 12, md: 16 },
            pb: { xs: 10, md: 14 },
            // Enhanced gradient with better color transitions and depth
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
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // Subtle overlay pattern for texture
              background: `
                radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)
              `,
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // Animated gradient overlay for modern feel
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)',
              animation: 'shimmer 8s ease-in-out infinite',
              zIndex: 1,
            },
            '@keyframes shimmer': {
              '0%, 100%': { transform: 'translateX(-100%)' },
              '50%': { transform: 'translateX(100%)' },
            },
          }}
        >
          {/* Floating geometric elements for visual interest */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              right: '5%',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.1))',
              filter: 'blur(40px)',
              zIndex: 1,
              animation: 'float 6s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              left: '10%',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.1))',
              filter: 'blur(30px)',
              zIndex: 1,
              animation: 'float 8s ease-in-out infinite reverse',
            }}
          />
          
          {/* Additional floating elements for more visual interest */}
          <Box
            sx={{
              position: 'absolute',
              top: '60%',
              right: '15%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(99, 102, 241, 0.1))',
              filter: 'blur(25px)',
              zIndex: 1,
              animation: 'float 10s ease-in-out infinite',
            }}
          />
          
          {/* Subtle grid pattern overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              zIndex: 1,
              opacity: 0.3,
            }}
          />

          <Container component={MotionViewport} sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ 
              textAlign: 'center', 
              maxWidth: 900, 
              mx: 'auto',
              position: 'relative',
            }}>
              {/* Enhanced title with better typography and visual hierarchy */}
              <m.div variants={varFade().inUp}>
                <Box sx={{ mb: 3 }}>
                  {/* Subtle accent line above title */}
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
                    {translate('enterprise.hero.title')}
                  </Typography>
                </Box>
              </m.div>

              {/* Enhanced subtitle with better readability */}
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
                  {translate('enterprise.hero.subtitle')}
                </Typography>
              </m.div>



              {/* Enhanced CTA buttons with better visual appeal */}
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
                    onClick={() => setDemoModalOpen(true)}
                    aria-label={translate('enterprise.hero.ctaPrimary')}
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
                    {translate('enterprise.hero.ctaPrimary')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    color="inherit" 
                    href="#how-it-works"
                    aria-label={translate('enterprise.hero.ctaSecondary')}
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
                    {translate('enterprise.hero.ctaSecondary')}
                  </Button>
                </Stack>
              </m.div>

              {/* Enhanced badges with better visual hierarchy */}
              <m.div variants={varFade().inUp}>
                <Stack 
                  direction="row" 
                  spacing={2} 
                  flexWrap="wrap" 
                  justifyContent="center"
                  sx={{ mb: 2 }}
                >
                  {[
                    translate('enterprise.hero.badge1'),
                    translate('enterprise.hero.badge2'),
                    translate('enterprise.hero.badge3')
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

        {/* Integration Modes */}
        <Container component="section" aria-labelledby="integration-heading" sx={{ py: { xs: 8, md: 12 } }}>
          <Box component={MotionViewport}>
            <m.div variants={varFade().inUp}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                {/* Consistent accent line */}
                <Box
                  sx={{
                    width: 60,
                    height: 3,
                    background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
                    borderRadius: 2,
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 2px 15px rgba(56, 189, 248, 0.2)',
                  }}
                />
                <Typography 
                  id="integration-heading"
                  variant="h2" 
                  component="h2"
                  align="center" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {translate('enterprise.integrationModes.title')}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    maxWidth: 600, 
                    mx: 'auto',
                    opacity: 0.8,
                    fontWeight: 400,
                  }}
                >
                  Choose the integration mode that best fits your business needs
                </Typography>
              </Box>
            </m.div>
            
            <m.div variants={varFade().inUp}>
              <Tabs
                value={currentTab}
                onChange={onChangeTab}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  mb: 6,
                  '& .MuiTab-root': {
                    minHeight: 72,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 3,
                    mx: 1.5,
                    px: 4,
                    py: 2,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                    '& .MuiTab-iconWrapper': {
                      marginRight: 1.5,
                      fontSize: '1.25rem',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
                    boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)',
                  },
                  '& .MuiTabs-scrollButtons': {
                    color: 'text.secondary',
                    '&.Mui-disabled': {
                      opacity: 0.3,
                    },
                  },
                }}
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
                <Card 
                  sx={{ 
                    p: { xs: 3, md: 5 },
                    borderRadius: 3,
                    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.1)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    '&:hover': {
                      boxShadow: '0 12px 50px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                            color: 'common.white',
                            mb: 2,
                            boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)',
                          }}
                        >
                          {mode.icon}
                        </Box>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 2, 
                            fontWeight: 700,
                            color: 'text.primary',
                          }}
                        >
                          {mode.label}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 3,
                            fontSize: '1.1rem',
                            lineHeight: 1.6,
                          }}
                        >
                          {mode.description}
                        </Typography>
                      </Box>
                      
                      <Stack spacing={2} sx={{ mb: 4 }}>
                        {mode.features.map((feature, index) => (
                          <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
                            <CheckCircleIcon 
                              sx={{ 
                                color: 'success.main',
                                fontSize: '1.2rem',
                                mt: 0.2,
                                flexShrink: 0,
                              }} 
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                lineHeight: 1.5,
                                color: 'text.secondary',
                              }}
                            >
                              {feature}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                      
                      <Button 
                        variant="contained" 
                        size="large"
                        onClick={() => setDemoModalOpen(true)}
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                          boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 6px 25px rgba(56, 189, 248, 0.4)',
                          },
                        }}
                      >
                        {translate('enterprise.integrationModes.cta')}
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          height: { xs: 300, md: 400 },
                          borderRadius: 3,
                          overflow: 'hidden',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `
                              radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.05) 0%, transparent 50%),
                              radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)
                            `,
                            zIndex: 1,
                          },
                        }}
                      >
                        {mode.value === 'layer' ? (
                          // Integration diagram for Snowmatch Layer
                          <Box sx={{ height: '100%', position: 'relative' }}>
                            <img
                              src="/assets/enterprise/diagrama.png"
                              alt="Integration diagram with existing systems"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 12,
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                right: 16,
                                background: 'rgba(0, 0, 0, 0.85)',
                                color: 'white',
                                p: 3,
                                borderRadius: 2,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                zIndex: 2,
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                🔗 Snowmatch Layer
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Seamless integration with your existing systems via API
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          // Platform previews for other modes
                          <Box sx={{ height: '100%', position: 'relative' }}>
                            {mode.value === 'rental' && (
                              // Rental platform preview
                              <Box sx={{ height: '100%', position: 'relative' }}>
                                <img
                                  src="/assets/enterprise/rental.png"
                                  alt="Equipment rental platform"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    right: 16,
                                    background: 'rgba(0, 0, 0, 0.85)',
                                    color: 'white',
                                    p: 3,
                                    borderRadius: 2,
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    zIndex: 2,
                                  }}
                                >
                                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                    🎿 Equipment Rental Platform
                                  </Typography>
                                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Complete system for ski and snowboard equipment management
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                            
                            {mode.value === 'school' && (
                              // School platform preview
                              <Box sx={{ height: '100%', position: 'relative' }}>
                                <img
                                  src="/assets/enterprise/school.png"
                                  alt="Lesson booking platform"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    right: 16,
                                    background: 'rgba(0, 0, 0, 0.85)',
                                    color: 'white',
                                    p: 3,
                                    borderRadius: 2,
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    zIndex: 2,
                                  }}
                                >
                                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                    🏂 Lesson Booking System
                                  </Typography>
                                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Complete instructor and lesson management platform
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                            
                            {mode.value === 'both' && (
                              // Combined platform preview
                              <Box sx={{ height: '100%', position: 'relative' }}>
                                <img
                                  src="/assets/enterprise/school+rental.png"
                                  alt="Complete school + rental platform"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    right: 16,
                                    background: 'rgba(0, 0, 0, 0.85)',
                                    color: 'white',
                                    p: 3,
                                    borderRadius: 2,
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    zIndex: 2,
                                  }}
                                >
                                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                    🎿🏂 Complete Platform
                                  </Typography>
                                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Integrated equipment rental and lesson booking system
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
                <Grid key={module.title} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                  <m.div variants={varFade().inUp} style={{ width: '100%', display: 'flex' }}>
                    <Card sx={{ 
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}>
                      <CardContent sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3,
                      }}>
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
                              flexShrink: 0,
                            }}
                          >
                            {module.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {module.title}
                          </Typography>
                        </Stack>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            flex: 1,
                            lineHeight: 1.6,
                          }}
                        >
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
              <Grid key={s.step} item xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                <m.div variants={varFade().inUp} style={{ width: '100%', display: 'flex' }}>
                  <Card sx={{ 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}>
                    <CardContent sx={{ 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                    }}>
                      <Typography variant="overline" color="text.secondary">
                        {s.step}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, mb: 2, fontWeight: 600 }}>
                        {s.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          flex: 1,
                          lineHeight: 1.6,
                        }}
                      >
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
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import TripHero from '../components/TripHero';
import SponsorBanner from '../components/SponsorBanner';
import USPGrid from '../components/USPGrid';
import IncludedServices from '../components/IncludedServices';
import SampleItinerary from '../components/SampleItinerary';
import DestinationHighlights from '../components/DestinationHighlights';
import SkiTripVideos from '../components/SkiTripVideos';
import FloatingCTA from '../components/FloatingCTA';
import { JsonLd, generateSkiTripJsonLd } from '../components/JsonLd';
import { useWhatsAppLink } from '../hooks/useWhatsAppLink';

const SkiTripLanding = ({
  destination,
  title,
  subtitle,
  heroImage,
  altText,
  benefits,
  services,
  itinerary,
  highlights,
  stats,
  faqs,
  resortInfo,
  videos = [],
  phone = '+5492944567890',
  metaTitle,
  metaDescription,
  metaKeywords
}) => {
  const pageUrl = window.location.href;
  const whatsappLink = useWhatsAppLink({
    phone,
    destino: destination,
    dates: { checkin: null, checkout: null },
    pax: { adultos: 2, menores: 0 },
    nivel: 'intermedio',
    pageUrl,
  });

  const handleConsultClick = () => {
    if (window.gtag) {
      window.gtag('event', 'consult_availability_click', {
        destination,
      });
    }
    window.open(whatsappLink, '_blank');
  };

  const jsonLdData = generateSkiTripJsonLd({
    destination,
    title,
    description: metaDescription,
    image: heroImage,
    offers: null, // Add offers when available
    faqs,
    resortInfo
  });

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        
        {/* Canonical */}
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Snowmatch" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={heroImage} />
        
        {/* Hreflang */}
        <link rel="alternate" hrefLang="es-AR" href={pageUrl} />
        <link rel="alternate" hrefLang="es-MX" href={pageUrl} />
        <link rel="alternate" hrefLang="es-CL" href={pageUrl} />
        <link rel="alternate" hrefLang="pt-BR" href={pageUrl} />
        <link rel="alternate" hrefLang="x-default" href={pageUrl} />
      </Helmet>

      <JsonLd data={jsonLdData} />

                        <Box>
                    <TripHero
                      destination={destination}
                      title={title}
                      subtitle={subtitle}
                      heroImage={heroImage}
                      altText={altText}
                      phone={phone}
                    />

                    <SponsorBanner />

                    <USPGrid benefits={benefits} />

        <IncludedServices 
          services={services} 
          onConsultClick={handleConsultClick}
        />

        <SampleItinerary itinerary={itinerary} />

                            <DestinationHighlights
                      destination={destination}
                      highlights={highlights}
                      stats={stats}
                    />

                    {videos.length > 0 && (
                      <SkiTripVideos
                        videos={videos}
                        destination={destination}
                      />
                    )}

                    <FloatingCTA
                      destination={destination}
                      phone={phone}
                    />
      </Box>
    </>
  );
};

export default SkiTripLanding; 
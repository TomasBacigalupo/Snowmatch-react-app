import { Helmet } from 'react-helmet-async';

/**
 * Component for adding structured data (JSON-LD) to improve SEO
 */
export default function StructuredData({ 
  type = 'WebPage', 
  data = {},
  resortSlug = '',
  discipline = '',
  lessonType = ''
}) {
  const getStructuredData = () => {
    const baseUrl = window.location.origin;
    const currentUrl = window.location.href;
    
    switch (type) {
      case 'WebPage':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `${resortSlug ? resortSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') : 'SnowMatch'} - Clases de ${discipline || 'esquí y snowboard'}`,
          "description": `Encuentra instructores profesionales de ${discipline || 'esquí y snowboard'} en ${resortSlug ? resortSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') : 'los mejores resorts'}. Clases ${lessonType || 'privadas y grupales'} con SnowMatch.`,
          "url": currentUrl,
          "mainEntity": {
            "@type": "Organization",
            "name": "SnowMatch",
            "url": baseUrl,
            "logo": `${baseUrl}/logo/snowmatch.webp`,
            "description": "Plataforma para conectar estudiantes con instructores profesionales de esquí y snowboard"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": resortSlug ? resortSlug.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ') : 'Resorts',
                "item": resortSlug ? `${baseUrl}/${resortSlug}` : `${baseUrl}/resorts`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": `${discipline || 'Esquí y Snowboard'} - ${lessonType || 'Clases'}`,
                "item": currentUrl
              }
            ]
          }
        };
        
      case 'Service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `Clases de ${discipline || 'esquí y snowboard'} en ${resortSlug ? resortSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') : 'SnowMatch'}`,
          "description": `Servicio de clases ${lessonType || 'privadas y grupales'} de ${discipline || 'esquí y snowboard'} con instructores certificados`,
          "provider": {
            "@type": "Organization",
            "name": "SnowMatch",
            "url": baseUrl
          },
          "areaServed": resortSlug ? resortSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') : "Argentina",
          "serviceType": "Ski and Snowboard Lessons",
          "url": currentUrl
        };
        
      case 'ImageObject':
        return {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "name": `${resortSlug ? resortSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') : 'SnowMatch'} - Clases de ${discipline || 'esquí y snowboard'}`,
          "description": `Imagen de ${resortSlug ? resortSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ') : 'SnowMatch'} para clases de ${discipline || 'esquí y snowboard'}`,
          "url": data.imageUrl || `${baseUrl}/assets/bariloche.webp`,
          "contentUrl": data.imageUrl || `${baseUrl}/assets/bariloche.webp`,
          "thumbnailUrl": data.thumbnailUrl || `${baseUrl}/assets/bariloche.webp`,
          "width": data.width || 1200,
          "height": data.height || 675,
          "encodingFormat": "image/webp"
        };
        
      default:
        return data;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
}

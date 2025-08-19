import { Helmet } from 'react-helmet-async';

export const JsonLd = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

export const generateSkiTripJsonLd = ({ 
  destination, 
  title, 
  description, 
  image, 
  offers, 
  faqs,
  resortInfo 
}) => {
  const baseData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://snowmatch.pro/#organization",
        "name": "Snowmatch",
        "url": "https://snowmatch.pro",
        "logo": "https://snowmatch.pro/logo/fullBlack.svg",
        "sameAs": [
          "https://www.instagram.com/snowmatch.pro",
          "https://www.facebook.com/snowmatch.pro"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://snowmatch.pro/#website",
        "url": "https://snowmatch.pro",
        "name": "Snowmatch",
        "publisher": {
          "@id": "https://snowmatch.pro/#organization"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://snowmatch.pro/${destination}-ski-camp/#breadcrumb`,
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
            "name": `${destination} Ski Camp`,
            "item": `https://snowmatch.pro/${destination}-ski-camp`
          }
        ]
      },
      {
        "@type": "TouristTrip",
        "@id": `https://snowmatch.pro/${destination}-ski-camp/#trip`,
        "name": title,
        "description": description,
        "touristType": "Ski Trip",
        "image": image,
        "inLanguage": ["es", "pt"],
        "provider": {
          "@id": "https://snowmatch.pro/#organization"
        },
        "touristDestination": {
          "@type": "SkiResort",
          "@id": `https://snowmatch.pro/${destination}-ski-camp/#resort`,
          "name": resortInfo.name,
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": resortInfo.latitude,
            "longitude": resortInfo.longitude
          },
          "url": resortInfo.url,
          "sameAs": resortInfo.sameAs
        },
        "offers": offers ? {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "offerCount": offers.length,
          "offers": offers.map(offer => ({
            "@type": "Offer",
            "name": offer.name,
            "description": offer.description,
            "price": offer.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }))
        } : undefined
      }
    ]
  };

  // Add FAQ if provided
  if (faqs && faqs.length > 0) {
    baseData["@graph"].push({
      "@type": "FAQPage",
      "@id": `https://snowmatch.pro/${destination}-ski-camp/#faq`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  return baseData;
}; 
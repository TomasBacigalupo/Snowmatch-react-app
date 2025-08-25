import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------

export function RentalServiceSchema({ location, priceRange }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Snowmatch Ski Rental',
    description: 'Alquiler premium de equipos de esquí y snowboard con entrega a domicilio y ajuste profesional incluido',
    provider: {
      '@type': 'Organization',
      name: 'Snowmatch',
      url: 'https://snowmatch.com',
      logo: 'https://snowmatch.com/logo.png',
    },
    areaServed: {
      '@type': 'Place',
      name: location,
    },
    offers: {
      '@type': 'Offer',
      priceRange,
      availability: 'https://schema.org/InStock',
      url: `https://snowmatch.com/rental/${location}`,
    },
    serviceType: 'Ski Equipment Rental',
    category: 'Sports Equipment Rental',
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// ----------------------------------------------------------------------

export function RentalProductSchema({ product, location }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Snowmatch',
    },
    category: product.type === 'Ski' ? 'Ski Equipment' : 'Snowboard Equipment',
    offers: {
      '@type': 'Offer',
              price: product.pricePerDay || product.fromPricePerDay,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://snowmatch.com/rental/${location}`,
      seller: {
        '@type': 'Organization',
        name: 'Snowmatch',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Level',
        value: product.level ? product.level.join(', ') : (product.skillLevel || 'All Levels'),
      },
      {
        '@type': 'PropertyValue',
        name: 'Includes',
        value: product.includes ? product.includes.join(', ') : '',
      },
      {
        '@type': 'PropertyValue',
        name: 'Type',
        value: product.type,
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// ----------------------------------------------------------------------

export function RentalOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Snowmatch',
    url: 'https://snowmatch.com',
    logo: 'https://snowmatch.com/logo.png',
    description: 'Plataforma líder para alquiler de equipos de esquí y snowboard con entrega premium',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [
      'https://facebook.com/snowmatch',
      'https://instagram.com/snowmatch',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// ----------------------------------------------------------------------

export function RentalBreadcrumbSchema({ location }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://snowmatch.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Alquiler',
        item: 'https://snowmatch.com/rental',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: location,
        item: `https://snowmatch.com/rental/${location}`,
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
} 
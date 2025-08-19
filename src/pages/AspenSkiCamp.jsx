import SkiTripLanding from './SkiTripLanding';

const AspenSkiCamp = () => {
  const destination = 'Aspen';
  
  const data = {
    destination,
    title: 'Aspen Ski Camp by Snowmatch',
    subtitle: 'Alojamiento curado + rentals + traslados + clases. Vos elegís las fechas; nosotros armamos el resto.',
    heroImage: '/assets/resorts/aspen-hero.jpg',
    altText: 'Aspen Snowmass ski resort con montañas nevadas y pistas de esquí',
    
    benefits: [
      {
        icon: 'mdi:home-group',
        title: 'Alojamiento curado',
        description: 'Hoteles y condominios seleccionados en las mejores ubicaciones de Aspen y Snowmass.'
      },
      {
        icon: 'mdi:ski',
        title: 'Descuentos en rentals',
        description: 'Equipos de ski y snowboard de alta calidad con descuentos exclusivos para nuestros clientes.'
      },
      {
        icon: 'mdi:car',
        title: 'Traslados puerta a puerta',
        description: 'Transporte desde el aeropuerto y entre las 4 montañas de Aspen Snowmass.'
      },
      {
        icon: 'mdi:account-group',
        title: 'Clases con pros certificados',
        description: 'Instructores certificados PSIA/AASI para todos los niveles, desde principiantes hasta expertos.'
      },
      {
        icon: 'mdi:translate',
        title: 'Atención en español/portugués',
        description: 'Asesoramiento personalizado en tu idioma durante todo el proceso de planificación.'
      },
      {
        icon: 'mdi:headset',
        title: 'Asistencia dedicada',
        description: 'Acompañamiento antes y durante tu viaje por WhatsApp y email.'
      }
    ],

    services: [
      {
        icon: 'mdi:home-group',
        title: 'Alojamiento',
        description: 'Hoteles boutique y condominios de lujo en Aspen y Snowmass Village.',
        details: 'Desde $200/noche por persona'
      },
      {
        icon: 'mdi:ski',
        title: 'Rentals',
        description: 'Equipos de las mejores marcas: Salomon, Atomic, Burton, K2.',
        details: 'Desde $45/día por persona'
      },
      {
        icon: 'mdi:car',
        title: 'Traslados',
        description: 'Transporte privado desde Denver International Airport y entre montañas.',
        details: 'Incluido en el paquete'
      },
      {
        icon: 'mdi:account-group',
        title: 'Clases',
        description: 'Clases privadas y grupales con instructores certificados PSIA/AASI.',
        details: 'Desde $150/hora por persona'
      }
    ],

    itinerary: [
      {
        day: 1,
        icon: 'mdi:airplane',
        title: 'Llegada y Check-in',
        description: 'Bienvenida a Aspen y traslado al alojamiento.',
        activities: [
          'Traslado desde Denver International Airport',
          'Check-in en el hotel/condominio',
          'Orientación sobre las 4 montañas',
          'Cena de bienvenida'
        ]
      },
      {
        day: 2,
        icon: 'mdi:ski',
        title: 'Primer día de ski',
        description: 'Comienza tu aventura en las pistas de Aspen Mountain.',
        activities: [
          'Desayuno en el hotel',
          'Retiro de equipos de rental',
          'Clase de orientación (2 horas)',
          'Ski libre por la tarde'
        ]
      },
      {
        day: 3,
        icon: 'mdi:ski',
        title: 'Snowmass Mountain',
        description: 'Explora la montaña más grande del complejo.',
        activities: [
          'Traslado a Snowmass Village',
          'Clase de técnica (2 horas)',
          'Exploración de pistas intermedias',
          'Almuerzo en la montaña'
        ]
      },
      {
        day: 4,
        icon: 'mdi:ski',
        title: 'Aspen Highlands',
        description: 'Descubre las pistas más desafiantes del complejo.',
        activities: [
          'Clase avanzada (2 horas)',
          'Exploración de Highland Bowl',
          'Ski en pistas negras',
          'Apres-ski en Aspen'
        ]
      },
      {
        day: 5,
        icon: 'mdi:ski',
        title: 'Buttermilk Mountain',
        description: 'Día perfecto para familias y principiantes.',
        activities: [
          'Clase familiar (2 horas)',
          'Pistas verdes y azules',
          'Parque de terreno',
          'Actividades para niños'
        ]
      },
      {
        day: 6,
        icon: 'mdi:airplane',
        title: 'Día libre y despedida',
        description: 'Último día para disfrutar o explorar el pueblo.',
        activities: [
          'Ski libre o descanso',
          'Compras en Aspen',
          'Cena de despedida',
          'Preparación para el viaje de regreso'
        ]
      }
    ],

    highlights: [
      {
        icon: 'mdi:mountains',
        title: '4 Montañas Únicas',
        description: 'Aspen Snowmass ofrece cuatro montañas distintas: Aspen Mountain, Aspen Highlands, Buttermilk y Snowmass, cada una con su propio carácter y terreno.',
        features: [
          'Aspen Mountain: Terreno avanzado y vida nocturna',
          'Snowmass: La montaña más grande, perfecta para familias',
          'Aspen Highlands: Pistas desafiantes y Highland Bowl',
          'Buttermilk: Ideal para principiantes y parque de terreno'
        ]
      },
      {
        icon: 'mdi:city',
        title: 'Pueblo de Aspen',
        description: 'El histórico pueblo de Aspen combina el encanto del Viejo Oeste con la sofisticación moderna, ofreciendo una experiencia única.',
        features: [
          'Restaurantes de clase mundial',
          'Boutiques de lujo',
          'Vida nocturna vibrante',
          'Arquitectura histórica preservada'
        ]
      },
      {
        icon: 'mdi:weather-snowy',
        title: 'Nieve de Calidad',
        description: 'Con más de 300 días de sol al año y nieve seca de Colorado, Aspen ofrece condiciones de ski excepcionales.',
        features: [
          'Promedio de 300 pulgadas de nieve anual',
          'Nieve seca de Colorado',
          'Temporada larga (noviembre-abril)',
          'Condiciones consistentes'
        ]
      },
      {
        icon: 'mdi:account-group',
        title: 'Instructores Certificados',
        description: 'Nuestros instructores están certificados por PSIA/AASI y tienen años de experiencia enseñando en Aspen.',
        features: [
          'Certificación PSIA/AASI',
          'Experiencia en las 4 montañas',
          'Múltiples idiomas disponibles',
          'Enfoque personalizado'
        ]
      }
    ],

    stats: [
      { value: '4', label: 'Montañas' },
      { value: '5,527', label: 'Acres de terreno' },
      { value: '300', label: 'Días de sol' },
      { value: '300"', label: 'Nieve anual' }
    ],

    faqs: [
      {
        question: '¿Cuáles son las mejores fechas para visitar Aspen?',
        answer: 'La temporada alta va de diciembre a marzo, con las mejores condiciones de nieve. Enero y febrero son ideales para evitar multitudes, mientras que marzo ofrece días más largos y temperaturas más cálidas.'
      },
      {
        question: '¿Cómo llego a Aspen desde Denver?',
        answer: 'Ofrecemos traslados privados desde Denver International Airport (aproximadamente 4 horas) o puedes volar directamente al Aspen/Pitkin County Airport (ASE).'
      },
      {
        question: '¿Qué incluye el pase de lift?',
        answer: 'El pase de lift te da acceso a las 4 montañas: Aspen Mountain, Aspen Highlands, Buttermilk y Snowmass. Los pases de 3+ días incluyen acceso a todas las montañas.'
      },
      {
        question: '¿Qué nivel de ski necesito para Aspen?',
        answer: 'Aspen tiene opciones para todos los niveles. Buttermilk es ideal para principiantes, Snowmass para intermedios, y Aspen Mountain y Highlands para avanzados.'
      },
      {
        question: '¿Puedo alquilar equipos en Aspen?',
        answer: 'Sí, trabajamos con las mejores tiendas de rental de Aspen. Incluimos equipos de alta calidad de marcas como Salomon, Atomic y Burton.'
      },
      {
        question: '¿Qué pasa si cancelo mi viaje?',
        answer: 'Ofrecemos políticas de cancelación flexibles. Cancelaciones con más de 30 días de anticipación reciben reembolso completo, 15-30 días 50% de reembolso.'
      }
    ],

    resortInfo: {
      name: 'Aspen Snowmass',
      latitude: 39.1911,
      longitude: -106.8175,
      url: 'https://www.aspensnowmass.com',
      sameAs: [
        'https://www.instagram.com/aspensnowmass',
        'https://www.facebook.com/aspensnowmass',
        'https://www.aspensnowmass.com'
      ]
    },

    videos: [
      {
        url: "https://video.snowmatch.pro/tips/vcortadas.mov",
        thumbnail: "/assets/resorts/aspen-video-1.jpg",
        title: "Esquiando en Aspen Mountain",
        description: "Descubre las pistas icónicas de Aspen Mountain, perfectas para esquiadores intermedios y avanzados.",
        duration: "2:30"
      },
      {
        url: "https://video.snowmatch.pro/tips/Jaime2.mov",
        thumbnail: "/assets/resorts/aspen-video-2.jpg",
        title: "Snowmass - El Paraíso del Esquí",
        description: "Explora Snowmass, la montaña más grande del complejo con 3,332 acres de terreno variado.",
        duration: "3:15"
      },
      {
        url: "https://video.snowmatch.pro/tips/snowmatch1.mov",
        thumbnail: "/assets/resorts/aspen-video-3.jpg",
        title: "Buttermilk - Para Principiantes",
        description: "Buttermilk es perfecta para principiantes y familias, con pistas suaves y vistas increíbles.",
        duration: "1:45"
      }
    ],

    metaTitle: 'Paquete de esquí a Aspen (alojamiento + rentals + clases) | Snowmatch',
    metaDescription: 'Viaje completo a Aspen Snowmass con alojamiento, rentals, traslados y clases de esquí. 4 montañas, instructores certificados, atención en español. ¡Reserva tu viaje de ski a Aspen!',
    metaKeywords: 'Aspen ski, Aspen Snowmass, viaje a Aspen, paquete Aspen, clases de esquí en Aspen, alquiler de equipos Aspen, viaje de esquí, viaje de ski, paquetes de esquí, paquete ski, clases de esquí, alquiler de equipos, traslados aeropuerto, alojamiento en Aspen, camp de ski, escuela de ski'
  };

  return <SkiTripLanding {...data} />;
};

export default AspenSkiCamp; 
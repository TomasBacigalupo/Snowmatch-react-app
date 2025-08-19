import SkiTripLanding from './SkiTripLanding';

const VailSkiCamp = () => {
  const destination = 'Vail';
  
  const data = {
    destination,
    title: 'Vail Ski Camp by Snowmatch',
    subtitle: 'Alojamiento curado + rentals + traslados + clases. Vos elegís las fechas; nosotros armamos el resto.',
    heroImage: '/assets/resorts/vail-hero.jpg',
    altText: 'Vail ski resort con pistas de esquí y montañas nevadas',
    
    benefits: [
      {
        icon: 'mdi:home-group',
        title: 'Alojamiento curado',
        description: 'Hoteles y condominios de lujo en Vail Village y Lionshead, a pasos de las pistas.'
      },
      {
        icon: 'mdi:ski',
        title: 'Descuentos en rentals',
        description: 'Equipos de ski y snowboard de alta calidad con descuentos exclusivos para nuestros clientes.'
      },
      {
        icon: 'mdi:car',
        title: 'Traslados puerta a puerta',
        description: 'Transporte desde el aeropuerto y acceso directo a las pistas desde tu alojamiento.'
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
        description: 'Hoteles de lujo y condominios en Vail Village y Lionshead.',
        details: 'Desde $250/noche por persona'
      },
      {
        icon: 'mdi:ski',
        title: 'Rentals',
        description: 'Equipos de las mejores marcas: Salomon, Atomic, Burton, K2.',
        details: 'Desde $50/día por persona'
      },
      {
        icon: 'mdi:car',
        title: 'Traslados',
        description: 'Transporte privado desde Denver International Airport y acceso a pistas.',
        details: 'Incluido en el paquete'
      },
      {
        icon: 'mdi:account-group',
        title: 'Clases',
        description: 'Clases privadas y grupales con instructores certificados PSIA/AASI.',
        details: 'Desde $160/hora por persona'
      }
    ],

    itinerary: [
      {
        day: 1,
        icon: 'mdi:airplane',
        title: 'Llegada y Check-in',
        description: 'Bienvenida a Vail y traslado al alojamiento.',
        activities: [
          'Traslado desde Denver International Airport',
          'Check-in en el hotel/condominio',
          'Orientación sobre Vail Mountain',
          'Cena de bienvenida en Vail Village'
        ]
      },
      {
        day: 2,
        icon: 'mdi:ski',
        title: 'Primer día de ski',
        description: 'Comienza tu aventura en las pistas de Vail Mountain.',
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
        title: 'Exploración de Vail',
        description: 'Descubre las diferentes áreas de Vail Mountain.',
        activities: [
          'Clase de técnica (2 horas)',
          'Exploración de pistas intermedias',
          'Almuerzo en la montaña',
          'Apres-ski en Vail Village'
        ]
      },
      {
        day: 4,
        icon: 'mdi:ski',
        title: 'Beaver Creek',
        description: 'Excursión opcional a Beaver Creek, la montaña hermana de Vail.',
        activities: [
          'Traslado a Beaver Creek',
          'Clase avanzada (2 horas)',
          'Exploración de pistas negras',
          'Cena en Beaver Creek Village'
        ]
      },
      {
        day: 5,
        icon: 'mdi:ski',
        title: 'Back Bowls',
        description: 'Explora las famosas Back Bowls de Vail.',
        activities: [
          'Clase de técnica avanzada (2 horas)',
          'Ski en Back Bowls',
          'Exploración de Blue Sky Basin',
          'Apres-ski en Lionshead'
        ]
      },
      {
        day: 6,
        icon: 'mdi:airplane',
        title: 'Día libre y despedida',
        description: 'Último día para disfrutar o explorar el pueblo.',
        activities: [
          'Ski libre o descanso',
          'Compras en Vail Village',
          'Cena de despedida',
          'Preparación para el viaje de regreso'
        ]
      }
    ],

    highlights: [
      {
        icon: 'mdi:mountains',
        title: 'Vail Mountain',
        description: 'Con más de 5,300 acres de terreno, Vail es una de las montañas más grandes de Norteamérica, ofreciendo diversidad para todos los niveles.',
        features: [
          '5,300+ acres de terreno',
          '7 Back Bowls legendarias',
          'Blue Sky Basin',
          'Pistas para todos los niveles'
        ]
      },
      {
        icon: 'mdi:city',
        title: 'Vail Village',
        description: 'El pueblo de Vail recrea el encanto de un pueblo alpino europeo con arquitectura bávara y una vibrante escena gastronómica.',
        features: [
          'Arquitectura bávara auténtica',
          'Restaurantes de clase mundial',
          'Boutiques de lujo',
          'Vida nocturna europea'
        ]
      },
      {
        icon: 'mdi:weather-snowy',
        title: 'Nieve Legendaria',
        description: 'Vail es famoso por su nieve seca de Colorado y las legendarias Back Bowls que ofrecen algunas de las mejores experiencias de ski.',
        features: [
          'Nieve seca de Colorado',
          'Back Bowls legendarias',
          'Temporada larga',
          'Condiciones consistentes'
        ]
      },
      {
        icon: 'mdi:account-group',
        title: 'Instructores Expertos',
        description: 'Nuestros instructores están certificados por PSIA/AASI y conocen cada rincón de Vail Mountain.',
        features: [
          'Certificación PSIA/AASI',
          'Conocimiento profundo de Vail',
          'Múltiples idiomas disponibles',
          'Enfoque personalizado'
        ]
      }
    ],

    stats: [
      { value: '5,300+', label: 'Acres de terreno' },
      { value: '7', label: 'Back Bowls' },
      { value: '195', label: 'Pistas' },
      { value: '3,450', label: 'Pies de desnivel' }
    ],

    faqs: [
      {
        question: '¿Cuáles son las mejores fechas para visitar Vail?',
        answer: 'La temporada alta va de diciembre a marzo. Enero y febrero ofrecen las mejores condiciones de nieve, mientras que marzo tiene días más largos y temperaturas más cálidas.'
      },
      {
        question: '¿Cómo llego a Vail desde Denver?',
        answer: 'Ofrecemos traslados privados desde Denver International Airport (aproximadamente 2 horas) o puedes volar directamente al Eagle County Regional Airport (EGE).'
      },
      {
        question: '¿Qué incluye el pase de lift?',
        answer: 'El pase de lift te da acceso a Vail Mountain y opcionalmente a Beaver Creek. Los pases Epic Pass también incluyen acceso a otras montañas de Vail Resorts.'
      },
      {
        question: '¿Qué son las Back Bowls?',
        answer: 'Las Back Bowls son 7 áreas de ski en la parte trasera de Vail Mountain, famosas por su terreno abierto y nieve seca. Son ideales para esquiadores intermedios y avanzados.'
      },
      {
        question: '¿Puedo alquilar equipos en Vail?',
        answer: 'Sí, trabajamos con las mejores tiendas de rental de Vail. Incluimos equipos de alta calidad de marcas premium como Salomon, Atomic y Burton.'
      },
      {
        question: '¿Qué pasa si cancelo mi viaje?',
        answer: 'Ofrecemos políticas de cancelación flexibles. Cancelaciones con más de 30 días de anticipación reciben reembolso completo, 15-30 días 50% de reembolso.'
      }
    ],

    resortInfo: {
      name: 'Vail',
      latitude: 39.6433,
      longitude: -106.3781,
      url: 'https://www.vail.com',
      sameAs: [
        'https://www.instagram.com/vailmtn',
        'https://www.facebook.com/vailmtn',
        'https://www.vail.com'
      ]
    },

    videos: [
      {
        url: "https://video.snowmatch.pro/tips/snowmatch-follow-cam.mov",
        thumbnail: "/assets/resorts/vail-video-1.jpg",
        title: "Las Legendarias Back Bowls",
        description: "Explora las famosas Back Bowls de Vail, con 7 áreas de terreno abierto y nieve seca de Colorado.",
        duration: "3:45"
      },
      {
        url: "https://video.snowmatch.pro/tips/cortadas1.mov",
        thumbnail: "/assets/resorts/vail-video-2.jpg",
        title: "Vail Village - El Corazón Alpino",
        description: "Descubre Vail Village, un auténtico pueblo alpino con arquitectura bávara y encanto europeo.",
        duration: "2:20"
      },
      {
        url: "https://video.snowmatch.pro/tips/vcortadas.mov",
        thumbnail: "/assets/resorts/vail-video-3.jpg",
        title: "Blue Sky Basin",
        description: "Blue Sky Basin ofrece algunas de las mejores experiencias de ski en terreno abierto de Vail.",
        duration: "2:55"
      }
    ],

    metaTitle: 'Paquete de esquí a Vail (alojamiento + rentals + clases) | Snowmatch',
    metaDescription: 'Viaje completo a Vail con alojamiento, rentals, traslados y clases de esquí. 5,300+ acres, Back Bowls legendarias, instructores certificados. ¡Reserva tu viaje de ski a Vail!',
    metaKeywords: 'Vail ski, viaje a Vail, paquete Vail, clases de esquí en Vail, alquiler en Vail, Beaver Creek, viaje de esquí, viaje de ski, paquetes de esquí, paquete ski, clases de esquí, alquiler de equipos, traslados aeropuerto, alojamiento en Vail, camp de ski, escuela de ski'
  };

  return <SkiTripLanding {...data} />;
};

export default VailSkiCamp; 
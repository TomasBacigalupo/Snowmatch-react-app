import SkiTripLanding from './SkiTripLanding';

const JacksonHoleSkiCamp = () => {
  const destination = 'Jackson Hole';
  
  const data = {
    destination,
    title: 'Jackson Hole Ski Camp by Snowmatch',
    subtitle: 'Alojamiento curado + rentals + traslados + clases. Vos elegís las fechas; nosotros armamos el resto.',
    heroImage: '/assets/resorts/jackson-hole-hero.jpg',
    altText: 'Jackson Hole ski resort con montañas Teton y pistas de esquí',
    
    benefits: [
      {
        icon: 'mdi:home-group',
        title: 'Alojamiento curado',
        description: 'Hoteles boutique y condominios en Teton Village y Jackson Town, a minutos de las pistas.'
      },
      {
        icon: 'mdi:ski',
        title: 'Descuentos en rentals',
        description: 'Equipos de ski y snowboard de alta calidad con descuentos exclusivos para nuestros clientes.'
      },
      {
        icon: 'mdi:car',
        title: 'Traslados puerta a puerta',
        description: 'Transporte desde el aeropuerto y entre Teton Village y Jackson Town.'
      },
      {
        icon: 'mdi:account-group',
        title: 'Clases con pros certificados',
        description: 'Instructores certificados PSIA/AASI especializados en terreno avanzado y freeride.'
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
        description: 'Hoteles boutique en Teton Village y Jackson Town.',
        details: 'Desde $180/noche por persona'
      },
      {
        icon: 'mdi:ski',
        title: 'Rentals',
        description: 'Equipos de freeride y pista de las mejores marcas: Salomon, Atomic, Burton, K2.',
        details: 'Desde $40/día por persona'
      },
      {
        icon: 'mdi:car',
        title: 'Traslados',
        description: 'Transporte privado desde Jackson Hole Airport y entre pueblos.',
        details: 'Incluido en el paquete'
      },
      {
        icon: 'mdi:account-group',
        title: 'Clases',
        description: 'Clases especializadas en freeride y terreno avanzado con instructores expertos.',
        details: 'Desde $140/hora por persona'
      }
    ],

    itinerary: [
      {
        day: 1,
        icon: 'mdi:airplane',
        title: 'Llegada y Check-in',
        description: 'Bienvenida a Jackson Hole y traslado al alojamiento.',
        activities: [
          'Traslado desde Jackson Hole Airport',
          'Check-in en el hotel/condominio',
          'Orientación sobre Jackson Hole Mountain Resort',
          'Cena de bienvenida en Teton Village'
        ]
      },
      {
        day: 2,
        icon: 'mdi:ski',
        title: 'Primer día de ski',
        description: 'Comienza tu aventura en las pistas de Jackson Hole.',
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
        title: 'Exploración de la montaña',
        description: 'Descubre las diferentes áreas de Jackson Hole Mountain Resort.',
        activities: [
          'Clase de técnica (2 horas)',
          'Exploración de pistas intermedias',
          'Almuerzo en la montaña',
          'Apres-ski en Teton Village'
        ]
      },
      {
        day: 4,
        icon: 'mdi:ski',
        title: 'Terreno avanzado',
        description: 'Explora el famoso terreno avanzado de Jackson Hole.',
        activities: [
          'Clase de freeride (2 horas)',
          'Exploración de pistas negras',
          'Ski en Corbet\'s Couloir',
          'Cena en Jackson Town'
        ]
      },
      {
        day: 5,
        icon: 'mdi:ski',
        title: 'Freeride y backcountry',
        description: 'Aventúrate en el terreno fuera de pista con guías expertos.',
        activities: [
          'Clase de backcountry (2 horas)',
          'Exploración de áreas fuera de pista',
          'Ski en Hobacks',
          'Apres-ski en Teton Village'
        ]
      },
      {
        day: 6,
        icon: 'mdi:airplane',
        title: 'Día libre y despedida',
        description: 'Último día para disfrutar o explorar el pueblo.',
        activities: [
          'Ski libre o descanso',
          'Compras en Jackson Town',
          'Cena de despedida',
          'Preparación para el viaje de regreso'
        ]
      }
    ],

    highlights: [
      {
        icon: 'mdi:mountains',
        title: 'Jackson Hole Mountain Resort',
        description: 'Con más de 2,500 acres de terreno y 4,139 pies de desnivel, Jackson Hole es famoso por su terreno avanzado y freeride.',
        features: [
          '2,500+ acres de terreno',
          '4,139 pies de desnivel',
          'Terreno avanzado legendario',
          'Corbet\'s Couloir famoso'
        ]
      },
      {
        icon: 'mdi:city',
        title: 'Jackson Town',
        description: 'El histórico pueblo de Jackson combina el encanto del Viejo Oeste con una vibrante escena gastronómica y cultural.',
        features: [
          'Arquitectura del Viejo Oeste',
          'Restaurantes de clase mundial',
          'Galerías de arte',
          'Vida nocturna auténtica'
        ]
      },
      {
        icon: 'mdi:weather-snowy',
        title: 'Nieve de Wyoming',
        description: 'Jackson Hole recibe más de 400 pulgadas de nieve anual, ofreciendo condiciones de freeride excepcionales.',
        features: [
          '400+ pulgadas de nieve anual',
          'Nieve seca de Wyoming',
          'Temporada larga',
          'Condiciones de freeride'
        ]
      },
      {
        icon: 'mdi:account-group',
        title: 'Instructores Expertos',
        description: 'Nuestros instructores están especializados en terreno avanzado y freeride, con años de experiencia en Jackson Hole.',
        features: [
          'Certificación PSIA/AASI',
          'Especialización en freeride',
          'Conocimiento del terreno',
          'Enfoque en seguridad'
        ]
      }
    ],

    stats: [
      { value: '2,500+', label: 'Acres de terreno' },
      { value: '4,139', label: 'Pies de desnivel' },
      { value: '400+', label: 'Pulgadas de nieve' },
      { value: '116', label: 'Pistas' }
    ],

    faqs: [
      {
        question: '¿Cuáles son las mejores fechas para visitar Jackson Hole?',
        answer: 'La temporada alta va de diciembre a marzo. Enero y febrero ofrecen las mejores condiciones de nieve, mientras que marzo tiene días más largos y menos multitudes.'
      },
      {
        question: '¿Cómo llego a Jackson Hole?',
        answer: 'Ofrecemos traslados privados desde Jackson Hole Airport (JAC) o puedes volar directamente. El aeropuerto está a solo 20 minutos de Teton Village.'
      },
      {
        question: '¿Qué incluye el pase de lift?',
        answer: 'El pase de lift te da acceso a Jackson Hole Mountain Resort. También ofrecemos opciones para combinar con Grand Targhee Resort.'
      },
      {
        question: '¿Qué nivel de ski necesito para Jackson Hole?',
        answer: 'Jackson Hole es conocido por su terreno avanzado, pero tiene opciones para todos los niveles. Los principiantes pueden disfrutar de pistas verdes y azules.'
      },
      {
        question: '¿Puedo alquilar equipos en Jackson Hole?',
        answer: 'Sí, trabajamos con las mejores tiendas de rental de Jackson Hole. Incluimos equipos especializados para freeride y pista de marcas premium.'
      },
      {
        question: '¿Qué pasa si cancelo mi viaje?',
        answer: 'Ofrecemos políticas de cancelación flexibles. Cancelaciones con más de 30 días de anticipación reciben reembolso completo, 15-30 días 50% de reembolso.'
      }
    ],

    resortInfo: {
      name: 'Jackson Hole Mountain Resort',
      latitude: 43.5873,
      longitude: -110.8274,
      url: 'https://www.jacksonhole.com',
      sameAs: [
        'https://www.instagram.com/jacksonhole',
        'https://www.facebook.com/jacksonhole',
        'https://www.jacksonhole.com'
      ]
    },

    videos: [
      {
        url: "https://video.snowmatch.pro/tips/Jaime2.mov",
        thumbnail: "/assets/resorts/jackson-hole-video-1.jpg",
        title: "Corbet's Couloir - El Desafío",
        description: "Descubre Corbet's Couloir, una de las pistas más desafiantes y famosas de Jackson Hole.",
        duration: "4:10"
      },
      {
        url: "https://video.snowmatch.pro/tips/snowmatch1.mov",
        thumbnail: "/assets/resorts/jackson-hole-video-2.jpg",
        title: "Freeride en Jackson Hole",
        description: "Explora el terreno de freeride legendario de Jackson Hole, con más de 2,500 acres de terreno abierto.",
        duration: "3:30"
      },
      {
        url: "https://video.snowmatch.pro/tips/vcortadas.mov",
        thumbnail: "/assets/resorts/jackson-hole-video-3.jpg",
        title: "Jackson Town - El Viejo Oeste",
        description: "Conoce Jackson Town, un auténtico pueblo del Viejo Oeste con encanto y cultura únicos.",
        duration: "2:15"
      }
    ],

    metaTitle: 'Paquete de esquí a Jackson Hole (alojamiento + rentals + clases) | Snowmatch',
    metaDescription: 'Viaje completo a Jackson Hole con alojamiento, rentals, traslados y clases de esquí. Terreno avanzado, freeride, instructores expertos. ¡Reserva tu viaje de ski a Jackson Hole!',
    metaKeywords: 'Jackson Hole ski, viaje a Jackson Hole, paquete Jackson Hole, clases de esquí en Jackson Hole, Teton Village, viaje de esquí, viaje de ski, paquetes de esquí, paquete ski, clases de esquí, alquiler de equipos, traslados aeropuerto, alojamiento en Jackson Hole, camp de ski, escuela de ski'
  };

  return <SkiTripLanding {...data} />;
};

export default JacksonHoleSkiCamp; 
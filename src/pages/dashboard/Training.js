import { useCallback, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Slider from 'react-slick';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
import VideoUploadBottomSheet from 'src/sections/@dashboard/video/VideoUploadBottomSheet';
import AcademyWelcome from 'src/sections/@dashboard/video/AcademyWelcome';
import useAuth from 'src/hooks/useAuth';

// Carousel settings
const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4, // Default for large screens
  slidesToScroll: 1,
  variableWidth: true, // Allow dynamic width for slides
  responsive: [
    {
      breakpoint: 1280, // Medium screens
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 960, // Tablet screens
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600, // Mobile screens
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1, // Scroll one card at a time
        variableWidth: true, // Show part of the next card
      },
    },
  ],
};
const levelColors = {
  Principiante: 'secondary.lighter',
  Intermedio: 'info.lighter',
  Avanzado: 'info.light',
};

const levelIcon = {
  Principiante: '/assets/courses/Intensidad_1.svg',
  Intermedio: '/assets/courses/Intensidad_dark.svg',
  Avanzado: '/assets/courses/Intensidad_3.svg',
};

const CourseCard = ({ post, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      width: 240,
      height: 340,
      borderRadius: 2,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'primary.light',
      cursor: 'pointer',
      '&:hover': { boxShadow: 4 },
    }}
  >
    {/* Upper Section: Title, Subtitle, and Level Indicator */}
    <Box
      sx={{
        height: 180,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: levelColors[post.level] || 'secondary.lighter',
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        color="text.primary"
        noWrap
      >
        {post.title}
      </Typography>

      <Typography
        variant="h2"
        fontWeight="bold"
        color="text.primary"
        sx={{
          mb: 2,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2, // Allows up to 2 lines
          lineHeight: 1, // Tight line spacing
        }}
      >
        {post.subtitle}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
        <Box
          component="img"
          src={levelIcon[post.level]}
          alt="Level"
          sx={{ width: 24, height: 24 }}
        />
        <Typography variant="body2" fontWeight="bold" sx={{ ml: 'auto' }}>
          {post.points} pts
        </Typography>
      </Box>
    </Box>

    {/* Lower Section: Image */}
    <Box
      component="img"
      src={post.cover}
      alt={post.title}
      sx={{
        width: '100%',
        height: 160,
        objectFit: 'cover',
      }}
    />
  </Box>
);

// Main Component
export default function Training() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const [open, setOpen] = useState(false);
  const [openWelcome, setOpenWelcome] = useState(false);
  const [selectedLevelTitle, setSelectedLevelTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const user = useAuth()
  const today = new Date().toISOString().split("T")[0];
  const [isPremium, setIsPremium] = useState(user?.user?.premiumExpiration > today)

  const COURSES = [
    {
      title: 'Carving',
      subtitle: 'Domina las pistas completando los tres ejercicios',
      code: 'PIST',
      levels: [
        {
          title: 'Challenge 1 title',
          subtitle: 'Challenge 1 subtitle',
          cover: '/assets/courses/position.png',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov'
        },
        {
          title: 'Challenge 2 title',
          subtitle: 'Challenge 2 subtitle',
          cover: '/assets/courses/position.png',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov'
        },
        {
          title: 'Challenge 3 title',
          subtitle: 'Challenge 3 subtitle',
          cover: '/assets/courses/position.png',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov'
        },
        {
          title: 'Demo 1 title',
          subtitle: 'Demo 1 subtitle',
          cover: '/assets/courses/position.png',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov'
        },
        {
          title: 'Challenge 4 title',
          subtitle: 'Challenge 4 subtitle',
          cover: '/assets/courses/position.png',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov'
        },
        {
          title: 'Challenge 5 title',
          subtitle: 'Challenge 5 subtitle',
          cover: '/assets/courses/position.png',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov'
        },
        {
          title: 'Challenge 6 title',
          subtitle: 'Challenge 6 subtitle',
          cover: '/assets/courses/position.png',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov'
        },
        {
          title: 'Demo 2 title',
          subtitle: 'Demo 2 subtitle',
          cover: '/assets/courses/position.png',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Screen+Recording+2024-12-29+at+4.13.17%E2%80%AFPM.mov'
        },
        {
          title: 'Clavado de Bastón',
          subtitle: 'Aprende a clavar el bastón en el momento justo',
          cover: '/assets/courses/clavado.png',
          level: 'Intermedio',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/Tip_Como+hacer+el+clavado+de+baston.mp4'
        },
        {
          title: 'Vueltas Medianas',
          subtitle: 'Domina la velocidad en pistas azules con estilo',
          cover: '/assets/courses/pista2.png',
          level: 'Avanzado',
          points: 50,
        },
      ],
    },
    {
      title: 'Bumps',
      subtitle: 'Descubrí tu nivel en los bumps completando desafíos',
      code: 'BUMPS',
      levels: [
        {
          title: 'Challange 1 title',
          subtitle: 'Challange 1 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Challange 2 title',
          subtitle: 'Challange 2 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 3 title',
          subtitle: 'Challange 3 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Demo 1 title',
          subtitle: 'Demo 1 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 4 title',
          subtitle: 'Challange 4 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Challange 5 title',
          subtitle: 'Challange 5 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 6 title',
          subtitle: 'Challange 6 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Demo 2 title',
          subtitle: 'Demo 2 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
      ],
    },
    {
      title: 'Corto',
      subtitle: 'Descubrí tu nivel en los bumps completando desafíos',
      code: 'CORTO',
      levels: [
        {
          title: 'Challange 1 title',
          subtitle: 'Challange 1 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Challange 2 title',
          subtitle: 'Challange 2 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 3 title',
          subtitle: 'Challange 3 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Demo 1 title',
          subtitle: 'Demo 1 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 4 title',
          subtitle: 'Challange 4 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Challange 5 title',
          subtitle: 'Challange 5 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 6 title',
          subtitle: 'Challange 6 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Demo 2 title',
          subtitle: 'Demo 2 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
      ],
    },
    {
      title: 'FreeStyle',
      subtitle: 'Descubrí tu nivel en los bumps completando desafíos',
      code: 'FREE_STYLE',
      levels: [
        {
          title: 'Challange 1 title',
          subtitle: 'Challange 1 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Challange 2 title',
          subtitle: 'Challange 2 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 3 title',
          subtitle: 'Challange 3 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Demo 1 title',
          subtitle: 'Demo 1 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 4 title',
          subtitle: 'Challange 4 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Challange 5 title',
          subtitle: 'Challange 5 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
        {
          title: 'Challange 6 title',
          subtitle: 'Challange 6 subtitle',
          cover: '/assets/courses/carving.png',
          level: 'Principiante',
          points: 25,
        },
        {
          title: 'Demo 2 title',
          subtitle: 'Demo 2 subtitle',
          cover: '/assets/courses/pista.png',
          level: 'Intermedio',
          points: 25,
        },
      ],
    },
  ];

  const handleSelectCourseLevel = (course, level) => {
    setOpen(true)
    setSelectedCourse(course.code);
    setSelectedLevelTitle(level.code);
    setDemoUrl(level.demoUrl)
  };

  const handleCloseAcademywelcome = () => {
    setOpenWelcome(false)
    console.log(isPremium)
    if (isPremium) {
      setOpen(true)
    }
  }
  const onAddToPremium = () => {
    setIsPremium(true)
    setOpen(true)
  }

  return (
    <Page title={translate('training.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {COURSES.map((course, idx) => (
          <Box key={idx} sx={{ mb: 6 }}>
            {/* Section Header */}
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              {course.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }} color="text.secondary">
              {course.subtitle}
            </Typography>

            {/* Carousel for Course Levels */}
            <Slider
              {...sliderSettings}
              style={{
                display: 'flex',
              }}
            >
              {course.levels.map((level, levelIdx) => (
                <Box
                  key={levelIdx}
                  sx={{
                    flex: '0 0 auto',
                    marginRight: 2,
                  }}
                >
                  <CourseCard
                    post={level}
                    onClick={() => handleSelectCourseLevel(course, level)}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        ))}
      </Container>
      <VideoUploadBottomSheet
        title={selectedLevelTitle}
        course={selectedCourse}
        onOpen={() => setOpen(true)}
        open={open}
        onClose={() => setOpen(false)}
        demoUrl={demoUrl}
      />
    </Page>
  );
}
import { useCallback, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Slider from 'react-slick';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
import VideoUploadBottomSheet from 'src/sections/@dashboard/video/VideoUploadBottomSheet';
import useAuth from 'src/hooks/useAuth';
import CourseCard from 'src/sections/@dashboard/training/CourseCard';

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


// Main Component
export default function Training() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const [open, setOpen] = useState(false);
  const [openWelcome, setOpenWelcome] = useState(false);
  const [selectedLevelTitle, setSelectedLevelTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const user = useAuth()
  const today = new Date().toISOString().split("T")[0];
  const [isPremium, setIsPremium] = useState(user?.user?.premiumExpiration > today);

  const COURSES = [
    {
      title: 'Challange',
      subtitle: 'Sos un buen esquiador? Que SnowMatch AI lo diga!',
      code: 'CHALLANGE',
      levels: [
        {
          code: 'AI_CHALLANGE_1',
          title: 'Challenge 1 title',
          subtitle: 'Challenge 1 subtitle',
          cover: '/assets/courses/ai_challange.png',
          level: 'Principiante',
          points: 25,
          course: "CARVING_CHALLANGE",
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/CARVING_CHALLANGE_1.mov'
        }
      ],
    },
    {
      title: 'Carving',
      subtitle: 'Domina las pistas completando los tres ejercicios',
      code: 'CARVING',
      levels: [
        {
          code: 'CARVING_CHALLANGE_1',
          title: 'Challenge 1 title',
          subtitle: 'Challenge 1 subtitle',
          cover: 'https://image.snowmatch.pro/videoPosters/CARVING_CHALLANGE_1.jpg',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/CARVING_CHALLANGE_1.mov'
        },
        {
          code: 'CARVING_CHALLANGE_2',
          title: 'Challenge 2 title',
          subtitle: 'Challenge 2 subtitle',
          cover: 'https://image.snowmatch.pro/videoPosters/CARVING_CHALLANGE_2.jpg',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/CARVING_CHALLANGE_2.mov'
        },
        {
          code: 'CARVING_CHALLANGE_3',
          title: 'Challenge 3 title',
          subtitle: 'Challenge 3 subtitle',
          cover: 'https://image.snowmatch.pro/videoPosters/CARVING_CHALLANGE_3.jpg',
          level: 'Principiante',
          points: 25,
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/CARVING_CHALLANGE_2.mov'
        },
        {
          code: 'CARVING_DEMO_1',
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
          code: "BUMPS_CHALLANGE_1",
          title: 'Challange 1 title',
          subtitle: 'Challange 1 subtitle',
          cover: 'https://image.snowmatch.pro/videoPosters/BUMPS_CHALLANGE_1.jpg',
          level: 'Principiante',
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/BUMPS_CHALLANGE_1.mov',
          points: 25,
        },
        {
          code: "BUMPS_CHALLANGE_2",
          title: 'Challange 2 title',
          subtitle: 'Challange 2 subtitle',
          cover: 'https://image.snowmatch.pro/videoPosters/BUMPS_CHALLANGE_2.jpg',
          level: 'Intermedio',
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/BUMPS_CHALLANGE_2.mov',
          points: 25,
        },
        {
          code: "BUMPS_CHALLANGE_3",
          title: 'Challange 3 title',
          subtitle: 'Challange 3 subtitle',
          cover: 'https://image.snowmatch.pro/videoPosters/BUMPS_CHALLANGE_3.jpg',
          level: 'Principiante',
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/BUMPS_CHALLANGE_3.mov',
          points: 25,
        },
        {
          code: "BUMPS_DEMO_1",
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
    console.log("level", level)
    setOpen(true)
    setSelectedCourse(course.code);
    setSelectedLevelTitle(level.code);
    setSelectedLevel(level.code)
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
          <Box key={idx} sx={{ mb: 6, position: 'relative' }}>
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
              style={{ display: 'flex', position: 'relative' }}
            >
              {course.levels.map((level, levelIdx) => (
                <Box
                  key={levelIdx}
                  sx={{
                    flex: '0 0 auto',
                    marginRight: 2,
                    position: 'relative',
                  }}
                >
                  <CourseCard
                    post={level}
                    onClick={() => idx === 0 && handleSelectCourseLevel(course, level)}
                    sx={{
                      pointerEvents: idx === 0 ? 'auto' : 'none', // Desactiva interacción si idx > 0
                      opacity: idx === 0 ? 1 : 0.5, // Reduce visibilidad si idx > 0
                    }}
                  />
                  {idx > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                      }}
                    >
                      Coming Soon
                    </Box>
                  )}
                </Box>
              ))}
            </Slider>
          </Box>
        ))}
      </Container>
      <VideoUploadBottomSheet
        title={selectedLevelTitle}
        course={selectedCourse}
        level={selectedLevel}
        onOpen={() => setOpen(true)}
        open={open}
        onClose={() => setOpen(false)}
        demoUrl={demoUrl}

      />
    </Page>
  );
}
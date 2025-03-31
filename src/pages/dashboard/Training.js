import { useCallback, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Slider from 'react-slick';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
import VideoUploadBottomSheet from 'src/sections/@dashboard/video/VideoUploadBottomSheet';
import useAuth from 'src/hooks/useAuth';
import CourseCard from 'src/sections/@dashboard/training/CourseCard';
import SkiProgress from 'src/sections/@dashboard/video/SkiProgress';
import { Icon } from '@iconify/react';
import ExcerciseBottomSheet from 'src/sections/@dashboard/video/ExcerciseBottomSheet';

// Carousel settings
const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  variableWidth: false,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: false,
      },
    },
  ],
};


// Main Component
export default function Training() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const [open, setOpen] = useState(false);
  const [openExcercise, setOpenExcercise] = useState(false);
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
      title: 'Top Challenges',
      subtitle: 'Desafiate a vos mismo y a tus amigos con los ejercicios de esquí más populares',
      code: 'CHALLANGE',
      levels: [
        {
          code: 'AI_CHALLANGE_1',
          title: 'Challenge 1 title',
          subtitle: 'Challenge 1 subtitle',
          cover: '/assets/courses/pista.png',
          icon: "hugeicons:angle-01",
          level: 'Principiante',
          points: 25,
          course: "CARVING_CHALLANGE",
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/CARVING_CHALLANGE_1.mov'
        },
        {
          code: 'AI_CHALLANGE_2',
          title: 'Challenge 2 title',
          subtitle: 'Challenge 2 subtitle',
          cover: '/assets/courses/position.png',
          icon: 'ph:wave-sine-light',
          level: 'Principiante',
          points: 25,
          course: "AI_CHALLANGE_2",
          demoUrl: 'https://snowmatchvideos.s3.us-east-1.amazonaws.com/CARVING_CHALLANGE_1.mov'
        }
      ],
    },
  ];

  const handleSelectCourseLevel = (course, level) => {
    if (course.code === "AI_CHALLANGE_1" || level.code === "AI_CHALLANGE_1") {
      setOpen(true)
    } else {
      setOpenExcercise(true)
    }
    console.log("level", level)

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
            <Box display="flex" gap={2} mb={1} alignItems="center">
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {course.title}
              </Typography>
              {idx === 0 && <Icon icon="solar:medal-ribbon-linear" height="30px" />}
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 3 }} color="text.secondary">
              {course.subtitle}
            </Typography>

            {/* Carousel for Course Levels */}
            <Slider
              {...sliderSettings}
              style={{ 
                display: 'flex',
                position: 'relative',
                width: '100%',
                overflow: 'hidden'
              }}
            >
              {course.levels.map((level, levelIdx) => (
                <Box
                  key={levelIdx}
                  sx={{
                    flex: '1 0 auto',
                    marginRight: 2,
                    position: 'relative',
                    width: '100%',
                    maxWidth: '300px',
                  }}
                >
                  <CourseCard
                    post={level}
                    onClick={() => handleSelectCourseLevel(course, level)}
                    sx={{
                      pointerEvents: idx === 0 ? 'auto' : 'none', // Desactiva interacción si idx > 0
                      opacity: idx === 0 ? 1 : 0.5, // Reduce visibilidad si idx > 0
                    }}
                  />
                  {/* {idx > 0 && (
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
                  )} */}
                </Box>
              ))}
            </Slider>
          </Box>
        ))}
        {/* Section Header */}
        <Box display="flex" gap={2} mb={1} alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Aprende a esquiar progressivamente
          </Typography>
          <Icon icon="mdi:snowflake" height="30px" />
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 3 }} color="text.secondary">
          Segui nuestros nieveles para ver hasta donde puedes llegar
        </Typography>
        <SkiProgress />
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
      <ExcerciseBottomSheet title={selectedLevelTitle}
        course={selectedCourse}
        level={selectedLevel}
        onOpen={() => setOpenExcercise(true)}
        open={openExcercise}
        onClose={() => setOpenExcercise(false)}
        demoUrl={demoUrl}
      />
    </Page>
  );
}
import orderBy from 'lodash/orderBy';
import { useEffect, useCallback, useState } from 'react';
import { Grid, Container, Stack, Typography, Box } from '@mui/material';
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import axios from '../../utils/axios';
import Page from '../../components/Page';
import { SkeletonPostItem } from '../../components/skeleton';
import useLocales from 'src/hooks/useLocales';
import TrainingHeroSection from './TrainingHeroSection';
import VideoUploadBottomSheet from 'src/sections/@dashboard/video/VideoUploadBottomSheet';


// Custom Card Component for Videos
const TrainingCard = ({ post, index }) => (
    <Box
        sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#f4f4f4',
            '&:hover img': { transform: 'scale(1.05)', transition: '0.3s' },
        }}
    >
        <Box
            component="img"
            src={post.cover}
            alt={post.title}
            sx={{
                width: '100%',
                height: 180,
                objectFit: 'cover',
            }}
        />
        <Box sx={{ p: 2 }}>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
                {post.subtitle}
            </Typography>
        </Box>
    </Box>
);

// Main Training Page
export default function Training() {
    const { themeStretch } = useSettings();
    const { translate } = useLocales();
    const [open, setOpen] = useState(false)
    const [selectedLevelTitle, setSelectedLevelTitle] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    


    const COURSES = [
        {
            title: "Pista",
            subtitle: "Domina las pistas completando los tres ejercicios",
            cover: "/assets/courses/pista.png",
            description: "Aprende a esquiar en la pista con correcciones online de nuestro equipo",
            levels: [
                {
                    title: "Posicion al esquiar",
                    subtitle: "Mejora tu posicion en la bajada",
                    cover: "/assets/courses/position.png"
                },
                {
                    title: "Clavado de Baston",
                    subtitle: "Aprende a clavar el baston en el momento justo",
                    cover: "/assets/courses/clavado.png"
                },
                {
                    title: "Vueltas Medianas",
                    subtitle: "Domina la velocidad en pistas azules con estilo",
                    cover: "/assets/courses/pista2.png"
                }
            ]
        },
        {
            title: "Bumps",
            subtitle: "Descubri tu nivel en los bumps completando desafíos",
            cover: "/assets/courses/bumps.png",
            levels: [
                {
                    title: "Primeros moguls",
                    subtitle: "Ejercicio para mejorar bumps",
                    cover: "/assets/courses/carving.png"
                },
                {
                    title: "Clavado de Baston",
                    subtitle: "Aprende a clavar el baston en el momento justo",
                    cover: "/assets/courses/pista.png"
                }
            ]
        }
    ]

    const handleSelectCourseLevel = (course, level) => {
        setOpen(true);
        setSelectedCourse(course);
        setSelectedLevelTitle(level.title)
    }

    return (
        <Page title={translate('training.title')}>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Grid container spacing={4}>
                    {COURSES.map(course => (
                        <Grid item xs={12}>
                            <TrainingHeroSection
                                title={course.title}
                                subtitle={course.subtitle}
                                backgroundImage={course.cover}
                            />
                            <Box
                                sx={{
                                    mt: -30,
                                    position: 'relative',
                                    display: 'flex',
                                    overflowX: 'auto',
                                    whiteSpace: 'nowrap',
                                    gap: 3,
                                    pb: 2,
                                    px: 2,
                                    '&::-webkit-scrollbar': { height: 'none' },
                                    '&::-webkit-scrollbar-thumb': 'none',
                                }}
                            >
                                {course.levels.map((post, index) =>
                                    post ? (
                                        <Box key={post.id} sx={{ flex: '0 0 auto', width: 320 }} onClick={()=>handleSelectCourseLevel(course, post)}>
                                            <TrainingCard post={post} index={index}  />
                                        </Box>
                                    ) : (
                                        <SkeletonPostItem key={index} sx={{ flex: '0 0 auto', width: 240 }} />
                                    )
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <VideoUploadBottomSheet
                title={selectedLevelTitle}
                course={selectedCourse}
                onOpen={() => setOpen(true)}
                open={open}
                onClose={() => setOpen(false)} />
        </Page>
    );
}
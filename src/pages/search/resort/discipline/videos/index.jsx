import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Typography, Card, Collapse, IconButton, Paper, styled, Button, Modal, FormControl, InputLabel, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from "src/redux/store";
import { getFreeTeachers } from "src/redux/slices/teachers";
import ShopTeacherCard from "src/sections/@dashboard/e-commerce/shop/ShopTeacherCard";
import SchoolProducts from "src/sections/@dashboard/e-commerce/shop/SchoolProducts";
import { getProductsByBusinessId } from "src/redux/slices/business";
import { useNavigate } from 'react-router-dom';
import Iconify from "src/components/Iconify";


const TopTeachersSection = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        width: '90%',
    },
}));

const TeacherCard = styled(Box)(({ theme }) => ({
    flex: '0 0 auto',
    width: '280px',
    [theme.breakpoints.down('sm')]: {
        width: '240px',
    },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    overflowX: 'auto',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
    scrollbarWidth: 'none',  // Firefox
    msOverflowStyle: 'none', // IE and Edge
    '&::-webkit-scrollbar': {
        display: 'none',  // Chrome, Safari and Opera
    },
}));

const seo = {
    title: "Escuela de Esquí y Snowboard en Bariloche | SnowMatch",
    description: "Descubre las mejores clases, consejos, técnicas y videos de instructores certificados para mejorar tu esquí y snowboard en Bariloche. Reserva tu clase personalizada con SnowMatch.",
    keywords: "esquí, snowboard, tips, consejos, Bariloche, clases, instructores, técnica, videos, SnowMatch",
    url: "https://snowmatch.com/escuela-de-esqui-y-snowboard",
    canonical: "https://snowmatch.com/escuela-de-esqui-y-snowboard",
    author: "SnowMatch",
    publisher: "SnowMatch"
};

const tips = [
    {
        tip: "Carving",
        subtitle: "Clase de esqui en pista",
        teacherId: 1,
        description: "Vas a poner casi todo tu peso en la pierna exterior y acortar la pierna interior. Esto va a inclinar tus caderas hacia el interior del giro, pero cuidado: mantené la cabeza centrada.",
        do1: "Elegí una pista suave, que conozcas bien y con poca gente.",
        do2: "Hacé giros amplios, así tenés tiempo de ajustar cuánto ángulo necesitás en cada uno.",
        do3: "Hacé giros amplios, así tenés tiempo de ajustar cuánto ángulo necesitás en cada uno.",
        donot1: "No lo intentes en pistas empinadas, es contraproducente porque este ejercicio requiere tiempo para acostumbrarse.",
        donot2: "No pongas peso en la pierna interior, casi todo debe ir en la pierna exterior.",
        donot3: "Enfocate en la parte final del giro, eso te va a dar más equilibrio y ayudar al cuerpo a adaptarse mejor al ejercicio.",
        videos: [
            {
                url: "https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/vcortadas.mov",
                thumbnail: "https://s3.amazonaws.com/tu-bucket/thumbnails/clavado-baston-1.jpg",
                title: "Clavado de bastón - Técnica 1",
                description: "Demostración de cómo clavar el bastón correctamente."
            },
            {
                url: "https://s3.amazonaws.com/tu-bucket/videos/clavado-baston-2.mp4",
                thumbnail: "https://s3.amazonaws.com/tu-bucket/thumbnails/clavado-baston-2.jpg",
                title: "Clavado de bastón - Técnica 2",
                description: "Variación avanzada del clavado de bastón."
            }
        ],
        instructor: {
            name: "Maricu",
            lastname: "Manzano",
            imageLink: "https://image.snowmatch.pro/profile/Screenshot+2024-07-27+at+7.01.23%E2%80%AFPM.png",
            information: "Instructors certificado con más de 10 años de experiencia en esquí alpino.",
            level: "Nivel 4",
            stars: 4.8
        }
    },
    {
        tip: "Bumps",
        subtitle: "Clase de Bumps",
        teacherId: 248,
        description: "Cuando esquiás en bumps (moguls), elegí bien tu línea. Buscá un camino claro, que no sea demasiado empinado y con bumps de un tamaño manejable. Esto te va a ayudar a mantener el control y ganar confianza.",
        do1: "Elegí bien el terreno: Esquiá en una pista donde te sientas cómodo con el tamaño de los bumps — lo ideal es que sean de tamaño chico a mediano.",
        do2: "Mirá hacia adelante: Mantené la vista en la línea que vas a seguir, así podés anticiparte y adaptarte a tiempo.",
        do3: "Usá los bastones: El uso constante de los bastones te ayuda a mantener el ritmo y estabiliza la parte superior del cuerpo, que debe mirar siempre hacia abajo de la pista.",
        donot1: "Evitar lo desconocido: No bajes por pistas que no conocés, especialmente si no podés ver toda la bajada desde el inicio.",
        donot2: "Evitar lo desconocido: No bajes por pistas que no conocés, especialmente si no podés ver toda la bajada desde el inicio.",
        donot3: "No frenes en cada giro: Intentá mantenerte en movimiento, sin parar en cada vuelta, para conservar el ritmo.",
        videos: [
            {
                url: "https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/Jaime2.mov",
                thumbnail: "https://s3.amazonaws.com/tu-bucket/thumbnails/posicion-basica-1.jpg",
                title: "Posición básica - Introducción",
                description: "Cómo mantener la posición básica en esquí."
            }
        ],
        instructor: {
            name: "Jaime",
            lastname: "",
            imageLink: "https://image.snowmatch.pro/profile/248-d18fd41a-42c0-402b-b55c-bbecd6265999",
            information: "Especialista en bumps y freestyle con más de 8 años de experiencia enseñando.",
            level: "Nivel 4",
            stars: 4.9
        }
    }, {
        tip: "Balance",
        subtitle: "Clase de esqui para nivel avanzados",
        teacherId: 14,
        description: "Mantene el peso centrado. Bajá el centro de gravedad. Si es necesario exajerá la apertura de brasos",
        do1: "Flexionar las rodillas",
        do2: "Mantener el peso centrado",
        do3: "Mirar hacia adelante",
        donot1: "No encorvar la espalda",
        donot2: "No mirar los esquís",
        donot3: "No bloquear las rodillas",
        videos: [
            {
                url: "https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/snowmatch1.mov",
                thumbnail: "https://s3.amazonaws.com/tu-bucket/thumbnails/posicion-basica-1.jpg",
                title: "Posición básica - Introducción",
                description: "Cómo mantener la posición básica en esquí."
            }
        ],
        instructor: {
            name: "Tomas",
            lastname: "Soleño",
            imageLink: "https://image.snowmatch.pro/profile/Screenshot+2024-07-27+at+6.32.53%E2%80%AFPM.png",
            information: "Instructor especializado en técnica avanzada y competición.",
            level: "Nivel 5",
            stars: 5.0
        }
    },
    {
        tip: "Clavado de bastón",
        subtitle: "Clase de esqui para nivel intermedio",
        teacherId: 897,
        description: "Para hacer una buena plantada de bastón necesitás: Subir los brazos a tu campo de visión y abrir un poco las manos hacia afuera. Mantener el pecho mirando hacia abajo de la pendiente.. Tocar suavemente la nieve con la punta del bastón, mientras terminás el giro anterior y antes de cambiar de canto.",
        do1: "Practicalo en una pista fácil y larga, donde puedas concentrarte en incorporar algo nuevo.",
        do2: "Mantene la cabeza centrada y mirando hacia abajo de la pendiente.",
        do3: "Bajá el centro de gravedad hacia el exterior de la curva.",
        donot1: "No te inclines hacia el interior de la curva.",
        donot2: "Evita velocidades altas.",
        donot3: "No tomes posiciones defensivas.",
        videos: [
            {
                url: "https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/snowmatch-follow-cam.mov",
                thumbnail: "https://s3.amazonaws.com/tu-bucket/thumbnails/posicion-basica-1.jpg",
                title: "Posición básica - Introducción",
                description: "Cómo mantener la posición básica en esquí."
            }
        ],
        instructor: {
            name: "Agostina",
            lastname: "",
            imageLink: "https://image.snowmatch.pro/profile/agos_casuscelli.jpeg",
            information: "Instructora especializada en técnica intermedia y perfeccionamiento.",
            level: "Nivel 3",
            stars: 4.7
        }
    },
    {
        tip: "Vueltas cortadas",
        subtitle: "Clinica de esqui",
        teacherId: 23,
        description: "Para este ejercicio vas a tener que adoptar una posición más agresiva, ya que la velocidad y las fuerzas serán mayores. Lo ideal es hacerlo en pistas azules. El giro cuesta arriba te va a ayudar a reconocer las sensaciones que buscás en los giros normales.",
        do1: "Poné todo tu peso en el esquí exterior.",
        do2: "Rotá el tobillo y las rodillas hacia adentro.",
        do3: "Esquiá más rápido de lo habitual para generar la presión necesaria.",
        donot1: "No pierdas el control, ir más rápido no significa descontrolarse.",
        donot2: "No te tires solo hacia adentro: por más que te inclines, también tenés que volver con el cuerpo al centro.",
        donot3: "Evita rotar el torso hacia adentro.",
        videos: [
            {
                url: "https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/cortadas1.mov",
                thumbnail: "https://s3.amazonaws.com/tu-bucket/thumbnails/posicion-basica-1.jpg",
                title: "Posición básica - Introducción",
                description: "Cómo mantener la posición básica en esquí."
            }
        ],
        instructor: {
            name: "Mathias",
            lastname: "Pinna",
            imageLink: "https://image.snowmatch.pro/profile/Screenshot+2024-07-27+at+6.47.12%E2%80%AFPM.png",
            information: "Especialista en técnica avanzada e integrante del equipo de Demostradores.",
            level: "Nivel 5",
            stars: 4.8
        }
    },
    {
        tip: "Frenada",
        subtitle: "Clase de esqui para principiantes",
        teacherId: 592,
        description: "Mantené las puntas de los esquís separadas aproximadamente un puño entre sí. Abrí las colas de los esquís hacia afuera.",
        do1: "Mantené el equilibrio: Flexioná tobillos y rodillas, con las manos siempre hacia adelante.",
        do2: "Mirá hacia donde querés ir.",
        do3: "Sentí la espinilla presionando contra la lengüeta de la bota.",
        donot1: "No mires tus pies.",
        donot2: "No te inclines hacia la nieve con las manos.",
        donot3: "No uses los bastones para frenar.",
        videos: [
            {
                url: "https://snowmatchvideos.s3.us-east-1.amazonaws.com/tips/frenada.mp4",
                thumbnail: "https://s3.amazonaws.com/tu-bucket/thumbnails/posicion-basica-1.jpg",
                title: "Posición básica - Introducción",
                description: "Cómo mantener la posición básica en esquí."
            }
        ],
        instructor: {
            name: "Popi",
            lastname: "Dods",
            imageLink: "https://image.snowmatch.pro/profile/592-3ccf90b1-5c8a-4f64-9989-aa7b161479e9",
            information: "Instructora especializada en principiantes y primeros pasos en la nieve. Docente.",
            level: "Nivel 2",
            stars: 4.9
        }
    }
    // Puedes agregar más tips aquí
];

function TipCard({ tipObj, onReserve }) {
    const [expanded, setExpanded] = useState(false);
    const mainVideo = tipObj.videos && tipObj.videos[0];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '80dvh', width: '100%', alignItems: 'center' }}>
            <Card
                sx={{
                    width: { xs: '100%', sm: 340 },
                    minWidth: { xs: 'unset', sm: 340 },
                    height: '100%',
                    maxHeight: '545px',
                    flex: 1,
                    borderRadius: 4,
                    boxShadow: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'visible',
                    p: 0,
                    background: 'transparent',
                    position: 'relative',
                    maxWidth: 400,
                    mx: { xs: 2, sm: 0 },
                }}
            >
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    maxHeight: '545px',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: 2,
                    flex: 1,
                }}>
                    {mainVideo && (
                        <video
                            src={mainVideo.url}
                            poster={mainVideo.thumbnail}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', maxHeight: '565px' }}
                        />
                    )}

                    {/* Botón expandir/collapse */}
                    <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 3 }}>
                        <IconButton
                            onClick={() => setExpanded((prev) => !prev)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.85)',
                                border: '1px solid #eee',
                                boxShadow: 1,
                                transition: 'transform 0.2s',
                                transform: expanded ? 'rotate(180deg)' : 'none',
                                width: { xs: 44, md: 40 },
                                height: { xs: 44, md: 40 },
                            }}
                            aria-label="Ver detalles"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </Box>
                    {/* Collapse overlay superpuesto */}
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Paper
                            elevation={6}
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                bottom: { xs: 16, sm: 66 },
                                transform: 'translateX(-50%)',
                                minWidth: { xs: '90vw', sm: '320px' },
                                width: { xs: '90vw', sm: '200px' },
                                maxWidth: { xs: '90vw', sm: '200px' },
                                borderRadius: 4,
                                p: 2,
                                zIndex: 10,
                                boxShadow: 8,
                                background: '#fff',
                                opacity: 0.98,
                            }}
                        >
                            <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 700, fontSize: { xs: 18, sm: 22 } }}>
                                {tipObj.tip}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: 14, sm: 16 } }}>
                                {tipObj.description}
                            </Typography>
                        </Paper>
                    </Collapse>
                </Box>

            </Card>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Box>
                    <Typography component="p" variant="h6" >
                        {tipObj.tip}
                    </Typography>
                    <Typography component="h2" variant="body2" >
                        {tipObj.subtitle}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2, fontWeight: 700, boxShadow: 2, ml: 2, minWidth: 150 }}
                    onClick={onReserve}
                >
                    Reservar
                </Button>
            </Box>
        </Box>
    );
}

const ReservationModal = ({ open, onClose }) => {
    const [discipline, setDiscipline] = useState('');
    const [level, setLevel] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/match/independent?resort=Cerro%20Catedral');
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="reservation-modal-title"
            sx={{
                display: 'flex',
                alignItems: isMobile ? 'flex-end' : 'center',
                justifyContent: 'center',
                m: 0,
            }}
        >
            <Paper
                sx={{
                    width: { xs: '100%', sm: 400 },
                    p: 4,
                    borderRadius: isMobile ? '24px 24px 0 0' : 2,
                    position: 'relative',
                    boxShadow: 24,
                    mb: isMobile ? 0 : undefined,
                }}
            >
                <Typography id="reservation-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                    Reservar clase
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Disciplina</InputLabel>
                        <Select
                            value={discipline}
                            label="Disciplina"
                            onChange={(e) => setDiscipline(e.target.value)}
                            required
                        >
                            <MenuItem value="ski">Esquí</MenuItem>
                            <MenuItem value="snowboard">Snowboard</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Nivel</InputLabel>
                        <Select
                            value={level}
                            label="Nivel"
                            onChange={(e) => setLevel(e.target.value)}
                            required
                        >
                            <MenuItem value="beginner">Principiante</MenuItem>
                            <MenuItem value="intermediate">Intermedio</MenuItem>
                            <MenuItem value="advanced">Avanzado</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            sx={{ flex: 1 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ flex: 1 }}
                        >
                            Continuar
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Modal>
    );
};

const VideoAnalysisModal = ({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="video-analysis-modal-title"
            sx={{
                display: 'flex',
                alignItems: isMobile ? 'flex-end' : 'center',
                justifyContent: 'center',
                m: 0,
            }}
        >
            <Paper
                sx={{
                    width: { xs: '100%', sm: 400 },
                    p: 4,
                    borderRadius: isMobile ? '24px 24px 0 0' : 2,
                    position: 'relative',
                    boxShadow: 24,
                    mb: isMobile ? 0 : undefined,
                }}
            >
                <Typography id="video-analysis-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                    Análisis de Video
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Podés subir un video para que Snow, nuestra IA, o cualquiera de nuestros instructores lo analice y te dé feedback personalizado. Descargá nuestra app para acceder a esta función.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        href="https://apps.apple.com/app/snowmatch/id1234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            borderColor: 'black',
                            color: 'black',
                            '&:hover': {
                                borderColor: 'black',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        }}
                    >
                        Descargar App
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default function SnowMatchLanding() {
    const { teachers, filters } = useSelector((state) => { return state.teachers })
    const { products } = useSelector((state) => state.business);
    const dispatch = useDispatch()
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [isVideoAnalysisModalOpen, setIsVideoAnalysisModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getProductsByBusinessId(13));
        dispatch(getFreeTeachers(filters.from, filters.to, "Cerro Catedral", 0, 20));
    }, [dispatch, filters]);

    const handleOpenReservationModal = () => setIsReservationModalOpen(true);
    const handleCloseReservationModal = () => setIsReservationModalOpen(false);
    const handleOpenVideoAnalysisModal = () => setIsVideoAnalysisModalOpen(true);
    const handleCloseVideoAnalysisModal = () => setIsVideoAnalysisModalOpen(false);

    return (
        <>
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta name="keywords" content={seo.keywords} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:url" content={seo.url} />
                <link rel="canonical" href={seo.canonical} />
                <meta name="robots" content="index, follow" />
                <meta name="author" content={seo.author} />
                <meta name="publisher" content={seo.publisher} />
            </Helmet>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    minHeight: '100vh',
                    background: '#f5f6fa',
                    py: { xs: 8, md: 12 },
                    px: { xs: 2, sm: 0 },
                }}
            >
                <Box
                    sx={{
                        flex: { xs: 'unset', md: '0 0 460px' },
                        px: { xs: 0, sm: 4, md: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        minHeight: { xs: 'auto', md: '80vh' },
                        background: { md: 'linear-gradient(90deg, #fff 80%, rgba(245,246,250,0) 100%)' },
                        boxShadow: { md: '8px 0 32px -16px rgba(0,0,0,0.06)' },
                        borderRadius: { md: '0 48px 48px 0' },
                        mb: { xs: 2, md: 0 },
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h2"
                        sx={{
                            mb: 4,
                            textAlign: { xs: 'center', md: 'left' }
                        }}
                    >
                        Escuela de esquí y snowboard en Bariloche
                    </Typography>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'row',
                            gap: 2,
                            width: '100%',
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleOpenVideoAnalysisModal}
                            sx={{
                                borderColor: 'black',
                                color: 'black',
                                '&:hover': {
                                    borderColor: 'black',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            Análisis de video
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleOpenReservationModal}
                        >
                            Reservar clase
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        overflowX: { xs: 'visible', md: 'auto' },
                        pl: { xs: 0, md: 8 },
                        ml: { xs: 0, md: 8 },
                        width: '100%',
                        height: { xs: 320, sm: '81vh' },
                        minHeight: { xs: 320, sm: 540 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 3, md: 5 },
                            width: '100%',
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            height: '100%',
                            minHeight: '100%',
                            px: { xs: 0, sm: undefined }, // quitar padding horizontal en mobile
                        }}
                    >
                        {tips.map((tip, idx) => (
                            <TipCard key={idx} tipObj={tip} onReserve={handleOpenReservationModal} />
                        ))}
                    </Box>
                </Box>
            </Box>
            <TopTeachersSection>
                <Box sx={{ mb: 4, mx: { xs: 2, sm: 0 } }}>
                    <Typography variant='h3' sx={{ mb: 1 }}>Los mejores instructores</Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                        }}
                    >
                        {`Los mejores instructores de SnowMatch, con más de 10 años de experiencia en la nieve. Conoce a nuestros instructores y reserva tu clase personalizada.`}
                    </Typography>
                    {/* Primera fila: primeros 5 instructores */}
                    <ScrollContainer>
                        {teachers.slice(0, 5).map((teacher) => (
                            <TeacherCard key={teacher.id}>
                                <ShopTeacherCard teacher={teacher} fullBlack={true} />
                            </TeacherCard>
                        ))}
                    </ScrollContainer>
                    {/* Segunda fila: siguientes 5 instructores */}
                    <ScrollContainer sx={{ mt: 2 }}>
                        {teachers.slice(5, 10).map((teacher) => (
                            <TeacherCard key={teacher.id}>
                                <ShopTeacherCard teacher={teacher} fullBlack={true} />
                            </TeacherCard>
                        ))}
                    </ScrollContainer>
                </Box>
            </TopTeachersSection>

            {/* SnowMatch Packs Section */}
            <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', mt: 15, mb: 8 }}>
                <Box sx={{ mb: 4, mx: { xs: 2, sm: 0 } }}>
                    <Typography variant='h3' sx={{ mb: 1 }}>Packs SnowMatch</Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                        }}
                    >
                        {`Descubre nuestros packs especiales diseñados para mejorar tu experiencia en la nieve. Desde clases para principiantes hasta programas avanzados.`}
                    </Typography>
                    <SchoolProducts
                        showPrice={true}
                        products={products}
                        isLoading={false}
                    />
                </Box>
            </Box>

            {/* Secciones de tips: una por cada tip */}
            {tips.map((tip, idx) => (
                <Box
                    key={idx}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        width: '100%',
                        maxWidth: 1200,
                        mx: 'auto',
                        my: 8,
                        px: 2,
                    }}
                >
                    {/* Video a la izquierda */}
                    <Box sx={{
                        flex: 1,
                        minWidth: 280,
                        maxWidth: 480,
                        width: '100%',
                        p: { xs: 0, sm: undefined },
                        m: { xs: 0, sm: undefined },
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Box sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow: 4,
                            width: { xs: 'calc(100vw - 32px)', sm: '100%' },
                            maxWidth: { xs: 'calc(100vw - 32px)', sm: 480 },
                            aspectRatio: '9/16',
                            background: '#000',
                            mx: { xs: 'auto', sm: 0 }, // center on mobile with auto margins
                        }}>
                            <video
                                src={tip.videos[0].url}
                                poster={tip.videos[0].thumbnail}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </Box>
                    </Box>
                    {/* Datos del tip a la derecha */}
                    <Box sx={{ flex: 1, minWidth: 280, maxWidth: 480, width: '100%', display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{tip.tip}</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{tip.description}</Typography>

                        {/* Instructor Card */}
                        <Box
                            onClick={() => navigate(`/match/teacher/${tip.teacherId}`)}
                            sx={{
                                mb: 3,
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: 1,
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Instructor</Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '40px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                }}>
                                    <img
                                        src={tip.instructor.imageLink}
                                        alt={tip.instructor.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{
                                        fontWeight: 600,
                                        textDecoration: 'underline',
                                        textUnderlineOffset: '4px'
                                    }}>
                                        {tip.instructor.name} {tip.instructor.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        {tip.instructor.information}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                            {tip.instructor.level}
                                        </Typography>
                                        {tip.instructor.stars && (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ mr: 0.5 }}>
                                                    {tip.instructor.stars}
                                                </Typography>
                                                <Iconify icon="mdi:star" width={16} height={16} sx={{ color: 'warning.main' }} />
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            p: 3,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Iconify icon="mdi:check-circle" width={20} height={20} sx={{ color: 'success.main' }} />
                                    Recomendaciones
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5
                                }}>
                                    {[tip.do1, tip.do2, tip.do3].map((item, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1.5
                                        }}>
                                            <Iconify
                                                icon="mdi:check"
                                                width={16}
                                                height={16}
                                                sx={{
                                                    color: 'success.main',
                                                    mt: 0.5
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                {item}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Iconify icon="mdi:alert-circle" width={20} height={20} sx={{ color: 'warning.main' }} />
                                    Evitar
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5
                                }}>
                                    {[tip.donot1, tip.donot2, tip.donot3].map((item, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 1.5
                                        }}>
                                            <Iconify
                                                icon="mdi:close"
                                                width={16}
                                                height={16}
                                                sx={{
                                                    color: 'warning.main',
                                                    mt: 0.5
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                {item}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                        {/* CTA buttons: desktop side by side, mobile stacked */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                mt: 2,
                                alignItems: { xs: 'stretch', sm: 'center' },
                            }}
                        >
                            {/* Subir video - AI style */}
                            <Box
                                onClick={handleOpenVideoAnalysisModal}
                                sx={{
                                    textDecoration: 'none',
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Button
                                    fullWidth={true}
                                    variant="outlined"
                                    onClick={handleOpenVideoAnalysisModal}
                                    sx={{
                                        borderColor: 'black',
                                        color: 'black',
                                        '&:hover': {
                                            borderColor: 'black',
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        },
                                    }}
                                >
                                    Análisis de video
                                </Button>
                            </Box>
                            {/* Reservar clase - contained */}
                            <Box
                                onClick={handleOpenReservationModal}
                                sx={{
                                    textDecoration: 'none',
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{
                                        flex: 1,
                                    }}
                                >
                                    Reservar clase
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            ))}

            {/* Sección de Preguntas Frecuentes */}
            <Box sx={{ width: '100%', maxWidth: 800, px: {xs:2, sm: 'auto'}, mb: 10, mt: 8 }}>
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                    Preguntas Frecuentes sobre nuestras clases de esquí
                </Typography>

                <Typography sx={{ mb: 4 }}>
                    En esta sección respondemos las dudas más comunes sobre nuestras clases de esquí en Cerro Catedral, desde cómo comenzar si sos principiante hasta cómo mejorar tu técnica si ya tenés experiencia. Nuestros instructores certificados te guían en cada paso, ya sea que estés buscando clases particulares, grupales o para niños. Si tenés más preguntas, no dudes en contactarnos.
                </Typography>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        ¿Qué tipos de clases de esquí ofrecen?
                    </AccordionSummary>
                    <AccordionDetails>
                        Ofrecemos clases particulares, grupales, para adultos, niños y niveles avanzados. También contamos con clases enfocadas en técnicas específicas como carving, esquí en nieve virgen (fuera de pista) y slalom. Todas nuestras clases están diseñadas por instructores profesionales con certificación internacional.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        ¿Necesito experiencia previa para tomar clases?
                    </AccordionSummary>
                    <AccordionDetails>
                        No. Nuestras clases están diseñadas para todos los niveles, desde principiantes que nunca se pusieron un par de esquís hasta esquiadores avanzados que buscan perfeccionar su técnica. Contamos con pistas adaptadas y métodos de enseñanza progresivos.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        ¿Dónde se realizan las clases y qué necesito llevar?
                    </AccordionSummary>
                    <AccordionDetails>
                        Las clases se dictan en Cerro Catedral, en el sector Base del Cerro. Recomendamos venir con ropa térmica, antiparras, protector solar y el equipo de esquí (esquís, bastones y botas). Si no tenés equipo, podemos ayudarte con el alquiler.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        ¿Cuánto tiempo tarda en aprender a esquiar?
                    </AccordionSummary>
                    <AccordionDetails>
                        El tiempo varía según cada persona, pero en general, los principiantes logran esquiar en pistas verdes (fáciles) después de 2 a 3 clases. Nuestro enfoque personalizado acelera el proceso y garantiza que aprendas a esquiar con confianza y seguridad.
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        ¿Cómo reservo una clase y cuáles son los precios?
                    </AccordionSummary>
                    <AccordionDetails>
                        Podés reservar directamente desde nuestra web, por WhatsApp o acercándote a nuestro punto de información en la base del cerro. Los precios varían según el tipo de clase (particular o grupal) y la duración. Consultá nuestra sección de tarifas para más detalles actualizados.
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Add the modals */}
            <ReservationModal
                open={isReservationModalOpen}
                onClose={handleCloseReservationModal}
            />
            <VideoAnalysisModal
                open={isVideoAnalysisModalOpen}
                onClose={handleCloseVideoAnalysisModal}
            />
        </>
    );
}

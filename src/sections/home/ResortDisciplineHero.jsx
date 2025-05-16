import { m } from 'framer-motion';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack, Grid, Select, Hidden, Card, Avatar } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import TextIconLabel from '../../components/TextIconLabel';
import { MotionContainer, varFade } from '../../components/animate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import useLocales from 'src/hooks/useLocales';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelect } from 'src/components/hook-form';
import HomeFilterTeachers from './HomeFilterTeachers';
import HoverButton from 'src/components/HoverButton';
import { useDispatch, useSelector } from 'src/redux/store';
import { getFreeTeachers } from 'src/redux/slices/teachers';
import ShopTeacherCard from '../@dashboard/e-commerce/shop/ShopTeacherCard';
import { es } from 'date-fns/locale';


// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
    position: 'relative',
    [theme.breakpoints.up('md')]: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
    zIndex: 10,
    margin: 'auto',
    textAlign: 'center',
    position: 'relative',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.up('md')]: {
        margin: 'unset',
        textAlign: 'left',
    },
}));

const CardContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    paddingTop: theme.spacing(10),
    position: 'relative',
    minHeight: '600px',
    [theme.breakpoints.up('md')]: {
        width: '90%',
    },
}));

const FilterWrapper = styled(Box)(({ theme }) => ({
    width: 'fit-content',
    maxWidth: '600px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    padding: theme.spacing(3),
    marginTop: theme.spacing(2)
}));

const ImageCard = styled(Box)(({ theme }) => ({
    width: '80%',
    height: '600px',
    position: 'absolute',
    top: theme.spacing(5),
    right: theme.spacing(-10),
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    zIndex: 0,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
        zIndex: 1
    }
}));

const FilterContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: theme.spacing(3),
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
}));

const ContentCard = styled(Box)(({ theme }) => ({
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
        width: '40%',
    },
}));

const TopTeachersSection = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        width: '90%',
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

const TeacherCard = styled(Box)(({ theme }) => ({
    flex: '0 0 auto',
    width: '280px',
    [theme.breakpoints.down('sm')]: {
        width: '240px',
    },
}));

// ----------------------------------------------------------------------

const SKI_OPTIONS = ['Esqui', 'Ski', 'ski', 'esqui', 'skiing', 'skiing--lessons', 'ski--lessons', 'skiing--lessons', 'ski--lessons']
const RESORT_OPTIONS = [
    { id: 'Cerro Catedral', slugs: ['cerro-catedral', 'catedral'] },
    { id: 'Chapelco', slugs: ['cerro-chapelco', 'chapelco'] },
    { id: 'La Hoya', slugs: ['cerro-la-hoya', 'la-hoya'] },
    { id: 'Las Leñas', slugs: ['cerro-las-lenas', 'las-lenas'] },
    { id: 'Caviahue', slugs: ['cerro-caviahue', 'caviahue'] },
    { id: 'Cerro Bayo', slugs: ['cerro-bayo', 'bayo'] },
    { id: 'Cerro Castor', slugs: ['cerro-castor', 'castor'] },
    { id: 'Lago Hermoso', slugs: ['lago-hermoso', 'hermoso'] },
    { id: 'Las Pendientes', slugs: ['las-pendientes', 'pendientes'] },
    { id: 'Perito Moreno', slugs: ['perito-moreno', 'moreno'] },
    { id: 'Aconcagua', slugs: ['aconcagua', 'concagua'] },
    { id: 'Batea Mahuida', slugs: ['batea-mahuida', 'mahuida'] },
    { id: 'Calafate Mountain Park', slugs: ['calafate-mountain-park', 'mountain-park'] },
    { id: 'Vallecitos', slugs: ['vallecitos', 'vallecito'] },
    { id: 'Monte Bianco', slugs: ['monte-bianco'] },
    { id: 'Patagonia Heliski', slugs: ['patagonia-heliski', 'heliski'] },
    { id: 'Los Penitentes', slugs: ['los-penitentes', 'penitentes'] },
    { id: 'Los Puquios', slugs: ['los-puquios', 'puquios'] },
    { id: 'Monte Fitz Roy', slugs: ['monte-fitz-roy', 'fitz-roy'] },
    { id: 'Cerro Norris', slugs: ['cerro-norris', 'norris'] },
    { id: 'Cerro Torre', slugs: ['cerro-torre', 'torre'] },
    { id: 'Cerro Negro', slugs: ['cerro-negro', 'negro'] },
    { id: 'Las Leñas', slugs: ['las-leñas', 'lenas'] },

  ];

const TYPE_OPTIONS = [
    { id: 'private', slugs: ['clases-privadas'] },
    { id: 'group', slugs: ['clases-grupales'] },
    { id: 'children', slugs: ['clases-niños'] },
    
]

export default function ResortDisciplineHero() {

    const { translate } = useLocales()
    const { resort: resortSlug, discipline: disciplineSlug, type: typeSlug } = useParams();
    const [discipline, setDiscipline] = useState(disciplineSlug)
    const [resort, setResort] = useState(resortSlug)
    const [type, setType] = useState(typeSlug)

    const [value, setValue] = useState(0);
    const theme = useTheme();
    const navigate = useNavigate()

    const { teachers, filters } = useSelector((state) => { return state.teachers })
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getFreeTeachers(filters.from, filters.to, resort, 0, 6));
    }, [dispatch, filters, resort, discipline]);

    useEffect(() => {
        if (SKI_OPTIONS.includes(disciplineSlug)) {
            setDiscipline('Ski')
        } else if(disciplineSlug === 'snowboard'){
            setDiscipline('SnowBoard')
        }else{
            setDiscipline('Ski')
        }
        const resort = RESORT_OPTIONS.find(r => r.slugs.includes(resortSlug))
        if (resort) {
            setResort(resort.id)
        }
        const type = TYPE_OPTIONS.find(t => t.slugs.includes(typeSlug))
        if (type) {
            setType(type.id)
        }
    }, [disciplineSlug, resortSlug, typeSlug])


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const SKI_RESORTS = [
        "Aconcagua",
        "Batea Mahuida",
        "Calafate Mountain Park",
        "Caviahue",
        "Cerro Bayo",
        "Cerro Castor",
        "Cerro Catedral",
        "Chapelco",
        "La Hoya",
        "Las Leñas",
        "Las Pendientes",
        "Los Penitentes",
        "Los Puquios",
        "Monte Bianco",
        "Patagonia Heliski",
        "Perito Moreno",
        "Vallecitos"
    ]

    const defaultValues = {
        resort: "Catedral",
    }

    const methods = useForm({
        resolver: yupResolver({}),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
        setError
    } = methods;

    const onSubmit = async (data) => {
        console.log(data)
    }
    return (
        <MotionContainer sx={{
            minHeight: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: { xs: 2, md: 4, pt: 6 }
        }}>
            <RootStyle>
                <CardContainer>
                    <Hidden smDown>
                        <ImageCard>
                            <Box
                                component="img"
                                src="/assets/bariloche.jpg"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </ImageCard>
                    </Hidden>
                    <FilterWrapper>
                        <HomeFilterTeachers resort={resort} discipline={discipline} type={type} />
                    </FilterWrapper>
                </CardContainer>
            </RootStyle>

            <TopTeachersSection>
                <Box sx={{ mb: 4 }}>
                    <Typography variant='h3' sx={{ mb: 1 }}>{translate(`landingPRO.topTeachers`, {
                        discipline: discipline ? translate(`landingPRO.${discipline}`) : "",
                        type: type ? translate(`landingPRO.${type}Plural`) : "",
                        resort: resort ? resort : "",
                    })}</Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                        }}
                    >
                        {translate(`landingPRO.guestAgree`, {
                            discipline: discipline ? translate(`landingPRO.${discipline}`) : "",
                            type: type ? translate(`landingPRO.${type}Plural`) : "",
                            resort: resort ? resort : "",
                        })}
                    </Typography>
                    <ScrollContainer>
                        {teachers.map((teacher) => (
                            <TeacherCard key={teacher.id}>
                                <ShopTeacherCard teacher={teacher} fullBlack={true} />
                            </TeacherCard>
                        ))}
                    </ScrollContainer>
                </Box>
            </TopTeachersSection>
        </MotionContainer>
    );
}

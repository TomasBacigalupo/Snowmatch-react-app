import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Box,
    useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useLocales from 'src/hooks/useLocales';
import Iconify from 'src/components/Iconify';

const FAQ_SECTIONS = [
    {
        key: 'resort.general',
        condition: ({ resort }) => !!resort,
    },
    {
        key: 'discipline.general',
        condition: ({ resort, discipline }) => !!resort && !!discipline,
    },
    {
        key: 'type.general',
        condition: ({ resort, discipline, type }) => !!resort && !!discipline && !!type,
    },
];

export default function FaqsByContext() {
    const { resort, discipline, type } = useParams();
    const { translate } = useLocales();
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const title = type
        ? translate('faqs.title.type', {
            resort: resort ? translate(`landingPRO.${resort}`) : "",
            discipline: discipline,
            type: type ? translate(`landingPRO.${type}`) : ""
        })
        : discipline
            ? translate('faqs.title.discipline', { resort: resort ? translate(`landingPRO.${resort}`) : "", discipline })
            : translate('faqs.title.resort', { resort: resort ? translate(`landingPRO.${resort}`) : "" });

    const faqs = [
        {
            question: `¿Qué necesito para tomar clases de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'}?`,
            answer: `Para tomar clases necesitas: ropa de abrigo adecuada, guantes, gafas de sol o antiparras, protector solar, y el equipo de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski/snowboard'} que puedes alquilar en el centro de esquí. El instructor te ayudará a ajustar todo el equipo correctamente.`
        },
        {
            question: `¿Cuánto dura una clase de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'}?`,
            answer: 'Las clases privadas suelen durar 2 horas, mientras que las grupales pueden extenderse hasta 3 horas. También ofrecemos clases de día completo para aquellos que quieren una experiencia más intensiva.'
        },
        {
            question: '¿Qué nivel de experiencia necesito para tomar clases?',
            answer: 'Ofrecemos clases para todos los niveles, desde principiantes absolutos hasta expertos. Nuestros instructores se adaptan a tu nivel y objetivos específicos, asegurando una experiencia personalizada y segura.'
        },
        {
            question: `¿Cómo reservo una clase de ${discipline ? translate(`landingPRO.${discipline}`) : 'ski y snowboard'}?`,
            answer: 'Puedes reservar tus clases directamente a través de nuestra plataforma SnowMatch. Solo necesitas seleccionar la fecha, el tipo de clase que prefieres (privada o grupal) y el nivel. El pago se realiza de forma segura online.'
        }
    ];

    return (
        <Box 
            component="section" 
            aria-labelledby="faqs-heading"
            sx={{ 
                py: { xs: 6, md: 10 },
                backgroundColor: theme.palette.background.neutral,
            }}
        >
            <Container maxWidth="md">
                <Typography 
                    id="faqs-heading"
                    component='h2' 
                    variant="h3" 
                    gutterBottom 
                    mb={6} 
                    textAlign='center'
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                    }}
                >
                    {translate("landingPRO.faqs.title", {
                        resort: resort ? translate(`landingPRO.${resort}`) : "",
                        discipline: discipline ? translate(`landingPRO.${discipline}`) : translate(`landingPRO.ski&snowboard`),
                        type: type ? translate(`landingPRO.${type}`) : ""
                    })}
                </Typography>

                <Stack spacing={3}>
                    {[1,2,3,4,5,6,7].map((faq, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                            sx={{
                                '&:before': {
                                    display: 'none',
                                },
                                mb: 2,
                                borderRadius: '8px !important',
                                '&.Mui-expanded': {
                                    boxShadow: (theme) => theme.customShadows.z8,
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                                sx={{
                                    px: 3,
                                    borderRadius: '8px !important',
                                    '&.Mui-expanded': {
                                        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                                    },
                                }}
                            >
                                <Typography variant="subtitle1">{translate(`landingPRO.faqs.${index + 1}.q`,
                                    {
                                        resort: resort ? translate(`landingPRO.${resort}`) : "",
                                        discipline: discipline ? translate(`landingPRO.${discipline}`) : translate(`landingPRO.ski&snowboard`),
                                        type: type ? translate(`landingPRO.${type}`) : ""
                                    }
                                )}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, py: 2 }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {translate(`landingPRO.faqs.${index + 1}.a`,
                                        {
                                            resort: resort ? translate(`landingPRO.${resort}`) : "",
                                            discipline: discipline ? translate(`landingPRO.${discipline}`) : translate(`landingPRO.ski&snowboard`),
                                            type: type ? translate(`landingPRO.${type}`) : ""
                                        }
                                    )}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}

FaqsByContext.propTypes = {
    discipline: PropTypes.string,
    type: PropTypes.string,
};
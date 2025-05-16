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

    const title = type
        ? translate('faqs.title.type', {
            resort: resort ? translate(`landingPRO.${resort}`) : "",
            discipline: discipline,
            type: type ? translate(`landingPRO.${type}`) : ""
        })
        : discipline
            ? translate('faqs.title.discipline', { resort: resort ? translate(`landingPRO.${resort}`) : "", discipline })
            : translate('faqs.title.resort', { resort: resort ? translate(`landingPRO.${resort}`) : "" });

    return (
        <Box sx={{ 
            py: { xs: 6, md: 10 },
            backgroundColor: theme.palette.background.neutral,
        }}>
            <Container maxWidth="md">
                <Typography 
                    component='h1' 
                    variant="h3" 
                    gutterBottom 
                    mb={6} 
                    textAlign='center'
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                    }}
                >
                    {title}
                </Typography>

                <Stack spacing={3}>
                    {FAQ_SECTIONS.filter((s) => s.condition({ resort, discipline, type })).map((section, idx) => {
                        const label = translate(`faqs.${section.key}.title`, {
                            resort: resort ? translate(`landingPRO.${resort}`) : "",
                            discipline: discipline,
                            type: type ? translate(`landingPRO.${type}`) : ""
                        });

                        // Get all FAQ questions and answers
                        const faqs = [];
                        let i = 0;
                        while (translate(`faqs.question${i}`, { defaultValue: null }) !== null) {
                            faqs.push({
                                q: translate(`faqs.question${i}`),
                                a: translate(`faqs.answer${i}`)
                            });
                            i++;
                        }

                        return (
                            <Box key={idx}>
                                <Typography 
                                    component='h2' 
                                    variant="h5" 
                                    gutterBottom
                                    mb={3}
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {label}
                                </Typography>

                                <Stack spacing={2}>
                                    {faqs.map((faq, i) => (
                                        <Accordion 
                                            key={i}
                                            sx={{
                                                boxShadow: 'none',
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: '8px !important',
                                                '&:before': {
                                                    display: 'none',
                                                },
                                                '&.Mui-expanded': {
                                                    margin: '8px 0',
                                                },
                                            }}
                                        >
                                            <AccordionSummary 
                                                expandIcon={<ExpandMoreIcon />}
                                                sx={{
                                                    px: 3,
                                                    '& .MuiAccordionSummary-content': {
                                                        my: 2,
                                                    },
                                                }}
                                            >
                                                <Typography 
                                                    component="h3" 
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 500,
                                                        color: theme.palette.text.primary,
                                                    }}
                                                >
                                                    {faq.q}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails
                                                sx={{
                                                    px: 3,
                                                    pb: 3,
                                                }}
                                            >
                                                <Typography 
                                                    component="p" 
                                                    variant="body1"
                                                    sx={{
                                                        color: theme.palette.text.secondary,
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    {faq.a}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>
            </Container>
        </Box>
    );
}
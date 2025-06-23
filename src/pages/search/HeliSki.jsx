import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { motion, m } from 'framer-motion';
import { Box, Typography, Paper, styled, Button, Modal, FormControl, InputLabel, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery, Container, Grid, Divider, TextField, Drawer } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useLocales from 'src/hooks/useLocales';



const ImageSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '100vh',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    color: 'white',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        color: 'white',
        background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))',
        zIndex: 1,
    }
}));

const ImageContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing(4),
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%'
}));

const AnimatedImageSection = ({ children, backgroundImage }) => {
    return (
        <ImageSection sx={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {children}
            </m.div>
        </ImageSection>
    );
};

const HeliSki = () => {
    const { translate, onChangeLang } = useLocales();
    
    useEffect(() => {
        let mounted = true;
        
        const setLanguage = () => {
            const path = window.location.pathname;
            const lang = path.split('/')[1]; // Get the first segment of the path
            
            if (mounted) {
                if (lang === 'pt') {
                    onChangeLang('pt');
                } else if (lang === 'en') {
                    onChangeLang('en');
                } else {
                    onChangeLang('es');
                }
            }
        };

        setLanguage();

        return () => {
            mounted = false;
        };
    }, []);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": "IBEX HELISKI - Premium Heliski Experience in Argentina",
        "description": "Experience the ultimate heliski adventure in Argentina with IBEX HELISKI. 3,000 hectares of skiable area, personalized experiences, and professional guides.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "AR",
            "addressRegion": "Neuquén",
            "addressLocality": "San Martín de los Andes"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-40.1579",
            "longitude": "-71.3534"
        },
        "priceRange": "$$$$",
        "openingHours": "Mo-Su 08:00-17:00",
        "image": "https://ibexheliski.com/images/heliski-hero.jpg",
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "offers": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": translate('heliski.locations.catedral.title'),
                        "description": translate('heliski.locations.catedral.description'),
                        "image": "/assets/heliski/10.jpg"
                    },
                    "price": translate('heliski.locations.catedral.price').replace(/[^0-9]/g, ''),
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": translate('heliski.locations.chapelco.title'),
                        "description": translate('heliski.locations.chapelco.description'),
                        "image": "/assets/heliski/11.jpg"
                    },
                    "price": translate('heliski.locations.chapelco.price').replace(/[^0-9]/g, ''),
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": translate('heliski.locations.cholila.title'),
                        "description": translate('heliski.locations.cholila.description'),
                        "image": "/assets/heliski/12.jpg"
                    },
                    "price": translate('heliski.locations.cholila.price').replace(/[^0-9]/g, ''),
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                }
            ]
        },
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "Question",
                    "name": translate('heliski.faqs.1.q'),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": translate('heliski.faqs.1.a')
                    }
                },
                {
                    "@type": "Question",
                    "name": translate('heliski.faqs.2.q'),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": translate('heliski.faqs.2.a')
                    }
                },
                {
                    "@type": "Question",
                    "name": translate('heliski.faqs.3.q'),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": translate('heliski.faqs.3.a')
                    }
                },
                {
                    "@type": "Question",
                    "name": translate('heliski.faqs.4.q'),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": translate('heliski.faqs.4.a')
                    }
                },
                {
                    "@type": "Question",
                    "name": translate('heliski.faqs.5.q'),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": translate('heliski.faqs.5.a')
                    }
                },
                {
                    "@type": "Question",
                    "name": translate('heliski.faqs.6.q'),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": translate('heliski.faqs.6.a')
                    }
                }
            ]
        }
    };

    
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        personas: '',
        dias: '',
        destino: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const message = translate('heliski.requestToBook', {
            mountain: form.destino,
            riders: form.personas,
            days: form.dias
        });
        const whatsappUrl = `https://wa.me/5492944263223?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        handleClose();
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const modalContent = (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 4,
                height: '100%',
            }}
        >
            <Typography id="modal-title" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {translate('heliski.askToBook')}
            </Typography>
            <FormControl fullWidth>
                <InputLabel id="personas-label">Cantidad de personas</InputLabel>
                <Select
                    labelId="personas-label"
                    name="personas"
                    value={form.personas}
                    label={translate('heliski.totalRiders')}
                    onChange={handleChange}
                    required
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <MenuItem key={n} value={n}>{n}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                name="dias"
                label={translate('heliski.totalDays')}
                type="number"
                value={form.dias}
                onChange={handleChange}
                inputProps={{ min: 1, max: 30 }}
                required
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="destino-label">Destino</InputLabel>
                <Select
                    labelId="destino-label"
                    name="destino"
                    value={form.destino}
                    label="Destino"
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="Catedral">Catedral</MenuItem>
                    <MenuItem value="Cholila">Cholila</MenuItem>
                    <MenuItem value="Chapelco">Chapelco</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" sx={{ mt: 2, fontWeight: 600, fontSize: '1.1rem', borderRadius: 3 }}>
                {translate('heliski.send')}
            </Button>
        </Box>
    );

    const renderModal = () => {
        if (isMobile) {
            return (
                <Drawer
                    anchor="bottom"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            height: 'auto',
                            maxHeight: '90vh',
                        }
                    }}
                >
                    {modalContent}
                </Drawer>
            );
        }

        return (
            <Modal 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="modal-title" 
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 24,
                    }}
                >
                    {modalContent}
                </Box>
            </Modal>
        );
    };

    const HeroSection = () => {
        return (
            <Box
                sx={{
                    background: '#fff',
                    py: { xs: 4, md: 12 },
                    px: { xs: 0, md: 6 },
                    minHeight: { xs: 'auto', md: '70vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        maxWidth: '1000px',
                        flex: 1,
                        flexDirection: { xs: 'column', md: 'row' },
                    }}
                >
                    {/* Text and button column */}
                    <Grid item xs={12} md={6} sx={{
                        order: { xs: 2, md: 1 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        justifyContent: 'center',
                        textAlign: { xs: 'center', md: 'left' },
                    }}>
                        <Box sx={{ maxWidth: 500, mx: { xs: 'auto', md: 0 } }}>
                            {/* Optional: Logo */}
                            {/* <Box sx={{ mb: 2 }}><img src="/assets/heliski/logo.svg" alt="Logo" style={{ height: 40 }} /></Box> */}
                            <Typography component="h1"  variant="h2" sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '3.2rem' }, mb: 2, lineHeight: 1.1 }}>
                                {translate('heliski.title1')}<br />{translate("heliski.title2")}
                            </Typography>
                            <Typography component="h2" variant="h5" sx={{ color: 'grey.700', mb: 2, fontWeight: 400 }}>
                                {translate('heliski.subtitle1')}
                            </Typography>
                            <Typography component="h2" variant="body1" sx={{ color: 'grey.600', mb: { xs: 3, md: 4 } }}>
                                {translate('heliski.subtitle2')}<br />{translate('heliski.subtitle3')}
                            </Typography>
                            {/* Button: under text on desktop, hidden on mobile */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        px: 8,
                                        py: 1.8,
                                        fontWeight: 600,
                                        fontSize: '1.2rem',
                                        borderRadius: 8,
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        color: 'white',
                                        boxShadow: 2,
                                        mt: { xs: 2, md: 4 },
                                        mb: { xs: 2, md: 0 },
                                    }}
                                    onClick={handleOpen}
                                >
                                    {translate('heliski.button')}
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    {/* Image column */}
                    <Grid item xs={12} md={6} sx={{
                        order: { xs: 1, md: 2 },
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                    }}>
                        <Box
                            sx={{
                                width: { xs: '90vw', sm: 340, md: 570 },
                                maxWidth: 570,
                                height: { xs: '55vw', sm: 260, md: 400 },
                                maxHeight: { xs: 340, sm: 340, md: 700 },
                                borderRadius: {
                                    xs: '40px 40px 40px 40px',
                                    md: '40px',
                                },
                                boxShadow: 6,
                                overflow: 'hidden',
                                position: 'relative',
                                background: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: { xs: 3, md: 0 },
                                mt: { xs: 6, md: 0 },
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/heliski/1.jpg"
                                alt="Heliski Hero Image - Experience the thrill of heliskiing in Argentina"
                                title="Heliski Hero Image - Experience the thrill of heliskiing in Argentina"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: {
                                        xs: '40px 40px 0 0',
                                        md: '40px',
                                    },
                                    boxShadow: 3,
                                }}
                            />
                        </Box>
                    </Grid>
                    {/* Button for mobile, always visible below image/text */}
                    <Grid item xs={12} sx={{ order: 3, display: { xs: 'flex', md: 'none' }, justifyContent: 'center', width: '100%' }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                px: 8,
                                py: 1.8,
                                fontWeight: 600,
                                fontSize: '1.2rem',
                                borderRadius: 8,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                color: 'white',
                                boxShadow: 2,
                                mt: { xs: 2, md: 4 },
                                mb: { xs: 2, md: 0 },
                            }}
                            onClick={handleOpen}
                        >
                            {translate('heliski.button')}
                        </Button>
                    </Grid>
                </Grid>
                {renderModal()}
            </Box>
        );
    };

    const travelSteps = [
        {
            img: '/assets/heliski/6.jpg',
            title: translate('heliski.planning'),
            desc: translate('heliski.planningDescription')
        },
        {
            img: '/assets/heliski/7.jpg',
            title: translate('heliski.safeAndCrew'),
            desc: translate('heliski.safeAndCrewDescription')
        },
        {
            img: '/assets/heliski/9.jpg',
            title: translate('heliski.premiumService'),
            desc: translate('heliski.premiumServiceDescription')
        }
    ];

    const feeOptions = [
        {
            icon: '🏔️',
            title: translate('heliski.fees.week.title'),
            details: [
                translate('heliski.fees.week.3riders'),
                translate('heliski.fees.week.8riders'),
            ],
        },
        {
            icon: '🚁',
            title: translate('heliski.fees.twoDays.title'),
            details: [
                translate('heliski.fees.twoDays.3riders'),
                translate('heliski.fees.twoDays.8riders'),
            ],
        },
        {
            icon: '❄️',
            title: translate('heliski.fees.singleDay.title'),
            details: [
                translate('heliski.fees.singleDay.3riders'),
                translate('heliski.fees.singleDay.8riders'),
            ],
        },
    ];

    const feeImages = [
        '/assets/heliski/1.jpg',
        '/assets/heliski/2.jpg',
        '/assets/heliski/3.jpg',
    ];

    const TravelSection = () => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
        return (
            <Box sx={{ py: { xs: 6, md: 10 }, px: 2, textAlign: 'center', background: '#fff' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    {translate('heliski.info.title')}
                </Typography>
                <Typography variant="h6" sx={{ color: 'grey.700', mb: 6, maxWidth: 600, mx: 'auto' }}>
                    {translate('heliski.info.description')}
                </Typography>
                {/* Mobile: vertical stack, Desktop: grid */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {travelSteps.map((step, idx) => (
                        <Box key={step.title} sx={{ mb: 5 }}>
                            <Paper elevation={3} sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                p: 0,
                                width: '90vw',
                                maxWidth: 400,
                                mx: 'auto',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                transition: 'box-shadow 0.3s',
                                '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.16)' },
                            }}>
                                <Box
                                    component="img"
                                    src={step.img}
                                    alt={`${step.title} - ${step.desc}`}
                                    title={`${step.title} - ${step.desc}`}
                                    sx={{
                                        width: '100%',
                                        height: 220,
                                        objectFit: 'cover',
                                        borderRadius: 4,
                                    }}
                                />
                            </Paper>
                            <Typography variant="body1" sx={{ color: 'grey.800', mt: 2, mb: 1, fontWeight: 500, fontSize: '1.1rem', maxWidth: 400, mx: 'auto' }}>
                                {step.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'grey.700', mb: 2, maxWidth: 400, mx: 'auto' }}>
                                {step.desc}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Grid container spacing={4} justifyContent="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {travelSteps.map((step, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={step.title}>
                            <Paper elevation={3} sx={{
                                borderRadius: 5,
                                overflow: 'hidden',
                                p: 0,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                transition: 'box-shadow 0.3s',
                                '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }
                            }}>
                                <Box
                                    component="img"
                                    src={step.img}
                                    alt={`${step.title} - ${step.desc}`}
                                    title={`${step.title} - ${step.desc}`}
                                    sx={{
                                        width: '100%',
                                        height: 220,
                                        objectFit: 'cover',
                                        borderTopLeftRadius: 20,
                                        borderTopRightRadius: 20,
                                        mb: 0,
                                    }}
                                />
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'grey.700' }}>
                                        {step.desc}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    const locations = [
        {
            title: translate('heliski.locations.catedral.title'),
            image: '/assets/heliski/10.jpg',
            description: translate('heliski.locations.catedral.description'),
            price: translate('heliski.locations.catedral.price')
        },
        {
            title: translate('heliski.locations.chapelco.title'),
            image: '/assets/heliski/11.jpg',
            description: translate('heliski.locations.chapelco.description'),
            price: translate('heliski.locations.chapelco.price')
        },
        {
            title: translate('heliski.locations.cholila.title'),
            image: '/assets/heliski/12.jpg',
            description: translate('heliski.locations.cholila.description'),
            price: translate('heliski.locations.cholila.price')
        }
    ];

    const LocationsCarousel = () => {
        const [activeStep, setActiveStep] = useState(0);
        const maxSteps = locations.length;

        const handleNext = () => {
            setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
        };

        const handleBack = () => {
            setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
        };

        return (
            <Box sx={{ py: { xs: 6, md: 10 }, px: 2, background: '#f5f5f5' }}>
                <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6 }}>
                    {translate('heliski.locations.title')}
                </Typography>
                <Box sx={{ maxWidth: 1200, mx: 'auto', position: 'relative' }}>
                    <Grid container spacing={4} justifyContent="center">
                        {locations.map((location, index) => (
                            <Grid item xs={12} md={4} key={location.title}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 240,
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={location.image}
                                            alt={`${location.title} - ${location.description}`}
                                            title={`${location.title} - ${location.description}`}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                            {location.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'grey.700', mb: 2, flexGrow: 1 }}>
                                            {location.description}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                                            {location.price}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            sx={{
                                                py: 1.5,
                                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                color: 'white',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                                                },
                                            }}
                                            onClick={handleOpen}
                                        >
                                            {translate('heliski.bookNow')}
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        );
    };

    const FeeSection = () => (
        <Box sx={{ py: { xs: 6, md: 10 }, px: 2, background: '#fff', textAlign: 'center', maxWidth: 600, mx: 'auto', mb: 6, borderRadius: 4, boxShadow: { xs: 0, md: 2 } }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
                {translate('heliski.fees.title')}
            </Typography>
            {feeOptions.map((option, idx) => (
                <Box key={option.title}>
                    {/* Desktop: icon, text, image; Mobile: icon, text */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            gap: 2,
                            py: 3,
                            flexDirection: { xs: 'row', md: 'row' },
                        }}
                    >
                        {/* Icon */}
                        <Box sx={{ fontSize: 44, minWidth: 56, textAlign: 'center', pt: 0.5 }}>{option.icon}</Box>
                        {/* Text */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.15rem' }}>{option.title}</Typography>
                            {option.details.map((line, i) => (
                                <Typography key={i} variant="body2" sx={{ color: 'grey.700', fontSize: '1.05rem', lineHeight: 1.5 }}>
                                    {line}
                                </Typography>
                            ))}
                        </Box>
                        {/* Image: only show on md+ */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                ml: 2,
                                minWidth: 90,
                                maxWidth: 120,
                                height: 80,
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: 2,
                                background: '#eee',
                            }}
                        >
                            <Box
                                component="img"
                                src={feeImages[idx]}
                                alt={`${option.title} - ${option.details.join(' ')}`}
                                title={`${option.title} - ${option.details.join(' ')}`}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }}
                            />
                        </Box>
                    </Box>
                    {idx < feeOptions.length - 1 && <Divider sx={{ my: 0 }} />}
                </Box>
            ))}
        </Box>
    );

    const ScrollSection = ({ children, delay = 0 }) => {
        return (
            <m.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay }}
            >
                {children}
            </m.div>
        );
    };

    return (
        <>
            <Helmet>
                <title>{translate('heliski.meta.title')}</title>
                <meta name="description" content={translate('heliski.meta.description')} />
                <meta name="keywords" content={translate('heliski.meta.keywords')} />
                <meta name="apple-itunes-app" content="app-id=6741247513"/>
                <link rel="canonical" href={`https://snowmatch.pro${window.location.pathname.startsWith('/pt') ? '/pt/heliski' : window.location.pathname.startsWith('/en') ? '/en/heliski' : '/heliski'}`} />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>

            <Box>
                <HeroSection />
                <TravelSection />
                <FeeSection />
                <LocationsCarousel />
                
                <Container maxWidth="lg">

                    <ScrollSection>
                        <Box sx={{ py: 8 }}>
                            <Typography variant="h2" align="center" gutterBottom>
                                {translate('heliski.faqs.title')}
                            </Typography>
                            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant="h6">
                                            {translate('heliski.faqs.1.q')}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {translate('heliski.faqs.1.a')}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                    >
                                        <Typography variant="h6">
                                            {translate('heliski.faqs.2.q')}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {translate('heliski.faqs.2.a')}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3a-content"
                                        id="panel3a-header"
                                    >
                                        <Typography variant="h6">
                                            {translate('heliski.faqs.3.q')}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {translate('heliski.faqs.3.a')}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel4a-content"
                                        id="panel4a-header"
                                    >
                                        <Typography variant="h6">
                                            {translate('heliski.faqs.4.q')}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {translate('heliski.faqs.4.a')}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel5a-content"
                                        id="panel5a-header"
                                    >
                                        <Typography variant="h6">
                                            {translate('heliski.faqs.5.q')}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {translate('heliski.faqs.5.a')}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel6a-content"
                                        id="panel6a-header"
                                    >
                                        <Typography variant="h6">
                                            {translate('heliski.faqs.6.q')}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {translate('heliski.faqs.6.a')}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Box>
                    </ScrollSection>

                    <AnimatedImageSection backgroundImage="/assets/heliski/5.jpg">
                        <ImageContent>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: '100%',
                                maxWidth: '800px',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h2" gutterBottom sx={{ 
                                    fontWeight: 700, 
                                    textAlign: 'center',
                                    width: '100%'
                                }}>
                                   {translate('heliski.readyToBook.title')}
                                </Typography>
                                <Typography variant="h5" sx={{ 
                                    mb: 4, 
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)', 
                                    textAlign: 'center',
                                    width: '100%'
                                }}>
                                    {translate('heliski.readyToBook.description')}
                                </Typography>
                                <m.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                                >
                                    <Button
                                        onClick={handleOpen}
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            mt: 4,
                                            px: 6,
                                            py: 2,
                                            fontSize: '1.2rem',
                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                            color: 'black',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                            }
                                        }}
                                    >
                                        {translate('heliski.readyToBook.button')}
                                    </Button>
                                </m.div>
                            </Box>
                        </ImageContent>
                    </AnimatedImageSection>
                </Container>
            </Box>
        </>
    );
};

export default HeliSki;

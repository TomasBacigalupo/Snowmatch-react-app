import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { m } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { CardContent, Box, Card, Typography, Link, Button, ButtonBase } from '@mui/material';
// _mock_
import { _appFeatured } from '../../../../_mock';
// components
import Image from '../../../../components/Image';
import { MotionContainer, varFade } from '../../../../components/animate';
import { CarouselDots, CarouselArrows } from '../../../../components/carousel';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getUpcomingEvents, openModal, selectEvent } from '../../../../redux/slices/calendar';

import { PATH_DASHBOARD } from '../../../../routes/paths';
import { Grid } from '@mui/material';
import { getTeacherProducts } from 'src/redux/slices/product'
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
    position: 'absolute',
    backgroundColor: alpha(theme.palette.primary.dark, 0.64),
}));

// ----------------------------------------------------------------------


export default function ProductsCarousel({teacherId}) {
    const theme = useTheme();
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? _appFeatured.length - 1 : 0);
    const dispatch = useDispatch()
    const upcomingEvents = useSelector(state => state.product.products)
    useEffect(() => dispatch(getTeacherProducts(true, teacherId)), [teacherId])




    const settings = {
        speed: 800,
        dots: true,
        arrows: false,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        beforeChange: (current, next) => setCurrentIndex(next),
        ...CarouselDots({
            zIndex: 9,
            bottom: 4,
            left: 24,
            position: 'absolute',
        }),
    };

    const handlePrevious = () => {
        carouselRef.current.slickPrev();
    };

    const handleNext = () => {
        carouselRef.current.slickNext();
    };




    return (
        <Card>
            <Slider ref={carouselRef} {...settings}>
                {upcomingEvents.map((product, index) => (
                    <CarouselItem 
                    index={index} 
                    events={product}
                    price={product.price}
                    title={product.name} 
                    lengthInMinutes={product.lengthInMinutes}
                    isActive={index === currentIndex} dispatch={dispatch} key={index} />
                ))}
            </Slider>

            <CarouselArrows
                onNext={handleNext}
                onPrevious={handlePrevious}
                spacing={0}
                sx={{
                    bottom: 0,
                    right: 16,
                    position: 'absolute',
                    '& .arrow': {
                        p: 0,
                        width: 32,
                        height: 32,
                        opacity: 0.48,
                        color: 'common.white',
                        '&:hover': { color: 'common.white', opacity: 1 },
                    },
                }}
            />
        </Card>
    );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
    isActive: PropTypes.bool,
    events: PropTypes.arrayOf(PropTypes.object),
    index: PropTypes.number,
};

function getDate(index) {

    const today = new Date()
    const date = new Date(today)
    date.setDate(date.getDate() + index)
    return (
        <m.div variants={varFade().inRight}>
            <Typography variant="overline" component="span" sx={{ mb: 1, opacity: 0.48 }}>
                {date.toLocaleDateString("es", { weekday: "long" })}
            </Typography>
            <Typography variant="h3" component="div" sx={{ mb: 1, opacity: 0.48 }}>
                {date.getDate()}
            </Typography>
        </m.div>
    )
}

function getTime(lengthInMinutes){
    if (lengthInMinutes === 60 ){
        return "Una Hora"
    }
    if (lengthInMinutes === 120) {
        return "Dos Horas"
    }
    if (lengthInMinutes < 60 * 3) {
        return "Medio día"
    }
    return "Dia Completo"
}

function CarouselItem({ index, events, isActive, dispatch, title, price, lengthInMinutes }) {

    return (
        <Box sx={{ position: 'relative', }}>
            <CardContent
                component={MotionContainer}
                animate={isActive}
                action
                sx={{
                    bottom: 0,
                    width: 1,
                    zIndex: 9,
                    textAlign: 'left',
                    position: 'absolute',
                    color: 'common.white',
                }}
            >
                <Grid container alignItems='center' sx={{ mb: 1, mt: 2 }}>
                    <Grid item xs={6} container flexDirection='column'>
                        <Grid item xs={12}>
                            <Typography variant='h6' sx={{ml:0.5}}>{title}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon sx={{ mr: 1, fontSize: 18 }} />
                                {getTime(lengthInMinutes)}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} container alignItems='center'>
                        <Grid item xs={6}>
                            <Typography variant='h6' sx={{ ml: 0.5 }}>${price}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant='contained'>Select</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
            <OverlayStyle />
            <Box  sx={{ height: { xs: 90, xl: 320 } }} />
        </Box>
    );
}
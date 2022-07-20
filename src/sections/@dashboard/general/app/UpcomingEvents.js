import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { m } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { CardContent, Box, Card, Typography, Link, Button } from '@mui/material';
// _mock_
import { _appFeatured } from '../../../../_mock';
// components
import Image from '../../../../components/Image';
import { MotionContainer, varFade } from '../../../../components/animate';
import { CarouselDots, CarouselArrows } from '../../../../components/carousel';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getUpcomingEvents, openModal, selectEvent } from '../../../../redux/slices/calendar';

import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------


export default function UpcomingEvents() {
  const theme = useTheme();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? _appFeatured.length - 1 : 0);
  const dispatch = useDispatch()
  const {upcomingEvents} = useSelector(state => state.calendar)
  useEffect(()=>dispatch(getUpcomingEvents()),[])


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
      top: 24,
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
        {upcomingEvents.map((events, index) => (
          <CarouselItem index={index} events={events} isActive={index === currentIndex} dispatch={dispatch} key={index} />
        ))}
      </Slider>

      <CarouselArrows
        onNext={handleNext}
        onPrevious={handlePrevious}
        spacing={0}
        sx={{
          top: 16,
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

function handleEventClick(e, event, dispatch){
  dispatch(openModal())
  dispatch(selectEvent(event.id));

}

function hasEvents(events, dispatch){
  if(events && events.length>0){
    return (
      events?.map((event, index) => (
        <m.div variants={varFade().inRight}  key={event.id}>
          <Link onClick={e => handleEventClick(e, event, dispatch)} component={RouterLink} to="/dashboard/calendar" color="inherit" underline="none">
            <Typography variant="h8" gutterBottom noWrap>
              {event.title}
            </Typography>
          </Link>
        </m.div>
            ))
      )
  }
  else{
    return(
      <m.div variants={varFade().inRight}>
          <Typography variant="overline" component="span" sx={{ mb: 1, opacity: 0.48 }}>
            No tiene eventos agendados
          </Typography>
        </m.div>
      )
  }
}

function getDate(index){

  const today = new Date()
  const date = new Date(today)
  date.setDate(date.getDate() + index)
  return (
        <m.div variants={varFade().inRight}>
          <Typography variant="overline" component="span" sx={{ mb: 1, opacity: 0.48 }}>
            {date.toLocaleDateString("es",{weekday:"long"})}
          </Typography>
          <Typography variant="h3" component="div" sx={{ mb: 1, opacity: 0.48 }}>
          {date.getDate()}
          </Typography>
        </m.div>
    )
}

function CarouselItem({ index, events, isActive, dispatch }) {

  return (
    <Box sx={{ position: 'relative' }}>
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
        {getDate(index)}
        {hasEvents(events,dispatch)}
        
      </CardContent>
      <OverlayStyle />
      <Image alt="a" src={"image"} sx={{ height: { xs: 280, xl: 320 } }} />
    </Box>
  );
}



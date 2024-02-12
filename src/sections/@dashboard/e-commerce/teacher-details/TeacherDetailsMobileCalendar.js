import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
// @mui
import { Divider, Collapse } from '@mui/material';
//
import ProductDetailsReviewForm from './ProductDetailsReviewForm';
import TeacherDetailsReviewList from './TeacherDetailsReviewList';
import TeacherDetailsReviewOverview from './TeacherDetailsReviewOverview';

import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import { MobileCheckoutCalendarStyle, CalendarToolbar } from '../../calendar';

import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsByUserId } from 'src/redux/slices/calendar';
import { getEventsByTeacherId } from 'src/redux/slices/bookings';

// ----------------------------------------------------------------------

TeacherDetailsMobileCalendar.propTypes = {
  teacher: PropTypes.shape({
    available: PropTypes.number,
    color: PropTypes.arrayOf(PropTypes.string),
    imageLink: PropTypes.string,
    information: PropTypes.string,
    state: PropTypes.string,
    stars: PropTypes.number,
    description: PropTypes.string,
    id: PropTypes.string,
    lastname: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
    sizes: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    totalRating: PropTypes.number,
    totalReview: PropTypes.number,
    events: PropTypes.array,
  }),
};

export default function TeacherDetailsMobileCalendar({ teacher }) {
  const { events } = useSelector(state => state.bookings);
  const dispatch = useDispatch();
  const [view, setView] = useState('dayGridMonth');
  const [date, setDate] = useState(new Date());
    const calendarRef = useRef(null);
  useEffect(() => {
    dispatch(getEventsByTeacherId(teacher.id, date.getMonth()+1));
  },[dispatch, teacher])
  useEffect(() => {
    console.log({events})
  },[events])

  


  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };




  return (
    <>
      <MobileCheckoutCalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              events={events}
              ref={calendarRef}
              rerenderDelay={10}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              eventResizableFromStart
              height="auto"
              plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
            />
          </MobileCheckoutCalendarStyle>
    </>
  );
}

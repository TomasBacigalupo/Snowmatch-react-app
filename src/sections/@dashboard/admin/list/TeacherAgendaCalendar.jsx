import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SkeletonCalendar } from 'src/components/skeleton';
import { useDispatch, useSelector } from 'src/redux/store';
import { getEventsByUserId } from 'src/redux/slices/calendar';
import { CalendarStyle, CalendarToolbar } from 'src/sections/@dashboard/calendar';

function toDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate();
  return new Date(value);
}

TeacherAgendaCalendar.propTypes = {
  teacherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  initialDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.object, PropTypes.string]),
  height: PropTypes.number,
};

export default function TeacherAgendaCalendar({
  teacherId,
  active = false,
  initialDate,
  height = 560,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [date, setDate] = useState(() => toDate(initialDate));
  const [view, setView] = useState('listWeek');

  const { events, isLoading } = useSelector((state) => state.calendar);

  useEffect(() => {
    if (active && teacherId) {
      dispatch(getEventsByUserId(teacherId));
    }
  }, [dispatch, active, teacherId]);

  useEffect(() => {
    if (!active) return;
    const nextDate = toDate(initialDate);
    setDate(nextDate);
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      calendarEl.getApi().gotoDate(nextDate);
    }
  }, [active, initialDate, teacherId]);

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
    <CalendarStyle>
      <CalendarToolbar
        date={date}
        view={view}
        onNextDate={handleClickDateNext}
        onPrevDate={handleClickDatePrev}
        onToday={handleClickToday}
        onChangeView={handleChangeView}
      />
      {isLoading ? (
        <SkeletonCalendar height={height} />
      ) : (
        <FullCalendar
          weekends
          editable={false}
          selectable={false}
          events={events}
          ref={calendarRef}
          rerenderDelay={10}
          initialDate={date}
          initialView={view}
          dayMaxEventRows={4}
          eventDisplay="block"
          headerToolbar={false}
          height={height}
          noEventsText={t('adminSchoolMemberLessons.drawer.noEvents')}
          plugins={[listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
        />
      )}
    </CalendarStyle>
  );
}

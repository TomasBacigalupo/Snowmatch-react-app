import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SkeletonCalendar } from 'src/components/skeleton';
import { fetchMemberEventsForMonth } from 'src/utils/adminTodayBookings';
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
  initialView: PropTypes.oneOf(['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek']),
  height: PropTypes.number,
};

export default function TeacherAgendaCalendar({
  teacherId,
  active = false,
  initialDate,
  initialView = 'listWeek',
  height = 560,
}) {
  const { t } = useTranslation();
  const calendarRef = useRef(null);
  const [date, setDate] = useState(() => toDate(initialDate));
  const [view, setView] = useState(initialView);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const monthKey = useMemo(
    () => `${date.getFullYear()}-${date.getMonth() + 1}`,
    [date]
  );

  useEffect(() => {
    if (!active || teacherId == null) {
      setEvents([]);
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setEvents([]);

    (async () => {
      try {
        const monthEvents = await fetchMemberEventsForMonth(teacherId, date);
        if (!cancelled) setEvents(monthEvents);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Intentionally keyed by month — day navigation reuses the same month payload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, teacherId, monthKey]);

  useEffect(() => {
    if (!active) return;
    setDate(toDate(initialDate));
    setView(initialView);
  }, [active, initialDate, teacherId, initialView]);

  useEffect(() => {
    if (!active || isLoading) return;
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;
    const calendarApi = calendarEl.getApi();
    calendarApi.gotoDate(date);
    calendarApi.changeView(view);
  }, [active, isLoading, date, view, teacherId]);

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
          key={`${teacherId}-${monthKey}-${view}`}
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

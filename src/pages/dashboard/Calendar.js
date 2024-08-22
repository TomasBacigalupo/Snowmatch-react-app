import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth'
//
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Button, Container, DialogTitle } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getEvents, openModal, closeModal, updateEvent, selectEvent, selectRange, getEventsByDate } from '../../redux/slices/calendar';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { DialogAnimate } from '../../components/animate';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CalendarSelector from '../../sections/@dashboard/calendar/CalendarSelector';
// sections
import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../sections/@dashboard/calendar';
import { getClients } from 'src/redux/slices/clients';
import useLocales from 'src/hooks/useLocales';
import HoverButton from 'src/components/HoverButton';
import LessonForm from 'src/sections/@dashboard/calendar/LessonForm';
import { getBusinessMembers } from 'src/redux/slices/business';
import CalendarDayForm from 'src/sections/@dashboard/calendar/CalendarDayForm';
import useAuth from 'src/hooks/useAuth';
import LessonStepper from 'src/sections/@dashboard/calendar/LessonStepper';

// ----------------------------------------------------------------------

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === parseInt(selectedEventId));
  }
  return null;
};

export default function Calendar() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef(null);

  const [date, setDate] = useState(new Date());

  const [eventsFilter, setEventsFilter] = useState({key: 0, value: "Todos"});
  const filterOptions = [
    {key: 0, value: "Todos"}, 
    {key: 1, value: translate('menu.independent')}, 
    {key: 2, value: translate('menu.School')}];

  const [view, setView] = useState('dayGridMonth');

  const selectedEvent = useSelector(selectedEventSelector);

  const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);
  const { members } = useSelector((state) => state.business);
  const { clients } = useSelector((state) => state.clients);
  const user = useAuth();

  useEffect(() => {
    dispatch(getEventsByDate(date, user?.user?.role === 'SCHOOL_ADMIN', user?.user?.administeredBusiness?.id));
    dispatch(getClients());
    dispatch(getBusinessMembers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEventsByDate(date, user?.user?.role === 'SCHOOL_ADMIN'));
  }, [date]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = 'dayGridMonth';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleFilterEvents = (event) => {
    const selectedFilter = filterOptions.find(option => option.value === event.target.value);
    setEventsFilter(selectedFilter);
  };

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

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg) => {
    const id = arg.event.id;
    dispatch(selectEvent(id));
  };

  const handleResizeEvent = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          ...event,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const filterEventList = () => {
    if (eventsFilter.key === 0) return events;

    const memberIds = members.map(member => member.id);

    return events.filter(event => {
      const hasTeacher = event.assignedUsers.some(user => user.role === 'TEACHER');
      const teachers = event.assignedUsers.filter(user => user.role === 'TEACHER');

      if (eventsFilter.key === 1) { // Independientes
        if (!hasTeacher) return !memberIds.includes(event?.owner?.id);
        return teachers.some(teacher => !memberIds.includes(teacher.id));
      }

      if (eventsFilter.key === 2) { //Escuela
        if (!hasTeacher) return memberIds.includes(event?.owner?.id);
        return teachers.some(teacher => memberIds.includes(teacher?.id));
      }

      return false;
    });
  };

  const filteredEvents = filterEventList();

  return (
    <Page title={translate('calendar.name')}>
      <Container>
        <HeaderBreadcrumbs
          heading={translate('calendar.name')}
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: translate('calendar.name') }]}
          action={
            <HoverButton
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
              onClick={handleAddEvent}
            >
              {translate('calendar.newEvent')}
            </HoverButton>
          }
        />
      </Container>
      {user?.user?.role === 'SCHOOL_ADMIN' && 
        <CalendarSelector onFilter={handleFilterEvents} filter={eventsFilter} filterOptions={filterOptions}/>
      }
      <Card>
        <CalendarStyle>
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
            editable
            droppable
            selectable
            events={filteredEvents}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
            allDayMaintainDuration
            eventResizableFromStart
            select={handleSelectRange}
            eventDrop={handleDropEvent}
            eventClick={handleSelectEvent}
            eventResize={handleResizeEvent}
            height={isDesktop ? 720 : 'auto'}
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
          />
        </CalendarStyle>
        </Card>

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{selectedEvent ? `${translate('calendar.editEvent')} - ${selectedEvent.id}` : new Date(selectedRange?.start).toDateString()}</DialogTitle>
          {/* {selectedEvent?.source === 'APP' ? 
            <LessonForm event={selectedEvent || {}} range={selectedRange} onCancel={handleCloseModal} clients={clients} members={members || {}}/> :  */}
            {selectedEvent && <CalendarForm 
            event={selectedEvent || {}} 
            disabled={selectedEvent?.source === 'APP' && !(selectEvent?.businessOwner !== undefined && selectEvent?.businessOwner !== null && selectEvent.businessOwner.id === user?.user?.administeredBusiness) && !(user?.user?.role === "ADMIN") && !(user?.user?.role === "SCHOOL_ADMIN")}  range={selectedRange} onCancel={handleCloseModal} clients={clients} members={members || {}}/>}
            {/* } */}
            {!selectedEvent && <CalendarDayForm 
            event={selectedEvent || {}} 
            disabled={selectedEvent?.source === 'APP' && !(selectEvent?.businessOwner !== undefined && selectEvent?.businessOwner !== null && selectEvent.businessOwner.id === user?.user?.administeredBusiness) && !(user?.user?.role === "ADMIN") && !(user?.user?.role === "SCHOOL_ADMIN")}  range={selectedRange} onCancel={handleCloseModal} clients={clients} members={members || {}}/>}
        </DialogAnimate>
      {/* </Container> */}
    </Page>
  );
}

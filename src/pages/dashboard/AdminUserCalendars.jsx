import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
// @mui
import {
  Card,
  Container,
  DialogTitle,
  Typography,
  Autocomplete,
  TextField,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getEventsByUserId,
  getResortAdminEventsByUserId,
  getDayPricesByUserId,
  selectEvent,
  closeModal,
} from '../../redux/slices/calendar';
import { getClients } from '../../redux/slices/clients';
import { getBusinessMembers } from '../../redux/slices/business';
import { getTeachers, getResortAdminTeachers, getTeacher } from '../../redux/slices/admin';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import { DialogAnimate } from '../../components/animate';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useAuth from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
// sections
import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../sections/@dashboard/calendar';

// ----------------------------------------------------------------------

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => String(_event.id) === String(selectedEventId));
  }
  return null;
};

const getTeacherLabel = (teacher) => {
  if (!teacher) return '';
  return `${teacher.name || ''} ${teacher.lastname || ''}`.trim();
};

export default function AdminUserCalendars() {
  const { themeStretch } = useSettings();
  const { isResortAdmin } = useAuth();
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const isDesktop = useResponsive('up', 'sm');
  const calendarRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [visibleRange, setVisibleRange] = useState(null);

  const selectedEvent = useSelector(selectedEventSelector);
  const { events, dayPrices, isLoading, isOpenModal } = useSelector((state) => state.calendar);
  const { teachers, teacher } = useSelector((state) => state.admin);
  const { clients } = useSelector((state) => state.clients);
  const { members } = useSelector((state) => state.business);

  const dayPricesByDate = useMemo(() => {
    const map = {};
    dayPrices.forEach((entry) => {
      map[entry.date] = entry;
    });
    return map;
  }, [dayPrices]);

  useEffect(() => {
    if (isResortAdmin) {
      dispatch(getResortAdminTeachers(0, 'TEACHER', '', 0));
    } else {
      dispatch(getTeachers(0, 'TEACHER', '', 0));
    }
  }, [dispatch, isResortAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (teacherSearch) {
        if (isResortAdmin) {
          dispatch(getResortAdminTeachers(0, 'TEACHER', teacherSearch, 0));
        } else {
          dispatch(getTeachers(0, 'TEACHER', teacherSearch, 0));
        }
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [teacherSearch, dispatch, isResortAdmin]);

  useEffect(() => {
    dispatch(getClients());
    dispatch(getBusinessMembers());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getTeacher(userId));
      if (isResortAdmin) {
        dispatch(getResortAdminEventsByUserId(userId));
      } else {
        dispatch(getEventsByUserId(userId));
      }
    } else {
      dispatch(closeModal());
    }
  }, [userId, dispatch, isResortAdmin]);

  useEffect(() => {
    if (teacher && userId && String(teacher.id) === String(userId)) {
      setSelectedTeacher(teacher);
    }
  }, [teacher, userId]);

  useEffect(() => {
    if (!userId) {
      setSelectedTeacher(null);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && visibleRange) {
      const from = dayjs(visibleRange.start).format('YYYY-MM-DD');
      const to = dayjs(visibleRange.end).subtract(1, 'day').format('YYYY-MM-DD');
      dispatch(getDayPricesByUserId(userId, from, to));
    }
  }, [userId, visibleRange, dispatch]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleTeacherChange = (_, value) => {
    setSelectedTeacher(value);
    if (value?.id) {
      setSearchParams({ userId: String(value.id) });
    } else {
      setSearchParams({});
    }
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

  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleCloseEventDialog = () => {
    dispatch(closeModal());
  };

  const handleDatesSet = useCallback((dateInfo) => {
    setDate(dateInfo.start);
    setVisibleRange({ start: dateInfo.start, end: dateInfo.end });
  }, []);

  const dayCellContent = useCallback(
    (arg) => {
      const dateStr = dayjs(arg.date).format('YYYY-MM-DD');
      const priceEntry = dayPricesByDate[dateStr];
      if (!priceEntry) {
        return { html: arg.dayNumberText };
      }
      const parts = [];
      if (priceEntry.price2h != null) parts.push(`2h: ${priceEntry.price2h}`);
      if (priceEntry.price3h != null) parts.push(`3h: ${priceEntry.price3h}`);
      if (priceEntry.priceFullDay != null) parts.push(`FD: ${priceEntry.priceFullDay}`);
      const priceLabel = parts.length
        ? `${parts.join(' · ')} ${priceEntry.currency || ''}`
        : '';
      return {
        html: `<div>${arg.dayNumberText}</div>${
          priceLabel
            ? `<div style="font-size:9px;line-height:1.2;color:#637381;margin-top:2px">${priceLabel}</div>`
            : ''
        }`,
      };
    },
    [dayPricesByDate]
  );

  return (
    <Page title="User Calendars">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="User Calendars"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'User Calendars' },
          ]}
        />

        <Card sx={{ p: 3, mb: 3 }}>
          <Autocomplete
            options={teachers || []}
            value={selectedTeacher}
            onChange={handleTeacherChange}
            onInputChange={(_, value) => setTeacherSearch(value)}
            getOptionLabel={getTeacherLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search teacher by name"
                placeholder="Type name or lastname"
                autoFocus={!userId}
              />
            )}
            noOptionsText={teacherSearch ? 'No teachers found' : 'Type to search teachers'}
          />
          {!userId && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Select a teacher to view their calendar settings.
            </Typography>
          )}
        </Card>

        {userId && (
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
                editable={false}
                droppable={false}
                selectable={false}
                events={events}
                ref={calendarRef}
                rerenderDelay={10}
                initialDate={date}
                initialView={view}
                dayMaxEventRows={3}
                eventDisplay="block"
                headerToolbar={false}
                allDayMaintainDuration
                eventClick={handleSelectEvent}
                datesSet={handleDatesSet}
                dayCellContent={dayCellContent}
                height={isDesktop ? 720 : 'auto'}
                plugins={[listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
              />
            </CalendarStyle>
          </Card>
        )}

        {userId && isLoading && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading calendar data...
          </Typography>
        )}

        <DialogAnimate open={isOpenModal} onClose={handleCloseEventDialog}>
          <DialogTitle>{translate('calendar.editEvent')}</DialogTitle>
          <CalendarForm
            key={selectedEvent?.id || 'event'}
            event={selectedEvent || {}}
            disabled={false}
            range={null}
            onCancel={handleCloseEventDialog}
            clients={clients}
            members={members || {}}
          />
        </DialogAnimate>
      </Container>
    </Page>
  );
}

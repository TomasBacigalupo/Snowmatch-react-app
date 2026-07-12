import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  openModal,
  closeModal,
  selectEvent,
  selectRange,
  updateEventByUserIdAndEventId,
} from '../../redux/slices/calendar';
import { getTeachers, getResortAdminTeachers, getTeacher } from '../../redux/slices/admin';
import { getClients } from '../../redux/slices/clients';
import { getBusinessMembers } from '../../redux/slices/business';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { DialogAnimate } from '../../components/animate';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useAuth from '../../hooks/useAuth';
import HoverButton from '../../components/HoverButton';
import { useSnackbar } from 'notistack';
// sections
import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../sections/@dashboard/calendar';

// ----------------------------------------------------------------------

const getTeacherLabel = (teacher) => {
  if (!teacher) return '';
  return `${teacher.name || ''} ${teacher.lastname || ''}`.trim();
};

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => String(_event.id) === String(selectedEventId));
  }
  return null;
};

const buildAdminSchedulePayload = (existing, start, end) => ({
  id: existing.id,
  title: existing.title || 'Event',
  description: existing.description ?? '',
  textColor: existing.textColor,
  start,
  end,
  type: existing.type,
  price: existing.price,
  resort: existing.resort,
  state: existing.state ?? 'PENDING',
  payed: existing.payed ?? false,
  clients: (existing.clients || []).map((c) => ({ id: c.id })).filter((c) => c.id != null),
  students: (existing.students || []).map((s) => ({ id: s.id })).filter((s) => s.id != null),
});

export default function AdminUserCalendars() {
  const { t } = useTranslation();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const pageTitle = t('menu.user calendars');
  const { isResortAdmin, isAdmin } = useAuth();
  const canEditCalendar = Boolean(isAdmin) && !isResortAdmin;
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
  const { events, dayPrices, isLoading, isOpenModal, selectedRange } = useSelector(
    (state) => state.calendar
  );
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

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      calendarEl.getApi().unselect();
    }
    dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleScheduleChange = async ({ event }) => {
    if (!canEditCalendar || !userId) return;
    const existing = events.find((e) => String(e.id) === String(event.id));
    if (!existing) {
      enqueueSnackbar('Event not found', { variant: 'error' });
      return;
    }
    try {
      await dispatch(
        updateEventByUserIdAndEventId(
          userId,
          event.id,
          buildAdminSchedulePayload(existing, event.start, event.end)
        )
      );
      enqueueSnackbar('Schedule updated');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to update schedule', { variant: 'error' });
      dispatch(getEventsByUserId(userId));
    }
  };

  const handleAddEvent = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    if (userId) {
      if (isResortAdmin) {
        dispatch(getResortAdminEventsByUserId(userId));
      } else {
        dispatch(getEventsByUserId(userId));
      }
    }
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
    <Page title={pageTitle}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={pageTitle}
          links={[
            { name: t('menu.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('menu.admin'), href: PATH_DASHBOARD.admin.root },
            { name: pageTitle },
          ]}
          action={
            userId && canEditCalendar ? (
              <HoverButton
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" width={20} height={20} />}
                onClick={handleAddEvent}
              >
                {translate('calendar.newEvent')}
              </HoverButton>
            ) : null
          }
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
                label={t('adminUserCalendars.searchTeacherLabel')}
                placeholder={t('adminUserCalendars.searchTeacherPlaceholder')}
                autoFocus={!userId}
              />
            )}
            noOptionsText={
              teacherSearch
                ? t('adminUserCalendars.noTeachersFound')
                : t('adminUserCalendars.typeToSearchTeachers')
            }
          />
          {!userId && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t('adminUserCalendars.selectTeacherHint')}
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
                editable={canEditCalendar}
                droppable={canEditCalendar}
                selectable={canEditCalendar}
                events={events}
                ref={calendarRef}
                rerenderDelay={10}
                initialDate={date}
                initialView={view}
                dayMaxEventRows={3}
                eventDisplay="block"
                headerToolbar={false}
                allDayMaintainDuration
                eventResizableFromStart={canEditCalendar}
                select={canEditCalendar ? handleSelectRange : undefined}
                eventDrop={canEditCalendar ? handleScheduleChange : undefined}
                eventResize={canEditCalendar ? handleScheduleChange : undefined}
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

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>
            {selectedEvent ? translate('calendar.editEvent') : translate('calendar.addEvent')}
          </DialogTitle>
          <CalendarForm
            key={selectedEvent?.id || `new-${selectedRange?.start || 'empty'}`}
            event={selectedEvent || {}}
            range={selectedRange}
            onCancel={handleCloseModal}
            clients={clients || []}
            members={members || []}
            ownerUserId={userId}
            disabled={!canEditCalendar}
          />
        </DialogAnimate>
      </Container>
    </Page>
  );
}

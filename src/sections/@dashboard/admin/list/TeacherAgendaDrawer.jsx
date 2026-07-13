import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Box,
  Chip,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/Iconify';
import { SkeletonCalendar } from 'src/components/skeleton';
import { useDispatch, useSelector } from 'src/redux/store';
import { getEventsByUserId } from 'src/redux/slices/calendar';
import { CalendarStyle, CalendarToolbar } from 'src/sections/@dashboard/calendar';

TeacherAgendaDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  teacher: PropTypes.object,
};

export default function TeacherAgendaDrawer({ open, onClose, teacher }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('listWeek');

  const { events, isLoading } = useSelector((state) => state.calendar);
  const teacherId = teacher?.id;

  useEffect(() => {
    if (open && teacherId) {
      dispatch(getEventsByUserId(teacherId));
    }
  }, [dispatch, open, teacherId]);

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

  if (!teacher) return null;

  const teacherName = [teacher.name, teacher.lastName].filter(Boolean).join(' ');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: {
          paddingTop: 'env(safe-area-inset-top)',
          width: { xs: '100%', sm: 480, md: 640 },
        },
      }}
      BackdropProps={{
        onClick: onClose,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {t('adminSchoolMemberLessons.drawer.subtitle')}
            </Typography>
            <Typography variant="h6">{teacherName}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {teacher.level != null && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('adminSchoolMemberLessons.drawer.level', { level: teacher.level })}
                />
              )}
              {teacher.email && (
                <Chip size="small" variant="outlined" label={teacher.email} />
              )}
            </Stack>
          </Box>
          <IconButton onClick={onClose} edge="end">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
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
              <SkeletonCalendar height={560} />
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
                height={560}
                noEventsText={t('adminSchoolMemberLessons.drawer.noEvents')}
                plugins={[listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
              />
            )}
          </CalendarStyle>
        </Box>
      </Box>
    </Drawer>
  );
}

import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Stack,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

BookingDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
};

export default function BookingDetailsDrawer({ open, onClose, booking }) {
  const theme = useTheme();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const calendarEvents = booking?.eventList?.map(event => ({
    title: `Clase con ${booking.teacher.name} ${booking.teacher.lastname}`,
    start: event.start,
    end: event.end,
    allDay: false,
  })) || [];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: { 
          width: { 
            xs: '100%', 
            sm: 600,
            md: 800 
          },
          '& .MuiDrawer-paper': {
            width: { 
              xs: '100%', 
              sm: 600,
              md: 800 
            },
            boxSizing: 'border-box',
          },
        },
      }}
      BackdropProps={{
        onClick: onClose,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Detalles de la Reserva #{booking?.id}</Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>
          {/* Estado y Pago */}
          <Box>
            <Stack direction="row" spacing={1}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (booking?.state === 'DECLINED' && 'error') ||
                  (booking?.state === 'PENDING' && 'warning') ||
                  'success'
                }
                sx={{ px: 2, py: 1 }}
              >
                {booking?.state}
              </Label>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (booking?.paymentStatus === 'PENDING' && 'warning') ||
                  (booking?.paymentStatus === 'PAID' && 'success') ||
                  'error'
                }
                sx={{ px: 2, py: 1 }}
              >
                {booking?.paymentStatus || 'PENDING'}
              </Label>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            {/* Cliente */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Cliente
                </Typography>
                <Typography variant="body1">
                  {`${booking?.student.name} ${booking?.student.lastname}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {booking?.student.id}
                </Typography>
              </Box>
            </Grid>

            {/* Instructor */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Instructor
                </Typography>
                <Typography variant="body1">
                  {`${booking?.teacher.name} ${booking?.teacher.lastname}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {booking?.teacher.id}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Detalles de la Reserva */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Detalles de la Reserva
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Montaña
                </Typography>
                <Typography variant="body1">
                  {booking?.resort}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Precio
                </Typography>
                <Typography variant="body1" color="primary.main">
                  {formatPrice(booking?.price)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Capacidad
                </Typography>
                <Typography variant="body1">
                  {booking?.adults} adultos, {booking?.children} niños
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Incluye
                </Typography>
                <Stack direction="row" spacing={1}>
                  {booking?.includesLunch && (
                    <Chip size="medium" label="Almuerzo" color="primary" />
                  )}
                  {booking?.includesEquipment && (
                    <Chip size="medium" label="Equipo" color="primary" />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* Comentarios */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Comentarios
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Comentario del Cliente:
                </Typography>
                <Typography variant="body1" paragraph>
                  {booking?.userComment || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Comentario Interno:
                </Typography>
                <Typography variant="body1">
                  {booking?.internalComment || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Calendario */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Calendario de Clases
            </Typography>
            <Box sx={{ height: 500 }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                locale={esLocale}
                events={calendarEvents}
                height="100%"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                weekends={true}
                editable={false}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
} 
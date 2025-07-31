import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
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
  Button,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
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
import BookingEditModal from './BookingEditModal';
// redux
import { useDispatch } from 'react-redux';
import { createPayout } from '../../../../redux/slices/bookings';

BookingDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  refreshBookings: PropTypes.func,
};

export default function BookingDetailsDrawer({ open, onClose, booking, refreshBookings }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uploadingInvoice, setUploadingInvoice] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [uploadingPayout, setUploadingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const fileInputRef = useRef(null);
  const payoutFileInputRef = useRef(null);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSave = (updatedBooking) => {
    // TODO: Implement the API call to update the booking
    console.log('Updated booking:', updatedBooking);
    setEditModalOpen(false);
    // Refresh the bookings list after successful save
    if (refreshBookings) {
      refreshBookings();
    }
  };

  const handleWhatsAppContact = (phoneNumber, name) => {
    const message = `Hola ${name}, te contacto desde SnowMatch sobre la reserva #${booking?.id}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInvoiceUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor selecciona un archivo válido (JPG, PNG o PDF)');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB permitido.');
      return;
    }

    setUploadingInvoice(true);
    
    // Simular carga de archivo (aquí deberías implementar la llamada a la API)
    setTimeout(() => {
      console.log('Archivo a subir:', file);
      // TODO: Implementar la API call para subir la factura
      // const formData = new FormData();
      // formData.append('invoice', file);
      // formData.append('bookingId', booking.id);
      // formData.append('teacherId', booking.teacher.id);
      
      setUploadingInvoice(false);
      setUploadSuccess(true);
      
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setUploadSuccess(false), 3000);
      
      // Refresh bookings si es necesario
      if (refreshBookings) {
        refreshBookings();
      }
    }, 2000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePayoutModalOpen = () => {
    setPayoutModalOpen(true);
  };

  const handlePayoutModalClose = () => {
    setPayoutModalOpen(false);
    setPayoutAmount('');
    if (payoutFileInputRef.current) {
      payoutFileInputRef.current.value = '';
    }
  };

  const handlePayoutUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor selecciona un archivo válido (JPG, PNG o PDF)');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB permitido.');
      return;
    }

    setUploadingPayout(true);
    
    try {
      // Llamar a la función del Redux slice para crear el payout
      await dispatch(createPayout(booking.id, file, booking.teacher.id, parseFloat(payoutAmount)));
      
      setUploadingPayout(false);
      setPayoutSuccess(true);
      handlePayoutModalClose();
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setPayoutSuccess(false), 3000);
      
      // Refresh bookings si es necesario
      if (refreshBookings) {
        refreshBookings();
      }
    } catch (error) {
      setUploadingPayout(false);
      console.error('Error al crear el payout:', error);
      alert('Error al registrar el payout. Por favor intenta nuevamente.');
    }
  };

  const handlePayoutSubmit = () => {
    if (!payoutAmount || payoutAmount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    
    payoutFileInputRef.current?.click();
  };

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
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        PaperProps={{
          sx: { 
            paddingTop: 'env(safe-area-inset-top)',
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
            <Stack direction="row" spacing={1}>
              <IconButton onClick={handleEditClick}>
                <Iconify icon="eva:edit-fill" />
              </IconButton>
              <IconButton onClick={onClose}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Stack>
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
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" gutterBottom>
                      Cliente
                    </Typography>
                    {booking?.student?.cellphone && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Iconify icon="logos:whatsapp-icon" />}
                        onClick={() => handleWhatsAppContact(booking.student.cellphone, `${booking.student.name} ${booking.student.lastname}`)}
                        sx={{ minWidth: 'auto' }}
                      >
                        WhatsApp
                      </Button>
                    )}
                  </Stack>
                  <Typography variant="body1">
                    {`${booking?.student.name} ${booking?.student.lastname}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {booking?.student.id}
                  </Typography>
                  {booking?.student?.cellphone && (
                    <Typography variant="body2" color="text.secondary">
                      Tel: {booking?.student.cellphone}
                    </Typography>
                  )}
                </Box>
              </Grid>
              {/* Instructor */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" gutterBottom>
                      Instructor
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {/* <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Iconify icon="eva:upload-fill" />}
                        onClick={handleUploadClick}
                        disabled={uploadingInvoice}
                        sx={{ minWidth: 'auto' }}
                      >
                        {uploadingInvoice ? 'Subiendo...' : 'Cargar Factura'}
                      </Button> */}
                      {booking?.teacher?.cellphone && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Iconify icon="logos:whatsapp-icon" />}
                          onClick={() => handleWhatsAppContact(booking.teacher.cellphone, `${booking.teacher.name} ${booking.teacher.lastname}`)}
                          sx={{ minWidth: 'auto' }}
                        >
                          WhatsApp
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                  <Typography variant="body1">
                    {`${booking?.teacher.name} ${booking?.teacher.lastname}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {booking?.teacher.id}
                  </Typography>
                  {booking?.teacher?.phone && (
                    <Typography variant="body2" color="text.secondary">
                      Tel: {booking?.teacher.cellphone}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Detalles de la Reserva */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Detalles de la Reserva -
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
                    Tipo de Clase
                  </Typography>
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={
                      (booking?.type === 'REFERRED' && 'info') ||
                      (booking?.type === 'ASSIGNED' && 'secondary') ||
                      'default'
                    }
                    sx={{ px: 2, py: 1 }}
                  >
                    {booking?.type || 'ASSIGNED'}
                  </Label>
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
                    Método de Pago
                  </Typography>
                  {console.log({booking})}
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={
                      (booking?.bookingPaymentMethod === "CASH" && 'default') ||
                      (booking?.bookingPaymentMethod === "TRANSFER" && 'info') ||
                      (booking?.bookingPaymentMethod === "DEBIT_CARD" && 'secondary') ||
                      (booking?.bookingPaymentMethod === "CREDIT_CARD" && 'primary') ||
                      'default'
                    }
                    sx={{ px: 2, py: 1 }}
                  >
                    {booking?.bookingPaymentMethod || 'PENDIENTE'}
                  </Label>
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
                    {booking?.includesLaunch && (
                      <Chip size="medium" label="Almuerzo" color="primary" />
                    )}
                    {booking?.includesEquipments && (
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

            {/* Factura del Instructor */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Factura del Instructor
              </Typography>
              
              {uploadSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Factura cargada exitosamente
                </Alert>
              )}

              {booking?.teacherInvoiceUrl ? (
                <Card>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Iconify 
                        icon="eva:file-text-fill" 
                        sx={{ color: 'primary.main', fontSize: 24 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" gutterBottom>
                          Factura del Instructor
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Factura cargada para esta reserva
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:eye-fill" />}
                        onClick={() => window.open(booking.teacherInvoiceUrl, '_blank')}
                      >
                        Ver Factura
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="eva:info-fill" />
                    <Typography variant="body2">
                      El instructor aún no ha subido la factura para esta reserva
                    </Typography>
                  </Stack>
                </Alert>
              )}
            </Box>

            {/* Payout del Instructor */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Payout del Instructor
              </Typography>
              
              {payoutSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Payout registrado exitosamente
                </Alert>
              )}

              {booking?.teacherPayout ? (
                <Card>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Iconify 
                        icon="eva:credit-card-fill" 
                        sx={{ color: 'success.main', fontSize: 24 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" gutterBottom>
                          Payout del Instructor
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monto transferido: {formatPrice(booking.teacherPayout.amount)}
                        </Typography>
                        {booking.teacherPayout.transferDate && (
                          <Typography variant="body2" color="text.secondary">
                            Fecha: {formatDate(booking.teacherPayout.transferDate)}
                          </Typography>
                        )}
                      </Box>
                      {booking.teacherPayout.receiptUrl && (
                        <Button
                          variant="contained"
                          startIcon={<Iconify icon="eva:eye-fill" />}
                          onClick={() => window.open(booking.teacherPayout.receiptUrl, '_blank')}
                        >
                          Ver Comprobante
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="eva:info-fill" />
                      <Typography variant="body2">
                        Aún no se ha registrado el payout para esta reserva
                      </Typography>
                    </Stack>
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="eva:plus-fill" />}
                      onClick={handlePayoutModalOpen}
                    >
                      Registrar Payout
                    </Button>
                  </Stack>
                </Alert>
              )}
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

      <BookingEditModal
        open={editModalOpen}
        onClose={handleEditClose}
        booking={booking}
        onSave={handleEditSave}
      />

      {/* Modal para registrar payout */}
      <Dialog open={payoutModalOpen} onClose={handlePayoutModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:credit-card-fill" />
            <Typography variant="h6">Registrar Payout del Instructor</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Monto Transferido"
              type="number"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Ingresa el monto que se transfirió al instructor"
            />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Comprobante de Transferencia
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:upload-fill" />}
                onClick={() => payoutFileInputRef.current?.click()}
                disabled={uploadingPayout}
                fullWidth
              >
                {uploadingPayout ? 'Subiendo...' : 'Seleccionar Comprobante'}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Formatos permitidos: JPG, PNG, PDF (máximo 10MB)
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePayoutModalClose} disabled={uploadingPayout}>
            Cancelar
          </Button>
          <Button 
            onClick={handlePayoutSubmit} 
            variant="contained" 
            disabled={!payoutAmount || uploadingPayout}
          >
            {uploadingPayout ? 'Registrando...' : 'Registrar Payout'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Input file oculto para cargar facturas */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: 'none' }}
        onChange={handleInvoiceUpload}
      />

      {/* Input file oculto para cargar comprobantes de payout */}
      <input
        ref={payoutFileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: 'none' }}
        onChange={handlePayoutUpload}
      />
    </>
  );
} 
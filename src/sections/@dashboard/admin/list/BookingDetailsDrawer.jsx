import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import PayoutEditModal from './PayoutEditModal';
// redux
import { useDispatch } from 'react-redux';
import { createPayout } from '../../../../redux/slices/bookings';
import { fetchPayouts } from 'src/redux/slices/admin';
import axios from 'src/utils/axios';

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
  const [payoutEditModalOpen, setPayoutEditModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const fileInputRef = useRef(null);
  const payoutFileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [rentalLines, setRentalLines] = useState([]);
  const [rentalLinesLoading, setRentalLinesLoading] = useState(false);
  const [rentalLinesError, setRentalLinesError] = useState(null);

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
    setFile(null);
    if (booking?.id) {
      dispatch(fetchPayouts(booking.id));
    }
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

    //setUploadingPayout(true);
    setFile(file);
    
  };

  const handlePayoutSubmit = async () => {
    if (!payoutAmount || payoutAmount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    try {
      if (!booking?.id || !booking?.teacher?.id) {
        alert('Faltan datos de la reserva o del instructor.');
        return;
      }
      // Llamar a la función del Redux slice para crear el payout
      await dispatch(createPayout(booking.id, file, booking.teacher.id, parseFloat(payoutAmount)));
      
      setUploadingPayout(false);
      setPayoutSuccess(true);
      handlePayoutModalClose();
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setPayoutSuccess(false), 3000);
    } catch (error) {
      setUploadingPayout(false);
      console.error('Error al crear el payout:', error);
      alert('Error al registrar el payout. Por favor intenta nuevamente.');
    }
  };

  const handlePayoutEditClick = (payout) => {
    setSelectedPayout(payout);
    setPayoutEditModalOpen(true);
  };

  const handlePayoutEditClose = () => {
    setPayoutEditModalOpen(false);
    setSelectedPayout(null);
  };

  const handlePayoutEditSave = () => {
    dispatch(fetchPayouts(booking.id));
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

  const teacherLabel = [booking?.teacher?.name, booking?.teacher?.lastname].filter(Boolean).join(' ') || 'Instructor';
  const calendarEvents = booking?.eventList?.map((event) => ({
    title: `Clase con ${teacherLabel}`,
    start: event.start,
    end: event.end,
    allDay: false,
  })) || [];

  useEffect(() => {
    if (open && booking?.id) {
      dispatch(fetchPayouts(booking.id));
    }
  }, [open, booking?.id, dispatch]);

  useEffect(() => {
    const shouldFetch =
      open &&
      booking?.id &&
      (booking?.type === 'GEAR_ONLY' || booking?.includesEquipments);
    if (!shouldFetch) {
      setRentalLines([]);
      setRentalLinesError(null);
      return undefined;
    }
    let cancelled = false;
    setRentalLinesLoading(true);
    setRentalLinesError(null);
    axios
      .get(`/api/rental/admin/reservations/booking/${booking.id}`)
      .then((res) => {
        if (!cancelled) {
          setRentalLines(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRentalLinesError(typeof err === 'string' ? err : err?.message || 'Error');
          setRentalLines([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRentalLinesLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, booking?.id, booking?.type, booking?.includesEquipments]);

  // Cleanup object URL when file changes or component unmounts
  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setFilePreviewUrl(objectUrl);
      
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setFilePreviewUrl(null);
    }
  }, [file]);

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
                    {[booking?.student?.name, booking?.student?.lastname].filter(Boolean).join(' ') || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {booking?.student?.id ?? '—'}
                  </Typography>
                  {booking?.student?.cellphone && (
                    <Typography variant="body2" color="text.secondary">
                      Tel: {booking.student.cellphone}
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
                    {[booking?.teacher?.name, booking?.teacher?.lastname].filter(Boolean).join(' ') || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {booking?.teacher?.id ?? '—'}
                  </Typography>
                  {booking?.teacher?.phone && (
                    <Typography variant="body2" color="text.secondary">
                      Tel: {booking?.teacher?.cellphone}
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
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={
                      (booking?.bookingPaymentMethod === "CASH" && 'default') ||
                      (booking?.bookingPaymentMethod === "TRANSFER" && 'info') ||
                      (booking?.bookingPaymentMethod === "WIRE_TRANSFER" && 'info') ||
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

            {(booking?.type === 'GEAR_ONLY' ||
              booking?.includesEquipments ||
              booking?.rentalFulfillment ||
              rentalLines.length > 0) && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Equipo / alquiler
                </Typography>
                {(booking?.rentalFulfillment || booking?.rentalDestinationDetail) && (
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {booking?.rentalFulfillment && (
                      <Typography variant="body2" color="text.secondary">
                        Entrega:{' '}
                        <Typography component="span" variant="body2" color="text.primary">
                          {booking.rentalFulfillment === 'SHIP_TO_HOTEL_OR_HOME'
                            ? 'Envío a hotel o domicilio'
                            : booking.rentalFulfillment === 'PICKUP_IN_SHOP'
                            ? 'Retiro en tienda'
                            : booking.rentalFulfillment}
                        </Typography>
                      </Typography>
                    )}
                    {booking?.rentalDestinationType && (
                      <Typography variant="body2" color="text.secondary">
                        Tipo de destino:{' '}
                        <Typography component="span" variant="body2" color="text.primary">
                          {booking.rentalDestinationType === 'HOTEL_OR_CABIN'
                            ? 'Hotel / cabaña'
                            : booking.rentalDestinationType === 'HOME_ADDRESS'
                            ? 'Domicilio'
                            : booking.rentalDestinationType}
                        </Typography>
                      </Typography>
                    )}
                    {booking?.rentalDestinationDetail && (
                      <Typography variant="body2" color="text.secondary">
                        Dirección / hotel:{' '}
                        <Typography component="span" variant="body2" color="text.primary">
                          {booking.rentalDestinationDetail}
                        </Typography>
                      </Typography>
                    )}
                  </Stack>
                )}
                {rentalLinesLoading && (
                  <Typography variant="body2" color="text.secondary">
                    Cargando líneas de alquiler…
                  </Typography>
                )}
                {rentalLinesError && (
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    {rentalLinesError}
                  </Alert>
                )}
                {!rentalLinesLoading && rentalLines.length > 0 && (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ítem</TableCell>
                          <TableCell>Variante</TableCell>
                          <TableCell>Fechas</TableCell>
                          <TableCell>Participante</TableCell>
                          <TableCell align="right">Altura cm</TableCell>
                          <TableCell align="right">Peso kg</TableCell>
                          <TableCell align="right">Pie cm</TableCell>
                          <TableCell>Nivel</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rentalLines.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.itemName || '—'}</TableCell>
                            <TableCell>{row.variantSummary || '—'}</TableCell>
                            <TableCell>
                              {[row.startDate, row.endDate].filter(Boolean).join(' → ') || '—'}
                            </TableCell>
                            <TableCell>
                              {[row.renterFirstName, row.renterLastName].filter(Boolean).join(' ') || '— (titular)'}
                            </TableCell>
                            <TableCell align="right">{row.renterHeightCm ?? '—'}</TableCell>
                            <TableCell align="right">{row.renterWeightKg ?? '—'}</TableCell>
                            <TableCell align="right">{row.renterFootLengthCm ?? '—'}</TableCell>
                            <TableCell>{row.renterSkiLevel || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {!rentalLinesLoading && !rentalLinesError && rentalLines.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Sin líneas de alquiler registradas para esta reserva.
                  </Typography>
                )}
              </Box>
            )}

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

              {booking?.payouts && booking.payouts.length > 0 ? (
                <Stack spacing={2}>
                  {booking.payouts.map((payout, index) => (
                    <Card key={payout.id || index}>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Iconify 
                            icon="eva:credit-card-fill" 
                            sx={{ color: 'success.main', fontSize: 24 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" gutterBottom>
                              Payout #{payout.id || index + 1}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Monto transferido: {formatPrice(payout.amount)}
                            </Typography>
                            {payout.transferDate && (
                              <Typography variant="body2" color="text.secondary">
                                Fecha: {formatDate(payout.transferDate)}
                              </Typography>
                            )}
                            {payout.status && (
                              <Label
                                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                color={
                                  (payout.status === 'PENDING' && 'warning') ||
                                  (payout.status === 'COMPLETED' && 'success') ||
                                  'error'
                                }
                                sx={{ mt: 1 }}
                              >
                                {payout.status}
                              </Label>
                            )}
                          </Box>
                          <Stack direction="row" spacing={1}>
                            {payout.invoiceUrl && (
                              <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:eye-fill" />}
                                onClick={() => window.open(payout.invoiceUrl, '_blank')}
                              >
                                Ver Comprobante
                              </Button>
                            )}
                            <Button
                              variant="outlined"
                              startIcon={<Iconify icon="eva:edit-fill" />}
                              onClick={() => handlePayoutEditClick(payout)}
                            >
                              Editar
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : booking?.teacherPayout ? (
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

      <PayoutEditModal
        open={payoutEditModalOpen}
        onClose={handlePayoutEditClose}
        payout={selectedPayout}
        onSave={handlePayoutEditSave}
        selectedBookingId={booking?.id}
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
              
              {/* File Preview */}
              {file && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Iconify 
                      icon={file.type.startsWith('image/') ? 'eva:image-fill' : 'eva:file-text-fill'} 
                      sx={{ color: 'primary.main', fontSize: 24 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => setFile(null)}
                      color="error"
                    >
                      <Iconify icon="eva:close-fill" />
                    </IconButton>
                  </Stack>
                  
                  {/* Image Preview */}
                  {file.type.startsWith('image/') && filePreviewUrl && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img
                        src={filePreviewUrl}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          objectFit: 'contain',
                          borderRadius: '4px'
                        }}
                      />
                    </Box>
                  )}
                  
                  {/* PDF Preview */}
                  {file.type === 'application/pdf' && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Iconify icon="eva:file-text-fill" sx={{ fontSize: 48, color: 'error.main' }} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Vista previa no disponible para PDF
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Box>
              )}
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
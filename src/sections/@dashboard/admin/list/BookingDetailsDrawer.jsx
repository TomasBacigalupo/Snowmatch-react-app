import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  Tooltip,
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
import enLocale from '@fullcalendar/core/locales/en-gb';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { CalendarStyle, CalendarToolbar } from '../../calendar';
import BookingEditModal from './BookingEditModal';
import PayoutEditModal from './PayoutEditModal';
import BookingRentalFulfillmentSection from './BookingRentalFulfillmentSection';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// utils
import { formatAdminBookingResortLabel } from 'src/utils/adminBookingResortOptions';
// redux
import { useDispatch } from 'react-redux';
import { createPayout } from '../../../../redux/slices/bookings';
import { fetchPayouts } from 'src/redux/slices/admin';

function getIntlLocale(lang) {
  if (lang?.startsWith('pt')) return 'pt-BR';
  if (lang?.startsWith('en')) return 'en-US';
  return 'es-AR';
}

function getCalendarLocale(lang) {
  if (lang?.startsWith('pt')) return ptBrLocale;
  if (lang?.startsWith('en')) return enLocale;
  return esLocale;
}

function DrawerEmptyStateCard({ icon, message, action }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
            <Iconify icon={icon} sx={{ color: 'text.disabled', fontSize: 22, mt: 0.25, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary">
              {message}
            </Typography>
          </Stack>
          {action && (
            <Box sx={{ display: 'flex', alignSelf: { xs: 'stretch', sm: 'flex-start' } }}>{action}</Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

DrawerEmptyStateCard.propTypes = {
  icon: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.node,
};

BookingDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  refreshBookings: PropTypes.func,
};

export default function BookingDetailsDrawer({ open, onClose, booking, refreshBookings }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isDesktop = useResponsive('up', 'sm');
  const intlLocale = getIntlLocale(i18n.language);
  const calendarLocale = getCalendarLocale(i18n.language);

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
  const calendarRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [classEventDialogOpen, setClassEventDialogOpen] = useState(false);
  const [selectedClassEvent, setSelectedClassEvent] = useState(null);

  const emptyValue = t('adminBookings.drawer.emptyValue');

  const translateEnum = (group, value, fallback) => {
    if (!value) return fallback;
    const key = `adminBookings.enums.${group}.${value}`;
    const translated = t(key);
    return translated === key ? value : translated;
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSave = (updatedBooking) => {
    console.log('Updated booking:', updatedBooking);
    setEditModalOpen(false);
    if (refreshBookings) {
      refreshBookings();
    }
  };

  const handleWhatsAppContact = (phoneNumber, name) => {
    const message = t('adminBookings.drawer.whatsappMessage', { name, id: booking?.id });
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const validateFile = (uploadFile) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(uploadFile.type)) {
      alert(t('adminBookings.drawer.invalidFileType'));
      return false;
    }
    if (uploadFile.size > 10 * 1024 * 1024) {
      alert(t('adminBookings.drawer.fileTooLarge'));
      return false;
    }
    return true;
  };

  const handleInvoiceUpload = (event) => {
    const uploadFile = event.target.files[0];
    if (!uploadFile || !validateFile(uploadFile)) return;

    setUploadingInvoice(true);

    setTimeout(() => {
      console.log('Archivo a subir:', uploadFile);
      setUploadingInvoice(false);
      setUploadSuccess(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setUploadSuccess(false), 3000);

      if (refreshBookings) {
        refreshBookings();
      }
    }, 2000);
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
    const uploadFile = event.target.files[0];
    if (!uploadFile || !validateFile(uploadFile)) return;
    setFile(uploadFile);
  };

  const handlePayoutSubmit = async () => {
    if (!payoutAmount || payoutAmount <= 0) {
      alert(t('adminBookings.drawer.invalidAmount'));
      return;
    }
    try {
      if (!booking?.id || !booking?.teacher?.id) {
        alert(t('adminBookings.drawer.missingBookingTeacher'));
        return;
      }
      await dispatch(createPayout(booking.id, file, booking.teacher.id, parseFloat(payoutAmount)));

      setUploadingPayout(false);
      setPayoutSuccess(true);
      handlePayoutModalClose();

      setTimeout(() => setPayoutSuccess(false), 3000);
    } catch (error) {
      setUploadingPayout(false);
      console.error('Error al crear el payout:', error);
      alert(t('adminBookings.drawer.payoutRegisterError'));
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

  const handleCalendarToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setCalendarDate(calendarApi.getDate());
    }
  };

  const handleCalendarChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setCalendarView(newView);
    }
  };

  const handleCalendarDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setCalendarDate(calendarApi.getDate());
    }
  };

  const handleCalendarDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setCalendarDate(calendarApi.getDate());
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(intlLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatPrice = (price) =>
    new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: 'ARS',
    }).format(price);

  const formatEventTime = (dateString) =>
    new Date(dateString).toLocaleTimeString(intlLocale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const formatEventDate = (dateString) =>
    new Date(dateString).toLocaleDateString(intlLocale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  const formatEventTimeRange = (start, end) =>
    `${formatEventTime(start)}–${formatEventTime(end)}`;

  const getEventDurationHours = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (endDate - startDate) / (1000 * 60 * 60);
  };

  const formatEventDuration = (start, end) => {
    const hours = getEventDurationHours(start, end);
    const rounded = Number.isInteger(hours) ? hours : Math.round(hours * 10) / 10;
    return t('adminBookings.drawer.classEventDurationHours', { hours: rounded });
  };

  const classSessions = useMemo(
    () =>
      booking?.eventList?.map((event, index) => ({
        ...event,
        sessionIndex: index,
      })) || [],
    [booking?.eventList]
  );

  const calendarEvents = useMemo(
    () =>
      classSessions.map((event) => ({
        title: formatEventTimeRange(event.start, event.end),
        start: event.start,
        end: event.end,
        allDay: false,
        color: theme.palette.primary.main,
        extendedProps: {
          rawEvent: event,
          sessionIndex: event.sessionIndex,
        },
      })),
    [classSessions, intlLocale, theme.palette.primary.main]
  );

  const paymentMethodLabel = booking?.bookingPaymentMethod
    ? translateEnum('paymentMethod', booking.bookingPaymentMethod, booking.bookingPaymentMethod)
    : t('adminBookings.drawer.paymentPending');

  const bookingTypeLabel = translateEnum(
    'bookingType',
    booking?.type || 'ASSIGNED',
    booking?.type || 'ASSIGNED'
  );

  const stateLabel = translateEnum('state', booking?.state, booking?.state);
  const paymentStatusLabel = translateEnum(
    'paymentStatus',
    booking?.paymentStatus || 'PENDING',
    booking?.paymentStatus || 'PENDING'
  );

  const resortLabel = formatAdminBookingResortLabel(booking?.resort, t);

  const teacherLabel =
    [booking?.teacher?.name, booking?.teacher?.lastname].filter(Boolean).join(' ') ||
    t('adminBookings.drawer.instructorFallback');

  const studentLabel =
    [booking?.student?.name, booking?.student?.lastname].filter(Boolean).join(' ') || emptyValue;

  const handleClassEventOpen = (event, sessionIndex) => {
    setSelectedClassEvent({ ...event, sessionIndex });
    setClassEventDialogOpen(true);
  };

  const handleClassEventClose = () => {
    setClassEventDialogOpen(false);
    setSelectedClassEvent(null);
  };

  const handleCalendarEventClick = (info) => {
    info.jsEvent.preventDefault();
    const { rawEvent, sessionIndex } = info.event.extendedProps;
    if (rawEvent) {
      handleClassEventOpen(rawEvent, sessionIndex);
    }
  };

  const renderWhatsAppAction = (phoneNumber, name) => {
    const onClick = () => handleWhatsAppContact(phoneNumber, name);

    if (isDesktop) {
      return (
        <Tooltip title={t('adminBookings.menu.whatsapp')}>
          <IconButton
            size="small"
            onClick={onClick}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Iconify icon="logos:whatsapp-icon" width={20} />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <Button
        size="small"
        variant="outlined"
        startIcon={<Iconify icon="logos:whatsapp-icon" />}
        onClick={onClick}
        sx={{ minWidth: 'auto' }}
      >
        {t('adminBookings.menu.whatsapp')}
      </Button>
    );
  };

  useEffect(() => {
    if (open && booking?.id) {
      dispatch(fetchPayouts(booking.id));
    }
  }, [open, booking?.id, dispatch]);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setFilePreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
    setFilePreviewUrl(null);
    return undefined;
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
            zIndex: (muiTheme) => muiTheme.zIndex.modal + 1,
            width: {
              xs: '100%',
              sm: 600,
              md: 800,
            },
            '& .MuiDrawer-paper': {
              width: {
                xs: '100%',
                sm: 600,
                md: 800,
              },
              boxSizing: 'border-box',
            },
          },
        }}
        BackdropProps={{
          onClick: onClose,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        }}
      >
        <Box sx={{ p: 3, height: '100%', overflow: 'auto', pb: { xs: 10, sm: 12 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">
              {t('adminBookings.drawer.title', { id: booking?.id })}
            </Typography>
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

          <Stack spacing={2.5}>
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
                  {stateLabel}
                </Label>
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    (booking?.paymentStatus === 'PENDING' && 'warning') ||
                    (booking?.paymentStatus === 'UNPAID' && 'error') ||
                    (booking?.paymentStatus === 'PAID' && 'success') ||
                    (booking?.paymentStatus?.startsWith('PAID_') && 'info') ||
                    'error'
                  }
                  sx={{ px: 2, py: 1 }}
                >
                  {paymentStatusLabel}
                </Label>
              </Stack>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" gutterBottom>
                      {t('adminBookings.table.student')}
                    </Typography>
                    {booking?.student?.cellphone &&
                      renderWhatsAppAction(
                        booking.student.cellphone,
                        `${booking.student.name} ${booking.student.lastname}`
                      )}
                  </Stack>
                  <Typography variant="body1">
                    {[booking?.student?.name, booking?.student?.lastname].filter(Boolean).join(' ') ||
                      emptyValue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminBookings.drawer.idLabel')}: {booking?.student?.id ?? emptyValue}
                  </Typography>
                  {booking?.student?.cellphone && (
                    <Typography variant="body2" color="text.secondary">
                      {t('adminBookings.drawer.phoneLabel')}: {booking.student.cellphone}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" gutterBottom>
                      {t('adminBookings.table.teacher')}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {booking?.teacher?.cellphone &&
                        renderWhatsAppAction(
                          booking.teacher.cellphone,
                          `${booking.teacher.name} ${booking.teacher.lastname}`
                        )}
                    </Stack>
                  </Stack>
                  <Typography variant="body1">
                    {[booking?.teacher?.name, booking?.teacher?.lastname].filter(Boolean).join(' ') ||
                      emptyValue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminBookings.drawer.idLabel')}: {booking?.teacher?.id ?? emptyValue}
                  </Typography>
                  {booking?.teacher?.cellphone && (
                    <Typography variant="body2" color="text.secondary">
                      {t('adminBookings.drawer.phoneLabel')}: {booking.teacher.cellphone}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('adminBookings.drawer.sectionTitle')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminBookings.table.resort')}
                  </Typography>
                  <Typography variant="body1">{resortLabel}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminBookings.drawer.classType')}
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
                    {bookingTypeLabel}
                  </Label>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminBookings.table.price')}
                  </Typography>
                  <Typography variant="body1" color="primary.main">
                    {formatPrice(booking?.price)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminBookings.drawer.paymentMethod')}
                  </Typography>
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={
                      (booking?.bookingPaymentMethod === 'CASH' && 'default') ||
                      (booking?.bookingPaymentMethod === 'TRANSFER' && 'info') ||
                      (booking?.bookingPaymentMethod === 'WIRE_TRANSFER' && 'info') ||
                      (booking?.bookingPaymentMethod === 'DEBIT_CARD' && 'secondary') ||
                      (booking?.bookingPaymentMethod === 'CREDIT_CARD' && 'primary') ||
                      'default'
                    }
                    sx={{ px: 2, py: 1 }}
                  >
                    {paymentMethodLabel}
                  </Label>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminBookings.table.capacity')}
                  </Typography>
                  <Typography variant="body1">
                    {t('adminBookings.card.adultsChildren', {
                      adults: booking?.adults ?? 0,
                      children: booking?.children ?? 0,
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminBookings.table.includes')}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {booking?.includesLaunch && (
                      <Chip size="medium" label={t('adminBookings.row.lunch')} color="primary" />
                    )}
                    {booking?.includesEquipments && (
                      <Chip
                        size="medium"
                        label={t('adminBookings.row.equipmentShort')}
                        color="primary"
                      />
                    )}
                    {!booking?.includesLaunch && !booking?.includesEquipments && (
                      <Typography variant="body1">{emptyValue}</Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <BookingRentalFulfillmentSection booking={booking} open={open} />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('adminBookings.drawer.comments')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('adminBookings.drawer.clientComment')}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {booking?.userComment || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {t('adminBookings.drawer.internalComment')}
                  </Typography>
                  <Typography variant="body1">{booking?.internalComment || '-'}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('adminBookings.drawer.invoiceSection')}
              </Typography>

              {uploadSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {t('adminBookings.drawer.invoiceUploadedSuccess')}
                </Alert>
              )}

              {booking?.teacherInvoiceUrl ? (
                <Card>
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Iconify
                        icon="eva:file-text-fill"
                        sx={{ color: 'primary.main', fontSize: 24 }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
                        <Typography variant="body1" gutterBottom>
                          {t('adminBookings.drawer.invoiceLoaded')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('adminBookings.drawer.invoiceLoadedDesc')}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:eye-fill" />}
                        onClick={() => window.open(booking.teacherInvoiceUrl, '_blank')}
                      >
                        {t('adminBookings.drawer.viewInvoice')}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <DrawerEmptyStateCard
                  icon="eva:file-text-outline"
                  message={t('adminBookings.drawer.invoiceMissing')}
                />
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('adminBookings.drawer.payoutSection')}
              </Typography>

              {payoutSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {t('adminBookings.drawer.payoutRegisteredSuccess')}
                </Alert>
              )}

              {booking?.payouts && booking.payouts.length > 0 ? (
                <Stack spacing={2}>
                  {booking.payouts.map((payout, index) => (
                    <Card key={payout.id || index}>
                      <CardContent>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Iconify
                            icon="eva:credit-card-fill"
                            sx={{ color: 'success.main', fontSize: 24 }}
                          />
                          <Box sx={{ flexGrow: 1, minWidth: 160 }}>
                            <Typography variant="body1" gutterBottom>
                              {t('adminBookings.drawer.payoutNumber', {
                                id: payout.id || index + 1,
                              })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t('adminBookings.drawer.transferredAmount', {
                                amount: formatPrice(payout.amount),
                              })}
                            </Typography>
                            {payout.transferDate && (
                              <Typography variant="body2" color="text.secondary">
                                {t('adminBookings.drawer.date', {
                                  date: formatDate(payout.transferDate),
                                })}
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
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {payout.invoiceUrl && (
                              <Button
                                variant="contained"
                                startIcon={<Iconify icon="eva:eye-fill" />}
                                onClick={() => window.open(payout.invoiceUrl, '_blank')}
                              >
                                {t('adminBookings.drawer.viewReceipt')}
                              </Button>
                            )}
                            <Button
                              variant="outlined"
                              startIcon={<Iconify icon="eva:edit-fill" />}
                              onClick={() => handlePayoutEditClick(payout)}
                            >
                              {t('adminBookings.drawer.edit')}
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
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Iconify
                        icon="eva:credit-card-fill"
                        sx={{ color: 'success.main', fontSize: 24 }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
                        <Typography variant="body1" gutterBottom>
                          {t('adminBookings.drawer.payoutSection')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('adminBookings.drawer.transferredAmount', {
                            amount: formatPrice(booking.teacherPayout.amount),
                          })}
                        </Typography>
                        {booking.teacherPayout.transferDate && (
                          <Typography variant="body2" color="text.secondary">
                            {t('adminBookings.drawer.date', {
                              date: formatDate(booking.teacherPayout.transferDate),
                            })}
                          </Typography>
                        )}
                      </Box>
                      {booking.teacherPayout.receiptUrl && (
                        <Button
                          variant="contained"
                          startIcon={<Iconify icon="eva:eye-fill" />}
                          onClick={() => window.open(booking.teacherPayout.receiptUrl, '_blank')}
                        >
                          {t('adminBookings.drawer.viewReceipt')}
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <DrawerEmptyStateCard
                  icon="eva:credit-card-outline"
                  message={t('adminBookings.drawer.payoutMissing')}
                  action={
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="eva:plus-fill" />}
                      onClick={handlePayoutModalOpen}
                      fullWidth={!isDesktop}
                    >
                      {t('adminBookings.drawer.registerPayout')}
                    </Button>
                  }
                />
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {t('adminBookings.drawer.calendarSection')}
              </Typography>

              {classSessions.length > 0 && (
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mb: 2 }}>
                  {classSessions.map((session) => (
                    <Chip
                      key={`${session.start}-${session.sessionIndex}`}
                      label={`${formatEventDate(session.start)} · ${formatEventTimeRange(session.start, session.end)}`}
                      clickable
                      color="primary"
                      variant="outlined"
                      onClick={() => handleClassEventOpen(session, session.sessionIndex)}
                    />
                  ))}
                </Stack>
              )}

              <Card>
                <CalendarStyle
                  sx={{
                    '& .fc .fc-event': { cursor: 'pointer' },
                  }}
                >
                  <CalendarToolbar
                    date={calendarDate}
                    view={calendarView}
                    onNextDate={handleCalendarDateNext}
                    onPrevDate={handleCalendarDatePrev}
                    onToday={handleCalendarToday}
                    onChangeView={handleCalendarChangeView}
                  />
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate={calendarDate}
                    headerToolbar={false}
                    locale={calendarLocale}
                    events={calendarEvents}
                    rerenderDelay={10}
                    dayMaxEventRows={3}
                    eventDisplay="block"
                    displayEventTime={false}
                    height="auto"
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={false}
                    weekends
                    editable={false}
                    selectable={false}
                    selectMirror
                    eventClick={handleCalendarEventClick}
                  />
                </CalendarStyle>
              </Card>
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

      <Dialog open={classEventDialogOpen} onClose={handleClassEventClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          {selectedClassEvent &&
            t('adminBookings.drawer.classEventDetailTitle', {
              index: (selectedClassEvent.sessionIndex ?? 0) + 1,
              total: classSessions.length,
            })}
        </DialogTitle>
        <DialogContent>
          {selectedClassEvent && (
            <Stack spacing={2} sx={{ pt: 0.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('adminBookings.drawer.classEventDate')}
                </Typography>
                <Typography variant="body1">{formatEventDate(selectedClassEvent.start)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('adminBookings.drawer.classEventTime')}
                </Typography>
                <Typography variant="body1">
                  {formatEventTimeRange(selectedClassEvent.start, selectedClassEvent.end)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('adminBookings.drawer.classEventDuration')}
                </Typography>
                <Typography variant="body1">
                  {formatEventDuration(selectedClassEvent.start, selectedClassEvent.end)}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('adminBookings.table.teacher')}
                </Typography>
                <Typography variant="body1">{teacherLabel}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('adminBookings.table.student')}
                </Typography>
                <Typography variant="body1">{studentLabel}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('adminBookings.table.resort')}
                </Typography>
                <Typography variant="body1">{resortLabel}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t('adminBookings.table.capacity')}
                </Typography>
                <Typography variant="body1">
                  {t('adminBookings.card.adultsChildren', {
                    adults: booking?.adults ?? 0,
                    children: booking?.children ?? 0,
                  })}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClassEventClose}>{t('adminBookings.deleteDialog.cancel')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={payoutModalOpen} onClose={handlePayoutModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:credit-card-fill" />
            <Typography variant="h6">{t('adminBookings.drawer.registerPayoutTitle')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label={t('adminBookings.drawer.amountLabel')}
              type="number"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText={t('adminBookings.drawer.amountHelper')}
            />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('adminBookings.drawer.transferProof')}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:upload-fill" />}
                onClick={() => payoutFileInputRef.current?.click()}
                disabled={uploadingPayout}
                fullWidth
              >
                {uploadingPayout
                  ? t('adminBookings.drawer.uploading')
                  : t('adminBookings.drawer.selectProof')}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {t('adminBookings.drawer.fileFormatsHint')}
              </Typography>

              {file && (
                <Box
                  sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                >
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
                    <IconButton size="small" onClick={() => setFile(null)} color="error">
                      <Iconify icon="eva:close-fill" />
                    </IconButton>
                  </Stack>

                  {file.type.startsWith('image/') && filePreviewUrl && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img
                        src={filePreviewUrl}
                        alt={t('adminBookings.drawer.previewAlt')}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          objectFit: 'contain',
                          borderRadius: '4px',
                        }}
                      />
                    </Box>
                  )}

                  {file.type === 'application/pdf' && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Iconify
                            icon="eva:file-text-fill"
                            sx={{ fontSize: 48, color: 'error.main' }}
                          />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {t('adminBookings.drawer.pdfPreviewUnavailable')}
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
            {t('adminBookings.deleteDialog.cancel')}
          </Button>
          <Button
            onClick={handlePayoutSubmit}
            variant="contained"
            disabled={!payoutAmount || uploadingPayout}
          >
            {uploadingPayout
              ? t('adminBookings.drawer.registering')
              : t('adminBookings.drawer.registerPayout')}
          </Button>
        </DialogActions>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: 'none' }}
        onChange={handleInvoiceUpload}
      />

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

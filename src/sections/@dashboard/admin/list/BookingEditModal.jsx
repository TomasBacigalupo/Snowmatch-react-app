import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  IconButton,
  Collapse,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { editAdminBooking, updateAdminBookingEventSchedule } from 'src/redux/slices/admin';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import Iconify from 'src/components/Iconify';
import {
  buildEventListForBookingPut,
  buildEventScheduleUpdates,
  calcTeacherHoursFromDateTimes,
  createEmptyDateTimeRow,
  eventListToDateTimes,
  LESSON_TIME_VALUES,
} from 'src/utils/adminBookingEvents';
import {
  getBookingRosterClients,
  isGroupLessonBooking,
} from 'src/utils/adminBookingParticipants';
import {
  calcSuggestedPayoutBreakdown,
  HOURLY_PAYOUT_CAP_ARS,
} from 'src/utils/teacherPayoutAmount';
import AdminAgencySelect from '../AdminAgencySelect';

const RESORT_OPTIONS = [
  {
    category: 'Argentina',
    resorts: [
      'Caviahue',
      'Cerro Bayo',
      'Cerro Castor',
      'Cerro Catedral',
      'Chapelco',
      'La Hoya',
      'Las Leñas',
      'Las Pendientes',
      'Perito Moreno',
      'Lago Hermoso',
      'Buenos Aires',
    ],
  },
  { category: 'Chile', resorts: ['Portillo'] },
];

const PAYMENT_STATUS_VALUES = ['PAID', 'PAID_10', 'PAID_20', 'PAID_30', 'PAID_40', 'PAID_50', 'UNPAID'];
const PAYMENT_METHOD_VALUES = ['CASH', 'TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD'];
const STATE_VALUES = ['PENDING', 'ACCEPTED', 'DECLINED'];
const TYPE_VALUES = ['ASSIGNED', 'REFERRED'];
const CLIENT_LEVEL_VALUES = ['NEVER_EVER', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

function resolveEditableClient(booking) {
  if (booking?.client?.id != null) return booking.client;
  const roster = getBookingRosterClients(booking);
  return roster[0] || null;
}

/** Positive entity id from form/API, or null when empty / invalid (avoids sending 0). */
function parseOptionalEntityId(raw) {
  if (raw == null || raw === '') return null;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
}

function formatArsAmount(value) {
  if (value == null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(value);
}

function PayoutBreakdownRow({ label, value, emphasize }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" color={emphasize ? 'text.primary' : 'text.secondary'}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={emphasize ? 600 : 400}>
        {value}
      </Typography>
    </Stack>
  );
}

PayoutBreakdownRow.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  emphasize: PropTypes.bool,
};

BookingEditModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  onSave: PropTypes.func,
};

export default function BookingEditModal({ open, onClose, booking, onSave }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [userCommentLength, setUserCommentLength] = useState(booking?.userComment?.length || 0);
  const [internalCommentLength, setInternalCommentLength] = useState(
    booking?.internalComment?.length || 0
  );
  const [dateTimes, setDateTimes] = useState(() => eventListToDateTimes(booking?.eventList));
  const [bookingType, setBookingType] = useState(booking?.type || 'ASSIGNED');
  const [isGroupLesson, setIsGroupLesson] = useState(() => isGroupLessonBooking(booking));
  const [clientLevel, setClientLevel] = useState(() => resolveEditableClient(booking)?.level || '');
  const [agencyId, setAgencyId] = useState(() => booking?.agencyId ?? booking?.agency?.id ?? null);
  const [currency, setCurrency] = useState(() => booking?.currency || 'ARS');
  const [price, setPrice] = useState(() => booking?.price ?? '');
  const [bookingPaymentMethod, setBookingPaymentMethod] = useState(
    () => booking?.bookingPaymentMethod || ''
  );
  const [suggestedTeacherPayoutAmount, setSuggestedTeacherPayoutAmount] = useState(
    () => booking?.suggestedTeacherPayoutAmount ?? ''
  );
  const [suggestedTeacherPayoutCurrency, setSuggestedTeacherPayoutCurrency] = useState(
    () => booking?.suggestedTeacherPayoutCurrency || 'ARS'
  );
  const [payoutCalculatorOpen, setPayoutCalculatorOpen] = useState(false);
  const editableClient = resolveEditableClient(booking);

  const teacherHours = useMemo(() => calcTeacherHoursFromDateTimes(dateTimes), [dateTimes]);

  const payoutBreakdown = useMemo(
    () =>
      calcSuggestedPayoutBreakdown({
        price,
        currency,
        paymentMethod: bookingPaymentMethod,
        hours: teacherHours,
      }),
    [price, currency, bookingPaymentMethod, teacherHours]
  );

  const handleApplySuggestedPayout = () => {
    setSuggestedTeacherPayoutAmount(payoutBreakdown.suggested);
    setSuggestedTeacherPayoutCurrency('ARS');
  };

  useEffect(() => {
    if (open && booking) {
      setDateTimes(eventListToDateTimes(booking.eventList));
      setBookingType(booking.type || 'ASSIGNED');
      setUserCommentLength(booking.userComment?.length || 0);
      setInternalCommentLength(booking.internalComment?.length || 0);
      setIsGroupLesson(isGroupLessonBooking(booking));
      setClientLevel(resolveEditableClient(booking)?.level || '');
      setAgencyId(booking?.agencyId ?? booking?.agency?.id ?? null);
      setCurrency(booking?.currency || 'ARS');
      setPrice(booking?.price ?? '');
      setBookingPaymentMethod(booking?.bookingPaymentMethod || '');
      setSuggestedTeacherPayoutAmount(booking?.suggestedTeacherPayoutAmount ?? '');
      setSuggestedTeacherPayoutCurrency(booking?.suggestedTeacherPayoutCurrency || 'ARS');
      setPayoutCalculatorOpen(false);
    }
  }, [open, booking]);

  const patchDateTime = (index, fields) => {
    setDateTimes((prev) => prev.map((row, i) => (i === index ? { ...row, ...fields } : row)));
  };

  const handleAddDateTime = () => {
    setDateTimes((prev) => [...prev, createEmptyDateTimeRow()]);
  };

  const handleRemoveDateTime = (index) => {
    setDateTimes((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [createEmptyDateTimeRow()];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validDateTimes = dateTimes.filter((row) => row.date);
    if (validDateTimes.length === 0) {
      enqueueSnackbar(t('adminBookings.editModal.datesRequired'), { variant: 'warning' });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const type = formData.get('type');
    const teacherId =
      parseOptionalEntityId(formData.get('teacherId')) || booking?.teacher?.id || null;
    const studentId = parseOptionalEntityId(formData.get('studentId'));
    const clientId =
      parseOptionalEntityId(formData.get('clientId')) || editableClient?.id || null;
    const resort = formData.get('resort') || booking?.resort || '';
    const resolvedGroupLessonResort = isGroupLesson
      ? booking?.groupLessonResort || resort || booking?.resort || null
      : null;
    const scheduleUpdates = buildEventScheduleUpdates(dateTimes);
    const eventList = buildEventListForBookingPut(dateTimes, type, booking?.eventList);
    const updatedBooking = {
      id: booking.id,
      userComment: formData.get('userComment'),
      internalComment: formData.get('internalComment'),
      paymentStatus: formData.get('paymentStatus'),
      bookingPaymentMethod,
      adults: parseInt(formData.get('adults'), 10) || 0,
      children: parseInt(formData.get('children'), 10) || 0,
      price: parseFloat(price) || 0,
      includesLaunch: formData.get('includesLaunch') === 'on',
      includesEquipments: formData.get('includesEquipments') === 'on',
      showPriceToTeacher: formData.get('showPriceToTeacher') === 'on',
      invoiceCreated: formData.get('invoiceCreated') === 'on',
      needTeacherInvoice: formData.get('needTeacherInvoice') === 'on',
      state: formData.get('state'),
      type,
      resort,
      ...(teacherId != null ? { teacherId } : {}),
      // Omit empty studentId — client-only bookings must not send "" / 0
      ...(studentId != null ? { studentId } : {}),
      ...(clientId != null
        ? {
            clientId,
            ...(clientLevel ? { clientLevel } : {}),
          }
        : {}),
      eventList,
      groupLesson: isGroupLesson,
      ...(isGroupLesson
        ? {
            ...(resolvedGroupLessonResort ? { groupLessonResort: resolvedGroupLessonResort } : {}),
            ...(booking?.groupLessonConfigId != null
              ? { groupLessonConfigId: booking.groupLessonConfigId }
              : {}),
          }
        : {}),
      agencyId: agencyId ?? 0,
      currency: currency || booking?.currency || 'ARS',
      suggestedTeacherPayoutAmount: (() => {
        if (suggestedTeacherPayoutAmount === '' || suggestedTeacherPayoutAmount == null) return null;
        const parsed = Number(suggestedTeacherPayoutAmount);
        return Number.isNaN(parsed) ? null : parsed;
      })(),
      suggestedTeacherPayoutCurrency: suggestedTeacherPayoutCurrency || null,
    };

    try {
      const saved = await dispatch(editAdminBooking(booking.id, updatedBooking));

      if (teacherId && scheduleUpdates.length > 0) {
        await Promise.all(
          scheduleUpdates.map((schedule) =>
            dispatch(
              updateAdminBookingEventSchedule(
                teacherId,
                schedule.id,
                {
                  start: schedule.start,
                  end: schedule.end,
                  allDay: schedule.allDay,
                },
                { studentId }
              )
            )
          )
        );
      }

      enqueueSnackbar(t('adminBookings.editModal.updateSuccess'), { variant: 'success' });
      const nextEventList = (scheduleUpdates.length > 0
        ? scheduleUpdates.map((schedule) => {
            const existing = booking?.eventList?.find((event) => event.id === schedule.id) || {};
            return {
              ...existing,
              start: schedule.start,
              end: schedule.end,
              allDay: schedule.allDay,
              lessonTime: schedule.lessonTime,
            };
          })
        : booking?.eventList || []
      ).map((event) => {
        if (!clientId || !clientLevel || !Array.isArray(event?.clients)) return event;
        return {
          ...event,
          clients: event.clients.map((c) =>
            c?.id === clientId ? { ...c, level: clientLevel } : c
          ),
        };
      });

      onSave({
        ...booking,
        ...updatedBooking,
        ...(saved && typeof saved === 'object' ? saved : {}),
        groupLessonResort: isGroupLesson
          ? saved?.groupLessonResort || resolvedGroupLessonResort
          : null,
        groupLessonConfigId: isGroupLesson
          ? saved?.groupLessonConfigId ?? booking?.groupLessonConfigId ?? null
          : null,
        eventList: nextEventList,
        includesEquipments: updatedBooking.includesEquipments,
        includesLaunch: updatedBooking.includesLaunch,
        ...(clientId != null
          ? {
              client: {
                ...(editableClient || {}),
                id: clientId,
                ...(clientLevel ? { level: clientLevel } : {}),
              },
            }
          : {}),
      });
    } catch {
      enqueueSnackbar(t('adminBookings.editModal.updateError'), { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('adminBookings.editModal.title', { id: booking?.id })}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                {t('adminBookings.editModal.datesSection')}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('adminBookings.editModal.currency')}</InputLabel>
                <Select
                  name="currency"
                  label={t('adminBookings.editModal.currency')}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem value="ARS">ARS</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="BRL">BRL</MenuItem>
                </Select>
              </FormControl>
              <Stack spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {dateTimes.map((dateTime, index) => (
                    <Stack
                      key={dateTime.id ?? `new-${index}`}
                      spacing={2}
                      direction={{ xs: 'column', md: 'row' }}
                      alignItems={{ xs: 'stretch', md: 'center' }}
                    >
                      <DatePicker
                        label={t('adminBookings.editModal.dateLabel', { index: index + 1 })}
                        value={dateTime.date ? parseISO(dateTime.date) : null}
                        onChange={(newValue) => {
                          patchDateTime(index, {
                            date: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                          });
                        }}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                      <FormControl fullWidth>
                        <InputLabel id={`edit-booking-time-${index}`}>
                          {t('adminBookings.editModal.timeLabel')}
                        </InputLabel>
                        <Select
                          labelId={`edit-booking-time-${index}`}
                          label={t('adminBookings.editModal.timeLabel')}
                          value={dateTime.time}
                          onChange={(e) => patchDateTime(index, { time: e.target.value })}
                        >
                          {LESSON_TIME_VALUES.map((value) => (
                            <MenuItem key={value} value={value}>
                              {t(`adminBookings.editModal.lessonTimeOptions.${value}`)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveDateTime(index)}
                        aria-label={t('adminBookings.editModal.removeDate')}
                        sx={{ alignSelf: { xs: 'flex-end', md: 'center' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </LocalizationProvider>
              </Stack>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddDateTime}
                sx={{ mt: 1.5 }}
                size="small"
              >
                {t('adminBookings.editModal.addDate')}
              </Button>
            </Box>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.clientComment')}
                name="userComment"
                defaultValue={booking?.userComment}
                multiline
                rows={2}
                inputProps={{ maxLength: 255 }}
                onChange={(e) => setUserCommentLength(e.target.value.length)}
                helperText={t('adminBookings.editModal.charCount', { count: userCommentLength })}
              />

              <TextField
                fullWidth
                label={t('adminBookings.editModal.internalComment')}
                name="internalComment"
                defaultValue={booking?.internalComment}
                multiline
                rows={2}
                inputProps={{ maxLength: 255 }}
                onChange={(e) => setInternalCommentLength(e.target.value.length)}
                helperText={t('adminBookings.editModal.charCount', { count: internalCommentLength })}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.studentId')}
                name="studentId"
                defaultValue={booking?.student?.id ?? ''}
                helperText={t('adminBookings.editModal.studentIdOptionalHint')}
              />

              <TextField
                fullWidth
                label={t('adminBookings.editModal.clientId')}
                name="clientId"
                defaultValue={editableClient?.id ?? ''}
                helperText={t('adminBookings.editModal.clientIdHint')}
              />

              <TextField
                fullWidth
                label={t('adminBookings.editModal.teacherId')}
                name="teacherId"
                defaultValue={booking?.teacher?.id ?? ''}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.paymentStatus')}</InputLabel>
                <Select
                  name="paymentStatus"
                  label={t('adminBookings.editModal.paymentStatus')}
                  defaultValue={booking?.paymentStatus || 'UNPAID'}
                >
                  {PAYMENT_STATUS_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.paymentStatusOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.paymentMethod')}</InputLabel>
                <Select
                  name="bookingPaymentMethod"
                  label={t('adminBookings.editModal.paymentMethod')}
                  value={bookingPaymentMethod}
                  onChange={(e) => setBookingPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHOD_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.paymentMethodOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.state')}</InputLabel>
                <Select
                  name="state"
                  label={t('adminBookings.editModal.state')}
                  defaultValue={booking?.state || 'PENDING'}
                >
                  {STATE_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.stateOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.bookingType')}</InputLabel>
                <Select
                  name="type"
                  label={t('adminBookings.editModal.bookingType')}
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                >
                  {TYPE_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.typeOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.resort')}</InputLabel>
                <Select
                  name="resort"
                  label={t('adminBookings.editModal.resort')}
                  defaultValue={booking?.resort || ''}
                >
                  {RESORT_OPTIONS.map((country) => [
                    <MenuItem
                      key={`${country.category}-header`}
                      disabled
                      sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}
                    >
                      {country.category}
                    </MenuItem>,
                    ...country.resorts.sort().map((resort) => (
                      <MenuItem key={resort} value={resort} sx={{ pl: 3 }}>
                        {resort}
                      </MenuItem>
                    )),
                  ]).flat()}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isGroupLesson}
                    onChange={(e) => setIsGroupLesson(e.target.checked)}
                  />
                }
                label={t('adminBookings.editModal.groupLesson')}
              />

              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.clientLevel')}</InputLabel>
                <Select
                  label={t('adminBookings.editModal.clientLevel')}
                  value={clientLevel || ''}
                  onChange={(e) => setClientLevel(e.target.value)}
                >
                  <MenuItem value="">
                    <em>{t('adminBookings.editModal.clientLevelNone')}</em>
                  </MenuItem>
                  {CLIENT_LEVEL_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.clientLevelOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <AdminAgencySelect value={agencyId} onChange={setAgencyId} />

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.adultsCount')}
                name="adults"
                type="number"
                defaultValue={booking?.adults}
                InputProps={{ inputProps: { min: 0 } }}
              />

              <TextField
                fullWidth
                label={t('adminBookings.editModal.childrenCount')}
                name="children"
                type="number"
                defaultValue={booking?.children}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.price')}
                name="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  inputProps: {
                    min: 0,
                    step: 0.01,
                    style: { textAlign: 'right' },
                  },
                }}
                sx={{
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                }}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.suggestedTeacherPayoutAmount')}
                name="suggestedTeacherPayoutAmount"
                type="number"
                value={suggestedTeacherPayoutAmount}
                onChange={(e) => setSuggestedTeacherPayoutAmount(e.target.value)}
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: 0.01,
                    style: { textAlign: 'right' },
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.suggestedTeacherPayoutCurrency')}</InputLabel>
                <Select
                  name="suggestedTeacherPayoutCurrency"
                  label={t('adminBookings.editModal.suggestedTeacherPayoutCurrency')}
                  value={suggestedTeacherPayoutCurrency}
                  onChange={(e) => setSuggestedTeacherPayoutCurrency(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>{t('adminBookings.editModal.suggestedTeacherPayoutCurrencyUnset')}</em>
                  </MenuItem>
                  <MenuItem value="ARS">ARS</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="BRL">BRL</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box>
              <Button
                color="inherit"
                size="small"
                onClick={() => setPayoutCalculatorOpen((open) => !open)}
                endIcon={
                  <Iconify
                    icon={payoutCalculatorOpen ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
                    sx={{ width: 20, height: 20 }}
                  />
                }
                sx={{ px: 0, typography: 'body2' }}
              >
                {t('adminBookings.editModal.suggestedPayoutCalculator.toggle')}
              </Button>
              <Collapse in={payoutCalculatorOpen}>
                <Stack
                  spacing={1}
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <PayoutBreakdownRow
                    label={t('adminBookings.editModal.suggestedPayoutCalculator.teacherHours')}
                    value={t('adminBookings.editModal.suggestedPayoutCalculator.hoursValue', {
                      hours: payoutBreakdown.hours,
                    })}
                  />

                  {payoutBreakdown.currencyConverted && (
                    <PayoutBreakdownRow
                      label={t('adminBookings.editModal.suggestedPayoutCalculator.priceInArs', {
                        rate: payoutBreakdown.usdToArsRate,
                      })}
                      value={formatArsAmount(payoutBreakdown.priceArs)}
                    />
                  )}

                  {!payoutBreakdown.currencyConverted && (
                    <PayoutBreakdownRow
                      label={t('adminBookings.editModal.suggestedPayoutCalculator.priceInArsLabel')}
                      value={formatArsAmount(payoutBreakdown.priceArs)}
                    />
                  )}

                  {payoutBreakdown.isCash ? (
                    <PayoutBreakdownRow
                      label={t('adminBookings.editModal.suggestedPayoutCalculator.cashShare')}
                      value={formatArsAmount(payoutBreakdown.uncappedSuggested)}
                    />
                  ) : (
                    <>
                      <PayoutBreakdownRow
                        label={t('adminBookings.editModal.suggestedPayoutCalculator.netOfIva')}
                        value={formatArsAmount(payoutBreakdown.netOfIva)}
                      />
                      <PayoutBreakdownRow
                        label={t('adminBookings.editModal.suggestedPayoutCalculator.ingresosBrutos')}
                        value={formatArsAmount(payoutBreakdown.ingresosBrutos)}
                      />
                      <PayoutBreakdownRow
                        label={t('adminBookings.editModal.suggestedPayoutCalculator.nonCashShare')}
                        value={formatArsAmount(payoutBreakdown.uncappedSuggested)}
                      />
                    </>
                  )}

                  {payoutBreakdown.hours > 0 && (
                    <PayoutBreakdownRow
                      label={t('adminBookings.editModal.suggestedPayoutCalculator.hourlyCap', {
                        cap: HOURLY_PAYOUT_CAP_ARS,
                      })}
                      value={formatArsAmount(payoutBreakdown.cap)}
                    />
                  )}

                  <PayoutBreakdownRow
                    label={t('adminBookings.editModal.suggestedPayoutCalculator.suggested')}
                    value={formatArsAmount(payoutBreakdown.suggested)}
                    emphasize
                  />

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleApplySuggestedPayout}
                    disabled={!payoutBreakdown.suggested}
                    sx={{ alignSelf: 'flex-start', mt: 0.5 }}
                  >
                    {t('adminBookings.editModal.suggestedPayoutCalculator.apply')}
                  </Button>
                </Stack>
              </Collapse>
            </Box>

            <Stack
              spacing={2}
              direction={{ xs: 'column', sm: 'row' }}
              flexWrap="wrap"
              sx={{ width: '100%', alignItems: { xs: 'flex-start', sm: 'center' } }}
            >
              <FormControlLabel
                control={
                  <Switch
                    name="includesEquipments"
                    defaultChecked={booking?.includesEquipments}
                  />
                }
                label={t('adminBookings.editModal.includesEquipment')}
              />

              <FormControlLabel
                control={
                  <Switch name="includesLaunch" defaultChecked={booking?.includesLaunch} />
                }
                label={t('adminBookings.editModal.includesLunch')}
              />

              <FormControlLabel
                control={
                  <Switch
                    name="showPriceToTeacher"
                    defaultChecked={booking?.showPriceToTeacher ?? false}
                  />
                }
                label={t('adminBookings.editModal.showPriceToTeacher')}
              />

              <FormControlLabel
                control={
                  <Switch
                    name="invoiceCreated"
                    defaultChecked={booking?.invoiceCreated ?? false}
                  />
                }
                label={t('adminBookings.editModal.invoiceCreated')}
              />

              <FormControlLabel
                control={
                  <Switch
                    name="needTeacherInvoice"
                    defaultChecked={booking?.needTeacherInvoice ?? false}
                  />
                }
                label={t('adminBookings.editModal.needTeacherInvoice')}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('adminBookings.deleteDialog.cancel')}</Button>
          <Button type="submit" variant="contained">
            {t('adminBookings.editModal.saveChanges')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

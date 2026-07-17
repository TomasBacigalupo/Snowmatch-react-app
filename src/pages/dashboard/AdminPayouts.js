import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
} from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LoadingButton } from '@mui/lab';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../routes/paths';
import BookingDetailsDrawer from '../../sections/@dashboard/admin/list/BookingDetailsDrawer';
import {
  createMultiBookingPayout,
  fetchAdminBookingById,
  getAllPayouts,
  getBookings,
  getTeachers,
} from '../../redux/slices/admin';
import {
  calcBookingPayWithHourPrice,
  calcBookingTeacherHours,
  calcTeacherPayTotalWithHourPrice,
  calcUniqueHoursByType,
  calcUniqueTeacherHours,
  hasHourPricesConfigured,
} from '../../utils/teacherPayoutAmount';
import { fDate } from '../../utils/formatTime';

const ALLOWED_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const PAYOUT_STATUS_FILTERS = [
  { value: 'all', labelKey: 'adminPayouts.payoutFilterAll' },
  { value: 'done', labelKey: 'adminPayouts.payoutFilterDone' },
  { value: 'undone', labelKey: 'adminPayouts.payoutFilterUndone' },
];

const LEVEL_HOUR_PRICE_PRESETS = [
  { level: 0, assigned: 19000, referred: 25500 },
  { level: 1, assigned: 28000, referred: 34500 },
  { level: 2, assigned: 38000, referred: 44500 },
  { level: '3+', assigned: 40000, referred: 44500 },
];

function getDefaultMonthRange() {
  const now = new Date();
  return [
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  ];
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getBookingLessonDate(booking) {
  const firstEvent = booking?.eventList?.[0];
  if (!firstEvent?.start) {
    return null;
  }
  const date = new Date(firstEvent.start);
  return Number.isNaN(date.getTime()) ? null : date;
}

function bookingInDateRange(booking, rangeStart, rangeEnd) {
  const lessonDate = getBookingLessonDate(booking);
  if (!lessonDate) {
    return false;
  }
  if (rangeStart && lessonDate < startOfDay(rangeStart)) {
    return false;
  }
  if (rangeEnd && lessonDate > endOfDay(rangeEnd)) {
    return false;
  }
  return true;
}

function formatArs(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount || 0);
}

function getBookingDateLabel(booking) {
  const firstEvent = booking?.eventList?.[0];
  if (!firstEvent?.start) {
    return '—';
  }
  return fDate(firstEvent.start);
}

function bookingIdsWithPayout(payouts) {
  const ids = new Set();
  (payouts || []).forEach((payout) => {
    (payout.bookings || []).forEach((booking) => {
      if (booking?.id != null) {
        ids.add(booking.id);
      }
    });
  });
  return ids;
}

export default function AdminPayouts() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { teachers, bookings, payouts, isLoadingBookings, isLoading } = useSelector(
    (state) => state.admin
  );

  const fileInputRef = useRef(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [assignedHourPrice, setAssignedHourPrice] = useState('');
  const [referredHourPrice, setReferredHourPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerBooking, setDrawerBooking] = useState(null);
  const [loadingDrawerBooking, setLoadingDrawerBooking] = useState(false);
  const [dateRange, setDateRange] = useState(() => getDefaultMonthRange());
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('all');

  const paidBookingIds = useMemo(() => bookingIdsWithPayout(payouts), [payouts]);

  const teacherBookings = useMemo(() => {
    if (!selectedTeacher?.id) {
      return [];
    }
    return (bookings || []).filter((booking) => booking.teacher?.id === selectedTeacher.id);
  }, [bookings, selectedTeacher]);

  const filteredTeacherBookings = useMemo(() => {
    const [rangeStart, rangeEnd] = dateRange || [];

    return teacherBookings.filter((booking) => {
      if (!bookingInDateRange(booking, rangeStart, rangeEnd)) {
        return false;
      }

      const hasPayout = paidBookingIds.has(booking.id);
      if (payoutStatusFilter === 'done') {
        return hasPayout;
      }
      if (payoutStatusFilter === 'undone') {
        return !hasPayout;
      }
      return true;
    });
  }, [teacherBookings, dateRange, payoutStatusFilter, paidBookingIds]);

  const selectedBookings = useMemo(
    () => filteredTeacherBookings.filter((booking) => selectedBookingIds.includes(booking.id)),
    [filteredTeacherBookings, selectedBookingIds]
  );

  const hourPrices = useMemo(
    () => ({ assigned: assignedHourPrice, referred: referredHourPrice }),
    [assignedHourPrice, referredHourPrice]
  );

  const totalToPay = useMemo(
    () => calcTeacherPayTotalWithHourPrice(selectedBookings, hourPrices),
    [selectedBookings, hourPrices]
  );

  const uniqueSelectedHours = useMemo(
    () => calcUniqueTeacherHours(selectedBookings),
    [selectedBookings]
  );

  const uniqueHoursByType = useMemo(
    () => calcUniqueHoursByType(selectedBookings),
    [selectedBookings]
  );

  const loadPayouts = useCallback(() => {
    dispatch(getAllPayouts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTeachers(0, 'TEACHER', '', 0));
    loadPayouts();
  }, [dispatch, loadPayouts]);

  const handleTeacherChange = (_, teacher) => {
    setSelectedTeacher(teacher);
    setSelectedBookingIds([]);
    setAssignedHourPrice('');
    setReferredHourPrice('');
    setAmount('');
    setNote('');
    setFile(null);
    setDrawerOpen(false);
    setDrawerBooking(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (teacher?.id) {
      dispatch(getBookings(teacher.id));
    }
  };

  const toggleBooking = (bookingId, event) => {
    event.stopPropagation();
    setSelectedBookingIds((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const toggleAll = (event) => {
    event.stopPropagation();
    if (selectedBookingIds.length === filteredTeacherBookings.length) {
      setSelectedBookingIds([]);
      return;
    }
    setSelectedBookingIds(filteredTeacherBookings.map((booking) => booking.id));
  };

  const handleClearFilters = () => {
    setDateRange(getDefaultMonthRange());
    setPayoutStatusFilter('all');
    setSelectedBookingIds([]);
  };

  const handleBookingRowClick = async (booking) => {
    if (loadingDrawerBooking) {
      return;
    }
    setLoadingDrawerBooking(true);
    try {
      const fullBooking = await dispatch(fetchAdminBookingById(booking.id));
      setDrawerBooking(fullBooking);
      setDrawerOpen(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || t('adminPayouts.bookingLoadError'),
        severity: 'error',
      });
    } finally {
      setLoadingDrawerBooking(false);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDrawerBooking(null);
  };

  const refreshBookings = () => {
    if (selectedTeacher?.id) {
      dispatch(getBookings(selectedTeacher.id));
    }
    loadPayouts();
  };

  const handleFileChange = (event) => {
    const uploadFile = event.target.files?.[0];
    if (!uploadFile) {
      setFile(null);
      return;
    }
    if (!ALLOWED_RECEIPT_TYPES.includes(uploadFile.type)) {
      setSnackbar({
        open: true,
        message: t('adminPayouts.invalidFileType'),
        severity: 'error',
      });
      event.target.value = '';
      return;
    }
    setFile(uploadFile);
  };

  const handleSubmit = async () => {
    if (!selectedTeacher?.id) {
      setSnackbar({ open: true, message: t('adminPayouts.selectTeacher'), severity: 'warning' });
      return;
    }
    if (!selectedBookingIds.length) {
      setSnackbar({ open: true, message: t('adminPayouts.selectBookings'), severity: 'warning' });
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setSnackbar({ open: true, message: t('adminPayouts.invalidAmount'), severity: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        createMultiBookingPayout({
          teacherId: selectedTeacher.id,
          bookingIds: selectedBookingIds,
          amount: parsedAmount,
          note: note.trim() || null,
          file,
        })
      );

      setSnackbar({ open: true, message: t('adminPayouts.success'), severity: 'success' });
      setSelectedBookingIds([]);
      setAmount('');
      setNote('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refreshBookings();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || t('adminPayouts.error'),
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hourPricesConfigured = hasHourPricesConfigured(hourPrices);

  return (
    <Page title={t('adminPayouts.title')}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={t('adminPayouts.title')}
          links={[
            { name: t('adminPayouts.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('adminPayouts.title') },
          ]}
        />

        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Autocomplete
                options={(teachers || []).filter((teacher) => teacher?.id)}
                value={selectedTeacher}
                onChange={handleTeacherChange}
                onInputChange={(_, newInputValue) => {
                  if (newInputValue.length >= 2 || newInputValue.length === 0) {
                    dispatch(getTeachers(0, 'TEACHER', newInputValue, 0));
                  }
                }}
                getOptionLabel={(option) =>
                  `${option?.name || ''} ${option?.lastname || ''}`.trim() || `#${option?.id}`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label={t('adminPayouts.teacherLabel')} />
                )}
              />

              {selectedTeacher && (
                <>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ md: 'flex-start' }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateRangePicker
                        localeText={{
                          start: t('adminPayouts.startDate'),
                          end: t('adminPayouts.endDate'),
                        }}
                        value={dateRange}
                        onChange={(newValue) => setDateRange(newValue)}
                        slotProps={{
                          textField: {
                            size: 'small',
                          },
                        }}
                        sx={{ flex: 1, minWidth: 280 }}
                      />
                    </LocalizationProvider>

                    <TextField
                      select
                      label={t('adminPayouts.payoutFilterLabel')}
                      value={payoutStatusFilter}
                      onChange={(e) => setPayoutStatusFilter(e.target.value)}
                      size="small"
                      sx={{ minWidth: 200 }}
                    >
                      {PAYOUT_STATUS_FILTERS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Button variant="outlined" onClick={handleClearFilters} sx={{ mt: { xs: 0, md: 0.5 } }}>
                      {t('adminPayouts.clearFilters')}
                    </Button>
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('adminPayouts.levelPricePresets')}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {LEVEL_HOUR_PRICE_PRESETS.map((preset) => {
                        const selected =
                          String(assignedHourPrice) === String(preset.assigned) &&
                          String(referredHourPrice) === String(preset.referred);
                        return (
                          <Chip
                            key={String(preset.level)}
                            clickable
                            color={selected ? 'primary' : 'default'}
                            variant={selected ? 'filled' : 'outlined'}
                            label={t('adminPayouts.levelPricePresetChip', {
                              level: preset.level,
                              assigned: formatArs(preset.assigned),
                              referred: formatArs(preset.referred),
                            })}
                            onClick={() => {
                              setAssignedHourPrice(String(preset.assigned));
                              setReferredHourPrice(String(preset.referred));
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label={t('adminPayouts.assignedHourPriceLabel')}
                      type="number"
                      value={assignedHourPrice}
                      onChange={(e) => setAssignedHourPrice(e.target.value)}
                      fullWidth
                      inputProps={{ min: 0, step: '0.01' }}
                    />
                    <TextField
                      label={t('adminPayouts.referredHourPriceLabel')}
                      type="number"
                      value={referredHourPrice}
                      onChange={(e) => setReferredHourPrice(e.target.value)}
                      fullWidth
                      inputProps={{ min: 0, step: '0.01' }}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {t('adminPayouts.hourPriceHelper')}
                  </Typography>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={
                                selectedBookingIds.length > 0 &&
                                selectedBookingIds.length < filteredTeacherBookings.length
                              }
                              checked={
                                filteredTeacherBookings.length > 0 &&
                                selectedBookingIds.length === filteredTeacherBookings.length
                              }
                              onChange={toggleAll}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell>{t('adminPayouts.colId')}</TableCell>
                          <TableCell>{t('adminPayouts.colDate')}</TableCell>
                          <TableCell>{t('adminPayouts.colType')}</TableCell>
                          <TableCell>{t('adminPayouts.colResort')}</TableCell>
                          <TableCell align="right">{t('adminPayouts.colPrice')}</TableCell>
                          <TableCell align="right">{t('adminPayouts.colHours')}</TableCell>
                          <TableCell align="right">{t('adminPayouts.colOwed')}</TableCell>
                          <TableCell>{t('adminPayouts.colStatus')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isLoadingBookings ? (
                          <TableRow>
                            <TableCell colSpan={9}>
                              <Typography variant="body2" color="text.secondary">
                                {t('adminPayouts.loadingBookings')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : teacherBookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9}>
                              <Typography variant="body2" color="text.secondary">
                                {t('adminPayouts.noBookings')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : filteredTeacherBookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9}>
                              <Typography variant="body2" color="text.secondary">
                                {t('adminPayouts.noBookingsFiltered')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTeacherBookings.map((booking) => {
                            const hasPayout = paidBookingIds.has(booking.id);
                            const hours = calcBookingTeacherHours(booking);
                            const owed = calcBookingPayWithHourPrice(booking, hourPrices);
                            return (
                              <TableRow
                                key={booking.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => handleBookingRowClick(booking)}
                              >
                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    checked={selectedBookingIds.includes(booking.id)}
                                    onChange={(e) => toggleBooking(booking.id, e)}
                                  />
                                </TableCell>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>{getBookingDateLabel(booking)}</TableCell>
                                <TableCell>{booking.type || '—'}</TableCell>
                                <TableCell>{booking.resort || '—'}</TableCell>
                                <TableCell align="right">{formatArs(booking.price)}</TableCell>
                                <TableCell align="right">{hours ? `${Math.round(hours)}h` : '—'}</TableCell>
                                <TableCell align="right">
                                  {hourPricesConfigured ? formatArs(owed) : '—'}
                                </TableCell>
                                <TableCell>
                                  {hasPayout
                                    ? t('adminPayouts.statusPaid')
                                    : t('adminPayouts.statusPending')}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Typography variant="subtitle1">
                      {t('adminPayouts.totalToPay')}:{' '}
                      {hourPricesConfigured ? formatArs(totalToPay) : '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('adminPayouts.selectedCount', { count: selectedBookings.length })}
                      {' · '}
                      {t('adminPayouts.uniqueHours', {
                        hours: Math.round(uniqueSelectedHours),
                      })}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {t('adminPayouts.hoursSummaryTitle')}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Typography variant="body2">
                        {t('adminPayouts.assignedHoursSummary', {
                          hours: Math.round(uniqueHoursByType.assigned),
                        })}
                      </Typography>
                      <Typography variant="body2">
                        {t('adminPayouts.referredHoursSummary', {
                          hours: Math.round(uniqueHoursByType.referred),
                        })}
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label={t('adminPayouts.amountLabel')}
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      fullWidth
                      inputProps={{ min: 0, step: '0.01' }}
                    />
                    <TextField
                      label={t('adminPayouts.noteLabel')}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      fullWidth
                      multiline
                      minRows={1}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outlined" component="label">
                      {t('adminPayouts.uploadReceipt')}
                      <input
                        ref={fileInputRef}
                        hidden
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                      />
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      {file ? file.name : t('adminPayouts.receiptOptional')}
                    </Typography>
                  </Stack>

                  <LoadingButton
                    variant="contained"
                    loading={submitting || isLoading}
                    onClick={handleSubmit}
                    disabled={!selectedBookingIds.length}
                  >
                    {t('adminPayouts.submit')}
                  </LoadingButton>
                </>
              )}
            </Stack>
          </Card>
        </Stack>

        {loadingDrawerBooking && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: (theme) => theme.zIndex.drawer + 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.2)',
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {drawerOpen && drawerBooking && (
          <BookingDetailsDrawer
            open={drawerOpen}
            onClose={handleDrawerClose}
            booking={drawerBooking}
            refreshBookings={refreshBookings}
            onBookingUpdated={setDrawerBooking}
          />
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

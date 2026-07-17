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
  Container,
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
import { LoadingButton } from '@mui/lab';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../routes/paths';
import {
  createMultiBookingPayout,
  getAllPayouts,
  getBookings,
  getTeachers,
} from '../../redux/slices/admin';
import { calcBookingTeacherPay, calcTeacherPayTotal } from '../../utils/teacherPayoutAmount';
import { fDate } from '../../utils/formatTime';

const ALLOWED_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

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
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const paidBookingIds = useMemo(() => bookingIdsWithPayout(payouts), [payouts]);

  const teacherBookings = useMemo(() => {
    if (!selectedTeacher?.id) {
      return [];
    }
    return (bookings || []).filter((booking) => booking.teacher?.id === selectedTeacher.id);
  }, [bookings, selectedTeacher]);

  const selectedBookings = useMemo(
    () => teacherBookings.filter((booking) => selectedBookingIds.includes(booking.id)),
    [teacherBookings, selectedBookingIds]
  );

  const totalToPay = useMemo(
    () => calcTeacherPayTotal(selectedBookings),
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
    setAmount('');
    setNote('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (teacher?.id) {
      dispatch(getBookings(teacher.id));
    }
  };

  const toggleBooking = (bookingId) => {
    setSelectedBookingIds((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const toggleAll = () => {
    if (selectedBookingIds.length === teacherBookings.length) {
      setSelectedBookingIds([]);
      return;
    }
    setSelectedBookingIds(teacherBookings.map((booking) => booking.id));
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
      loadPayouts();
      dispatch(getBookings(selectedTeacher.id));
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
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={
                                selectedBookingIds.length > 0 &&
                                selectedBookingIds.length < teacherBookings.length
                              }
                              checked={
                                teacherBookings.length > 0 &&
                                selectedBookingIds.length === teacherBookings.length
                              }
                              onChange={toggleAll}
                            />
                          </TableCell>
                          <TableCell>{t('adminPayouts.colId')}</TableCell>
                          <TableCell>{t('adminPayouts.colDate')}</TableCell>
                          <TableCell>{t('adminPayouts.colType')}</TableCell>
                          <TableCell>{t('adminPayouts.colResort')}</TableCell>
                          <TableCell align="right">{t('adminPayouts.colPrice')}</TableCell>
                          <TableCell align="right">{t('adminPayouts.colOwed')}</TableCell>
                          <TableCell>{t('adminPayouts.colStatus')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isLoadingBookings ? (
                          <TableRow>
                            <TableCell colSpan={8}>
                              <Typography variant="body2" color="text.secondary">
                                {t('adminPayouts.loadingBookings')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : teacherBookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8}>
                              <Typography variant="body2" color="text.secondary">
                                {t('adminPayouts.noBookings')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          teacherBookings.map((booking) => {
                            const hasPayout = paidBookingIds.has(booking.id);
                            return (
                              <TableRow key={booking.id} hover>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={selectedBookingIds.includes(booking.id)}
                                    onChange={() => toggleBooking(booking.id)}
                                  />
                                </TableCell>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>{getBookingDateLabel(booking)}</TableCell>
                                <TableCell>{booking.type || '—'}</TableCell>
                                <TableCell>{booking.resort || '—'}</TableCell>
                                <TableCell align="right">{formatArs(booking.price)}</TableCell>
                                <TableCell align="right">
                                  {formatArs(calcBookingTeacherPay(booking))}
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
                      {t('adminPayouts.totalToPay')}: {formatArs(totalToPay)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('adminPayouts.selectedCount', { count: selectedBookings.length })}
                    </Typography>
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

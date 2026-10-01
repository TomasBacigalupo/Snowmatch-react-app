import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import {
  fetchClinicById,
  fetchClinicEnrollments,
  fetchMatchingInterests,
  enrollUserInClinic,
  updateClinicEnrollmentPayment,
  notifyMatchingInterests,
  clearCurrentClinic,
} from '../../redux/slices/clinics';
import { buildWhatsAppPhone } from '../../utils/whatsappPhone';

const PAYMENT_STATUS_VALUES = ['UNPAID', 'PAID_10', 'PAID_20', 'PAID_30', 'PAID_40', 'PAID_50', 'PAID'];
const PAYMENT_METHOD_VALUES = ['CASH', 'TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD'];

export default function AdminClinicDetail() {
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentClinic, enrollments, matchingInterests } = useSelector((state) => state.clinics);
  const [enrollUserId, setEnrollUserId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [notifyConfirmOpen, setNotifyConfirmOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [sendingKey, setSendingKey] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchClinicById(id));
      dispatch(fetchClinicEnrollments(id));
      dispatch(fetchMatchingInterests(id));
    }
    return () => {
      dispatch(clearCurrentClinic());
    };
  }, [dispatch, id]);

  const clinic = currentClinic;

  const handleEnroll = async (userId) => {
    try {
      await dispatch(enrollUserInClinic({ clinicId: Number(id), userId: Number(userId) })).unwrap();
      dispatch(fetchClinicEnrollments(id));
      dispatch(fetchMatchingInterests(id));
      setEnrollUserId('');
      setSnackbar({ open: true, message: 'User enrolled', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: String(e), severity: 'error' });
    }
  };

  const handlePaymentChange = async (enrollmentId, field, value) => {
    const enrollment = enrollments.find((e) => e.id === enrollmentId);
    if (!enrollment) return;
    try {
      await dispatch(
        updateClinicEnrollmentPayment({
          enrollmentId,
          paymentStatus: field === 'paymentStatus' ? value : enrollment.paymentStatus,
          paymentMethod: field === 'paymentMethod' ? value : enrollment.paymentMethod,
        })
      ).unwrap();
      setSnackbar({ open: true, message: 'Payment updated', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: String(e), severity: 'error' });
    }
  };

  const notifyUserChannel = async (event, row, channel) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (row?.userId == null) return;
    const key = `${row.userId}-${channel}`;
    setSendingKey(key);
    try {
      const result = await dispatch(
        notifyMatchingInterests({
          clinicId: Number(id),
          userId: Number(row.userId),
          email: channel === 'email',
          whatsapp: channel === 'whatsapp',
        })
      ).unwrap();
      const userResult = Array.isArray(result?.results) ? result.results[0] : null;
      const sent =
        channel === 'email'
          ? Boolean(userResult?.emailSent || result?.emailed > 0)
          : Boolean(userResult?.whatsappSent || result?.whatsapped > 0);
      if (sent) {
        setSnackbar({
          open: true,
          message:
            channel === 'email'
              ? `Email sent to ${row.userName || row.userEmail || 'user'}`
              : `WhatsApp sent to ${row.userName || row.userPhone || 'user'}`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: userResult?.error || `Could not send ${channel}`,
          severity: 'error',
        });
      }
    } catch (e) {
      setSnackbar({ open: true, message: String(e), severity: 'error' });
    } finally {
      setSendingKey(null);
    }
  };

  const uniqueMatchCount = (() => {
    const ids = new Set();
    matchingInterests.forEach((row) => {
      if (row.userId != null) ids.add(row.userId);
    });
    return ids.size || matchingInterests.length;
  })();

  const handleNotifyAll = async () => {
    setNotifying(true);
    try {
      const result = await dispatch(notifyMatchingInterests({ clinicId: Number(id) })).unwrap();
      setNotifyConfirmOpen(false);
      const emailed = result?.emailed ?? 0;
      const whatsapped = result?.whatsapped ?? 0;
      const skipped = result?.skipped ?? 0;
      setSnackbar({
        open: true,
        message: `Notified matching interests — emailed: ${emailed}, WhatsApp: ${whatsapped}, skipped: ${skipped}`,
        severity: 'success',
      });
    } catch (e) {
      setSnackbar({ open: true, message: String(e), severity: 'error' });
    } finally {
      setNotifying(false);
    }
  };

  const levelLabel = (level) =>
    level ? t(`adminBookings.editModal.clientLevelOptions.${level}`, level) : '—';

  return (
    <Page title="Clinic detail">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={clinic?.title || 'Clinic'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clinics', href: PATH_DASHBOARD.admin.clinics },
            { name: clinic?.title || id },
          ]}
        />

        {clinic && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {clinic.title}
            </Typography>
            <Typography color="text.secondary">
              {clinic.sport} · {clinic.resortDisplayName || clinic.resort} · {clinic.startDate} – {clinic.endDate}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              {clinic.price} {clinic.currency} · Status: {clinic.status} · Enrolled:{' '}
              {clinic.enrollmentCount ?? enrollments.length}
            </Typography>
            {clinic.description && <Typography sx={{ mt: 2 }}>{clinic.description}</Typography>}
          </Card>
        )}

        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Enroll user by ID
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="User ID"
              value={enrollUserId}
              onChange={(e) => setEnrollUserId(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={() => handleEnroll(enrollUserId)} disabled={!enrollUserId}>
              Enroll
            </Button>
          </Stack>
        </Card>

        {matchingInterests.length > 0 && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1">Matching interests</Typography>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:bell-fill" />}
                onClick={() => setNotifyConfirmOpen(true)}
                disabled={matchingInterests.length === 0 || notifying || sendingKey != null}
              >
                Notify all
              </Button>
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Date range</TableCell>
                    <TableCell align="right">Notify</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchingInterests.map((row) => {
                    const hasEmail = Boolean((row.userEmail || '').trim());
                    const hasPhone = Boolean(
                      buildWhatsAppPhone(row.userCountryCode, row.userPhone).replace(/\D/g, '')
                    );
                    const emailBusy = sendingKey === `${row.userId}-email`;
                    const whatsappBusy = sendingKey === `${row.userId}-whatsapp`;
                    const rowBusy = sendingKey != null || notifying;
                    return (
                      <TableRow key={row.id}>
                        <TableCell>{row.userName}</TableCell>
                        <TableCell>
                          <Typography component="span" variant="body2" sx={{ userSelect: 'text' }}>
                            {row.userEmail || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component="span" variant="body2" sx={{ userSelect: 'text' }}>
                            {row.userPhone || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>{levelLabel(row.studentLevel)}</TableCell>
                        <TableCell>
                          {row.fromDate} – {row.toDate}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <LoadingButton
                              type="button"
                              size="small"
                              variant="outlined"
                              loading={emailBusy}
                              disabled={!hasEmail || rowBusy}
                              startIcon={<Iconify icon="eva:email-fill" width={18} height={18} />}
                              onClick={(e) => notifyUserChannel(e, row, 'email')}
                            >
                              Send email
                            </LoadingButton>
                            <LoadingButton
                              type="button"
                              size="small"
                              variant="outlined"
                              color="success"
                              loading={whatsappBusy}
                              disabled={!hasPhone || rowBusy}
                              startIcon={<Iconify icon="mdi:whatsapp" width={18} height={18} />}
                              onClick={(e) => notifyUserChannel(e, row, 'whatsapp')}
                            >
                              Send WhatsApp
                            </LoadingButton>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Button type="button" size="small" onClick={() => handleEnroll(row.userId)}>
                            Enroll
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        <Card>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1">Enrollments</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Enrolled at</TableCell>
                  <TableCell>Payment status</TableCell>
                  <TableCell>Payment method</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.userEmail}</TableCell>
                    <TableCell>{row.userPhone}</TableCell>
                    <TableCell>{row.enrolledAt}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={row.paymentStatus || 'UNPAID'}
                          onChange={(e) => handlePaymentChange(row.id, 'paymentStatus', e.target.value)}
                        >
                          {PAYMENT_STATUS_VALUES.map((v) => (
                            <MenuItem key={v} value={v}>
                              {v}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={row.paymentMethod || ''}
                          displayEmpty
                          onChange={(e) => handlePaymentChange(row.id, 'paymentMethod', e.target.value)}
                        >
                          <MenuItem value="">—</MenuItem>
                          {PAYMENT_METHOD_VALUES.map((v) => (
                            <MenuItem key={v} value={v}>
                              {v}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
                {enrollments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        No enrollments yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Box sx={{ mt: 2 }}>
          <Button onClick={() => navigate(PATH_DASHBOARD.admin.clinics)}>Back to clinics</Button>
        </Box>

        <Dialog open={notifyConfirmOpen} onClose={() => !notifying && setNotifyConfirmOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Notify matching interests</DialogTitle>
          <DialogContent>
            <Typography>
              Send email and WhatsApp to {uniqueMatchCount} matching{' '}
              {uniqueMatchCount === 1 ? 'person' : 'people'} for this clinic?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotifyConfirmOpen(false)} disabled={notifying}>
              Cancel
            </Button>
            <LoadingButton variant="contained" loading={notifying} onClick={handleNotifyAll}>
              Notify all
            </LoadingButton>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

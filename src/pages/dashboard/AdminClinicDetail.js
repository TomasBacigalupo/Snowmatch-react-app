import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
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
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import {
  fetchClinicById,
  fetchClinicEnrollments,
  fetchMatchingInterests,
  enrollUserInClinic,
  updateClinicEnrollmentPayment,
  clearCurrentClinic,
} from '../../redux/slices/clinics';

const PAYMENT_STATUS_VALUES = ['UNPAID', 'PAID_10', 'PAID_20', 'PAID_30', 'PAID_40', 'PAID_50', 'PAID'];
const PAYMENT_METHOD_VALUES = ['CASH', 'TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD'];

export default function AdminClinicDetail() {
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentClinic, enrollments, matchingInterests } = useSelector((state) => state.clinics);
  const [enrollUserId, setEnrollUserId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

  const clinic = currentClinic;

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
              {clinic.price} {clinic.currency} · Status: {clinic.status} · Enrolled: {clinic.enrollmentCount ?? enrollments.length}
            </Typography>
            {clinic.description && (
              <Typography sx={{ mt: 2 }}>{clinic.description}</Typography>
            )}
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
            <Typography variant="subtitle1" gutterBottom>
              Matching interests
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Date range</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchingInterests.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.userName}</TableCell>
                      <TableCell>{row.userEmail}</TableCell>
                      <TableCell>{row.userPhone}</TableCell>
                      <TableCell>
                        {row.fromDate} – {row.toDate}
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => handleEnroll(row.userId)}>
                          Enroll
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                            <MenuItem key={v} value={v}>{v}</MenuItem>
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
                            <MenuItem key={v} value={v}>{v}</MenuItem>
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

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

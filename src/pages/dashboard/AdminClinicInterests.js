import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import { fetchClinicInterests, createClinicInterest } from '../../redux/slices/clinics';
import { GROUP_LESSON_RESORT_OPTIONS } from '../../utils/groupLessonResortOptions';
import CreateStudentModal from '../../sections/@dashboard/admin/CreateStudentModal';

const SPORT_OPTIONS = [
  { value: 'SKI', label: 'Ski' },
  { value: 'SNOWBOARD', label: 'Snowboard' },
];

const emptyInterestForm = {
  userId: '',
  sport: 'SKI',
  resort: '',
  fromDate: '',
  toDate: '',
  notes: '',
};

export default function AdminClinicInterests() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { interests } = useSelector((state) => state.clinics);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createStudentOpen, setCreateStudentOpen] = useState(false);
  const [createdStudentLabel, setCreatedStudentLabel] = useState('');
  const [form, setForm] = useState(emptyInterestForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchClinicInterests());
  }, [dispatch]);

  const handleSaveInterest = async () => {
    try {
      await dispatch(
        createClinicInterest({
          userId: Number(form.userId),
          sport: form.sport,
          resort: form.resort,
          fromDate: form.fromDate,
          toDate: form.toDate,
          notes: form.notes || null,
        })
      ).unwrap();
      setDialogOpen(false);
      setForm(emptyInterestForm);
      setCreatedStudentLabel('');
      dispatch(fetchClinicInterests());
      setSnackbar({ open: true, message: 'Interest saved', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: String(e), severity: 'error' });
    }
  };

  const handleStudentCreated = (student) => {
    if (student?.id) {
      const label = [student.name, student.lastname].filter(Boolean).join(' ').trim() || student.email || '';
      setForm((prev) => ({ ...prev, userId: String(student.id) }));
      setCreatedStudentLabel(label);
      setCreateStudentOpen(false);
      enqueueSnackbar(t('adminBookings.createStudent.success'), { variant: 'success' });
    }
  };

  return (
    <Page title="Clinic interests">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Clinic interests"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clinics', href: PATH_DASHBOARD.admin.clinics },
            { name: 'Interests' },
          ]}
          action={
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Add interest
            </Button>
          }
        />

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Sport</TableCell>
                  <TableCell>Resort</TableCell>
                  <TableCell>Date range</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interests.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.userEmail}</TableCell>
                    <TableCell>{row.userPhone}</TableCell>
                    <TableCell>{row.sport}</TableCell>
                    <TableCell>{row.resortDisplayName || row.resort}</TableCell>
                    <TableCell>
                      {row.fromDate} – {row.toDate}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
                {interests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                        No open interests
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Stack direction="row" sx={{ mt: 2 }}>
          <Button onClick={() => navigate(PATH_DASHBOARD.admin.clinics)}>Back to clinics</Button>
        </Stack>

        <Dialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setCreatedStudentLabel('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add clinic interest</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  label="User ID"
                  value={form.userId}
                  onChange={(e) => {
                    setForm({ ...form, userId: e.target.value });
                    setCreatedStudentLabel('');
                  }}
                  fullWidth
                  required
                  helperText={createdStudentLabel || undefined}
                />
                <Button
                  variant="outlined"
                  onClick={() => setCreateStudentOpen(true)}
                  sx={{ minWidth: 44, px: 1, mt: 0.5 }}
                  title={t('adminBookings.createStudent.openButton')}
                >
                  <PersonAddIcon />
                </Button>
              </Stack>
              <FormControl fullWidth>
                <InputLabel>Sport</InputLabel>
                <Select label="Sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
                  {SPORT_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Resort</InputLabel>
                <Select label="Resort" value={form.resort} onChange={(e) => setForm({ ...form, resort: e.target.value })}>
                  {GROUP_LESSON_RESORT_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack direction="row" spacing={2}>
                <TextField label="From" type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth required />
                <TextField label="To" type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth required />
              </Stack>
              <TextField label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} multiline rows={2} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveInterest}
              disabled={!form.userId || !form.resort || !form.fromDate || !form.toDate}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <CreateStudentModal
          open={createStudentOpen}
          onClose={() => setCreateStudentOpen(false)}
          onCreated={handleStudentCreated}
        />

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  fetchClinics,
  createClinic,
  updateClinic,
  deleteClinic,
  clearError,
} from '../../redux/slices/clinics';
import {
  GROUP_LESSON_RESORT_OPTIONS,
  GROUP_LESSON_CURRENCY_OPTIONS,
} from '../../utils/groupLessonResortOptions';

const SPORT_OPTIONS = [
  { value: 'SKI', label: 'Ski' },
  { value: 'SNOWBOARD', label: 'Snowboard' },
];

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'OPEN', label: 'Open' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const emptyForm = {
  id: null,
  sport: 'SKI',
  resort: 'CERRO_CATEDRAL',
  startDate: '',
  endDate: '',
  title: '',
  description: '',
  price: '',
  currency: 'ARS',
  maxStudents: '5',
  startTime: '',
  endTime: '',
  status: 'OPEN',
};

export default function AdminClinics() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading, error } = useSelector((state) => state.clinics);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchClinics());
  }, [dispatch]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => String(b.startDate).localeCompare(String(a.startDate))),
    [items]
  );

  const openNew = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      sport: row.sport || 'SKI',
      resort: row.resort || '',
      startDate: row.startDate || '',
      endDate: row.endDate || '',
      title: row.title || '',
      description: row.description || '',
      price: row.price != null ? String(row.price) : '',
      currency: row.currency || 'ARS',
      maxStudents: row.maxStudents != null ? String(row.maxStudents) : '',
      startTime: row.startTime || '',
      endTime: row.endTime || '',
      status: row.status || 'DRAFT',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      sport: form.sport,
      resort: form.resort,
      startDate: form.startDate,
      endDate: form.endDate,
      title: form.title,
      description: form.description || null,
      price: Number(form.price),
      currency: form.currency,
      maxStudents: form.maxStudents === '' ? null : Number(form.maxStudents),
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      status: form.status,
    };
    try {
      if (form.id) {
        await dispatch(updateClinic({ id: form.id, ...payload })).unwrap();
        setSnackbar({ open: true, message: 'Clinic updated', severity: 'success' });
      } else {
        await dispatch(createClinic(payload)).unwrap();
        setSnackbar({ open: true, message: 'Clinic created', severity: 'success' });
      }
      setDialogOpen(false);
      dispatch(fetchClinics());
    } catch (e) {
      setSnackbar({ open: true, message: String(e), severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this clinic?')) return;
    try {
      await dispatch(deleteClinic(id)).unwrap();
      setSnackbar({ open: true, message: 'Clinic deleted', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: String(e), severity: 'error' });
    }
  };

  return (
    <Page title="Clinics">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Clinics"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clinics' },
          ]}
          action={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => navigate(PATH_DASHBOARD.admin.clinicInterests)}>
                Interests
              </Button>
              <Button variant="contained" onClick={openNew}>
                New clinic
              </Button>
            </Stack>
          }
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Sport</TableCell>
                  <TableCell>Resort</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Enrolled</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedItems.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.sport}</TableCell>
                    <TableCell>{row.resortDisplayName || row.resort}</TableCell>
                    <TableCell>
                      {row.startDate} – {row.endDate}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.enrollmentCount ?? 0}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => navigate(PATH_DASHBOARD.admin.clinicDetail(row.id))}>
                        View
                      </Button>
                      <Button size="small" onClick={() => openEdit(row)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDelete(row.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && sortedItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                        No clinics yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{form.id ? 'Edit clinic' : 'New clinic'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth required />
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
                <TextField label="Start date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth required />
                <TextField label="End date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth required />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Start time"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  fullWidth
                />
                <TextField
                  label="End time"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  fullWidth
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth required />
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    {GROUP_LESSON_CURRENCY_OPTIONS.map((o) => (
                      <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <TextField label="Max students" type="number" value={form.maxStudents} onChange={(e) => setForm({ ...form, maxStudents: e.target.value })} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUS_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline rows={3} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={saving || !form.title || !form.resort || !form.startDate || !form.endDate || form.price === ''}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

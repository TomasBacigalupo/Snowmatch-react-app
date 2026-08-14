import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import { fetchClinicInterests, createClinicInterest } from '../../redux/slices/clinics';
import { searchStudentsForAdminBooking } from '../../redux/slices/admin';
import { GROUP_LESSON_RESORT_OPTIONS } from '../../utils/groupLessonResortOptions';
import CreateStudentModal from '../../sections/@dashboard/admin/CreateStudentModal';

const SPORT_OPTIONS = [
  { value: 'SKI', label: 'Ski' },
  { value: 'SNOWBOARD', label: 'Snowboard' },
];

const STUDENT_LEVEL_VALUES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const emptyInterestForm = {
  sport: 'SKI',
  resort: '',
  fromDate: '',
  toDate: '',
  notes: '',
  studentLevel: '',
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
  const [form, setForm] = useState(emptyInterestForm);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentOptions, setStudentOptions] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchClinicInterests());
  }, [dispatch]);

  const studentAutocompleteOptions = useMemo(() => {
    if (!selectedStudent?.id) return studentOptions;
    if (studentOptions.some((s) => s?.id === selectedStudent.id)) return studentOptions;
    return [selectedStudent, ...studentOptions];
  }, [selectedStudent, studentOptions]);

  const levelLabel = useCallback(
    (level) => (level ? t(`adminBookings.editModal.clientLevelOptions.${level}`, level) : '—'),
    [t]
  );

  const resetDialog = () => {
    setForm(emptyInterestForm);
    setSelectedStudent(null);
    setStudentSearch('');
    setStudentOptions([]);
    setDateRange([null, null]);
  };

  const handleSaveInterest = async () => {
    try {
      await dispatch(
        createClinicInterest({
          userId: Number(selectedStudent.id),
          sport: form.sport,
          resort: form.resort,
          fromDate: form.fromDate,
          toDate: form.toDate,
          notes: form.notes || null,
          studentLevel: form.studentLevel,
        })
      ).unwrap();
      setDialogOpen(false);
      resetDialog();
      dispatch(fetchClinicInterests());
      setSnackbar({ open: true, message: 'Interest saved', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: String(e), severity: 'error' });
    }
  };

  const debouncedStudentSearch = useCallback(
    async (value) => {
      try {
        const results = await dispatch(searchStudentsForAdminBooking(value));
        setStudentOptions(Array.isArray(results) ? results : []);
      } catch {
        setStudentOptions([]);
      }
    },
    [dispatch]
  );

  const handleStudentInputChange = (_event, newValue) => {
    const selectedLabel = selectedStudent
      ? `${selectedStudent.name || ''} ${selectedStudent.lastname || ''}`.trim()
      : '';
    const clearingSelection = Boolean(selectedStudent && newValue !== selectedLabel);

    if (clearingSelection) {
      setSelectedStudent(null);
    }
    setStudentSearch(newValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      debouncedStudentSearch(newValue);
    }, 500);
  };

  const handleStudentChange = (newValue) => {
    setSelectedStudent(newValue);
    if (!newValue) {
      setStudentSearch('');
      return;
    }
    setStudentSearch(`${newValue.name || ''} ${newValue.lastname || ''}`.trim());
    if (newValue.studentLevel && STUDENT_LEVEL_VALUES.includes(newValue.studentLevel)) {
      setForm((prev) => ({ ...prev, studentLevel: newValue.studentLevel }));
    }
  };

  const handleStudentCreated = (student) => {
    if (student?.id) {
      const created = {
        id: student.id,
        name: student.name,
        lastname: student.lastname,
        email: student.email,
        cellphone: student.cellphone,
        studentLevel: student.studentLevel,
      };
      setSelectedStudent(created);
      setStudentSearch(`${created.name || ''} ${created.lastname || ''}`.trim());
      setStudentOptions((prev) => (prev.some((s) => s?.id === created.id) ? prev : [created, ...prev]));
      if (created.studentLevel && STUDENT_LEVEL_VALUES.includes(created.studentLevel)) {
        setForm((prev) => ({ ...prev, studentLevel: created.studentLevel }));
      }
      setCreateStudentOpen(false);
      enqueueSnackbar(t('adminBookings.createStudent.success'), { variant: 'success' });
    }
  };

  const handleDateRangeChange = (newValue) => {
    const [start, end] = newValue;
    setDateRange(newValue);
    setForm((prev) => ({
      ...prev,
      fromDate: start ? format(start, 'yyyy-MM-dd') : '',
      toDate: end ? format(end, 'yyyy-MM-dd') : '',
    }));
  };

  const canSave =
    selectedStudent?.id &&
    form.resort &&
    form.fromDate &&
    form.toDate &&
    form.studentLevel;

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
                  <TableCell>Level</TableCell>
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
                    <TableCell>{levelLabel(row.studentLevel)}</TableCell>
                    <TableCell>
                      {row.fromDate} – {row.toDate}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
                {interests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
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
            resetDialog();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add clinic interest</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Autocomplete
                  id="clinic-interest-student-autocomplete"
                  options={studentAutocompleteOptions}
                  filterOptions={(options) => options}
                  getOptionLabel={(option) =>
                    option ? `${option.name || ''} ${option.lastname || ''}`.trim() : ''
                  }
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  value={selectedStudent}
                  inputValue={studentSearch}
                  onChange={(_e, newValue) => handleStudentChange(newValue)}
                  onInputChange={(event, newValue, reason) => {
                    if (reason === 'input' || reason === 'clear') {
                      handleStudentInputChange(event, newValue);
                    }
                  }}
                  noOptionsText={t('adminBookings.createStudent.noResults')}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option?.id}>
                      <Stack spacing={0.25}>
                        <Typography variant="body2">
                          {`${option?.name || ''} ${option?.lastname || ''}`.trim() || option?.email}
                        </Typography>
                        {option?.email && (
                          <Typography variant="caption" color="text.secondary">
                            {option.email}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('adminBookings.createStudent.searchLabel')}
                      placeholder={t('adminBookings.createStudent.searchPlaceholder')}
                      required
                    />
                  )}
                  sx={{ flex: 1 }}
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

              <FormControl fullWidth required>
                <InputLabel>{t('adminBookings.editModal.clientLevel')}</InputLabel>
                <Select
                  label={t('adminBookings.editModal.clientLevel')}
                  value={form.studentLevel}
                  onChange={(e) => setForm({ ...form, studentLevel: e.target.value })}
                >
                  {STUDENT_LEVEL_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.clientLevelOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateRangePicker
                  localeText={{ start: 'From', end: 'To' }}
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>

              <TextField label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} multiline rows={2} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDialogOpen(false);
                resetDialog();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveInterest} disabled={!canSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <CreateStudentModal
          open={createStudentOpen}
          onClose={() => setCreateStudentOpen(false)}
          onCreated={handleStudentCreated}
          initialName={studentSearch}
        />

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

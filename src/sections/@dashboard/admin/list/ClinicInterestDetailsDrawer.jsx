import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { format, parseISO } from 'date-fns';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/Iconify';
import { fetchClinicInterestById, updateClinicInterest } from 'src/redux/slices/clinics';

const STUDENT_LEVEL_VALUES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const TAG_OPTIONS = [
  'NOT_CONTACTED',
  'DATES_DEFINED',
  'DATES_NOT_DEFINED',
  'NOT_INTERESTED',
  'POSSIBLE_STUDENT',
];

const TAG_LABELS = {
  NOT_CONTACTED: 'Not contacted',
  DATES_DEFINED: 'Dates defined',
  DATES_NOT_DEFINED: 'Dates not defined',
  NOT_INTERESTED: 'Not interested',
  POSSIBLE_STUDENT: 'Possible student',
};

const tagLabel = (tag) => TAG_LABELS[tag] || String(tag).replaceAll('_', ' ');

const tagChipColor = (tag) => {
  if (tag === 'NOT_CONTACTED') return 'error';
  if (tag === 'POSSIBLE_STUDENT') return 'success';
  return 'default';
};

ClinicInterestDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  interestId: PropTypes.number,
};

export default function ClinicInterestDetailsDrawer({ open, onClose, interestId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [interest, setInterest] = useState(null);
  const [form, setForm] = useState({
    fromDate: '',
    toDate: '',
    notes: '',
    studentLevel: '',
    tags: [],
  });
  const [dateRange, setDateRange] = useState([null, null]);

  const levelLabel = useCallback(
    (level) => (level ? t(`adminBookings.editModal.clientLevelOptions.${level}`, level) : '—'),
    [t]
  );

  const resetState = () => {
    setLoading(false);
    setSaving(false);
    setError('');
    setInterest(null);
    setForm({ fromDate: '', toDate: '', notes: '', studentLevel: '', tags: [] });
    setDateRange([null, null]);
  };

  useEffect(() => {
    if (!open || !interestId) {
      resetState();
      return undefined;
    }

    let cancelled = false;

    const loadInterest = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await dispatch(fetchClinicInterestById(interestId)).unwrap();
        if (cancelled) return;
        setInterest(data);
        setForm({
          fromDate: data.fromDate || '',
          toDate: data.toDate || '',
          notes: data.notes || '',
          studentLevel: data.studentLevel || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
        setDateRange([
          data.fromDate ? parseISO(data.fromDate) : null,
          data.toDate ? parseISO(data.toDate) : null,
        ]);
      } catch (e) {
        if (!cancelled) {
          setError(String(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInterest();

    return () => {
      cancelled = true;
    };
  }, [dispatch, open, interestId]);

  const handleDateRangeChange = (newValue) => {
    const [start, end] = newValue;
    setDateRange(newValue);
    setForm((prev) => ({
      ...prev,
      fromDate: start ? format(start, 'yyyy-MM-dd') : '',
      toDate: end ? format(end, 'yyyy-MM-dd') : '',
    }));
  };

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!interestId) return;

    setSaving(true);
    setError('');
    try {
      const updated = await dispatch(
        updateClinicInterest({
          id: interestId,
          fromDate: form.fromDate,
          toDate: form.toDate,
          notes: form.notes || null,
          studentLevel: form.studentLevel,
          tags: form.tags,
        })
      ).unwrap();
      setInterest(updated);
      setForm((prev) => ({
        ...prev,
        tags: Array.isArray(updated.tags) ? updated.tags : [],
      }));
      enqueueSnackbar('Interest updated', { variant: 'success' });
    } catch (e) {
      const message = String(e);
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const canSave = form.fromDate && form.toDate && form.studentLevel && interest?.status === 'OPEN';

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: {
          width: {
            xs: '100%',
            sm: 600,
            md: 700,
          },
        },
      }}
      BackdropProps={{
        onClick: onClose,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Clinic interest</Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {loading && (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        )}

        {!loading && error && !interest && (
          <Typography color="error" sx={{ py: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && interest && (
          <Stack spacing={3} component="form" onSubmit={handleSave}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                User
              </Typography>
              <Typography variant="body1">{interest.userName || '—'}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{interest.userEmail || '—'}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{interest.userPhone || '—'}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Sport
              </Typography>
              <Typography variant="body1">{interest.sport || '—'}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Resort
              </Typography>
              <Typography variant="body1">{interest.resortDisplayName || interest.resort || '—'}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1">{interest.status || '—'}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">{interest.createdAt || '—'}</Typography>
            </Box>

            <Divider />

            <Autocomplete
              multiple
              options={TAG_OPTIONS}
              value={form.tags}
              onChange={(_e, value) => setForm((prev) => ({ ...prev, tags: value }))}
              getOptionLabel={tagLabel}
              disabled={interest.status !== 'OPEN'}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={tagLabel(option)}
                    size="small"
                    color={tagChipColor(option)}
                    variant={tagChipColor(option) === 'default' ? 'outlined' : 'filled'}
                  />
                ))
              }
              renderInput={(params) => <TextField {...params} label="Tags" placeholder="Select tags" />}
            />

            <FormControl fullWidth required disabled={interest.status !== 'OPEN'}>
              <InputLabel>{t('adminBookings.editModal.clientLevel')}</InputLabel>
              <Select
                label={t('adminBookings.editModal.clientLevel')}
                value={form.studentLevel}
                onChange={(e) => setForm((prev) => ({ ...prev, studentLevel: e.target.value }))}
              >
                {STUDENT_LEVEL_VALUES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {levelLabel(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                localeText={{ start: 'From', end: 'To' }}
                value={dateRange}
                onChange={handleDateRangeChange}
                disabled={interest.status !== 'OPEN'}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>

            <TextField
              label="Notes"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              multiline
              rows={3}
              fullWidth
              disabled={interest.status !== 'OPEN'}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {interest.status === 'OPEN' ? (
              <LoadingButton type="submit" variant="contained" loading={saving} disabled={!canSave}>
                Save changes
              </LoadingButton>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Only open interests can be edited.
              </Typography>
            )}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

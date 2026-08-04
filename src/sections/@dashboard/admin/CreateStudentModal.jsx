import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'src/redux/store';
import { createAdminStudent, sendAppSignupInvite } from 'src/redux/slices/admin';
import { countries } from 'src/_mock';
import { useSnackbar } from 'notistack';

const QUICK_COUNTRIES = [
  { code: 'AR', label: 'Argentina', phone: '54' },
  { code: 'BR', label: 'Brasil', phone: '55' },
  { code: 'ES', label: 'España', phone: '34' },
];

function randomDefaultEmail() {
  const n = Math.floor(Math.random() * 100000);
  return `bacigalupotomas+${n}@gmail.com`;
}

function createDefaultForm(name = '') {
  return {
    name,
    email: randomDefaultEmail(),
    countryCode: '54',
    cellphone: '',
  };
}

function parseApiError(error) {
  if (error?.messages?.entry?.length) {
    return error.messages.entry.map((entry) => entry.value).join(', ');
  }
  if (typeof error === 'string') {
    return error;
  }
  return null;
}

function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || '';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '   ';
  return { firstName, lastName };
}

export default function CreateStudentModal({ open, onClose, onCreated, initialName = '' }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [form, setForm] = useState(() => createDefaultForm(initialName));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(createDefaultForm(initialName));
      setError('');
    }
  }, [open, initialName]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleQuickCountry = (phone) => {
    setForm((prev) => ({ ...prev, countryCode: phone }));
  };

  const handleSubmit = async () => {
    const { firstName, lastName } = splitFullName(form.name);

    if (firstName.length < 3) {
      setError(t('adminBookings.createStudent.validationName'));
      return;
    }
    if (!form.email.trim()) {
      setError(t('adminBookings.createStudent.validationEmail'));
      return;
    }
    if (!form.cellphone.trim()) {
      setError(t('adminBookings.createStudent.validationPhone'));
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const created = await dispatch(
        createAdminStudent({
          email: form.email.trim().toLowerCase(),
          name: firstName,
          lastname: lastName,
          countryCode: form.countryCode,
          cellphone: form.cellphone.trim(),
        })
      );

      try {
        await dispatch(
          sendAppSignupInvite({
            userId: created.id,
            countryCode: form.countryCode,
            cellphone: form.cellphone.trim(),
            name: firstName,
          })
        );
        enqueueSnackbar(t('adminBookings.createStudent.whatsAppInviteSent'), { variant: 'success' });
      } catch (inviteErr) {
        enqueueSnackbar(t('adminBookings.createStudent.whatsAppInviteFailed'), { variant: 'warning' });
      }

      onCreated(created);
      onClose();
    } catch (err) {
      setError(parseApiError(err) || t('adminBookings.createStudent.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('adminBookings.createStudent.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('adminBookings.createStudent.subtitle')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            fullWidth
            autoFocus
            label={t('adminBookings.createStudent.name')}
            value={form.name}
            onChange={handleChange('name')}
            placeholder={t('adminBookings.createStudent.namePlaceholder')}
            helperText={t('adminBookings.createStudent.nameHelper')}
          />
          <TextField
            fullWidth
            type="email"
            label={t('adminBookings.createStudent.email')}
            value={form.email}
            onChange={handleChange('email')}
          />
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {QUICK_COUNTRIES.map((country) => {
                const selected = form.countryCode === country.phone;
                return (
                  <Chip
                    key={country.code}
                    label={`${country.label} (+${country.phone})`}
                    variant="outlined"
                    onClick={() => handleQuickCountry(country.phone)}
                    sx={{
                      borderColor: 'common.black',
                      color: selected ? 'common.white' : 'common.black',
                      bgcolor: selected ? 'common.black' : 'transparent',
                      '&:hover': {
                        bgcolor: selected ? 'grey.800' : 'grey.100',
                        borderColor: 'common.black',
                      },
                    }}
                  />
                );
              })}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                fullWidth
                label={t('adminBookings.createStudent.countryCode')}
                value={form.countryCode}
                onChange={handleChange('countryCode')}
              >
                {countries.map((option) => (
                  <MenuItem key={option.code} value={option.phone}>
                    {option.label} (+{option.phone})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label={t('adminBookings.createStudent.phone')}
                value={form.cellphone}
                onChange={handleChange('cellphone')}
              />
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('adminBookings.createStudent.cancel')}</Button>
        <LoadingButton variant="contained" loading={submitting} onClick={handleSubmit}>
          {t('adminBookings.createStudent.create')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

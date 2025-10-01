import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Drawer, Box, Typography, Divider, Stack, Avatar, IconButton, Chip, TextField, Button, Autocomplete } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from 'src/components/Iconify';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'src/redux/store';
import { editTeacher, getTeachers } from 'src/redux/slices/admin';
import axios from 'src/utils/axios';

TeacherDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  teacher: PropTypes.object,
};

export default function TeacherDetailsDrawer({ open, onClose, teacher }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const formatLabel = (val) => {
    if (!val) return '';
    try {
      return String(val).replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    } catch (e) {
      return val;
    }
  };
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    cellphone: '',
    countryCode: '',
    role: '',
    level: '',
    sports: [],
    languages: [],
    resorts: [],
    resortsEnum: []
  });

  const [resortOptions, setResortOptions] = useState([]);
  const [resortsLoading, setResortsLoading] = useState(false);
  const sportsOptions = ['SKI', 'SNOWBOARD'];
  const languageOptions = ['Español', 'English', 'Portugues', 'Italiano'];

  useEffect(() => {
    if (teacher) {
      setForm({
        name: teacher.name || '',
        lastname: teacher.lastname || '',
        email: teacher.email || '',
        cellphone: teacher.cellphone || '',
        countryCode: teacher.countryCode || '',
        role: teacher.role || '',
        level: teacher.level ?? '',
        sports: teacher.sports || [],
        languages: teacher.languages || teacher.speaks || [],
        resorts: (teacher.resortsEnum || teacher.resorts || [])?.map((r) => r?.value || r?.name || r) || [],
        resortsEnum: (teacher.resortsEnum || teacher.resorts || [])?.map((r) => r?.value || r?.name || r) || []
      });
      setError('');
      setSaving(false);
    }
  }, [teacher]);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setResortsLoading(true);
        const resp = await axios.get('/api/enums/resorts');
        const options = Array.isArray(resp.data)
          ? resp.data.map((r) => (typeof r === 'string' ? r : (r.value || r.name))).filter(Boolean)
          : [];
        setResortOptions(options);
      } catch (e) {
        // fallback to current teacher resorts
        setResortOptions((teacher?.resortsEnum || teacher?.resorts || [])?.map((r) => r?.value || r?.name || r) || []);
      } finally {
        setResortsLoading(false);
      }
    };
    fetchResorts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        userId: teacher?.userId ?? teacher?.id,
        name: form.name?.trim?.() ?? form.name,
        lastname: form.lastname?.trim?.() ?? form.lastname,
        email: form.email?.trim?.() ?? form.email,
        cellphone: form.cellphone?.trim?.() ?? form.cellphone,
        countryCode: form.countryCode?.trim?.() ?? form.countryCode,
        role: form.role,
        level: form.level,
        sports: form.sports || [],
        languages: form.languages || [],
        resorts: (form.resorts || []).map((r) => (typeof r === 'string' ? r : (r?.value || r?.name))).filter(Boolean),
        resortsEnum: (form.resortsEnum || []).map((r) => (typeof r === 'string' ? r : (r?.value || r?.name))).filter(Boolean)
      };
      await dispatch(editTeacher(payload));
      await dispatch(getTeachers(1));
      setIsEditing(false);
      onClose();
    } catch (e) {
      setError('No se pudo guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (!teacher) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: {
          paddingTop: 'env(safe-area-inset-top)',
          width: { xs: '100%', sm: 420, md: 520 },
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 420, md: 520 },
            boxSizing: 'border-box',
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
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={teacher?.imageLink} alt={teacher?.name} sx={{ width: 48, height: 48 }} />
            <Box>
              <Typography variant="h6">{`${teacher?.name || ''} ${teacher?.lastname || ''}`}</Typography>
              <Typography variant="body2" color="text.secondary">ID: {teacher?.id}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => setIsEditing((v) => !v)}>
              <Iconify icon={isEditing ? 'eva:edit-2-outline' : 'eva:edit-fill'} />
            </IconButton>
            <IconButton onClick={onClose}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {!isEditing && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Estado</Typography>
              <Chip
                label={teacher?.state}
                color={(teacher?.state === 'UNAVAILABLE' && 'error') || 'success'}
                variant={theme.palette.mode === 'light' ? 'outlined' : 'filled'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Rol y Nivel</Typography>
              <Stack direction="row" spacing={2}>
                <Chip label={`Role: ${teacher?.role ?? '-'}`} variant="outlined" />
                <Chip label={`Level: ${teacher?.level ?? '-'}`} variant="outlined" />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Resorts</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(teacher?.resortsEnum || teacher?.resorts || [])?.map((r, idx) => (
                  <Chip key={`resort-${idx}`} label={formatLabel(r?.name || r)} size="small" sx={{ mb: 1 }} />
                ))}
                {!((teacher?.resortsEnum || teacher?.resorts || []).length) && (
                  <Typography variant="body2" color="text.secondary">-</Typography>
                )}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Sports</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(teacher?.sports || [])?.map((s, idx) => (
                  <Chip key={`sport-${idx}`} label={formatLabel(s)} size="small" sx={{ mb: 1 }} />
                ))}
                {!((teacher?.sports || []).length) && (
                  <Typography variant="body2" color="text.secondary">-</Typography>
                )}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Languages</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(teacher?.languages || teacher?.speaks || [])?.map((l, idx) => (
                  <Chip key={`lang-${idx}`} label={formatLabel(l)} size="small" sx={{ mb: 1 }} />
                ))}
                {!((teacher?.languages || teacher?.speaks || []).length) && (
                  <Typography variant="body2" color="text.secondary">-</Typography>
                )}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Contacto</Typography>
              <Stack spacing={0.5}>
                {teacher?.email && (
                  <Typography variant="body2">Email: {teacher.email}</Typography>
                )}
                {teacher?.cellphone && (
                  <Typography variant="body2">Tel: {teacher.cellphone}</Typography>
                )}
                {teacher?.countryCode && (
                  <Typography variant="body2">Código País: {teacher.countryCode}</Typography>
                )}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Ver más</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => window.open(`https://wa.me/${teacher?.countryCode || ''}${teacher?.cellphone || ''}`,'_blank')}>
                  <Iconify icon="logos:whatsapp-icon" />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        )}

        {isEditing && (
          <Stack spacing={2}>
            <Typography variant="subtitle2">Editar datos del instructor</Typography>
            {error && (
              <Typography variant="body2" color="error">{error}</Typography>
            )}
            <TextField
              label="Nombre"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
            />
            <TextField
              label="Apellido"
              value={form.lastname}
              onChange={handleChange('lastname')}
              fullWidth
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={handleChange('email')}
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={form.cellphone}
              onChange={handleChange('cellphone')}
              fullWidth
            />
            <TextField
              label="Código País"
              value={form.countryCode}
              onChange={handleChange('countryCode')}
              fullWidth
            />
            <TextField
              label="Rol"
              value={form.role}
              onChange={handleChange('role')}
              fullWidth
            />
            <TextField
              label="Nivel"
              value={form.level}
              onChange={handleChange('level')}
              fullWidth
            />
            <Autocomplete
              multiple
              options={sportsOptions}
              value={form.sports}
              onChange={(_, newValue) => setForm((prev) => ({ ...prev, sports: newValue }))}
              renderTags={(value, getTagProps) => value.map((option, index) => (
                <Chip variant="filled" size="small" label={option} {...getTagProps({ index })} />
              ))}
              renderInput={(params) => (
                <TextField {...params} label="Sports" placeholder="Seleccioná sports" />
              )}
            />
            <Autocomplete
              multiple
              options={languageOptions}
              value={form.languages}
              onChange={(_, newValue) => setForm((prev) => ({ ...prev, languages: newValue }))}
              renderTags={(value, getTagProps) => value.map((option, index) => (
                <Chip variant="filled" size="small" label={option} {...getTagProps({ index })} />
              ))}
              renderInput={(params) => (
                <TextField {...params} label="Languages" placeholder="Seleccioná idiomas" />
              )}
            />
            <Autocomplete
              multiple
              freeSolo
              options={resortOptions}
              loading={resortsLoading}
              value={form.resorts}
              onChange={(_, newValue) => setForm((prev) => ({ ...prev, resorts: newValue }))}
              renderTags={(value, getTagProps) => value.map((option, index) => (
                <Chip variant="filled" size="small" label={formatLabel(option)} {...getTagProps({ index })} />
              ))}
              renderInput={(params) => (
                <TextField {...params} label="Resorts" placeholder="Seleccioná resorts" />
              )}
            />
            <Autocomplete
              multiple
              freeSolo
              options={resortOptions}
              loading={resortsLoading}
              value={form.resortsEnum}
              onChange={(_, newValue) => setForm((prev) => ({ ...prev, resortsEnum: newValue }))}
              renderTags={(value, getTagProps) => value.map((option, index) => (
                <Chip variant="filled" size="small" label={formatLabel(option)} {...getTagProps({ index })} />
              ))}
              renderInput={(params) => (
                <TextField {...params} label="Resorts Enum" placeholder="Seleccioná resorts enum" />
              )}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancelar</Button>
              <LoadingButton loading={saving} variant="contained" onClick={handleSave}>
                Guardar
              </LoadingButton>
            </Stack>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}



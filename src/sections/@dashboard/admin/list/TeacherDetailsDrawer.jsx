import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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
      setImageFile(null);
      setImagePreview('');
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSave = async (e) => {
    // Prevenir cualquier comportamiento predeterminado del navegador
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setSaving(true);
    setError('');
    try {
      let imageUrl = teacher?.imageLink;

      // Si hay una nueva imagen, subirla primero al bucket
      if (imageFile) {
        try {
          // Step 1: Obtener presigned URL
          const userId = teacher?.userId ?? teacher?.id;
          console.log('Getting presigned URL for userId:', userId);
          
          const presignedResponse = await axios.get(`/api/admin/profile-image/presigned-url/${userId}`);
          console.log('Presigned response:', presignedResponse);
          const presignedUrl = presignedResponse.data.presignedUrl;
          
          console.log('Presigned URL type:', typeof presignedUrl);
          console.log('Presigned URL:', presignedUrl);

          // Verificar que presignedUrl sea un string válido
          if (typeof presignedUrl !== 'string' || !presignedUrl.startsWith('http')) {
            throw new Error('Invalid presigned URL received from server');
          }

          // Step 2: Subir imagen a S3 usando presigned URL
          const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': imageFile.type,
            },
            body: imageFile,
          });
          console.log('Upload response:', uploadResponse);

          console.log('Upload response url:', uploadResponse.url);
          console.log('Upload response ok:', uploadResponse.ok);

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('S3 upload error:', errorText);
            throw new Error(`Failed to upload image to S3: ${uploadResponse.status} - ${errorText}`);
          }

          // Step 3: Obtener la URL final (sin query params)
          imageUrl = uploadResponse.url.split('?')[0];
          console.log('Final image URL:', imageUrl);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError(t('adminReview.drawer.uploadImageError', { message: uploadError.message }));
          setSaving(false);
          return;
        }
      }

      // Step 4: Actualizar los datos del instructor
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
        resortsEnum: (form.resortsEnum || []).map((r) => (typeof r === 'string' ? r : (r?.value || r?.name))).filter(Boolean),
        imageS3: imageUrl,
        imageKey: imageUrl.split('/').pop(),
      };

      await dispatch(editTeacher(payload));
      await dispatch(getTeachers(0));
      setIsEditing(false);
      onClose();
    } catch (e) {
      console.error('Error saving teacher:', e);
      setError(t('adminReview.drawer.saveError'));
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
      onClick={(e) => e.stopPropagation()}
    >
      <Box 
        sx={{ p: 3, height: '100%', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
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
              <Typography variant="subtitle2" gutterBottom>{t('adminReview.drawer.state')}</Typography>
              <Chip
                label={teacher?.state}
                color={(teacher?.state === 'UNAVAILABLE' && 'error') || 'success'}
                variant={theme.palette.mode === 'light' ? 'outlined' : 'filled'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>{t('adminReview.drawer.roleAndLevel')}</Typography>
              <Stack direction="row" spacing={2}>
                <Chip label={t('adminReview.drawer.role', { role: teacher?.role ?? '-' })} variant="outlined" />
                <Chip label={t('adminReview.drawer.level', { level: teacher?.level ?? '-' })} variant="outlined" />
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>{t('adminReview.drawer.resorts')}</Typography>
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
              <Typography variant="subtitle2" gutterBottom>{t('adminReview.drawer.sports')}</Typography>
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
              <Typography variant="subtitle2" gutterBottom>{t('adminReview.drawer.languages')}</Typography>
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
              <Typography variant="subtitle2" gutterBottom>{t('adminReview.drawer.contact')}</Typography>
              <Stack spacing={0.5}>
                {teacher?.email && (
                  <Typography variant="body2">{t('adminReview.drawer.email', { email: teacher.email })}</Typography>
                )}
                {teacher?.cellphone && (
                  <Typography variant="body2">{t('adminReview.drawer.phone', { phone: teacher.cellphone })}</Typography>
                )}
                {teacher?.countryCode && (
                  <Typography variant="body2">{t('adminReview.drawer.countryCode', { code: teacher.countryCode })}</Typography>
                )}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>{t('adminReview.drawer.seeMore')}</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => window.open(`https://wa.me/${teacher?.countryCode || ''}${teacher?.cellphone || ''}`,'_blank')}>
                  <Iconify icon="logos:whatsapp-icon" />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        )}

        {isEditing && (
          <Box 
            component="form" 
            onSubmit={handleSave}
            noValidate
          >
            <Stack spacing={2}>
              <Typography variant="subtitle2">{t('adminReview.drawer.editTeacherData')}</Typography>
              {error && (
                <Typography variant="body2" color="error">{error}</Typography>
              )}
              
              {/* Sección de imagen */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>{t('adminReview.drawer.profilePhoto')}</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar 
                    src={imagePreview || teacher?.imageLink} 
                    alt={teacher?.name}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Stack spacing={1}>
                    <Button
                      type="button"
                      variant="outlined"
                      component="label"
                      size="small"
                      startIcon={<Iconify icon="eva:upload-fill" />}
                    >
                      {t('adminReview.drawer.changeImage')}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="text"
                        size="small"
                        color="error"
                        onClick={handleRemoveImage}
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                      >
                        {t('adminReview.drawer.removeImage')}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>

              <TextField
                label={t('adminReview.drawer.firstName')}
                value={form.name}
                onChange={handleChange('name')}
                fullWidth
              />
              <TextField
                label={t('adminReview.drawer.lastName')}
                value={form.lastname}
                onChange={handleChange('lastname')}
                fullWidth
              />
              <TextField
                label={t('adminReview.drawer.emailField')}
                value={form.email}
                onChange={handleChange('email')}
                fullWidth
              />
              <TextField
                label={t('adminReview.drawer.phoneField')}
                value={form.cellphone}
                onChange={handleChange('cellphone')}
                fullWidth
              />
              <TextField
                label={t('adminReview.drawer.countryCodeField')}
                value={form.countryCode}
                onChange={handleChange('countryCode')}
                fullWidth
              />
              <TextField
                label={t('adminReview.drawer.roleField')}
                value={form.role}
                onChange={handleChange('role')}
                fullWidth
              />
              <TextField
                label={t('adminReview.drawer.levelField')}
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
                  <TextField {...params} label={t('adminReview.drawer.sports')} placeholder={t('adminReview.drawer.sportsPlaceholder')} />
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
                  <TextField {...params} label={t('adminReview.drawer.languages')} placeholder={t('adminReview.drawer.languagesPlaceholder')} />
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
                  <TextField {...params} label={t('adminReview.drawer.resorts')} placeholder={t('adminReview.drawer.resortsPlaceholder')} />
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
                  <TextField {...params} label={t('adminReview.drawer.resortsEnum')} placeholder={t('adminReview.drawer.resortsEnumPlaceholder')} />
                )}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button type="button" variant="outlined" onClick={() => setIsEditing(false)}>{t('adminReview.drawer.cancel')}</Button>
                <LoadingButton type="submit" loading={saving} variant="contained">
                  {t('adminReview.drawer.save')}
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}



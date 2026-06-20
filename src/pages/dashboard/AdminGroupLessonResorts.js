import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
  Alert,
  Avatar,
  IconButton,
  Checkbox,
  FormControlLabel,
  Skeleton,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from '../../utils/axios';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import {
  fetchGroupLessonResortConfigs,
  createGroupLessonResortConfig,
  updateGroupLessonResortConfig,
  deleteGroupLessonResortConfig,
  clearError,
} from '../../redux/slices/groupLessonResortConfig';
import {
  GROUP_LESSON_RESORT_OPTIONS,
  GROUP_LESSON_CURRENCY_OPTIONS,
} from '../../utils/groupLessonResortOptions';
import useAuth from '../../hooks/useAuth';

const emptyForm = {
  id: null,
  resort: '',
  price: '',
  currency: 'ARS',
  imageUrl: '',
  title: '',
  description: '',
  includesGear: false,
  skiLevel: '',
  minAge: '',
  minDays: '',
  startTime: '',
  endTime: '',
};

const timeToInput = (v) => {
  if (v == null || v === '') return '';
  const s = String(v).trim();
  if (s.length >= 5) return s.slice(0, 5);
  return s;
};

export default function AdminGroupLessonResorts() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { isResortAdmin, user } = useAuth();
  const lockedResort = isResortAdmin ? user?.managedResort : null;
  const { items, isLoading, error } = useSelector((state) => state.groupLessonResortConfig);
  const displayItems = useMemo(
    () => (lockedResort ? items.filter((row) => row.resort === lockedResort) : items),
    [items, lockedResort]
  );
  const resortOptions = useMemo(
    () =>
      lockedResort
        ? GROUP_LESSON_RESORT_OPTIONS.filter((opt) => opt.value === lockedResort)
        : GROUP_LESSON_RESORT_OPTIONS,
    [lockedResort]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [resortLocked, setResortLocked] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchGroupLessonResortConfigs());
  }, [dispatch]);

  const resetImagePick = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl('');
    setImageFile(null);
  };

  const closeDialog = () => {
    resetImagePick();
    setDialogOpen(false);
  };

  const openNew = () => {
    resetImagePick();
    setForm(lockedResort ? { ...emptyForm, resort: lockedResort } : emptyForm);
    setResortLocked(Boolean(lockedResort));
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    resetImagePick();
    setForm({
      id: row.id,
      resort: row.resort,
      price: row?.price != null ? String(row.price) : '',
      currency: row?.currency || 'ARS',
      imageUrl: row?.imageUrl || '',
      title: row?.title || '',
      description: row?.description || '',
      includesGear: Boolean(row?.includesGear),
      skiLevel: row?.skiLevel || '',
      minAge: row?.minAge != null && row?.minAge !== '' ? String(row.minAge) : '',
      minDays: row?.minDays != null && row?.minDays !== '' ? String(row.minDays) : '',
      startTime: timeToInput(row?.startTime),
      endTime: timeToInput(row?.endTime),
    });
    setResortLocked(true);
    setDialogOpen(true);
  };

  const handleImageFileChange = ({ target }) => {
    const file = target.files?.[0];
    const input = target;
    input.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setSnackbar({ open: true, message: 'Elegí un archivo de imagen', severity: 'error' });
      return;
    }
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    resetImagePick();
    setForm((f) => ({ ...f, imageUrl: '' }));
  };

  const handleSave = async () => {
    if (!form.resort || form.price === '') {
      setSnackbar({ open: true, message: 'Resort y precio son obligatorios', severity: 'error' });
      return;
    }
    setSaving(true);
    let imageUrl = form.imageUrl;
    try {
      if (imageFile) {
        const presignedParams = form.id
          ? { configId: form.id }
          : { resort: form.resort };
        const presignedBase = isResortAdmin
          ? '/api/resort-admin/group-lesson-resort-config/image-presigned-url'
          : '/api/admin/group-lesson-resort-config/image-presigned-url';
        const presignedResponse = await axios.get(presignedBase, {
          params: presignedParams,
        });
        const { presignedUrl, imageUrl: uploadedPublicUrl } = presignedResponse.data || {};
        if (typeof presignedUrl !== 'string' || !presignedUrl.startsWith('http')) {
          throw new Error('No se pudo obtener la URL firmada para subir la imagen');
        }
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': imageFile.type || 'application/octet-stream' },
          body: imageFile,
        });
        if (!uploadResponse.ok) {
          const errText = await uploadResponse.text().catch(() => '');
          throw new Error(
            errText ? `Error al subir la imagen (${uploadResponse.status})` : 'Error al subir la imagen'
          );
        }
        imageUrl = uploadedPublicUrl || presignedUrl.split('?')[0];
      }

      const isEdit = form.id != null;
      const action = isEdit
        ? await dispatch(
            updateGroupLessonResortConfig({
              id: form.id,
              price: form.price,
              currency: form.currency,
              imageUrl: imageUrl || null,
              title: form.title,
              description: form.description,
              includesGear: form.includesGear,
              skiLevel: form.skiLevel,
              minAge: form.minAge,
              minDays: form.minDays,
              startTime: form.startTime,
              endTime: form.endTime,
              useResortAdmin: isResortAdmin,
            })
          )
        : await dispatch(
            createGroupLessonResortConfig({
              resort: form.resort,
              price: form.price,
              currency: form.currency,
              imageUrl: imageUrl || null,
              title: form.title,
              description: form.description,
              includesGear: form.includesGear,
              skiLevel: form.skiLevel,
              minAge: form.minAge,
              minDays: form.minDays,
              startTime: form.startTime,
              endTime: form.endTime,
              useResortAdmin: isResortAdmin,
            })
          );

      const fulfilled = isEdit
        ? updateGroupLessonResortConfig.fulfilled.match(action)
        : createGroupLessonResortConfig.fulfilled.match(action);
      if (fulfilled) {
        setSnackbar({ open: true, message: 'Guardado correctamente', severity: 'success' });
        closeDialog();
        dispatch(fetchGroupLessonResortConfigs());
      } else {
        const msg =
          typeof action.payload === 'string'
            ? action.payload
            : action.payload?.message || 'No se pudo guardar';
        setSnackbar({ open: true, message: msg, severity: 'error' });
      }
    } catch (err) {
      const msg =
        typeof err === 'string'
          ? err
          : err?.message || err?.error || 'No se pudo guardar la configuración';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const renderTableSkeleton = () =>
    Array.from({ length: 8 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton width={32} height={20} />
        </TableCell>
        <TableCell>
          <Stack spacing={0.5}>
            <Skeleton width="80%" height={20} />
            <Skeleton width="50%" height={16} />
          </Stack>
        </TableCell>
        <TableCell>
          <Skeleton width="70%" height={20} />
        </TableCell>
        <TableCell align="right">
          <Skeleton width={72} height={20} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rounded" width={56} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton width="90%" height={20} />
        </TableCell>
        <TableCell>
          <Stack spacing={0.5}>
            <Skeleton width="85%" height={14} />
            <Skeleton width="70%" height={14} />
            <Skeleton width="60%" height={14} />
          </Stack>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Skeleton width={56} height={28} sx={{ borderRadius: 1 }} />
            <Skeleton variant="circular" width={32} height={32} />
          </Stack>
        </TableCell>
      </TableRow>
    ));

  const confirmDelete = async () => {
    if (deleteTarget == null) return;
    setSaving(true);
    try {
      const action = await dispatch(
        deleteGroupLessonResortConfig({ id: deleteTarget.id, useResortAdmin: isResortAdmin })
      );
      if (deleteGroupLessonResortConfig.fulfilled.match(action)) {
        setSnackbar({ open: true, message: 'Eliminado', severity: 'success' });
        setDeleteTarget(null);
        dispatch(fetchGroupLessonResortConfigs());
      } else {
        const msg =
          typeof action.payload === 'string'
            ? action.payload
            : action.payload?.message || 'No se pudo eliminar';
        setSnackbar({ open: true, message: msg, severity: 'error' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page title="Group lessons por centro">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Clases grupales por centro"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Clases grupales' },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Podés publicar varias ofertas de clase grupal por el mismo centro (título, precio, imagen y
              descripción). Cada fila es una oferta distinta.
            </Typography>
            <Button variant="contained" onClick={openNew}>
              Nueva oferta
            </Button>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Centro</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>Nivel / edad / días / horario</TableCell>
                  <TableCell align="right" width={140} />
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  renderTableSkeleton()
                ) : (
                  <>
                {displayItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Typography color="text.secondary" variant="body2">
                        No hay configuraciones guardadas todavía.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {displayItems.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.resortDisplayName || row.resort}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.resort}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={row.title}>
                        {row.title || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {row.price != null ? `${row.price} ${row.currency || ''}`.trim() : '—'}
                    </TableCell>
                    <TableCell>
                      {row.imageUrl ? (
                        <Avatar src={row.imageUrl} variant="rounded" sx={{ width: 56, height: 40 }} />
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="body2" noWrap title={row.description}>
                        {row.description || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography variant="caption" color="text.secondary" display="block" noWrap title={row.skiLevel}>
                        {row.skiLevel || '—'}
                      </Typography>
                      <Typography variant="caption" display="block" noWrap>
                        {row.minAge != null ? `≥${row.minAge} años` : '—'} ·{' '}
                        {row.includesGear ? 'Con equipo' : 'Sin equipo'}
                      </Typography>
                      <Typography variant="caption" display="block" noWrap>
                        {row.minDays != null ? `Mín. ${row.minDays} día(s)` : '—'} ·{' '}
                        {row.startTime && row.endTime
                          ? `${timeToInput(row.startTime)}–${timeToInput(row.endTime)}`
                          : row.startTime
                            ? `Desde ${timeToInput(row.startTime)}`
                            : row.endTime
                              ? `Hasta ${timeToInput(row.endTime)}`
                              : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => openEdit(row)}>
                        Editar
                      </Button>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Eliminar oferta"
                        onClick={() => setDeleteTarget(row)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>Clases grupales — oferta</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="gl-resort-label">Centro de esquí</InputLabel>
                <Select
                  labelId="gl-resort-label"
                  label="Centro de esquí"
                  value={form.resort}
                  onChange={(e) => setForm((f) => ({ ...f, resort: e.target.value }))}
                  disabled={resortLocked || Boolean(lockedResort)}
                >
                  {!lockedResort && (
                    <MenuItem value="">
                      <em>Seleccionar…</em>
                    </MenuItem>
                  )}
                  {resortOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Título (clase grupal)"
                fullWidth
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                helperText="Se muestra en la home y en la app como encabezado de la oferta grupal"
              />
              <TextField
                label="Precio (clase grupal)"
                type="number"
                fullWidth
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                inputProps={{ min: 0, step: '0.01' }}
              />
              <FormControl fullWidth>
                <InputLabel id="gl-currency-label">Moneda</InputLabel>
                <Select
                  labelId="gl-currency-label"
                  label="Moneda"
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                >
                  {GROUP_LESSON_CURRENCY_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Imagen promocional
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Subí una imagen al bucket (se guarda el enlace público en la base de datos).
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  {(imagePreviewUrl || form.imageUrl) && (
                    <Avatar
                      src={imagePreviewUrl || form.imageUrl}
                      variant="rounded"
                      sx={{ width: 120, height: 72 }}
                    />
                  )}
                  <label htmlFor="gl-resort-image-upload">
                    <input
                      id="gl-resort-image-upload"
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageFileChange}
                      disabled={!form.resort}
                    />
                    <Button variant="outlined" component="span" disabled={!form.resort}>
                      Elegir imagen
                    </Button>
                  </label>
                  {(imagePreviewUrl || form.imageUrl) && (
                    <Button color="inherit" size="small" onClick={handleClearImage}>
                      Quitar imagen
                    </Button>
                  )}
                </Stack>
                {!form.resort && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Primero elegí el centro de esquí para poder subir la imagen.
                  </Typography>
                )}
              </Box>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(form.includesGear)}
                    onChange={(e) => setForm((f) => ({ ...f, includesGear: e.target.checked }))}
                  />
                }
                label="Incluye equipo (alquiler)"
              />
              <TextField
                label="Nivel de esquí (texto libre)"
                fullWidth
                value={form.skiLevel}
                onChange={(e) => setForm((f) => ({ ...f, skiLevel: e.target.value }))}
                placeholder="Ej. principiante, intermedio…"
                inputProps={{ maxLength: 256 }}
              />
              <TextField
                label="Edad mínima (años)"
                type="number"
                fullWidth
                value={form.minAge}
                onChange={(e) => setForm((f) => ({ ...f, minAge: e.target.value }))}
                inputProps={{ min: 0, max: 150, step: 1 }}
                helperText="Opcional. Dejá vacío si no aplica."
              />
              <TextField
                label="Días mínimos de reserva"
                type="number"
                fullWidth
                value={form.minDays}
                onChange={(e) => setForm((f) => ({ ...f, minDays: e.target.value }))}
                inputProps={{ min: 1, max: 366, step: 1 }}
                helperText="Opcional. Ej. 3 = al menos tres días de clases o estadía."
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Hora inicio"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  inputProps={{ step: 300 }}
                />
                <TextField
                  label="Hora fin"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  inputProps={{ step: 300 }}
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave} disabled={isLoading || saving}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
          <DialogTitle>Eliminar oferta</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              ¿Eliminar la oferta #{deleteTarget?.id} ({deleteTarget?.resortDisplayName || deleteTarget?.resort})?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {typeof error === 'string' ? error : 'Error'}
            </Alert>
          </Box>
        )}
      </Container>
    </Page>
  );
}

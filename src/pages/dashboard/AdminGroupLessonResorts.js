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
} from '@mui/material';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import {
  fetchGroupLessonResortConfigs,
  updateGroupLessonResortConfig,
  clearError,
} from '../../redux/slices/groupLessonResortConfig';
import {
  GROUP_LESSON_RESORT_OPTIONS,
  GROUP_LESSON_CURRENCY_OPTIONS,
} from '../../utils/groupLessonResortOptions';

const emptyForm = {
  resort: '',
  price: '',
  currency: 'ARS',
  imageUrl: '',
  description: '',
};

export default function AdminGroupLessonResorts() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector((state) => state.groupLessonResortConfig);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [resortLocked, setResortLocked] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchGroupLessonResortConfigs());
  }, [dispatch]);

  const byResort = useMemo(() => {
    const m = {};
    items.forEach((row) => {
      m[row.resort] = row;
    });
    return m;
  }, [items]);

  const openNew = () => {
    setForm(emptyForm);
    setResortLocked(false);
    setDialogOpen(true);
  };

  const openEdit = (resortKey) => {
    const row = byResort[resortKey];
    setForm({
      resort: resortKey,
      price: row?.price != null ? String(row.price) : '',
      currency: row?.currency || 'ARS',
      imageUrl: row?.imageUrl || '',
      description: row?.description || '',
    });
    setResortLocked(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.resort || form.price === '') {
      setSnackbar({ open: true, message: 'Resort y precio son obligatorios', severity: 'error' });
      return;
    }
    const action = await dispatch(
      updateGroupLessonResortConfig({
        resort: form.resort,
        price: form.price,
        currency: form.currency,
        imageUrl: form.imageUrl,
        description: form.description,
      })
    );
    if (updateGroupLessonResortConfig.fulfilled.match(action)) {
      setSnackbar({ open: true, message: 'Guardado correctamente', severity: 'success' });
      setDialogOpen(false);
      dispatch(fetchGroupLessonResortConfigs());
    } else {
      const msg =
        typeof action.payload === 'string'
          ? action.payload
          : action.payload?.message || 'No se pudo guardar';
      setSnackbar({ open: true, message: msg, severity: 'error' });
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
              Precio, imagen y descripción que se muestran para clases grupales en cada centro (home
              pública y fichas).
            </Typography>
            <Button variant="contained" onClick={openNew}>
              Configurar centro
            </Button>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Centro</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="right" width={120} />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography color="text.secondary" variant="body2">
                        No hay configuraciones guardadas todavía.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {items.map((row) => (
                  <TableRow key={row.resort}>
                    <TableCell>
                      <Typography variant="subtitle2">{row.resortDisplayName || row.resort}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.resort}
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
                    <TableCell align="right">
                      <Button size="small" onClick={() => openEdit(row.resort)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Clases grupales — configuración por centro</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="gl-resort-label">Centro de esquí</InputLabel>
                <Select
                  labelId="gl-resort-label"
                  label="Centro de esquí"
                  value={form.resort}
                  onChange={(e) => setForm((f) => ({ ...f, resort: e.target.value }))}
                  disabled={resortLocked}
                >
                  <MenuItem value="">
                    <em>Seleccionar…</em>
                  </MenuItem>
                  {GROUP_LESSON_RESORT_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <TextField
                label="URL de imagen"
                fullWidth
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                helperText="Imagen promocional de la oferta grupal en este centro"
              />
              <TextField
                label="Descripción"
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave} disabled={isLoading}>
              Guardar
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

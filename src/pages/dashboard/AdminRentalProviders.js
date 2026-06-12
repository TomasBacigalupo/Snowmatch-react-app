import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
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
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import useSettings from '../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../routes/paths';
import {
  getRentalProviders,
  createRentalProvider,
  updateRentalProvider,
  deleteRentalProvider,
  clearProvidersError,
} from '../../redux/slices/rental';

const RESORT_OPTIONS = [
  { value: 'CERRO_CATEDRAL', label: 'Cerro Catedral' },
  { value: 'CERRO_CASTOR', label: 'Cerro Castor' },
  { value: 'CHAPELCO', label: 'Chapelco' },
  { value: 'LA_HOYA', label: 'La Hoya' },
  { value: 'LAS_LEÑAS', label: 'Las Leñas' },
  { value: 'CERRO_BAYO', label: 'Cerro Bayo' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'DEBIT_CARD', label: 'Tarjeta débito' },
  { value: 'CREDIT_CARD', label: 'Tarjeta crédito' },
];

const emptyForm = () => ({
  name: '',
  resortId: 'CERRO_CATEDRAL',
  storePickupLocation: '',
  locationLatitude: '',
  locationLongitude: '',
  rentalDeliveryEnabled: false,
  enabledPaymentMethods: [],
});

export default function AdminRentalProviders() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { providers, providersLoading, providersError } = useSelector((s) => s.rental);

  const [filterResort, setFilterResort] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const load = () => {
    dispatch(getRentalProviders(filterResort ? { resortId: filterResort } : {}));
  };

  useEffect(() => {
    load();
  }, [filterResort]);

  useEffect(() => {
    if (providersError) {
      setSnackbar({ open: true, message: String(providersError), severity: 'error' });
      dispatch(clearProvidersError());
    }
  }, [providersError]);

  const rows = useMemo(() => (Array.isArray(providers) ? providers : []), [providers]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name || '',
      resortId: row.resortId || 'CERRO_CATEDRAL',
      storePickupLocation: row.storePickupLocation || '',
      locationLatitude: row.locationLatitude ?? '',
      locationLongitude: row.locationLongitude ?? '',
      rentalDeliveryEnabled: Boolean(row.rentalDeliveryEnabled),
      enabledPaymentMethods: Array.isArray(row.enabledPaymentMethods) ? [...row.enabledPaymentMethods] : [],
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const togglePayment = (value) => {
    setForm((prev) => {
      const set = new Set(prev.enabledPaymentMethods);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, enabledPaymentMethods: [...set] };
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setSnackbar({ open: true, message: 'El nombre es obligatorio', severity: 'error' });
      return;
    }
    if (!form.storePickupLocation.trim()) {
      setSnackbar({ open: true, message: 'La ubicación de retiro en tienda es obligatoria', severity: 'error' });
      return;
    }
    const hasLatitude = String(form.locationLatitude).trim() !== '';
    const hasLongitude = String(form.locationLongitude).trim() !== '';
    if (hasLatitude !== hasLongitude) {
      setSnackbar({ open: true, message: 'Latitud y longitud deben cargarse juntas', severity: 'error' });
      return;
    }
    const parsedLatitude = hasLatitude ? Number(form.locationLatitude) : null;
    const parsedLongitude = hasLongitude ? Number(form.locationLongitude) : null;
    if (hasLatitude && (!Number.isFinite(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90)) {
      setSnackbar({ open: true, message: 'Latitud inválida (rango: -90 a 90)', severity: 'error' });
      return;
    }
    if (hasLongitude && (!Number.isFinite(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180)) {
      setSnackbar({ open: true, message: 'Longitud inválida (rango: -180 a 180)', severity: 'error' });
      return;
    }
    const body = {
      name: form.name.trim(),
      resortId: form.resortId,
      storePickupLocation: form.storePickupLocation.trim(),
      locationLatitude: parsedLatitude,
      locationLongitude: parsedLongitude,
      rentalDeliveryEnabled: form.rentalDeliveryEnabled,
      enabledPaymentMethods: form.enabledPaymentMethods,
    };
    try {
      if (editingId) {
        await dispatch(updateRentalProvider({ id: editingId, ...body })).unwrap();
      } else {
        await dispatch(createRentalProvider(body)).unwrap();
      }
      setSnackbar({ open: true, message: 'Guardado correctamente', severity: 'success' });
      closeDialog();
      load();
    } catch (e) {
      setSnackbar({ open: true, message: String(e || 'Error al guardar'), severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteRentalProvider(deleteTarget.id)).unwrap();
      setSnackbar({ open: true, message: 'Proveedor eliminado', severity: 'success' });
      setDeleteTarget(null);
      load();
    } catch (e) {
      setSnackbar({ open: true, message: String(e || 'Error al eliminar'), severity: 'error' });
      setDeleteTarget(null);
    }
  };

  const resortLabel = (v) => RESORT_OPTIONS.find((o) => o.value === v)?.label || v;

  return (
    <Page title="Admin: Proveedores de rental">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Proveedores de rental"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Proveedores rental' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openCreate}>
              Nuevo proveedor
            </Button>
          }
        />

        <Stack spacing={2}>
          <Card sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <FormControl sx={{ minWidth: 220 }}>
                <InputLabel>Filtrar por resort</InputLabel>
                <Select
                  label="Filtrar por resort"
                  value={filterResort}
                  onChange={(e) => setFilterResort(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {RESORT_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={load} disabled={providersLoading}>
                Actualizar
              </Button>
            </Stack>
          </Card>

          <Card>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Resort</TableCell>
                    <TableCell>Retiro en tienda</TableCell>
                    <TableCell>Coordenadas</TableCell>
                    <TableCell>Entrega</TableCell>
                    <TableCell>Medios de pago</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </TableCell>
                      <TableCell>{resortLabel(row.resortId)}</TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>
                        <Typography variant="body2" noWrap title={row.storePickupLocation}>
                          {row.storePickupLocation}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {row.locationLatitude != null && row.locationLongitude != null
                          ? `${row.locationLatitude}, ${row.locationLongitude}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.rentalDeliveryEnabled ? 'Sí' : 'No'}
                          color={row.rentalDeliveryEnabled ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {(row.enabledPaymentMethods || []).map((m) => (
                            <Chip key={m} label={m} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar">
                          <IconButton onClick={() => openEdit(row)}>
                            <Iconify icon="eva:edit-fill" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => setDeleteTarget(row)}>
                            <Iconify icon="eva:trash-2-fill" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!providersLoading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          No hay proveedores.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>

        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? 'Editar proveedor' : 'Nuevo proveedor'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Nombre"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Resort</InputLabel>
                <Select
                  label="Resort"
                  value={form.resortId}
                  onChange={(e) => setForm((p) => ({ ...p, resortId: e.target.value }))}
                >
                  {RESORT_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Ubicación retiro en tienda"
                value={form.storePickupLocation}
                onChange={(e) => setForm((p) => ({ ...p, storePickupLocation: e.target.value }))}
                fullWidth
                required
                multiline
                minRows={3}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Latitud (opcional)"
                  value={form.locationLatitude}
                  onChange={(e) => setForm((p) => ({ ...p, locationLatitude: e.target.value }))}
                  fullWidth
                  inputProps={{ inputMode: 'decimal' }}
                />
                <TextField
                  label="Longitud (opcional)"
                  value={form.locationLongitude}
                  onChange={(e) => setForm((p) => ({ ...p, locationLongitude: e.target.value }))}
                  fullWidth
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Stack>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.rentalDeliveryEnabled}
                    onChange={(e) => setForm((p) => ({ ...p, rentalDeliveryEnabled: e.target.checked }))}
                  />
                }
                label="Entrega a domicilio / hotel habilitada"
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Medios de pago habilitados
                </Typography>
                <FormGroup>
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      control={
                        <Checkbox
                          checked={form.enabledPaymentMethods.includes(opt.value)}
                          onChange={() => togglePayment(opt.value)}
                        />
                      }
                      label={opt.label}
                    />
                  ))}
                </FormGroup>
                <FormHelperText>Opcional: puede dejarse vacío si aún no aplica.</FormHelperText>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave} disabled={providersLoading}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
          <DialogTitle>Eliminar proveedor</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Eliminar el proveedor &quot;{deleteTarget?.name}&quot;? Los productos dejarán de referenciarlo.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={handleDelete} disabled={providersLoading}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

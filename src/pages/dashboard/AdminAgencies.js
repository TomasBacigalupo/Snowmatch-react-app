import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  Tooltip,
} from '@mui/material';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import useSettings from '../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../routes/paths';
import {
  getAgencies,
  createAgency,
  updateAgency,
  deleteAgency,
  clearAgenciesError,
} from '../../redux/slices/agency';

const emptyForm = () => ({
  name: '',
  phone: '',
  email: '',
});

export default function AdminAgencies() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { agencies, agenciesLoading, agenciesError } = useSelector((s) => s.agency);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const load = () => {
    dispatch(getAgencies());
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (agenciesError) {
      setSnackbar({ open: true, message: String(agenciesError), severity: 'error' });
      dispatch(clearAgenciesError());
    }
  }, [agenciesError, dispatch]);

  const rows = useMemo(() => (Array.isArray(agencies) ? agencies : []), [agencies]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name || '',
      phone: row.phone || '',
      email: row.email || '',
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setSnackbar({ open: true, message: 'El nombre es obligatorio', severity: 'warning' });
      return;
    }
    const body = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
    };
    try {
      if (editingId) {
        await dispatch(updateAgency({ id: editingId, ...body })).unwrap();
      } else {
        await dispatch(createAgency(body)).unwrap();
      }
      setSnackbar({ open: true, message: 'Guardado correctamente', severity: 'success' });
      closeDialog();
      load();
    } catch (e) {
      setSnackbar({
        open: true,
        message: typeof e === 'string' ? e : e?.message || 'Error al guardar',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteAgency(deleteTarget.id)).unwrap();
      setSnackbar({ open: true, message: 'Agencia eliminada', severity: 'success' });
      setDeleteTarget(null);
      load();
    } catch (e) {
      setSnackbar({
        open: true,
        message: typeof e === 'string' ? e : e?.message || 'No se pudo eliminar',
        severity: 'error',
      });
    }
  };

  return (
    <Page title="Agencias">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Agencias"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Agencias' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openCreate}>
              Nueva agencia
            </Button>
          }
        />

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agenciesLoading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary">
                        Cargando...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary">
                        No hay agencias registradas.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(PATH_DASHBOARD.admin.agency(row.id))}
                    >
                      <TableCell>
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </TableCell>
                      <TableCell>{row.phone || '—'}</TableCell>
                      <TableCell>{row.email || '—'}</TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Ver reservas">
                            <IconButton
                              size="small"
                              onClick={() => navigate(PATH_DASHBOARD.admin.agency(row.id))}
                            >
                              <Iconify icon="eva:eye-outline" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => openEdit(row)}>
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteTarget(row)}
                            >
                              <Iconify icon="eva:trash-2-outline" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>{editingId ? 'Editar agencia' : 'Nueva agencia'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Nombre"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                fullWidth
              />
              <TextField
                label="Teléfono"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
          <DialogTitle>Eliminar agencia</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Eliminar <strong>{deleteTarget?.name}</strong>? No se puede eliminar si tiene reservas
              asociadas.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

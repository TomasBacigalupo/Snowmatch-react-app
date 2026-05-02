import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'src/redux/store';
import { convertBookingIntent, cancelBookingIntent } from 'src/redux/slices/admin';

AdminBookingIntentTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onRefreshIntents: PropTypes.func,
};

export default function AdminBookingIntentTableRow({ row, onRefreshIntents }) {
  const dispatch = useDispatch();
  const [assignOpen, setAssignOpen] = useState(false);
  const [teacherIdInput, setTeacherIdInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { id, student, price, resort, adults, children, lines = [], internalComment, paymentStatus, includesLaunch, includesEquipments } = row;
  const studentLabel = student ? `${student.name || ''} ${student.lastname || ''}`.trim() : '—';

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const dateRange = () => {
    if (!lines.length) return '—';
    const dates = lines.map((l) => new Date(l.endAt || l.startAt));
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(p || 0);

  const handleConvert = async () => {
    const tid = Number(teacherIdInput);
    if (!tid || Number.isNaN(tid)) {
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(
        convertBookingIntent(id, tid, async () => {
          if (onRefreshIntents) await onRefreshIntents();
        })
      );
      setAssignOpen(false);
      setTeacherIdInput('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelIntent = async () => {
    if (!window.confirm('¿Cancelar esta reserva pendiente?')) return;
    setSubmitting(true);
    try {
      await dispatch(
        cancelBookingIntent(id, async () => {
          if (onRefreshIntents) await onRefreshIntents();
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Typography variant="subtitle2">I-{id}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {studentLabel}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            Sin asignar
          </Typography>
        </TableCell>
        <TableCell>{lines.length ? `${lines.length} clases` : '—'}</TableCell>
        <TableCell>—</TableCell>
        <TableCell>
          <Typography variant="body2" noWrap>
            {dateRange()}
          </Typography>
        </TableCell>
        <TableCell>{resort || '—'}</TableCell>
        <TableCell>
          {children}/{adults}
        </TableCell>
        <TableCell>{formatPrice(price)}</TableCell>
        <TableCell>
          <Typography variant="caption" noWrap sx={{ maxWidth: 160, display: 'block' }}>
            {internalComment || '—'}
          </Typography>
        </TableCell>
        <TableCell>
          {[includesLaunch && 'Almuerzo', includesEquipments && 'Equipo'].filter(Boolean).join(', ') || '—'}
        </TableCell>
        <TableCell>{paymentStatus || '—'}</TableCell>
        <TableCell align="right">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button size="small" variant="contained" onClick={() => setAssignOpen(true)}>
              Asignar instructor
            </Button>
            <Button size="small" color="error" onClick={handleCancelIntent} disabled={submitting}>
              Cancelar
            </Button>
          </Box>
        </TableCell>
      </TableRow>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Asignar instructor</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            label="ID de instructor"
            type="number"
            value={teacherIdInput}
            onChange={(e) => setTeacherIdInput(e.target.value)}
            helperText="Ingresá el userid del instructor (mismo ID que en la grilla de profesores)."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)}>Cerrar</Button>
          <LoadingButton loading={submitting} variant="contained" onClick={handleConvert}>
            Confirmar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

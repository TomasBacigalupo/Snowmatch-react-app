import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  Button,
  FormControl,
  TextField,
  Autocomplete,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Iconify from '../../../../components/Iconify';
import { getTeachers, reassignBookingTeacher } from '../../../../redux/slices/admin';

ReassignTeacherDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default function ReassignTeacherDrawer({ open, onClose, booking, onSuccess }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { teachers } = useSelector((state) => state.admin);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentTeacherId = booking?.teacher?.id;
  const currentTeacherLabel = [booking?.teacher?.name, booking?.teacher?.lastname]
    .filter(Boolean)
    .join(' ') || '—';

  useEffect(() => {
    if (open) {
      dispatch(getTeachers(0, 'TEACHER', '', 0));
      setSelectedTeacher(null);
    }
  }, [open, dispatch]);

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!selectedTeacher?.id || !booking?.id) {
      return;
    }
    if (selectedTeacher.id === currentTeacherId) {
      enqueueSnackbar('Seleccioná un instructor distinto al actual', { variant: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const updated = await dispatch(reassignBookingTeacher(booking.id, selectedTeacher.id));
      enqueueSnackbar('Instructor reasignado correctamente', { variant: 'success' });
      if (onSuccess) {
        onSuccess(updated);
      }
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        'No se pudo reasignar el instructor';
      enqueueSnackbar(typeof message === 'string' ? message : 'No se pudo reasignar el instructor', {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      anchor="right"
      PaperProps={{
        sx: {
          paddingTop: 'env(safe-area-inset-top)',
          width: { xs: '100%', sm: 480 },
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Reasignar instructor</Typography>
          <IconButton onClick={handleClose} disabled={submitting}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Reserva
            </Typography>
            <Typography variant="body1">#{booking?.id ?? '—'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Instructor actual
            </Typography>
            <Typography variant="body1">{currentTeacherLabel}</Typography>
            {currentTeacherId && (
              <Typography variant="body2" color="text.secondary">
                ID: {currentTeacherId}
              </Typography>
            )}
          </Box>

          <FormControl fullWidth>
            <Autocomplete
              autoFocus
              options={(teachers || []).filter((t) => t?.id !== currentTeacherId)}
              value={selectedTeacher}
              onChange={(e, newValue) => setSelectedTeacher(newValue)}
              onInputChange={(e, newInputValue) => {
                dispatch(getTeachers(0, 'TEACHER', newInputValue, 0));
              }}
              getOptionLabel={(option) =>
                `${option?.name || ''} ${option?.lastname || ''}`.trim() || String(option?.id ?? '')
              }
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nuevo instructor"
                  placeholder="Buscar por nombre o apellido"
                  helperText="Escribí para filtrar instructores por nombre o apellido."
                />
              )}
            />
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <LoadingButton
            loading={submitting}
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedTeacher?.id}
          >
            Confirmar reasignación
          </LoadingButton>
        </Stack>
      </Box>
    </Drawer>
  );
}

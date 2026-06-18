import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { editAdminBooking } from 'src/redux/slices/admin';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

// Resort options from ShopFilterSidebar
const RESORT_OPTIONS = [
  { category: "Argentina", resorts: [ 'Caviahue', 'Cerro Bayo', 'Cerro Castor', 'Cerro Catedral', 'Chapelco', 'La Hoya', 'Las Leñas', 'Las Pendientes', 'Perito Moreno', 'Lago Hermoso', 'Buenos Aires'] },
  { category: "Chile", resorts: [ 'Portillo']}
];

BookingEditModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  onSave: PropTypes.func,
};

export default function BookingEditModal({ open, onClose, booking, onSave }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [userCommentLength, setUserCommentLength] = useState(booking?.userComment?.length || 0);
  const [internalCommentLength, setInternalCommentLength] = useState(booking?.internalComment?.length || 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedBooking = {
      id: booking.id,
      userComment: formData.get('userComment'),
      internalComment: formData.get('internalComment'),
      paymentStatus: formData.get('paymentStatus'),
      bookingPaymentMethod: formData.get('bookingPaymentMethod'),
      adults: parseInt(formData.get('adults'), 10) || 0,
      children: parseInt(formData.get('children'), 10) || 0,
      price: parseFloat(formData.get('price')) || 0,
      includesLaunch: formData.get('includesLaunch') === 'on',
      includesEquipments: formData.get('includesEquipments') === 'on',
      showPriceToTeacher: formData.get('showPriceToTeacher') === 'on',
      state: formData.get('state'),
      type: formData.get('type'),
      resort: formData.get('resort'),
      teacherId: formData.get('teacherId'),
      studentId: formData.get('studentId'),
    };
    console.log(updatedBooking);
    
    dispatch(editAdminBooking(booking.id, updatedBooking));
    enqueueSnackbar('Reserva actualizada exitosamente', { variant: 'success' });
    onSave({
      ...booking,
      userComment: formData.get('userComment'),
      internalComment: formData.get('internalComment'),
      studentId: formData.get('studentId'),
      teacherId: formData.get('teacherId'),
      paymentStatus: formData.get('paymentStatus'),
      bookingPaymentMethod: formData.get('bookingPaymentMethod'),
      adults: parseInt(formData.get('adults'), 10),
      children: parseInt(formData.get('children'), 10),
      includesEquipments: formData.get('includesEquipments') === 'true',
      includesLaunch: formData.get('includesLaunch') === 'true',
      showPriceToTeacher: formData.get('showPriceToTeacher') === 'on',
      price: parseFloat(formData.get('price')),
      state: formData.get('state'),
      type: formData.get('type'),
      resort: formData.get('resort'),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Reserva #{booking?.id}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label="Comentario del Cliente"
                name="userComment"
                defaultValue={booking?.userComment}
                multiline
                rows={2}
                inputProps={{ maxLength: 255 }}
                onChange={(e) => setUserCommentLength(e.target.value.length)}
                helperText={`${userCommentLength}/255 caracteres`}
              />

              <TextField
                fullWidth
                label="Comentario Interno"
                name="internalComment"
                defaultValue={booking?.internalComment}
                multiline
                rows={2}
                inputProps={{ maxLength: 255 }}
                onChange={(e) => setInternalCommentLength(e.target.value.length)}
                helperText={`${internalCommentLength}/255 caracteres`}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label="ID del Estudiante"
                name="studentId"
                defaultValue={booking?.student?.id}
              />

              <TextField
                fullWidth
                label="ID del Instructor"
                name="teacherId"
                defaultValue={booking?.teacher?.id}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>Estado de Pago</InputLabel>
                <Select
                  name="paymentStatus"
                  label="Estado de Pago"
                  defaultValue={booking?.paymentStatus || 'UNPAID'}
                >
                  <MenuItem value="PAID">Pagado</MenuItem>
                  <MenuItem value="PAID_10">10% Pagado</MenuItem>
                  <MenuItem value="PAID_20">20% Pagado</MenuItem>
                  <MenuItem value="PAID_30">30% Pagado</MenuItem>
                  <MenuItem value="PAID_40">40% Pagado</MenuItem>
                  <MenuItem value="PAID_50">50% Pagado</MenuItem>
                  <MenuItem value="UNPAID">No Pagado</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  name="bookingPaymentMethod"
                  label="Método de Pago"
                  defaultValue={booking?.bookingPaymentMethod || ''}
                >
                  <MenuItem value="CASH">Efectivo</MenuItem>
                  <MenuItem value="TRANSFER">Transferencia</MenuItem>
                  <MenuItem value="DEBIT_CARD">Tarjeta de Débito</MenuItem>
                  <MenuItem value="CREDIT_CARD">Tarjeta de Crédito</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="state"
                  label="Estado"
                  defaultValue={booking?.state || 'PENDING'}
                >
                  <MenuItem value="PENDING">Pendiente</MenuItem>
                  <MenuItem value="ACCEPTED">Confirmado</MenuItem>
                  <MenuItem value="DECLINED">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Reserva</InputLabel>
                <Select
                  name="type"
                  label="Tipo de Reserva"
                  defaultValue={booking?.type || 'ASSIGNED'}
                >
                  <MenuItem value="ASSIGNED">Asignado</MenuItem>
                  <MenuItem value="REFERRED">Referido</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Resort</InputLabel>
                <Select
                  name="resort"
                  label="Resort"
                  defaultValue={booking?.resort || ''}
                >
                  {RESORT_OPTIONS.map((country) => [
                    <MenuItem key={`${country.category}-header`} disabled sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                      {country.category}
                    </MenuItem>,
                    ...country.resorts.sort().map(resort => (
                      <MenuItem key={resort} value={resort} sx={{ pl: 3 }}>
                        {resort}
                      </MenuItem>
                    ))
                  ]).flat()}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label="Cantidad de Adultos"
                name="adults"
                type="number"
                defaultValue={booking?.adults}
                InputProps={{ inputProps: { min: 0 } }}
              />

              <TextField
                fullWidth
                label="Cantidad de Niños"
                name="children"
                type="number"
                defaultValue={booking?.children}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label="Precio"
                name="price"
                type="number"
                defaultValue={booking?.price}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  inputProps: { 
                    min: 0, 
                    step: 0.01,
                    style: { textAlign: 'right' }
                  }
                }}
                sx={{
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                }}
              />

              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ width: '100%', alignItems: { xs: 'flex-start', sm: 'center' } }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="includesEquipments"
                      defaultChecked={booking?.includesEquipments}
                    />
                  }
                  label="Incluye Equipo"
                />

                <FormControlLabel
                  control={
                    <Switch
                      name="includesLaunch"
                      defaultChecked={booking?.includesLaunch}
                    />
                  }
                  label="Incluye Almuerzo"
                />

                <FormControlLabel
                  control={
                    <Switch
                      name="showPriceToTeacher"
                      defaultChecked={booking?.showPriceToTeacher ?? true}
                    />
                  }
                  label="Mostrar precio al profesor"
                />
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { updateUserPhoneAndName } from '../../redux/slices/teachers';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

const timeWindows = [
  { value: '08:00-10:00', label: '8:00 AM - 10:00 AM' },
  { value: '10:00-12:00', label: '10:00 AM - 12:00 PM' },
  { value: '12:00-14:00', label: '12:00 PM - 2:00 PM' },
  { value: '14:00-16:00', label: '2:00 PM - 4:00 PM' },
  { value: '16:00-18:00', label: '4:00 PM - 6:00 PM' },
];

// ----------------------------------------------------------------------

export default function DeliveryForm({ initialData, onSubmit }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || user?.fullName || '',
    email: initialData.email || user?.email || '',
    phone: initialData.phone || user?.cellphone || '',
    address: initialData.address || '',
    accommodation: initialData.accommodation || '',
    reference: initialData.reference || '',
    timeWindow: initialData.timeWindow || '10:00-12:00',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Only validate name if user doesn't have it
    if (!user?.fullName && !formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Only validate phone if user doesn't have it
    if (!user?.cellphone && !formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Update user info if phone or name changed
      if (formData.phone && formData.fullName && 
          (formData.phone !== user?.cellphone || formData.fullName !== user?.fullName)) {
        dispatch(updateUserPhoneAndName(formData.phone, formData.fullName));
      }
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Información de entrega
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Te entregaremos el equipo en la dirección que especifiques. 
        Si dudás de la dirección exacta, podés agregar referencias adicionales.
      </Alert>

      <Stack spacing={3}>
        {/* Contact Information - Only show if user doesn't have complete info */}
        {(!user?.fullName || !user?.cellphone) ? (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Información de contacto
            </Typography>

            <Grid container spacing={2}>
              {!user?.fullName && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    required
                  />
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              
              {!user?.cellphone && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>
              )}
            </Grid>

            <Divider />
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Información de contacto
            </Typography>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              Usando la información de tu cuenta: {user?.fullName} • {user?.cellphone}
            </Alert>
            
            <Divider />
          </>
        )}

        {/* Delivery Address */}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Dirección de entrega
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección completa"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              placeholder="Ej: Av. San Martín 123, Bariloche"
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del alojamiento (opcional)"
              value={formData.accommodation}
              onChange={(e) => handleInputChange('accommodation', e.target.value)}
              placeholder="Ej: Hotel Llao Llao"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Ventana horaria de entrega</InputLabel>
              <Select
                value={formData.timeWindow}
                onChange={(e) => handleInputChange('timeWindow', e.target.value)}
                label="Ventana horaria de entrega"
              >
                {timeWindows.map((window) => (
                  <MenuItem key={window.value} value={window.value}>
                    {window.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Referencias adicionales (opcional)"
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              placeholder="Ej: Edificio azul, 3er piso, apto 12"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Divider />

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Continuar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
} 
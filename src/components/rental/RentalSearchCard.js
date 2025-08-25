import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Search, LocationOn, CalendarToday, AccessTime, Group } from '@mui/icons-material';
import { useRentalCart } from '../../contexts/RentalCartContext';
import { PATH_GUEST } from '../../routes/paths';

// ----------------------------------------------------------------------

const locations = [
  { value: 'bariloche', label: 'Bariloche', region: 'Río Negro' },
  { value: 'chapelco', label: 'Chapelco', region: 'Neuquén' },
  { value: 'cerro-catedral', label: 'Cerro Catedral', region: 'Río Negro' },
  { value: 'las-lenas', label: 'Las Leñas', region: 'Mendoza' },
  { value: 'valle-nevado', label: 'Valle Nevado', region: 'Chile' },
  { value: 'portillo', label: 'Portillo', region: 'Chile' },
];

const timeSlots = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
];

// ----------------------------------------------------------------------

export default function RentalSearchCard({ variant = 'default', onSearch }) {
  const navigate = useNavigate();
  const { setSearchParams, deliveryDate, pickupDate, deliveryTime, location, adults, kids } = useRentalCart();
  
  const [formData, setFormData] = useState({
    location: location || '',
    deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
    pickupDate: pickupDate ? new Date(pickupDate) : null,
    deliveryTime: deliveryTime || '09:00',
    adults: adults || 1,
    kids: kids || 0,
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
    
    if (!formData.location) {
      newErrors.location = 'Selecciona un destino';
    }
    
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Selecciona fecha de entrega';
    }
    
    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Selecciona fecha de retiro';
    }
    
    if (formData.deliveryDate && formData.pickupDate) {
      if (formData.deliveryDate >= formData.pickupDate) {
        newErrors.pickupDate = 'La fecha de retiro debe ser posterior a la entrega';
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (formData.deliveryDate < today) {
        newErrors.deliveryDate = 'La fecha de entrega no puede ser anterior a hoy';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!validateForm()) return;

    const searchParams = {
      location: formData.location,
      deliveryDate: formData.deliveryDate.toISOString().split('T')[0],
      pickupDate: formData.pickupDate.toISOString().split('T')[0],
      deliveryTime: formData.deliveryTime,
      adults: formData.adults,
      kids: formData.kids,
    };

    setSearchParams(searchParams);

    if (onSearch) {
      onSearch(searchParams);
    } else {
      navigate(PATH_GUEST.rentalLocation(formData.location));
    }
  };

  const selectedLocation = locations.find(loc => loc.value === formData.location);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Card
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          boxShadow: (theme) => theme.customShadows.z24,
          background: (theme) => theme.palette.background.paper,
          ...(variant === 'sticky' && {
            position: 'sticky',
            top: 20,
            zIndex: 1000,
          }),
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Encuentra tu equipo perfecto
        </Typography>

        <Stack spacing={3}>
          {/* Location */}
          <FormControl fullWidth error={!!errors.location}>
            <InputLabel>Destino</InputLabel>
            <Select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn color="action" />
                </InputAdornment>
              }
            >
              {locations.map((loc) => (
                <MenuItem key={loc.value} value={loc.value}>
                  <Box>
                    <Typography variant="body2">{loc.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {loc.region}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.location && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.location}
              </Typography>
            )}
          </FormControl>

          {/* Date Range */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <DatePicker
              label="Fecha de entrega"
              value={formData.deliveryDate}
              onChange={(date) => handleInputChange('deliveryDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.deliveryDate}
                  helperText={errors.deliveryDate}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              minDate={new Date()}
            />
            
            <DatePicker
              label="Fecha de retiro"
              value={formData.pickupDate}
              onChange={(date) => handleInputChange('pickupDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.pickupDate}
                  helperText={errors.pickupDate}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              minDate={formData.deliveryDate || new Date()}
            />
          </Stack>

          {/* Delivery Time */}
          <FormControl fullWidth>
            <InputLabel>Horario de entrega</InputLabel>
            <Select
              value={formData.deliveryTime}
              onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <AccessTime color="action" />
                </InputAdornment>
              }
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot.value} value={slot.value}>
                  {slot.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Passengers */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Adultos</InputLabel>
              <Select
                value={formData.adults}
                onChange={(e) => handleInputChange('adults', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Group color="action" />
                  </InputAdornment>
                }
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} {num === 1 ? 'adulto' : 'adultos'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Niños</InputLabel>
              <Select
                value={formData.kids}
                onChange={(e) => handleInputChange('kids', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Group color="action" />
                  </InputAdornment>
                }
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} {num === 0 ? 'niños' : num === 1 ? 'niño' : 'niños'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Summary Chips */}
          {selectedLocation && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Resumen:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={selectedLocation.label}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {formData.deliveryDate && (
                  <Chip
                    label={`${formData.deliveryDate.toLocaleDateString('es-ES')} - ${formData.pickupDate?.toLocaleDateString('es-ES')}`}
                    size="small"
                    variant="outlined"
                  />
                )}
                <Chip
                  label={`${formData.adults + formData.kids} ${formData.adults + formData.kids === 1 ? 'persona' : 'personas'}`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
          )}

          <Divider />

          {/* Search Button */}
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleSearch}
            startIcon={<Search />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Ver equipos disponibles
          </Button>
        </Stack>
      </Card>
    </LocalizationProvider>
  );
} 
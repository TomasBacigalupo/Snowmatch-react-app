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
  Card,
  CardContent,
  IconButton,
  Alert,
  Divider,
} from '@mui/material';
import { Add, Delete, ArrowBack, ArrowForward } from '@mui/icons-material';
import { useRentalCart } from '../../contexts/RentalCartContext';

// ----------------------------------------------------------------------

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const styles = ['Pista', 'Powder', 'All-Mountain'];
const flexPreferences = ['Suave', 'Medio', 'Firme'];

// ----------------------------------------------------------------------

export default function RiderForm({ initialData, onSubmit, onBack }) {
  const { adults, kids } = useRentalCart();
  const totalRiders = adults + kids;
  
  const [riders, setRiders] = useState(initialData.length > 0 ? initialData : [
    {
      name: '',
      height: '',
      weight: '',
      footSize: '',
      footSizeSystem: 'US',
      level: '',
      style: '',
      flexPreference: '',
    }
  ]);

  const [errors, setErrors] = useState({});

  const addRider = () => {
    if (riders.length < totalRiders) {
      setRiders([...riders, {
        name: '',
        height: '',
        weight: '',
        footSize: '',
        footSizeSystem: 'US',
        level: '',
        style: '',
        flexPreference: '',
      }]);
    }
  };

  const removeRider = (index) => {
    if (riders.length > 1) {
      setRiders(riders.filter((_, i) => i !== index));
    }
  };

  const updateRider = (index, field, value) => {
    const updatedRiders = [...riders];
    updatedRiders[index] = { ...updatedRiders[index], [field]: value };
    setRiders(updatedRiders);
    
    // Clear error for this field
    if (errors[`${index}-${field}`]) {
      setErrors(prev => ({ ...prev, [`${index}-${field}`]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    riders.forEach((rider, index) => {
      if (!rider.name.trim()) {
        newErrors[`${index}-name`] = 'El nombre es requerido';
      }
      if (!rider.height) {
        newErrors[`${index}-height`] = 'La altura es requerida';
      }
      if (!rider.weight) {
        newErrors[`${index}-weight`] = 'El peso es requerido';
      }
      if (!rider.footSize) {
        newErrors[`${index}-footSize`] = 'La talla de pie es requerida';
      }
      if (!rider.level) {
        newErrors[`${index}-level`] = 'El nivel es requerido';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(riders);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Información de riders
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Si dudás de la talla, no te preocupes. La ajustamos al entregar el equipo.
      </Alert>

      <Stack spacing={3}>
        {riders.map((rider, index) => (
          <Card key={index} sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Rider {index + 1}
              </Typography>
              {riders.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeRider(index)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              )}
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={rider.name}
                  onChange={(e) => updateRider(index, 'name', e.target.value)}
                  error={!!errors[`${index}-name`]}
                  helperText={errors[`${index}-name`]}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Altura (cm)"
                  type="number"
                  value={rider.height}
                  onChange={(e) => updateRider(index, 'height', e.target.value)}
                  error={!!errors[`${index}-height`]}
                  helperText={errors[`${index}-height`]}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Peso (kg)"
                  type="number"
                  value={rider.weight}
                  onChange={(e) => updateRider(index, 'weight', e.target.value)}
                  error={!!errors[`${index}-weight`]}
                  helperText={errors[`${index}-weight`]}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Sistema de talla</InputLabel>
                  <Select
                    value={rider.footSizeSystem}
                    onChange={(e) => updateRider(index, 'footSizeSystem', e.target.value)}
                    label="Sistema de talla"
                  >
                    <MenuItem value="US">US</MenuItem>
                    <MenuItem value="EU">EU</MenuItem>
                    <MenuItem value="MP">MP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Talla de pie"
                  value={rider.footSize}
                  onChange={(e) => updateRider(index, 'footSize', e.target.value)}
                  error={!!errors[`${index}-footSize`]}
                  helperText={errors[`${index}-footSize`]}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Nivel</InputLabel>
                  <Select
                    value={rider.level}
                    onChange={(e) => updateRider(index, 'level', e.target.value)}
                    label="Nivel"
                    error={!!errors[`${index}-level`]}
                  >
                    {levels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Estilo preferido</InputLabel>
                  <Select
                    value={rider.style}
                    onChange={(e) => updateRider(index, 'style', e.target.value)}
                    label="Estilo preferido"
                  >
                    {styles.map((style) => (
                      <MenuItem key={style} value={style}>
                        {style}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Preferencia de flex</InputLabel>
                  <Select
                    value={rider.flexPreference}
                    onChange={(e) => updateRider(index, 'flexPreference', e.target.value)}
                    label="Preferencia de flex"
                  >
                    {flexPreferences.map((flex) => (
                      <MenuItem key={flex} value={flex}>
                        {flex}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
        ))}

        {riders.length < totalRiders && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addRider}
            sx={{ alignSelf: 'flex-start' }}
          >
            Agregar rider
          </Button>
        )}

        <Divider />

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ py: 1.5, px: 4, borderRadius: 2 }}
          >
            Atrás
          </Button>

          <Button
            type="submit"
            variant="contained"
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
        </Stack>
      </Stack>
    </Box>
  );
} 
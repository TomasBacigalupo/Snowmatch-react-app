import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, Alert, CircularProgress } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import Iconify from '../../../components/Iconify';
import axios from '../../../utils/axios';

StudentResortsStep.propTypes = {
  validateField: PropTypes.func.isRequired,
};

export default function StudentResortsStep({ validateField }) {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setValue, watch } = useFormContext();
  const selectedResorts = watch('resorts') || [];

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/enums/resorts');
        console.log('API response data:', response.data);
        console.log('First resort example:', response.data[0]);
        console.log('Type of first resort:', typeof response.data[0]);
        console.log('Keys of first resort:', Object.keys(response.data[0] || {}));
        setResorts(response.data);
      } catch (err) {
        console.error('Error fetching resorts:', err);
        setError('Error al cargar los resorts. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, []);

  // Transform API data to match the expected format
  const getAllResorts = () => {
    if (!resorts || resorts.length === 0) {
      return [];
    }
    
    return resorts.map(resort => {
      // Get the value from the resort object (could be resort.value or just resort)
      const resortValue = resort.value || resort;
      
      // Convert "CERRO_CATEDRAL" to "Cerro Catedral"
      const name = resortValue
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        name: name,
        value: resortValue
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:map-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          ¿Dónde sueles esquiar?
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Selecciona los resorts donde esquías habitualmente. Esto nos ayuda a conectarte con instructores locales
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Puedes seleccionar múltiples resorts. Esto nos ayuda a recomendarte instructores en tus destinos favoritos.
        </Typography>
      </Alert>
      
      <Stack spacing={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
              Cargando resorts...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Autocomplete
            value={selectedResorts.map(enumValue => 
              getAllResorts().find(option => option.value === enumValue)
            ).filter(Boolean)}
            onChange={(event, newValue) => {
              const enumValues = newValue.map(option => option.value);
              setValue('resorts', enumValues);
              validateField('resorts', enumValues);
            }}
            options={getAllResorts()}
            getOptionLabel={(option) => option?.name || ''}
            multiple
            limitTags={3}
            filterSelectedOptions
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option?.name || ''}
              </Box>
            )}
            filterOptions={(options, { inputValue }) => {
              const filtered = options.filter((option) =>
                option?.name?.toLowerCase().includes(inputValue.toLowerCase())
              );
              return filtered;
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option?.value || index}
                  label={option?.name || ''}
                  {...getTagProps({ index })}
                  sx={{ 
                    color: 'text.primary',
                    borderColor: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                  variant="outlined"
                  size="small"
                />
              ))
            }
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar resorts"
                placeholder="Escribe para buscar resorts..."
                helperText="Puedes seleccionar múltiples resorts"
                fullWidth
              />
            )}
            freeSolo={false}
            disableCloseOnSelect={true}
          />
        )}
        
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Resorts populares:</strong> Cerro Catedral, Chapelco, Valle Nevado, Aspen, Vail, Whistler, Chamonix
          </Typography>
        </Box>
      </Stack>
    </m.div>
  );
}
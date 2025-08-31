import PropTypes from 'prop-types';
// @mui
import { Box, Typography, Stack, Chip, Alert } from '@mui/material';
// framer motion
import { m } from 'framer-motion';
// hooks
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { RHFAutocomplete } from '../../../components/hook-form';
// mock
import { FILTER_RESORT_OPTIONS } from '../../@dashboard/e-commerce/shop/ShopFilterSidebar';

// ----------------------------------------------------------------------

ResortSelection.propTypes = {
  // Add any props if needed in the future
};

// Create a flat list of all resorts for autocomplete
const getAllResorts = () => {
  const allResorts = [];
  FILTER_RESORT_OPTIONS.forEach((country) => {
    country.resorts.forEach((resort) => {
      allResorts.push({
        name: resort,
        category: country.category
      });
    });
  });
  return allResorts.sort((a, b) => a.name.localeCompare(b.name));
};

export default function ResortSelection() {
  const { translate } = useLocales();

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:map-fill" sx={{ fontSize: 24, color: 'text.primary', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          Resorts donde das clases
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Selecciona hasta 10 resorts donde impartes clases. Los estudiantes podrán encontrarte en estos destinos.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Consejo:</strong> Selecciona los resorts donde tienes más experiencia o donde planeas estar disponible regularmente.
        </Typography>
      </Alert>
      
      <Stack spacing={3}>
        <RHFAutocomplete
          name="resorts"
          label="Buscar y seleccionar resorts"
          placeholder="Escribe el nombre del resort..."
          options={getAllResorts()}
          getOptionLabel={(option) => option.name}
          groupBy={(option) => option.category}
          multiple
          limitTags={3}
          filterSelectedOptions
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option.name}
            </Box>
          )}
          filterOptions={(options, { inputValue }) => {
            const filtered = options.filter((option) =>
              option.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            return filtered;
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option.name}
                label={option.name}
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
          isOptionEqualToValue={(option, value) => option.name === value.name}
          helperText="Máximo 10 resorts. Puedes agregar o quitar resorts más tarde desde tu perfil."
        />
        
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Resorts populares:</strong> Cerro Catedral, Chapelco, Las Leñas, Portillo, Aspen, Vail, Whistler, Chamonix
          </Typography>
        </Box>
      </Stack>
    </m.div>
  );
} 
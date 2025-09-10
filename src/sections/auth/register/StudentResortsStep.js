import PropTypes from 'prop-types';
import { Box, Typography, Stack, Chip, Alert } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../../components/Iconify';
import { RHFAutocomplete } from '../../../components/hook-form';
import { FILTER_RESORT_OPTIONS } from '../../@dashboard/e-commerce/shop/ShopFilterSidebar';

StudentResortsStep.propTypes = {
  validateField: PropTypes.func.isRequired,
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

export default function StudentResortsStep({ validateField }) {

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
        <RHFAutocomplete
          name="resorts"
          label="Buscar resorts"
          placeholder="Escribe para buscar resorts..."
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
          helperText="Puedes seleccionar múltiples resorts"
          freeSolo={false}
          disableCloseOnSelect={true}
        />
        
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Resorts populares:</strong> Cerro Catedral, Chapelco, Valle Nevado, Aspen, Vail, Whistler, Chamonix
          </Typography>
        </Box>
      </Stack>
    </m.div>
  );
}
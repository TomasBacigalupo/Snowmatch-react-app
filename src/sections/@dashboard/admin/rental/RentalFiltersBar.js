import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Button,
  Card,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RESORT_OPTIONS = [
  { value: '', label: 'Todos los resorts' },
  { value: 'CERRO_CATEDRAL', label: 'Cerro Catedral' },
  { value: 'CERRO_CASTOR', label: 'Cerro Castor' },
  { value: 'CHAPELCO', label: 'Chapelco' },
  { value: 'LA_HOYA', label: 'La Hoya' },
  { value: 'LAS_LEÑAS', label: 'Las Leñas' },
  { value: 'CERRO_BAYO', label: 'Cerro Bayo' },
];

RentalFiltersBar.propTypes = {
  filterCategory: PropTypes.string,
  filterStatus: PropTypes.string,
  filterResort: PropTypes.string,
  onFilterCategory: PropTypes.func,
  onFilterStatus: PropTypes.func,
  onFilterResort: PropTypes.func,
  categoryOptions: PropTypes.array,
  statusOptions: PropTypes.array,
  lockResort: PropTypes.string,
};

export default function RentalFiltersBar({
  filterCategory,
  filterStatus,
  filterResort,
  onFilterCategory,
  onFilterStatus,
  onFilterResort,
  categoryOptions = [],
  statusOptions = [],
  lockResort = null,
}) {
  const handleClearFilters = () => {
    onFilterCategory('all');
    onFilterStatus('all');
    if (!lockResort) {
      onFilterResort('');
    }
  };

  const hasActiveFilters = filterCategory !== 'all' || filterStatus !== 'all' || (!lockResort && filterResort);

  return (
    <Card sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          width: 1,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          sx={{ flex: { md: '1 1 0%' }, minWidth: 0 }}
        >
        {/* Resort Filter */}
        <TextField
          select
          size="small"
          value={filterResort}
          onChange={(e) => onFilterResort(e.target.value)}
          label="Resort"
          sx={{ minWidth: 150 }}
          disabled={Boolean(lockResort)}
        >
          {(lockResort
            ? RESORT_OPTIONS.filter((option) => option.value === lockResort)
            : RESORT_OPTIONS
          ).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Category Filter */}
        <TextField
          select
          size="small"
          value={filterCategory}
          onChange={(e) => onFilterCategory(e.target.value)}
          label="Categoría"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Todas las categorías</MenuItem>
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Status Filter */}
        <TextField
          select
          size="small"
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value)}
          label="Estado"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Todos los estados</MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          startIcon={<Iconify icon="eva:refresh-fill" />}
          sx={{ flexShrink: 0, alignSelf: { xs: 'flex-end', md: 'center' } }}
        >
          Limpiar filtros
        </Button>
      </Box>
    </Card>
  );
} 
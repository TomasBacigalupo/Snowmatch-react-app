import PropTypes from 'prop-types';
import {
  Stack,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Chip,
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
  filterName: PropTypes.string,
  filterCategory: PropTypes.string,
  filterStatus: PropTypes.string,
  filterResort: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterCategory: PropTypes.func,
  onFilterStatus: PropTypes.func,
  onFilterResort: PropTypes.func,
  categoryOptions: PropTypes.array,
  statusOptions: PropTypes.array,
};

export default function RentalFiltersBar({
  filterName,
  filterCategory,
  filterStatus,
  filterResort,
  onFilterName,
  onFilterCategory,
  onFilterStatus,
  onFilterResort,
  categoryOptions = [],
  statusOptions = [],
}) {
  const handleClearFilters = () => {
    onFilterName('');
    onFilterCategory('all');
    onFilterStatus('all');
    onFilterResort('');
  };

  const hasActiveFilters = filterName || filterCategory !== 'all' || filterStatus !== 'all' || filterResort;

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">Filtros</Typography>

        {/* Filter Controls */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {/* Name Filter */}
          <TextField
            fullWidth
            size="small"
            value={filterName}
            onChange={(e) => onFilterName(e.target.value)}
            placeholder="Buscar por nombre..."
            InputProps={{
              startAdornment: <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled' }} />,
            }}
          />

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

          {/* Resort Filter */}
          <TextField
            select
            size="small"
            value={filterResort}
            onChange={(e) => onFilterResort(e.target.value)}
            label="Resort"
            sx={{ minWidth: 150 }}
          >
            {RESORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {/* Action Buttons */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}
        >
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            startIcon={<Iconify icon="eva:refresh-fill" />}
          >
            Limpiar Filtros
          </Button>
        </Stack>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Filtros activos:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {filterName && (
                <Chip
                  label={`Nombre: ${filterName}`}
                  onDelete={() => onFilterName('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {filterCategory !== 'all' && (
                <Chip
                  label={`Categoría: ${categoryOptions.find(o => o.value === filterCategory)?.label || filterCategory}`}
                  onDelete={() => onFilterCategory('all')}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {filterStatus !== 'all' && (
                <Chip
                  label={`Estado: ${statusOptions.find(o => o.value === filterStatus)?.label || filterStatus}`}
                  onDelete={() => onFilterStatus('all')}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {filterResort && (
                <Chip
                  label={`Resort: ${RESORT_OPTIONS.find(o => o.value === filterResort)?.label || filterResort}`}
                  onDelete={() => onFilterResort('')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
} 
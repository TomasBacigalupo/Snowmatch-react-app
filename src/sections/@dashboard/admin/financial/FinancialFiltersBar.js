import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Stack,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// utils
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

const RESORT_OPTIONS = [
  'Cerro Catedral',
  'Chapelco',
  'Cerro Bayo',
  'Cerro Castor',
  'Las Pendientes',
  'Lago Hermoso',
  'Las Leñas',
  'Perito Moreno',
];

const BOOKING_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

const PAYOUT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'all', label: 'All Methods' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'cash', label: 'Cash' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'other', label: 'Other' },
];

FinancialFiltersBar.propTypes = {
  filters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default function FinancialFiltersBar({
  filters,
  onFiltersChange,
  onClearFilters,
  onExportCSV,
  loading = false,
}) {
  const [instructors, setInstructors] = useState([]);
  const [instructorSearch, setInstructorSearch] = useState('');
  const [loadingInstructors, setLoadingInstructors] = useState(false);

  const MONTH_OPTIONS = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  // Load instructors for autocomplete
  useEffect(() => {
    if (instructorSearch.length >= 2) {
      loadInstructors();
    }
  }, [instructorSearch]);

  const loadInstructors = async () => {
    setLoadingInstructors(true);
    try {
      const response = await axios.get(`/api/admin/teachers/search?name=${instructorSearch}`);
      setInstructors(response.data);
    } catch (error) {
      console.error('Error loading instructors:', error);
    } finally {
      setLoadingInstructors(false);
    }
  };

  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleMonthChange = (event) => {
    onFiltersChange({
      ...filters,
      month: parseInt(event.target.value),
    });
  };

  const handleInstructorChange = (event, newValue) => {
    handleFilterChange('instructor', newValue ? newValue.id : '');
  };

  const handleInstructorInputChange = (event, newInputValue) => {
    setInstructorSearch(newInputValue);
  };

  return (
    <Stack spacing={3}>
        <Typography variant="h6">Filters</Typography>
        
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ alignItems: 'stretch' }}
        >
          {/* Month Selector */}
          <TextField
            fullWidth
            select
            label="Mes"
            value={filters.month}
            onChange={handleMonthChange}
            SelectProps={{
              MenuProps: {
                sx: { '& .MuiPaper-root': { maxHeight: 260 } },
              },
            }}
            sx={{ minWidth: { md: 200 } }}
          >
            {MONTH_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Resort */}
          <TextField
            fullWidth
            select
            label="Resort"
            value={filters.resort}
            onChange={(e) => handleFilterChange('resort', e.target.value)}
            sx={{ minWidth: { md: 200 } }}
          >
            {RESORT_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Instructor Autocomplete */}
          <Autocomplete
            fullWidth
            options={instructors}
            getOptionLabel={(option) => option.name || ''}
            value={instructors.find(i => i.id === filters.instructor) || null}
            onChange={handleInstructorChange}
            onInputChange={handleInstructorInputChange}
            loading={loadingInstructors}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Instructor"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingInstructors ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            sx={{ minWidth: { md: 250 } }}
          />
        </Stack>

        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ alignItems: 'stretch' }}
        >
          {/* Booking Status */}
          <TextField
            fullWidth
            select
            label="Booking Status"
            value={filters.bookingStatus}
            onChange={(e) => handleFilterChange('bookingStatus', e.target.value)}
            sx={{ minWidth: { md: 180 } }}
          >
            {BOOKING_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Payout Status */}
          <TextField
            fullWidth
            select
            label="Payout Status"
            value={filters.payoutStatus}
            onChange={(e) => handleFilterChange('payoutStatus', e.target.value)}
            sx={{ minWidth: { md: 180 } }}
          >
            {PAYOUT_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Payment Method */}
          <TextField
            fullWidth
            select
            label="Payment Method"
            value={filters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
            sx={{ minWidth: { md: 180 } }}
          >
            {PAYMENT_METHOD_OPTIONS.map((option) => (
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
            onClick={onClearFilters}
            disabled={loading}
            startIcon={<Iconify icon="eva:refresh-fill" />}
          >
            Clear Filters
          </Button>

          <Button
            variant="contained"
            onClick={onExportCSV}
            disabled={loading}
            startIcon={<Iconify icon="eva:download-fill" />}
          >
            Export CSV
          </Button>
        </Stack>

        {/* Active Filters Display */}
        <Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {filters.month !== new Date().getMonth() + 1 && (
              <Chip
                label={`Mes: ${MONTH_OPTIONS.find(o => o.value === filters.month)?.label}`}
                onDelete={() => handleFilterChange('month', new Date().getMonth() + 1)}
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.resort !== 'Cerro Catedral' && (
              <Chip
                label={`Resort: ${filters.resort}`}
                onDelete={() => handleFilterChange('resort', 'Cerro Catedral')}
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.instructor && (
              <Chip
                label={`Instructor: ${instructors.find(i => i.id === filters.instructor)?.name || filters.instructor}`}
                onDelete={() => handleFilterChange('instructor', '')}
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.bookingStatus !== 'all' && (
              <Chip
                label={`Booking: ${BOOKING_STATUS_OPTIONS.find(o => o.value === filters.bookingStatus)?.label}`}
                onDelete={() => handleFilterChange('bookingStatus', 'all')}
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.payoutStatus !== 'all' && (
              <Chip
                label={`Payout: ${PAYOUT_STATUS_OPTIONS.find(o => o.value === filters.payoutStatus)?.label}`}
                onDelete={() => handleFilterChange('payoutStatus', 'all')}
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.paymentMethod !== 'all' && (
              <Chip
                label={`Payment: ${PAYMENT_METHOD_OPTIONS.find(o => o.value === filters.paymentMethod)?.label}`}
                onDelete={() => handleFilterChange('paymentMethod', 'all')}
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      </Stack>
  );
} 
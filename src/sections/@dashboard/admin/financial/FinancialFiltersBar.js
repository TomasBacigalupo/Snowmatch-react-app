import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
// redux
import { getTeachers } from '../../../../redux/slices/admin';
// utils
import {
  ADMIN_BOOKING_RESORT_FILTER_OPTIONS,
  formatAdminBookingResortLabel,
} from '../../../../utils/adminBookingResortOptions';

// ----------------------------------------------------------------------

const YEAR_OPTIONS = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - i);

const BOOKING_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'DECLINED', label: 'Declined' },
];

const PAYOUT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'all', label: 'All Methods' },
  { value: 'CASH', label: 'Cash' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
];

const RESORT_OPTIONS = [
  { value: 'all', label: 'All Resorts' },
  ...ADMIN_BOOKING_RESORT_FILTER_OPTIONS,
];

const getInstructorLabel = (option) => {
  if (!option) return '';
  return `${option.name || ''} ${option.lastname || ''}`.trim() || String(option.id ?? '');
};

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
  const dispatch = useDispatch();
  const { teachers, isLoading } = useSelector((state) => state.admin);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

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

  useEffect(() => {
    if (!filters.instructor) {
      setSelectedInstructor(null);
    }
  }, [filters.instructor]);

  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleMonthChange = (event) => {
    onFiltersChange({
      ...filters,
      month: parseInt(event.target.value, 10),
    });
  };

  const handleYearChange = (event) => {
    onFiltersChange({
      ...filters,
      year: parseInt(event.target.value, 10),
    });
  };

  const handleInstructorChange = (event, newValue) => {
    setSelectedInstructor(newValue);
    handleFilterChange('instructor', newValue ? newValue.id : '');
  };

  const handleInstructorInputChange = (event, newInputValue, reason) => {
    if (reason === 'input' && newInputValue.length >= 2) {
      dispatch(getTeachers(0, 'TEACHER', newInputValue, 0));
    }
  };

  const instructorOptions = teachers || [];

  return (
    <Stack spacing={3}>
        <Typography variant="h6">Filters</Typography>
        
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ alignItems: 'stretch' }}
        >
          {/* Year Selector */}
          <TextField
            fullWidth
            select
            label="Año"
            value={filters.year}
            onChange={handleYearChange}
            SelectProps={{
              MenuProps: {
                sx: { '& .MuiPaper-root': { maxHeight: 260 } },
              },
            }}
            sx={{ minWidth: { md: 140 } }}
          >
            {YEAR_OPTIONS.map((year) => (
              <MenuItem
                key={year}
                value={year}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                }}
              >
                {year}
              </MenuItem>
            ))}
          </TextField>

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
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Instructor Autocomplete */}
          <Autocomplete
            fullWidth
            options={instructorOptions}
            getOptionLabel={getInstructorLabel}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            value={selectedInstructor}
            onChange={handleInstructorChange}
            onInputChange={handleInstructorInputChange}
            loading={isLoading}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Instructor"
                placeholder="Buscar por nombre o apellido"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
            {filters.year !== new Date().getFullYear() && (
              <Chip
                label={`Año: ${filters.year}`}
                onDelete={() => handleFilterChange('year', new Date().getFullYear())}
                color="primary"
                variant="outlined"
              />
            )}

            {filters.month !== new Date().getMonth() + 1 && (
              <Chip
                label={`Mes: ${MONTH_OPTIONS.find(o => o.value === filters.month)?.label}`}
                onDelete={() => handleFilterChange('month', new Date().getMonth() + 1)}
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.resort && filters.resort !== 'all' && (
              <Chip
                label={`Resort: ${formatAdminBookingResortLabel(filters.resort)}`}
                onDelete={() => handleFilterChange('resort', 'all')}
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.instructor && (
              <Chip
                label={`Instructor: ${getInstructorLabel(selectedInstructor) || filters.instructor}`}
                onDelete={() => {
                  setSelectedInstructor(null);
                  handleFilterChange('instructor', '');
                }}
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

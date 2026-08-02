import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Stack, TextField, MenuItem, Typography, Box } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ADMIN_BOOKING_RESORT_FILTER_OPTIONS } from '../../../../utils/adminBookingResortOptions';

FinancialFiltersBar.propTypes = {
  dateRange: PropTypes.array.isRequired,
  onDateRangeChange: PropTypes.func.isRequired,
  resort: PropTypes.string.isRequired,
  onResortChange: PropTypes.func.isRequired,
};

export default function FinancialFiltersBar({ dateRange, onDateRangeChange, resort, onResortChange }) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t('adminFinancial.filtersTitle')}</Typography>
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ alignItems: { md: 'flex-start' } }}
      >
        <Box sx={{ flex: 1, minWidth: { md: 320 } }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              localeText={{
                start: t('adminFinancial.startDate'),
                end: t('adminFinancial.endDate'),
              }}
              value={dateRange}
              onChange={onDateRangeChange}
              slotProps={{
                textField: { fullWidth: true, size: 'small' },
              }}
            />
          </LocalizationProvider>
        </Box>
        <TextField
          select
          size="small"
          label={t('adminFinancial.resort')}
          value={resort}
          onChange={(e) => onResortChange(e.target.value)}
          sx={{ minWidth: { md: 220 } }}
        >
          {ADMIN_BOOKING_RESORT_FILTER_OPTIONS.map((option) => (
            <MenuItem key={option.value || 'all'} value={option.value}>
              {option.labelKey ? t(option.labelKey) : option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}

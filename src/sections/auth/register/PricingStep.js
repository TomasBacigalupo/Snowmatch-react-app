import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { Box, Typography, Stack, Grid, TextField, InputAdornment, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// framer motion
import { m } from 'framer-motion';
// hooks
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { RHFTextField, RHFSelect } from '../../../components/hook-form';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

PricingStep.propTypes = {
  validateField: PropTypes.func
};

export default function PricingStep({ validateField }) {
  const { translate } = useLocales();
  const { watch, setValue, getValues } = useFormContext();
  
  // Watch form values
  const currency = watch('currency') || 'USD';
  const price2Hours = watch('price2Hours') || '';
  const price3Hours = watch('price3Hours') || '';
  const price6Hours = watch('price6Hours') || '';

  const currencies = [
    { code: 'USD', symbol: '$', name: translate('registerForm.pricing.currencies.USD') },
    { code: 'EUR', symbol: '€', name: translate('registerForm.pricing.currencies.EUR') },
    { code: 'ARS', symbol: '$', name: translate('registerForm.pricing.currencies.ARS') },
    { code: 'CLP', symbol: '$', name: translate('registerForm.pricing.currencies.CLP') },
    { code: 'GBP', symbol: '£', name: translate('registerForm.pricing.currencies.GBP') },
    { code: 'CHF', symbol: 'CHF', name: translate('registerForm.pricing.currencies.CHF') },
    { code: 'CAD', symbol: 'C$', name: translate('registerForm.pricing.currencies.CAD') }
  ];

  const currentCurrency = currencies.find(c => c.code === currency);

  const pricingOptions = [
    {
      title: translate('registerForm.pricing.options.2hours.title'),
      tip: translate('registerForm.pricing.options.2hours.tip'),
      field: "price2Hours",
      value: price2Hours
    },
    {
      title: translate('registerForm.pricing.options.3hours.title'),
      tip: translate('registerForm.pricing.options.3hours.tip'),
      field: "price3Hours",
      value: price3Hours
    },
    {
      title: translate('registerForm.pricing.options.6hours.title'),
      tip: translate('registerForm.pricing.options.6hours.tip'),
      field: "price6Hours",
      value: price6Hours
    }
  ];

  const handlePriceChange = (field, value) => {
    setValue(field, value);
    if (validateField) {
      validateField(field, value);
    }
  };

  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    setValue('currency', newCurrency);
    if (validateField) {
      validateField('currency', newCurrency);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:credit-card-fill" sx={{ fontSize: 24, color: 'text.primary', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {translate('registerForm.pricing.title')}
        </Typography>
      </Box>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>{translate('registerForm.pricing.currency')}</InputLabel>
        <Select
          value={currency}
          label={translate('registerForm.pricing.currency')}
          onChange={handleCurrencyChange}
        >
          {currencies.map((curr) => (
            <MenuItem key={curr.code} value={curr.code}>
              {curr.symbol} - {curr.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack spacing={2}>
        {pricingOptions.map((option, index) => (
          <Box key={index}>
            <Typography variant="h6" sx={{ fontWeight: 600,  }}>
              {option.title}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {option.tip}
            </Typography>

            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0 }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {currentCurrency.symbol}
                  </Typography>
                  <TextField
                    type="number"
                    value={option.value}
                    onChange={(e) => handlePriceChange(option.field, e.target.value)}
                    sx={{
                      width: 160,
                      '& .MuiOutlinedInput-root': {
                        fontSize: '2rem',
                        fontWeight: 650,
                        textAlign: 'flex-start',
                        '& fieldset': {
                          border: 'none'
                        },
                        '&:hover fieldset': {
                          border: 'none'
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none'
                        }
                      },
                      '& .MuiInputBase-input': {
                        textAlign: 'flex-start'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            
            {index < pricingOptions.length - 1 && (
              <Divider sx={{ mt: 0 }} />
            )}
          </Box>
        ))}
      </Stack>

      {/* Hidden form fields for form submission */}
      <Box sx={{ display: 'none' }}>
        <RHFTextField name="currency" />
        <RHFTextField name="price2Hours" />
        <RHFTextField name="price3Hours" />
        <RHFTextField name="price6Hours" />
      </Box>
    </m.div>
  );
} 
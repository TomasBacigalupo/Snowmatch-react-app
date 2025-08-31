import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { Box, Typography, Stack, Grid, TextField, InputAdornment, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// framer motion
import { m } from 'framer-motion';
// components
import Iconify from '../../../components/Iconify';
import { RHFTextField, RHFSelect } from '../../../components/hook-form';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

PricingStep.propTypes = {
  validateField: PropTypes.func
};

export default function PricingStep({ validateField }) {
  const { watch, setValue, getValues } = useFormContext();
  
  // Watch form values
  const currency = watch('currency') || 'USD';
  const price2Hours = watch('price2Hours') || '';
  const price3Hours = watch('price3Hours') || '';
  const price6Hours = watch('price6Hours') || '';

  const currencies = [
    { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'ARS', symbol: '$', name: 'Peso Argentino' },
    { code: 'CLP', symbol: '$', name: 'Peso Chileno' },
    { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
    { code: 'CHF', symbol: 'CHF', name: 'Franco Suizo' },
    { code: 'CAD', symbol: 'C$', name: 'Dólar Canadiense' }
  ];

  const currentCurrency = currencies.find(c => c.code === currency);

  const pricingOptions = [
    {
      title: "Precio por 2 horas",
      tip: "",
      field: "price2Hours",
      value: price2Hours
    },
    {
      title: "Precio por medio día",
      tip: "Sesiones de 3 horas.",
      field: "price3Hours",
      value: price3Hours
    },
    {
      title: "Precio por día completo",
      tip: "Para experiencias completas de 6 horas.",
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
          Precios
        </Typography>
      </Box>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Moneda</InputLabel>
        <Select
          value={currency}
          label="Moneda"
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
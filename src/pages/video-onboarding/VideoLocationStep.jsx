import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Alert } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import Iconify from '../../components/Iconify';
import useLocales from '../../hooks/useLocales';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

VideoLocationStep.propTypes = {
  validateField: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function VideoLocationStep({ validateField, onNext }) {
  const { setValue, watch } = useFormContext();
  const { translate } = useLocales();
  const selectedResort = watch('resort') || '';
  const [resortOptions, setResortOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to format text: capitalize first letter and replace underscores with spaces
  const formatText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch resorts from API
  const fetchResorts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/enums/resorts');
      
      // Transform the API response to match the expected format
      const transformedResorts = response.data.map(resort => ({
        name: formatText(resort.name || resort.label || resort.value),
        value: resort.value || resort.id,
        category: formatText(resort.category) || 'Resorts'
      }));
      
      setResortOptions(transformedResorts.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error('Error fetching resorts:', err);
      setError(translate('videoOnboarding.location.loadError'));
      // Fallback to static list if API fails
      const fallbackResorts = [
        { name: 'Aspen', value: 'ASPEN', category: 'Colorado Resorts' },
        { name: 'Vail', value: 'VAIL', category: 'Colorado Resorts' },
        { name: 'Snowmass', value: 'SNOWMASS', category: 'Colorado Resorts' }
      ];
      setResortOptions(fallbackResorts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  const handleResortChange = async (event, newValue) => {
    setValue('resort', newValue?.value || '');
    await validateField('resort', newValue?.value || '');
    
    // Auto-advance to next step after selecting a resort
    if (newValue?.value && onNext) {
      // Add a small delay to show the selection feedback
      setTimeout(() => {
        onNext();
      }, 1000);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, mt: { xs: 4, md: 0 } }}>
      <m.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <m.div variants={item}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Iconify 
              icon="eva:map-fill" 
              sx={{ 
                fontSize: 64, 
                color: 'primary.main',
                mb: 2
              }} 
            />
            <Typography variant="h3" gutterBottom>
              {translate('videoOnboarding.location.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              {translate('videoOnboarding.location.subtitle')}
            </Typography>
          </Box>
        </m.div>

        {/* Resort Selection */}
        <m.div variants={item}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Autocomplete
              options={resortOptions}
              getOptionLabel={(option) => option.name}
              value={resortOptions.find(option => option.value === selectedResort) || null}
              onChange={handleResortChange}
              groupBy={(option) => option.category}
              loading={loading}
              disabled={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={translate('videoOnboarding.location.selectResort')}
                  placeholder={loading ? translate('videoOnboarding.location.loadingResorts') : translate('videoOnboarding.location.searchResort')}
                  helperText={translate('videoOnboarding.location.helperText')}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <Iconify icon="eva:loader-fill" sx={{ animation: 'spin 1s linear infinite' }} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Iconify icon="eva:map-fill" sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body1">
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.category}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
              noOptionsText={loading ? translate('videoOnboarding.location.loading') : translate('videoOnboarding.location.notFound')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            {error && (
              <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </m.div>

        {/* Selected Resort Info */}
        {selectedResort && (
          <m.div variants={item}>
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Iconify icon="eva:checkmark-circle-2-fill" />
                  <Box>
                    <Typography variant="body2">
                      <strong>{translate('videoOnboarding.location.resortSelected')}</strong> {resortOptions.find(option => option.value === selectedResort)?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {translate('videoOnboarding.location.perfect')}
                    </Typography>
                  </Box>
                </Stack>
              </Alert>
            </Box>
          </m.div>
        )}

        {/* Help Text */}
        <m.div variants={item}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {translate('videoOnboarding.location.helpText')}
            </Typography>
          </Box>
        </m.div>
      </m.div>
    </Box>
  );
}

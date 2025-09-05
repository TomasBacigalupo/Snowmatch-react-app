import PropTypes from 'prop-types';
// @mui
import { Box, Typography } from '@mui/material';
// framer motion
import { m } from 'framer-motion';
// hooks
import useLocales from 'src/hooks/useLocales';
// components
import { RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function DescriptionStep({ methods }) {
  const { translate } = useLocales();
  
  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
{translate('registerForm.description.step.title')}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            maxWidth: 400,
            mx: 'auto'
          }}
        >
{translate('registerForm.description.step.subtitle')}
        </Typography>
      </Box>

      {/* Short Description Input */}
      <Box sx={{ mb: 4 }}>
        <RHFTextField 
          name="information"
          label={translate('registerForm.description.step.profileTitle')}
          placeholder={translate('registerForm.description.step.profileTitlePlaceholder')}
          inputProps={{ 
            maxLength: 150,
            style: { 
              fontSize: '1rem',
              lineHeight: 1.5,
              padding: '16px'
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              '&:hover': {
                borderColor: 'grey.400',
              },
              '&.Mui-focused': {
                borderColor: 'primary.main',
                borderWidth: '2px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: 'text.primary',
            },
          }}
        />
        
        {/* Character Counter */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            {methods.watch('information')?.length || 0}/150
          </Typography>
        </Box>
      </Box>

      {/* Long Description Input */}
      <Box sx={{ mb: 4 }}>
        <RHFTextField 
          name="description"
          label={translate('registerForm.description.step.detailedDescription')}
          placeholder={translate('registerForm.description.step.detailedDescriptionPlaceholder')}
          multiline
          rows={6}
          inputProps={{ 
            maxLength: 500,
            style: { 
              fontSize: '1rem',
              lineHeight: 1.5,
              padding: '16px'
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.300',
              '&:hover': {
                borderColor: 'grey.400',
              },
              '&.Mui-focused': {
                borderColor: 'primary.main',
                borderWidth: '2px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: 'text.primary',
            },
          }}
        />
        
        {/* Character Counter */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            {methods.watch('description')?.length || 0}/500
          </Typography>
        </Box>
      </Box>
    </m.div>
  );
}

DescriptionStep.propTypes = {
  methods: PropTypes.object.isRequired,
}; 
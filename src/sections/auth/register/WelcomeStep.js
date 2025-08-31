import PropTypes from 'prop-types';
import { Box, Typography, Stack, Button } from '@mui/material';
import { m } from 'framer-motion';
import Iconify from '../../../components/Iconify';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function WelcomeStep() {
  const { translate } = useLocales();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>

      {/* Main Content */}
      <Box sx={{ flex: 1, px: 3, pb: 10 }}>
        {/* Title */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 4, 
              color: 'text.primary',
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}
          >
            {translate('welcomeStep.title')}
          </Typography>
        </m.div>

        {/* Steps */}
        <Stack spacing={0}>
          {/* Step 1 */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              py: 3,
              borderBottom: '1px solid',
              borderColor: 'grey.200'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1,
                mr: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {translate('welcomeStep.step1.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  {translate('welcomeStep.step1.description')}
                </Typography>
              </Box>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: 2,
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Iconify 
                  icon="eva:person-fill" 
                  sx={{ fontSize: 32, color: 'primary.main' }} 
                />
              </Box>
            </Box>
          </m.div>

          {/* Step 2 */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              py: 3,
              borderBottom: '1px solid',
              borderColor: 'grey.200'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1,
                mr: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {translate('welcomeStep.step2.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  {translate('welcomeStep.step2.description')}
                </Typography>
              </Box>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: 2,
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Iconify 
                  icon="eva:star-fill" 
                  sx={{ fontSize: 32, color: 'success.main' }} 
                />
              </Box>
            </Box>
          </m.div>

          {/* Step 3 */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              py: 3
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1,
                mr: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {translate('welcomeStep.step3.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  {translate('welcomeStep.step3.description')}
                </Typography>
              </Box>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: 2,
                bgcolor: 'warning.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Iconify 
                  icon="eva:checkmark-circle-fill" 
                  sx={{ fontSize: 32, color: 'warning.main' }} 
                />
              </Box>
            </Box>
          </m.div>
        </Stack>
      </Box>

      {/* Spacer for bottom navigation */}
      <Box sx={{ height: 100 }} />
    </Box>
  );
}

WelcomeStep.propTypes = {
  // Add any props if needed in the future
}; 
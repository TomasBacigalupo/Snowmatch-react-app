import { Box, Typography, Stack } from '@mui/material';
import { m } from 'framer-motion';
import Iconify from '../../../components/Iconify';
import useLocales from '../../../hooks/useLocales';

export default function StudentWelcomeStep() {
  const { translate } = useLocales();

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Iconify 
            icon="eva:person-fill" 
            sx={{ 
              fontSize: 80, 
              color: '#000000',
              mb: 2
            }} 
          />
        </Box>
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: '#000000'
          }}
        >
          {translate('studentStepper.welcome.title')}
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          {translate('studentStepper.welcome.subtitle')}
        </Typography>

        <Stack spacing={2} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0'
          }}>
            <Iconify icon="eva:target-fill" sx={{ fontSize: 24, color: '#000000', mr: 2 }} />
            <Typography variant="body1">
              <strong>{translate('studentStepper.welcome.features.objective.title')}</strong> {translate('studentStepper.welcome.features.objective.description')}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0'
          }}>
            <Iconify icon="eva:trending-up-fill" sx={{ fontSize: 24, color: '#000000', mr: 2 }} />
            <Typography variant="body1">
              <strong>{translate('studentStepper.welcome.features.level.title')}</strong> {translate('studentStepper.welcome.features.level.description')}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0'
          }}>
            <Iconify icon="eva:map-fill" sx={{ fontSize: 24, color: '#000000', mr: 2 }} />
            <Typography variant="body1">
              <strong>{translate('studentStepper.welcome.features.location.title')}</strong> {translate('studentStepper.welcome.features.location.description')}
            </Typography>
          </Box>
        </Stack>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 4, fontStyle: 'italic' }}
        >
          {translate('studentStepper.welcome.footer')}
        </Typography>
      </Box>
    </m.div>
  );
}
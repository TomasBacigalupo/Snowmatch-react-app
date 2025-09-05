import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { m } from 'framer-motion';
import useLocales from 'src/hooks/useLocales';
import Iconify from '../../../components/Iconify';
import TeacherCardPreview from './TeacherCardPreview';

PreviewStep.propTypes = {
  formData: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default function PreviewStep({ formData, user }) {
  const { translate } = useLocales();
  
  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:check-circle-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          {translate('registerForm.preview.title')}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {translate('registerForm.preview.subtitle')}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TeacherCardPreview formData={{ ...formData, ...user }} />
      </Box>
      
      <Box sx={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: 2, 
        p: 3, 
        border: '1px solid #e0e0e0' 
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {translate('registerForm.preview.whatsNext')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Iconify icon="eva:calendar-fill" sx={{ fontSize: 20, color: 'primary.main' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {translate('registerForm.preview.setupCalendar.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {translate('registerForm.preview.setupCalendar.description')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </m.div>
  );
} 
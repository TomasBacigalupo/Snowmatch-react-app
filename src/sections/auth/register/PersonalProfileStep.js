import PropTypes from 'prop-types';
// @mui
import { Box, Typography, Button } from '@mui/material';
// framer motion
import { m } from 'framer-motion';
// components
import Iconify from '../../../components/Iconify';
import { RHFUploadAvatar } from '../../../components/hook-form';
// hooks
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

PersonalProfileStep.propTypes = {
  onAvatarDrop: PropTypes.func,
};

export default function PersonalProfileStep({ onAvatarDrop }) {
  const { translate } = useLocales();

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        maxWidth: 600,
        mx: 'auto',
        py: 4
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'text.primary', 
            fontWeight: 700,
            mb: 2,
            lineHeight: 1.2
          }}
        >
          {translate('auth.personalProfile.title')}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            maxWidth: 400,
            lineHeight: 1.5
          }}
        >
          {translate('auth.personalProfile.description')}
        </Typography>
        
        <Box sx={{ 
          width: '100%',
          maxWidth: 400,
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'grey.50',
          position: 'relative'
        }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}>
            <Iconify 
              icon="eva:camera-fill" 
              sx={{ 
                fontSize: 64, 
                color: 'grey.400',
                mb: 2
              }} 
            />
            
            <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={16000000}
              onDrop={onAvatarDrop}
              sx={{
                width: 120,
                height: 120,
                mb: 2
              }}
            />
          </Box>
          
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderColor: 'grey.400',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main'
              }
            }}
          >
            {translate('auth.personalProfile.addPhoto')}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onAvatarDrop([e.target.files[0]]);
                }
              }}
            />
          </Button>
        </Box>
      </Box>
    </m.div>
  );
} 
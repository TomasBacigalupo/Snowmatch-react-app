import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Typography, Button, Stack } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
// hooks
import useLocales from '../hooks/useLocales';
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Iconify from './Iconify';

// ----------------------------------------------------------------------

export default function PremiumSubscriptionBanner({ 
  title, 
  subtitle, 
  buttonText, 
  onSubscribe,
  sx,
  ...other 
}) {
  const theme = useTheme();
  const { translate } = useLocales();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe();
    } else {
      // Default action - navigate to premium page or open contact
      const message = translate('chat.premium.message', {
        userName: user?.displayName || user?.email,
        userEmail: user?.email,
        userRole: user?.role,
        date: new Date().toLocaleDateString()
      });
      
      const whatsappUrl = `https://wa.me/5492944355555?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          zIndex: 0,
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          {/* Icon */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <Iconify 
              icon="eva:star-fill" 
              sx={{ 
                color: 'white', 
                fontSize: 30 
              }} 
            />
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              maxWidth: 400,
            }}
          >
            {title || translate('chat.noConversationsTeacher.title')}
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: 350,
              lineHeight: 1.6,
            }}
          >
            {subtitle || translate('chat.noConversationsTeacher.subtitle')}
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleSubscribe}
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {buttonText || translate('chat.noConversationsTeacher.button')}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}

PremiumSubscriptionBanner.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  buttonText: PropTypes.string,
  onSubscribe: PropTypes.func,
  sx: PropTypes.object,
};

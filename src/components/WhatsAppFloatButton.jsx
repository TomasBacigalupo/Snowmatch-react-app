import { Box, Button, Fab, Tooltip } from '@mui/material';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import Iconify from './Iconify';
import useAuth from '../hooks/useAuth';
import useLocales from '../hooks/useLocales';
import { SNOWMATCH_BOOKING_WHATSAPP_PHONE } from '../utils/snowmatchWhatsApp';

const WHATSAPP_URL = `https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}`;
const SUPPORT_URL = 'https://blog.snowmatch.pro/soporte/';

export default function WhatsAppFloatButton() {
  const { isResortAdmin, isAuthenticated } = useAuth();
  const { translate } = useLocales();

  const floatPositionSx = {
    position: 'fixed',
    right: { xs: 16, sm: 24 },
    bottom: { xs: 16, sm: 24 },
    zIndex: (theme) => theme.zIndex.modal - 50,
    pb: 'env(safe-area-inset-bottom)',
  };

  if (isAuthenticated && isResortAdmin) {
    return (
      <Box sx={floatPositionSx}>
        <Button
          component="a"
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="text"
          size="large"
          startIcon={<SupportAgentOutlinedIcon />}
          aria-label={translate('menu.contactSupport247')}
          sx={{
            borderRadius: 999,
            px: { xs: 2.5, sm: 3 },
            py: 1.25,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
            bgcolor: 'common.white',
            color: 'text.primary',
            boxShadow: (theme) => theme.customShadows.z12,
            '&:hover': {
              bgcolor: 'common.white',
              boxShadow: (theme) => theme.customShadows.z20,
              transform: 'translateY(-1px)',
            },
            transition: (theme) =>
              theme.transitions.create(['box-shadow', 'transform'], {
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          {translate('menu.contactSupport247')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={floatPositionSx}>
      <Tooltip title="WhatsApp">
        <Fab
          component="a"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          size="large"
          sx={{
            bgcolor: '#25D366',
            color: '#fff',
            boxShadow: 6,
            '&:hover': { bgcolor: '#20bd5a' },
          }}
        >
          <Iconify icon="logos:whatsapp-icon" width={32} />
        </Fab>
      </Tooltip>
    </Box>
  );
}

import { Box, Fab, Tooltip } from '@mui/material';
import Iconify from './Iconify';
import { SNOWMATCH_BOOKING_WHATSAPP_PHONE } from '../utils/snowmatchWhatsApp';

const WHATSAPP_URL = `https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}`;

export default function WhatsAppFloatButton() {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 16, sm: 24 },
        bottom: { xs: 16, sm: 24 },
        // Below dialogs/modals (1300), above page chrome
        zIndex: (theme) => theme.zIndex.modal - 50,
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
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

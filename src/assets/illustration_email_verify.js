// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Image } from '@mui/material';

// ----------------------------------------------------------------------

export default function VerifyEmailIllustration({ success, ...other }) {
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
      {success && <img src="/assets/mail_confirmed.png" width="300" height="300" alt="Email confirmed illustration" />}
      {!success && <img src="/assets/emailVerification.png" width="300" height="300" alt="Email verification illustration" />}
    </Box>
  );
}

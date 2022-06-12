// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Image } from '@mui/material';

// ----------------------------------------------------------------------

export default function VerifyWappIllustration({ ...other }) {
    const theme = useTheme();
    const PRIMARY_MAIN = theme.palette.primary.main;
    const PRIMARY_DARKER = theme.palette.primary.darker;

    return (
        <Box {...other}>
            <img src="/assets/wappVerification.png" />
        </Box>
    );
}

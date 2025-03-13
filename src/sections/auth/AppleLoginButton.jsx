import { Button } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import useAuth from 'src/hooks/useAuth';
import useLocales from 'src/hooks/useLocales';

export default function AppleLoginButton() {
    const { loginWithApple } = useAuth();
    const { translate } = useLocales();

    const handleAppleLogin = async () => {
        await loginWithApple();
    };

    return (
        <Button
            fullWidth
            variant="outlined"
            sx={{
                color: theme => theme.palette.common.black, // Color del texto
                borderColor: theme => theme.palette.common.black, // Borde del botón
                '&:hover': {
                  backgroundColor: theme => theme.palette.common.black,
                  color: theme => theme.palette.common.white, // Texto blanco en hover
                  borderColor: theme => theme.palette.common.black, // Borde del botón
                },
              }}
            startIcon={<AppleIcon color='black' />}
            onClick={handleAppleLogin}
        >
            {translate('auth.appleSignIn')}
        </Button>
    );
}
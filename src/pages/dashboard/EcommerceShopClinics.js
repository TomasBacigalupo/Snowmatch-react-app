// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Container, Typography, InputAdornment, Button, } from '@mui/material';
// hooks
// components
// assets
import Logo from 'src/components/Logo';
import SocialsButton from 'src/components/SocialsButton';
import Page from 'src/components/Page';
import useCountdown from 'src/hooks/useCountdown';
import { ComingSoonIllustration } from 'src/assets';
import InputStyle from 'src/components/InputStyle';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(10),
}));

const CountdownStyle = styled('div')({
    display: 'flex',
    justifyContent: 'center',
});

const SeparatorStyle = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(0, 1),
    [theme.breakpoints.up('sm')]: {
        margin: theme.spacing(0, 2.5),
    },
}));

// ----------------------------------------------------------------------

export default function ComingSoon() {
    const countdown = useCountdown(new Date('07/28/2024 19:00'));

    return (
        <Page title="Coming Soon">
            <RootStyle>
                <Container>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" paragraph>
                            Proximamente
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}></Typography>
                        <ComingSoonIllustration sx={{ height: 240 }} />
                        <CountdownStyle>
                            <div>
                                <Typography variant="h2">{countdown.days}</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>Días</Typography>
                            </div>

                            <SeparatorStyle variant="h2">:</SeparatorStyle>

                            <div>
                                <Typography variant="h2">{countdown.hours}</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>Horas</Typography>
                            </div>

                            <SeparatorStyle variant="h2">:</SeparatorStyle>

                            <div>
                                <Typography variant="h2">{countdown.minutes}</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>Minutos</Typography>
                            </div>

                            <SeparatorStyle variant="h2">:</SeparatorStyle>

                            <div>
                                <Typography variant="h2">{countdown.seconds}</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>Seconds</Typography>
                            </div>
                        </CountdownStyle>
                        <br/>
                        <Button 
                        onClick={() => {
                            const phoneNumber = '+5492944367197';
                            const _message = encodeURIComponent(
                                `Quiero saber más sobre las clinicas!`
                            );
                            const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

                            window.open(url, '_blank');
                        }}
                        variant="contained" 
                        size="large" mt={2}>
                            Saber más
                        </Button>
                    </Box>
                </Container>
            </RootStyle>
        </Page>
    );
}

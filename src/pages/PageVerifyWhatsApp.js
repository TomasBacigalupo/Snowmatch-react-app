import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container, CircularProgress, Grid } from '@mui/material';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets
import VerifyWappIllustration from 'src/assets/illustration_whatsApp_verify';
// hooks
import useAuth from '../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { set } from 'lodash';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function PageVerifyWhatsApp() {
    const { testVerification, user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [countDown, setCountDown] = useState(0);
    const [runTimer, setRunTimer] = useState(true);

    useEffect(() => {
        let timerId;
        if (runTimer) {
            setCountDown(60 * 5);
            timerId = setInterval(() => {
                setCountDown((countDown) => countDown - 1);
            }, 1000);
        } else {
            clearInterval(timerId);
        }

        return () => clearInterval(timerId);
    }, [runTimer]);

    useEffect(() => {
        if (countDown < 0 && runTimer) {
            console.log("expired");
            setRunTimer(false);
            setCountDown(0);
        }
    }, [countDown, runTimer]);

    const togglerTimer = () => setRunTimer((t) => !t);

    const seconds = String(countDown % 60).padStart(2, 0);
    const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);

    const handleResend = () =>{
        setRunTimer(true)
    }

    const onReload = () => {
        setLoading(true);
        testVerification(() => {
            enqueueSnackbar('Phone not verified', { variant: 'warning' });
            setLoading(false);
        })
    }

    return (
        <Page title="WhatsApp verification" sx={{ height: 1 }}>
            <RootStyle>
                <Container component={MotionContainer}>
                    <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
                        <m.div variants={varBounce().in}>
                            <Typography variant="h3" paragraph>
                                Verify your phone number
                            </Typography>
                        </m.div>
                        <Typography sx={{ color: 'text.secondary' }}>
                            You need to verify your phone to continue. If you already verify it just reload the window.
                        </Typography>

                        <m.div variants={varBounce().in}>
                            <VerifyWappIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                        </m.div>
                        {loading && (
                            <CircularProgress />
                        )}
                        <Grid container>
                            <Grid item xs={12}>
                                {!loading && <Button onClick={onReload} loading={loading}>
                                    Reload
                                </Button>}
                            </Grid>
                            <Grid item xs={12}>
                                {!loading && <Button onClick={handleResend} disabled={runTimer} loading={loading}>
                                    Resend{runTimer && <Typography style={{ marginLeft: '5px' }}>{' ' + minutes}:{seconds}</Typography>}
                                </Button>}
                            </Grid>
                            <Grid item xs={12}>
                                {!loading && (
                                <Typography disabled variant='caption'>Phone:{' ' + user.cellphone}</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </RootStyle>
        </Page>
    );
}

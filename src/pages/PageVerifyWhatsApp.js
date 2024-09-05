import { m } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

import { VerifyCodeForm } from '../sections/auth/verify-code';
import axios from '../utils/axios';
import { PATH_DASHBOARD, PATH_AUTH } from '../routes/paths';
import HoverButton from 'src/components/HoverButton';
import VerifyEmailIllustration from 'src/assets/illustration_email_verify';





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
    const { testVerification, user, logout } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [countDown, setCountDown] = useState(0);
    const [runTimer, setRunTimer] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let timerId;
        if (runTimer) {
            setCountDown(60 * 3);
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
            setRunTimer(false);
            setCountDown(0);
        }


    }, [countDown, runTimer]);

    const togglerTimer = () => setRunTimer((t) => !t);

    const seconds = String(countDown % 60).padStart(2, 0);
    const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);

    const handleResend = async () => {
        const response = axios.post('/api/userPersonalDataVerification/registrationNumericCode');
        setRunTimer(true)
    }

    const onReload = () => {
        setLoading(true);
        testVerification((succ) => {
            if (!succ) {
                enqueueSnackbar('Phone not verified', { variant: 'warning' });
            }
            setLoading(false);
        })
    }

    const onLogout = async () => {
        try {
            await logout();
            navigate(PATH_AUTH.login, { replace: true });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
    };

    return (
        <Page title="WhatsApp verification" sx={{ height: 1 }}>
            <RootStyle>
                <Container component={MotionContainer}>
                    <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
                        <m.div variants={varBounce().in}>
                            <Typography variant="h3" paragraph>
                                Validar identidad
                            </Typography>
                        </m.div>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Necesitamos validar tu identidad para que uses SnowMatch.
                        </Typography>

                        <m.div variants={varBounce().in}>
                            <VerifyEmailIllustration sx={{ height: 160, my: { xs: 5, sm: 10 } }} />
                        </m.div>
                        <VerifyCodeForm />
                        {loading && (
                            <CircularProgress />
                        )}

                        <Grid container>
                            <Grid item xs={12}>
                                {!loading && <HoverButton onClick={onReload} loading={loading}>
                                    Verify!
                                </HoverButton>}
                            </Grid>
                            <Grid item xs={12}>
                                {!loading && <HoverButton onClick={onLogout} loading={loading}>
                                    Logout
                                </HoverButton>}
                            </Grid>
                            <Grid item xs={12}>
                                {!loading && <HoverButton onClick={handleResend} disabled={runTimer} loading={loading}>
                                    Resend{runTimer && <Typography style={{ marginLeft: '5px' }}>{' ' + minutes}:{seconds}</Typography>}
                                </HoverButton>}
                            </Grid>
                            <Grid item xs={12}>
                                {!loading && (
                                    <Typography disabled variant='caption'>Telefono:{' ' + user?.cellphone}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {!loading && (
                                    <Typography disabled variant='caption'>Email:{' ' + user?.email}</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {!loading && (
                                    <Typography disabled variant='caption'>No son tus datos? Conactate con office@snowmatch.pro</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </RootStyle>
        </Page>
    );
}

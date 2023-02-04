import { m } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container, CircularProgress, Stack } from '@mui/material';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets
import VerifyEmailIllustration from 'src/assets/illustration_email_verify';
// hooks
import useAuth from '../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import HoverButton from 'src/components/HoverButton';
import axios from '../utils/axios';

import { PATH_DASHBOARD, PATH_AUTH } from '../routes/paths';
import { dispatch, useSelector } from 'src/redux/store';
import { setRequestedRoute } from 'src/redux/slices/config';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function PageVerifyEmail() {
  const { testVerification, logout, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales()
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [canSendEmail, setCanSendEmail] = useState(true);
  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(true);
  const navigate = useNavigate();
  const {requestedRoute}  = useSelector(state => state.config)

  useEffect(() => {
    let timerId;
    if (runTimer) {
      setCountDown(10);
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

  const seconds = String(countDown % 60).padStart(2, 0);
  const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);

  const onReload = () => {
    setLoading(true);
    testVerification((succ) => {
      if(!succ){
        enqueueSnackbar('Email not verified', { variant: 'warning' });
        setLoading(false);
      }
      
    })
  }

  const onSendEmail = () => {
    setRunTimer(true)
    const response = axios.post('/api/userPersonalDataVerification/verificationEmail');
    console.log(response)
    
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
    <Page title="Email verification" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                {translate('verify.title')}
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>
              {translate('verify.description', {email: user.email})}
            </Typography>

            <m.div variants={varBounce().in}>
              <VerifyEmailIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </m.div>
            {loading || sendingEmail && (
              <CircularProgress/>
            )}
            <Stack>
              {!loading && !sendingEmail && <HoverButton onClick={onReload} loading={loading}>
                {translate('verify.reload')}
              </HoverButton>}
            </Stack>
            <Stack>
              {!loading && !sendingEmail && <HoverButton disabled={runTimer} onClick={onSendEmail} loading={sendingEmail}>
                {translate('verify.send_email')} {runTimer && <Typography style={{ marginLeft: '5px' }}>{' ' + minutes}:{seconds}</Typography>}
              </HoverButton>}
            </Stack>
            <Stack>
              {!loading && <HoverButton onClick={onLogout} loading={loading}>
                {translate('verify.logout')}
              </HoverButton>}
            </Stack>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

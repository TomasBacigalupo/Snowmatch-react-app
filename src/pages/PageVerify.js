import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container, CircularProgress } from '@mui/material';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets
import VerifyEmailIllustration from 'src/assets/illustration_email_verify';
// hooks
import useAuth from '../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

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
  const { testVerification } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false)

  const onReload = () => {
    setLoading(true);
    testVerification(() => {
      enqueueSnackbar('Email not verified', { variant: 'warning'});
      setLoading(false);
    })
  }

  return (
    <Page title="Email verification" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Verify your email
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>
              You need to verify your email to continue. If you already verify it just reload the window.
            </Typography>

            <m.div variants={varBounce().in}>
              <VerifyEmailIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </m.div>
            {loading && (
              <CircularProgress/>
            )}
            {!loading && <Button onClick={onReload} loading={loading}>
              Reload
            </Button>}
            
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

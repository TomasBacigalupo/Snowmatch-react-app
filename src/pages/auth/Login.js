import { useState } from 'react';
import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Container, Typography, Button } from '@mui/material';
// routes
import { PATH_AUTH, PATH_GUEST } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
// sections
import { LoginForm } from '../../sections/auth/login';
import useLocales from 'src/hooks/useLocales';
import AppleLoginButton from 'src/sections/auth/AppleLoginButton';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  paddingTop: 'env(safe-area-inset-top)',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const { translate } = useLocales();

  const [showForm, setShowForm] = useState(false);

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }} align="right">
              {translate('auth.haveAccount')} {''}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.registerStudent}>
                {translate('auth.getStartedFree')}
              </Link>
              <br />
              {translate('auth.notATeacher')} {' '}
              <Link variant="subtitle2" component={RouterLink} to={PATH_GUEST.root}>
                Match
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography textAlign='center' variant="h4" gutterBottom>
                  {translate('auth.signIn')}
                </Typography>
              </Box>
            </Stack>
            {!showForm ? (
              <Stack spacing={2}>
                <AppleLoginButton />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowForm(true)}
                  fullWidth
                >
                  {translate('auth.emailSignIn')}
                </Button>
              </Stack>
            ) : (
              <>
                <LoginForm />
                <Box mt={2}>
                  <AppleLoginButton />
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  {translate('auth.dontHaveAccount')}{' '}
                  <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.registerStudent}>
                    {translate('auth.getStarted')}
                  </Link>
                </Typography>
              </>
            )}


          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
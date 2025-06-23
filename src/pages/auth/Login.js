import { useState } from 'react';
import { capitalCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Container, Typography, Button, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { RegisterStudentForm } from '../../sections/auth/register';
import useLocales from 'src/hooks/useLocales';
import AppleLoginButton from 'src/sections/auth/AppleLoginButton';
import GoogleLoginButton from 'src/sections/auth/GoogleLoginButton';
import { Capacitor } from '@capacitor/core';

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

// Add this new styled component for the logo
const LogoStyle = styled('img')(({ fromModal }) => ({
  width: fromModal ? 200 : 400,
  marginBottom: fromModal ? 20 : 40,
  alignSelf: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

// ----------------------------------------------------------------------

export default function Login({fromModal = false}) {
  const { method } = useAuth();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const { translate } = useLocales();
  const navigate = useNavigate();
  const isIOS = Capacitor.getPlatform() === 'ios';

  const [showForm, setShowForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleShowRegisterForm = () => {
    if (fromModal) {
      setShowRegisterForm(true);
    } else {
      navigate(PATH_AUTH.registerStudent);
    }
  };

  const handleBackToLogin = () => {
    setShowRegisterForm(false);
  };

  return (
    <Page title="Login">
      <RootStyle>
      {!smUp && !fromModal && (
            <IconButton 
              onClick={() => navigate(-1)} 
              sx={{ 
                color: 'common.black',
                paddingTop: 'env(safe-area-inset-top)'
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
        {!fromModal && (
          <HeaderStyle>
            {smUp && <Logo />}
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
        )}

        <Container maxWidth="sm">
          <ContentStyle sx={{ 
            padding: fromModal ? theme => theme.spacing(4, 0) : theme => theme.spacing(12, 0),
            minHeight: fromModal ? 'auto' : '100vh'
          }}>
            <LogoStyle
              src="/logo/snowmatch.png"
              alt="Snowmatch Logo"
              onClick={() => navigate('/')}
              fromModal={fromModal}
            />
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography textAlign='center' variant="h4" gutterBottom>
                  {showRegisterForm ? translate('auth.registerTitle') : translate('auth.signIn')}
                </Typography>
                {showRegisterForm && (
                  <Typography textAlign='center' sx={{ color: 'text.secondary' }}>
                    {translate('auth.registerDescription')}
                  </Typography>
                )}
              </Box>
            </Stack>
            
            {showRegisterForm ? (
              <>
                <RegisterStudentForm />
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
                  {translate('auth.registrationMessage')}&nbsp;
                  <Link underline="always" color="text.primary" href="https://github.com/lpagn/snowmatchfiles/blob/main/Snow%20Match%20Terms%20of%20Service.pdf">
                    {translate('auth.terms')}&nbsp;
                  </Link>
                  {translate('auth.and')}&nbsp;
                  <Link underline="always" color="text.primary" href="https://github.com/lpagn/snowmatchfiles/blob/main/Snow%20Match%20Privacy%20Policy.pdf">
                    {translate('auth.privacy')}
                  </Link>
                  .
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  {translate('auth.haveAccount')}{' '}
                  <Link variant="subtitle2" component="button" onClick={handleBackToLogin} sx={{ background: 'none', border: 'none', cursor: 'pointer', color: 'primary.main' }}>
                    {translate('auth.login')}
                  </Link>
                </Typography>
              </>
            ) : (
              <>
                {!showForm ? (
                  <Stack spacing={2} alignItems="center">
                    {isIOS && <AppleLoginButton />}
                    {isIOS && <GoogleLoginButton />}
                    <Button
                      variant="outlined"
                      onClick={() => setShowForm(true)}
                      fullWidth
                      startIcon={<EmailIcon />}
                      sx={{
                        maxWidth: 300,
                        borderRadius: '50px',
                        color: theme => theme.palette.common.black,
                        borderColor: theme => theme.palette.common.black,
                        '&:hover': {
                          backgroundColor: theme => theme.palette.common.black,
                          color: theme => theme.palette.common.white,
                          borderColor: theme => theme.palette.common.black,
                        }
                      }}
                    >
                      {translate('auth.continueWithEmail')}
                    </Button>
                  </Stack>
                ) : (
                  <>
                    <LoginForm />
                    <Box mt={2}>
                      <Stack spacing={2}>
                        {isIOS && <AppleLoginButton />}
                        {isIOS && <GoogleLoginButton />}
                      </Stack>
                    </Box>

                    <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                      {translate('auth.dontHaveAccount')}{' '}
                      <Link variant="subtitle2" component="button" onClick={handleShowRegisterForm} sx={{ background: 'none', border: 'none', cursor: 'pointer', color: 'primary.main' }}>
                        {translate('auth.getStarted')}
                      </Link>
                    </Typography>
                  </>
                )}
              </>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
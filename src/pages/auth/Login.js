import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Alert, Tooltip, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH, PATH_GUEST } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';
import useLocales from 'src/hooks/useLocales';

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

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
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

  const {translate} = useLocales();

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
              <><br /></>
              {translate('auth.notATeacher')} {''}
              <Link variant="subtitle2" component={RouterLink} to={PATH_GUEST.root}>
                Match
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Box sx={{
              padding: '10px',
              paddingTop: '80px',
              textAlign: 'center'
            }}>
              <iframe width="414" height="736" src="https://www.youtube.com/embed/fq3I-CRurQU" title="SnowMatch, la app que te conecta con tu instructor de ski o snowboard ideal" frameBorder="10" allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>
            </Box>
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {translate('auth.signInToSnowmatch')}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{translate('auth.signInToSnowmatchDetails')}</Typography>
              </Box>

              {/* <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image
                    disabledEffect
                    src={`https://minimal-assets-api.vercel.app/assets/icons/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip> */}
            </Stack>

            {/* <Alert severity="info" sx={{ mb: 3 }}>
              Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
            </Alert> */}

            <LoginForm />


            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              {translate('auth.dontHaveAccount')}{' '}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.registerStudent}>
                {translate('auth.getStarted')}
              </Link>
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}

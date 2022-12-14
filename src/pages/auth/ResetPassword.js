import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
// sections
import { ResetPasswordForm } from '../../sections/auth/reset-password';
// assets
import { SentIcon } from '../../assets';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'src/redux/store';
import { changePassword } from 'src/redux/slices/teachers';
import { LoadingButton } from '@mui/lab';
import { InputAdornment, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { token } = useParams()
  const methods = useForm()
  const { handleSubmit } = methods
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const onSubmit = (data) => {
    dispatch(
      changePassword(
        data.password, 
        data.repeatPassword,
        token, () => navigate('/match/school') ))
    
  }
  

  if (token) {
    return (
      <Page title="Reset Password" sx={{ height: 1 }}>
        <RootStyle>
          <LogoOnlyLayout />

          <Container>
            <Box sx={{ maxWidth: 480, mx: 'auto' }}>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack container spacing={3}>
                  <Stack>
                    <RHFTextField
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      name="repeatPassword"
                      label="Repeat Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack>
                    <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      //loading={isSubmitting}
                      sx={{ ':hover': { color: '#3399FF' } }}>
                      Reset Password
                    </LoadingButton>
                  </Stack>
                </Stack>

              </FormProvider>
            </Box>
          </Container>
        </RootStyle>
      </Page>
    )
  }

  return (
    <Page title="Reset Password" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            {!sent ? (
              <>
                <Typography variant="h3" paragraph>
                  Forgot your password?
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                  Please enter the email address associated with your account and We will email you a link to reset your
                  password.
                </Typography>

                <ResetPasswordForm onSent={() => setSent(true)} onGetEmail={(value) => setEmail(value)} />

                <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 1 }}>
                  Back
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />

                <Typography variant="h3" gutterBottom>
                  Request sent successfully
                </Typography>
                <Typography>
                  We have sent a confirmation email to &nbsp;
                  <strong>{email}</strong>
                  <br />
                  Please check your email.
                </Typography>

                <Button size="large" variant="contained" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 5 }}>
                  Back
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

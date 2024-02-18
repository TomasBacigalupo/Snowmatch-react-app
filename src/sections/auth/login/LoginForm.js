import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();
  const {translate} = useLocales()

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .transform((value, originalValue) => originalValue.toLowerCase())
    .email(translate('loginForm.emailInvalid'))
    .required(translate('loginForm.emailRequired')),
    //username: Yup.string().required('User name is required'),
    password: Yup.string().required(translate('loginForm.passwordRequired')),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      if (error.messages && error.messages.entry) {
        error.messages.entry.forEach(e => {
          setError(e.key, { type: "server", message: e.value });
        })
      } else {
        console.error("Unexpected error: ", error)
        setError('afterSubmit', { ...error, message: "Incorrect user or password" });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email" />

        <RHFTextField
          name="password"
          label={translate('loginForm.password')}
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label={translate("loginForm.rememberMe")} />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          {translate('loginForm.forgotPassword')}
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{':hover':{color:'#3399FF'}}}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}

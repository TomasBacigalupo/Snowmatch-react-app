import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from 'src/hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useDispatch } from 'src/redux/store';
import { sendResetPasswordEmail } from 'src/redux/slices/teachers';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch()
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
      dispatch(sendResetPasswordEmail(data.email))
      if (isMountedRef.current) {
        onSent();
        onGetEmail(data.email);
      }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address"/>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{':hover':{color:'#3399FF'}}}>
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

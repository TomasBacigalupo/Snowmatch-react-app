import * as Yup from 'yup';
import { useState } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFEditor, RHFSelect, RHFTextField, RHFUploadMultiFile, RHFUploadSingleFile } from '../../../components/hook-form';

//mock
import { countries } from "src/_mock"

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    cellphone: Yup.string().required('Phone number required').matches(
      "^[0-9]{10}$",
      "Phone number is not valid"
    ),
    countryCode: Yup.string().required(),
    password: Yup.string().required('Password is required'),
    certificate: Yup.mixed().required('Certification File is required',(value) => value !== '')
  });

  const [defaultValues, setDefaultValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    countryCode: '54',
    cellphone: '',
    certificate: null
  });

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const values = watch();

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'certificate',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const onSubmit = async (data) => {

    try {
      await register(data.email, data.password, data.firstName, data.lastName, data.countryCode, data.cellphone, data.certificate);

    } catch (error) {
      if (error.messages && error.messages.entry){
        error.messages.entry.forEach(e => {
          setError(e.key, { type: "server", message: e.value });
        })
      } else{
        console.error("Unexpected Error:", error)
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect name="countryCode" label="Country Code" placeholder="Country Code">
            <option value="" />
            {countries.map((option) => (
              <option key={option.code} value={option.phone}>
                {option.label} (+{option.phone})
              </option>
            ))}
          </RHFSelect>
          <RHFTextField name="cellphone" label="Phone" />
        </Stack>
        

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="subtitle1">Instructor certification</Typography>
        <RHFUploadSingleFile name="certificate" accept="image/*" maxSize={16000000} onDrop={handleDrop}/>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{':hover':{color:'#3399FF'}}}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

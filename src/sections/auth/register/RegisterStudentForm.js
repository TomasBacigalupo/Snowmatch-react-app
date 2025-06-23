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
import { FormProvider, RHFEditor, RHFRadioGroup, RHFSelect, RHFTextField, RHFUploadMultiFile, RHFUploadSingleFile } from '../../../components/hook-form';

//mock
import { countries } from "src/_mock"
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

export default function RegisterStudentForm() {
    const { register } = useAuth();
    const {translate} = useLocales();

    const isMountedRef = useIsMountedRef();

    const [showPassword, setShowPassword] = useState(false);

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required(translate('registerForm.nameRequired')),
  email: Yup.string().email(translate('registerForm.emailInvalid')).required(translate('registerForm.emailRequired')),
  password: Yup.string().required(translate('registerForm.passwordRequired')),
});


    const [defaultValues, setDefaultValues] = useState({
        firstName: '',
        email: '',
        password: '',
        countryCode: '54',
        cellphone: '',
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

    const onSubmit = async (data) => {

        try {
            await register(
                data.email,
                data.password,
                data.firstName,
                "   ",
                data.countryCode,
                data.cellphone,
                data.entity,
                data.certificate,
                'STUDENT'
            );
        } catch (error) {
            if (error.messages && error.messages.entry) {
                error.messages.entry.forEach(e => {
                    setError(e.key, { type: "server", message: e.value });
                })
            } else {
                console.error("Unexpected Error:", error)
            }
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <RHFTextField name="firstName" label={translate('registerForm.name')} />
                    {/* <RHFTextField name="lastName" label={translate('registerForm.lastName')} /> */}
                </Stack>

                <RHFTextField name="email" label="Email" />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <RHFSelect name="countryCode" label={translate('registerForm.countryCode')} placeholder="Country Code">
                        <option value="" />
                        {countries.map((option) => (
                            <option key={option.code} value={option.phone}>
                                {option.label} (+{option.phone})
                            </option>
                        ))}
                    </RHFSelect>
                    <RHFTextField name="cellphone" label={translate('registerForm.phone')} />
                </Stack>


                <RHFTextField
                    name="password"
                    label={translate('registerForm.password')}
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
                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ ':hover': { color: '#3399FF' } }}>
                   {translate('registerForm.register')}
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
}

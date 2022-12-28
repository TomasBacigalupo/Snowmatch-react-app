import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm,} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Avatar } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import Image from '../../../components/Image';

import { confirmTeacher } from '../../../redux/slices/admin.js'
import { useDispatch, useSelector } from '../../../redux/store';

import {
  TeacherDetailsCarousel
} from '../e-commerce/teacher-details';
// } from '../../sections/@dashboard/e-commerce/teacher-details';

// ----------------------------------------------------------------------

AdminConfirmForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTeacher: PropTypes.object,
};

export default function AdminConfirmForm({ isEdit, currentTeacher }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const genders = [
    { code: 'H', label: 'Male' },
    { code: 'M', label: 'Female' }]
    // todo chequear codes

  const levels = [
    { code: '0', label: '0' },
    { code: '1', label: '1' },
    { code: '2', label: '2' },
    { code: '3', label: '3' },
    { code: '4', label: '4' },
    { code: '5', label: '5' }]

  const NewTeacherSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    //email: Yup.string().required('Email is required').email(),
    // phoneNumber: Yup.string().required('Phone number is required'),
    // role: Yup.string().required('Role Number is required'),
    lastname: Yup.string().required('Last name is required'),
    // birth: Yup.string().required('Birth is required'),
    //dni: Yup.number().required('DNI is required'),
    // gender: Yup.string().required('Gender is required'),
    level: Yup.number().required('Level is required'),
    //userId: Yup.number().required('ID is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTeacher?.name || '',
      email: currentTeacher?.email || '',
      // phoneNumber: currentTeacher?.phoneNumber || '',
      // country: currentTeacher?.country || '',
      // isVerified: currentTeacher?.isVerified || true,
      // status: currentTeacher?.status,
      // role: currentTeacher?.role || '',
      certificateImageLink: currentTeacher?.certificateImageLink || '',
      lastname: currentTeacher?.lastname || '',
      // birth: currentTeacher?.birth || '',
      dni: currentTeacher?.dni || '',
      // gender: currentTeacher?.gender || '',
      level: currentTeacher?.level.toString() || '',
      userId: currentTeacher?.userId || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTeacher]
  );

  const methods = useForm({
    resolver: yupResolver(NewTeacherSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentTeacher) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTeacher]);

  const onSubmit = async (data) => {
    try {
      const response = dispatch(confirmTeacher(data));
      reset();
      console.log(response)
      console.log("SENT")
      enqueueSnackbar('Review success!');
      navigate(PATH_DASHBOARD.admin.review);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 0 }}>
              <Image alt={'certificate'} src={currentTeacher?.imageLink} ratio="1/1" />
              <Typography variant="subtitle2" noWrap>
                {`${currentTeacher?.name} ${currentTeacher?.lastname}`}
              </Typography>
              {console.log({currentTeacher})}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="lastname" label="Last Name" />
              {false && <RHFTextField name="email" label="Email Address" /> }

              <RHFSelect name="level" label="Level" placeholder="Level">
                {levels.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="dni" label="DNI" />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

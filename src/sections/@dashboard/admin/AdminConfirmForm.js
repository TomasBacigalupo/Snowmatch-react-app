import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Avatar } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import Image from '../../../components/Image';

import { confirmTeacher } from '../../../redux/slices/admin.js'
import { useDispatch, useSelector } from '../../../redux/store';
import axios from 'src/utils/axios'

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
    { code: '0', label: 'Muy malo' },
    { code: '1', label: 'Malo' },
    { code: '2', label: 'Regular' },
    { code: '3', label: 'Bueno' },
    { code: '4', label: 'Muy Bueno' },
    { code: '5', label: 'Experto' }]

  const NewTeacherSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    // phoneNumber: Yup.string().required('Phone number is required'),
    // role: Yup.string().required('Role Number is required'),
    lastname: Yup.string().required('Last name is required'),
    // birth: Yup.string().required('Birth is required'),
    dni: Yup.number().required('DNI is required'),
    // gender: Yup.string().required('Gender is required'),
    level: Yup.number().required('Level is required'),
    id: Yup.number().required('ID is required'),
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
      level: currentTeacher?.level || '',
      id: currentTeacher?.id || '',
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
    console.log(data)
    var func;
    // if(isEdit){
    //   func = editClient(data);
    // }
    // else{
    func = await confirmTeacher(data);
    // }
    try {
      //console.log(data)
      const response = dispatch(func);
      reset();
      console.log(response)
      console.log("SENT")
      enqueueSnackbar('Review success!');
      navigate(PATH_DASHBOARD.admin.review);
    } catch (error) {
      console.error(error);
    }
  };

  const [imageSrc,setImageSrc] = useState('');

  // useEffect(()=>{
  // const accessToken = window.localStorage.getItem('accessToken');
  // axios.get(currentTeacher?.certificateImageLink)
  // .then((response ) => {
  //   let data = `data:${response.headers['content-type']};base64, ${new Buffer(response.data).toString('base64')}`;;
  //   setImageSrc(data)
  // },[])
  // }
  // )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {/* {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )} */}

            <Box sx={{ mb: 0 }}>
              {/* <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              /> */}
              {/* <Avatar alt={currentTeacher?.name || ""} src={currentTeacher?.imageLink || ""} sx={{ mr: 2 }} /> */}
              <TeacherDetailsCarousel teacher={{ images: [currentTeacher?.certificateImageLink]}} />
              {/* <Image alt={currentTeacher?.name || ""} src={currentTeacher?.certificateImageLink || ""} onClick={()=> window.open((currentTeacher?.certificateImageLink || ""), "_blank")} sx={{ borderRadius: 1 }} /> */}
              {/* <TeacherDetailsCarousel teacher={{ images: [imageSrc]}} /> */}
              {/* <Image alt={currentTeacher?.name || ""} src={imageSrc || ""}  sx={{ borderRadius: 1 }} /> */}
              {/* <img src={imageSrc || ""}></img> */}
              
              <Typography variant="subtitle2" noWrap>
                {currentTeacher?.name}
              </Typography>
            </Box>

            {/* {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}
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
              {/* <RHFTextField name="email" label="Email Address" /> */}
              {/* <RHFTextField name="phoneNumber" label="Phone Number" /> */}
              {/* <RHFTextField name="birth" label="Birthday" /> */}
              {/* {false && <RHFTextField name="id" label="Id" /> } */}
              {false && <RHFTextField name="email" label="Email Address" /> }
              {/* <RHFSelect name="gender" label="Gender" placeholder="Gender">
                <option value={currentTeacher?.gender || ""} />
                {genders.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect> */}

              <RHFSelect name="level" label="Level" placeholder="Level">
                <option value={currentTeacher?.level || ""} />
                {levels.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              {/* <RHFTextField name="role" label="Role" /> */}
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

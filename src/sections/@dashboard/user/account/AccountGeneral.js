import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { updateTeacher, changeProfilePicture } from '../../../../redux/slices/teachers';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar, RHFMultipleSelect } from '../../../../components/hook-form';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    name: user?.name || '',
    lastname: user?.lastname || '',
    gender: user?.gender || 'M',
    email: user?.email || '',
    photoURL: user?.imageLink || '',
    cellphone: user?.cellphone || '',
    country: user?.country || '',
    information: user?.information || '',
    description: user?.description || '',
    information: user?.information || '',
    isPublic: user?.state === "AVAILABLE" || false,
    languages: user?.speaks || [],
    skills: user?.skills || [],
    disciplines: user?.disciplines || []
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const onSubmit = async (value) => {
    console.log("values", value);

    toBase64(value.photoURL).then(image => {
      //TODO: only change image if it was changed
      dispatch(changeProfilePicture(image));
    } );

    

    dispatch(updateTeacher(value))
    try {
      await axios.post();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 13, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
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
            />

            <RHFSwitch name="state" labelPlacement="start" label="Available" sx={{ mt: 5 }} />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Name" disabled={user?.name != ''}/>
              <RHFTextField name="lastname" label="Last Name" disabled={user?.lastname != ''}/>
              <RHFSelect name="gender" label="Gender" placeholder="Gender" disabled={user?.gender != ''}>
                  <option key={1} value={"M"}>
                    Male
                  </option>
                  <option key={2} value={"F"}>
                    Female
                  </option>
              </RHFSelect>
              <RHFTextField name="email" label="Email Address" disabled/>
              {console.log("cellphone", user?.cellphone)}
              <RHFTextField name="cellphone" label="Phone Number" disabled={user?.cellphone != undefined} />
              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFMultipleSelect name="disciplines" label="Disciplines" list={["Ski", "SnowBoard"]}/>
              <RHFMultipleSelect name="languages" label="Languages" list={["Español", "English", "Portugues"]}/>
            </Box>
            <Stack sx={{ mt: 3 }}>
              <RHFMultipleSelect name="skills" freeSolo={true} label="Skills" list={["Ski tunning", "Baby sitter", "Car rent"]}/>
            </Stack>
            <Stack sx={{ mt: 3 }}>
              <RHFTextField multiline 
                            rows={2}
                            maxRows={2} 
                            name="information" 
                            label="Quick Information" />
            </Stack>

            <Stack sx={{ mt: 3 }}>
              <RHFTextField multiline
                            rows={4}
                            maxRows={4}
                            name="description" 
                            label="Description" />
            </Stack>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

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
import axios from '../../../../utils/axios';
import { useMediaQuery } from 'react-responsive';


const SKI_RESORTS = [
  "Aconcagua",
  "Batea Mahuida",
  "Calafate Mountain Park",
  "Caviahue",
  "Cerro Bayo",
  "Cerro Castor",
  "Cerro Catedral",
  "Chapelco",
  "La Hoya",
  "Las Leñas",
  "Las Pendientes",
  "Los Penitentes",
  "Los Puquios",
  "Monte Bianco",
  "Patagonia Heliski",
  "Perito Moreno",
  "Vallecitos"
]

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, updateUser, refreshUser } = useAuth();
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => { return state});
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const imageSize = isMobile?10:39;

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    lastname: Yup.string().required('Lastname is required'),
    gender: Yup.string().required('Gender is required'),
    email: Yup.string().required('Email is required').email(),
    photoURL:Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
    cellphone: Yup.string().required("Phone number is required"),
    country: Yup.string(),
    information: Yup.string().nullable(),
    description: Yup.string().nullable(),
    state: Yup.bool().required("Your availability is required"),
    speaks: Yup.array().of(Yup.string()),
    skills: Yup.array().of(Yup.string()),
    disciplines: Yup.array().of(Yup.string()),
    resorts: Yup.array().of(Yup.string()),
    school: Yup.string(),
  });

  const defaultValues = {
    name: user?.name || '',
    lastname: user?.lastname || '',
    gender: user?.gender || 'M',
    email: user?.email || '',
    photoURL: user?.imageLink || '',
    cellphone: user?.cellphone || '',
    country: user?.country || '',  // FALTA EN EDITUSERDTO
    information: user?.information || undefined,
    description: user?.description || undefined,
    state: user?.state === "AVAILABLE" || false, //FALTA EN EDITUSERDTO
    speaks: user?.speaks || [],
    skills: user?.skills || [],
    disciplines: user?.disciplines || [],
    resorts: user?.resorts || [],
    school: user?.school || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    setError
  } = methods;

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const onSubmit = async (data) => {

    const value = { 
      ...user,
      ...data
    }
    
    var endpoint = "";
    if(value.state){
      value.state = 'AVAILABLE'
      endpoint = 'available'
    }
    else{
      value.state = 'UNAVAILABLE'
      endpoint = 'unavailable'
    }

    dispatch(changeProfilePicture(data.photoURL, (succeed) => {
      if (succeed) {
        refreshUser({
          ...user,
          imageLink: value.photoURL.preview
        })
      }
    }));
    

    try {
      //await axios.post();
      const response = await dispatch(updateTeacher(value));
      const r = await axios.post("/api/users/teacher/"+endpoint);
      if(response.messages){
          for (const entry of response.messages.entry) {
            setError(entry.key, {
              type: "server",
              message: entry.value,
            });          
          }
        }
        else{
          updateUser(value)
          enqueueSnackbar( 'Update success!');
        }
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
          <Card sx={{ py: imageSize, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={16000000}
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
                  <br /> max size of {fData(16000000)}
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
              <RHFTextField name="cellphone" label="Phone Number" disabled={user?.cellphone != undefined} />
              
              <RHFTextField name="email" label="Email Address" disabled/>
              <RHFSelect name="gender" label="Gender" placeholder="Gender">
                  <option key={1} value={"M"}>
                    Male
                  </option>
                  <option key={2} value={"F"}>
                    Female
                  </option>
              </RHFSelect>
              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFMultipleSelect name="disciplines" label="Disciplines" list={["Ski", "SnowBoard"]}/>
              <RHFMultipleSelect name="speaks" label="Languages" list={["Español", "English", "Portugues"]}/>
            </Box>

            <Stack sx={{ mt: 3 }}>
              <RHFTextField name="school" label="School"/>
            </Stack>              

            <Stack sx={{ mt: 3 }}>
              <RHFMultipleSelect name="resorts" label="Resorts" list={SKI_RESORTS}/>            
            </Stack>                        

            <Stack sx={{ mt: 3 }}>
              <RHFMultipleSelect name="skills" freeSolo={true} label="Skills" list={["Ski tunning", "Baby sitter", "Car rent"]}/>
            </Stack>
            <Stack sx={{ mt: 3 }}>
              <RHFTextField multiline 
                            rows={2}
                            name="information" 
                            label="Quick Information" />
            </Stack>

            <Stack sx={{ mt: 3 }}>
              <RHFTextField multiline
                            rows={4}
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

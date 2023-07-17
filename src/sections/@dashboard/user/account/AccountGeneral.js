import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Tooltip } from '@mui/material';
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
import useLocales from 'src/hooks/useLocales';
import { ski_resorts } from '../../../../_mock';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, updateUser, refreshUser } = useAuth();
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => { return state });
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const imageSize = isMobile ? 10 : 39;
  const { translate } = useLocales()

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    lastname: Yup.string().required('Lastname is required'),
    gender: Yup.string().required('Gender is required'),
    email: Yup.string().required('Email is required').email(),
    photoURL: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
    cellphone: Yup.string().required("Phone number is required"),
    country: Yup.string(),
    information: Yup.string().nullable().max(100),
    description: Yup.string().nullable().max(100),
    state: Yup.bool().required("Your aUnited Statesability is required"),
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
    if (value.state) {
      value.state = 'AVAILABLE'
      endpoint = 'available'
    }
    else {
      value.state = 'UNAVAILABLE'
      endpoint = 'unavailable'
    }

    if (typeof data.photoURL === "object" && data.photoURL.path) {
      console.log(data.photoURL)
      //console.log("EDIT IMAGE")
      dispatch(changeProfilePicture(data.photoURL, (succeed) => {
        if (succeed) {
          refreshUser({
            ...user,
            imageLink: value.photoURL.preview
          })
          axios.put("/api/images/image")
        }
      }));
    }

    try {
      //await axios.post();
      const response = await dispatch(updateTeacher(value));
      const r = await axios.post("/api/users/teacher/" + endpoint);
      if (response.messages) {
        for (const entry of response.messages.entry) {
          setError(entry.key, {
            type: "server",
            message: entry.value,
          });
        }
      }
      else {
        updateUser(value)
        enqueueSnackbar('Update success!');
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

            <RHFSwitch name="state" labelPlacement="start" label={translate("general.form.available")} sx={{ mt: 5 }} />
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
              <RHFTextField name="name" label={translate("general.form.name")} disabled={user?.name != ''} />
              <RHFTextField name="lastname" label={translate("general.form.lastName")} disabled={user?.lastname != ''} />
              <RHFTextField name="cellphone" label={translate("general.form.cellphone")} disabled={user?.cellphone != undefined} />

              <RHFTextField name="email" label={translate("general.form.email")} disabled />
              <RHFSelect name="gender" label={translate("general.form.gender")} placeholder={translate("general.form.gender")}>
                <option key={1} value={"M"}>
                  {translate("general.form.male")}
                </option>
                <option key={2} value={"F"}>
                  {translate("general.form.female")}
                </option>
              </RHFSelect>
              <RHFSelect name="country" label={translate("general.form.country")} placeholder={translate("general.form.country")}>
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFMultipleSelect name="disciplines" label={translate("general.form.disciplines")} list={["Ski", "SnowBoard"]} />
              <RHFMultipleSelect name="speaks" label={translate("general.form.languages")} list={["Español", "English", "Portugues", "Italiano"]} />
            </Box>

            <Stack sx={{ mt: 3 }}>
              <RHFTextField name="school" label={translate("general.form.school")} />
            </Stack>

            <Stack sx={{ mt: 3 }}>
              <RHFMultipleSelect name="resorts" label={translate("general.form.resorts")} freeSolo={true} grouped={true} list={ski_resorts} />
            </Stack>

            <Stack sx={{ mt: 3 }}>
              <RHFMultipleSelect name="skills" freeSolo={true} label={translate("general.form.skills")} list={["Ski tunning", "Baby sitter", "Car rent"]} />
            </Stack>
            <Stack sx={{ mt: 3 }}>
              <Tooltip title={translate("general.form.quickInformationHelper")}>
                <RHFTextField multiline
                  rows={2}
                  name="information"
                  label={translate("general.form.quickInformation")}
                />
              </Tooltip>
            </Stack>

            <Stack sx={{ mt: 3 }}>
              <RHFTextField multiline
                rows={4}
                name="description"
                label={translate("general.form.description")} />
            </Stack>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ':hover': { color: '#3399FF' } }}>
                {translate("general.form.saveChanges")}
              </LoadingButton>
            </Stack>

          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

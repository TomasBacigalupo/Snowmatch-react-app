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
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Divider, MenuItem } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';

import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar, RHFMultipleSelect } from '../../../components/hook-form';
// redux
import { createClient, slice, editClient } from '../../../redux/slices/clients'
import { useDispatch, useSelector } from '../../../redux/store';



// ----------------------------------------------------------------------

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

ClientNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
  };
  
  export default function ClientNewEditForm({ isEdit, currentUser }) {


    const {client,clients, error,isLoading} = useSelector((state) =>{console.log(state);return state.clients});

    const dispatch = useDispatch();

    const navigate = useNavigate();




  
    const { enqueueSnackbar } = useSnackbar();
  
    const NewUserSchema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      lastname: Yup.string().required('Last name is required'),
      email: Yup.string().required('Email is required').email(),
      cellphone: Yup.string().required('Phone number is required'),
      country: Yup.string(),
      avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
      notes: Yup.string().nullable(),
      isTipper: Yup.bool(),
      tip: Yup.string().nullable(),
      level: Yup.string(),
      isRenting: Yup.bool(),
      hobbies: Yup.string().nullable(),
      family: Yup.string().nullable(),
      work: Yup.string().nullable(),
      staysAt:Yup.string().nullable(),
      id:Yup.number(),
      resorts:Yup.array().of(Yup.string()),

    });
  
    const defaultValues = useMemo(
      () => ({
        name: client?.name || '',
        lastname: client?.lastname || '',
        email: client?.email || '',
        cellphone: client?.cellphone || '',
        country: client?.country || 'Argentina',
        avatarUrl: client?.avatarUrl || '',
        isTipper: client?.tipper || false,
        notes: client?.notes || undefined,
        tip: client?.tip || undefined,
        level: client?.level || "BEGINNER",
        isRenting:client?.renting || false,
        family:client?.family || undefined,
        hobbies:client?.hobbies || undefined,
        work:client?.work || undefined,
        staysAt:client?.staysAt || undefined,
        id:client?.id || 0 ,
        resorts:client?.resorts || [],
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [client]
    );
  
    const methods = useForm({
      resolver: yupResolver(NewUserSchema),
      defaultValues,
    });
  
    const {
      reset,
      watch,
      control,
      setValue,
      handleSubmit,
      formState: { isSubmitting },
      setError
    } = methods;
  
    const values = watch();
  
    useEffect(() => {
      if (isEdit && currentUser) {
        reset(defaultValues);
      }
      if (!isEdit) {
        reset(defaultValues);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentUser]);
  
    const onSubmit = async (data) => {
      console.log(data)
      var func;
      if(isEdit){
        func = editClient(data);
      }
      else{
        func = createClient(data);
      }
      try {
        //console.log(data)
        const response = await dispatch(func);

        if(response.messages){
          for (const entry of response.messages.entry) {
            setError(entry.key, {
              type: "server",
              message: entry.value,
            });          
          }
        }
        else{
          console.log("SENT")
          reset();
          enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
          navigate(PATH_DASHBOARD.user.list);
        }

      } catch (e) {
        console.error(e);
      }
    };
  
    const handleDrop = useCallback(
      (acceptedFiles) => {
        const file = acceptedFiles[0];
  
        if (file) {
          setValue(
            'avatarUrl',
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
            <Card sx={{ py: 31, px: 3 }}>
             
  
              <Box sx={{ mb: 5 }}>
                <RHFUploadAvatar
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
                />
              </Box>
  
              

            </Card>
          </Grid>
  
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
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
                            <RHFTextField name="email" label="Email Address" />
                            <RHFTextField name="cellphone" label="Cellphone" />
    
                            <RHFSelect name="country" label="Country" placeholder="Country">
                            <option value="" />
                            {countries.map((option) => (
                                <option key={option.code} value={option.label}>
                                {option.label}
                                </option>
                            ))}
                            </RHFSelect>
                            <RHFTextField name="staysAt" label="Stays at" />
                            <RHFSwitch
                              name="isRenting"
                              labelPlacement="start"
                              label={
                                <>
                                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Is the client renting equipment?
                                  </Typography>
                                </>
                              }
                              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                              />
                            <RHFSelect name="level" label="Level" placeholder="Level">
                            <option value="" />
                              <option key="BEGINNER" value="BEGINNER">
                                BEGINNER
                              </option>
                              <option key="INTERMEDIATE" value="INTERMEDIATE">
                                INTERMEDIATE
                              </option>
                              <option key="ADVANCED" value="ADVANCED">
                                ADVANCED
                              </option>
                              <option key="EXPERT" value="EXPERT">
                                EXPERT
                              </option>                              
                            ))}
                            </RHFSelect>
                            <RHFTextField name="work" label="Work" />
                            <RHFTextField name="hobbies" label="Hobbies" />

                            <RHFSwitch
                              name="isTipper"
                              labelPlacement="start"
                              label={
                                <>
                                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Does the client tip?
                                  </Typography>
                                </>
                              }
                              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                              />
                            <RHFTextField name="tip" label="Usual tip" />
                            <RHFTextField multiline name="notes" label="Notes"/>

                            <RHFTextField multiline name="family" label="Family"/>




                        </Box>
                        <Stack alignItems="flex" sx={{ mt: 3 }}>

                            <RHFMultipleSelect name="resorts" label="Resorts" list={SKI_RESORTS}/>
              </Stack>
                    </Grid>
                </Grid>
                
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Client' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
  
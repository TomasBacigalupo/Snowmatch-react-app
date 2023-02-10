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
import { countries, ski_resorts } from '../../../_mock';
// components
import Label from '../../../components/Label';

import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFMultipleSelect } from '../../../components/hook-form';
// redux
import { createClient, slice, editClient } from '../../../redux/slices/clients'
import { useDispatch, useSelector } from '../../../redux/store';
import { useMediaQuery } from 'react-responsive';
import useLocales from 'src/hooks/useLocales';



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


    const {client,clients, error,isLoading} = useSelector((state) =>{return state.clients});

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const imageSize = isMobile?10:38;
    const {translate} = useLocales()
    const { enqueueSnackbar } = useSnackbar();
  
    const NewUserSchema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      lastname: Yup.string().required('Last name is required'),
      email: Yup.string().email(),
      cellphone: Yup.string().matches(/^\d+$/,"Cellphone can only contain numbers"),
      country: Yup.string(),
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
      countryCode:Yup.string(),

    });
  
    const defaultValues = useMemo(
      () => ({
        name: client?.name || '',
        lastname: client?.lastname || '',
        email: client?.email || '',
        cellphone: client?.cellphone || '',
        country: client?.country || 'Argentina',
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
        countryCode:client?.countryCode || ''
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [client]
    );

    const defaultValuesNew = useMemo(
      () => ({
        name: '',
        lastname: '',
        email:  '',
        cellphone:  '',
        country:  'Argentina',
        isTipper:false,
        notes:  '',
        tip: '',
        level:  "BEGINNER",
        isRenting: false,
        family:  '',
        hobbies:'',
        work:  '',
        staysAt: '',
        id:  0,
        resorts: [],
        countryCode:'',
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
        reset(defaultValuesNew);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentUser]);

    useEffect(() => {
      document.addEventListener('paste', handlePasteClipboard);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePasteClipboard = (event) => {

      if(event.path[0].name === "cellphone"){
        let data = event?.clipboardData?.getData('Text') || '';
  
        data = data.replace(/\D/g, '');
        console.log(event)
        setValue("cellphone",data)
        event.preventDefault()
        
      }

    };
  
    const onSubmit = async (data) => {
      var func;
      if(isEdit){
        func = editClient(data);
      }
      else{
        func = createClient(data);
      }
      try {
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
          reset();
          enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
          navigate(PATH_DASHBOARD.user.list);
        }

      } catch (e) {
        console.error(e);
      }
    };
  

  
    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>

  
          <Grid item xs={12} md={20}>
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
                    <RHFTextField name="name" label={translate("general.form.name")} />
                    <RHFTextField name="lastname" label={translate("general.form.lastName")}  />
                    <RHFTextField name="email" label={translate("general.form.email")}  />
                    <RHFSelect name="country" label={translate("general.form.country")} placeholder={translate("general.form.country")} >
                              <option value="" />
                              {countries.map((option) => (
                                  <option key={option.code} value={option.label}>
                                  {option.label}
                                  </option>
                              ))}
                            </RHFSelect>
                    <RHFSelect name="countryCode" label={translate("general.form.countryCode")} placeholder={translate("general.form.countryCode")} >
                              <option value="" />
                              {countries.map((option) => (
                                  <option key={option.code} value={option.phone}>
                                  {option.label} (+{option.phone}) 
                                  </option>
                              ))}
                            </RHFSelect> 
                    <RHFTextField name="cellphone" label={translate("general.form.cellphone")}  />
    
                            <RHFSelect name="level" label={translate("school.clients.form.level")} placeholder="Level">
                              <option value="" />
                                <option key="BEGINNER" value="BEGINNER">
                                  {translate("school.clients.form.BEGINNER")}
                                </option>
                                <option key="INTERMEDIATE" value="INTERMEDIATE">
                                  {translate("school.clients.form.INTERMEDIATE")}
                                </option>
                                <option key="ADVANCED" value="ADVANCED">
                        {translate("school.clients.form.ADVANCED")}
                                </option>
                                <option key="EXPERT" value="EXPERT">
                        {translate("school.clients.form.EXPERT")}
                                </option>                              
                            </RHFSelect>
                            <RHFSwitch
                              name="isRenting"
                              labelPlacement="start"
                              label={
                                <>
                                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    {translate("school.clients.form.isRenting")}
                                  </Typography>
                                </>
                              }
                              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                              />
                              <RHFSwitch
                              name="isTipper"
                              labelPlacement="start"
                              label={
                                <>
                                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    {translate("school.clients.form.doesTip")}
                                  </Typography>
                                </>
                              }
                              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                              />
                    <RHFTextField name="tip" label={translate("school.clients.form.usualTip")} />

                            
                    <RHFTextField name="work" label={translate("school.clients.form.work")} />
                    <RHFTextField name="hobbies" label={translate("school.clients.form.hobbies")} />

                    <RHFTextField name="staysAt" label={translate("school.clients.form.staysAt")} />

                    <RHFTextField multiline name="family" label={translate("school.clients.form.family")}/>
                        </Box>
                        <Stack alignItems="flex" sx={{ mt: 3 }}>
                                                <Box
                            sx={{
                            display: 'grid',
                            columnGap: 2,
                            rowGap: 3,
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                            }}
                        >
                      <RHFMultipleSelect name="resorts" label={translate("school.clients.form.resorts")} freeSolo={true} grouped={true} list={ski_resorts}/>

                      <RHFTextField multiline name="notes" label={translate("school.clients.form.notes")} rows={3} />
                            </Box>
              </Stack>
                    </Grid>
                </Grid>
                
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{':hover':{color:'#3399FF'}}}>
                  {!isEdit ? translate("school.clients.form.createClient") : translate("school.clients.form.saveChanges")}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
  
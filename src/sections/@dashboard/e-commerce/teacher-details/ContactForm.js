import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton, MobileDatePicker } from '@mui/lab';
import { Box, Button, DialogActions, DialogTitle, Stack, TextField } from '@mui/material';
// redux
import { contactTeacher } from '../../../../redux/slices/contact';
import { useDispatch } from '../../../../redux/store';
// components
import { DialogAnimate } from '../../../../components/animate';

import { useState } from 'react';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';

import { useSelector } from 'react-redux';
import AuthGuard from 'src/guards/AuthGuard';
import useLocales from 'src/hooks/useLocales';
import { countries } from '../../../../_mock';



ContactForm.propTypes = {
  onCancel: PropTypes.func,
};

export default function ContactForm({ teacher, onCancel, cellphone }) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { contactForm } = useSelector((state) => state.contact);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  const ContactSchema = Yup.object().shape({
    from: Yup.string(),
    countryCode: Yup.string(),
    age: Yup.number(),
    firstname:Yup.string(),
    lastname:Yup.string(),
    level:Yup.string(),
    activity:Yup.string(),
    amount:Yup.number(),
    duration:Yup.string(),
    classDate:Yup.string(),
  });

  
  

  const methods = useForm({
    resolver: yupResolver(ContactSchema),
    defaultValues: contactForm
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

  const onSubmit = async (data) => {
    try {
      const date = new Date(data.classDate)
      const newContact = {
        from: data.from,
        countryCode: data.countryCode,
        age: data.age,
        firstname: data.firstname,
        lastname:data.lastname,
        level:data.level,
        activity:data.activity,
        amount:data.amount,
        duration:data.duration,
        classDate:date.getFullYear()+"-"+((date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<10?"0"+date.getDate():date.getDate())
      };
      const resp = await dispatch(contactTeacher(teacher, newContact));


      if(resp === "ERROR"){
        setOpen(true)
        enqueueSnackbar(translate("conversation.not_valid"), { 
        variant: 'error',
        autoHideDuration: 10000,
        })
      }
      else if(resp.messages){
        for (const entry of resp.messages.entry) {
          setError(entry.key, {
            type: "server",
            message: entry.value,
          });
        }
      }
      else{
        enqueueSnackbar(translate("conversation.message_sent"), { 
          variant: 'success',
          autoHideDuration: 10000,
        })
        onCancel();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  

  return (
    <AuthGuard>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="firstname" label={translate("general.form.name")} />

        <RHFTextField name="lastname" label={translate("general.form.lastName")} />

        <RHFTextField name="age" label={translate("conversation.age2")} />

        <RHFSelect name="countryCode" label={translate("general.form.countryCode")} placeholder={translate("general.form.countryCode")}>
          <option value="" />
          {countries.map((option) => (
              <option key={option.code} value={option.phone}>
              {option.label} (+{option.phone}) 
              </option>
          ))}
        </RHFSelect>        
        <RHFTextField name="from" label={translate("general.form.cellphone")} />


        <RHFSelect name="level" label={translate("school.clients.form.level")} placeholder={translate("school.clients.form.level")}>
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

        <RHFSelect name="activity" label={translate("conversation.activity")} placeholder={translate("conversation.activity")}>
          <option value="" />
          <option key="SKI" value="SKI">
            SKI
          </option>
          <option key="SNOWBOARD" value="SNOWBOARD">
            SNOWBOARD
          </option>                            
        </RHFSelect>

        <RHFTextField name="amount" label={translate("conversation.amount")} />

        <RHFSelect name="duration" label={translate("conversation.duration")} placeholder={translate("conversation.duration")}>
          <option value="" />
          <option key="HALFDAY (MORNING)" value="HALFDAY (MORNING)">
            HALFDAY (MORNING)
          </option>
          <option key="HALFDAY (AFTERNOON)" value="HALFDAY (AFTERNOON)">
            HALFDAY (AFTERNOON)
          </option>
          <option key="FULLDAY" value="FULLDAY">
            FULLDAY
          </option>                            
        </RHFSelect>

        <Controller
          name="classDate"
          control={control}
          render={({ field }) => (
            <MobileDatePicker
              {...field}
              label={translate("conversation.classdate")}
              inputFormat="dd/MM/yyyy"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />


      </Stack>

      <DialogActions>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
        {translate("conversation.cancel")}
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{':hover':{color:'#3399FF'}}}>
        {translate("conversation.contact")}
        </LoadingButton>
      </DialogActions>

        <DialogAnimate open={open} onClose={handleClose}>
          <DialogTitle>{translate("conversation.validation_required")}</DialogTitle>

          <Box spacing={3} sx={{ p: 3 }}>
          <p id="validation-modal-description">
          {translate("conversation.validation_required_body")}   
                 </p>
          <Button onClick={handleClose}>{translate("conversation.close")}</Button>
        </Box>        
        </DialogAnimate>


    </FormProvider>
    </AuthGuard>


  );
}

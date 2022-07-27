import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, Modal, DialogTitle } from '@mui/material';
import { LoadingButton, MobileDatePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../../redux/store';
import { referClass } from '../../../../redux/slices/contact';
// components
import Iconify from '../../../../components/Iconify';
import { DialogAnimate } from '../../../../components/animate';

import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch, RHFSelect } from '../../../../components/hook-form';
import { useEffect, useState } from 'react';

import { countries } from '../../../../_mock';
import useLocales from 'src/hooks/useLocales';


const COMMISSION_OPTIONS = [0,5,10,15,20];

ReferForm.propTypes = {
  onCancel: PropTypes.func,
};

export default function ReferForm({ teacher, onCancel,cellphone, isIndependent }) {
  const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { translate } = useLocales();

  const dispatch = useDispatch();

  const ContactSchema = Yup.object().shape({
    tip: Yup.bool(),
    commission: Yup.string(),
    age: Yup.number(),
    level:Yup.string(),
    activity:Yup.string(),
    amount:Yup.number(),
    duration:Yup.string(),
    classDate:Yup.string(),
    days:Yup.number(),
  });

  const today = new Date();
  const defaultValues = {
    age:"",
    level:"BEGINNER",
    activity:"",
    amount:1,
    duration:"",
    classDate:today,
    commission:isIndependent?0:-1,
    tip:false,
    days:1
  }

  const methods = useForm({
    resolver: yupResolver(ContactSchema),
    defaultValues
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
        commission: data.commission,
        tip: data.tip,
        age: data.age,
        level:data.level,
        activity:data.activity,
        amount:data.amount,
        duration:data.duration,
        classDate:date.getFullYear()+"-"+((date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<10?"0"+date.getDate():date.getDate()),
        days:data.days,
      };
      const resp = await dispatch(referClass(teacher, newContact));


      if(resp === "ERROR"){
        setOpen(true)
        enqueueSnackbar("Your phone number is not validated, check Whatsapp and try again", { 
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
        enqueueSnackbar("Message sent, they will soon be in touch!", { 
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
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>

        <RHFTextField name="age" label={translate("conversation.age")} />

        <RHFSelect name="level" label={translate("conversation.level")} placeholder={translate("conversation.level")}>
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

        <RHFSwitch name="tip" labelPlacement="end" label={translate("conversation.tips")} sx={{ mt: 5 }} />

        {isIndependent && 
        <RHFSelect name="commission" label={translate("conversation.commission")} placeholder={translate("conversation.commission")}>
                {COMMISSION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                    {option}{'%'}
                    </option>
                ))}                        
        </RHFSelect>
        }


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

        <RHFTextField name="days" label={translate("conversation.days")} />


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
          <DialogTitle>Validation required!</DialogTitle>

          <Box spacing={3} sx={{ p: 3 }}>
          <p id="validation-modal-description">
            Check your Whatsapp for a validation message. It may take a while. If you didn't get a message, check your number and try again!
          </p>
          <Button onClick={handleClose}>Close</Button>
        </Box>        
        </DialogAnimate>


    </FormProvider>


  );
}

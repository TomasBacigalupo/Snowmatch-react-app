import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from '@mui/material';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
// components
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch, RHFSelect } from '../../../components/hook-form';
import { declineTeacher } from '../../../redux/slices/admin.js'

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

DeclineTeacherForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function DeclineTeacherForm({ email, onCancel }) {

  const dispatch = useDispatch();


  const DeclineSchema = Yup.object().shape({
  });

  

  const defaultValues = useMemo(
    () => ({
      email: email,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [email]
  );

  const methods = useForm({
    resolver: yupResolver(DeclineSchema),
    defaultValues
  });
  const { enqueueSnackbar } = useSnackbar();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

//   const onSubmit = async (data) => {
//     try {
//       dispatch(declineUser(data))
//       onCancel();
//       reset();
//     } catch (error) {
//       console.error(error);
//     }
//   };

  const onSubmit = async (data) => {
    console.log(data)
    var func;
    func = await declineTeacher(data);
    try {
      //console.log(data)
      const response = dispatch(func);
      reset();
      console.log(response)
      console.log("SENT")
      enqueueSnackbar('Decline success!');
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        
        {false && <RHFTextField name="email" label="Email" />}

        <DialogActions>

            <Button variant="outlined" color="inherit" onClick={onCancel}>
            No
            </Button>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Si
            </LoadingButton>
        </DialogActions>
    </FormProvider>
  );
}

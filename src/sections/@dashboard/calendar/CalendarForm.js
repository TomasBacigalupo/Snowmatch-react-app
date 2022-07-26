import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller, useWatch } from 'react-hook-form';
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
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { Autocomplete } from '@mui/material';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

const getInitialValues = (event, range) => {
  const _event = {
    type: 'App Class',
    title: '',
    description: '',
    textColor: '#1890FF',
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date(),
    price: null
  };

  if (event || range) {
    return merge({}, _event, event);
  }

  return _event;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function CalendarForm({ event, range, onCancel, clients }) {
  const { enqueueSnackbar } = useSnackbar();
  const {translate} = useLocales()
  const [client, setClient] = useState(clients.find(c =>event?.clientId ===c.id))

  const dispatch = useDispatch();

  const isCreating = Object.keys(event).length === 0;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    type: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit = async (data) => {
    try {
      let newEvent
      debugger
      switch (data.type) {
        case 'Break':
        case 'Training':
        case 'Illness':
          newEvent = {
            title: data.title,
            description: data.description,
            textColor: data.textColor,
            start: data.start,
            end: data.end,
            type: data.type,
          };
          break
        default:
          newEvent = {
            title: data.title,
            description: data.description,
            textColor: data.textColor,
            start: data.start,
            end: data.end,
            type: data.type,
            price: data.price === null ? undefined : data.price,
          };
          if(client !== null && client !== undefined){
            newEvent = {
              ...newEvent,
              clientId: client.id
            }
          }
      }


      var func;
      var snackbar;
      if (event.id) {
        debugger
        func = updateEvent(event.id, newEvent);
        snackbar = 'Update success!'
      }
      else {
        func = createEvent(newEvent);
        snackbar = 'Create success!'
      }
      const response = await dispatch(func);

      if (response.messages) {
        for (const entry of response.messages.entry) {
          setError(entry.key, {
            type: "server",
            message: entry.value,
          });
        }
      }
      else {
        enqueueSnackbar(snackbar);
        onCancel();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!event.id) return;
    try {
      onCancel();
      dispatch(deleteEvent(event.id));
      enqueueSnackbar('Delete success!');
    } catch (error) {
      console.error(error);
    }
  };

  const values = watch();

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  const TYPE_OPTION = [
    { group: 'Class', classify: ['App class', 'School class', 'Referred class', 'Own client class'] },
    { group: 'Off', classify: ['Break', 'Training', 'Illness'] },
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        {clients?.length > 0 && <Autocomplete
          name="clientId" label={translate('calendar.form.client')}
          value={client}
          options={clients}
          onChange={(event,value)=>{
            if (value !== null){
              setClient(value)
            }else{
              setClient(null)
            }

            }
            
          }
          autoHighlight
          getOptionLabel={(c) => `${client?.name} ${client?.lastname}`}
          renderOption={(props, client) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar sx={{ marginRight: '10px' }}>{`${client?.name[0]}${client?.lastname[0]}`}</Avatar>
              {`${client.name} ${client.lastname}`}
            </Box>
          )}

          renderInput={(params) => (
            <RHFTextField {...params}
              name="clientid" label="Client" />
            // <TextField
            //   {...params}
            //   label="Client"
            //   inputProps={{
            //     ...params.inputProps,
            //     autoComplete: 'new-password', // disable autocomplete and autofill
            //   }}
            // />
          )}
        />}
        

        <RHFSelect name="type" label={translate('calendar.form.type')}>
          {TYPE_OPTION.map((type) => (
            <optgroup key={type.group} label={type.group}>
              {type.classify.map((classify) => (
                <option key={classify} value={classify}>
                  {classify}
                </option>
              ))}
            </optgroup>
          ))}
        </RHFSelect>
        <RHFTextField name="title" label={translate('calendar.form.title')} />

        <RHFTextField name="description" label={translate('calendar.form.description')} multiline rows={2} />

        {values?.type && !['Break', 'Training', 'Illness'].find(p => p === values.type) && (
          <RHFTextField name="price" label={translate('calendar.form.price')} />
        )}

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label={translate('calendar.form.startDate')}
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label={translate('calendar.form.endDate')}
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!isDateError}
                  helperText={isDateError && 'End date must be later than start date'}
                />
              )}
            />
          )}
        />

        <Controller
          name="textColor"
          control={control}
          render={({ field }) => (
            <ColorSinglePicker value={field.value} onChange={field.onChange} colors={COLOR_OPTIONS} />
          )}
        />
      </Stack>

      <DialogActions>
        {!isCreating && (
          <Tooltip title="Delete Event">
            <IconButton onClick={handleDelete}>
              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          {translate('calendar.form.cancel')}
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{':hover':{color:'#3399FF'}}}>
          {translate('calendar.form.add')}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}

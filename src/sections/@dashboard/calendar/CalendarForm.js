import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent, createBusinessEvent, updateBusinessEvent, deleteSchoolEvent, updateEventByUserIdAndEventId, createEventByUserId, deleteEventByUserId, } from '../../../redux/slices/calendar';
// components
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch, RHFSelect, RHFCheckbox } from '../../../components/hook-form';
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { Autocomplete } from '@mui/material';
import useLocales from 'src/hooks/useLocales';
//User for is admin
import useAuth from 'src/hooks/useAuth';
import { useParams } from 'react-router';
import { use } from 'i18next';
import AdminEventInfo from './AdminEventInfo';
import { getTeacher, getTeachers } from 'src/redux/slices/admin';
import { useSelector } from 'react-redux';
import { SKI_RESORTS } from 'src/utils/constants';
import dayjs from 'dayjs';


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
  console.log("event", event)
  console.log("range", range)
  const _event = {
    type: 'Own client class',
    title: '',
    description: '',
    textColor: '#1890FF',
    start: range ? dayjs(range.start).hour(9) : new Date(),
    end: range ? dayjs(range.end).subtract(1, 'day').hour(18) : new Date(),
    price: event?.price ?? 0,
    assignedStudents: event?.students ?? [],
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
  disabled: PropTypes.bool,
};

export default function CalendarForm({ event, range, onCancel, clients, members, disabled = false }) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales()
  const [selectedClients, setSelectedClients] = useState([...event?.clients || []])
  const [assignedUsers, setAssignedUsers] = useState([...event?.assignedUsers || []])
  const [assignedStudents, setAssignedStudents] = useState([...event?.students || []])
  const [state, setState] = useState(event?.state || 'PENDING')

  const [classType, setClassType] = useState('teacher');
  const user = useAuth()
  const { id } = useParams()
  const isCreating = !event?.id;
  const { teachers } = useSelector((state) => state.admin)


  const dispatch = useDispatch();

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).min(3).required('Title is required'),
    type: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000).required('Description is required'),
    price: Yup.number().min(0).max(1000000).required('Description is required'),
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
    console.log(data)

    try {
      let newEvent
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
            price: 0,
          };
          break
        default:
          newEvent = {
            ...event,
            title: data.title,
            description: data.description,
            textColor: data.textColor,
            start: data.start,
            end: data.end,
            type: data.type,
            price: data.price === null ? undefined : data.price,
            assignedUsers: assignedUsers,
            clients: selectedClients,
            id: event.id
          };
      }


      var func;
      var snackbar;
      if (event.id) {
        if (classType === 'teacher') {
          if (user?.user?.role === 'ADMIN') {
            func = updateEventByUserIdAndEventId(event.owner.id, event.id, {
              ...newEvent,
              students: assignedStudents?.map((u) => ({ id: u.id })),
              state: state,
              payed: data.payed,
              resort: data.resort
            });
            snackbar = 'Update success!'
          } else {
            func = updateEvent(event.id, newEvent);
            snackbar = 'Update success!'
          }
        }
        else if (classType === 'school') {
          func = updateBusinessEvent(event.id, newEvent);
          snackbar = 'Update success!'
        }
      }
      else {
        if (user?.user?.role === 'ADMIN') {
          dispatch(createEventByUserId(id, newEvent));
          snackbar = 'Create success!'
        } else {
          if (classType === 'teacher') {
            func = createEvent(newEvent);
            snackbar = 'Create success!'
          }
        } if (classType === 'school') {
          func = createBusinessEvent(newEvent);
          snackbar = 'Create success!'
        }
      }

      const response = dispatch(func);

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
      if (user.user.role === 'ADMIN') {
        dispatch(deleteEventByUserId(event.owner.id, event.id));
        enqueueSnackbar('Delete success!');
      } else {
        dispatch(deleteEvent(event.id));
        enqueueSnackbar('Delete success!');
      }

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (event?.owner !== null && event?.owner != undefined) {
      setClassType('teacher')
    } else if (event?.businessOwner !== null && event?.businessOwner != undefined) {
      setClassType('school')
    } else if (user?.user?.role === 'TEACHER') {
      setClassType('teacher')
    } else {
      setClassType('school')
    }


    if (user.user.role === 'ADMIN') {
      setClassType('teacher')
    }

  }, []);


  const handleSchoolChange = (onChangeEvent, newAlignment) => {
    if (event?.id !== null || event?.id != undefined) {
      return
    }
    if (user?.user?.role === 'TEACHER') {
      return
    }

    setClassType(newAlignment);
  };

  const values = watch();

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  const TYPE_OPTION = [
    { group: 'Class', classify: ['School class', 'App class', 'Own client class'] },
    { group: 'Off', classify: ['Break', 'Training', 'Illness'] },
  ];


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        {(user?.user?.role === 'ADMIN' || user?.user?.role === 'SCHOOL_ADMIN') && <ToggleButtonGroup
          color="primary"
          value={classType}
          exclusive
          onChange={handleSchoolChange}
          aria-label="Platform"
          fullWidth
        >
          <ToggleButton value="teacher">{translate('calendar.form.teacher')}</ToggleButton>
          <ToggleButton value="school">{translate('calendar.form.school')}</ToggleButton>
        </ToggleButtonGroup>}

        {user?.user?.role === 'ADMIN' && classType === 'teacher' && <AdminEventInfo event={event} />}

        {clients?.length > 0 && <Autocomplete
          disabled={disabled}
          multiple
          disableCloseOnSelect
          name="clientId" 
          label={translate('calendar.form.client')}
          value={selectedClients}
          options={[...clients].sort((a, b) => a?.name?.localeCompare(b?.name))}
          getOptionLabel={(c) => `${c?.name} ${c?.lastname} ${c.level}`}
          onChange={(event, value) => {
            setSelectedClients([...value])
          }}
          renderOption={(props, client) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar sx={{ marginRight: '10px' }}>{`${client?.name[0]}${client?.lastname[0]}`}</Avatar>
              {`${client.name} ${client.lastname}`}
            </Box>
          )}

          renderInput={(params) => (
            <RHFTextField {...params}
              disabled={disabled}
              name="clientid" label="Client" />
          )}
        />}
        {classType === 'school' && <Autocomplete
          disabled={(!members?.length > 0 && event?.businessOwner != null && event?.businessOwner != undefined)}
          disableCloseOnSelect
          multiple
          name="assigenedTeachersId"
          label={translate('calendar.form.assignedTeachers')}
          value={assignedUsers}
          options={[...members]?.sort((a, b) => a?.name?.localeCompare(b?.name)) ?? []}
          getOptionLabel={(m) => `${m?.name} ${m?.lastname}`}
          onChange={(event, value) => {
            setAssignedUsers([...value])
          }}
          renderOption={(props, member) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar sx={{ marginRight: '10px' }}>{`${member?.name[0]}${member?.lastname[0]}`}</Avatar>
              {`${member.name} ${member.lastname}`}
            </Box>
          )}
          renderInput={(params) => (
            <RHFTextField {...params}
              disabled={disabled}
              name="assigenedTeachersId"
              label={translate('calendar.form.assignedTeachers')} />
          )}

        />}

        {classType === 'school' && <Autocomplete
          name="assignedStudents" label={translate('calendar.form.assignedStudents')}
          multiple
          value={assignedStudents}
          options={teachers}
          getOptionLabel={(m) => `${m?.name} ${m?.lastname} ${m.level}`}
          onChange={(event, value) => {
            setAssignedStudents([...value])
          }}
          renderOption={(props, student) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar sx={{ marginRight: '10px' }}>{`${student?.name[0]}${student?.lastname[0]}`}</Avatar>
              {`${student?.name} ${student?.lastname} ${student.level}`}
            </Box>
          )}
          renderInput={(params) => (
            <RHFTextField {...params}
              disabled={disabled}
              name="assignedStudents" label={translate('calendar.form.assignedStudents')} />
          )}
          disabled={classType === 'teacher'}
          onInputChange={(event, value, reason) => {
            console.log("value", value)
            console.log("reason", reason)
            console.log("event", event)
            dispatch(getTeachers(0, "STUDENT", value, 0))
          }}
        />}
        {user?.user?.role === 'ADMIN' && <RHFSelect name='resort' label='Resort' onChange={(e) => {
          setValue('resort', e.target.value)
        }}>
          {SKI_RESORTS.map((resort, i) => (
            <option key={resort.title} value={resort.title}>
              {resort.title}
            </option>
          ))}
        </RHFSelect>}
        {event?.students?.length > 0 && user?.user?.role !== 'ADMIN' && <Autocomplete
          name="assignedStudentsId" label={translate('calendar.form.assignedStudents')}
          multiple
          value={event?.students}
          options={teachers}
          getOptionLabel={(m) => `${m?.name} ${m?.lastname}`}
          renderOption={(props, student) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar sx={{ marginRight: '10px' }}>{`${student?.name[0]}${student?.lastname[0]}`}</Avatar>
              {`${student?.name} ${student?.lastname}`}
            </Box>
          )}
          renderInput={(params) => (
            <RHFTextField {...params}
              disabled={disabled}
              name="assignedStudentId" label={translate('calendar.form.assignedStudents')} />
          )}

        ></Autocomplete>}
        {user.user.role === 'ADMIN' &&
          <RHFSelect
            name='state'
            label='State'
            onChange={(e) => {
              setState(e.target.value)
              setValue('state', e.target.value)
            }
            }
          >
            <option key="PENDING" value="PENDING" >
              PENDING
            </option>
            <option key="ACCEPTED" value="ACCEPTED" >
              ACCEPTED
            </option>
            <option key="DECLINED" value="DECLINED" >
              DECLINED
            </option>
          </RHFSelect>
        }
        <RHFSelect disabled={disabled} name="type" label={translate('calendar.form.type')}>
          {TYPE_OPTION.map((type, i) => (
            <optgroup key={type.group} label={type.group}>
              {type.classify.map((classify, idx) => (
                <option key={classify} value={classify} disabled={user.user.role !== 'ADMIN' ? (i === 0 && (idx === 0 || idx === 1)) : false}>
                  {classify}
                </option>
              ))}
            </optgroup>
          ))}

        </RHFSelect>
        <RHFTextField disabled={disabled} name="title" label={translate('calendar.form.title')} />

        <RHFTextField disabled={disabled} name="description" label={translate('calendar.form.description')} multiline rows={2} />

        {classType != 'school' && values?.type && !['Break', 'Training', 'Illness'].find(p => p === values.type) && (
          <RHFTextField disabled={disabled} name="price" label={translate('calendar.form.price')} />
        )}

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              disabled={disabled || classType === 'school'}
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
              disabled={disabled || classType === 'school'}
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
            <ColorSinglePicker disabled={disabled} value={field.value} onChange={field.onChange} colors={COLOR_OPTIONS} />
          )}
        />
        {/* <RHFCheckbox name='payed' label='Payed' disabled={user.user.role !== 'ADMIN'} /> */}
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

        <LoadingButton disabled={disabled} type="submit" variant="contained" loading={isSubmitting} sx={{ ':hover': { color: '#3399FF' } }}>
          {isCreating ? translate('calendar.form.add') : translate('calendar.form.edit')}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}

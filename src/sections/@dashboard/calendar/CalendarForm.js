import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, ToggleButton, ToggleButtonGroup, DialogContent, DialogTitle, Typography } from '@mui/material';
import { DialogAnimate } from '../../../components/animate';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent, createBusinessEvent, updateBusinessEvent, deleteSchoolEvent, updateEventByUserIdAndEventId, createEventByUserId, adminDeleteEvent, deleteEventByUserId, deleteBusinessEvent } from '../../../redux/slices/calendar';
// components
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch, RHFSelect, RHFCheckbox } from '../../../components/hook-form';
import { useEffect, useState } from 'react';
import { Avatar, Dialog  } from '@mui/material';
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
import { styled } from '@mui/system';
import Chip from '@mui/material/Chip';
import { slice } from 'lodash';
import ClientDetailsModal from './ClientsDetailsModal';

// ----------------------------------------------------------------------

const normalizePeople = (people) => {
  if (Array.isArray(people)) return people.filter(Boolean);
  if (people && typeof people === 'object') return Object.values(people).filter(Boolean);
  return [];
};

const mergePeopleOptions = (options = [], selected = []) => {
  const byId = new Map();
  [...options, ...selected].forEach((person) => {
    if (!person || person.id == null) return;
    if (!byId.has(person.id)) byId.set(person.id, person);
  });
  return Array.from(byId.values());
};

const personLabel = (person) => {
  if (!person) return '';
  return [person.name, person.lastname, person.level].filter(Boolean).join(' ');
};

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

const toFormDate = (value, fallback = new Date()) => {
  if (!value) return fallback;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? fallback : value;
  if (typeof value?.toDate === 'function') {
    const asDate = value.toDate();
    return Number.isNaN(asDate.getTime()) ? fallback : asDate;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
};

const getInitialValues = (event, range) => {
  const _event = {
    type: 'Own client class',
    title: '',
    description: '',
    textColor: '#1890FF',
    start: range ? dayjs(range.start).hour(9).toDate() : new Date(),
    end: range ? dayjs(range.end).subtract(1, 'day').hour(18).toDate() : new Date(),
    price: event?.price ?? 0,
    assignedStudents: normalizePeople(event?.students),
  };

  if (event || range) {
    const merged = merge({}, _event, event);
    return {
      ...merged,
      title: merged.title || (merged.id ? 'Event' : ''),
      description: merged.description || '',
      start: toFormDate(merged.start, _event.start),
      end: toFormDate(merged.end, _event.end),
    };
  }

  return _event;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  disabled: PropTypes.bool,
  ownerUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default function CalendarForm({ event, range, onCancel, clients, members, disabled = false, ownerUserId }) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales()
  const [selectedClients, setSelectedClients] = useState(normalizePeople(event?.clients))
  const [assignedUsers, setAssignedUsers] = useState(normalizePeople(event?.assignedUsers))
  const [assignedStudents, setAssignedStudents] = useState(normalizePeople(event?.students))
  const [state, setState] = useState(event?.state || 'PENDING')

  const [classType, setClassType] = useState('teacher');
  const user = useAuth()
  const { id } = useParams()
  const targetUserId = ownerUserId || id || event?.owner?.id;
  const isCreating = !event?.id;
  const isAdmin = user?.user?.role === 'ADMIN';
  const canEditDates = isAdmin && !disabled;
  const { teachers } = useSelector((state) => state.admin)
  const [showClientDetails, setShowClientDetails] = useState(false)
  const [currentClient, setCurrentClient] = useState(null)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)

  const clientOptions = mergePeopleOptions(clients, selectedClients);
  const studentOptions = mergePeopleOptions(teachers, assignedStudents);


  const dispatch = useDispatch();

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).min(3).required('Title is required'),
    type: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000).nullable(),
    price: Yup.number().min(0).max(1000000).nullable(),
    start: Yup.date().required('Start date is required'),
    end: Yup.date().required('End date is required'),
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
      const start = toFormDate(data.start);
      const end = toFormDate(data.end);

      if (isBefore(end, start)) {
        setError('end', { type: 'validate', message: 'End date must be later than start date' });
        return;
      }

      let newEvent
      switch (data.type) {
        case 'Break':
        case 'Training':
        case 'Illness':
          newEvent = {
            title: data.title,
            description: data.description || '',
            textColor: data.textColor,
            start,
            end,
            type: data.type,
            price: 0,
          };
          break
        default:
          newEvent = {
            title: data.title,
            description: data.description || '',
            textColor: data.textColor,
            start,
            end,
            type: data.type,
            price: data.price === null || data.price === undefined ? undefined : data.price,
            assignedUsers: assignedUsers,
            clients: selectedClients,
            id: event.id
          };
      }


      var func;
      var snackbar;
      if (event.id) {
        if (classType === 'teacher') {
          if (isAdmin) {
            func = updateEventByUserIdAndEventId(targetUserId || event.owner?.id, event.id, {
              id: event.id,
              title: newEvent.title,
              description: newEvent.description,
              textColor: newEvent.textColor,
              start: newEvent.start,
              end: newEvent.end,
              type: newEvent.type,
              price: newEvent.price,
              clients: selectedClients?.map((c) => ({ id: c.id })),
              students: assignedStudents?.map((u) => ({ id: u.id })),
              state: state,
              payed: data.payed,
              resort: data.resort || event.resort,
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
        if (isAdmin) {
          func = createEventByUserId(targetUserId, newEvent);
          snackbar = 'Create success!'
        } else if (classType === 'teacher') {
          func = createEvent(newEvent);
          snackbar = 'Create success!'
        } else if (classType === 'school') {
          func = createBusinessEvent(newEvent);
          snackbar = 'Create success!'
        }
      }

      if (!func) return;

      const response = await dispatch(func);

      if (response?.messages) {
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
      enqueueSnackbar('Update failed', { variant: 'error' });
    }
  };

  const handleOpenDeleteModal = () => {
    setIsOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!event?.id) return;
    try {
      if (isAdmin) {
        if (targetUserId) {
          await dispatch(deleteEventByUserId(targetUserId, event.id));
        } else {
          await dispatch(adminDeleteEvent(event.id));
        }
      } else if (classType === 'teacher') {
        await dispatch(deleteEvent(event.id));
      } else if (classType === 'school') {
        await dispatch(deleteBusinessEvent(event.id));
      } else {
        return;
      }
      handleCloseDeleteModal();
      enqueueSnackbar(translate('calendar.deleteDialog.success'));
      onCancel();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(translate('calendar.deleteDialog.error'), { variant: 'error' });
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


    // if (user.user.role === 'ADMIN') {
    //   setClassType('teacher')
    // }

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

  const getClientColor = (client) => {
    const level = client?.level;
    if (level === 'BEGINNER') return '#FF4842';
    if (level === 'INTERMEDIATE') return '#1890FF';
    if (level === 'ADVANCED') return '#54D62C';
  }

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  const TYPE_OPTION = [
    { group: 'Class', classify: ['School class', 'App class', 'Own client class'] },
    { group: 'Off', classify: ['Break', 'Training', 'Illness'] },
  ];

  const handleClientDetails = (client) => {
    setCurrentClient(client)
    setShowClientDetails(true)
  }


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
        
         <Autocomplete
          disabled={disabled}
          multiple
          disableCloseOnSelect
          name="clientId"
          label={translate('calendar.form.client')}
          value={selectedClients}
          options={[...clientOptions].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))}
          getOptionLabel={personLabel}
          isOptionEqualToValue={(option, value) => String(option?.id) === String(value?.id)}
          onChange={(event, value) => {
            setSelectedClients([...value])
          }}
          renderTags={(tagValue, getTagProps) => (
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option?.id ?? index}
                variant='outlined'
                onClick={() => {
                  handleClientDetails(option)}}
                label={`${option.name || ''} ${option.lastname || ''} ${option?.level ? option.level.slice(0, 3) : ''}`.trim()}
                sx={{ borderColor: getClientColor(option) }}
              />
            )))}
          renderOption={(props, client) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 }, backgroundColor: getClientColor(client) }} {...props}>
              <Avatar sx={{ marginRight: '10px' }}>{`${client?.name?.[0] || ''}${client?.lastname?.[0] || ''}`}</Avatar>
              {personLabel(client)}
            </Box>
          )}

          renderInput={(params) => (
            <RHFTextField {...params}
              disabled={disabled}
              name="clientid" label={translate('calendar.form.client')} />
          )}
        />
        {classType === 'school' && <Autocomplete
          disabled={(!members?.length > 0 && event?.businessOwner != null && event?.businessOwner != undefined)}
          disableCloseOnSelect
          multiple
          name="assigenedTeachersId"
          label={translate('calendar.form.assignedTeachers')}
          value={assignedUsers}
          options={[...members]?.sort((a, b) => a?.name?.localeCompare(b?.name)) ?? []}
          getOptionLabel={(m) => `${m?.name} ${m?.lastname}`}
          isOptionEqualToValue={(option, value) => String(option?.id) === String(value?.id)}
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

        {(classType === 'school' || isAdmin) && <Autocomplete
          name="assignedStudents" label={translate('calendar.form.assignedStudents')}
          multiple
          value={assignedStudents}
          options={[...studentOptions].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))}
          getOptionLabel={personLabel}
          isOptionEqualToValue={(option, value) => String(option?.id) === String(value?.id)}
          onChange={(event, value) => {
            setAssignedStudents([...value])
          }}
          renderTags={(tagValue, getTagProps) => (
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option?.id ?? index}
                variant="outlined"
                label={personLabel(option)}
              />
            ))
          )}
          renderOption={(props, student) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar sx={{ marginRight: '10px' }}>{`${student?.name?.[0] || ''}${student?.lastname ? student?.lastname[0] : ''}`}</Avatar>
              {personLabel(student)}
            </Box>
          )}
          renderInput={(params) => (
            <RHFTextField {...params}
              disabled={disabled}
              name="assignedStudents" label={translate('calendar.form.assignedStudents')} />
          )}
          disabled={disabled}
          onInputChange={(event, value) => {
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
        {!isAdmin && event?.students?.length > 0 && <Autocomplete
          name="assignedStudentsId" label={translate('calendar.form.assignedStudents')}
          multiple
          value={normalizePeople(event?.students)}
          options={studentOptions}
          getOptionLabel={personLabel}
          isOptionEqualToValue={(option, value) => String(option?.id) === String(value?.id)}
          renderOption={(props, student) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar sx={{ marginRight: '10px' }}>{`${student?.name?.[0] || ''}${student?.lastname?.[0] || ''}`}</Avatar>
              {personLabel(student)}
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
        {!disabled && <RHFSelect disabled={disabled} name="type" label={translate('calendar.form.type')}>
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
        }
        <RHFTextField disabled={disabled} name="title" label={translate('calendar.form.title')} />

        <RHFTextField disabled={disabled} name="description" label={translate('calendar.form.description')} multiline rows={2} />

        {classType != 'school' && values?.type && !['Break', 'Training', 'Illness'].find(p => p === values.type) && (
          <RHFTextField disabled={disabled} name="price" label={translate('calendar.form.price')} />
        )}

        <Controller
          name="start"
          control={control}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <MobileDateTimePicker
              {...field}
              inputRef={ref}
              disabled={!canEditDates}
              value={value ? toFormDate(value) : null}
              onChange={(nextValue) => onChange(nextValue ? toFormDate(nextValue) : null)}
              label={translate('calendar.form.startDate')}
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field: { value, onChange, ref, ...field } }) => (
            <MobileDateTimePicker
              {...field}
              inputRef={ref}
              disabled={!canEditDates}
              value={value ? toFormDate(value) : null}
              onChange={(nextValue) => onChange(nextValue ? toFormDate(nextValue) : null)}
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

        {!disabled && <Controller
          name="textColor"
          control={control}
          render={({ field }) => (
            <ColorSinglePicker disabled={disabled} value={field.value} onChange={field.onChange} colors={COLOR_OPTIONS} />
          )}
        />}
        {/* <RHFCheckbox name='payed' label='Payed' disabled={user.user.role !== 'ADMIN'} /> */}
      </Stack>
      <ClientDetailsModal showClientDetails={showClientDetails} setShowClientDetails={setShowClientDetails} currentClient={currentClient} />
      <DialogAnimate open={isOpenDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>{translate('calendar.deleteDialog.title')}</DialogTitle>
        <DialogContent>
          <Typography>{translate('calendar.deleteDialog.body')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDeleteModal}>
            {translate('calendar.deleteDialog.cancel')}
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            {translate('calendar.deleteDialog.confirm')}
          </Button>
        </DialogActions>
      </DialogAnimate>
      <DialogActions>
        {!isCreating && (
          <Tooltip title={translate('calendar.deleteDialog.tooltip')}>
            <IconButton onClick={handleOpenDeleteModal} disabled={disabled}>
              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          {translate('calendar.form.cancel')}
        </Button>

        <LoadingButton disabled={disabled || isDateError} type="submit" variant="contained" loading={isSubmitting} sx={{ ':hover': { color: '#3399FF' } }}>
          {isCreating ? translate('calendar.form.add') : translate('calendar.form.edit')}
        </LoadingButton>
      </DialogActions>

    </FormProvider>
  );
}

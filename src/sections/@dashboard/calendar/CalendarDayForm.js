import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, ToggleButton, ToggleButtonGroup, Paper, Typography, Grid } from '@mui/material';
import { DateRangePicker, LoadingButton, MobileDatePicker, MobileDateTimePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent, createBusinessEvent, updateBusinessEvent, deleteSchoolEvent, updateEventByUserIdAndEventId, createEventByUserId, deleteEventByUserId, blockDays, assignDays, } from '../../../redux/slices/calendar';
// components
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch, RHFSelect, RHFCheckbox } from '../../../components/hook-form';
import React, { useEffect, useState } from 'react';
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

CalendarDayForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function CalendarDayForm({ event, range, onCancel, clients, members, disabled = false }) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales()
  const [selectedClients, setSelectedClients] = useState([...event?.clients || []])
  const [selectedMembers, setSelectedMembers] = useState([...event?.assignedUsers || []])
  const [assignedUsers, setAssignedUsers] = useState([...event?.assignedUsers || []])
  const [assignedStudents, setAssignedStudents] = useState([...event?.students || []])
  const [state, setState] = useState(event?.state || 'PENDING')
  const [isDisabled, setIsDisabled] = useState(disabled)

  const [classType, setClassType] = useState('teacher');
  const user = useAuth()
  const { id } = useParams()
  const isCreating = !event?.id;
  const { teachers } = useSelector((state) => state.admin)

  const [block, setBlock] = useState('block')
  const [timeSelected, setTimeSelected] = useState(null)

  const handleChange = (
    event,
    category,
  ) => {
    console.log({ category })
    console.log({ event })
    if (classType == "teacher") {
      if (category === 'block') {
        setBlock('block')
      } else {
        setBlock('assign')
      }
    } else {
      setBlock('school')
    }
  };


  const dispatch = useDispatch();

  const EventSchema = Yup.object().shape({
    // title: Yup.string().max(255).min(3).required('Title is required'),
    // type: Yup.string().max(255).required('Title is required'),
    // description: Yup.string().max(5000).required('Description is required'),
    // price: Yup.number().min(0).max(1000000).required('Description is required'),
  });

  const handleBlock = () => {
    dispatch(blockDays(
      values.start,
      values.start,
      timeSelected,
      "Bloqueado por el instructor"
    ))
    enqueueSnackbar("Calendario bloqueado");
    onCancel();
  }

  const handleAssign = () => {
    dispatch(assignDays(
      values.start,
      values.start,
      timeSelected,
      "Asignada por el  instructor",
      selectedClients
    ))
    enqueueSnackbar("Clase Asignada");
    onCancel();
  }

  function setLessonTime(event) {
    // Extract the start and end dates from the event
    let start = new Date(event.start);
    let end = new Date(event.end);

    if (timeSelected === 'ALL_DAY') {
      start.setHours(9, 0, 0, 0); // Set start time to 9:00 AM
      end.setHours(17, 0, 0, 0); // Set end time to 5:00 PM
    } else if (timeSelected === 'MORNING') {
      start.setHours(9, 0, 0, 0); // Set start time to 9:00 AM
      end.setHours(13, 0, 0, 0); // Set end time to 1:00 PM
    } else { // Assume 'AFTERNOON'
      start.setHours(13, 0, 0, 0); // Set start time to 1:00 PM
      end.setHours(17, 0, 0, 0); // Set end time to 5:00 PM
    }

    // Format date to ISO string without converting to UTC
    function formatLocalISODate(date) {
      const pad = (number) => (number < 10 ? '0' : '') + number;
      return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds());
    }

    // Update the event object with new start and end times
    event.start = formatLocalISODate(start);
    event.end = formatLocalISODate(end);

    // // Update the event object with new start and end times
    // event.start = start.toISOString();
    // event.end = end.toISOString();
  }

  const handleCreateSchoolEvent = () => {
    let newEvent
    newEvent = {
      ...event,
      title: "Asignada",
      description: "Creada manualmente",
      textColor: "#FFC107",
      start: values.start,
      end: values.end,
      assignedUsers: selectedMembers,
      clients: selectedClients,
    };
    setLessonTime(newEvent, timeSelected)
    const response = dispatch(createBusinessEvent(newEvent));

    enqueueSnackbar("Clase Asignada");
    onCancel();
  }

  // const handleEditSchoolEvent = () => {
  //   newEvent = {
  //     ...event,
  //     title: data.title,
  //     description: data.description,
  //     textColor: data.textColor,
  //     start: data.start,
  //     end: data.end,
  //     type: data.type,
  //     price: data.price === null ? undefined : data.price,
  //     assignedUsers: assignedUsers,
  //     clients: selectedClients,
  //     id: event.id
  //   };
  //   const response = dispatch(updateBusinessEvent(event.id, newEvent));
  //   enqueueSnackbar("Clase Asignada");
  //   onCancel();
  // }

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
      setBlock('school')
    } else if (user?.user?.administeredBusiness != null && event?.administeredBusiness != undefined) {
      setClassType('school')
      setBlock('school')
    } else if (user?.user?.role === 'TEACHER') {
      setClassType('teacher')
    } else {
      setClassType('school')
      setBlock('school')
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
    <FormProvider methods={methods} onSubmit={handleSubmit(handleBlock)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        {classType != "teacher" && <Typography
          variant="body2"
          sx={{
            maxWidth: 260,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: 'text.disabled',
            textOverflow: 'ellipsis',
          }}
        >
          {classType}
        </Typography>}
        {classType === "teacher" && <ToggleButtonGroup
          color="primary"
          value={block}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          sx={{
            width: '100%',
            borderRadius: 10,
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
        >
          <ToggleButton
            value="block"
            sx={{
              width: '100%',
              borderRadius: 10,
              justifyContent: 'center',
              '&.MuiButtonBase-root': {
                borderRadius: '100px !important',
              },
            }}
          >
            Bloquear
          </ToggleButton>
          <ToggleButton
            value="assign"
            sx={{
              width: '100%',
              borderRadius: 10,
              justifyContent: 'center',
              '&.MuiButtonBase-root': {
                borderRadius: '100px !important',
              },
            }}
          >
            Asignar Cliente
          </ToggleButton>


        </ToggleButtonGroup>
        }
        <Box>
          <MobileDatePicker
            label="Día"
            value={values.start}
            onChange={(newValue) => {
              setValue('start', newValue);
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>
        {block === 'block' && <>
          <Grid spacing={2} direction={{ xs: 'column', md: 'column ' }}>
            <Paper
              onClick={() => {
                setTimeSelected('ALL_DAY')
              }}
              sx={{
                p: 3,
                width: 1,
                my: 2,
                border: (theme) => `solid 1px ${timeSelected === 'ALL_DAY' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography color={timeSelected === 'ALL_DAY' ? 'primary' : ''} variant="h6">Todo el día</Typography>
              {timeSelected === 'ALL_DAY' && <Typography color={timeSelected === 'ALL_DAY' ? 'primary' : ''} variant="subtitle2">Al bloquear tu día completo no podrán hacerte contrataciones este día</Typography>
              }
            </Paper>
            <Paper

              onClick={() => {
                setTimeSelected('MORNING')
              }}

              sx={{
                p: 3,
                width: 1,
                my: 2,
                border: (theme) => `solid 1px ${timeSelected === 'MORNING' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography variant="h6" color={timeSelected === 'MORNING' ? 'primary' : ''}>Mañana</Typography>
              {timeSelected === 'MORNING' && <Typography color={timeSelected === 'MORNING' ? 'primary' : ''} variant="subtitle2">Al bloquear tu turno de mañana no podrán hacerte contrataciones este día entre las 8:00am y las 12:00pm</Typography>
              }

            </Paper>
            <Paper
              onClick={() => {
                setTimeSelected('AFTERNOON')
              }}
              sx={{
                p: 3,
                width: 1,
                my: 2,
                border: (theme) => `solid 1px ${timeSelected === 'AFTERNOON' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography color={timeSelected === 'AFTERNOON' ? 'primary' : ''} variant="h6">Tarde</Typography>
              {timeSelected === 'AFTERNOON' && <Typography color={timeSelected === 'AFTERNOON' ? 'primary' : ''} variant="subtitle2">Al bloquear tu turno de tarde no podrán hacerte contrataciones este día entre las 2:30pm y las 17:30pm</Typography>
              }

            </Paper>
          </Grid>
        </>}

        {block === 'assign' && <>
          <Grid spacing={2} direction={{ xs: 'column', md: 'column ' }}>

            <Paper
              onClick={() => {
                setTimeSelected('ALL_DAY')
              }}
              sx={{
                p: 3,
                my: 2,
                width: 1,
                border: (theme) => `solid 1px ${timeSelected === 'ALL_DAY' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography color={timeSelected === 'ALL_DAY' ? 'primary' : ''} variant="h6">Todo el día</Typography>
              {timeSelected === 'ALL_DAY' && <Typography color={timeSelected === 'ALL_DAY' ? 'primary' : ''} variant="subtitle2">Al bloquear tu día completo no podrán hacerte contrataciones este día</Typography>
              }
              {timeSelected === 'ALL_DAY' && clients?.length > 0 && <Autocomplete
                disabled={disabled}
                multiple
                disableCloseOnSelect
                name="clientId" label={translate('calendar.form.client')}
                value={selectedClients}
                options={[...clients].sort((a, b) => a?.name?.localeCompare(b?.name))}
                getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
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
                    name="clientid" label="Client" sx={{ my: 2 }} />
                )}
              />}

            </Paper>
            <Paper

              onClick={() => {
                setTimeSelected('MORNING')
              }}

              sx={{
                p: 3,
                width: 1,
                my: 2,
                border: (theme) => `solid 1px ${timeSelected === 'MORNING' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography variant="h6" color={timeSelected === 'MORNING' ? 'primary' : ''}>Mañana</Typography>
              {timeSelected === 'MORNING' && <Typography color={timeSelected === 'MORNING' ? 'primary' : ''} variant="subtitle2">Al bloquear tu turno de mañana no podrán hacerte contrataciones este día entre las 8:00am y las 12:00pm</Typography>
              }
              {timeSelected === 'MORNING' && clients?.length > 0 && <Autocomplete
                disabled={disabled}
                multiple
                disableCloseOnSelect
                name="clientId" label={translate('calendar.form.client')}
                value={selectedClients}
                options={[...clients].sort((a, b) => a?.name?.localeCompare(b?.name))}
                getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
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
                    name="clientid" label="Client" sx={{ my: 2 }} />
                )}
              />}

            </Paper>
            <Paper
              onClick={() => {
                setTimeSelected('AFTERNOON')
              }}
              sx={{
                p: 3,
                width: 1,
                my: 2,
                border: (theme) => `solid 1px ${timeSelected === 'AFTERNOON' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography color={timeSelected === 'AFTERNOON' ? 'primary' : ''} variant="h6">Tarde</Typography>
              {timeSelected === 'AFTERNOON' && <Typography color={timeSelected === 'AFTERNOON' ? 'primary' : ''} variant="subtitle2">Al bloquear tu turno de tarde no podrán hacerte contrataciones este día entre las 2:30pm y las 17:30pm</Typography>
              }
              {timeSelected === 'AFTERNOON' && clients?.length > 0 && <Autocomplete
                disabled={disabled}
                multiple
                disableCloseOnSelect
                name="clientId" label={translate('calendar.form.client')}
                value={selectedClients}
                options={[...clients].sort((a, b) => a?.name?.localeCompare(b?.name))}
                getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
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
                    name="clientid" label="Client" sx={{ my: 2 }} />
                )}
              />}

            </Paper>
          </Grid>
        </>}


        {block === 'school' && <>
          <Grid spacing={2} direction={{ xs: 'column', md: 'column ' }}>

            <Paper
              onClick={() => {
                setTimeSelected('ALL_DAY')
              }}
              sx={{
                p: 3,
                my: 2,
                width: 1,
                border: (theme) => `solid 1px ${timeSelected === 'ALL_DAY' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography color={timeSelected === 'ALL_DAY' ? 'primary' : ''} variant="h6">Todo el día</Typography>
              {timeSelected === 'ALL_DAY' && <Typography color={timeSelected === 'ALL_DAY' ? 'primary' : ''} variant="subtitle2">Al bloquear tu día completo no podrán hacerte contrataciones este día</Typography>
              }
              {timeSelected === 'ALL_DAY' && clients?.length > 0 && <><Autocomplete
                disabled={disabled}
                multiple
                disableCloseOnSelect
                name="clientId" label={translate('calendar.form.client')}
                value={selectedClients}
                options={[...clients].sort((a, b) => a?.name?.localeCompare(b?.name))}
                getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
                onChange={(event, value) => {
                  setSelectedClients([...value])
                }}
                renderOption={(props, clients) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar sx={{ marginRight: '10px' }}>{`${clients?.name[0]}${clients?.lastname[0]}`}</Avatar>
                    {`${clients.name} ${clients.lastname}`}
                  </Box>
                )}

                renderInput={(params) => (
                  <RHFTextField {...params}
                    disabled={disabled}
                    name="clientsid" label="Clients" sx={{ my: 2 }} />
                )}
              />
                <Autocomplete
                  disabled={disabled}
                  multiple
                  disableCloseOnSelect
                  name="membersId" label={translate('calendar.form.member')}
                  value={selectedMembers}
                  options={[...members].sort((a, b) => a?.name?.localeCompare(b?.name))}
                  getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
                  onChange={(event, value) => {
                    setSelectedMembers([...value])
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
                      name="memberid" label="Members" sx={{ my: 2 }} />
                  )}
                /></>}

            </Paper>
            <Paper

              onClick={() => {
                setTimeSelected('MORNING')
              }}

              sx={{
                p: 3,
                width: 1,
                my: 2,
                border: (theme) => `solid 1px ${timeSelected === 'MORNING' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography variant="h6" color={timeSelected === 'MORNING' ? 'primary' : ''}>Mañana</Typography>
              {timeSelected === 'MORNING' && <Typography color={timeSelected === 'MORNING' ? 'primary' : ''} variant="subtitle2">Al bloquear tu turno de mañana no podrán hacerte contrataciones este día entre las 8:00am y las 12:00pm</Typography>
              }
              {timeSelected === 'MORNING' && members?.length > 0 && <><Autocomplete
                disabled={disabled}
                multiple
                disableCloseOnSelect
                name="clientId" label={translate('calendar.form.client')}
                value={selectedClients}
                options={[...clients].sort((a, b) => a?.name?.localeCompare(b?.name))}
                getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
                onChange={(event, value) => {
                  setSelectedClients([...value])
                }}
                renderOption={(props, clients) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar sx={{ marginRight: '10px' }}>{`${clients?.name[0]}${clients?.lastname[0]}`}</Avatar>
                    {`${clients.name} ${clients.lastname}`}
                  </Box>
                )}

                renderInput={(params) => (
                  <RHFTextField {...params}
                    disabled={disabled}
                    name="clientsid" label="Clients" sx={{ my: 2 }} />
                )}
              />
                <Autocomplete
                  disabled={disabled}
                  multiple
                  disableCloseOnSelect
                  name="membersId" label={translate('calendar.form.member')}
                  value={selectedMembers}
                  options={[...members].sort((a, b) => a?.name?.localeCompare(b?.name))}
                  getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
                  onChange={(event, value) => {
                    setSelectedMembers([...value])
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
                      name="memberid" label="Members" sx={{ my: 2 }} />
                  )}
                /></>}

            </Paper>
            <Paper
              onClick={() => {
                setTimeSelected('AFTERNOON')
              }}
              sx={{
                p: 3,
                width: 1,
                my: 2,
                border: (theme) => `solid 1px ${timeSelected === 'AFTERNOON' ? theme.palette.primary.main : theme.palette.grey[500_32]}`,

              }}
            >
              {/* picture or icon */}
              <Typography color={timeSelected === 'AFTERNOON' ? 'primary' : ''} variant="h6">Tarde</Typography>
              {timeSelected === 'AFTERNOON' && <Typography color={timeSelected === 'AFTERNOON' ? 'primary' : ''} variant="subtitle2">Al bloquear tu turno de tarde no podrán hacerte contrataciones este día entre las 2:30pm y las 17:30pm</Typography>
              }
              {timeSelected === 'AFTERNOON' && members?.length > 0 && <><Autocomplete
                disabled={disabled}
                multiple
                disableCloseOnSelect
                name="clientId" label={translate('calendar.form.client')}
                value={selectedClients}
                options={[...clients].sort((a, b) => a?.name?.localeCompare(b?.name))}
                getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
                onChange={(event, value) => {
                  setSelectedClients([...value])
                }}
                renderOption={(props, clients) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar sx={{ marginRight: '10px' }}>{`${clients?.name[0]}${clients?.lastname[0]}`}</Avatar>
                    {`${clients.name} ${clients.lastname}`}
                  </Box>
                )}

                renderInput={(params) => (
                  <RHFTextField {...params}
                    disabled={disabled}
                    name="clientsid" label="Clients" sx={{ my: 2 }} />
                )}
              />
                <Autocomplete
                  disabled={disabled}
                  multiple
                  disableCloseOnSelect
                  name="membersId" label={translate('calendar.form.member')}
                  value={selectedMembers}
                  options={[...members].sort((a, b) => a?.name?.localeCompare(b?.name))}
                  getOptionLabel={(c) => `${c?.name} ${c?.lastname}`}
                  onChange={(event, value) => {
                    setSelectedMembers([...value])
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
                      name="memberid" label="Members" sx={{ my: 2 }} />
                  )}
                /></>}

            </Paper>
          </Grid>
        </>}


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

        <Button fullWidth variant="outlined" color="inherit" onClick={onCancel}>
          {translate('calendar.form.cancel')}
        </Button>

        <LoadingButton fullWidth disabled={disabled || timeSelected === null}
          // type="submit" 
          variant="contained" loading={isSubmitting} sx={{ ':hover': { color: '#3399FF' } }} onClick={classType === "school" ? handleCreateSchoolEvent : block === 'block' ? handleBlock : handleAssign}>
          {classType === "school" ? "createSchool" : block === 'block' ? 'Bloquear' : 'Asignar'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}

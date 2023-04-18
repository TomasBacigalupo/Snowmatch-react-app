import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton, MobileDatePicker, TimePicker } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment, Box, ToggleButton, ToggleButtonGroup, Select, Button, ButtonBase } from '@mui/material';
import { CalendarStyle, CalendarToolbar } from '../calendar';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
  RHFMultipleSelect,
} from '../../../components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useLocales from 'src/hooks/useLocales';
import { ski_resorts } from 'src/_mock';
import { ski_resorts_grouped } from 'src/_mock/ski_resorts_simple';
import Iconify from 'src/components/Iconify';
import { fi } from 'date-fns/locale';
import uuidv4 from 'src/utils/uuidv4';
import product, { createProduct, deleteProduct, editProduct } from 'src/redux/slices/product';
import useAuth from 'src/hooks/useAuth';
import { student_level } from 'src/_mock/studentLevel';
// ----------------------------------------------------------------------

// const TAGS_OPTION = [
//   'Escuela',
//   'Jardin de Nieve',
//   'Bloques Junior',
// ];

const DAYS = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 }
]

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const getDefaultEndDate = () => {
  let d = new Date
  d.setDate(new Date().getDate() + 1)
  return d
}

const getDefaultStartTime = () => {
  let t = new Date()
  t.setHours(9)
  t.setMinutes(0)
  t.setSeconds(0)
  return t
}

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const { user } = useAuth();
  const dispatch = useDispatch()
  const [date, setDate] = useState(new Date());
  const { enqueueSnackbar } = useSnackbar();
  const [view, setView] = useState(true ? 'dayGridMonth' : 'listWeek');
  const { translate } = useLocales()
  const [selectedDays, setSelectedDays] = useState(() => [0, 1, 2, 3, 4, 5, 6]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [time, setTime] = useState(getDefaultStartTime());
  const [events, setEvents] = useState([])
  const [draggable, setDraggable] = useState()
  const draggableRef = createRef()
  const trashRef = createRef()
  const { success, error, isLoading } = useSelector(state => state.product)


  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(64, translate("product.name.max", { "max": 64 })),
    lengthInMinutes: Yup.number().required('Time is required').lessThan(1440, translate("product.time.max", { "max": 1440 })).moreThan(0, translate("product.time.min", { "min": 0 })),
    description: Yup.string().required('Description is required').max(256, translate("product.description.max", { "max": 256 })),
    // images: Yup.array().min(1, 'Images is required', (value) => value !== ''),
    price: Yup.number().moreThan(0, translate("product.price.moreThan")),
    resort: Yup.string().required(translate("product.resort.required")),
    maxStudents: Yup.number().moreThan(0, translate("product.resort.moreThan")),
    ageFrom: Yup.number().moreThan(0, translate("product.ageFrom.moreThan")),
    ageTo: Yup.number().lessThan(100, translate("product.agetTo.lessThan")),
    isMinors: Yup.boolean()
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      // images: currentProduct?.images || [],
      maxStudents: currentProduct?.maxStudents || 10,
      ageFrom: currentProduct?.ageTo || 18,
      ageTo: currentProduct?.ageFrom || 80,
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      lengthInMinutes: currentProduct?.lengthInMinutes || 60,
      // tags: currentProduct?.tags || [TAGS_OPTION[0]],
      isMinors: currentProduct?.isMinors || false,
      saleConsecutive: currentProduct?.saleConsecutive || false,
      saleLastSpots: currentProduct?.saleLastSpots || false,
      resort: currentProduct?.resort || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  useEffect(() => {
    if (currentProduct != undefined)
      setEvents([...currentProduct?.events])
    else setEvents([])

  }, [currentProduct]);

  // useEffect(() => {
  //   console.log("currentProduct ",currentProduct)
  //   if(currentProduct!=undefined)
  //     setEvents(JSON.parse(JSON.stringify(currentProduct?.events)))
  // }, [currentProduct]);

  useEffect(() => {
    setEvents(events.map((event) => ({ ...event, title: values.name })))
  }, [values.name]);

  useEffect(() => {
    console.log("currentProduct", currentProduct)
  }, [currentProduct]);


  useEffect(() => {
    let tmpEvents = events
    tmpEvents = tmpEvents.map((event) => {
      let d = new Date(event.start)
      d.setTime(d.getTime() + values.lengthInMinutes * 60 * 1000)
      event.end = d
      return { ...event, end: d }
    })
    setEvents([...tmpEvents])
  }, [values.lengthInMinutes]);


  useEffect(() => {
    if (draggable === undefined) {
      let dragg = new Draggable(draggableRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let id = uuidv4()
          return {
            title: eventEl.title,
            id: id,
            create: false
          };
        }
      })
      setDraggable(dragg)
    }

  }, [])


  const onSubmit = async (data) => {
    let product = data
    product.events = events
    product.events.map((event) => {
      event.start = event.start
      event.type = "Product class"
      event.price = data.price
      event.description = "Event created for " + data.name + " product"

    })
    console.log(data)
    if (!isEdit) {
      if (user?.user?.role === 'SCHOOL_ADMIN') {
        dispatch(createProduct(product, false))
      } else {
        dispatch(createProduct(product, true))
      }
    } else {
      if (user?.user?.role === 'SCHOOL_ADMIN') {
        dispatch(editProduct(product, false, currentProduct.id))
      } else {
        dispatch(editProduct(product, true, currentProduct.id))
      }
    }
    if (success !== "") {
      enqueueSnackbar(success)
    } else {
      enqueueSnackbar(error)
    }
  };

  //todo checkquear fechas sean correctas 

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     setValue(
  //       'images',
  //       acceptedFiles.map((file) =>
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file),
  //         })
  //       )
  //     );
  //   },
  //   [setValue]
  // );

  // const handleRemoveAll = () => {
  //   setValue('images', []);
  // };

  // const handleRemove = (file) => {
  //   const filteredItems = values.images?.filter((_file) => _file !== file);
  //   setValue('images', filteredItems);
  // };

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    //dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg) => {
    const id = arg.event.id
    //dispatch(selectEvent(id));
  };

  const handleResizeEvent = async ({ event }) => {
    try {
      // dispatch(
      //   updateEvent(event.id, {
      //     ...event,
      //     start: event.start,
      //     end: event.end,
      //   })
      // );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropStop = async (info) => {
    let trashCoords = trashRef.current.getBoundingClientRect()
    if (info.jsEvent.clientX > trashCoords.left && info.jsEvent.clientX < trashCoords.right && info.jsEvent.clientY < trashCoords.bottom && info.jsEvent.clientY > trashCoords.top
    ) {
      let tmpEvents = events
      tmpEvents.filter((event, index, arr) => {
        if (event.id == info.event.id) {
          arr.splice(index, 1)
          return true
        }
        return false
      })
      setEvents([...tmpEvents])
      enqueueSnackbar("Delete success!")
    }

  };

  const handleDropExternalEvent = (event) => {
    let newEvent = {}
    newEvent.title = values.name
    let d = new Date(event.date)
    newEvent.start = new Date(event.date)
    d.setTime(d.getTime() + 60 * 1000 * values.lengthInMinutes)
    newEvent.end = d
    newEvent.id = uuidv4()
    newEvent.textColor = '#3399ff'

    setEvents([...events, newEvent])
  }



  const handleDropEvent = async (eventInfo) => {
    try {
      let tmpEvents = events
      tmpEvents.filter((event, index, arr) => {
        if (event.id == eventInfo.oldEvent.id) {
          arr.splice(index, 1)
          return true
        }
        return false
      })
      let endDate = new Date()
      endDate.setTime(eventInfo.event.start.getTime() + 60 * 1000 * values.lengthInMinutes)
      let event = {
        title: eventInfo.event.title,
        start: eventInfo.event.start,
        id: eventInfo.event.id,
        end: endDate,
        textColor: '#3399ff'
      }
      setEvents([...tmpEvents, event])
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    // dispatch(openModal());
  };

  const handleCloseModal = () => {
    // dispatch(closeModal());
  };

  const handelSelectDays = (event, newFormats) => {
    setSelectedDays(newFormats);
  };

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };



  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleChangeTime = (newValue) => {
    setTime(newValue);
  };

  const handleGenerateEvents = () => {
    let tempEventList = []
    for (var start = new Date(startDate); start <= endDate; start.setDate(start.getDate() + 1)) {
      if (selectedDays.includes(start.getDay())) {
        let e = {}
        e.id = uuidv4()
        e.title = values.name
        e.start = new Date(start)
        e.start.setHours(time.getHours())
        e.start.setSeconds(time.getSeconds())
        e.start.setMinutes(time.getMinutes())
        e.end = new Date(e.start)
        e.end.setTime(e.end.getTime() + 60 * 1000 * values.lengthInMinutes)
        e.textColor = '#3399ff'
        tempEventList.push(e)
      }
    }
    setEvents([...events, ...tempEventList])
    enqueueSnackbar("Events generated success!")

  }

  const handleDeleteEvents = () => {
    if (events.length != 0) {
      enqueueSnackbar("Delete success!")
    }
    setEvents([])
  }

  const handleDeleteProduct = () => {
    console.log("asds")
    if (user?.user?.role === 'SCHOOL_ADMIN') {
      dispatch(deleteProduct(false, currentProduct.id))
    } else {
      dispatch(deleteProduct(true, currentProduct.id))
    }
    if (success !== "") {
      enqueueSnackbar(success)
    } else {
      enqueueSnackbar(error)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label={translate("product.name.value")} />
              <div>
                <LabelStyle>{translate("product.description")}</LabelStyle>
                <RHFTextField rows={2} multiline name="description" />
              </div>


              {/* <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadMultiFile
                  name="images"
                  showPreview
                  accept="image/*"
                  maxSize={16000000}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div> */}
              <CalendarStyle>
                <CalendarToolbar
                  date={date}
                  view={view}
                  onNextDate={handleClickDateNext}
                  onPrevDate={handleClickDatePrev}
                  onToday={handleClickToday}
                  onChangeView={handleChangeView}
                />
                <FullCalendar
                  weekends
                  editable
                  droppable
                  selectable
                  events={events}
                  ref={calendarRef}
                  rerenderDelay={10}
                  initialDate={date}
                  initialView={view}
                  dayMaxEventRows={3}
                  eventDisplay="block"
                  headerToolbar={false}
                  allDayMaintainDuration
                  eventResizableFromStart
                  //select={handleSelectRange}
                  drop={handleDropExternalEvent}
                  eventDrop={handleDropEvent}
                  eventClick={handleSelectEvent}
                  eventResize={handleResizeEvent}
                  eventDragStop={handleDropStop}
                  height={'auto'}
                  plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                />
              </CalendarStyle>
              <Box sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}>
                <Button color="error" variant="contained" endIcon={<Iconify style={{ fontSize: '18px' }} icon={'eva:trash-2-outline'} />} ref={trashRef}>{translate("product.dropToDelete")}</Button>
                <Button color="error" variant="contained" endIcon={<Iconify style={{ fontSize: '18px' }} icon={'eva:trash-2-outline'} />} onClick={handleDeleteEvents}>{translate("product.deleteAll")}</Button>
              </Box>
            </Stack>
          </Card>
          <Card sx={{ p: 3, mt: 2 }} spacing={3}>
            <Stack spacing={3} mb={2}>
              <Typography variant="h3">{translate("product.generator")}</Typography>
              <ToggleButtonGroup fullWidth value={selectedDays} onChange={handelSelectDays}>
                {DAYS.map((day) => (
                  <ToggleButton color={"primary"} value={day.id} key={day.id}>{translate("product.date." + day.id)}</ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <MobileDatePicker
                  label={translate("product.startDate")}
                  inputFormat="dd/MM/yyyy"
                  value={startDate}
                  onChange={handleChangeStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <MobileDatePicker
                  label={translate("product.endDate")}
                  inputFormat="dd/MM/yyyy"
                  value={endDate}
                  onChange={handleChangeEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                  label={translate("product.startTime")}
                  value={time}
                  onChange={handleChangeTime}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Button color="primary" variant="contained" onClick={handleGenerateEvents}>{translate("product.generateEvents")}</Button>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFTextField name="maxStudents" label={translate("product.maxStudents.value")} />
                <RHFTextField label={translate("product.time.value")} InputProps={{ endAdornment: <InputAdornment position="end">m</InputAdornment>, }} name="lengthInMinutes" />
                <Stack sx={{ mt: 3 }}>
                  {/* <RHFMultipleSelect name="resorts" label={translate("product.resorts")} freeSolo={true} grouped={true} list={ski_resorts} /> */}
                  <RHFSelect name="resort" label={translate("product.resort.value")} >
                    <option aria-label="None" value="" />
                    {ski_resorts_grouped.map((group) => {
                      return <optgroup label={group.name} key={group.id}>{
                        group.resorts.map((resort) => {
                          return <option value={resort.title} key={resort.id} >{resort.title}</option>
                        })
                      }
                      </optgroup>
                    })}
                  </RHFSelect>
                </Stack>
                {/* <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={TAGS_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />
                  )}
                /> */}
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>

              <Stack spacing={3} mb={2}>
                <RHFSwitch name="isMinors" label={translate("product.isMinors")} />
                <RHFTextField
                  name="ageFrom"
                  label={translate("product.ageFrom.value")}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFTextField
                  name="ageTo"
                  label={translate("product.ageTo.value")}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
                <RHFSelect name="studentLevel" label={translate("product.studentLevel.value")}>
                  {student_level.map((studentLevel) => {
                    return <option value={studentLevel.value} key={studentLevel.id} >{studentLevel.title}</option>
                  })
                  }


                </RHFSelect>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label={translate("product.price.value")}
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>

              <RHFSwitch name="saleLastSpots" label={translate("product.saleLastSpots")} />
              <RHFSwitch name="saleConsecutive" label={translate("product.saleConsecutive")} />

            </Card>

            <Card sx={{ p: 3 }}>
              <div
                ref={draggableRef}
                id="external-events"
                style={{
                  padding: "10px",
                  width: "80%",
                  height: "auto",
                  maxHeight: "-webkit-fill-available",
                }}
              >
                <Typography>Events</Typography>
                <div
                  className="fc-event"
                  title={values.name}
                  id={uuidv4()}
                  style={{
                    padding: "10px",
                    margin: '5px',
                    height: "auto",
                    maxHeight: "-webkit-fill-available",
                    background: '#3399ff',
                    borderRadius: '5px'
                  }}
                >

                  <Typography color='black'>{values.name + "‎"} </Typography>
                </div>


              </div>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? translate("product.create") : translate("product.save")}
            </LoadingButton>
            {isEdit ? < LoadingButton variant="contained" color="error" size="large" loading={isLoading} onClick={handleDeleteProduct}>
              {translate("product.delete")}
            </LoadingButton> : <></>}
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

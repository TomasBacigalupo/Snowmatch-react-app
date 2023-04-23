import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton, MobileDatePicker, TimePicker } from '@mui/lab';
import { Card, Grid, Stack, TextField, Typography, Box, ToggleButton, ToggleButtonGroup, Button, InputAdornment } from '@mui/material';
import { CalendarStyle, CalendarToolbar } from '../calendar';
// components
import {
    FormProvider,
    RHFSelect,
    RHFTextField,
} from '../../../components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import useLocales from 'src/hooks/useLocales';
import { ski_resorts_grouped } from 'src/_mock/ski_resorts_simple';
import Iconify from 'src/components/Iconify';
import uuidv4 from 'src/utils/uuidv4';
import { createProduct, deleteProduct, editProduct } from 'src/redux/slices/product';
import useAuth from 'src/hooks/useAuth';
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

const getDefaultEndDate = () => {
    let d = new Date
    d.setDate(new Date().getDate() + 1)
    return d
}

const getDefaultStartTime = () => {
    let t = new Date()
    t.setHours(10)
    t.setMinutes(0)
    t.setSeconds(0)
    return t
}

const getDefaultStartAfternoon = () => {
    let t = new Date()
    t.setHours(14)
    t.setMinutes(0)
    t.setSeconds(0)
    return t
}

const getDefaultStartMorning = () => {
    let t = new Date()
    t.setHours(10)
    t.setMinutes(0)
    t.setSeconds(0)
    return t
}

const getSeason = (date) => {
    let month = date.getMonth() + 1
    if (month >= 12 || month <= 6) {
        return "LOW"
    } else if (month >= 8) {
        return "MED"
    } else {
        return "HIGH"
    }
}

// ----------------------------------------------------------------------

PrivateNewEditForm.propTypes = {
    isEdit: PropTypes.bool,
    isHalfDay: PropTypes.bool,
    currentProduct: PropTypes.object,
};

export default function PrivateNewEditForm({ isEdit, currentProduct, isHalfDay }) {
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
        price: Yup.number().required('Price is required').moreThan(0, translate("product.price.moreThan")),
        resort: Yup.string().required(translate("product.resort.required"))
    });

    const defaultValues = useMemo(
        () => ({
            // tags: currentProduct?.tags || [TAGS_OPTION[0]],
            saleLastSpots: currentProduct?.saleLastSpots || false,
            resort: currentProduct?.resort || '',
            price: currentProduct?.price || 0,
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
        handleSubmit,
        setValue,
        getValues,
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

    useEffect(() => {
        setEvents(events.map((event) => ({ ...event, title: "Private" })))
    }, [values.name]);

    useEffect(() => {
        console.log("currentProduct", currentProduct)
    }, [currentProduct]);


    useEffect(() => {
        let tmpEvents = events
        tmpEvents = tmpEvents.map((event) => {
            let d = new Date(event.start)
            d.setTime(d.getTime() + values.lengthInMinutes * 60 * 1000)
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
        let _product = data
        _product.events = events
        _product.events.map((event) => (
            {
                ...event,
                title: isHalfDay ? "Private Half Day" : "Private Full Day",
                color: isHalfDay ? "#FFC83D" : "#FFC83A",
                type: "Product class",
                price: data.price
            }
        )
        )

        if (isHalfDay) {
            _product.name = "PRIVATE_HALF_DAY"
        } else {
            _product.name = "PRIVATE_FULL_DAY"
        }

        if (!isEdit) {
            if (user?.user?.role === 'SCHOOL_ADMIN') {
                dispatch(createProduct(_product, false))
            } else {
                dispatch(createProduct(_product, true))
            }
        } else {
            if (user?.user?.role === 'SCHOOL_ADMIN') {
                dispatch(editProduct(_product, false, currentProduct.id))
            } else {
                dispatch(editProduct(_product, true, currentProduct.id))
            }
        }
        if (success !== "") {
            enqueueSnackbar("Saved", { variant: 'success' })
        } else {
            enqueueSnackbar("Error trying to save", { variant: 'error' })
        }
    };

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
        newEvent.title = isHalfDay ? "Private Half Day" : "Private Full Day"
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
                e.title = "Private Half"
                e.start = new Date(start)
                e.start.setHours(getDefaultStartMorning().getHours())
                e.start.setSeconds(getDefaultStartMorning().getSeconds())
                e.start.setMinutes(getDefaultStartMorning().getMinutes())
                e.end = new Date(e.start)
                e.end.setTime(e.end.getTime() + 60 * 1000 * (180 - 60))
                e.textColor = '#3399ff'
                let et = {}
                et.id = uuidv4()
                et.title = "Private Half"
                et.start = new Date(start)
                et.start.setHours(getDefaultStartAfternoon().getHours())
                et.start.setSeconds(getDefaultStartAfternoon().getSeconds())
                et.start.setMinutes(getDefaultStartAfternoon().getMinutes())
                et.end = new Date(et.start)
                et.end.setTime(et.end.getTime() + 60 * 1000 * (180 - 60))
                et.textColor = '#3399ff'
                let ed = {}
                ed.id = uuidv4()
                ed.title = "Private Full"
                ed.start = new Date(start)
                ed.start.setHours(time.getHours())
                ed.start.setSeconds(time.getSeconds())
                ed.start.setMinutes(time.getMinutes())
                ed.end = new Date(e.start)
                ed.end.setTime(ed.end.getTime() + 60 * 1000 * (480 - 60))
                ed.textColor = '#3399ff'
                if (isHalfDay) {
                    tempEventList.push(e)
                    tempEventList.push(et)
                } else {
                    tempEventList.push(ed)
                }
            }
        }
        setEvents([...events, ...tempEventList])
        enqueueSnackbar("Events generated success!", { variant: 'success' })

    }

    const handleDeleteEvents = () => {
        if (events.length != 0) {
            enqueueSnackbar("Delete success!", { variant: 'success' })
        }
        setEvents([])
    }

    const handleDeleteProduct = () => {
        if (user?.user?.role === 'SCHOOL_ADMIN') {
            dispatch(deleteProduct(false, currentProduct.id))
        } else {
            dispatch(deleteProduct(true, currentProduct.id))
        }
        if (success !== "") {
            enqueueSnackbar("Product deleted Successfully", { variant: 'success' })
        } else {
            enqueueSnackbar("Product deleted Failed", { variant: 'error' })
        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Stack spacing={3}>
                        <Stack spacing={3} xs={12} md={4} mb={2}>
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
                        <Stack xs={12} md={4}>
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
                        <Stack xs={12} md={4}>
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
                                        title={'Private'}
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

                                        <Typography color='black'>{"Private ‎"} </Typography>
                                    </div>
                                </div>
                            </Card>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} >
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
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
                    <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                        {!isEdit ? translate("product.create") : translate("product.save")}
                    </LoadingButton>
                    {isEdit ? < LoadingButton variant="contained" color="error" size="large" loading={isLoading} onClick={handleDeleteProduct}>
                        {translate("product.delete")}
                    </LoadingButton> : <></>}
                </Grid>
            </Grid>
        </FormProvider>
    );
}

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
import { CalendarStyle, CalendarToolbar } from '../calendar';
import { Check, ShoppingCart } from '@mui/icons-material';

// components
import {
    FormProvider,
} from '../../../components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import useLocales from 'src/hooks/useLocales';
import { getProductEvents, getProductEventsByMonthAndYear } from 'src/redux/slices/product';
import useAuth from 'src/hooks/useAuth';
import { addCart, deleteCart } from 'src/redux/slices/teachers';
import { PATH_GUEST } from 'src/routes/paths';
import { fCurrency } from 'src/utils/formatNumber';
import { da, fi } from 'date-fns/locale';
// ----------------------------------------------------------------------


ProductSelectForm.propTypes = {
    currentProduct: PropTypes.object,
    currentTeacher: PropTypes.object
}; 

export default function ProductSelectForm({ currentProduct, currentTeacher }) {

    const {
        description,
    } = currentProduct

    const { events } = useSelector(state => state.teachers.checkout)
    const { filters } = useSelector(state => state.teachers)
    const { success, error, isLoading } = useSelector(state => state.product)

    const calendarRef = useRef(null);
    const { user } = useAuth();
    const dispatch = useDispatch()
    const [date, setDate] = useState(filters.from ?? new Date());
    const [month, setMonth] = useState(filters.from?.getMonth() ?? new Date().getMonth())
    const { enqueueSnackbar } = useSnackbar();
    const [view, setView] = useState('listWeek');
    const { translate } = useLocales()
    const [availableEvents, setEvents] = useState([...currentProduct.events] || []);
    const trashRef = createRef()

    useEffect(() => {
        setDate(filters.from)
    }, [filters.from])

    useEffect( () => {
        dispatch(getProductEventsByMonthAndYear(currentProduct.id, date?.getMonth(), date?.getYear()))
    },[currentProduct, month])
    
    useEffect(()=>{
        if(date.getMonth() != month)
            setMonth(date.getMonth())
    },[date])


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
        if (currentProduct != undefined)
            setEvents([...currentProduct?.events])
        else setEvents([])

    }, [currentProduct]);

    useEffect(() => {
        setEvents(availableEvents.map((event) => ({ ...event, title: values.name })))
    }, [values.name, currentProduct.events]);

    useEffect(() => {
        console.log("currentProduct", currentProduct)
    }, [currentProduct]);


    useEffect(() => {
        let tmpEvents = availableEvents
        tmpEvents = tmpEvents.map((event) => {
            let d = new Date(event.start)
            d.setTime(d.getTime() + values.lengthInMinutes * 60 * 1000)
            return { ...event, end: d }
        })
        setEvents([...tmpEvents])
    }, [values.lengthInMinutes]);

    const onSubmit = async (data) => {
        let product = data
        product.events = availableEvents
        product.events.map((event) => {
            event.start = event.start
            event.type = "Product class"
            event.price = data.price
            event.description = "Event created for " + data.name + " product"

        })
        if (success !== "") {
            enqueueSnackbar(success)
        } else {
            enqueueSnackbar(error)
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


    const handleSelectEvent = (arg) => {
        const id = arg.event.id
        //dispatch(selectEvent(id));
    };

    const handleDropStop = async (info) => {
        let trashCoords = trashRef.current.getBoundingClientRect()
        if (info.jsEvent.clientX > trashCoords.left && info.jsEvent.clientX < trashCoords.right && info.jsEvent.clientY < trashCoords.bottom && info.jsEvent.clientY > trashCoords.top
        ) {
            let tmpEvents = availableEvents
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

    const handleDropEvent = async (eventInfo) => {
        try {
            let tmpEvents = availableEvents
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

    const renderEventContent = (event) => {
        const currentEventId = Number(event.event.id);
        const isAvailable = !events.some((e) => e?.id === currentEventId);
        const icons = {
            bought: <Check style={{ fontSize: 18, marginRight: 1 }} />,
            toBuy: <ShoppingCart style={{ fontSize: 18, marginRight: 1 }} />
        };
        const eventIcon = icons[isAvailable ? 'toBuy' : 'bought']
        const eventText = isAvailable ? translate('product.selection.add_to_cart') : translate('product.selection.booked')

        const onAddCart = () => {
            const requestEvent = {
                id: currentEventId,
                start: event.event.start,
                end: event.event.end,
                price: currentProduct.price,
                teacher: currentTeacher
            };
            dispatch(addCart({
                event: requestEvent
            }))
        }

        const onDeleteFromCart = () => {
            dispatch(deleteCart(currentEventId))
        }

        return (
            <Button
                fullWidth
                onClick={() => {
                    if (isAvailable) {
                        onAddCart()
                        enqueueSnackbar(translate('product.selection.lesson_booked'), success)
                    } else {
                        onDeleteFromCart()
                        enqueueSnackbar(translate('product.selection.lesson_unbooked'), success)
                    }
                }}
                variant={isAvailable ? 'contained' : 'text'}
                color={isAvailable ? 'warning' : 'success'}
                startIcon={eventIcon}
            >
                {eventText}
            </Button>
        );
    };


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h3" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            {`${fCurrency(currentProduct.price)}`}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            {description}
                        </Typography>
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
                                    selectable
                                    events={availableEvents.map((event) => ({
                                        ...event,
                                        start: event.start,
                                        end: event.end,
                                        textColor: '#ffffff'
                                    }))}
                                    ref={calendarRef}
                                    rerenderDelay={10}
                                    initialDate={date}
                                    initialView={view}
                                    dayMaxEventRows={3}
                                    eventDisplay="block"
                                    eventContent={renderEventContent}
                                    headerToolbar={false}
                                    allDayMaintainDuration
                                    eventDrop={handleDropEvent}
                                    eventClick={handleSelectEvent}
                                    eventDragStop={handleDropStop}
                                    height={'auto'}
                                    plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                                />
                            </CalendarStyle>
                        </Stack>
                    </Card>

                </Grid>

                <Grid item xs={12} md={4} container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Button
                            fullWidth
                            variant='contained'
                            component={RouterLink}
                            to={PATH_GUEST.checkout(currentTeacher.id)}
                        > {translate('product.selection.buy_now')} </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            fullWidth
                            variant='contained'
                            color='warning'
                            component={RouterLink}
                            to={PATH_GUEST.viewTeacher(currentTeacher.id)}
                        > {translate('product.selection.more')} </Button>
                    </Grid>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
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
import { Card, Grid, Stack, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CalendarStyle, CalendarToolbar } from '../calendar';
import { Check, Cancel, ShoppingCart } from '@mui/icons-material';

// components
import {
    FormProvider,
} from '../../../components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useLocales from 'src/hooks/useLocales';
import product, { createProduct, editProduct, getProduct, getProductEvents } from 'src/redux/slices/product';
import useAuth from 'src/hooks/useAuth';
import { addCart } from 'src/redux/slices/teachers';
// ----------------------------------------------------------------------


ProductSelectForm.propTypes = {
    currentProduct: PropTypes.object,
};

export default function ProductSelectForm({ currentProduct }) {
    const {
        description,
    } = currentProduct
    const calendarRef = useRef(null);
    const { user } = useAuth();
    const dispatch = useDispatch()
    const [date, setDate] = useState(new Date());
    const { enqueueSnackbar } = useSnackbar();
    const [view, setView] = useState('listWeek');
    const { translate } = useLocales()
    const [events, setEvents] = useState([...currentProduct.events] || []);
    const trashRef = createRef()
    const { success, error, isLoading } = useSelector(state => state.product)
    // State to keep track of whether the "How To" dialog is open or closed
    const [isHowToDialogOpen, setHowToDialogOpen] = useState(true);
    const [selectedEvents, setSelectedEvents] = useState([]);

    // Event handler for closing the "How To" dialog
    const handleCloseHowToDialog = () => {
        setHowToDialogOpen(false);
    };
    
    useEffect(() => {
        dispatch(getProductEvents(currentProduct.id))
    }, [currentProduct])


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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProduct]);

    useEffect(() => {
        if (currentProduct != undefined)
            setEvents([...currentProduct?.events])
        else setEvents([])

    }, [currentProduct]);

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
            return { ...event, end: d }
        })
        setEvents([...tmpEvents])
    }, [values.lengthInMinutes]);

    const onSubmit = async (data) => {
        let product = data
        product.events = events
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

    const renderEventContent = (event) => {
        const isAvailable = !selectedEvents.some((e) => e?.id === Number(event.event.id));
        const icons = {
            bought: <Check style={{ fontSize: 18, marginRight: 1 }} />,
            toBuy: <ShoppingCart style={{ fontSize: 18, marginRight: 1 }} />
        };
        const eventIcon = icons[isAvailable ? 'toBuy' : 'bought']
        const eventText = isAvailable ? "Add to cart" : "Booked"

        const onAddCart = () => {
            setSelectedEvents(selectedEvents => [...selectedEvents, events.find(e => e.id === Number(event.event.id))])
            const requestEvent = {
                price: currentProduct.price,
                people: values.amount,
                lessonTime: "MORNING",
                date: new Date(event.start),
                resort: currentProduct.resort
            };
            dispatch(addCart({
                event: requestEvent
            }))
        }

        return (
            <Button
                fullWidth
                onClick={() => {
                    if (isAvailable) {
                        onAddCart()
                        enqueueSnackbar("Lesson Booked", success)
                    } else {
                        setSelectedEvents(events => events.filter(e => e.id !== Number(event.event.id)))
                        enqueueSnackbar("Event out of cart", success)
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
                                    droppable
                                    selectable
                                    events={events.map((event, idx) => ({ ...event, textColor: '#ffffff' }))}
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

                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <Button variant='contained'> Continue </Button>
                    </Stack>
                </Grid>
            </Grid>
            {/* "How To" Dialog */}
            <Dialog open={isHowToDialogOpen} onClose={handleCloseHowToDialog}>
                <DialogTitle>How to Select Dates</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        1. Click on a date to select it.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        2. Drag and drop to create an event on the selected date.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        3. Click on an event to view details or edit it.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHowToDialog} color="primary">
                        Got It
                    </Button>
                </DialogActions>
            </Dialog>
        </FormProvider>
    );
}
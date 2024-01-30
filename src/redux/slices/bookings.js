import { createSlice } from '@reduxjs/toolkit';
import { utcDateToLocalDate, utcToLocalDate } from 'src/utils/dateUtils';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { start } from 'nprogress';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: null,
    bookings: [],
    booking: null,
    isOpenModal: false,
    selectedBookingId: null,
    pendingBookings: [],
    upcomingBookings: [],
    message: null,
    adults: 1,
    children: 0,
};

const slice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // GET BOOKINGS
        getBookingsSuccess(state, action) {
            state.isLoading = false;
            state.bookings = action.payload;
        },

        // GET UPCOMING BOOKINGS
        getUpcomingBookingsSuccess(state, action) {
            state.isLoading = false;
            state.upcomingBookings = action.payload;
        },

        // GET BOOKING
        getBookingSuccess(state, action) {
            state.isLoading = false;
            state.booking = action.payload;
        },

        


        // CREATE EVENT
        createEventSuccess(state, action) {
            const newEvent = action.payload;
            state.isLoading = false;
            console.log(newEvent)
            console.log(state.events)
            state.events = [...state.events, {
                ...newEvent,
                start: newEvent.start.toDate(),
                end: newEvent.end.toDate()
            }];
        },

        // UPDATE EVENT
        updateEventSuccess(state, action) {
            debugger
            const event = action.payload;
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === event.id) {
                    return {
                        ...event,
                        start: event.start.toDate(),
                        end: event.end.toDate()
                    };
                }
                return _event;
            });
            state.isLoading = false;
            state.events = updateEvents;
        },

        // PAYED LESSON
        payLessonSuccess(state, action) {
            const { eventId } = action.payload
            state.isLoadingPayment = false;
            state.lesson = { ...state.lesson, payed: true }
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        payed: true
                    };
                }
                return _event;
            });
            state.isLoading = false;
            state.events = updateEvents;
        },

        // UNPAID LESSON
        unpaidLessonSuccess(state, action) {
            const eventId = action.payload
            state.isLoadingPayment = false;
            state.lesson = { ...state.lesson, payed: true };
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        payed: true
                    };
                }
                return _event;
            });
            state.isLoading = false;
            state.events = updateEvents;
        },

        //DECLINED LESSON SUCCESS
        declinedLessonSuccess(state, action) {
            const eventId = action.payload
            state.isLoadingPayment = false;
            state.lesson = { ...state.lesson, state: 'DECLINED' };
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        state: 'DECLINED'
                    };
                }
                return _event;
            });
            state.isLoading = false;
            state.events = updateEvents;
        },

        //ACCEPTED LESSON SUCCESS
        acceptedLessonSuccess(state, action) {
            const eventId = action.payload
            state.isLoadingPayment = false;
            state.lesson = { ...state.lesson, state: 'ACCEPTED' };
            const updateEvents = state.events.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        state: 'ACCEPTED'
                    };
                }
                return _event;
            });
            const updatedLessons = state.lessons.map((_event, i) => {
                if (_event.id === eventId) {
                    return {
                        ..._event,
                        state: 'ACCEPTED'
                    };
                }
                return _event;
            });
            state.lessons = updatedLessons;
            state.isLoading = false;
            state.events = updateEvents;
        },

        // SELECT EVENT
        selectEvent(state, action) {
            const eventId = action.payload;
            state.selectedEventId = eventId;
            state.isOpenModal = true;
            state.selectedEventId = eventId;
        },

        // CHANGE MESSAGE
        changeMessage(state, action) {
            const message = action.payload;
            state.message = message;
        },

        changeAdults(state, action) {
            const adults = action.payload;
            state.adults = adults;
        },

        changeChildren(state, action) {
            const children = action.payload;
            state.children = children;
        }
    },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, changeMessage } = slice.actions;

// ----------------------------------------------------------------------

export function getBookings() {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/bookings');
            const bookings = response.data
            dispatch(slice.actions.getBookingsSuccess(bookings));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}




// ----------------------------------------------------------------------

export function getLessonById(id) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const responseEvent = await axios.get(`/api/events/lessons/byId/${id}`);
            dispatch(slice.actions.getLessonSuccess(responseEvent.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent) {
    return async () => {
        try {
            const start = addUtcOffset(newEvent.start); // Adjust start time with UTC offset
            const end = addUtcOffset(newEvent.end); // Adjust end time with UTC offset

            const response = await axios.post('/api/events/create', {
                ...newEvent,
                start,
                end,
            });
            dispatch(slice.actions.createEventSuccess(newEvent));
            return response;
        } catch (error) {
            return error;
        }
    };
}

function addUtcOffset(dateString) {
    const date = new Date(dateString);
    const utcOffset = date.getTimezoneOffset() * 60000; // Get the UTC offset in milliseconds
    const adjustedDate = new Date(date.getTime() - utcOffset);
    return adjustedDate.toISOString(); // Convert back to the ISO 8601 format for consistency
}


// ----------------------------------------------------------------------

export function updateEvent(eventId, updateEvent) {
    return async () => {
        const start = addUtcOffset(updateEvent.start); // Adjust start time with UTC offset
        const end = addUtcOffset(updateEvent.end); // Adjust end time with UTC offset
        //dispatch(slice.actions.startLoading());
        try {
            const response = await axios.put(`/api/events/byId/${eventId}`, {
                ...updateEvent,
                start,
                end
            });
            dispatch(slice.actions.updateEventSuccess({ ...updateEvent, id: eventId, start, end }));
            return response;
        } catch (error) {
            //dispatch(slice.actions.hasError(error));
            return error;
        }
    };
}

export function updateEventByUserIdAndEventId(userId, eventId, updatedEvent) {
    const start = addUtcOffset(updatedEvent.start); // Adjust start time with UTC offset
    const end = addUtcOffset(updatedEvent.end); // Adjust end time with UTC offset
    return async () => {
        //dispatch(slice.actions.startLoading());
        try {
            const response = await axios.put(`/api/admin/user/${userId}/event/${eventId}`, { ...updatedEvent, start, end });
            dispatch(slice.actions.updateEventSuccess({ ...updatedEvent, id: eventId }));
            return response;
        } catch (error) {
            //dispatch(slice.actions.hasError(error));
            return error;
        }
    };
}




export function getUpcomingEvents() {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/events/');

            const events = response.data.map(e => {
                return {
                    ...e,
                    start: utcToLocalDate(e.start),
                    end: utcToLocalDate(e.end)
                };
            });

            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            const totomorrow = new Date(today)
            totomorrow.setDate(totomorrow.getDate() + 2)


            const a1 = events.filter(e => e.start.toDateString() === today.toDateString() || (e.start <= today && today <= e.end) || e.end.toDateString() === today.toDateString());
            const a2 = events.filter(e => e.start.toDateString() === tomorrow.toDateString() || (e.start <= tomorrow && tomorrow <= e.end) || e.end.toDateString() === tomorrow.toDateString());
            const a3 = events.filter(e => e.start.toDateString() === totomorrow.toDateString() || (e.start <= totomorrow && totomorrow <= e.end) || e.end.toDateString() === totomorrow.toDateString());


            dispatch(slice.actions.getUpcomingEventsSuccess([a1, a2, a3]));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function setUnpaid(eventId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.put(`/api/events/byId/${eventId}/unpaid`);
            dispatch(slice.actions.unpaidLessonSuccess({ eventId }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function setPaid(eventId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.put(`/api/events/byId/${eventId}/pay`);
            dispatch(slice.actions.paidLessonSuccess({ eventId }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setAccepted(eventId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.put(`/api/events/lessons/${eventId}/accept`);
            dispatch(slice.actions.acceptedLessonSuccess({ eventId }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function createBooking(teacherId, message, children, adults, events, totalPrice) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.post(`/api/bookings`, {
                teacherId: teacherId,
                userComment: message,
                events: events.map(e => {
                    if(e.lessonTime === 'AFTERNOON'){

                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                            lessonTime: 'AFTERNOON'
                        }
                    }
                    if(e.lessonTime === 'MORNING'){
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(13, 0, 0, 0)),
                            lessonTime: 'MORNING'
                        }
                    }
                    return {
                        ...e,
                        start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                        end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                    }
                }),
                children: children,
                adults: adults,
                totalPrice: totalPrice,
                payedReservation: totalPrice * 0.2,
            });
            dispatch(slice.actions.createBookingSuccess());
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function bookingAndPay(teacherId, message, children, adults, events, totalPrice, formData) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.post(`/api/bookings/bookAndPay?amount=${formData.transaction_amount}&token=${formData.token}&holderEmail=${formData.payer.email}&holderIdType=${formData.payer.identification.type}&holderId=${formData.payer.identification.number}&paymentMethodId=${formData.payment_method_id}`, {
                teacherId: teacherId,
                userComment: message,
                events: events.map(e => {
                    if(e.lessonTime === 'AFTERNOON'){
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(14, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                            lessonTime: 'AFTERNOON'
                        }
                    }
                    if(e.lessonTime === 'MORNING'){
                        return {
                            ...e,
                            start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                            end: utcToLocalDate(new Date(e.date).setHours(13, 0, 0, 0)),
                            lessonTime: 'MORNING'
                        }
                    }
                    return {
                        ...e,
                        start: utcToLocalDate(new Date(e.date).setHours(10, 0, 0, 0)),
                        end: utcToLocalDate(new Date(e.date).setHours(17, 0, 0, 0)),
                    }
                }),
                children: children,
                adults: adults,
                totalPrice: totalPrice,
                payedReservation: totalPrice * 0.2,
            });
            dispatch(slice.actions.createBookingSuccess());
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function acceptAndPay(bookingId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.post(`/api/bookings/bookAndPay/accept/${bookingId}`);
            dispatch(slice.actions.acceptBookingSuccess());
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setDeclined(eventId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.put(`/api/events/lessons/${eventId}/decline`);
            dispatch(slice.actions.declinedLessonSuccess({ eventId }));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getEventsByUserId(id) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/admin/user/${id}/event?page=1&size=300`);

            const events = response.data.map(e => {
                const dateStart = new Date(e.start);
                const dateEnd = new Date(e.end);
                const utcOffset = dateStart.getTimezoneOffset() * 60000; // Get the UTC offset in milliseconds
                const adjustedDateStart = new Date(dateStart.getTime() + utcOffset);
                const adjustedDateEnd = new Date(dateEnd.getTime() + utcOffset);
                if (e?.source === 'APP' && e.eventType === "CLASS") {
                    debugger
                    return {
                        ...e,
                        title: e.title ?? 'Match',
                        name: 'Clase Solicitada',
                        description: e.description ?? 'Un usuario ah solicitado una clase este dia',
                        start: adjustedDateStart,
                        end: adjustedDateEnd,
                        textColor: e.textColor ?? "#FFC107",
                        type: "App class",
                        price: Number(e.price)
                    };
                }
                if (e?.source === 'PRODUCT' && e.eventType === "CLASS") {
                    let title = e.title
                    if (e.title === 'PRIVATE_FULL_DAY') {
                        title = 'Clase privada día completo'
                    }
                    if (e.title === 'PRIVATE_HALF_DAY') {
                        title = 'Clase privada medio día'
                    }

                    return {
                        ...e,
                        title: title,
                        description: 'Evento creado a partir de un producto',
                        start: adjustedDateStart,
                        end: adjustedDateEnd,
                        textColor: "#00AB55",
                        type: "App class"
                    };
                }
                return {
                    ...e,
                    start: adjustedDateStart,
                    end: adjustedDateEnd
                };
            })
            dispatch(slice.actions.getEventsSuccess(events));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

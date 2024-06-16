import { createSlice } from '@reduxjs/toolkit';
import { utcDateToLocalDate, utcToLocalDate } from 'src/utils/dateUtils';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { start } from 'nprogress';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
  upcomingEvents: [],
  lessons: [],
  lesson: {}
};

const slice = createSlice({
  name: 'calendar',
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

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload.map(e => {
        if (e?.source === 'APP') {
          return {
            ...e,
            // title: `${e.name} ${e.lastname}`,
            start: utcToLocalDate(e.start),
            end: utcToLocalDate(e.end)
          };
        }
        return {
          ...e,
          start: utcToLocalDate(e.start),
          end: utcToLocalDate(e.end)
        };
      });
    },

    // GET LESSONS
    getLessonsSuccess(state, action) {
      state.isLoading = false;
      state.lessons = action.payload.map(e => {
        return {
          ...e,
          start: utcToLocalDate(e.start),
          end: utcToLocalDate(e.end)
        };
      });
    },

    // GET LESSON
    getLessonSuccess(state, action) {
      state.isLoading = false;
      state.lesson = {
        ...action.payload,
        start: utcToLocalDate(action.payload.start),
        end: utcToLocalDate(action.payload.end)
      }
    },

    // GET UPCOMING EVENTS
    getUpcomingEventsSuccess(state, action) {
      state.isLoading = false;
      state.upcomingEvents = action.payload;
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
      const event = action.payload;
      const updateEvents = state.events.map((_event, i) => {
        if (_event.id === event.id) {
          return event
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

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = state.events.filter((event) => {
        return event.id !== eventId
      });
      state.events = deleteEvent;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.selectedEventId = eventId;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent } = slice.actions;

// ----------------------------------------------------------------------

export function getEvents() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/events/');
      const events = response.data.map(e => {
        const dateStart = new Date(e.start);
        const dateEnd = new Date(e.end);
        const utcOffset = dateStart.getTimezoneOffset() * 60000; // Get the UTC offset in milliseconds
        const adjustedDateStart = new Date(dateStart.getTime() + utcOffset);
        const adjustedDateEnd = new Date(dateEnd.getTime() + utcOffset);
        if (e?.source === 'APP' && e.eventType === "CLASS") {
          return {
            ...e,
            title: e.title ?? 'Match',
            name: 'Clase Solicitada',
            description: e.description ?? 'Un usuario ah solicitado una clase este dia',
            price: e.price ?? 0,
            start: adjustedDateStart,
            end: adjustedDateEnd,
            textColor: e.textColor ?? "#FFC107",
            type: "App class"
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

// ----------------------------------------------------------------------

export function getEventsByDate(date) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/events/?month=${date.getMonth() + 1}`);
      const events = response.data.map(e => {
        const dateStart = new Date(e.start);
        const dateEnd = new Date(e.end);
        const utcOffset = dateStart.getTimezoneOffset() * 60000; // Get the UTC offset in milliseconds
        const adjustedDateStart = new Date(dateStart.getTime() + utcOffset);
        const adjustedDateEnd = new Date(dateEnd.getTime() + utcOffset);
        if (e?.source === 'APP' && e.eventType === "CLASS") {
          return {
            ...e,
            title: e.title ?? 'Match',
            name: 'Clase Solicitada',
            description: e.description ?? 'Un usuario ah solicitado una clase este dia',
            price: e.price ?? 0,
            start: adjustedDateStart,
            end: adjustedDateEnd,
            textColor: e.textColor ?? "#FFC107",
            type: "App class"
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

// ----------------------------------------------------------------------

export function getLessons() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/events/lessons');
      dispatch(slice.actions.getLessonsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getBookings() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/events/lessons');
      dispatch(slice.actions.getLessonsSuccess(response.data));
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

export function createBusinessEvent(newEvent) {
  return async () => {
    //dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.startLoading());
      const response = await axios.post('/api/events/business', newEvent);
      // dispatch(slice.actions.createEventSuccess(response.data));
      dispatch(slice.actions.createEventSuccess({ id: response.data.id, 
        start:  dayjs(response.data.from),
        end:  dayjs(response.data.to),
        title: response.data.title, textColor: response.data.textColor }));
      return response;
    } catch (error) {
      //dispatch(slice.actions.hasError(error));
      return error;
    }
  };
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

export function createEventByUserId(userId, event) {

  return async () => {
    //dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/admin/user/${userId}/event`, event);
      dispatch(slice.actions.createEventSuccess(event));
      return response;
    } catch (error) {
      //dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateBusinessEvent(eventId, updateEvent) {
  return async () => {
    //dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/events/business`, updateEvent);
      dispatch(slice.actions.updateEventSuccess({ ...updateEvent, id: eventId }));
      return response;
    } catch (error) {
      //dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/events/byId/${eventId}`);
      dispatch(slice.actions.deleteEventSuccess({ eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEventByUserId(userId, eventId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/admin/user/${userId}/event/${eventId}`);
      dispatch(slice.actions.deleteEventSuccess({ eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteSchoolEvent(eventId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/events/school/${eventId}`);
      dispatch(slice.actions.deleteEventSuccess({ eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
  return async () => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime(),
      })
    );
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

export function blockDays(from, to, lessonTime, note) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const createdEvent = await axios.post(`/api/events/block`, {
        from: lessonTime === "AFTERNOON" ? dayjs(from).set('hour', 14): dayjs(from).set('hour', 9),
        to: lessonTime === "MORNING" ? dayjs(to).set('hour', 13): dayjs(to).set('hour', 17),
        lessonTime,
        note
      });
      dispatch(slice.actions.createEventSuccess({
        start: lessonTime === "AFTERNOON" ? dayjs(from).set('hour', 14): dayjs(from).set('hour', 9),
        end: lessonTime === "MORNING" ? dayjs(to).set('hour', 13): dayjs(to).set('hour', 17),
        title: createdEvent.data.title,
        description: "Bloqueado por el instructor",
        clients: [],
        assignedUsers: [],
        students: [],
        textColor: createdEvent.data.textColor,
        id: createdEvent.data.id
      }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function assignDays(from, to, lessonTime, note, selectedClients) {
  return async () => {
    dispatch(slice.actions.startLoading());
    console.log({ selectedClients })
    try {
      const createdEvent = await axios.post(`/api/events/assign`, {
        from,
        to,
        lessonTime,
        clientId: selectedClients[0].id
      });
      console.log({ createdEvent })
      dispatch(slice.actions.createEventSuccess({ id: createdEvent.data.id, 
        start: lessonTime === "AFTERNOON" ? dayjs(from).set('hour', 14): dayjs(from).set('hour', 9),
        end: lessonTime === "MORNING" ? dayjs(to).set('hour', 13): dayjs(to).set('hour', 17),
        title: createdEvent.data.title, textColor: createdEvent.data.textColor }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

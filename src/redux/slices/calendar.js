import { createSlice } from '@reduxjs/toolkit';
import { utcToLocalDate } from 'src/utils/dateUtils';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
  upcomingEvents: []
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
      state.events = action.payload.map( e => {
        return {
          ...e,
          start: utcToLocalDate(e.start),
          end: utcToLocalDate(e.end)
        };
      });
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
      state.events = [...state.events, {
        ...newEvent,
        start: utcToLocalDate(newEvent.start),
        end: utcToLocalDate(newEvent.end)

      }];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const event = action.payload;
      const updateEvents = state.events.map((_event, i) => {
        if (_event.id === event.id) {
          return event;
        }
        return _event;
      });
      state.isLoading = false;
      state.events = updateEvents;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = state.events.filter((event) => event.id !== eventId);
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
      dispatch(slice.actions.getEventsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent) {
  return async () => {
    //dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/events/create', newEvent);
      dispatch(slice.actions.createEventSuccess(response.data));
      return response;
    } catch (error) {
      //dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function createSchoolEvent(newEvent) {
  return async () => {
    //dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/events/create/school', newEvent);
      dispatch(slice.actions.createEventSuccess(response.data));
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
    //dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/events/byId/${eventId}`, updateEvent);
      dispatch(slice.actions.updateEventSuccess({...updateEvent, id: eventId}));
      return response;
    } catch (error) {
      //dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateSchoolEvent(eventId, updateEvent) {
  return async () => {
    //dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/events/school`, updateEvent);
      dispatch(slice.actions.updateEventSuccess({...updateEvent, id: eventId}));
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
      await axios.delete(`/api/events/byId/${ eventId }`);
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
      await axios.delete(`/api/events/school/${ eventId }`);
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

      const events = response.data.map( e => {
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


      const a1 = events.filter(e => e.start.toDateString() === today.toDateString() || (e.start<=today && today<=e.end) || e.end.toDateString() === today.toDateString());
      const a2 = events.filter(e => e.start.toDateString() === tomorrow.toDateString() || (e.start<=tomorrow && tomorrow<=e.end) || e.end.toDateString() === tomorrow.toDateString());
      const a3 = events.filter(e => e.start.toDateString() === totomorrow.toDateString() || (e.start<=totomorrow && totomorrow<=e.end) || e.end.toDateString() === totomorrow.toDateString());


      dispatch(slice.actions.getUpcomingEventsSuccess([a1,a2,a3]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
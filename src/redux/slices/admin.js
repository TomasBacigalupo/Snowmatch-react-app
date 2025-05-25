import { gridColumnLookupSelector } from '@mui/x-data-grid';
import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  teachers: [],
  bookings: [],
  teacher: null,
  isOpenModal: false,
  isOpenEditBookingModal: false,
  booking: null,
  selectedEmail: '',
  documents: [],
};

const slice = createSlice({
  name: 'admin',
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

    // GET TEACHERS
    getTeachersSuccess(state, action) {
      state.isLoading = false;
      state.teachers = action.payload;
    },

    getDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.documents = action.payload;
    },

    getTeacherSuccess(state, action) {
      state.isLoading = false;
      state.teacher = action.payload;
    },

    getBookingsSuccess(state, action) {
      state.isLoading = false;
      state.bookings = action.payload;
    },

    getBookingsSuccess(state, action) {
      console.log(action.payload)
      state.isLoading = false;
      state.bookings = action.payload;
    },

    openModal(state, email) {
      state.isOpenModal = true;
      state.selectedEmail = email.payload;
    },

    openEditBookingModal(state, action) {
      state.isOpenEditBookingModal = true;
      state.selectedBooking = action.payload;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEmail = null;
    },
  }
});

// Reducer
export default slice.reducer;

// Actions
// export const {
// } = slice.actions;
export const { openModal, closeModal, getSelectedEmail, openEditBookingModal } = slice.actions;

// ----------------------------------------------------------------------

export function getTeachers(page, role, name, level) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/admin/filter?page=${page}&role=${role}&level=${level}&name=${name}`);
      dispatch(slice.actions.getTeachersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTeachersAdmin(name, page, filters, resort) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/users/teachers/available?page=${page}&size=${20}&resort=${resort}&name=${name}`, filters);
      dispatch(slice.actions.getTeachersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getBookings(teacherId, studentId, month, page) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (teacherId) params.append('teacherId', teacherId);
      if (studentId) params.append('studentId', studentId);
      if (month) params.append('month', month);
      params.append('size', 100000);

      const response = await axios.get(`/api/admin/bookings/filter?${params.toString()}`);
      dispatch(slice.actions.getBookingsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTeacher(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/users/' + id);
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function declineTeacher(teacherData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/admin/decline/' + teacherData.email);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function confirmTeacher(teacherData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const teacher = {
        email: teacherData.email,
        cellphone: teacherData.cellphone,
        name: teacherData.name,
        lastname: teacherData.lastname,
        notes: teacherData.notes,
        level: teacherData.level,
        id: teacherData.id,
        dni: teacherData.dni
      }
      const response = await axios.post('/api/admin/approve/' + teacher.email + "?level=" + teacher.level + "&dni=" + teacher.dni + "&name=" + teacher.name + "&lastName=" + teacher.lastname);
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function editTeacher(teacherData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put('/api/admin/users/' + teacherData.userId, teacherData);
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateDocument(teacherId, documentName, state, callback) {
  return async () => { 
    try {
      const pathState = state === "VERIFIED" ? "verify" : "reject"
      const response = await axios.put(`api/admin/${teacherId}/documents/${documentName}/${pathState}`)
      callback(response.status === 200)
      // //updateCurrentTeacherDocument
    } catch(error){
      callback(false)
    }
  }
}

export function getTeacherDocuments(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/users/' + id + '/documents');
      dispatch(slice.actions.getDocumentsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getBooking(bookingId) {
  return async () => {
      dispatch(slice.actions.startLoading());
      try {
          const response = await axios.get(`/api/bookings/{bookingId}`);
          const bookings = response.data
          dispatch(slice.actions.getBookingSuccess(bookings));
      } catch (error) {
          dispatch(slice.actions.hasError(error));
      }
  };
}

export function createBlog(blogData) {
  console.log("pase", blogData)
  return async () => {
      //dispatch(slice.actions.startLoading());
      try {
        console.log("pase3")
          const response = await axios.post(`/api/blog/`,
              blogData
          );
          const blog = response.data
          console.log(blog);
          //dispatch(slice.actions.getBookingSuccess(bookings));
      } catch (error) {
        console.log(error)
          dispatch(slice.actions.hasError(error));
      }
  };
}
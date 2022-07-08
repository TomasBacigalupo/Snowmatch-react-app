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
  teacher: [],
  isOpenModal: false,
  selectedEmail: '',
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
    
    getTeacherSuccess(state, action) {
      state.isLoading = false;
      state.teacher = action.payload;
   },
    openModal(state, email) {
      state.isOpenModal = true;
      state.selectedEmail = email.payload;
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
export const { openModal, closeModal, getSelectedEmail } = slice.actions;

// ----------------------------------------------------------------------

export function getTeachers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/getTeachers/');
      dispatch(slice.actions.getTeachersSuccess(response.data));
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

export function confirmTeacher(teacherData){
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const teacher ={
        email:teacherData.email, 
        cellphone:teacherData.cellphone,
        name:teacherData.name,
        lastname:teacherData.lastname,
        notes:teacherData.notes,
        level:teacherData.level,
        id:teacherData.id,
        dni:teacherData.dni
      }
      console.log(teacherData);
      console.log("###############");
      console.log(teacher);
      console.log('/api/admin/approve/'+teacher.mail+"?level=" + teacher.level+"&dni="+ teacher.dni + "&name=" + teacher.name + "&lastName=" + teacher.lastname)
      const response = await axios.post('/api/admin/approve/'+teacher.email+"?level=" + teacher.level+"&dni="+ teacher.dni + "&name=" + teacher.name + "&lastName=" + teacher.lastname );
      console.log(response)
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
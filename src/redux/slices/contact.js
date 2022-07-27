import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  isOpenReferModal: false,
  isOpenContactModal: false,
  selectedTeacher:null,
};

const slice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      //state.isLoading = false;
      state.error = action.payload;
    },

    // SELECT EVENT
    selectTeacher(state, action) {
      const teacherId = action.payload;
      state.selectedTeacher = teacherId;
      state.isOpenModal = true;
    },


    // OPEN MODAL
    openContactModal(state) {
      state.isOpenContactModal = true;
    },

    // CLOSE MODAL
    closeContactModal(state) {
      state.isOpenContactModal = false;
      state.selectedTeacher = null;
    },
    openReferModal(state) {
      state.isOpenReferModal = true;
    },

    // CLOSE MODAL
    closeReferModal(state) {
      state.isOpenReferModal = false;
      state.selectedTeacher = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openContactModal, closeContactModal,openReferModal,closeReferModal, selectTeacher } = slice.actions;


// ----------------------------------------------------------------------

export function contactTeacher(teacherId, contactData) {
  return async () => {
    //dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/conversation/contact/${teacherId}`, contactData);
      return response;
    } catch (error) {
      //dispatch(slice.actions.hasError(error));
      if(error.messages){
        return error;
      }
      return "ERROR";
    }
  };
}

export function referClass(teacherId, contactData) {
  return async () => {
    //dispatch(slice.actions.startLoading());
    try {
      console.log(contactData)
      const response = await axios.post(`/api/conversation/refer/${teacherId}`, contactData);
      return response;
    } catch (error) {
      //dispatch(slice.actions.hasError(error));
      if(error.messages){
        return error;
      }
      return "ERROR";
    }
  };
}

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
  teachers: []
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
     }
  }
});

// Reducer
export default slice.reducer;

// Actions
// export const {
// } = slice.actions;

// ----------------------------------------------------------------------

export function getTeachers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:9090/gschool/api/admin/getTeachersUnderReview/');
      dispatch(slice.actions.getTeachersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  discounts: [],
};

const slice = createSlice({
  name: 'discounts',
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

    // GET CLIENTS
    getDiscountsSuccess(state, action) {
        state.isLoading = false;
        state.discounts = action.payload;
      },


  }
});

// Reducer
export default slice.reducer;
//export const { selectClient } = slice.actions;



// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export function getDiscounts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/discount/brands');
      dispatch(slice.actions.getDiscountsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function sendDiscount(brandid){
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
          const response = await axios.post(`/api/discount/${brandid}`);
          return response;
        } catch (error) {
          dispatch(slice.actions.hasError(error));
          if(error.messages){
            return error;
          }
          return "ERROR";
        }
      };
}
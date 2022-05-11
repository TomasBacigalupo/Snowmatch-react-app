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
  notifications: [],
  notification: null,
  sortBy: null,
  filters: {
    //type
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
  },
};

const slice = createSlice({
  name: 'notification',
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

    // GET NOTIFICATIONS
    getNotificationsSuccess(state, action) {
        state.isLoading = false;
        state.notifications = action.payload;
      },

    //  SORT & FILTER NOTIFICATIONS
    sortByNotifications(state, action) {
      state.sortBy = action.payload;
    },

    filterNotifications(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  sortByNotifications,
  filterNotifications,
} = slice.actions;

// ----------------------------------------------------------------------

export function getNotifications(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`https://tomasbacigalupo.com.ar:9094/slash/api/users/notifications/${name}`);
      console.log("response " , response.data);
      dispatch(slice.actions.getNotificationsSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

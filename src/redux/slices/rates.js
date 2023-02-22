import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    isSubmitting: false,
    error: null,
    rates: [],
    totalElements: 0,
    totalPages: 0,
    ratedTeacherIds:[]
};

const slice = createSlice({
    name: 'rates',
    initialState,
    reducers: {

        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },
        startSubmitting(state) {
            state.isSubmitting = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // GET RATES
        getRatesSuccess(state, action) {
            const {content, totalElements, totalPages} = action.payload;

            state.isLoading = false;
            state.rates = content;
            state.totalPages = totalPages;
            state.totalElements = totalElements;
        },

        // POST RATE
        onRateSuccess(state, action) {
            const {teacherId, rate} = action.payload
            state.ratedTeacherIds = state.ratedTeacherIds.push(teacherId)
            state.isSubmitting = false
        }
    },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getRates(teacherId, page, size) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/rate/byId/${teacherId}?page=${page}&size=${size}`);
            dispatch(slice.actions.getRatesSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// -----------------------------------------------------------------------

export function rateTeacherByID(userId, rate) {
    return async () => {
        dispatch(slice.actions.startSubmitting());
        try {
            const resp = await axios.post(`api/rate/${userId}`, rate)
            dispatch(slice.actions.onRateSuccess({
                teacherId: userId,
                rate: rate
            }))
            dispatch(getRates(userId))
        } catch (error) {
            console.error(error)
        }
    }
}


import { gridColumnLookupSelector } from '@mui/x-data-grid';
import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
import { func, number } from 'prop-types';
import useAuth from 'src/hooks/useAuth';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    success: null,
    error: null,
    business: null,
    businesses: [],
};

const slice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        
        hasSuccess(state, action) {
            state.isLoading = false;
            state.success = action.payload;
        },

        startLoading(state) {
            state.isLoading = true;
        },

        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        getBusinessesSuccess(state, action) {
            state.isLoading = false;
            state.businesses = action.payload;
        },

        getBusinessSuccess(state, action) {
            state.isLoading = false;
            state.business = action.payload;
        },
    },
});

// Reducer
export default slice.reducer;

// Actions
export const {
    startLoading,
    hasError,
    getSchoolSuccess,
    getSchoolsSuccess
} = slice.actions;

// ----------------------------------------------------------------------

export function getBusinesses(page) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/business?page=' + page);
            dispatch(slice.actions.getBusinessesSuccess(response.data.business));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------


export function getBusiness(id) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/business/' + id);
            dispatch(slice.actions.getBusinessSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function updateBusiness(school) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const resp = await axios.put(`/api/business`, school)
            dispatch(slice.actions.hasSuccess(resp))
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

// ----------------------------------------------------------------------


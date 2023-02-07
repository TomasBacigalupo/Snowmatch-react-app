import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    requestedRoute: null,
    error: null,
    discounts: [],
};

const slice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        // SET REQUESTED ROUTE 
        setRequestedRoute(state, action){
            state.requestedRoute = action.payload
        },
        cleanRequestedRoute(state, action) {
            state.requestedRoute = null
        }

    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function cleanRequestedRoute() {
    return () => {
        dispatch(slice.actions.cleanRequestedRoute);
    };
}

// ----------------------------------------------------------------------

export function setRequestedRoute(route) {
    return () => {
        dispatch(slice.actions.setRequestedRoute(route));
    };
}


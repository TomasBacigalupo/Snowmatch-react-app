import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    isLoadingModal: false,
    success: null,
    error: null,
    business: null,
    products: [],
    businesses: [],
    teachers: [],
    members: [],
    pending: [],
    sortBy: null,
    filters: {
        rating: '',
        gender: [],
        category: [],
        discipline: [],
        language: [],
        from: undefined,
        to: undefined,
        resort: '',
    },
    selectedTeacher: null,
    isOpenFireModal: false,
    isOpenHireModal: false,
    /** When set, hire/fire use admin business member APIs for this id. */
    managedBusinessId: null,
};

const slice = createSlice({
    name: 'business',
    initialState,
    reducers: {

        hasSuccess(state, action) {
            state.isLoading = false;
            state.isLoadingModal = false;
            state.success = action.payload;
        },

        hasError(state, action) {
            state.isLoadingModal = false;
            state.isLoading = false;
            state.error = action.payload;
        },

        startLoading(state) {
            state.isLoading = true;
        },

        startLoadingModal(state) {
            state.isLoadingModal = true;
        },

        getBusinessesSuccess(state, action) {
            state.isLoading = false;
            state.businesses = action.payload;
        },

        getBusinessSuccess(state, action) {
            state.isLoading = false;
            state.business = action.payload;

        },

        getProductsByBusinessSuccess(state, action) {
            state.isLoading = false;
            state.products = action.payload;

        },

        getTeachersSuccess(state, action) {
            state.isLoading = false;
            state.teachers = action.payload;
        },
        
        getMembersSuccess(state, action) {
            state.isLoading = false;
            state.members = action.payload;
        },

        getPendingSuccess(state, action) {
            state.isLoading = false;
            state.pending = action.payload;
        },

        filterTeachers(state, action) {
            state.filters.gender = action.payload.gender;
            state.filters.category = action.payload.category;
            state.filters.discipline = action.payload.discipline;
            state.filters.rating = action.payload.rating;
            state.filters.language = action.payload.language;
            state.filters.from = action.payload.from;
            state.filters.to = action.payload.to;
            state.filters.resort = action.payload.resort;
        },

        filterBusinesses(state, action) {
            state.filters.gender = action.payload.gender;
            state.filters.category = action.payload.category;
            state.filters.discipline = action.payload.discipline;
            state.filters.rating = action.payload.rating;
            state.filters.language = action.payload.language;
            state.filters.from = action.payload.from;
            state.filters.to = action.payload.to;
            state.filters.resort = action.payload.resort;
          },

        sortByProducts(state, action) {
            state.sortBy = action.payload;
        },

        openFireModal(state) {
            state.isOpenFireModal = true;
        },

        closeFireModal(state) {
            state.isOpenFireModal = false;
            state.selectedTeacher = null;
        },

        openHireModal(state) {
            state.isOpenHireModal = true;
        },

        closeHireModal(state) {
            state.isOpenHireModal = false;
            state.selectedTeacher = null;
        },

        selectTeacher(state, action) {
            const teacherId = action.payload;
            state.selectedTeacher = teacherId;
            state.isOpenModal = true;
        },

        setManagedBusinessId(state, action) {
            state.managedBusinessId = action.payload;
        },
    },
});

// Reducer
export default slice.reducer;

// Actions
export const {
    startLoadingModal,
    startLoading,
    hasError,
    getSchoolSuccess,
    getSchoolsSuccess,
    filterTeachers,
    filterBusinesses,
    openFireModal,
    closeFireModal,
    openHireModal,
    closeHireModal,
    selectTeacher,
    setManagedBusinessId,
} = slice.actions;

// ----------------------------------------------------------------------

export function getBusinesses(page) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/business?page=' + page);
            dispatch(slice.actions.getBusinessesSuccess(response.data));
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
            const response = await axios.get(`/api/business/${id}`);
            dispatch(slice.actions.getBusinessSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function getProductsByBusinessId(id) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/product/business/${id}`);
            dispatch(slice.actions.getProductsByBusinessSuccess(response.data));
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
            const resp = await axios.put(`/api/business/`+school.id, school)
            dispatch(slice.actions.hasSuccess(resp))
            dispatch(slice.actions.getBusinessSuccess(school))
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

// ----------------------------------------------------------------------

export function getBusinessMembers() {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/business/members');
            const teachers = response.data;
            dispatch(slice.actions.getMembersSuccess(teachers));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getBusinessMembersByBusinessId(businessId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/business/${businessId}/members`);
            const teachers = response.data;
            dispatch(slice.actions.getMembersSuccess(teachers));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}


// ----------------------------------------------------------------------

export function getBusinessPending() {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/api/business/requests');
            const teachers = response.data;

            dispatch(slice.actions.getPendingSuccess(teachers));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    }
}

// ----------------------------------------------------------------------

export function getAdminBusinessMembers(businessId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/admin/business/${businessId}/members`);
            dispatch(slice.actions.getMembersSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getAdminBusinessPending(businessId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get(`/api/admin/business/${businessId}/requests`);
            dispatch(slice.actions.getPendingSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

function reloadManagedBusinessLists(dispatch, getState) {
    const businessId = getState().business.managedBusinessId;
    if (businessId == null) return;
    dispatch(getAdminBusinessMembers(businessId));
    dispatch(getAdminBusinessPending(businessId));
}

export function fireTeacher(teacher) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.startLoadingModal());
        const businessId = getState().business.managedBusinessId;
        try {
            if (businessId != null) {
                await axios.delete(`/api/admin/business/${businessId}/members/${teacher?.id}`);
                dispatch(slice.actions.closeFireModal());
                dispatch(slice.actions.hasSuccess('business.fire_success'));
                reloadManagedBusinessLists(dispatch, getState);
            } else {
                await axios.delete(`/api/business/members/${teacher?.id}`);
                dispatch(slice.actions.closeFireModal());
                dispatch(slice.actions.hasSuccess('business.fire_success'));
                dispatch(getBusinessMembers());
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            dispatch(slice.actions.closeFireModal());
        }
    };
}

// ----------------------------------------------------------------------

export function hireTeacher(teacher) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.startLoadingModal());
        const businessId = getState().business.managedBusinessId;
        try {
            if (businessId != null) {
                await axios.post(`/api/admin/business/${businessId}/members/${teacher?.id}`);
                dispatch(slice.actions.closeHireModal());
                dispatch(slice.actions.hasSuccess('business.hire_success'));
                reloadManagedBusinessLists(dispatch, getState);
            } else {
                await axios.post(`/api/business/members/${teacher?.id}`);
                dispatch(slice.actions.closeHireModal());
                dispatch(slice.actions.hasSuccess('business.hire_success'));
                dispatch(getBusinessPending());
                dispatch(getBusinessMembers());
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            dispatch(slice.actions.closeHireModal());
        }
    };
}


export function getMembersPublic(businessId) {
    return async () => {
        dispatch(slice.actions.startLoadingModal());
        try {
            const resp = await axios.get(`/api/business/` + businessId + '/members')
            dispatch(slice.actions.getTeachersSuccess(resp.data))
        } catch (error) {
            dispatch(slice.actions.hasError(error))

        }
    }
}
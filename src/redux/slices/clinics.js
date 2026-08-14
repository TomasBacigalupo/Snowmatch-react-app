import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  items: [],
  currentClinic: null,
  enrollments: [],
  matchingInterests: [],
  interests: [],
};

export const fetchClinics = createAsyncThunk('clinics/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/admin/clinics');
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.message || 'Error loading clinics');
  }
});

export const fetchClinicById = createAsyncThunk('clinics/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/admin/clinics/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.message || 'Error loading clinic');
  }
});

export const createClinic = createAsyncThunk('clinics/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/admin/clinics', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(typeof error === 'string' ? error : error?.message || 'Error creating clinic');
  }
});

export const updateClinic = createAsyncThunk(
  'clinics/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/clinics/${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : error?.message || 'Error updating clinic');
    }
  }
);

export const deleteClinic = createAsyncThunk('clinics/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/admin/clinics/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(typeof error === 'string' ? error : error?.message || 'Error deleting clinic');
  }
});

export const fetchClinicEnrollments = createAsyncThunk(
  'clinics/fetchEnrollments',
  async (clinicId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/clinics/${clinicId}/enrollments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || 'Error loading enrollments');
    }
  }
);

export const fetchMatchingInterests = createAsyncThunk(
  'clinics/fetchMatchingInterests',
  async (clinicId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/clinics/${clinicId}/matching-interests`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || 'Error loading matching interests');
    }
  }
);

export const enrollUserInClinic = createAsyncThunk(
  'clinics/enrollUser',
  async ({ clinicId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/admin/clinics/${clinicId}/enroll`, { userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : error?.message || 'Error enrolling user');
    }
  }
);

export const updateClinicEnrollmentPayment = createAsyncThunk(
  'clinics/updateEnrollmentPayment',
  async ({ enrollmentId, paymentStatus, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/clinics/enrollments/${enrollmentId}/payment`, {
        paymentStatus,
        paymentMethod,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : error?.message || 'Error updating payment');
    }
  }
);

export const fetchClinicInterests = createAsyncThunk(
  'clinics/fetchInterests',
  async ({ resort, sport } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (resort) params.resort = resort;
      if (sport) params.sport = sport;
      const response = await axios.get('/api/admin/clinic-interests', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || 'Error loading clinic interests');
    }
  }
);

export const createClinicInterest = createAsyncThunk(
  'clinics/createInterest',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/admin/clinic-interests', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : error?.message || 'Error creating interest');
    }
  }
);

export const fetchClinicInterestById = createAsyncThunk(
  'clinics/fetchInterestById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/clinic-interests/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : error?.message || 'Error loading clinic interest');
    }
  }
);

export const updateClinicInterest = createAsyncThunk(
  'clinics/updateInterest',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/clinic-interests/${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : error?.message || 'Error updating interest');
    }
  }
);

const slice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentClinic(state) {
      state.currentClinic = null;
      state.enrollments = [];
      state.matchingInterests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchClinicById.fulfilled, (state, action) => {
        state.currentClinic = action.payload;
      })
      .addCase(createClinic.fulfilled, (state, action) => {
        if (action.payload?.id != null) {
          state.items.push(action.payload);
        }
      })
      .addCase(updateClinic.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated?.id == null) return;
        const idx = state.items.findIndex((x) => x.id === updated.id);
        if (idx >= 0) state.items[idx] = updated;
        if (state.currentClinic?.id === updated.id) state.currentClinic = updated;
      })
      .addCase(deleteClinic.fulfilled, (state, action) => {
        state.items = state.items.filter((x) => x.id !== action.payload);
      })
      .addCase(fetchClinicEnrollments.fulfilled, (state, action) => {
        state.enrollments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMatchingInterests.fulfilled, (state, action) => {
        state.matchingInterests = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(enrollUserInClinic.fulfilled, (state, action) => {
        const enrollment = action.payload;
        if (enrollment?.id != null) {
          const idx = state.enrollments.findIndex((e) => e.id === enrollment.id);
          if (idx >= 0) state.enrollments[idx] = enrollment;
          else state.enrollments.push(enrollment);
        }
      })
      .addCase(updateClinicEnrollmentPayment.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated?.id == null) return;
        const idx = state.enrollments.findIndex((e) => e.id === updated.id);
        if (idx >= 0) state.enrollments[idx] = updated;
      })
      .addCase(fetchClinicInterests.fulfilled, (state, action) => {
        state.interests = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(createClinicInterest.fulfilled, (state, action) => {
        if (action.payload?.id != null) {
          state.interests.unshift(action.payload);
        }
      })
      .addCase(updateClinicInterest.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated?.id == null) return;
        const idx = state.interests.findIndex((x) => x.id === updated.id);
        if (idx >= 0) state.interests[idx] = updated;
      });
  },
});

export const { clearError, clearCurrentClinic } = slice.actions;
export default slice.reducer;

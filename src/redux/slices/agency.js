import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  agencies: [],
  agenciesLoading: false,
  agenciesError: null,
};

export const getAgencies = createAsyncThunk('agency/getAgencies', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/admin/agencies');
    return response.data;
  } catch (error) {
    const msg = error?.message || error || 'Error fetching agencies';
    return rejectWithValue(msg);
  }
});

export const createAgency = createAsyncThunk('agency/createAgency', async (body, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/admin/agencies', body);
    return response.data;
  } catch (error) {
    const msg = error?.message || error || 'Error creating agency';
    return rejectWithValue(msg);
  }
});

export const updateAgency = createAsyncThunk(
  'agency/updateAgency',
  async ({ id, ...body }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/agencies/${id}`, body);
      return response.data;
    } catch (error) {
      const msg = error?.message || error || 'Error updating agency';
      return rejectWithValue(msg);
    }
  }
);

export const deleteAgency = createAsyncThunk('agency/deleteAgency', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/admin/agencies/${id}`);
    return id;
  } catch (error) {
    const msg = error?.message || error || 'Error deleting agency';
    return rejectWithValue(msg);
  }
});

const slice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    clearAgenciesError(state) {
      state.agenciesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAgencies.pending, (state) => {
        state.agenciesLoading = true;
        state.agenciesError = null;
      })
      .addCase(getAgencies.fulfilled, (state, action) => {
        state.agenciesLoading = false;
        state.agencies = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAgencies.rejected, (state, action) => {
        state.agenciesLoading = false;
        state.agenciesError = action.payload;
      })
      .addCase(createAgency.fulfilled, (state, action) => {
        if (action.payload) {
          state.agencies = [...state.agencies, action.payload].sort((a, b) =>
            (a.name || '').localeCompare(b.name || '')
          );
        }
      })
      .addCase(updateAgency.fulfilled, (state, action) => {
        if (action.payload?.id != null) {
          state.agencies = state.agencies
            .map((row) => (row.id === action.payload.id ? action.payload : row))
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
      })
      .addCase(deleteAgency.fulfilled, (state, action) => {
        state.agencies = state.agencies.filter((row) => row.id !== action.payload);
      })
      .addCase(createAgency.rejected, (state, action) => {
        state.agenciesError = action.payload;
      })
      .addCase(updateAgency.rejected, (state, action) => {
        state.agenciesError = action.payload;
      })
      .addCase(deleteAgency.rejected, (state, action) => {
        state.agenciesError = action.payload;
      });
  },
});

export const { clearAgenciesError } = slice.actions;
export default slice.reducer;

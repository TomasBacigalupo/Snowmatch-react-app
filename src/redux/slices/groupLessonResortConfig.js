import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  items: [],
};

export const fetchGroupLessonResortConfigs = createAsyncThunk(
  'groupLessonResortConfig/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/group-lesson-resort-config');
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || 'Error loading group lesson resort config');
    }
  }
);

export const updateGroupLessonResortConfig = createAsyncThunk(
  'groupLessonResortConfig/update',
  async ({ resort, price, currency, imageUrl, description }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/group-lesson-resort-config/${resort}`, {
        price: Number(price),
        currency: currency || 'ARS',
        imageUrl: imageUrl || null,
        description: description || null,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        typeof error === 'string' ? error : error?.message || 'Error saving config'
      );
    }
  }
);

const slice = createSlice({
  name: 'groupLessonResortConfig',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupLessonResortConfigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupLessonResortConfigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGroupLessonResortConfigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateGroupLessonResortConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGroupLessonResortConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        if (!updated?.resort) return;
        const idx = state.items.findIndex((x) => x.resort === updated.resort);
        if (idx >= 0) {
          state.items[idx] = updated;
        } else {
          state.items.push(updated);
        }
      })
      .addCase(updateGroupLessonResortConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = slice.actions;
export default slice.reducer;

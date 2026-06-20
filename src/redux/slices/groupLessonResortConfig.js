import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  items: [],
};

const groupLessonResortConfigApiBase = (useResortAdmin) =>
  useResortAdmin
    ? '/api/resort-admin/group-lesson-resort-config'
    : '/api/admin/group-lesson-resort-config';

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

export const createGroupLessonResortConfig = createAsyncThunk(
  'groupLessonResortConfig/create',
  async (
    {
      resort,
      price,
      currency,
      imageUrl,
      title,
      description,
      includesGear,
      skiLevel,
      minAge,
      minDays,
      startTime,
      endTime,
      useResortAdmin = false,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(groupLessonResortConfigApiBase(useResortAdmin), {
        resort,
        price: Number(price),
        currency: currency || 'ARS',
        imageUrl: imageUrl || null,
        title: title?.trim() ? title.trim() : null,
        description: description || null,
        includesGear: Boolean(includesGear),
        skiLevel: skiLevel?.trim() ? skiLevel.trim() : null,
        minAge:
          minAge === '' || minAge == null
            ? null
            : (() => {
                const n = Number(minAge);
                return Number.isFinite(n) ? n : null;
              })(),
        minDays:
          minDays === '' || minDays == null
            ? null
            : (() => {
                const n = Number(minDays);
                return Number.isFinite(n) ? n : null;
              })(),
        startTime: startTime?.trim() ? startTime.trim() : null,
        endTime: endTime?.trim() ? endTime.trim() : null,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        typeof error === 'string' ? error : error?.message || 'Error saving config'
      );
    }
  }
);

export const updateGroupLessonResortConfig = createAsyncThunk(
  'groupLessonResortConfig/update',
  async (
    {
      id,
      price,
      currency,
      imageUrl,
      title,
      description,
      includesGear,
      skiLevel,
      minAge,
      minDays,
      startTime,
      endTime,
      useResortAdmin = false,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${groupLessonResortConfigApiBase(useResortAdmin)}/${id}`, {
        price: Number(price),
        currency: currency || 'ARS',
        imageUrl: imageUrl || null,
        title: title?.trim() ? title.trim() : null,
        description: description || null,
        includesGear: Boolean(includesGear),
        skiLevel: skiLevel?.trim() ? skiLevel.trim() : null,
        minAge:
          minAge === '' || minAge == null
            ? null
            : (() => {
                const n = Number(minAge);
                return Number.isFinite(n) ? n : null;
              })(),
        minDays:
          minDays === '' || minDays == null
            ? null
            : (() => {
                const n = Number(minDays);
                return Number.isFinite(n) ? n : null;
              })(),
        startTime: startTime?.trim() ? startTime.trim() : null,
        endTime: endTime?.trim() ? endTime.trim() : null,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        typeof error === 'string' ? error : error?.message || 'Error saving config'
      );
    }
  }
);

export const deleteGroupLessonResortConfig = createAsyncThunk(
  'groupLessonResortConfig/delete',
  async ({ id, useResortAdmin = false }, { rejectWithValue }) => {
    try {
      await axios.delete(`${groupLessonResortConfigApiBase(useResortAdmin)}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        typeof error === 'string' ? error : error?.message || 'Error deleting config'
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
      .addCase(createGroupLessonResortConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGroupLessonResortConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        const created = action.payload;
        if (created?.id != null) {
          state.items.push(created);
        }
      })
      .addCase(createGroupLessonResortConfig.rejected, (state, action) => {
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
        if (updated?.id == null) return;
        const idx = state.items.findIndex((x) => x.id === updated.id);
        if (idx >= 0) {
          state.items[idx] = updated;
        } else {
          state.items.push(updated);
        }
      })
      .addCase(updateGroupLessonResortConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteGroupLessonResortConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGroupLessonResortConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        const id = action.payload;
        state.items = state.items.filter((x) => x.id !== id);
      })
      .addCase(deleteGroupLessonResortConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = slice.actions;
export default slice.reducer;

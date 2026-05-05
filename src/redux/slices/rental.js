import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// mock data
import { mockRentalItems } from '../../_mock/rental/rentalItems';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  successMessage: null,
  items: [],
  totalItems: 0,
  currentItem: null,
  providers: [],
  providersLoading: false,
  providersError: null,
};

// ----------------------------------------------------------------------

// Async thunks
export const getRentalItems = createAsyncThunk(
  'rental/getRentalItems',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      const response = await axios.get(`/api/rental/items?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error fetching rental items');
    }
  }
);

export const getRentalItem = createAsyncThunk(
  'rental/getRentalItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/rental/items/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error fetching rental item');
    }
  }
);

export const createRentalItem = createAsyncThunk(
  'rental/createRentalItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/rental/admin/items', itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error creating rental item');
    }
  }
);

export const updateRentalItem = createAsyncThunk(
  'rental/updateRentalItem',
  async ({ id, ...itemData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/rental/admin/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error updating rental item');
    }
  }
);

export const deleteRentalItem = createAsyncThunk(
  'rental/deleteRentalItem',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/rental/admin/items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Error deleting rental item');
    }
  }
);

export const addRentalVariant = createAsyncThunk(
  'rental/addRentalVariant',
  async ({ itemId, variantData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/rental/admin/items/${itemId}/variants`, variantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error adding rental variant');
    }
  }
);

export const updateRentalVariant = createAsyncThunk(
  'rental/updateRentalVariant',
  async ({ variantId, variantData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/rental/admin/variants/${variantId}`, variantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error updating rental variant');
    }
  }
);

export const deleteRentalVariant = createAsyncThunk(
  'rental/deleteRentalVariant',
  async (variantId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/rental/admin/variants/${variantId}`);
      return variantId;
    } catch (error) {
      return rejectWithValue(error.message || 'Error deleting rental variant');
    }
  }
);

export const getRentalProviders = createAsyncThunk(
  'rental/getRentalProviders',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.resortId) {
        params.append('resortId', filters.resortId);
      }
      const qs = params.toString();
      const response = await axios.get(`/api/rental/admin/providers${qs ? `?${qs}` : ''}`);
      return response.data;
    } catch (error) {
      const msg =
        (typeof error.response?.data === 'string' && error.response.data) ||
        error.response?.data?.message ||
        error.message ||
        'Error fetching rental providers';
      return rejectWithValue(msg);
    }
  }
);

export const createRentalProvider = createAsyncThunk(
  'rental/createRentalProvider',
  async (body, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/rental/admin/providers', body);
      return response.data;
    } catch (error) {
      const msg =
        (typeof error.response?.data === 'string' && error.response.data) ||
        error.response?.data?.message ||
        error.message ||
        'Error creating rental provider';
      return rejectWithValue(msg);
    }
  }
);

export const updateRentalProvider = createAsyncThunk(
  'rental/updateRentalProvider',
  async ({ id, ...body }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/rental/admin/providers/${id}`, body);
      return response.data;
    } catch (error) {
      const msg =
        (typeof error.response?.data === 'string' && error.response.data) ||
        error.response?.data?.message ||
        error.message ||
        'Error updating rental provider';
      return rejectWithValue(msg);
    }
  }
);

export const deleteRentalProvider = createAsyncThunk(
  'rental/deleteRentalProvider',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/rental/admin/providers/${id}`);
      return id;
    } catch (error) {
      const msg =
        (typeof error.response?.data === 'string' && error.response.data) ||
        error.response?.data?.message ||
        error.message ||
        'Error deleting rental provider';
      return rejectWithValue(msg);
    }
  }
);

// ----------------------------------------------------------------------

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearProvidersError: (state) => {
      state.providersError = null;
    },
  },
  extraReducers: (builder) => {
    // Get rental items
    builder
      .addCase(getRentalItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRentalItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.content || action.payload;
        state.totalItems = action.payload.totalElements || action.payload.length || 0;
      })
      .addCase(getRentalItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get single rental item
    builder
      .addCase(getRentalItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRentalItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentItem = action.payload;
      })
      .addCase(getRentalItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create rental item
    builder
      .addCase(createRentalItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRentalItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Producto creado exitosamente';
        // Add the new item to the list
        state.items.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createRentalItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update rental item
    builder
      .addCase(updateRentalItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRentalItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Producto actualizado exitosamente';
        // Update the item in the list
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Update current item if it's the same
        if (state.currentItem && state.currentItem.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateRentalItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete rental item
    builder
      .addCase(deleteRentalItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRentalItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Producto eliminado exitosamente';
        // Remove the item from the list
        state.items = state.items.filter(item => item.id !== action.payload);
        state.totalItems -= 1;
        // Clear current item if it's the deleted one
        if (state.currentItem && state.currentItem.id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteRentalItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Add rental variant
    builder
      .addCase(addRentalVariant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addRentalVariant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Variante agregada exitosamente';
        // Update the item in the list with the new variant
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Update current item if it's the same
        if (state.currentItem && state.currentItem.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(addRentalVariant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update rental variant
    builder
      .addCase(updateRentalVariant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRentalVariant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Variante actualizada exitosamente';
        // Update the item in the list with the updated variant
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Update current item if it's the same
        if (state.currentItem && state.currentItem.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateRentalVariant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete rental variant
    builder
      .addCase(deleteRentalVariant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRentalVariant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Variante eliminada exitosamente';
        // Note: We need to refetch the item to get the updated variants list
        // This could be optimized by updating the local state directly
      })
      .addCase(deleteRentalVariant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getRentalProviders.pending, (state) => {
        state.providersLoading = true;
        state.providersError = null;
      })
      .addCase(getRentalProviders.fulfilled, (state, action) => {
        state.providersLoading = false;
        state.providers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getRentalProviders.rejected, (state, action) => {
        state.providersLoading = false;
        state.providersError = action.payload;
      });

    builder
      .addCase(createRentalProvider.pending, (state) => {
        state.providersLoading = true;
        state.providersError = null;
      })
      .addCase(createRentalProvider.fulfilled, (state) => {
        state.providersLoading = false;
        state.successMessage = 'Proveedor creado';
      })
      .addCase(createRentalProvider.rejected, (state, action) => {
        state.providersLoading = false;
        state.providersError = action.payload;
      });

    builder
      .addCase(updateRentalProvider.pending, (state) => {
        state.providersLoading = true;
        state.providersError = null;
      })
      .addCase(updateRentalProvider.fulfilled, (state) => {
        state.providersLoading = false;
        state.successMessage = 'Proveedor actualizado';
      })
      .addCase(updateRentalProvider.rejected, (state, action) => {
        state.providersLoading = false;
        state.providersError = action.payload;
      });

    builder
      .addCase(deleteRentalProvider.pending, (state) => {
        state.providersLoading = true;
        state.providersError = null;
      })
      .addCase(deleteRentalProvider.fulfilled, (state) => {
        state.providersLoading = false;
        state.successMessage = 'Proveedor eliminado';
      })
      .addCase(deleteRentalProvider.rejected, (state, action) => {
        state.providersLoading = false;
        state.providersError = action.payload;
      });
  },
});

// ----------------------------------------------------------------------

export const { clearError, clearMessage, setCurrentItem, clearCurrentItem, clearProvidersError } = rentalSlice.actions;

export default rentalSlice.reducer; 
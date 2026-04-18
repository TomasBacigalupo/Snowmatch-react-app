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
  teachers: [],
  bookings: [],
  teacher: null,
  isOpenModal: false,
  isOpenEditBookingModal: false,
  isOpenDeleteModal: false,
  booking: null,
  selectedEmail: '',
  selectedBookingId: null,
  documents: [],
  successMessage: null,
  payouts: [],
  financialData: {
    bookings: [],
    payouts: [],
    payments: [],
    kpis: {
      totalBookings: 0,
      totalRevenue: 0,
      pendingPayouts: 0,
      completedPayouts: 0,
      bookingsWithPayout: 0,
      bookingsWithoutPayout: 0,
      bookingsWithInvoice: 0,
    },
    charts: {
      revenueTimeSeries: [],
      paymentMethodBreakdown: [],
      bookingsTimeSeries: [],
    },
  },
};

const slice = createSlice({
  name: 'admin',
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

    // GET TEACHERS
    getTeachersSuccess(state, action) {
      state.isLoading = false;
      state.teachers = action.payload;
    },

    getDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.documents = action.payload;
    },

    getTeacherSuccess(state, action) {
      state.isLoading = false;
      state.teacher = action.payload;
    },

    getBookingsSuccess(state, action) {
      state.isLoading = false;
      state.bookings = action.payload;
    },

    updateBookingSuccess(state, action) {
      state.isLoading = false;
      state.bookings = state.bookings.map(booking => booking.id === action.payload.id ? action.payload : booking);
    },

    deleteBookingSuccess(state, action) {
      state.isLoading = false;
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload.id);
    },

    getBookingsSuccess(state, action) {
      console.log(action.payload)
      state.isLoading = false;
      state.bookings = action.payload;
    },

    openModal(state, email) {
      state.isOpenModal = true;
      state.selectedEmail = email.payload;
    },

    openEditBookingModal(state, action) {
      state.isOpenEditBookingModal = true;
      state.selectedBooking = action.payload;
    },

    openDeleteModal(state, action) {
      state.isOpenDeleteModal = true;
      state.selectedBookingId = action.payload;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEmail = null;
    },

    closeDeleteModal(state) {
      state.isOpenDeleteModal = false;
      state.selectedBookingId = null;
    },

    // BOOKING CREATION SUCCESS
    createBookingSuccess(state) {
      state.isLoading = false;
      state.successMessage = 'Booking created successfully';     
    },

    // CLEAR SUCCESS MESSAGE
    clearSuccessMessage(state) {
      state.successMessage = null;
    },

    // FETCH PAYOUTS FOR BOOKING
    fetchPayoutsSuccess(state, action) {
      const { bookingId, payouts } = action.payload;
      
      // Update the specific booking in bookings array
      state.bookings = state.bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, payouts: payouts }
          : booking
      );
      
      // Update the current booking if it matches
      if (state.booking && state.booking.id === bookingId) {
        state.booking = { ...state.booking, payouts: payouts };
      }
      
      state.isLoading = false;
    },

    // EDIT PAYOUT SUCCESS
    editPayoutSuccess(state, action) {
      const updatedPayout = action.payload;
      
      // Update payouts in all bookings that contain this payout
      state.bookings = state.bookings.map(booking => {
        if (booking.payouts) {
          const updatedPayouts = booking.payouts.map(payout => 
            payout.id === updatedPayout.id ? updatedPayout : payout
          );
          return { ...booking, payouts: updatedPayouts };
        }
        return booking;
      });
      
      // Update the current booking if it has payouts
      if (state.booking && state.booking.payouts) {
        const updatedPayouts = state.booking.payouts.map(payout => 
          payout.id === updatedPayout.id ? updatedPayout : payout
        );
        state.booking = { ...state.booking, payouts: updatedPayouts };
      }
      
      state.isLoading = false;
    },

    // GET FINANCIAL DATA
    getFinancialDataSuccess(state, action) {
      state.isLoading = false;
      state.financialData = action.payload;
    },

        // MARK PAYOUT AS PAID
    markPayoutAsPaidSuccess(state, action) {
      state.isLoading = false;
      // Update the payout in financial data if it exists
      if (state.financialData?.payouts) {
        state.financialData.payouts = state.financialData.payouts.map(payout =>
          payout.id === action.payload.id ? { ...payout, status: 'paid', paidAt: new Date().toISOString() } : payout
        );
      }
    },

    // GET ALL PAYOUTS
    getAllPayoutsSuccess(state, action) {
      state.isLoading = false;
      state.payouts = action.payload;
    },

    broadcastLessonSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.successMessage = action.payload;
    },
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, getSelectedEmail, openEditBookingModal, openDeleteModal, closeDeleteModal, createBookingSuccess, clearSuccessMessage } = slice.actions;

// ----------------------------------------------------------------------

export function getTeachers(page, role, name, level) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/admin/filter?page=${page}&role=${role}&level=${level}&name=${name}`);
      dispatch(slice.actions.getTeachersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTeachersAdmin(name, page, filters, resort, size = 20) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const body = Array.isArray(filters) ? filters : [];
      const q = new URLSearchParams({
        page: String(page),
        size: String(size),
        resort: resort ?? '',
        name: name ?? '',
      });
      const response = await axios.post(`/api/users/teachers/available?${q.toString()}`, body);
      dispatch(slice.actions.getTeachersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

/** GET /api/users/filter_teachers — UserService.getFilteredFreeTeachersInTimeRange (resortsEnum, AVAILABLE, authorized). */
export function getFilteredTeachersForAdminBooking({
  nameSearch,
  resort,
  dateTimes,
  page = 0,
  size = 100,
  level = 0,
}) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const validDates = (dateTimes || []).map((dt) => dt.date).filter(Boolean);
      if (validDates.length === 0) {
        dispatch(slice.actions.getTeachersSuccess([]));
        return;
      }
      const sorted = [...validDates].sort();
      const startDate = `${sorted[0]}T00:00:00`;
      const endDate = `${sorted[sorted.length - 1]}T23:59:59`;

      const q = new URLSearchParams({
        level: String(level),
        startDate,
        endDate,
        page: String(page),
        size: String(size),
      });
      if (resort) {
        q.append('resort', resort);
      }

      const response = await axios.get(`/api/users/filter_teachers?${q.toString()}`);
      let teachers = response.data || [];
      const needle = (nameSearch || '').trim().toLowerCase();
      if (needle) {
        teachers = teachers.filter(
          (t) =>
            (t.name && t.name.toLowerCase().includes(needle)) ||
            (t.lastname && t.lastname.toLowerCase().includes(needle))
        );
      }
      dispatch(slice.actions.getTeachersSuccess(teachers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

/** POST /api/admin/events/broadcast — Uber-style offer to multiple instructors. */
export function broadcastLesson(body) {
  return async () => {
    try {
      const response = await axios.post('/api/admin/events/broadcast', body);
      dispatch(slice.actions.broadcastLessonSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

export function getBookings(teacherId, studentId, month, page, size = 100000, resort, day) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (teacherId) params.append('teacherId', teacherId);
      if (studentId) params.append('studentId', studentId);
      if (month) params.append('month', month);
      if (resort) params.append('resort', resort);
      if (day) params.append('day', day);
      params.append('size', size);

      const response = await axios.get(`/api/admin/bookings/filter?${params.toString()}`);
      dispatch(slice.actions.getBookingsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTeacher(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/users/' + id);
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function declineTeacher(teacherData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/admin/decline/' + teacherData.email);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function confirmTeacher(teacherData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const teacher = {
        email: teacherData.email,
        cellphone: teacherData.cellphone,
        name: teacherData.name,
        lastname: teacherData.lastname,
        notes: teacherData.notes,
        level: teacherData.level,
        id: teacherData.id,
        dni: teacherData.dni
      }
      const response = await axios.post('/api/admin/approve/' + teacher.email + "?level=" + teacher.level + "&dni=" + teacher.dni + "&name=" + teacher.name + "&lastName=" + teacher.lastname);
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function editTeacher(teacherData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put('/api/admin/users/' + teacherData.userId, teacherData);
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateDocument(teacherId, documentName, state, callback) {
  return async () => { 
    try {
      const pathState = state === "VERIFIED" ? "verify" : "reject"
      const response = await axios.put(`api/admin/${teacherId}/documents/${documentName}/${pathState}`)
      callback(response.status === 200)
      // //updateCurrentTeacherDocument
    } catch(error){
      callback(false)
    }
  }
}

export function getTeacherDocuments(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/admin/users/' + id + '/documents');
      dispatch(slice.actions.getDocumentsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getBooking(bookingId) {
  return async () => {
      dispatch(slice.actions.startLoading());
      try {
          const response = await axios.get(`/api/bookings/{bookingId}`);
          const bookings = response.data
          dispatch(slice.actions.getBookingSuccess(bookings));
      } catch (error) {
          dispatch(slice.actions.hasError(error));
      }
  };
}

export function deleteBooking(bookingId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/admin/bookings/${bookingId}`);
      dispatch(slice.actions.deleteBookingSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

export function createBlog(blogData) {
  console.log("pase", blogData)
  return async () => {
      //dispatch(slice.actions.startLoading());
      try {
        console.log("pase3")
          const response = await axios.post(`/api/blog/`,
              blogData
          );
          const blog = response.data
          console.log(blog);
          //dispatch(slice.actions.getBookingSuccess(bookings));
      } catch (error) {
        console.log(error)
          dispatch(slice.actions.hasError(error));
      }
  }; 
}

export function editAdminBooking(bookingId, {
  type,
  teacherId,
  studentId,
  clientId,
  price,
  resort,
  state,
  userComment,
  rateId,
  children,
  adults,
  internalComment,
  includesLaunch,
  includesEquipments,
  paymentStatus,
  bookingPaymentMethod
}) {
  return async () => {
      dispatch(slice.actions.startLoading());
      try {
          const response = await axios.put(`api/admin/bookings/${bookingId}`, {
              id: bookingId,
              type,
              teacherId,
              studentId,
              clientId,
              price,
              resort,
              state,
              userComment,
              rateId,
              children,
              adults,
              internalComment,
              includesLaunch,
              includesEquipments,
              paymentStatus,
              bookingPaymentMethod
          });
          dispatch(slice.actions.updateBookingSuccess(response.data));
          return response.data;
      } catch (error) {
          dispatch(slice.actions.hasError(error));
                throw error;
    }
  };
}

export function fetchPayouts(bookingId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/bookings/${bookingId}/payouts`);
      const payouts = response.data;
      
      dispatch(slice.actions.fetchPayoutsSuccess({ 
        bookingId, 
        payouts 
      }));
      
      return payouts;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

export function editPayout(payoutId, payoutData) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/payouts/${payoutId}`, payoutData);
      
      dispatch(slice.actions.editPayoutSuccess(response.data));
      
      return response.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

// Financial Dashboard Actions
export function getFinancialData(filters) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const params = new URLSearchParams();
      
      // Add filter parameters
      if (filters.dateRange?.startDate) {
        params.append('startDate', filters.dateRange.startDate.toISOString());
      }
      if (filters.dateRange?.endDate) {
        params.append('endDate', filters.dateRange.endDate.toISOString());
      }
      if (filters.resort) {
        params.append('resort', filters.resort);
      }
      if (filters.instructor) {
        params.append('instructor', filters.instructor);
      }
      if (filters.bookingStatus && filters.bookingStatus !== 'all') {
        params.append('bookingStatus', filters.bookingStatus);
      }
      if (filters.payoutStatus && filters.payoutStatus !== 'all') {
        params.append('payoutStatus', filters.payoutStatus);
      }
      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        params.append('paymentMethod', filters.paymentMethod);
      }

      const response = await axios.get(`/api/admin/financial/data?${params.toString()}`);
      
      // Process and structure the data
      const financialData = {
        bookings: response.data.bookings || [],
        payouts: response.data.payouts || [],
        payments: response.data.payments || [],
        kpis: {
          totalBookings: response.data.kpis?.totalBookings || 0,
          totalRevenue: response.data.kpis?.totalRevenue || 0,
          pendingPayouts: response.data.kpis?.pendingPayouts || 0,
          completedPayouts: response.data.kpis?.completedPayouts || 0,
          bookingsWithPayout: response.data.kpis?.bookingsWithPayout || 0,
          bookingsWithoutPayout: response.data.kpis?.bookingsWithoutPayout || 0,
          bookingsWithInvoice: response.data.kpis?.bookingsWithInvoice || 0,
        },
        charts: {
          revenueTimeSeries: response.data.charts?.revenueTimeSeries || [],
          paymentMethodBreakdown: response.data.charts?.paymentMethodBreakdown || [],
          bookingsTimeSeries: response.data.charts?.bookingsTimeSeries || [],
        },
      };
      
      dispatch(slice.actions.getFinancialDataSuccess(financialData));
      return { payload: financialData };
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

export function exportFinancialData(filters) {
  return async () => {
    try {
      const params = new URLSearchParams();
      
      // Add filter parameters
      if (filters.dateRange?.startDate) {
        params.append('startDate', filters.dateRange.startDate.toISOString());
      }
      if (filters.dateRange?.endDate) {
        params.append('endDate', filters.dateRange.endDate.toISOString());
      }
      if (filters.resort) {
        params.append('resort', filters.resort);
      }
      if (filters.instructor) {
        params.append('instructor', filters.instructor);
      }
      if (filters.bookingStatus && filters.bookingStatus !== 'all') {
        params.append('bookingStatus', filters.bookingStatus);
      }
      if (filters.payoutStatus && filters.payoutStatus !== 'all') {
        params.append('payoutStatus', filters.payoutStatus);
      }
      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        params.append('paymentMethod', filters.paymentMethod);
      }

      const response = await axios.get(`/api/admin/financial/export?${params.toString()}`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial-data-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting financial data:', error);
      throw error;
    }
  };
}

export function markPayoutAsPaid(payoutId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/payouts/${payoutId}/mark-paid`);
      dispatch(slice.actions.markPayoutAsPaidSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

// Get all payouts
export function getAllPayouts(page = 0, pageSize = 1000) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/payouts/?page=${page}&pageSize=${pageSize}`);
      dispatch(slice.actions.getAllPayoutsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}
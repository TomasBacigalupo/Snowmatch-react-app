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
  openClinicModal: true,
  error: null,
  products: [],
  teachers: [],
  teacher: null,
  rates: [],
  product: null,
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
  checkout: {
    activeStep: 0,
    cart: [],
    events: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
    isOpenAddEventModal: false,
    teacher: {}
  },
  cakeChart: [0, 0, 0, 0],
  totalClasses: 0,
  totalIncome: 0,
  topClients: [],
  totalClients: 0,
  conversations: [],
  loadingRate: false
};

const slice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {

    // CLOSE CLINIC MODAL
    closeClinicModal(state) {
      state.openClinicModal = false;
      
    },

    // CLOSE EVENT MODAL
    closeAddEventModal(state) {
      state.checkout.isOpenAddEventModal = false;
    },

    // OPEN EVENT MODAL
    openAddEventModal(state) {
      state.checkout.isOpenAddEventModal = true;
    },

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET TEACHERS
    getTeachersSuccess(state, action) {
      state.isLoading = false;
      state.teachers = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    // GET TEACHER
    getTeacherSuccess(state, action) {
      state.isLoading = false;
      state.teacher = action.payload;
    },

    // GET TEACHER RATES
    getTeacherRatesSuccess(state, action) {
      state.isLoading = false;
      state.rates = action.payload;
    },

    // GET TEACHER WITH RATES
    getTeacherWithRatesSuccess(state, action) {
      state.isLoading = false;
      state.rates = action.payload.rates;
      state.teacher = action.payload
    },

    //GET TEACHER OVERVIEW
    getTeacherOverviewSuccess(state, action) {
      state.cakeChart = action.payload;
    },

    //GET TEACHER OVERVIEW TOTAL INCOME
    getTeacherOverviewSuccessTotalIncome(state, action) {
      state.totalIncome = action.payload;
    },

    //GET TEACHER OVERVIEW TOTAL CLASSES
    getTeacherOverviewSuccessTotalClasses(state, action) {
      state.totalClasses = action.payload;
    },

    //GET TEACHER OVERVIEW TOP CLIENTS
    getTeacherOverviewSuccessTopClients(state, action) {
      state.topClients = action.payload;
    },

    //GET TEACHER OVERVIEW TOTAL CLIENTS
    getTeacherOverviewSuccessTotalClients(state, action) {
      state.totalClients = action.payload;
    },

    //GET TEACHER CONVERSATIONS
    getTeacherOverviewSuccessConversations(state, action) {
      state.conversations = action.payload
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
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

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = 0//sum(cart.map((cartItem) => cartItem.price * cartItem.quantity));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      const {teacher, event} = action.payload;
      if(teacher){
        state.checkout.teacher = teacher;
      }
      
      state.checkout.cart = [...state.checkout.cart, teacher];
      state.checkout.events = [...state.checkout.events, event];
      state.checkout.cart = uniqBy([...state.checkout.cart, teacher], 'id');
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.events.filter((event, idx) => idx !== action.payload);

      state.checkout.events = updateCart;
    },

    cleanCart(state, action){
      state.checkout.events = []
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },

    // SUCCESS RATE
    onRateSuccess(state, action) {
      const {teacherId} = action.payload;
      state.teacher = state.teachers.map(teacher => {
        if(teacherId === teacher.id){
          return {
            ...teacher,
            rated: true
          }
        }
        return teacher
        }
      )
      state.loadingRate = false
    },

    onRateError(state, action) {
      state.loadingRate = false
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterTeachers,
  closeClinicModal,
  closeAddEventModal,
  openAddEventModal,
  cleanCart
} = slice.actions;

// ----------------------------------------------------------------------

export function getProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products');
      dispatch(slice.actions.getProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
function merge(ranges) {
  var result = [], last;

  ranges.forEach(function (r) {
    if (!last || r.start > last.end) {
      result.push(r);
      last = r;
    }
    else if (r.end > last.end)
      last.end = r.end;
  });

  return result;
}

export function getTeachers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/users/teacher');
      const teachers = response.data;

      dispatch(slice.actions.getTeachersSuccess(teachers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products/product', {
        params: { name },
      });
      dispatch(slice.actions.getProductSuccess(response.data.product));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTeacher(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/users/teacher/${name}`
      );
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTeacherBiId(teacherId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/users/teacher/byId/${teacherId}`);
      dispatch(slice.actions.getTeacherSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTeacherWithRates(email) {
  return async () => {
    const teacherRequest = `/api/users/${email}`;
    dispatch(slice.actions.startLoading());
    try {
      axios.get(teacherRequest).then(r => {
        const teacher = r.data;
        const dto = {
            "rates": [],
            "teacher": teacher
        }
          if (dto.teacher.events) {
            dto.teacher.events = merge(dto.teacher.events.sort(function (a, b) { return new Date(a.start) - new Date(b.start) }))
          }
          dispatch(slice.actions.getTeacherWithRatesSuccess(dto));
      })
      
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getRates(email, teacher) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const ratesResponse = await axios.get(`/api/rate/getRates/${email}`);
      const dto = {
        "rates": ratesResponse.data,
        "teacher": teacher
      }
      dispatch(slice.actions.getTeacherWithRatesSuccess(dto));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateTeacher(teacher) {
  return async () => {
    try {
      const resp = await axios.put(`/api/users/edit`, teacher)
      return resp;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

// ----------------------------------------------------------------------

export function changeProfilePicture(picture, callBack) {
  return async () => {
    try {
      const signedUrl = await axios.get(`/api/images/preSignedUrlImage`)
      // Upload at URL
      await fetch(signedUrl.data, {
        method: 'PUT',
        headers: {
          "Content-Type": picture.type,
        },
        body: picture
      });

    } catch (error) {
      console.error(error)
      callBack(false)
    }
    callBack(true)
  }
}

export function uploadCertificatePicture(picture, certificate, callBack) {
  return async () => {
    try {
      const signedUrl = await axios.get(`/api/images/preSignedUrlImage/${certificate}`)
      // Upload at URL
      await fetch(signedUrl.data, {
        method: 'PUT',
        headers: {
          "Content-Type": picture.type,
        },
        body: picture
      });

    } catch (error) {
      console.error(error)
      callBack(false)
    }
    callBack(true)
  }
}

export function updateLoggedUser(callBack) {
  return async () => {
    const updatedUser = await axios.get(`/api/users/my`)
    callBack(updatedUser.data)
  }
}

// ----------------------------------------------------------------------

export function getOverview() {
  return async () => {
    try {
      // [ app classes , referred classes , own client classes , school classes ]
      const resp = await axios.get(`/api/overview/typeSummary`)
      dispatch(slice.actions.getTeacherOverviewSuccess(resp.data.DATA));
    } catch (error) {
      console.error(error)
    }
  }
}

// ----------------------------------------------------------------------

export function getTotalIncome() {
  return async () => {
    try {
      // { VALUE: total}
      const resp = await axios.get(`/api/overview/totalIncome`)
      dispatch(slice.actions.getTeacherOverviewSuccessTotalIncome(resp.data.VALUE));
    } catch (error) {
      console.error(error)
    }
  }
}

// ----------------------------------------------------------------------

export function getTotalClasses() {
  return async () => {
    try {
      const resp = await axios.get(`/api/overview/totalClasses`)
      dispatch(slice.actions.getTeacherOverviewSuccessTotalClasses(resp.data.VALUE));
    } catch (error) {
      console.error(error)
    }
  }
}

// ----------------------------------------------------------------------

export function getTotalClients() {
  return async () => {
    try {
      const resp = await axios.get(`/api/overview/totalClients`)
      dispatch(slice.actions.getTeacherOverviewSuccessTotalClients(resp.data.VALUE));
    } catch (error) {
      console.error(error)
    }
  }
}

// ----------------------------------------------------------------------

export function getTopClients() {
  return async () => {
    try {
      const resp = await axios.get(`/api/overview/topClients`)
      dispatch(slice.actions.getTeacherOverviewSuccessTopClients(resp.data));
    } catch (error) {
      console.error(error)
    }
  }
}

// ----------------------------------------------------------------------

export function getConversations() {
  return async () => {
    try {
      const resp = await axios.get(`/api/conversation/conversations`)
      dispatch(slice.actions.getTeacherOverviewSuccessConversations(resp.data));
    } catch (error) {
      console.error(error)
    }
  }
}

// ----------------------------------------------------------------------

export function sendResetPasswordEmail(email) {
  return async () => {
    try {
      await axios.post(`api/userPersonalDataVerification/changePassword/${email}`)
    } catch (error) {
      console.error(error)
    }
  }
}

export function changePassword(password, repeatPassword, token, callback) {
  return async () => {
    try {
      await axios.put(`api/userPersonalDataVerification/changePassword/${token}`,
       {
         password: password,
         repeatPassword: repeatPassword
       })
       callback()
    } catch (error) {
      console.error(error)
      callback()
    }
  }
}

export function getTeacherByID(userId, callback) {
  return async () => {
    try {
      const resp = await axios.get(`api/users/byId/${userId}`)
      callback(resp.data)
    } catch (error) {
      console.error(error)
    }
  }
}

export function hireTeacher(teacherId, requestedEvents, callback){
  return async () =>{
    try{
      const resp = await axios.post(`api/hire/byId/${teacherId}`, requestedEvents)
      callback(true)
    } catch(e){
      callback(false)
    }
  }
}
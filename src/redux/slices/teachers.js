import { gridColumnLookupSelector } from '@mui/x-data-grid';
import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
import { func, number } from 'prop-types';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  teachers: [],
  teacher: null,
  rates: [],
  product: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
  },
  cakeChart: [0, 0, 0, 0],
  totalClasses: 0,
  totalIncome: 0,
  topClients: [],
  totalClients: 0,
};

const slice = createSlice({
  name: 'teacher',
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
      state.totalClients= action.payload;
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(cart.map((cartItem) => cartItem.price * cartItem.quantity));
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
      const product = action.payload;
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, product];
      } else {
        state.checkout.cart = state.checkout.cart.map((_product) => {
          const isExisted = _product.id === product.id;
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + 1,
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, product], 'id');
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((item) => item.id !== action.payload);

      state.checkout.cart = updateCart;
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
  filterProducts,
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

export function getTeachers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/users/teacher');
      dispatch(slice.actions.getTeachersSuccess(response.data));
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

export function getTeacherWithRates(email) {
  return async () => {
    const ratesRequest = `/api/rate/getRates/${email}`;
    const teacherRequest = `/api/users/${email}`;
    dispatch(slice.actions.startLoading());
    try {
      axios.get(teacherRequest).then(r => {
        const teacher = r.data;
        axios.get(ratesRequest).then(rs => {
          const rates = rs.data;
          const dto = {
            "rates": rates,
            "teacher": teacher
          }
          dispatch(slice.actions.getTeacherWithRatesSuccess(dto));
        })
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
    } catch (error) {
      console.error(error);
    }
  }
}

// ----------------------------------------------------------------------

export function changeProfilePicture(picture) {
  return async () => {
    try {
      const resp = await axios.put(`/api/users/image`, { "editImage": picture })
    } catch (error) {
      console.log(error)
    }
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
    }
  }
}

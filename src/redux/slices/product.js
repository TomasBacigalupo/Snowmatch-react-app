import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { startLoading } from './business';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
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
  success: ""
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    stopLoading(state){
      state.isLoading = false;
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

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    // GET PRODUCT EVENTS
    getProductEventsSuccess(state, action) {
      state.isLoading = false;
      state.product.events = action.payload;
    },

    clearProduct(state) {
      state.product = null
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

    setSuccess(state, message) {
      state.success = message
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
  setSuccess,
  clearProduct,
} = slice.actions;

// ----------------------------------------------------------------------

export function getTeacherProducts(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/product/teacher');
      console.log("response", response)
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTeacherProductsById(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/product/teacher/${id}`);
      console.log("response", response)
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getBusinessProducts(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/product/business' + id);
      console.log("response", response)
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getMyTeacherProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/product/teacher');
      console.log("response", response)
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getMyBusinessProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/product/business');
      console.log("response", response)
      dispatch(slice.actions.getProductsSuccess(response.data));
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
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/product/' + id);
      dispatch(slice.actions.getProductSuccess(response.data));
      console.log(response)
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProductEvents(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/events/product/' + id);
      dispatch(slice.actions.getProductEventsSuccess(response.data));
      console.log(response)
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
    const teacherRequest = `/api/users/teacher/email/${email}`;
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

export function createProduct(productData, isTeacher) {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      let pathExtra = "business"
      if (isTeacher) {
        pathExtra = "teacher"
      }
      console.log(productData)
      const createResponse = await axios.post('/api/product/' + pathExtra, productData)
      console.log(createResponse)
      dispatch(slice.actions.setSuccess("Product created!"))
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  }
}

export function editProduct(productData, isTeacher, productId) {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      let pathExtra = "business"
      if (isTeacher) {
        pathExtra = "teacher"
      }
      const createResponse = await axios.put('/api/product/' + productId + "/" + pathExtra, productData)
      dispatch(slice.actions.setSuccess("Product edited!"))
      dispatch(slice.actions.stopLoading())

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
      dispatch(slice.actions.stopLoading())

    }
  }
}

export function deleteProduct(isTeacher, productId) {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      let pathExtra = "business"
      if (isTeacher) {
        pathExtra = "teacher"
      }
      await axios.delete('/api/product/' + productId + "/" + pathExtra)
      dispatch(slice.actions.setSuccess("Product deleted!"))
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  }
}



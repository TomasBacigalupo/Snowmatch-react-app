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
import { useSelector } from 'react-redux';
import { from } from 'stylis';
import { id } from 'date-fns/locale';
import { on } from 'process';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  openClinicModal: true,
  error: null,
  products: [],
  teachers: [],
  teachersWithEvents: [],
  teacher: null,
  rates: [],
  category: 'standard',
  product: null,
  sortBy: null,
  filters: {
    rating: '',
    gender: [],
    category: [],
    discipline: [],
    language: [],
    from: new Date(),
    to: new Date(new Date().getTime() + (10 * 24 * 60 * 60 * 1000)),
    resort: 'Cerro Catedral',
    level: 5
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
    teacher: {},
    card: {},
    paymentInfo: {}
  },
  cakeChart: [0, 0, 0, 0],
  totalClasses: 0,
  totalIncome: 0,
  topClients: [],
  totalClients: 0,
  conversations: [],
  loadingRate: false,
  dollar: 420
};

const slice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {

    // SET PREMIUM TEACHERS
    setPremiumTeachers(state) {
      state.category = 'premium';
    },

    // SET STANDARD TEACHERS
    setStandardTeachers(state) {
      state.category = 'standard';
    },

    // CLOSE CLINIC MODAL
    closeClinicModal(state) {
      state.openClinicModal = false;

    },

    // change level
    setLevel(state, action) {
      state.filters.level = action.payload;

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

    // GET TEACHERS WITH EVENTS
    getTeachersWithEventsSuccess(state, action) {
      state.isLoading = false;
      state.teachersWithEvents = action.payload.sort((a, b) => b.stars - a.stars);
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
      const events = action.payload;
      const subtotal = sum(events.map((event) => (event.price + event.bookingPrice)));
      const discount = events.length === 0 ? 0 : state.checkout.discount;
      const shipping = events.length === 0 ? 0 : state.checkout.shipping;
      const billing = events.length === 0 ? null : state.checkout.billing;
      const bookingPrice = sum(events.map((event) => event.bookingPrice));

      state.checkout.events = events;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal * 1.03;
      state.checkout.bookingPrice = bookingPrice;
    },

    addCart(state, action) {
      const { teacher, event } = action.payload;
      if (teacher) {
        state.checkout.teacher = teacher;
      }
      // business logic to set price
      state.checkout.cart = [...state.checkout.cart, teacher];
      state.checkout.events = [...state.checkout.events, event];
      state.checkout.total = state.checkout.total + event.price * 1.03
      state.checkout.subtotal = state.checkout.subtotal + event.price;
      state.checkout.bookingPrice = sum(state.checkout.events.map((event) => event.price));
      state.checkout.cart = uniqBy([...state.checkout.cart, teacher], 'id');
    },

    addCard(state, action) {
      const card = action.payload
      state.checkout.card = card
    },

    deleteCart(state, action) {
      //delete by idx
      const updateCart = state.checkout.events.filter((event, idx) => idx !== action.payload)
      //const updateCart = state.checkout.events.filter(event => Number(event.id) !== Number(action.payload));

      state.checkout.events = updateCart;
    },

    cleanCart(state, action) {
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
      console.log(action.payload)
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },

    setPaymentInfo(state, action) {
      state.checkout.paymentInfo = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },

    // SUCCESS RATE
    onRateSuccess(state, action) {
      const { teacherId } = action.payload;
      state.teacher = state.teachers.map(teacher => {
        if (teacherId === teacher.id) {
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
  cleanCart,
  addCard,
  setPaymentInfo,
  resetFilters,
  setPremiumTeachers,
  setStandardTeachers,
  setLevel
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
      const teachers = response.data.map(t => ({
        ...t,
        stars: t.stars ? t.stars : 0
      })).sort((a, b) => b.stars - a.stars);

      dispatch(slice.actions.getTeachersSuccess(teachers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTeachersWithEvents(filters) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/users/teacher/with_filters?start=${filters.from?.toISOString().slice(0, -1) ?? ''}&end=${filters.to?.toISOString().slice(0, -1) ?? ''}&resort=${filters.resort ?? ''}`);
      const teachers = response.data.map(t => ({
        ...t,
        stars: t.stars ? t.stars : 0
      })).sort((a, b) => b.stars - a.stars);
      dispatch(slice.actions.getTeachersWithEventsSuccess(teachers));
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
      const response = await axios.get(`/api/product/${id}`);
      dispatch(slice.actions.getProductSuccess(response.data));
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

export function getTeacherByEmail(email) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/users/${email}`
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

export function getRates(id, teacher) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const ratesResponse = await axios.get(`/api/rate/byId/${id}`);
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
      if (callback)
        callback(resp.data)
    } catch (error) {
      console.error(error)
    }
  }
}

export function hireTeacher(teacherId, requestedEvents, callback) {
  return async () => {
    try {
      const resp = await axios.post(`api/hire/byId/${teacherId}`, requestedEvents)
      callback(true)
    } catch (e) {
      callback(false)
    }
  }
}

export function hireTeacherEvents(events, encryptedCard, card, callback) {
  return async () => {
    try {
      const resp = await axios.post(`api/hire?holderName=${card.name}&holderLastName=${card.name}`, {
        events: events,
        encryptedCardDto: encryptedCard
      })
      callback(resp)
    } catch (e) {
      callback({ status: 500 })
    }
  }
}

export function cancelHireTeacherEvents(requestedEvents, callback) {
  return async () => {
    try {
      const resp = await axios.post(`api/hire/cancelByEvents`, requestedEvents)
      callback(true)
    } catch (e) {
      callback(false)
    }
  }
}

export function startPayment(events, encryptedCard, callBack) {
  return async () => {
    try {
      const resp = await axios.post(`api/pay/startPayment?holderName=Tomas&holderLastName=Bacigalupo`, { events: events, encryptedCardDto: encryptedCard })
      callBack(resp.data)
    } catch (e) {
      callBack(false)
    }
  }
}

export function completePayment(id, zenrisePayment) {
  return async () => {
    try {
      const resp = await axios.put(`api/pay/${id}`, zenrisePayment)
    } catch (e) {
      console.error(e)
    }
  }
}

// get updated dollar value
export function getDollarValue(callback) {
  return async () => {
    try {
      const resp = await axios.get(`/api/currency/exchangeRate?form=USD&to=ARS`)
      callback(resp.data)
    } catch (e) {
      callback(false)
    }
  }
}

export function calculatePrice(product, totalDays, time) {
  const price = product?.price ?? 0;
  let discountedPrice = price;
  if (time === 'FULL_DAY') {
    return discountedPrice * 2;
  }
  return discountedPrice;
}

export function calculateRequestedPrice(teacher, totalDays, time) {
  const level = teacher.level;
  let price = 0;
  if (level === 1) {
    price = 200000;
  }
  if (level === 2) {
    price = 210000;
  }
  if (level === 3) {
    price = 230000;
  }
  if (level === 4) {
    price = 250000;
  }
  if (level === 5) {
    price = 270000;
  }
  if (level === 0) {
    price = 500;
  }
  let discountedPrice = price;
  if (time === 'FULL_DAY') {
    return discountedPrice * 1.95;
  }

  return discountedPrice;
}

export function getComissionByLevel(level, porcentage) {
  if (level === 1) {
    return porcentage ? 30 : 0.3;
  }
  if (level === 2) {
    return porcentage ? 20 : 0.2;
  }
  if (level === 3) {
    return porcentage ? 15 : 0.15;
  }
  if (level === 4) {
    return porcentage ? 10 : 0.1;
  }
  if (level === 5) {
    return porcentage ? 5 : 0.05;
  }
}

export function getPayByLevel(level, porcentage) {
  if (level === 1) {
    return porcentage ? 30 : 0.3;
  }
  if (level === 2) {
    return porcentage ? 20 : 0.2;
  }
  if (level === 3) {
    return porcentage ? 15 : 0.15;
  }
  if (level === 4) {
    return porcentage ? 10 : 0.1;
  }
  if (level === 5) {
    return porcentage ? 5 : 0.05;
  }
}

export function calculateTotalHours(events) {
  let totalHours = 0;

  events.forEach(event => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const duration = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    if (duration > 3) {
      totalHours += 6;
    } else {
      totalHours += duration;
    }

  });

  return totalHours;
}

export function getPayByHoursLevel(level, totalHours) {
  if (level === 1) {
    return totalHours * 20000;
  }
  if (level === 2) {
    return totalHours * 25000;
  }
  if (level === 3) {
    return totalHours * 39600;
  }
  if (level === 4) {
    return totalHours * 54000;
  }
  if (level === 5) {
    return totalHours * 72000;
  }
}

export function calculateDiscount(discountCode, bookingPrice) {
  if (discountCode === 'ELBLOGDESKI') {
    dispatch(slice.actions.applyDiscount(bookingPrice * 0.15))
  }
  if (discountCode === 'GURURIDE') {
    dispatch(slice.actions.applyDiscount(bookingPrice * 0.15))
  }
  if (discountCode === 'JOSE15') {
    dispatch(slice.actions.applyDiscount(bookingPrice * 0.15))
  }
  if (discountCode === 'RESIDENTE') {
    dispatch(slice.actions.applyDiscount(bookingPrice * 0.15))
  }
  if (discountCode === 'MATCH10') {
    dispatch(slice.actions.applyDiscount(bookingPrice * 0.10))
  }
}

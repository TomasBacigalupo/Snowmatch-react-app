import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const initialState = {
  items: [],
  deliveryDate: null,
  pickupDate: null,
  deliveryTime: null,
  location: '',
  adults: 1,
  kids: 0,
  deliveryAddress: null,
  riders: [],
  upsells: [],
};

const RentalCartContext = createContext();

// ----------------------------------------------------------------------

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      return {
        ...state,
        deliveryDate: action.payload.deliveryDate,
        pickupDate: action.payload.pickupDate,
        deliveryTime: action.payload.deliveryTime,
        location: action.payload.location,
        adults: action.payload.adults || 1,
        kids: action.payload.kids || 0,
      };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.bootSize === action.payload.bootSize
      );
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.payload),
      };
    
    case 'UPDATE_ITEM_QUANTITY':
      const updatedItems = state.items.map((item, index) =>
        index === action.payload.index
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: updatedItems };
    
    case 'SET_DELIVERY_ADDRESS':
      return {
        ...state,
        deliveryAddress: action.payload,
      };
    
    case 'SET_RIDERS':
      return {
        ...state,
        riders: action.payload,
      };
    
    case 'ADD_UPSELL':
      return {
        ...state,
        upsells: [...state.upsells, action.payload],
      };
    
    case 'REMOVE_UPSELL':
      return {
        ...state,
        upsells: state.upsells.filter(item => item.id !== action.payload),
      };
    
    case 'CLEAR_CART':
      return {
        ...initialState,
        deliveryDate: state.deliveryDate,
        pickupDate: state.pickupDate,
        deliveryTime: state.deliveryTime,
        location: state.location,
        adults: state.adults,
        kids: state.kids,
      };
    
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

export function RentalCartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rentalCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        Object.keys(parsedCart).forEach(key => {
          if (parsedCart[key] !== null && parsedCart[key] !== undefined) {
            dispatch({ type: 'SET_SEARCH_PARAMS', payload: { [key]: parsedCart[key] } });
          }
        });
        if (parsedCart.items) {
          parsedCart.items.forEach(item => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        }
        if (parsedCart.upsells) {
          parsedCart.upsells.forEach(upsell => {
            dispatch({ type: 'ADD_UPSELL', payload: upsell });
          });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rentalCart', JSON.stringify(state));
  }, [state]);

  const value = {
    ...state,
    dispatch,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (index) => dispatch({ type: 'REMOVE_ITEM', payload: index }),
    updateItemQuantity: (index, quantity) => 
      dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { index, quantity } }),
    setSearchParams: (params) => dispatch({ type: 'SET_SEARCH_PARAMS', payload: params }),
    setDeliveryAddress: (address) => dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: address }),
    setRiders: (riders) => dispatch({ type: 'SET_RIDERS', payload: riders }),
    addUpsell: (upsell) => dispatch({ type: 'ADD_UPSELL', payload: upsell }),
    removeUpsell: (id) => dispatch({ type: 'REMOVE_UPSELL', payload: id }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    getTotal: () => {
      const itemsTotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const upsellsTotal = state.upsells.reduce((sum, upsell) => sum + upsell.price, 0);
      return itemsTotal + upsellsTotal;
    },
    getItemsCount: () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    getDaysCount: () => {
      if (!state.deliveryDate || !state.pickupDate) return 0;
      const diffTime = Math.abs(new Date(state.pickupDate) - new Date(state.deliveryDate));
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
  };

  return (
    <RentalCartContext.Provider value={value}>
      {children}
    </RentalCartContext.Provider>
  );
}

RentalCartProvider.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

export const useRentalCart = () => {
  const context = useContext(RentalCartContext);
  if (!context) {
    throw new Error('useRentalCart must be used within a RentalCartProvider');
  }
  return context;
}; 
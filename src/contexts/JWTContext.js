import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import jwtDecode from 'jwt-decode';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  isAuthorized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, isAuthorized } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      isAuthorized,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
      isAuthorized: user.state != 'UNDER_REVIEW'
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    isAuthorized: false
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
      isAuthorized: user.state != 'UNDER_REVIEW'
    };
  },
  VERIFY: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      isAuthorized: user.state != 'UNDER_REVIEW',
      isInitialized: true,
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verify: () => Promise.resolve(),
  testVerification: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const email = jwtDecode(accessToken).sub;
          const response = await axios.get(`/api/users/${email}`);
          const user  = response.data;
          if(!user?.emailVerified){
            dispatch({
              type: 'VERIFY',
              payload: {
                isAuthenticated: true,
                user,
                isAuthorized: false,
                isInitialized: true,

              },
            });
          }else{
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                isAuthorized: true,
                user,
              },
            });
          }
        } else {
          console.log("FAILED")
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username, password) => {
    const response = await axios.post('/api/login', {
      "username": username,
      "password": password,
    });
    const accessToken = response.data.password;
    const responseUser = await axios.get(`/api/users/${username}`)
    const user = responseUser.data;

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const register = async (email, password, firstName, lastName, certificate) => {
    const response = await axios.post('/api/users/create', {
      "email": email,
      "password": password,
      "name": firstName,
      "lastname": lastName,
      "createImage": certificate,
      "role": "TEACHER"
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
        isAuthorized: false,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const verify = async (token) =>{
    //TODO really verify token with BE
    if(token === "123456"){
      dispatch({type: 'VERIFY'})
    }
  }
  const testVerification = async () => {
    const response = await axios.get(`/api/users/${state.user.email}`);
    const user  = response.data;
    if(user.emailVerified){
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: true,
          isAuthorized: user.state != 'UNDER_REVIEW',
          emailVerified: true,
          user,
        },
      });
    }else{
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: true,
          isAuthorized: user.state != 'UNDER_REVIEW',
          emailVerified: false,
          user,
        },
      });
    }
  
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        verify,
        testVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

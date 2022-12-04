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
  emailVerified: false,
  phoneVerified: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, isAuthorized, emailVerified } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      isAuthorized,
      user,
      emailVerified: user?.emailVerified,
      phoneVerified: user?.cellphoneVerified
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
      isAuthorized: user.state != 'UNDER_REVIEW',
      emailVerified: user.emailVerified,
      phoneVerified: user?.cellphoneVerified
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
      isAuthorized: user.state != 'UNDER_REVIEW',
      emailVerified: user.emailVerified,
      phoneVerified: user.cellphoneVerified
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
      emailVerified: user.emailVerified,
      phoneVerified: user?.cellphoneVerified
    };
  },
  UPDATE: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      user,
    };
  },
  REFRESH: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      user,
    };
  },
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
  updateUser: () => Promise.resolve(),
  refreshUser: () => { }
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
          const response = await axios.get(`/api/users/auth/${email}`);
          const user = response.data;
          if (!user?.emailVerified) {
            dispatch({
              type: 'VERIFY',
              payload: {
                isAuthenticated: true,
                user,
                isAuthorized: false,
                isInitialized: true,
                emailVerified: true,
                phoneVerified: user?.cellphoneVerified
              },
            });
          } else {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                isAuthorized: true,
                user,
                phoneVerified: user?.cellphoneVerified
              },
            });
          }
        } else {
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
    const responseUser = await axios.get(`/api/users/auth/${username}`)
    const user = responseUser.data;

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const register = async (email, password, firstName, lastName, countryCode, phone, file) => {
    const response = await axios.post('/api/users/create', {
      "email": email,
      "password": password,
      "name": firstName,
      "lastname": lastName,
      "countryCode": countryCode,
      "cellphone": phone,
      "role": "TEACHER"
    });
    const user = response.data;
    const accessToken = user.token;
    setSession(accessToken);
    window.localStorage.setItem('accessToken', accessToken);
    const signedUrl = await axios.get('/api/images/preSignedUrlCertificateImage')
    await fetch(signedUrl.data, {
      method: 'PUT',
      headers: {
        "Content-Type": file.type,
      },
      body: file
    });
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
        isAuthenticated: true
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const verify = async (token) => {
    //TODO really verify token with BE
    if (token === "123456") {
      dispatch({ type: 'VERIFY' })
    }
  }

  const updateUser = async (values) => {
    const user = values;
    dispatch({ type: 'UPDATE', payload: { user } })
  };

  const refreshUser = (user) => {
    dispatch({ type: 'REFRESH', payload: { user } })
  }

  const testVerification = async (callBackFailed) => {
    const response = await axios.get(`/api/users/auth/${state.user.email}`);
    const user = response.data;
    if (user.emailVerified || user.cellphoneVerified) {

      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: true,
          isAuthorized: user.state != 'UNDER_REVIEW',
          emailVerified: true,
          user,
        },
      });
    } else {
      callBackFailed()
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
        updateUser,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

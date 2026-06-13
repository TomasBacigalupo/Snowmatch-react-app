import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import jwtDecode from 'jwt-decode';

// ----------------------------------------------------------------------

function parseJwtPayload(token) {
  try {
    const part = token.split('.')[1];
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return JSON.parse(atob(padded));
  } catch (e) {
    return {};
  }
}

function loadGsiScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      const done = () => {
        if (window.google?.accounts?.id) resolve();
        else reject(new Error('Google Sign-In failed to initialize'));
      };
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener('load', done);
      existing.addEventListener('error', () => reject(new Error('GSI load failed')));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(s);
  });
}

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  isAuthorized: false,
  emailVerified: false,
  phoneVerified: false,
  user: null,
  isTeacher: false,
  isStudent: false,
  isResortAdmin: false
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
      phoneVerified: user?.cellphoneVerification,
      isTeacher: user?.role === 'TEACHER',
      isStudent: user?.role === 'STUDENT',
      isAdmin: user?.role === 'ADMIN',
      isResortAdmin: user?.role === 'RESORT_ADMIN',
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
      phoneVerified: user?.cellphoneVerified,
      isTeacher: user?.role === 'TEACHER',
      isStudent: user?.role === 'STUDENT',
      isAdmin: user?.role === 'ADMIN',
      isResortAdmin: user?.role === 'RESORT_ADMIN',
    };
  },
  ADDTOPREMIUM: (state) => ({
    ...state,
    user: {
      ...state.user,
      premiumExpiration: "2028-02-20"
    }
  }),
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    isAuthorized: false,
    isTeacher: false,
    isStudent: false,
    isAdmin: false,
    isResortAdmin: false,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;
    
    const newState = {
      ...state,
      isAuthenticated: true,
      user,
      isAuthorized: user.state != 'UNDER_REVIEW',
      emailVerified: user?.emailVerified,
      phoneVerified: user?.cellphoneVerified,
      isTeacher: user?.role === 'TEACHER',
      isStudent: user?.role === 'STUDENT',
      isAdmin: user?.role === 'ADMIN',
      isResortAdmin: user?.role === 'RESORT_ADMIN',
    };
    
    console.log('REGISTER reducer:', { 
      user, 
      emailVerified: user?.emailVerified, 
      phoneVerified: user?.cellphoneVerified,
      newState: { emailVerified: newState.emailVerified, phoneVerified: newState.phoneVerified }
    });
    
    return newState;
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
      phoneVerified: user?.cellphoneVerification,
      isTeacher: user?.role === 'TEACHER',
      isStudent: user?.role === 'STUDENT',
      isAdmin: user?.role === 'ADMIN',
      isResortAdmin: user?.role === 'RESORT_ADMIN',
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
  refreshUser: () => { },
  addToPremium: () => Promise.resolve(),
  deleteAccount: () => Promise.resolve(),
  loginWithApple: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve()
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
          if (user?.emailVerified || user?.cellphoneVerification) {
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
                phoneVerified: user?.cellphoneVerified,
                emailVerified: user?.emailVerified,
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


  const registerNotifications = async () => {
    try {
      if (typeof Notification === 'undefined') return;
      await Notification.requestPermission();
    } catch (e) {
      console.warn('Notifications not registered:', e);
    }
  };

  const login = async (username, password) => {
    const response = await axios.post('/api/login', {
      "username": username.toLowerCase(),
      "password": password,
    });
    const accessToken = response.data.password;
    const responseUser = await axios.get(`/api/users/auth/${username}`)
    const user = responseUser.data;

    registerNotifications();

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const deleteAccount = async () => {
    axios.delete('/api/users/deleteAccount');
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, password, firstName, lastName, countryCode, phone, entity, file, role = 'TEACHER') => {
    const response = await axios.post('/api/users/create', {
      "email": email,
      "password": password,
      "name": firstName,
      "lastname": lastName,
      "countryCode": countryCode,
      "cellphone": phone,
      "role": role
    });
    const user = response.data;
    const accessToken = user.token;
    setSession(accessToken);
    window.localStorage.setItem('accessToken', accessToken);
    if (role !== 'STUDENT') {
      const signedUrl = await axios.get(`/api/images/preSignedUrlImage/${entity}`)
      await fetch(signedUrl.data, {
        method: 'PUT',
        headers: {
          "Content-Type": file.type,
        },
        body: file
      });
    }
    registerNotifications();
    console.log('Register: User created', { user, emailVerified: user?.emailVerified, phoneVerified: user?.cellphoneVerified });
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

  const addToPremium = async () => {
    dispatch({ type: 'ADDTOPREMIUM' });
  }

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

  const testVerification = async (callBack) => {
    const response = await axios.get(`/api/users/auth/${state.user.email}`);
    const user = response.data;
    if (user.emailVerified || user.cellphoneVerification) {
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: true,
          isAuthorized: user.state != 'UNDER_REVIEW',
          emailVerified: true,
          phoneVerified: true,
          cellphoneVerification: user.cellphoneVerification,
          user,
        },
      });
      callBack(true)
    } else {
      callBack(false)
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

  const loginWithApple = async () => {
    console.warn('Apple Sign-In is not available in the browser build.');
    throw new Error('Apple sign-in is not available in the browser. Please use email or Google.');
  };

  const loginWithGoogle = async () => {
    const clientId =
      process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID ||
      '864910142009-d8jai0985rn4b13jge8ng0gmf0hjejfp.apps.googleusercontent.com';

    await loadGsiScript();

    return new Promise((resolve, reject) => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      let settled = false;
      const finish = (fn) => {
        if (settled) return;
        settled = true;
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
        fn();
      };

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (credentialResponse) => {
          try {
            const idToken = credentialResponse.credential;
            const payload = parseJwtPayload(idToken);
            const firstName = payload.given_name || '';
            const lastName = payload.family_name || '';
            const email = payload.email || '';
            const displayName = payload.name || '';

            let extractedFirstName = firstName;
            let extractedLastName = lastName;
            if (!firstName && !lastName && displayName) {
              const nameParts = displayName.split(' ');
              if (nameParts.length >= 2) {
                extractedFirstName = nameParts[0];
                extractedLastName = nameParts.slice(1).join(' ');
              } else if (nameParts.length === 1) {
                extractedFirstName = nameParts[0];
              }
            }

            const response = await axios.post('/api/auth/google/login', {
              idToken,
              firstName: extractedFirstName,
              lastName: extractedLastName,
              email,
              displayName,
            });

            const user = response.data;
            const accessToken = user.token;
            setSession(accessToken);
            window.localStorage.setItem('accessToken', accessToken);
            await registerNotifications();
            dispatch({
              type: 'REGISTER',
              payload: {
                user,
                isAuthenticated: true,
              },
            });
            finish(() => resolve());
          } catch (err) {
            finish(() => reject(err));
          }
        },
      });

      window.google.accounts.id.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: 320,
      });

      const btn = container.querySelector('div[role="button"]');
      if (btn) {
        btn.click();
      } else {
        finish(() => reject(new Error('Google Sign-In could not be started.')));
      }

      setTimeout(() => {
        if (!settled) {
          finish(() => reject(new Error('Google sign-in timed out or was closed.')));
        }
      }, 120000);
    });
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
        refreshUser,
        addToPremium,
        deleteAccount,
        loginWithApple,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

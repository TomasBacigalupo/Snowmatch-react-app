import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import jwtDecode from 'jwt-decode';
import { PushNotifications } from '@capacitor/push-notifications';


// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  isAuthorized: false,
  emailVerified: false,
  phoneVerified: false,
  user: null,
  isTeacher: false,
  isStudent: false
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
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      isAuthorized: user.state != 'UNDER_REVIEW',
      emailVerified: user?.emailVerified,
      phoneVerified: user?.cellphoneVerified,
      isTeacher: user?.role === 'TEACHER',
      isStudent: user?.role === 'STUDENT',
      isAdmin: user?.role === 'ADMIN',
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
      phoneVerified: user?.cellphoneVerification,
      isTeacher: user?.role === 'TEACHER',
      isStudent: user?.role === 'STUDENT',
      isAdmin: user?.role === 'ADMIN',
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

    await PushNotifications.addListener('registration', token => {

      axios.post(`/api/users/notificationTokens/${token.value}`)

      console.info('Registration token: ', token.value);
    });

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

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
    try {
      console.log('loginWithApple');
      const appleSignInPlugin = await import('@capacitor-community/apple-sign-in');
      const { SignInWithApple } = appleSignInPlugin;
      const options = {
        clientId: 'pro.snowmatch',
        redirectURI: '',
        scopes: 'email name',
        state: '12345', // Ensure this is a dynamically generated state for production
        nonce: 'nonce', // Ensure this is a securely generated nonce for production
      };

      const signin = await SignInWithApple.authorize(options);
      console.log('Apple login successeeeee', signin.response.identityToken);

      // Extraer información adicional del usuario de Apple si está disponible
      const userInfo = signin.response.user || {};
      const firstName = userInfo.name?.firstName || '';
      const lastName = userInfo.name?.lastName || '';
      const email = userInfo.email || '';

      const response = await axios.post('/api/auth/apple/login', {
        "idToken": signin.response.identityToken,
        "firstName": firstName,
        "lastName": lastName,
        "email": email
      });

      const user = response.data;
      const accessToken = user.token;
      setSession(accessToken);
      window.localStorage.setItem('accessToken', accessToken);
      registerNotifications();
      dispatch({
        type: 'REGISTER',
        payload: {
          user,
          isAuthenticated: true
        },
      });
    }
    catch (e) {
      console.log("error", e)
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { SocialLogin } = await import('@capgo/capacitor-social-login');
      const { Capacitor } = await import('@capacitor/core');

      let options = {};
      options = {
        google: {
          iOSClientId: '864910142009-d8jai0985rn4b13jge8ng0gmf0hjejfp.apps.googleusercontent.com',
          iOSServerClientId: '864910142009-d8jai0985rn4b13jge8ng0gmf0hjejfp.apps.googleusercontent.com',
          iOSUrlScheme: 'com.googleusercontent.apps.864910142009-d8jai0985rn4b13jge8ng0gmf0hjejfp',
          // mode: 'offline',
        },
      };

      await SocialLogin.initialize(options);
      await SocialLogin.logout({ provider: 'google' }); // limpia la sesión anterior

      const result = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
          forceRefreshToken: true
        }
      });

      console.log('Google login result:', result);

      const idToken = result?.result?.idToken;
      const firstName = result?.result?.firstName || result?.result?.givenName || '';
      const lastName = result?.result?.lastName || result?.result?.familyName || '';
      const email = result?.result?.email || '';
      const displayName = result?.result?.displayName || '';

      // Si no tenemos firstName y lastName, intentamos extraerlos del displayName
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

      if (idToken) {
        const response = await axios.post('/api/auth/google/login', {
          "idToken": idToken,
          "firstName": extractedFirstName,
          "lastName": extractedLastName,
          "email": email,
          "displayName": displayName
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
            isAuthenticated: true
          },
        });
      } else {
        throw new Error('No ID token returned from Google login.');
      }

    } catch (error) {
      console.error('Google login error:', error);
      throw error;
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

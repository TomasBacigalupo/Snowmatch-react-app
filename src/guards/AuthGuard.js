import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/auth/Login';
// components
import LoadingScreen from '../components/LoadingScreen';
import  PageVerify  from 'src/pages/PageVerify';
import PageVerifyEmail from 'src/pages/PageVerifyWhatsApp';
import PageVerifyWhatsApp from 'src/pages/PageVerifyWhatsApp';
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized, emailVerified, phoneVerified } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // if(isAuthenticated && !emailVerified){
  //   if (pathname !== requestedLocation) {
  //    setRequestedLocation(pathname);
  //   }
  //   return <PageVerify/>;
  // }

  if (isAuthenticated && !phoneVerified) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <PageVerifyWhatsApp />;
  }

  if (!isAuthenticated) {
    
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}

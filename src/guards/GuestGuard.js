import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isAuthorized } = useAuth();

  if (isAuthenticated && isAuthorized ) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }
  if (isAuthenticated && !isAuthorized ) {
    return <Navigate to={PATH_AUTH.verify} />;
  }

  return <>{children}</>;
}

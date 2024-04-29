import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'src/redux/store';
import { setRequestedRoute } from 'src/redux/slices/config';
import { Navigate } from 'react-router';
import { useSnackbar } from 'notistack';
import AccessDenied from 'src/pages/AccessDenied';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

const useCurrentRole = () => {
  const { user } = useAuth()
  const role = user?.role ? user.role : 'GUEST';
  return role;
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { isAuthenticated, isStudent, isTeacher } = useAuth()
  const currentRole = useCurrentRole();
  const dispatch = useDispatch()
  const { requestedRoute } = useSelector (state => state.config)
  const {enqueueSnackbar} = useSnackbar()

  if (isAuthenticated && requestedRoute !== null) {
    const to = requestedRoute
    dispatch(setRequestedRoute(null))
    return <Navigate to={to} />
  }

  

  if (!accessibleRoles.includes(currentRole)) { 
    enqueueSnackbar('You should not be here', { variant: 'error' })
    if (isStudent) {
      return <Navigate to={'/'} />
    }
    if (isTeacher) {
      return <Navigate to={'/dashboard'} />
    }
    return <Navigate to={'/access-denied'} />
  }

  return <>{children}</>;
}

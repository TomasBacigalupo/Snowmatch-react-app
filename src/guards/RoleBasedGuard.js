import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'src/redux/store';
import { setRequestedRoute } from 'src/redux/slices/config';
import { Navigate } from 'react-router';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

const useCurrentRole = () => {
  const { user } = useAuth()
  console.log({user})
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
    if (isStudent) {
      enqueueSnackbar('You should not be here', { variant: 'error' })
      return <Navigate to={'/'} />
    }

    if (isTeacher) {
      enqueueSnackbar('You should not be here', { variant: 'error' })
      return <Navigate to={'/dashboard'} />
    }
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}

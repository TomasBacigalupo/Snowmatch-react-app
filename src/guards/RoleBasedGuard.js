import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'src/redux/store';
import { setRequestedRoute } from 'src/redux/slices/config';
import { Navigate } from 'react-router';
import { useSnackbar } from 'notistack';
import AccessDenied from 'src/pages/AccessDenied';
import { PATH_AUTH } from 'src/routes/paths';

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
  const { isAuthenticated, isStudent, isTeacher, isAdmin, user } = useAuth()
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
    // enqueueSnackbar('You should not be here', { variant: 'error' })
    if (isStudent) {
      return <Navigate to={'/'} />
    }

    if (isTeacher) {
      // Check if teacher has empty resorts and redirect to teacher details stepper
      if (user && !user.resorts && (!user.resorts || user.resorts.length === 0)) {
        return <Navigate to={PATH_AUTH.teacherDetails} />
      }
      return <Navigate to={'/dashboard'} />
    }
    if (isAdmin) {
      return <Navigate to={'/dashboard/admin/bookings'} />
    }
    return <Navigate to={'/access-denied'} />
  }

  if (isTeacher) {
    // Check if teacher has all required information fields
    const hasRequiredInfo = user && 
      user.information && 
      user.description && 
      user.sports && user.sports.length > 0 &&
      user.languages && user.languages.length > 0 &&
      user.resorts && user.resorts.length > 0;
    
    if (!hasRequiredInfo) {
      return <Navigate to={PATH_AUTH.teacherDetails} />
    }
  }

  if (isStudent) {
    // Check if student has all required information fields
    const hasRequiredInfo = user && 
      user.studentLevel && 
      user.studentGoal && 
      user.sports && user.sports.length > 0 &&
      user.resortsEnum && user.resortsEnum.length > 0 &&
      user.howToLearn;
    
    if (!hasRequiredInfo) {
      return <Navigate to={PATH_AUTH.guestDetails} />
    }
  }

  return <>{children}</>;
}

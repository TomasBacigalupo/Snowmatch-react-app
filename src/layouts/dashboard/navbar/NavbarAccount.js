import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import MyAvatar from '../../../components/MyAvatar';
import {
  CERRO_BAYO_LOGO,
  isCerroBayoResortAdmin,
  isResortAdminNavLoading,
} from '../../../utils/resortAdminBranding';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const LogoStyle = styled('img')(({ theme }) => ({
  width: 400,
  maxWidth: '100%',
  alignSelf: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  ...(theme.palette.mode === 'light' && {
    filter: 'none',
  }),
}));

const CerroBayoLogoStyle = styled('img')({
  width: 205,
  maxWidth: '100%',
  height: 'auto',
  alignSelf: 'center',
});

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  const { user, isInitialized } = useAuth();
  const navLoading = isResortAdminNavLoading({ isInitialized, user });
  const showCerroBayoLogo = isCerroBayoResortAdmin(user);

  if (showCerroBayoLogo) {
    return (
      <Link underline="none" color="inherit" component={RouterLink} to={PATH_DASHBOARD.user.account}>
        <CerroBayoLogoStyle src={CERRO_BAYO_LOGO} alt="Cerro Bayo Ski Boutique" />
      </Link>
    );
  }

  if (navLoading) {
    return (
      <Link underline="none" color="inherit" component={RouterLink} to={PATH_DASHBOARD.user.account}>
        <LogoStyle src="/logo/snowmatch.png" alt="Snowmatch Logo" />
      </Link>
    );
  }

  return (
    <Link underline="none" color="inherit" component={RouterLink} to={PATH_DASHBOARD.user.account}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <MyAvatar />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {user?.role === 'TEACHER' ? 'PRO' : ''}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}

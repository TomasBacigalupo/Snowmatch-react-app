import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    linkTo: PATH_DASHBOARD.user.profile,
  },
  {
    label: 'Settings',
    linkTo: PATH_DASHBOARD.user.account,
  },
];

const GUEST_MENU_OPTIONS = [
  {
    label: 'SignUpAsAPRO',
    linkTo: '/auth/register',
  },
  {
    label: 'SignUpAsAGuest',
    linkTo: '/auth/guest-register',
  },
  {
    label: 'LogIn',
    linkTo: '/auth/login',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);
  const {translate} = useLocales()

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {!isAuthenticated && <AccountCircleIcon sx={{ fontSize: 40 }}/>}
        {isAuthenticated &&<MyAvatar />}
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        {isAuthenticated &&(<><Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} /></>)}

        {isAuthenticated && <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {translate("accountPopover." + option.label)}
            </MenuItem>
          ))}
        </Stack>}
        {!isAuthenticated && <Stack sx={{ p: 1 }}>
          {GUEST_MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              { translate("accountPopover." + option.label)}
            </MenuItem>
          ))}
        </Stack>}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {isAuthenticated &&
          <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          { translate("accountPopover.logOut")}
          </MenuItem>
        }
        {!isAuthenticated &&
          <MenuItem  sx={{ m: 1 }} onClick={()=>{
            window.location.href = 'https://instagram.com/snow.match'
          }}>
          {translate("accountPopover.help")}
          </MenuItem>
        }
      </MenuPopover>
    </>
  );
}

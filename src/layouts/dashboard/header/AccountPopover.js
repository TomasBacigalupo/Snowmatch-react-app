import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme, } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Drawer, TextField, Button, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH, PATH_GUEST } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useLocales from 'src/hooks/useLocales';
import { InAppBrowser } from '@capacitor/inappbrowser';
import { Dialog } from '@capacitor/dialog';
import { dispatch } from 'src/redux/store';
import { updateUserPhoneAndName } from 'src/redux/slices/teachers';
import Iconify from 'src/components/Iconify';
// icons
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HelpIcon from '@mui/icons-material/Help';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    linkTo: PATH_DASHBOARD.user.profile,
  },
  {
    label: 'Lessons',
    linkTo: PATH_DASHBOARD.user.lessons,
  },
  {
    label: 'Settings',
    linkTo: PATH_DASHBOARD.user.account,
  },
];

const STUDENT_OPTIONS = [
  {
    label: 'Lessons',
    linkTo: PATH_GUEST.root + '/lessons',
  },
];

const GUEST_MENU_OPTIONS = [
  {
    label: 'SignUpAsAPRO',
    linkTo: '/auth/register',
  },
  {
    label: 'LogIn',
    linkTo: '/auth/login',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout, isAuthenticated, isStudent, isTeacher, deleteAccount, refreshUser } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(null);
  const { translate } = useLocales()
  const [openContactDrawer, setOpenContactDrawer] = useState(false);
  const [name, setName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.lastname ? user.lastname : user?.name?.split(' ')[1] || '');
  const [phone, setPhone] = useState(user?.cellphone || '');

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

  const handleDeleteAccount = async () => {
    const { value } = await Dialog.confirm({
      title: 'Eliminar cuenta',
      message: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      okButtonTitle: 'Eliminar',
      cancelButtonTitle: 'Cancelar',
    });
  
    if (value) {
      deleteAccount();
    }
  };

  const renderMenuItems = () => (
    <>
      {isAuthenticated && (
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>
      )}

      {isAuthenticated && <Divider sx={{ borderStyle: 'dashed' }} />}

      {isTeacher && (
        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem 
              key={option.label} 
              to={option.linkTo} 
              component={RouterLink} 
              onClick={handleClose}
              sx={{ py: 1.5 }}
            >
              {option.label === 'Profile' && <PersonIcon sx={{ mr: 2 }} />}
              {option.label === 'Lessons' && <CalendarMonthIcon sx={{ mr: 2 }} />}
              {option.label === 'Settings' && <SettingsIcon sx={{ mr: 2 }} />}
              {translate("accountPopover." + option.label)}
            </MenuItem>
          ))}
        </Stack>
      )}

      {isStudent && (
        <Stack sx={{ p: 1 }}>
          {STUDENT_OPTIONS.map((option) => (
            <MenuItem 
              key={option.label} 
              to={option.linkTo} 
              component={RouterLink} 
              onClick={handleClose}
              sx={{ py: 1.5 }}
            >
              <CalendarMonthIcon sx={{ mr: 2 }} />
              {translate("accountPopover." + option.label)}
            </MenuItem>
          ))}
          <MenuItem 
            onClick={() => {
              setOpenContactDrawer(true);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ContactPhoneIcon sx={{ mr: 2 }} />
            {translate("accountPopover.contactInfo")}
          </MenuItem>
        </Stack>
      )}

      {!isAuthenticated && (
        <Stack sx={{ p: 1 }}>
          {GUEST_MENU_OPTIONS.map((option) => (
            <MenuItem 
              key={option.label} 
              to={option.linkTo} 
              component={RouterLink} 
              onClick={handleClose}
              sx={{ py: 1.5 }}
            >
              {option.label === 'SignUpAsAPRO' && <PersonAddIcon sx={{ mr: 2 }} />}
              {option.label === 'LogIn' && <LoginIcon sx={{ mr: 2 }} />}
              {translate("accountPopover." + option.label)}
            </MenuItem>
          ))}
        </Stack>
      )}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {isAuthenticated && (
        <MenuItem 
          onClick={handleLogout} 
          sx={{ m: 1, py: 1.5 }}
        >
          <LogoutIcon sx={{ mr: 2 }} />
          {translate("accountPopover.logOut")}
        </MenuItem>
      )}

      {isAuthenticated && (
        <MenuItem 
          onClick={handleDeleteAccount}
          sx={{ m: 1, color: 'error.main', py: 1.5 }}
        >
          <DeleteForeverIcon sx={{ mr: 2 }} />
          {translate("accountPopover.deleteAccount")}
        </MenuItem>
      )}

      {!isAuthenticated && (
        <MenuItem 
          sx={{ m: 1, py: 1.5 }} 
          onClick={async () => {
            await InAppBrowser.openInWebView({
              url: "https://blog.snowmatch.pro/soporte/"
            });
            handleClose();
          }}
        >
          <HelpIcon sx={{ mr: 2 }} />
          {translate("accountPopover.help")}
        </MenuItem>
      )}
    </>
  );

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && !isMobile && {
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
        {!isAuthenticated && <AccountCircleIcon sx={{ fontSize: 30 }} />}
        {isAuthenticated && <MyAvatar />}
      </IconButtonAnimate>

      {isMobile ? (
        <Drawer
          anchor="top"
          open={Boolean(open)}
          onClose={handleClose}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: '100%',
              height: 'auto',
              maxHeight: '94%',
              paddingBottom: 0.5,
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              paddingTop: 'env(safe-area-inset-top)',
              paddingX: 1,
            }
          }}
        >
          {renderMenuItems()}
          <Box 
            sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center',
              paddingBottom: 0.5
            }}
          >
            <IconButton 
              onClick={handleClose}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.08),
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.15),
                }
              }}
            >
              <Iconify icon={'eva:arrow-up-fill'} width={20} height={20} />
            </IconButton>
          </Box>
        </Drawer>
      ) : (
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
          {renderMenuItems()}
        </MenuPopover>
      )}

      <Drawer
        anchor="bottom"
        open={openContactDrawer}
        onClose={() => setOpenContactDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '100%',
            height: 'auto',
            maxHeight: '94%',
            paddingBottom: 2,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            paddingTop: 1,
            paddingX: 1,
          }
        }}
      >
        <Box mt={1} flex justifyContent='center' width='100%'>
          <IconButton onClick={() => setOpenContactDrawer(false)}>
            <Iconify icon={'line-md:close-circle'} width={25} height={25} />
          </IconButton>
        </Box>

        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {translate("accountPopover.contactInfo")}
          </Typography>
          <TextField
            name='fn'
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)} 
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            name='ln'
            label="Apellido"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            name='phone'
            label="Teléfono"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          />
          <Button 
            onClick={() => {
              dispatch(updateUserPhoneAndName(phone, `${name} ${lastName}`, () => {
                refreshUser({...user, name: `${name} ${lastName}`})
                setOpenContactDrawer(false);
              }))
            }}
            variant="contained"
            fullWidth
          >
            Continuar
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

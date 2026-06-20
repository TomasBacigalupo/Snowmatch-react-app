import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Drawer, IconButton, MenuItem } from '@mui/material';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useLocales from '../../../hooks/useLocales';
// components
import MenuPopover from '../../../components/MenuPopover';
import Iconify from '../../../components/Iconify';
// icons
import LogoutIcon from '@mui/icons-material/Logout';

// ----------------------------------------------------------------------

ResortAdminAccountPopover.propTypes = {
  logoHeight: PropTypes.number,
  sx: PropTypes.object,
  popoverAbove: PropTypes.bool,
};

export default function ResortAdminAccountPopover({ logoHeight = 32, sx, popoverAbove = false }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const [open, setOpen] = useState(null);

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

  const renderMenuItems = () => (
    <MenuItem onClick={handleLogout} sx={{ m: 1, py: 1.5 }}>
      <LogoutIcon sx={{ mr: 2 }} />
      {translate('accountPopover.logOut')}
    </MenuItem>
  );

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0.5,
          borderRadius: 1,
          ...(open && !isMobile && {
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }),
          ...sx,
        }}
      >
        <Box
          component="img"
          src="/logo/snowmatch.png"
          alt="Snowmatch Logo"
          sx={{ height: logoHeight, width: 'auto', display: 'block' }}
        />
      </IconButton>

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
            },
          }}
        >
          {renderMenuItems()}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: 0.5,
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
                },
              }}
            >
              <Iconify icon="eva:arrow-up-fill" width={20} height={20} />
            </IconButton>
          </Box>
        </Drawer>
      ) : (
        <MenuPopover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: popoverAbove ? 'top' : 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: popoverAbove ? 'bottom' : 'top',
            horizontal: 'right',
          }}
          sx={{
            p: 0,
            ...(popoverAbove ? { mb: 1.5 } : { mt: 1.5 }),
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
    </>
  );
}

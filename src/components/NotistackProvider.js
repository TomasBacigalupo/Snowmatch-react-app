import PropTypes from 'prop-types';
import { SnackbarProvider, useSnackbar } from 'notistack';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, GlobalStyles } from '@mui/material';
//
import Iconify from './Iconify';
import { IconButtonAnimate } from './animate';

// ----------------------------------------------------------------------

function SnackbarStyles() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <GlobalStyles
      styles={{
        '#root': {
          '& .SnackbarContent-root': {
            width: '100%',
            padding: theme.spacing(1),
            margin: `0 0 calc(${theme.spacing(0.25)} + env(safe-area-inset-bottom)) 0`,
            boxShadow: theme.customShadows.z8,
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.grey[isLight ? 0 : 800],
            backgroundColor: theme.palette.grey[isLight ? 900 : 0],
            '&.SnackbarItem-variantSuccess, &.SnackbarItem-variantError, &.SnackbarItem-variantWarning, &.SnackbarItem-variantInfo':
            {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.paper,
            },
            [theme.breakpoints.up('md')]: {
              minWidth: 240,
            },
          },
          '& .SnackbarItem-message': {
            padding: '0 !important',
            fontWeight: theme.typography.fontWeightMedium,
          },
          '& .SnackbarItem-action': {
            marginRight: 0,
            color: theme.palette.action.active,
            '& svg': { width: 20, height: 20 },
          },
        },
      }}
    />
  );
}

// ----------------------------------------------------------------------

function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButtonAnimate size="small" onClick={() => closeSnackbar(snackbarKey)} sx={{ p: 0.5 }}>
      <Iconify icon={'eva:close-fill'} />
    </IconButtonAnimate>
  );
}

SnackbarCloseButton.propTypes = {
  snackbarKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

NotistackProvider.propTypes = {
  children: PropTypes.node,
};

export default function NotistackProvider({ children }) {
  return (
    <>
      <SnackbarStyles />

      <SnackbarProvider
        dense
        maxSnack={5}
        preventDuplicate
        autoHideDuration={3000}
        variant="success"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        iconVariant={{
          info: <SnackbarIcon icon={'eva:info-fill'} color="info" />,
          success: <SnackbarIcon icon={'eva:checkmark-circle-2-fill'} color="success" />,
          warning: <SnackbarIcon icon={'eva:alert-triangle-fill'} color="warning" />,
          error: <SnackbarIcon icon={'eva:alert-circle-fill'} color="error" />,
        }}
        action={(key) => <SnackbarCloseButton snackbarKey={key} />}
      >
        {children}
      </SnackbarProvider>
    </>
  );
}

// ----------------------------------------------------------------------

SnackbarIcon.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
};

function SnackbarIcon({ icon, color }) {
  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}.main`,
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
      }}
    >
      <Iconify icon={icon} width={24} height={24} />
    </Box>
  );
}

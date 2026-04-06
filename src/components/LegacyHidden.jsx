import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

/**
 * Replacement for removed MUI v5 `Hidden` (smDown / smUp only — matches app usage).
 */
export default function LegacyHidden({ children, smDown, smUp, sx, ...other }) {
  let display;
  if (smDown) {
    display = { xs: 'none', sm: 'block' };
  } else if (smUp) {
    display = { xs: 'block', sm: 'none' };
  }

  return (
    <Box {...other} sx={display ? { display, ...sx } : sx}>
      {children}
    </Box>
  );
}

LegacyHidden.propTypes = {
  children: PropTypes.node,
  smDown: PropTypes.bool,
  smUp: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

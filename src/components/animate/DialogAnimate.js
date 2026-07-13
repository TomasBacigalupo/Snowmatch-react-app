import PropTypes from 'prop-types';
import { createContext, forwardRef, useContext, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { Dialog, Box, Paper } from '@mui/material';
//
import { varFade } from './variants';

// ----------------------------------------------------------------------

const DialogAnimateContext = createContext({
  variants: undefined,
  onClose: undefined,
  sx: undefined,
});

const DEFAULT_VARIANTS = varFade({
  distance: 120,
  durationIn: 0.32,
  durationOut: 0.24,
  easeIn: 'easeInOut',
}).inUp;

// Stable component type — an inline PaperComponent remounts on every parent render,
// which restarts the enter animation and steals input focus (modal "blinking").
const AnimatedPaper = forwardRef(function AnimatedPaper(props, ref) {
  const { variants, onClose, sx } = useContext(DialogAnimateContext);

  return (
    <Box
      component={m.div}
      {...(variants || DEFAULT_VARIANTS)}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box onClick={onClose} sx={{ width: '100%', height: '100%', position: 'fixed' }} />
      <Paper ref={ref} sx={sx} {...props}>
        {props.children}
      </Paper>
    </Box>
  );
});

DialogAnimate.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  sx: PropTypes.object,
  variants: PropTypes.object,
};

export default function DialogAnimate({ open = false, variants, onClose, children, sx, ...other }) {
  const contextValue = useMemo(() => ({ variants, onClose, sx }), [variants, onClose, sx]);

  return (
    <DialogAnimateContext.Provider value={contextValue}>
      <AnimatePresence>
        {open && (
          <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} PaperComponent={AnimatedPaper} {...other}>
            {children}
          </Dialog>
        )}
      </AnimatePresence>
    </DialogAnimateContext.Provider>
  );
}

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';

// Local storage key
const STORAGE_KEY = 'legalDisclaimerAccepted';

function hasAcceptedDisclaimer() {
  try {
    return (
      localStorage.getItem(STORAGE_KEY) === 'true' ||
      localStorage.getItem(`${STORAGE_KEY}_never`) === 'true'
    );
  } catch {
    return false;
  }
}

/** react-snap uses this UA; opening the dialog during crawl bakes open markup into static HTML and breaks hydration (Accept stops working in production). */
function isReactSnapPrerender() {
  return typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent || '');
}

export default function LegalDisclaimerModal() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [neverShow, setNeverShow] = useState(false);

  // Don't show on index route
  const isIndexRoute = location.pathname === '/';

  useEffect(() => {
    if (isIndexRoute) {
      return;
    }
    if (isReactSnapPrerender()) {
      return;
    }

    try {
      if (!hasAcceptedDisclaimer()) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, [isIndexRoute]);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      if (neverShow) {
        localStorage.setItem(`${STORAGE_KEY}_never`, 'true');
      }
    } catch {
      // ignore localStorage errors
    }
    setOpen(false);
  };

  const handleDialogClose = (_event, reason) => {
    if (reason === 'backdropClick') {
      handleAccept();
    }
  };

  // Don't render if on index route
  if (isIndexRoute) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="legal-disclaimer-title"
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      scroll="paper"
      PaperProps={{ sx: { borderRadius: 2, maxHeight: 'calc(100% - 48px)' } }}
    >
      <DialogTitle id="legal-disclaimer-title" sx={{ textAlign: 'center', mb: 2 }}>
        Disclaimer
      </DialogTitle>

      <DialogContent dividers sx={{ overflowY: 'auto' }}>
        <Box>
          <Typography variant="body1" paragraph>
            Snowmatch operates as a certified ski and snowboard school exclusively within Cerro Catedral, Bariloche, Argentina. In this location, Snowmatch provides instruction and training services under its official certification and in compliance with all applicable local regulations.
          </Typography>

          <Typography variant="body1" paragraph>
            Outside of Cerro Catedral, Snowmatch acts solely as a digital platform facilitating connections between users and instructors. In such cases, Snowmatch does not employ, supervise, or assume responsibility for the conduct, qualifications, or services provided by the instructors. The platform does not employ instructors directly, nor does it authorize or oversee independent instruction. All lessons arranged through Snowmatch are conducted under the supervision and operational control of the respective ski school or resort with which each instructor is associated.
          </Typography>

          <Typography variant="body1" paragraph>
           By using the Snowmatch website or any of its services, you acknowledge and agree that Snowmatch’s role outside Cerro Catedral is limited to enabling contact between parties and that Snowmatch bears no liability for any actions, omissions, or agreements made between users and instructors.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            ©️ SnowMatch — All rights reserved.
          </Typography>
        </Box>

        
      </DialogContent>

      <DialogActions >
        <Box >
          <FormControlLabel
            control={<Checkbox checked={neverShow} onChange={(e) => setNeverShow(e.target.checked)} />}
            label="Never show again"
          />
        </Box>
        <Button variant="contained" onClick={handleAccept} autoFocus>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}

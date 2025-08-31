import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RegisterForm from '../sections/auth/register/RegisterForm';
import useLocales from '../hooks/useLocales';
import { PATH_DASHBOARD } from '../routes/paths';

export default function TeacherRegisterDrawer({ open, onClose }) {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const handleSuccessfulRegistration = () => {
    onClose();
    navigate(PATH_DASHBOARD.root);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500, md: 600 },
          maxHeight: '100vh',
          paddingTop: 'env(safe-area-inset-top)',
        },
      }}
      BackdropProps={{
        onClick: onClose,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {translate('registerForm.title') || 'Registro de Instructor'}
          </Typography>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <RegisterForm onSuccess={handleSuccessfulRegistration} />
      </Box>
    </Drawer>
  );
} 
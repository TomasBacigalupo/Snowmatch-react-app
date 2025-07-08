import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useAuth from '../hooks/useAuth';
import useLocales from '../hooks/useLocales';
import axios from '../utils/axios';

export default function CompleteProfileModal({ open, onClose, onComplete }) {
  const { user, refreshUser } = useAuth();
  const { translate } = useLocales();
  
  const [formData, setFormData] = useState({
    firstName: user?.name || '',
    lastName: user?.lastname || '',
    phone: user?.cellphone || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Por favor completa tu nombre y apellido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Actualizar el usuario en el backend
      const response = await axios.put('/api/users/complete-profile', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim()
      });

      // Actualizar el usuario en el contexto
      const updatedUser = {
        ...user,
        name: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        cellphone: formData.phone.trim()
      };
      
      refreshUser(updatedUser);
      
      if (onComplete) {
        onComplete(updatedUser);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" component="div">
          Completa tu perfil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Necesitamos algunos datos adicionales para personalizar tu experiencia
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Nombre *"
            value={formData.firstName}
            onChange={handleInputChange('firstName')}
            placeholder="Tu nombre"
            required
          />
          
          <TextField
            fullWidth
            label="Apellido *"
            value={formData.lastName}
            onChange={handleInputChange('lastName')}
            placeholder="Tu apellido"
            required
          />
          
          <TextField
            fullWidth
            label="Teléfono"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            placeholder="Tu número de teléfono"
            helperText="Opcional, pero útil para contactarte"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={handleSkip}
          color="inherit"
          disabled={loading}
        >
          Más tarde
        </Button>
        
        <LoadingButton
          onClick={handleSubmit}
          variant="contained"
          loading={loading}
          disabled={!formData.firstName.trim() || !formData.lastName.trim()}
        >
          Completar perfil
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
} 
import { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Stack,
  Typography,
  Box
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../hooks/useAuth';
import useLocales from '../hooks/useLocales';
import CompleteProfileModal from './CompleteProfileModal';

export default function ProfileCompletionBanner() {
  const { user } = useAuth();
  const { translate } = useLocales();
  const [showModal, setShowModal] = useState(false);

  // Verificar si el usuario necesita completar su perfil
  const needsCompleteProfile = !user?.name || 
                              !user?.lastname || 
                              user?.name?.trim() === '' || 
                              user?.lastname?.trim() === '';

  if (!needsCompleteProfile) {
    return null;
  }

  const handleCompleteProfile = (updatedUser) => {
    setShowModal(false);
    // El modal se cerrará automáticamente y el banner desaparecerá
  };
  return null;

  return (
    <>
      <Alert
        severity="info"
        icon={<PersonIcon />}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              size="small"
              onClick={() => setShowModal(true)}
              variant="outlined"
            >
              Completar ahora
            </Button>
          </Stack>
        }
        sx={{
          mb: 3,
          '& .MuiAlert-action': {
            alignItems: 'center'
          }
        }}
      >
        <AlertTitle>Perfil incompleto</AlertTitle>
        <Typography variant="body2">
          Para una mejor experiencia, completa tu nombre y apellido en tu perfil.
        </Typography>
      </Alert>

      <CompleteProfileModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleCompleteProfile}
      />
    </>
  );
} 
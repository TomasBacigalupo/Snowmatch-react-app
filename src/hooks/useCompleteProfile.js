import { useState, useEffect } from 'react';
import useAuth from './useAuth';

export default function useCompleteProfile() {
  const { user } = useAuth();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);

  // Verificar si el usuario necesita completar su perfil
  useEffect(() => {
    if (user && user.isAuthenticated) {
      const needsCompleteProfile = !user.name || 
                                  !user.lastname || 
                                  user.name.trim() === '' || 
                                  user.lastname.trim() === '';
      
      setShowCompleteProfile(needsCompleteProfile);
    }
  }, [user]);

  const handleCompleteProfile = (updatedUser) => {
    setShowCompleteProfile(false);
    // Aquí puedes agregar lógica adicional después de completar el perfil
    console.log('Profile completed:', updatedUser);
  };

  const handleSkipCompleteProfile = () => {
    setShowCompleteProfile(false);
  };

  return {
    showCompleteProfile,
    handleCompleteProfile,
    handleSkipCompleteProfile
  };
} 
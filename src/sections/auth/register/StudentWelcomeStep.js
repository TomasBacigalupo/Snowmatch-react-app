import { Box, Typography, Stack } from '@mui/material';
import { m } from 'framer-motion';
import Iconify from '../../../components/Iconify';

export default function StudentWelcomeStep() {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Iconify 
            icon="eva:person-fill" 
            sx={{ 
              fontSize: 80, 
              color: 'primary.main',
              mb: 2
            }} 
          />
        </Box>
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          ¡Bienvenido a Snowmatch!
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          Vamos a configurar tu perfil de estudiante para que puedas encontrar los mejores instructores y mejorar tu técnica de esquí.
        </Typography>

        <Stack spacing={2} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0'
          }}>
            <Iconify icon="eva:target-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
            <Typography variant="body1">
              <strong>Define tu objetivo:</strong> ¿Qué quieres lograr con el esquí?
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0'
          }}>
            <Iconify icon="eva:trending-up-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
            <Typography variant="body1">
              <strong>Tu nivel actual:</strong> Para recomendarte el instructor perfecto
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 2, 
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0'
          }}>
            <Iconify icon="eva:map-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
            <Typography variant="body1">
              <strong>Dónde esquías:</strong> Para conectarte con instructores locales
            </Typography>
          </Box>
        </Stack>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 4, fontStyle: 'italic' }}
        >
          Solo te tomará unos minutos y te ayudará a tener una experiencia personalizada
        </Typography>
      </Box>
    </m.div>
  );
}
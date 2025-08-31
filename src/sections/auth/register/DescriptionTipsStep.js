import { Box, Typography, Paper } from '@mui/material';
import { m } from 'framer-motion';
import Iconify from '../../../components/Iconify';

const DescriptionTipsStep = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Centered Image */}
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src="/assets/avatars/pros-esquiando.png"
            alt="Profile Creation"
            sx={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}
          />
        </Box>
      </m.div>

      {/* Step Header */}
      <Box sx={{ mb: 4, pl: 0 }}>
         
         <Typography 
           variant="h4" 
           sx={{ 
             color: 'text.primary', 
             fontWeight: 700,
             fontSize: '2rem',
             lineHeight: 1.2
           }}
         >
           Haz que tu perfil destaque
         </Typography>
       </Box>

      {/* Description */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
                 <Typography 
           variant="body1" 
           color="text.secondary" 
           sx={{ 
             mb: 4,
             fontSize: '1.1rem',
             lineHeight: 1.6,
             maxWidth: '100%'
           }}
         >
          En este paso, agregarás información sobre tu experiencia y especialidades, además de crear un título y descripción atractivos para que los clientes puedan conocerte mejor.
        </Typography>
      </m.div>
      
            {/* Tips Section */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            <strong>Consejos:</strong> Menciona tu experiencia, certificaciones, estilo de enseñanza y especialidades. Sé auténtico y mantén un tono amigable.
          </Typography>
        </Box>
      </m.div>
    </m.div>
  );
};

export default DescriptionTipsStep; 
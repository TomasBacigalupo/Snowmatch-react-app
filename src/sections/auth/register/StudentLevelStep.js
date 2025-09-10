import PropTypes from 'prop-types';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../../components/Iconify';

StudentLevelStep.propTypes = {
  validateField: PropTypes.func.isRequired,
};

const LEVEL_OPTIONS = [
  {
    value: 'BEGINNER',
    label: 'Principiante',
    description: 'Estoy aprendiendo a girar en pistas fáciles',
    icon: 'eva:trending-up-fill',
    emoji: '🟢',
    color: '#4caf50'
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermedio',
    description: 'Ya bajo rojas, pero me falta técnica',
    icon: 'eva:trending-up-fill',
    emoji: '🟡',
    color: '#ff9800'
  },
  {
    value: 'ADVANCED',
    label: 'Avanzado',
    description: 'Controlo en todo tipo de pistas',
    icon: 'eva:trending-up-fill',
    emoji: '🟠',
    color: '#ff5722'
  },
  {
    value: 'EXPERT',
    label: 'Experto',
    description: 'Busco rendimiento y retos técnicos',
    icon: 'eva:trending-up-fill',
    emoji: '🔴',
    color: '#f44336'
  }
];

export default function StudentLevelStep({ validateField }) {
  const { setValue, watch } = useFormContext();
  const selectedLevel = watch('studentLevel');

  const handleLevelSelect = (level) => {
    setValue('studentLevel', level);
    validateField('studentLevel', level);
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:trending-up-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          ¿Cuál es tu nivel actual?
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Esto nos ayudará a recomendarte instructores y contenido adecuado para tu nivel
      </Typography>
      
      <Grid container spacing={2}>
        {LEVEL_OPTIONS.map((level) => (
          <Grid item xs={12} sm={6} key={level.value}>
            <Card
              sx={{
                height: '100%',
                border: selectedLevel === level.value ? '2px solid' : '1px solid',
                borderColor: selectedLevel === level.value ? level.color : 'divider',
                backgroundColor: selectedLevel === level.value ? `${level.color}10` : 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: level.color,
                  boxShadow: 2,
                }
              }}
            >
              <CardActionArea
                onClick={() => handleLevelSelect(level.value)}
                sx={{ height: '100%', p: 0 }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      {level.emoji}
                    </Typography>
                    <Iconify 
                      icon={level.icon} 
                      sx={{ 
                        fontSize: 20, 
                        color: selectedLevel === level.value ? level.color : 'text.secondary' 
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: selectedLevel === level.value ? level.color : 'text.primary'
                    }}
                  >
                    {level.label}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {level.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        mt: 4, 
        p: 3, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 2,
        border: '1px solid #e0e0e0'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          💡 <strong>Tip:</strong> Es mejor ser honesto con tu nivel. Esto nos permite recomendarte 
          instructores que realmente te ayuden a mejorar y progresar de manera segura.
        </Typography>
      </Box>
    </m.div>
  );
}
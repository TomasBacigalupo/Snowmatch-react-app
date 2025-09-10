import PropTypes from 'prop-types';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../../components/Iconify';

StudentGoalStep.propTypes = {
  validateField: PropTypes.func.isRequired,
};

const GOAL_OPTIONS = [
  {
    value: 'FIND_INSTRUCTORS',
    label: 'Encontrar instructores',
    description: 'Busco un instructor profesional para mejorar mi técnica',
    icon: 'eva:person-fill',
    emoji: '👨‍🏫'
  },
  {
    value: 'TRACK_SKIING',
    label: 'Track my skiing',
    description: 'Quiero registrar mis estadísticas y progreso con GPS',
    icon: 'eva:activity-fill',
    emoji: '📊'
  },
  {
    value: 'IMPROVE_TECHNIQUE',
    label: 'Mejorar mi técnica con videos',
    description: 'Subir videos y recibir feedback de instructores',
    icon: 'eva:video-fill',
    emoji: '🎥'
  },
  {
    value: 'GET_FEEDBACK',
    label: 'Recibir feedback de instructores',
    description: 'Obtener análisis profesional de mi técnica',
    icon: 'eva:message-circle-fill',
    emoji: '💬'
  },
  {
    value: 'PLAN_TRIP',
    label: 'Planificar mi próximo viaje de ski',
    description: 'Organizar mi próxima aventura en la nieve',
    icon: 'eva:calendar-fill',
    emoji: '🏔️'
  }
];

export default function StudentGoalStep({ validateField }) {
  const { setValue, watch } = useFormContext();
  const selectedGoal = watch('studentGoal');

  const handleGoalSelect = (goal) => {
    setValue('studentGoal', goal);
    validateField('studentGoal', goal);
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:target-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          ¿Cuál es tu objetivo principal?
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Selecciona lo que más te motiva para personalizar tu experiencia en Snowmatch
      </Typography>
      
      <Grid container spacing={2}>
        {GOAL_OPTIONS.map((goal) => (
          <Grid item xs={12} sm={6} key={goal.value}>
            <Card
              sx={{
                height: '100%',
                border: selectedGoal === goal.value ? '2px solid' : '1px solid',
                borderColor: selectedGoal === goal.value ? 'primary.main' : 'divider',
                backgroundColor: selectedGoal === goal.value ? 'primary.50' : 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 2,
                }
              }}
            >
              <CardActionArea
                onClick={() => handleGoalSelect(goal.value)}
                sx={{ height: '100%', p: 0 }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      {goal.emoji}
                    </Typography>
                    <Iconify 
                      icon={goal.icon} 
                      sx={{ 
                        fontSize: 20, 
                        color: selectedGoal === goal.value ? 'primary.main' : 'text.secondary' 
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: selectedGoal === goal.value ? 'primary.main' : 'text.primary'
                    }}
                  >
                    {goal.label}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {goal.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </m.div>
  );
}
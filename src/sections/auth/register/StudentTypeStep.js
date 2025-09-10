import PropTypes from 'prop-types';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../../components/Iconify';

StudentTypeStep.propTypes = {
  validateField: PropTypes.func.isRequired,
};

const TYPE_OPTIONS = [
  {
    value: 'ON_PISTE',
    label: 'Pista',
    description: 'Me gusta esquiar en pistas marcadas y preparadas',
    icon: 'eva:map-fill',
    emoji: '🎿',
    color: '#2196f3'
  },
  {
    value: 'FREESTYLE',
    label: 'Freestyle',
    description: 'Park, saltos, trucos y acrobacias',
    icon: 'eva:flash-fill',
    emoji: '🤸',
    color: '#9c27b0'
  },
  {
    value: 'FREERIDE',
    label: 'Freeride',
    description: 'Nieve polvo y fuera de pista',
    icon: 'eva:cloud-fill',
    emoji: '❄️',
    color: '#00bcd4'
  },
  {
    value: 'BACKCOUNTRY',
    label: 'Backcountry',
    description: 'Travesías, touring y montañismo',
    icon: 'eva:compass-fill',
    emoji: '🏔️',
    color: '#795548'
  },
  {
    value: 'ALL_MOUNTAIN',
    label: 'All-mountain',
    description: 'Un poco de todo, versatilidad total',
    icon: 'eva:star-fill',
    emoji: '🌟',
    color: '#ff9800'
  }
];

export default function StudentTypeStep({ validateField }) {
  const { setValue, watch } = useFormContext();
  const selectedTypes = watch('sports') || [];

  const handleTypeToggle = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setValue('sports', newTypes);
    validateField('sports', newTypes);
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:activity-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          ¿Qué tipo de esquiador eres?
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Puedes seleccionar múltiples opciones. Esto nos ayuda a conectarte con instructores especializados
      </Typography>

      {selectedTypes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Seleccionados:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedTypes.map((type) => {
              const typeOption = TYPE_OPTIONS.find(opt => opt.value === type);
              return (
                <Chip
                  key={type}
                  label={typeOption?.label}
                  onDelete={() => handleTypeToggle(type)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              );
            })}
          </Box>
        </Box>
      )}
      
      <Grid container spacing={2}>
        {TYPE_OPTIONS.map((type) => {
          const isSelected = selectedTypes.includes(type.value);
          return (
            <Grid item xs={12} sm={6} key={type.value}>
              <Card
                sx={{
                  height: '100%',
                  border: isSelected ? '2px solid' : '1px solid',
                  borderColor: isSelected ? type.color : 'divider',
                  backgroundColor: isSelected ? `${type.color}10` : 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: type.color,
                    boxShadow: 2,
                  }
                }}
              >
                <CardActionArea
                  onClick={() => handleTypeToggle(type.value)}
                  sx={{ height: '100%', p: 0 }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 1 }}>
                        {type.emoji}
                      </Typography>
                      <Iconify 
                        icon={type.icon} 
                        sx={{ 
                          fontSize: 20, 
                          color: isSelected ? type.color : 'text.secondary' 
                        }} 
                      />
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600,
                        color: isSelected ? type.color : 'text.primary'
                      }}
                    >
                      {type.label}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ flexGrow: 1 }}
                    >
                      {type.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ 
        mt: 4, 
        p: 3, 
        backgroundColor: '#f8f9fa', 
        borderRadius: 2,
        border: '1px solid #e0e0e0'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          💡 <strong>Tip:</strong> No te preocupes si no estás seguro. Puedes cambiar estas preferencias 
          más tarde en tu perfil. Selecciona lo que más te interesa ahora.
        </Typography>
      </Box>
    </m.div>
  );
}
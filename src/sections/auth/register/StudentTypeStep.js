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
    value: 'SKI',
    label: 'Esquí',
    description: 'Aprendo a esquiar en pistas y montaña',
    icon: 'eva:activity-fill',
    emoji: '🎿',
    color: '#2196f3'
  },
  {
    value: 'SNOWBOARD',
    label: 'Snowboard',
    description: 'Aprendo a hacer snowboard',
    icon: 'eva:flash-fill',
    emoji: '🏂',
    color: '#9c27b0'
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
          ¿Qué deporte quieres practicar?
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Puedes seleccionar ambos deportes si quieres aprender esquí y snowboard
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
          💡 <strong>Tip:</strong> Si no estás seguro, puedes seleccionar ambos deportes y decidir más tarde cuál prefieres.
        </Typography>
      </Box>
    </m.div>
  );
}
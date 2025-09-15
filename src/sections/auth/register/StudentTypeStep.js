import PropTypes from 'prop-types';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../../components/Iconify';
import useLocales from '../../../hooks/useLocales';

StudentTypeStep.propTypes = {
  validateField: PropTypes.func.isRequired,
};

const TYPE_OPTIONS = [
  {
    value: 'SKI',
    icon: 'eva:activity-fill',
    emoji: '🎿',
    color: '#2196f3'
  },
  {
    value: 'SNOWBOARD',
    icon: 'eva:flash-fill',
    emoji: '🏂',
    color: '#9c27b0'
  }
];

export default function StudentTypeStep({ validateField }) {
  const { setValue, watch } = useFormContext();
  const { translate } = useLocales();
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
        <Iconify icon="eva:activity-fill" sx={{ fontSize: 24, color: 'black', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 600 }}>
          {translate('studentTypeStep.title')}
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {translate('studentTypeStep.subtitle')}
      </Typography>

      {selectedTypes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {translate('studentTypeStep.selected')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedTypes.map((type) => {
              return (
                <Chip
                  key={type}
                  label={translate(`studentTypeStep.sports.${type}.label`)}
                  onDelete={() => handleTypeToggle(type)}
                  sx={{ color: 'black' }}
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
                      {translate(`studentTypeStep.sports.${type.value}.label`)}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ flexGrow: 1 }}
                    >
                      {translate(`studentTypeStep.sports.${type.value}.description`)}
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
          {translate('studentTypeStep.tip.title')} <strong>{translate('studentTypeStep.tip.description')}</strong>
        </Typography>
      </Box>
    </m.div>
  );
}
import PropTypes from 'prop-types';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../../components/Iconify';
import useLocales from '../../../hooks/useLocales';

StudentLevelStep.propTypes = {
  validateField: PropTypes.func.isRequired,
};

const LEVEL_OPTIONS = [
  {
    value: 'BEGINNER',
    icon: 'eva:trending-up-fill',
    emoji: '🟢',
    color: '#4caf50'
  },
  {
    value: 'INTERMEDIATE',
    icon: 'eva:trending-up-fill',
    emoji: '🟡',
    color: '#ff9800'
  },
  {
    value: 'ADVANCED',
    icon: 'eva:trending-up-fill',
    emoji: '🟠',
    color: '#ff5722'
  },
  {
    value: 'EXPERT',
    icon: 'eva:trending-up-fill',
    emoji: '🔴',
    color: '#f44336'
  }
];

export default function StudentLevelStep({ validateField }) {
  const { setValue, watch } = useFormContext();
  const { translate } = useLocales();
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
        <Iconify icon="eva:trending-up-fill" sx={{ fontSize: 24, color: 'black', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 600 }}>
          {translate('studentStepper.levelStep.title')}
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {translate('studentStepper.levelStep.subtitle')}
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
                    {translate(`studentStepper.levelStep.levels.${level.value}.label`)}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {translate(`studentStepper.levelStep.levels.${level.value}.description`)}
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
          {translate('studentStepper.levelStep.tip.title')} {translate('studentStepper.levelStep.tip.description')}
        </Typography>
      </Box>
    </m.div>
  );
}
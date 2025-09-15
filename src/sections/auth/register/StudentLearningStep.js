import PropTypes from 'prop-types';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../../components/Iconify';
import useLocales from '../../../hooks/useLocales';

StudentLearningStep.propTypes = {
  validateField: PropTypes.func.isRequired,
};

const LEARNING_OPTIONS = [
  {
    value: 'IN_PERSON_WITH_TEACHER',
    icon: 'eva:person-fill',
    emoji: '👨‍🏫',
    color: '#2196f3'
  },
  {
    value: 'VIDEO_FEEDBACK',
    icon: 'eva:video-fill',
    emoji: '🎥',
    color: '#9c27b0'
  },
  {
    value: 'AI_ACADEMY',
    icon: 'eva:bulb-fill',
    emoji: '🤖',
    color: '#00bcd4'
  },
  {
    value: 'MIXED_APPROACH',
    icon: 'eva:layers-fill',
    emoji: '🔄',
    color: '#ff9800'
  }
];

export default function StudentLearningStep({ validateField }) {
  const { setValue, watch } = useFormContext();
  const { translate } = useLocales();
  const selectedMethod = watch('howToLearn');

  const handleMethodSelect = (method) => {
    setValue('howToLearn', method);
    validateField('howToLearn', method);
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:book-open-fill" sx={{ fontSize: 24, color: 'black', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 600 }}>
          {translate('studentLearningStep.title')}
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {translate('studentLearningStep.subtitle')}
      </Typography>
      
      <Grid container spacing={2}>
        {LEARNING_OPTIONS.map((method) => (
          <Grid item xs={12} sm={6} key={method.value}>
            <Card
              sx={{
                height: '100%',
                border: selectedMethod === method.value ? '2px solid' : '1px solid',
                borderColor: selectedMethod === method.value ? method.color : 'divider',
                backgroundColor: selectedMethod === method.value ? `${method.color}10` : 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: method.color,
                  boxShadow: 2,
                }
              }}
            >
              <CardActionArea
                onClick={() => handleMethodSelect(method.value)}
                sx={{ height: '100%', p: 0 }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 1 }}>
                      {method.emoji}
                    </Typography>
                    <Iconify 
                      icon={method.icon} 
                      sx={{ 
                        fontSize: 20, 
                        color: selectedMethod === method.value ? method.color : 'text.secondary' 
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: selectedMethod === method.value ? method.color : 'text.primary'
                    }}
                  >
                    {translate(`studentLearningStep.methods.${method.value}.label`)}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {translate(`studentLearningStep.methods.${method.value}.description`)}
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
        backgroundColor: '#e8f5e8', 
        borderRadius: 2,
        border: '1px solid #c8e6c9'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          🎉 <strong>{translate('studentLearningStep.successMessage')}</strong>
        </Typography>
      </Box>
    </m.div>
  );
}
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { 
  Box, 
  Typography, 
  Stack, 
  Card, 
  CardContent,
  LinearProgress,
  Button,
  IconButton
} from '@mui/material';
// framer motion
import { m } from 'framer-motion';
// hooks
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { useFormContext, Controller } from 'react-hook-form';

// ----------------------------------------------------------------------

const SPORTS_OPTIONS = [
  {
    id: 'SKI',
    title: 'Ski',
    description: 'Soy profesor de ski',
    icon: 'mdi:ski',
    value: 'SKI'
  },
  {
    id: 'SNOWBOARD',
    title: 'Snowboard',
    description: 'Soy profesor de snowboard',
    icon: 'mdi:snowboard',
    value: 'SNOWBOARD'
  },
  {
    id: 'both',
    title: 'Ambos',
    description: 'Enseño tanto ski como snowboard',
    icon: 'mdi:ski-cross-country',
    value: 'BOTH'
  }
];

Disciplines.propTypes = {
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number
};

export default function Disciplines({ onNext, onBack, currentStep = 1, totalSteps = 5 }) {
  const { translate } = useLocales();
  const { control, watch, setValue } = useFormContext();
  const selectedSport = watch('sports');

  const handleSportSelect = (sportValue) => {
    if (sportValue === 'BOTH') {
      setValue('sports', ['SKI', 'SNOWBOARD']);
    } else {
      setValue('sports', [sportValue]);
    }
  };

  const handleNext = () => {
    if (selectedSport) {
      onNext?.();
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700, 
          mb: 2,
          textAlign: 'center',
          color: 'text.primary'
        }}
      >
        ¿Qué deporte enseñas?
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          mb: 4,
          textAlign: 'center'
        }}
      >
        Selecciona tu disciplina deportiva principal
      </Typography>

      {/* Sport Selection Cards */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {SPORTS_OPTIONS.map((sport) => (
          <Controller
            key={sport.id}
            name="sports"
            control={control}
            render={({ field }) => (
                              <Card
                onClick={() => handleSportSelect(sport.value)}
                sx={{
                  cursor: 'pointer',
                  border: (Array.isArray(selectedSport) && selectedSport.includes(sport.value)) || selectedSport === sport.value
                    ? '2px solid #000' 
                    : '1px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: (Array.isArray(selectedSport) && selectedSport.includes(sport.value)) || selectedSport === sport.value
                    ? 'grey.50' 
                    : 'background.paper',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: (Array.isArray(selectedSport) && selectedSport.includes(sport.value)) || selectedSport === sport.value ? '#000' : '#bdbdbd',
                    backgroundColor: (Array.isArray(selectedSport) && selectedSport.includes(sport.value)) || selectedSport === sport.value ? 'grey.50' : 'grey.25'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary'
                        }}
                      >
                        {sport.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.5 }}
                      >
                        {sport.description}
                      </Typography>
                    </Box>
                    <Iconify 
                      icon={sport.icon} 
                      sx={{ 
                        fontSize: 32, 
                        color: (Array.isArray(selectedSport) && selectedSport.includes(sport.value)) || selectedSport === sport.value ? 'text.primary' : 'text.secondary',
                        ml: 2
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            )}
          />
        ))}
      </Stack>
    </m.div>
  );
} 
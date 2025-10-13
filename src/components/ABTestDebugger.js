import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Card, 
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { 
  getAllABTestAssignments, 
  resetABTestAssignments,
  getHomeHeroCTAVariant 
} from '../utils/abTesting';
import useLocales from '../hooks/useLocales';

/**
 * A/B Test Debugger Component
 * 
 * This component provides a debug interface for A/B testing.
 * It shows current test assignments and allows resetting tests.
 * Only visible in development mode.
 */
export default function ABTestDebugger() {
  const { translate } = useLocales();
  const [assignments, setAssignments] = useState({});
  const [currentVariant, setCurrentVariant] = useState('');

  useEffect(() => {
    loadAssignments();
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const loadAssignments = () => {
    const currentAssignments = getAllABTestAssignments();
    const homeHeroVariant = getHomeHeroCTAVariant();
    setAssignments(currentAssignments);
    setCurrentVariant(homeHeroVariant);
  };

  const handleResetAll = () => {
    resetABTestAssignments();
    loadAssignments();
  };

  const handleResetHomeHero = () => {
    resetABTestAssignments('homeHeroCTA');
    loadAssignments();
  };

  const getVariantColor = (variant) => {
    const colors = {
      variant1: 'primary',
      variant2: 'secondary',
      variant3: 'success',
      variant4: 'warning',
      variant5: 'error'
    };
    return colors[variant] || 'default';
  };

  return (
    <Card 
      sx={{ 
        position: 'fixed', 
        top: 16, 
        right: 16, 
        zIndex: 9999, 
        maxWidth: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          A/B Test Debugger
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Home Hero CTA
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip 
                label={currentVariant} 
                color={getVariantColor(currentVariant)}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {translate(`homeHero.ctaVariants.${currentVariant}`)}
              </Typography>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              All Assignments
            </Typography>
            {Object.entries(assignments).map(([testId, variant]) => (
              <Box key={testId} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {testId}:
                </Typography>
                <Chip 
                  label={variant || 'unassigned'} 
                  color={variant ? getVariantColor(variant) : 'default'}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            ))}
          </Box>

          <Divider />

          <Stack spacing={1}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleResetHomeHero}
              fullWidth
            >
              Reset Home Hero Test
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleResetAll}
              fullWidth
              color="error"
            >
              Reset All Tests
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={loadAssignments}
              fullWidth
            >
              Refresh
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

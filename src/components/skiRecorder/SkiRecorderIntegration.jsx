/**
 * Integration example for the Ski Activity Recorder
 * Shows how to integrate the ski recorder into the existing SnowMatch app
 */

import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import { SkiRecorderApp } from './SkiRecorderApp';

export const SkiRecorderIntegration = ({
  onClose,
}) => {
  const [showRecorder, setShowRecorder] = useState(false);

  if (showRecorder) {
    return <SkiRecorderApp initialScreen="activities" />;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          🎿 Ski Activity Recorder
        </Typography>
        
        <Typography variant="body1" paragraph>
          Track your ski sessions with professional-grade GPS recording. 
          Automatically detect downhill runs and lift rides with intelligent 
          battery optimization.
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Features:</strong>
            <br />• Real-time GPS tracking with dynamic accuracy
            <br />• Automatic segment detection (Downhill vs Uphill/Lift)
            <br />• Offline storage - no internet required
            <br />• Battery optimization for all-day recording
            <br />• Comprehensive activity metrics
          </Typography>
        </Alert>

        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowRecorder(true)}
            sx={{ minWidth: 200 }}
          >
            Open Ski Recorder
          </Button>
          
          {onClose && (
            <Button
              variant="outlined"
              size="large"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          All data is stored locally on your device. No server connection required.
        </Typography>
      </Paper>
    </Box>
  );
};

// Example of how to add this to your existing app navigation
export const addSkiRecorderToNavigation = () => {
  // Add this to your existing navigation menu
  return {
    title: 'Ski Recorder',
    icon: '🎿',
    component: SkiRecorderIntegration,
    path: '/ski-recorder',
  };
};

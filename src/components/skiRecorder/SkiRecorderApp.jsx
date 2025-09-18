/**
 * Main Ski Recorder App Component
 * Manages navigation between different screens and initializes the database
 */

import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { RecordScreen } from '../../screens/RecordScreen';
import { ActivitiesListScreen } from '../../screens/ActivitiesListScreen';
import { ActivityDetailScreen } from '../../screens/ActivityDetailScreen';
import { skiRecorderDB } from '../../lib/db/sqlite';

export const SkiRecorderApp = ({
  initialScreen = 'activities',
}) => {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(null);

  // Initialize database on app start
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsInitializing(true);
      setInitError(null);
      
      // Initialize the SQLite database
      await skiRecorderDB.initialize();
      
      console.log('Ski Recorder App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Ski Recorder App:', error);
      setInitError(error instanceof Error ? error.message : 'Failed to initialize app');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setCurrentScreen('activity-detail');
  };

  const handleNewRecording = () => {
    setCurrentScreen('record');
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
    setCurrentScreen('activities');
  };

  const handleBackToRecord = () => {
    setCurrentScreen('record');
  };

  if (isInitializing) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Box textAlign="center">
          <h2>Initializing Ski Recorder</h2>
          <p>Setting up database and location services...</p>
        </Box>
      </Box>
    );
  }

  if (initError) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
        p={3}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <h3>Failed to Initialize Ski Recorder</h3>
          <p>{initError}</p>
          <p>Please check your device permissions and try again.</p>
        </Alert>
        <button onClick={initializeApp}>
          Retry Initialization
        </button>
      </Box>
    );
  }

  // Render current screen
  switch (currentScreen) {
    case 'record':
      return <RecordScreen />;
    
    case 'activities':
      return (
        <ActivitiesListScreen
          onActivitySelect={handleActivitySelect}
          onNewRecording={handleNewRecording}
        />
      );
    
    case 'activity-detail':
      return selectedActivity ? (
        <ActivityDetailScreen
          activity={selectedActivity}
          onBack={handleBackToActivities}
        />
      ) : (
        <ActivitiesListScreen
          onActivitySelect={handleActivitySelect}
          onNewRecording={handleNewRecording}
        />
      );
    
    default:
      return (
        <ActivitiesListScreen
          onActivitySelect={handleActivitySelect}
          onNewRecording={handleNewRecording}
        />
      );
  }
};

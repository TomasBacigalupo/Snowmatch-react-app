/**
 * Main Ski Tracking App Component
 * Handles navigation between different tracking screens
 */

import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Tabs, Tab } from '@mui/material';
import { 
  Home, 
  PlayArrow, 
  History, 
  Settings 
} from '@mui/icons-material';
import { ActivitiesListScreen } from '../../screens/ActivitiesListScreen';
import { ActivityDetailScreen } from '../../screens/ActivityDetailScreen';
import { RecordScreen } from '../../screens/RecordScreen';

export const SkiTrackingApp = ({ onClose }) => {
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Initialize database on mount
  useEffect(() => {
    const initializeDB = async () => {
      try {
        const { skiRecorderDB } = await import('../../lib/db/sqlite');
        if (!(await skiRecorderDB.isInitialized())) {
          await skiRecorderDB.initialize();
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    initializeDB();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    switch (newValue) {
      case 0:
        setCurrentScreen('list');
        break;
      case 1:
        setCurrentScreen('record');
        break;
      default:
        setCurrentScreen('list');
    }
  };

  const handleNavigateToDetail = (activityId) => {
    setSelectedActivityId(activityId);
    setCurrentScreen('detail');
  };

  const handleNavigateToRecord = () => {
    setCurrentScreen('record');
    setTabValue(1);
  };

  const handleBackToList = () => {
    setCurrentScreen('list');
    setSelectedActivityId(null);
    setTabValue(0);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'list':
        return (
          <ActivitiesListScreen
            onNavigateToRecord={handleNavigateToRecord}
            onNavigateToDetail={handleNavigateToDetail}
          />
        );
      case 'record':
        return (
          <RecordScreen />
        );
      case 'detail':
        return selectedActivityId ? (
          <ActivityDetailScreen
            activityId={selectedActivityId}
            onBack={handleBackToList}
          />
        ) : (
          <ActivitiesListScreen
            onNavigateToRecord={handleNavigateToRecord}
            onNavigateToDetail={handleNavigateToDetail}
          />
        );
      default:
        return (
          <ActivitiesListScreen
            onNavigateToRecord={handleNavigateToRecord}
            onNavigateToDetail={handleNavigateToDetail}
          />
        );
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ 
          backgroundColor: '#ffffff',
          color: '#000000'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#000000' }}>
            🎿 Ski Tracker
          </Typography>
          {onClose && (
            <IconButton
              color="inherit"
              onClick={onClose}
              aria-label="close"
              sx={{ color: '#000000' }}
            >
              <Settings />
            </IconButton>
          )}
        </Toolbar>
        
        {/* Navigation Tabs */}
        {currentScreen !== 'detail' && (
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ 
              backgroundColor: '#ffffff',
              '& .MuiTab-root': {
                minHeight: 48,
                color: 'rgba(0, 0, 0, 0.6)',
                '&.Mui-selected': {
                  color: '#000000'
                }
              }
            }}
          >
            <Tab 
              icon={<History />} 
              sx={{ minHeight: 48 }}
              title="Mis Actividades"
            />
            <Tab 
              icon={<PlayArrow />} 
              sx={{ minHeight: 48 }}
              title="Grabar"
            />
          </Tabs>
        )}
      </AppBar>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {renderCurrentScreen()}
      </Box>
    </Box>
  );
};

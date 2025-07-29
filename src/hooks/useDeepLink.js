import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router-dom';

export const useDeepLink = () => {
  const [deepLink, setDeepLink] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // Handle app URL open events
    const handleAppUrlOpen = (event) => {
      console.log('App opened with URL:', event.url);
      setDeepLink(event.url);
      
      // Parse the URL and handle different routes
      handleDeepLink(event.url);
    };

    // Handle app state changes
    const handleAppStateChange = (state) => {
      console.log('App state changed:', state);
    };

    // Add listeners
    App.addListener('appUrlOpen', handleAppUrlOpen);
    App.addListener('appStateChange', handleAppStateChange);

    // Get the initial URL if the app was opened with a deep link
    App.getLaunchUrl().then((result) => {
      if (result?.url) {
        console.log('App launched with URL:', result.url);
        setDeepLink(result.url);
        handleDeepLink(result.url);
      }
    });

    // Cleanup listeners
    return () => {
      App.removeAllListeners();
    };
  }, [navigate]);

  const handleDeepLink = (url) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const params = new URLSearchParams(urlObj.search);

      console.log('Deep link path:', path);
      console.log('Deep link params:', Object.fromEntries(params));

      // Handle the specific /match/teacher/ route
      if (path.startsWith('/match/teacher/')) {
        const teacherId = path.split('/match/teacher/')[1];
        if (teacherId) {
          console.log('Navigate to teacher profile:', teacherId);
          // Here you can navigate to the teacher profile page
          // You might want to use your routing system (React Router, etc.)
          handleTeacherNavigation(teacherId);
        }
      } else {
        // Handle other routes if needed
        switch (path) {
          case '/profile':
            console.log('Navigate to profile');
            break;
          case '/booking':
            const bookingId = params.get('id');
            if (bookingId) {
              console.log('Navigate to booking:', bookingId);
            }
            break;
          case '/resort':
            const resortId = params.get('id');
            if (resortId) {
              console.log('Navigate to resort:', resortId);
            }
            break;
          case '/lesson':
            const lessonId = params.get('id');
            if (lessonId) {
              console.log('Navigate to lesson:', lessonId);
            }
            break;
          default:
            console.log('Unknown deep link path:', path);
        }
      }
    } catch (error) {
      console.error('Error parsing deep link URL:', error);
    }
  };

  const handleTeacherNavigation = (teacherId) => {
    // Use React Router's navigate function for proper navigation
    console.log(`Navigating to teacher with ID: ${teacherId}`);
    
    // Navigate to teacher profile page using React Router
    navigate(`/match/teacher/${teacherId}`);
  };

  return { deepLink, handleDeepLink };
}; 
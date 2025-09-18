/**
 * Tunable constants for the Ski Activity Recorder
 * Adjust these values to optimize performance for different skiing conditions
 */

// Segment Detection Constants
export const SEGMENT_DETECTION = {
  // Speed threshold for downhill detection (m/s)
  SPEED_THRESHOLD_MS: 2.0,
  
  // Grade threshold for downhill detection (decimal, -0.03 = -3%)
  GRADE_THRESHOLD: -0.03,
  
  // Number of consecutive samples required to switch segment type
  CONSECUTIVE_SAMPLES_REQUIRED: 3,
  
  // Size of rolling window for smoothing
  ROLLING_WINDOW_SIZE: 8,
  
  // Maximum GPS accuracy to accept (meters)
  MAX_ACCURACY_M: 50,
  
  // Maximum speed to accept (m/s) - filters out GPS jumps
  MAX_SPEED_MS: 60,
  
  // Speed below which to consider auto-pause (m/s)
  AUTO_PAUSE_SPEED_MS: 0.5,
  
  // Duration of low speed before auto-pause (ms)
  AUTO_PAUSE_DURATION_MS: 60000, // 1 minute
} as const;

// Location Accuracy Profiles
export const ACCURACY_PROFILES = {
  // High accuracy profile for downhill skiing
  DOWNHILL: {
    enableHighAccuracy: true,
    desiredIntervalMs: 1000,    // 1 second
    minDistanceM: 5,            // 5 meters
  },
  
  // Reduced accuracy profile for uphill/lift rides
  UPHILL: {
    enableHighAccuracy: false,
    desiredIntervalMs: 10000,   // 10 seconds
    minDistanceM: 30,           // 30 meters
  },
  
  // Battery optimized profile for stationary periods
  BATTERY_OPTIMIZED: {
    enableHighAccuracy: false,
    desiredIntervalMs: 20000,   // 20 seconds
    minDistanceM: 50,           // 50 meters
  },
} as const;

// GPS Filtering Constants
export const GPS_FILTERING = {
  // Maximum distance between consecutive samples (meters)
  MAX_JUMP_DISTANCE_M: 100,
  
  // Minimum time between samples (ms)
  MIN_SAMPLE_INTERVAL_MS: 100,
  
  // Maximum time between samples (ms)
  MAX_SAMPLE_INTERVAL_MS: 30000, // 30 seconds
} as const;

// Performance Constants
export const PERFORMANCE = {
  // Maximum number of samples to keep in memory
  MAX_SAMPLES_IN_MEMORY: 1000,
  
  // Batch size for database operations
  DB_BATCH_SIZE: 50,
  
  // Update interval for UI metrics (ms)
  UI_UPDATE_INTERVAL_MS: 1000,
  
  // Map update interval (ms)
  MAP_UPDATE_INTERVAL_MS: 5000,
} as const;

// UI Constants
export const UI = {
  // Animation duration for stat cards (ms)
  STAT_CARD_ANIMATION_MS: 200,
  
  // Map height for different screen sizes
  MAP_HEIGHT: {
    mobile: 300,
    tablet: 400,
    desktop: 500,
  },
  
  // Color scheme for segments
  SEGMENT_COLORS: {
    DOWNHILL: '#d32f2f',  // Red
    UPHILL: '#2e7d32',    // Green
    UNKNOWN: '#1976d2',   // Blue
  },
} as const;

// Export combined configuration
export const SKI_RECORDER_CONFIG = {
  segmentDetection: SEGMENT_DETECTION,
  downhillProfile: ACCURACY_PROFILES.DOWNHILL,
  uphillProfile: ACCURACY_PROFILES.UPHILL,
  batteryOptimizedProfile: ACCURACY_PROFILES.BATTERY_OPTIMIZED,
} as const;

// Environment-specific overrides
export const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isDevelopment) {
    return {
      // More frequent updates for development
      downhillProfile: {
        ...ACCURACY_PROFILES.DOWNHILL,
        desiredIntervalMs: 500, // 0.5 seconds
      },
      // More sensitive detection for testing
      segmentDetection: {
        ...SEGMENT_DETECTION,
        speedThresholdMs: 1.5,
        consecutiveSamplesRequired: 2,
      },
    };
  }
  
  if (isProduction) {
    return {
      // Optimized for battery life in production
      uphillProfile: {
        ...ACCURACY_PROFILES.UPHILL,
        desiredIntervalMs: 15000, // 15 seconds
      },
      // More stable detection in production
      segmentDetection: {
        ...SEGMENT_DETECTION,
        consecutiveSamplesRequired: 4,
      },
    };
  }
  
  return {};
};

// Mountain-specific configurations
export const MOUNTAIN_CONFIGS = {
  // High altitude mountains (thin air, GPS challenges)
  HIGH_ALTITUDE: {
    segmentDetection: {
      ...SEGMENT_DETECTION,
      maxAccuracyM: 75, // More lenient accuracy
      speedThresholdMs: 1.8, // Lower speed threshold
    },
  },
  
  // Steep mountains (more aggressive downhill detection)
  STEEP_TERRAIN: {
    segmentDetection: {
      ...SEGMENT_DETECTION,
      gradeThreshold: -0.02, // Less steep grade requirement
      speedThresholdMs: 2.5, // Higher speed threshold
    },
  },
  
  // Beginner-friendly mountains (more conservative detection)
  BEGINNER_FRIENDLY: {
    segmentDetection: {
      ...SEGMENT_DETECTION,
      speedThresholdMs: 1.5, // Lower speed threshold
      gradeThreshold: -0.04, // Steeper grade requirement
    },
  },
} as const;

// Helper function to get mountain-specific config
export const getMountainConfig = (mountainType: keyof typeof MOUNTAIN_CONFIGS) => {
  return MOUNTAIN_CONFIGS[mountainType] || {};
};

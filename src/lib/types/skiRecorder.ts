/**
 * TypeScript interfaces and types for the Ski Activity Recorder
 */

export type SegmentKind = 'DOWNHILL' | 'UPHILL';

export type RecordingStatus = 'idle' | 'recording' | 'paused';

export interface Activity {
  id: string;
  startedAt: number;
  endedAt?: number;
  totalDistanceM: number;
  totalDescentM: number;
  totalAscentM: number;
  maxSpeedMs: number;
  avgSpeedMs: number;
  downhillTimeMs: number;
  uphillTimeMs: number;
  notes?: string;
}

export interface Segment {
  id: string;
  activityId: string;
  kind: SegmentKind;
  startedAt: number;
  endedAt?: number;
  distanceM: number;
  descentM: number;
  ascentM: number;
  maxSpeedMs: number;
}

export interface Sample {
  id?: number;
  activityId: string;
  segmentId?: string;
  ts: number;
  lat: number;
  lng: number;
  altM?: number;
  accuracyM?: number;
  speedMs?: number;
}

export interface LiveMetrics {
  duration: number; // milliseconds
  distance: number; // meters
  currentSpeed: number; // m/s
  maxSpeed: number; // m/s
  avgSpeed: number; // m/s
  totalAscent: number; // meters
  totalDescent: number; // meters
  currentSegmentKind: SegmentKind | null;
  sampleCount: number;
  curveCount: number; // number of turns/curves detected
}

export interface LocationAccuracyProfile {
  enableHighAccuracy: boolean;
  desiredIntervalMs: number;
  minDistanceM: number;
}

export interface SegmentDetectionConfig {
  speedThresholdMs: number; // 2.0 m/s
  gradeThreshold: number; // -0.03 (3% downhill)
  consecutiveSamplesRequired: number; // 3 samples to switch
  rollingWindowSize: number; // 5-10 samples
  maxAccuracyM: number; // 50m - ignore samples with worse accuracy
  maxSpeedMs: number; // 60 m/s - ignore impossible jumps
  autoPauseSpeedMs: number; // 0.5 m/s
  autoPauseDurationMs: number; // 60000 ms (60s)
}

export interface SkiRecorderConfig {
  segmentDetection: SegmentDetectionConfig;
  downhillProfile: LocationAccuracyProfile;
  uphillProfile: LocationAccuracyProfile;
  batteryOptimizedProfile: LocationAccuracyProfile;
}

// Default configuration constants
export const DEFAULT_CONFIG: SkiRecorderConfig = {
  segmentDetection: {
    speedThresholdMs: 2.0,
    gradeThreshold: -0.03,
    consecutiveSamplesRequired: 3,
    rollingWindowSize: 8,
    maxAccuracyM: 50,
    maxSpeedMs: 60,
    autoPauseSpeedMs: 0.5,
    autoPauseDurationMs: 60000,
  },
  downhillProfile: {
    enableHighAccuracy: true,
    desiredIntervalMs: 1000, // 1 second
    minDistanceM: 5,
  },
  uphillProfile: {
    enableHighAccuracy: false,
    desiredIntervalMs: 10000, // 10 seconds
    minDistanceM: 30,
  },
  batteryOptimizedProfile: {
    enableHighAccuracy: false,
    desiredIntervalMs: 20000, // 20 seconds
    minDistanceM: 50,
  },
};

export interface SkiRecorderHook {
  status: RecordingStatus;
  currentActivity: Activity | null;
  currentSegment: Segment | null;
  samples: Sample[];
  segments: Segment[];
  metrics: LiveMetrics;
  config: SkiRecorderConfig;
  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  finishRecording: (notes?: string) => Promise<Activity>;
  discardRecording: () => Promise<void>;
  updateConfig: (newConfig: Partial<SkiRecorderConfig>) => void;
}

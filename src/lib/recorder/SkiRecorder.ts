/**
 * Main SkiRecorder class for managing ski activity recording
 * Handles location tracking, segment detection, and data persistence
 */

import { registerPlugin } from '@capacitor/core';
import { 
  Activity, 
  Segment, 
  Sample, 
  RecordingStatus, 
  LiveMetrics, 
  SkiRecorderConfig,
  DEFAULT_CONFIG,
  SegmentKind 
} from '../types/skiRecorder';
import { skiRecorderDB } from '../db/sqlite';
import { SegmentDetector, SegmentDetectionResult } from './segmentDetection';
import { CurveDetector } from './curveDetection';
import { haversineDistance, calculateSpeed } from '../geo/haversine';
import { smoothSamples } from '../geo/smoothing';

// Define types for background geolocation plugin
interface BackgroundGeolocationPlugin {
  addWatcher(options: {
    backgroundMessage?: string;
    backgroundTitle?: string;
    requestPermissions?: boolean;
    stale?: boolean;
    distanceFilter?: number;
  }, callback: (location: any, error: any) => void): Promise<string>;
  
  removeWatcher(options: { id: string }): Promise<void>;
}

// Import background geolocation plugin
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

export class SkiRecorder {
  private status: RecordingStatus = 'idle';
  private config: SkiRecorderConfig = DEFAULT_CONFIG;
  private segmentDetector: SegmentDetector;
  private curveDetector: CurveDetector;
  
  // Current recording state
  private currentActivity: Activity | null = null;
  private currentSegment: Segment | null = null;
  private samples: Sample[] = [];
  private segments: Segment[] = [];
  
  // Location tracking
  private watchId: string | null = null;
  private lastSample: Sample | null = null;
  private lastLocationUpdate: number = 0;
  
  // Metrics calculation
  private totalDistance: number = 0;
  private totalAscent: number = 0;
  private totalDescent: number = 0;
  private maxSpeed: number = 0;
  private downhillTime: number = 0;
  private uphillTime: number = 0;
  private recordingStartTime: number = 0;
  private pausedTime: number = 0;
  
  // Auto-pause detection
  private stationaryStartTime: number | null = null;
  private isAutoPaused: boolean = false;
  
  // Event callbacks
  private onStatusChange?: (status: RecordingStatus) => void;
  private onMetricsUpdate?: (metrics: LiveMetrics) => void;
  private onSegmentChange?: (segment: Segment | null) => void;

  constructor(config?: Partial<SkiRecorderConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.segmentDetector = new SegmentDetector(this.config.segmentDetection);
    this.curveDetector = new CurveDetector();
  }

  /**
   * Set event callbacks
   */
  setCallbacks(callbacks: {
    onStatusChange?: (status: RecordingStatus) => void;
    onMetricsUpdate?: (metrics: LiveMetrics) => void;
    onSegmentChange?: (segment: Segment | null) => void;
  }): void {
    this.onStatusChange = callbacks.onStatusChange;
    this.onMetricsUpdate = callbacks.onMetricsUpdate;
    this.onSegmentChange = callbacks.onSegmentChange;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SkiRecorderConfig>): void {
    this.config = { ...this.config, ...config };
    this.segmentDetector.updateConfig(this.config.segmentDetection);
    
    // Update location tracking if currently recording
    if (this.status === 'recording' && this.watchId) {
      this.updateLocationTracking();
    }
  }

  /**
   * Start recording a new activity
   */
  async startRecording(): Promise<void> {
    if (this.status !== 'idle') {
      throw new Error('Cannot start recording: already recording or paused');
    }

    try {
      // Check location permissions - background geolocation handles this internally
      // The plugin will request permissions automatically if requestPermissions is true

      // Create new activity
      const activityId = this.generateId();
      this.currentActivity = {
        id: activityId,
        startedAt: Date.now(),
        totalDistanceM: 0,
        totalDescentM: 0,
        totalAscentM: 0,
        maxSpeedMs: 0,
        avgSpeedMs: 0,
        downhillTimeMs: 0,
        uphillTimeMs: 0,
      };

      // Reset state
      this.samples = [];
      this.segments = [];
      this.currentSegment = null;
      this.totalDistance = 0;
      this.totalAscent = 0;
      this.totalDescent = 0;
      this.maxSpeed = 0;
      this.downhillTime = 0;
      this.uphillTime = 0;
      this.recordingStartTime = Date.now();
      this.pausedTime = 0;
      this.stationaryStartTime = null;
      this.isAutoPaused = false;
      this.lastSample = null;
      this.segmentDetector.reset();

      // Save activity to database
      await skiRecorderDB.createActivity(this.currentActivity);

      // Start location tracking
      await this.startLocationTracking();

      // Update status
      this.status = 'recording';
      this.onStatusChange?.(this.status);

      console.log('Ski recording started:', activityId);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Pause recording
   */
  pauseRecording(): void {
    if (this.status !== 'recording') {
      throw new Error('Cannot pause: not currently recording');
    }

    this.status = 'paused';
    this.onStatusChange?.(this.status);

    // Stop location tracking
    this.stopLocationTracking();

    console.log('Ski recording paused');
  }

  /**
   * Resume recording
   */
  async resumeRecording(): Promise<void> {
    if (this.status !== 'paused') {
      throw new Error('Cannot resume: not currently paused');
    }

    try {
      // Resume location tracking
      await this.startLocationTracking();

      this.status = 'recording';
      this.onStatusChange?.(this.status);

      console.log('Ski recording resumed');
    } catch (error) {
      console.error('Failed to resume recording:', error);
      throw error;
    }
  }

  /**
   * Finish recording and save to database
   */
  async finishRecording(notes?: string): Promise<Activity> {
    if (this.status === 'idle') {
      throw new Error('Cannot finish: no active recording');
    }

    try {
      // Stop location tracking
      this.stopLocationTracking();

      // Close current segment if open
      if (this.currentSegment) {
        await this.closeCurrentSegment();
      }

      // Calculate final metrics
      const finalMetrics = this.calculateFinalMetrics();

      // Update activity with final data
      if (this.currentActivity) {
        this.currentActivity.endedAt = Date.now();
        this.currentActivity.totalDistanceM = finalMetrics.totalDistance;
        this.currentActivity.totalDescentM = finalMetrics.totalDescent;
        this.currentActivity.totalAscentM = finalMetrics.totalAscent;
        this.currentActivity.maxSpeedMs = finalMetrics.maxSpeed;
        this.currentActivity.avgSpeedMs = finalMetrics.avgSpeed;
        this.currentActivity.downhillTimeMs = finalMetrics.downhillTime;
        this.currentActivity.uphillTimeMs = finalMetrics.uphillTime;
        this.currentActivity.notes = notes;

        // Save to database
        await skiRecorderDB.updateActivity(this.currentActivity);
      }

      const finishedActivity = this.currentActivity!;

      // Reset state
      this.reset();

      console.log('Ski recording finished:', finishedActivity.id);
      return finishedActivity;
    } catch (error) {
      console.error('Failed to finish recording:', error);
      throw error;
    }
  }

  /**
   * Discard current recording
   */
  async discardRecording(): Promise<void> {
    if (this.status === 'idle') {
      throw new Error('Cannot discard: no active recording');
    }

    try {
      // Stop location tracking
      this.stopLocationTracking();

      // Delete activity and all related data from database
      if (this.currentActivity) {
        await skiRecorderDB.deleteActivity(this.currentActivity.id);
      }

      // Reset state
      this.reset();

      console.log('Ski recording discarded');
    } catch (error) {
      console.error('Failed to discard recording:', error);
      throw error;
    }
  }

  /**
   * Get current status
   */
  getStatus(): RecordingStatus {
    return this.status;
  }

  /**
   * Get current activity
   */
  getCurrentActivity(): Activity | null {
    return this.currentActivity;
  }

  /**
   * Get current segment
   */
  getCurrentSegment(): Segment | null {
    return this.currentSegment;
  }

  /**
   * Get current samples
   */
  getSamples(): Sample[] {
    return [...this.samples]; // Return a copy to prevent external modification
  }

  /**
   * Get current segments
   */
  getSegments(): Segment[] {
    return [...this.segments]; // Return a copy to prevent external modification
  }

  /**
   * Get live metrics
   */
  getLiveMetrics(): LiveMetrics {
    const now = Date.now();
    const elapsed = now - this.recordingStartTime - this.pausedTime;
    
    const currentSpeed = this.lastSample?.speedMs || 0;
    const avgSpeed = elapsed > 0 ? this.totalDistance / (elapsed / 1000) : 0;

    return {
      duration: elapsed,
      distance: this.totalDistance,
      currentSpeed,
      maxSpeed: this.maxSpeed,
      avgSpeed,
      totalAscent: this.totalAscent,
      totalDescent: this.totalDescent,
      currentSegmentKind: this.currentSegment?.kind || null,
      sampleCount: this.samples.length,
      curveCount: this.curveDetector.getCurveCount(),
    };
  }

  /**
   * Start location tracking with current accuracy profile
   */
  private async startLocationTracking(): Promise<void> {
    const profile = this.getCurrentAccuracyProfile();
    
    // Use background geolocation for continuous tracking
    this.watchId = await BackgroundGeolocation.addWatcher(
      {
        // Enable background tracking
        backgroundMessage: "SnowMatch está registrando tu actividad de esquí",
        backgroundTitle: "Grabando Esquí",
        
        // Request permissions automatically
        requestPermissions: true,
        
        // Don't deliver stale locations
        stale: false,
        
        // Distance filter based on current profile
        distanceFilter: profile.enableHighAccuracy ? 10 : 50,
      },
      (location, error) => {
        if (error) {
          console.error('Background location error:', error);
          if (error.code === 'NOT_AUTHORIZED') {
            console.warn('Location permission denied');
          }
          return;
        }
        
        if (location) {
          // Convert background geolocation format to our expected format
          const position: GeolocationPosition = {
            coords: {
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy,
              altitude: location.altitude,
              speed: location.speed,
              heading: location.bearing,
              altitudeAccuracy: null,
              toJSON: () => ({}), // Required by GeolocationCoordinates interface
            },
            timestamp: location.time,
            toJSON: () => ({}), // Required by GeolocationPosition interface
          };
          
          this.handleLocationUpdate(position);
        }
      }
    );
  }

  /**
   * Stop location tracking
   */
  private stopLocationTracking(): void {
    if (this.watchId) {
      BackgroundGeolocation.removeWatcher({ id: this.watchId });
      this.watchId = null;
    }
  }

  /**
   * Update location tracking with new accuracy profile
   */
  private updateLocationTracking(): void {
    if (this.watchId && this.status === 'recording') {
      this.stopLocationTracking();
      this.startLocationTracking();
    }
  }

  /**
   * Get current accuracy profile based on segment type
   */
  private getCurrentAccuracyProfile() {
    if (this.isAutoPaused) {
      return this.config.batteryOptimizedProfile;
    }
    
    if (this.currentSegment?.kind === 'DOWNHILL') {
      return this.config.downhillProfile;
    }
    
    return this.config.uphillProfile;
  }

  /**
   * Handle new location update
   */
  private async handleLocationUpdate(position: GeolocationPosition): Promise<void> {
    if (!this.currentActivity) {
      return;
    }

    const now = Date.now();
    const { latitude, longitude, accuracy, altitude, speed } = position.coords;

    // Filter out poor accuracy samples
    if (accuracy && accuracy > this.config.segmentDetection.maxAccuracyM) {
      console.warn(`Poor accuracy sample ignored: ${accuracy}m`);
      return;
    }

    // Create new sample
    const sample: Sample = {
      activityId: this.currentActivity.id,
      segmentId: this.currentSegment?.id,
      ts: now,
      lat: latitude,
      lng: longitude,
      altM: altitude || undefined,
      accuracyM: accuracy || undefined,
      speedMs: speed !== null ? speed : undefined,
    };

    // Calculate distance from last sample
    if (this.lastSample) {
      const distance = haversineDistance(
        this.lastSample.lat,
        this.lastSample.lng,
        latitude,
        longitude
      );

      // Filter out GPS jumps
      if (distance > 100) { // 100m jump threshold
        console.warn(`GPS jump detected: ${distance.toFixed(2)}m, ignoring sample`);
        return;
      }

      this.totalDistance += distance;
    }

    // Calculate speed if not provided
    if (sample.speedMs === undefined && this.lastSample) {
      const timeMs = now - this.lastSample.ts;
      if (timeMs > 0) {
        const distance = haversineDistance(
          this.lastSample.lat,
          this.lastSample.lng,
          latitude,
          longitude
        );
        sample.speedMs = calculateSpeed(distance, timeMs);
      }
    }

    // Update max speed
    if (sample.speedMs && sample.speedMs > this.maxSpeed) {
      this.maxSpeed = sample.speedMs;
    }

    // Detect segment type
    const detectionResult = this.segmentDetector.classifySample(sample);
    
    // Detect curves
    const curveResult = this.curveDetector.detectCurve(sample);
    
    // Check for segment change
    if (this.currentSegment?.kind !== detectionResult.kind) {
      await this.handleSegmentChange(detectionResult);
    }

    // Update current segment metrics
    if (this.currentSegment) {
      await this.updateCurrentSegment(sample, detectionResult);
    }

    // Save sample to database
    await skiRecorderDB.createSample(sample);
    this.samples.push(sample);
    this.lastSample = sample;
    this.lastLocationUpdate = now;

    // Check for auto-pause
    this.checkAutoPause(sample);

    // Update metrics
    this.onMetricsUpdate?.(this.getLiveMetrics());
  }

  /**
   * Handle segment type change
   */
  private async handleSegmentChange(detectionResult: SegmentDetectionResult): Promise<void> {
    // Close current segment
    if (this.currentSegment) {
      await this.closeCurrentSegment();
    }

    // Create new segment
    const segmentId = this.generateId();
    this.currentSegment = {
      id: segmentId,
      activityId: this.currentActivity!.id,
      kind: detectionResult.kind,
      startedAt: Date.now(),
      distanceM: 0,
      descentM: 0,
      ascentM: 0,
      maxSpeedMs: 0,
    };

    // Save to database
    await skiRecorderDB.createSegment(this.currentSegment);
    this.segments.push(this.currentSegment);

    // Update location tracking accuracy
    this.updateLocationTracking();

    // Notify listeners
    this.onSegmentChange?.(this.currentSegment);

    console.log(`Segment changed to: ${detectionResult.kind}`);
  }

  /**
   * Update current segment with new sample
   */
  private async updateCurrentSegment(
    sample: Sample, 
    detectionResult: SegmentDetectionResult
  ): Promise<void> {
    if (!this.currentSegment || !this.lastSample) {
      return;
    }

    // Calculate distance
    const distance = haversineDistance(
      this.lastSample.lat,
      this.lastSample.lng,
      sample.lat,
      sample.lng
    );

    // Calculate altitude change
    let altitudeChange = 0;
    if (this.lastSample.altM !== undefined && sample.altM !== undefined) {
      altitudeChange = sample.altM - this.lastSample.altM;
    }

    // Update segment metrics
    this.currentSegment.distanceM += distance;
    
    if (altitudeChange > 0) {
      this.currentSegment.ascentM += altitudeChange;
      this.totalAscent += altitudeChange;
    } else {
      this.currentSegment.descentM += Math.abs(altitudeChange);
      this.totalDescent += Math.abs(altitudeChange);
    }

    if (sample.speedMs && sample.speedMs > this.currentSegment.maxSpeedMs) {
      this.currentSegment.maxSpeedMs = sample.speedMs;
    }

    // Update time tracking
    const timeMs = sample.ts - this.lastSample.ts;
    if (this.currentSegment.kind === 'DOWNHILL') {
      this.downhillTime += timeMs;
    } else {
      this.uphillTime += timeMs;
    }

    // Save to database
    await skiRecorderDB.updateSegment(this.currentSegment);
  }

  /**
   * Close current segment
   */
  private async closeCurrentSegment(): Promise<void> {
    if (!this.currentSegment) {
      return;
    }

    this.currentSegment.endedAt = Date.now();
    await skiRecorderDB.updateSegment(this.currentSegment);
    this.currentSegment = null;
  }

  /**
   * Check for auto-pause conditions
   */
  private checkAutoPause(sample: Sample): void {
    const { autoPauseSpeedMs, autoPauseDurationMs } = this.config.segmentDetection;
    
    if (sample.speedMs && sample.speedMs < autoPauseSpeedMs) {
      if (!this.stationaryStartTime) {
        this.stationaryStartTime = Date.now();
      } else if (Date.now() - this.stationaryStartTime > autoPauseDurationMs) {
        if (!this.isAutoPaused) {
          this.isAutoPaused = true;
          this.updateLocationTracking(); // Switch to battery-optimized profile
          console.log('Auto-paused due to stationary state');
        }
      }
    } else {
      if (this.isAutoPaused) {
        this.isAutoPaused = false;
        this.updateLocationTracking(); // Switch back to normal profile
        console.log('Auto-resumed from stationary state');
      }
      this.stationaryStartTime = null;
    }
  }

  /**
   * Calculate final metrics
   */
  private calculateFinalMetrics() {
    const totalTime = this.downhillTime + this.uphillTime;
    const avgSpeed = totalTime > 0 ? this.totalDistance / (totalTime / 1000) : 0;

    return {
      totalDistance: this.totalDistance,
      totalDescent: this.totalDescent,
      totalAscent: this.totalAscent,
      maxSpeed: this.maxSpeed,
      avgSpeed,
      downhillTime: this.downhillTime,
      uphillTime: this.uphillTime,
    };
  }

  /**
   * Reset recorder state
   */
  private reset(): void {
    this.status = 'idle';
    this.currentActivity = null;
    this.currentSegment = null;
    this.samples = [];
    this.segments = [];
    this.lastSample = null;
    this.totalDistance = 0;
    this.totalAscent = 0;
    this.totalDescent = 0;
    this.maxSpeed = 0;
    this.downhillTime = 0;
    this.uphillTime = 0;
    this.recordingStartTime = 0;
    this.pausedTime = 0;
    this.stationaryStartTime = null;
    this.isAutoPaused = false;
    this.segmentDetector.reset();
    this.curveDetector.reset();
    
    this.onStatusChange?.(this.status);
    this.onSegmentChange?.(null);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `ski_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

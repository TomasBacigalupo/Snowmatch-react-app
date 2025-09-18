/**
 * Curve detection algorithm for ski tracking
 * Detects turns/curves by analyzing bearing changes and lateral acceleration patterns
 */

import { Sample } from '../types/skiRecorder';
import { haversineDistance, calculateBearing } from '../geo/haversine';

export interface CurveDetectionConfig {
  minBearingChange: number; // Minimum bearing change in degrees to consider a turn
  minSpeedForTurn: number; // Minimum speed in m/s to register a turn
  minDistanceForTurn: number; // Minimum distance in meters to register a turn
  smoothingWindow: number; // Number of samples for smoothing bearing changes
  turnThreshold: number; // Threshold for accumulated bearing change to count as a turn
}

export interface CurveDetectionResult {
  isTurning: boolean;
  bearingChange: number; // degrees
  turnDirection: 'left' | 'right' | null;
  accumulatedBearingChange: number; // degrees
  curveCount: number;
  confidence: number; // 0-1
}

export const DEFAULT_CURVE_CONFIG: CurveDetectionConfig = {
  minBearingChange: 15, // 15 degrees minimum change
  minSpeedForTurn: 2.0, // 2 m/s minimum speed
  minDistanceForTurn: 10, // 10 meters minimum distance
  smoothingWindow: 5, // 5 samples for smoothing
  turnThreshold: 90, // 90 degrees accumulated change = 1 turn
};

export class CurveDetector {
  private config: CurveDetectionConfig;
  private recentSamples: Sample[] = [];
  private recentBearings: number[] = [];
  private accumulatedBearingChange: number = 0;
  private curveCount: number = 0;
  private lastBearing: number | null = null;
  private isInTurn: boolean = false;
  private turnStartBearing: number | null = null;

  constructor(config?: Partial<CurveDetectionConfig>) {
    this.config = { ...DEFAULT_CURVE_CONFIG, ...config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<CurveDetectionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Process a new GPS sample and detect curves
   */
  detectCurve(sample: Sample): CurveDetectionResult {
    // Add sample to recent samples buffer
    this.recentSamples.push(sample);
    
    // Keep only the most recent samples
    if (this.recentSamples.length > this.config.smoothingWindow) {
      this.recentSamples.shift();
    }

    // Need at least 2 samples to calculate bearing
    if (this.recentSamples.length < 2) {
      return {
        isTurning: false,
        bearingChange: 0,
        turnDirection: null,
        accumulatedBearingChange: this.accumulatedBearingChange,
        curveCount: this.curveCount,
        confidence: 0,
      };
    }

    // Calculate bearing from previous sample
    const prevSample = this.recentSamples[this.recentSamples.length - 2];
    const bearing = calculateBearing(
      prevSample.lat,
      prevSample.lng,
      sample.lat,
      sample.lng
    );

    // Add to bearings buffer for smoothing
    this.recentBearings.push(bearing);
    if (this.recentBearings.length > this.config.smoothingWindow) {
      this.recentBearings.shift();
    }

    // Calculate smoothed bearing
    const smoothedBearing = this.calculateSmoothedBearing();

    // Calculate bearing change
    let bearingChange = 0;
    if (this.lastBearing !== null) {
      bearingChange = this.normalizeBearingChange(smoothedBearing - this.lastBearing);
    }

    // Check if we have enough speed and distance to register a turn
    const hasMinimumSpeed = this.hasMinimumSpeed();
    const hasMinimumDistance = this.hasMinimumDistance();

    // Detect turn direction
    const turnDirection = this.determineTurnDirection(bearingChange);

    // Update accumulated bearing change
    if (Math.abs(bearingChange) > this.config.minBearingChange && hasMinimumSpeed && hasMinimumDistance) {
      this.accumulatedBearingChange += Math.abs(bearingChange);
      
      // Start a new turn if we weren't in one
      if (!this.isInTurn) {
        this.isInTurn = true;
        this.turnStartBearing = this.lastBearing;
      }
      
      // Check if we've completed a full turn
      if (this.accumulatedBearingChange >= this.config.turnThreshold) {
        this.curveCount++;
        this.accumulatedBearingChange = 0;
        this.isInTurn = false;
        this.turnStartBearing = null;
      }
    } else {
      // Reset turn if conditions aren't met
      if (this.isInTurn && Math.abs(bearingChange) < this.config.minBearingChange * 0.5) {
        this.isInTurn = false;
        this.accumulatedBearingChange = 0;
        this.turnStartBearing = null;
      }
    }

    // Update last bearing
    this.lastBearing = smoothedBearing;

    // Calculate confidence based on speed, distance, and consistency
    const confidence = this.calculateConfidence(hasMinimumSpeed, hasMinimumDistance);

    return {
      isTurning: this.isInTurn,
      bearingChange: Math.abs(bearingChange),
      turnDirection,
      accumulatedBearingChange: this.accumulatedBearingChange,
      curveCount: this.curveCount,
      confidence,
    };
  }

  /**
   * Calculate smoothed bearing using moving average
   */
  private calculateSmoothedBearing(): number {
    if (this.recentBearings.length === 0) return 0;
    
    // Handle bearing wraparound (0-360 degrees)
    const bearings = [...this.recentBearings];
    let sum = 0;
    let prevBearing = bearings[0];
    
    for (let i = 0; i < bearings.length; i++) {
      const bearing = bearings[i];
      const normalizedBearing = this.normalizeBearingChange(bearing - prevBearing) + prevBearing;
      sum += normalizedBearing;
      prevBearing = normalizedBearing;
      bearings[i] = normalizedBearing;
    }
    
    return (sum / bearings.length) % 360;
  }

  /**
   * Normalize bearing change to handle 0-360 wraparound
   */
  private normalizeBearingChange(change: number): number {
    while (change > 180) change -= 360;
    while (change < -180) change += 360;
    return change;
  }

  /**
   * Check if we have minimum speed for turn detection
   */
  private hasMinimumSpeed(): boolean {
    if (this.recentSamples.length < 2) return false;
    
    // Calculate average speed from recent samples
    let totalDistance = 0;
    let totalTime = 0;
    
    for (let i = 1; i < this.recentSamples.length; i++) {
      const current = this.recentSamples[i];
      const previous = this.recentSamples[i - 1];
      
      const distance = haversineDistance(
        previous.lat,
        previous.lng,
        current.lat,
        current.lng
      );
      
      const time = (current.ts - previous.ts) / 1000; // Convert to seconds
      
      totalDistance += distance;
      totalTime += time;
    }
    
    if (totalTime === 0) return false;
    
    const avgSpeed = totalDistance / totalTime; // m/s
    return avgSpeed >= this.config.minSpeedForTurn;
  }

  /**
   * Check if we have minimum distance traveled
   */
  private hasMinimumDistance(): boolean {
    if (this.recentSamples.length < 2) return false;
    
    let totalDistance = 0;
    for (let i = 1; i < this.recentSamples.length; i++) {
      const current = this.recentSamples[i];
      const previous = this.recentSamples[i - 1];
      
      totalDistance += haversineDistance(
        previous.lat,
        previous.lng,
        current.lat,
        current.lng
      );
    }
    
    return totalDistance >= this.config.minDistanceForTurn;
  }

  /**
   * Determine turn direction based on bearing change
   */
  private determineTurnDirection(bearingChange: number): 'left' | 'right' | null {
    if (Math.abs(bearingChange) < this.config.minBearingChange) {
      return null;
    }
    
    // Positive bearing change = turning right (clockwise)
    // Negative bearing change = turning left (counter-clockwise)
    return bearingChange > 0 ? 'right' : 'left';
  }

  /**
   * Calculate confidence in curve detection
   */
  private calculateConfidence(hasMinimumSpeed: boolean, hasMinimumDistance: boolean): number {
    let confidence = 0.5; // Base confidence
    
    if (hasMinimumSpeed) confidence += 0.3;
    if (hasMinimumDistance) confidence += 0.2;
    
    // Higher confidence for more consistent bearing changes
    if (this.recentBearings.length >= 3) {
      const bearingVariance = this.calculateBearingVariance();
      confidence += Math.max(0, 0.2 - bearingVariance / 1000); // Lower variance = higher confidence
    }
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Calculate variance in recent bearings
   */
  private calculateBearingVariance(): number {
    if (this.recentBearings.length < 2) return 0;
    
    const mean = this.recentBearings.reduce((sum, bearing) => sum + bearing, 0) / this.recentBearings.length;
    const variance = this.recentBearings.reduce((sum, bearing) => {
      const diff = this.normalizeBearingChange(bearing - mean);
      return sum + diff * diff;
    }, 0) / this.recentBearings.length;
    
    return variance;
  }

  /**
   * Reset the detector state
   */
  reset(): void {
    this.recentSamples = [];
    this.recentBearings = [];
    this.accumulatedBearingChange = 0;
    this.curveCount = 0;
    this.lastBearing = null;
    this.isInTurn = false;
    this.turnStartBearing = null;
  }

  /**
   * Get current curve count
   */
  getCurveCount(): number {
    return this.curveCount;
  }

  /**
   * Get current state for debugging
   */
  getState(): {
    recentSamplesCount: number;
    recentBearingsCount: number;
    accumulatedBearingChange: number;
    curveCount: number;
    isInTurn: boolean;
    lastBearing: number | null;
  } {
    return {
      recentSamplesCount: this.recentSamples.length,
      recentBearingsCount: this.recentBearings.length,
      accumulatedBearingChange: this.accumulatedBearingChange,
      curveCount: this.curveCount,
      isInTurn: this.isInTurn,
      lastBearing: this.lastBearing,
    };
  }
}

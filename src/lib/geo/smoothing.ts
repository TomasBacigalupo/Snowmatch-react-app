/**
 * Data smoothing utilities for GPS tracking
 * Used to filter noise and improve accuracy of location data
 */

import { Sample } from '../types/skiRecorder';
import { haversineDistance, calculateGrade, calculateSpeed } from './haversine';

/**
 * Simple moving average filter for numeric values
 * @param values Array of numeric values
 * @param windowSize Size of the moving window
 * @returns Smoothed values array
 */
export function movingAverage(values: number[], windowSize: number): number[] {
  if (values.length === 0 || windowSize <= 0) {
    return values;
  }
  
  const result: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);
  
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(values.length, i + halfWindow + 1);
    const window = values.slice(start, end);
    const sum = window.reduce((acc, val) => acc + val, 0);
    result.push(sum / window.length);
  }
  
  return result;
}

/**
 * Exponential moving average filter
 * @param values Array of numeric values
 * @param alpha Smoothing factor (0-1, higher = more responsive)
 * @returns Smoothed values array
 */
export function exponentialMovingAverage(values: number[], alpha: number): number[] {
  if (values.length === 0 || alpha <= 0 || alpha > 1) {
    return values;
  }
  
  const result: number[] = [values[0]];
  
  for (let i = 1; i < values.length; i++) {
    const smoothed = alpha * values[i] + (1 - alpha) * result[i - 1];
    result.push(smoothed);
  }
  
  return result;
}

/**
 * Median filter to remove outliers
 * @param values Array of numeric values
 * @param windowSize Size of the window for median calculation
 * @returns Filtered values array
 */
export function medianFilter(values: number[], windowSize: number): number[] {
  if (values.length === 0 || windowSize <= 0) {
    return values;
  }
  
  const result: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);
  
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(values.length, i + halfWindow + 1);
    const window = values.slice(start, end).sort((a, b) => a - b);
    const median = window[Math.floor(window.length / 2)];
    result.push(median);
  }
  
  return result;
}

/**
 * Kalman filter for GPS coordinates
 * Simple implementation for 1D position tracking
 */
export class KalmanFilter {
  private x: number; // State estimate
  private P: number; // Error covariance
  private Q: number; // Process noise covariance
  private R: number; // Measurement noise covariance
  
  constructor(initialValue: number, processNoise: number = 0.01, measurementNoise: number = 1) {
    this.x = initialValue;
    this.P = 1;
    this.Q = processNoise;
    this.R = measurementNoise;
  }
  
  update(measurement: number): number {
    // Prediction step
    const x_pred = this.x;
    const P_pred = this.P + this.Q;
    
    // Update step
    const K = P_pred / (P_pred + this.R); // Kalman gain
    this.x = x_pred + K * (measurement - x_pred);
    this.P = (1 - K) * P_pred;
    
    return this.x;
  }
  
  getValue(): number {
    return this.x;
  }
}

/**
 * Smooth GPS samples by applying various filters
 * @param samples Array of GPS samples
 * @param options Filtering options
 * @returns Smoothed samples array
 */
export function smoothSamples(
  samples: Sample[],
  options: {
    enableSpeedSmoothing?: boolean;
    enableAltitudeSmoothing?: boolean;
    speedWindowSize?: number;
    altitudeWindowSize?: number;
    maxSpeedMs?: number;
    maxAccuracyM?: number;
  } = {}
): Sample[] {
  if (samples.length === 0) {
    return samples;
  }
  
  const {
    enableSpeedSmoothing = true,
    enableAltitudeSmoothing = true,
    speedWindowSize = 5,
    altitudeWindowSize = 7,
    maxSpeedMs = 60,
    maxAccuracyM = 50,
  } = options;
  
  // Filter out samples with poor accuracy or impossible speeds
  let filteredSamples = samples.filter(sample => {
    if (sample.accuracyM && sample.accuracyM > maxAccuracyM) {
      return false;
    }
    if (sample.speedMs && sample.speedMs > maxSpeedMs) {
      return false;
    }
    return true;
  });
  
  if (filteredSamples.length === 0) {
    return samples; // Return original if all filtered out
  }
  
  // Calculate speeds if not provided
  const samplesWithSpeed = filteredSamples.map((sample, index) => {
    if (sample.speedMs !== undefined) {
      return sample;
    }
    
    if (index === 0) {
      return { ...sample, speedMs: 0 };
    }
    
    const prevSample = filteredSamples[index - 1];
    const distance = haversineDistance(
      prevSample.lat,
      prevSample.lng,
      sample.lat,
      sample.lng
    );
    const timeMs = sample.ts - prevSample.ts;
    const speed = calculateSpeed(distance, timeMs);
    
    return { ...sample, speedMs: speed };
  });
  
  // Smooth speeds
  if (enableSpeedSmoothing && samplesWithSpeed.length > speedWindowSize) {
    const speeds = samplesWithSpeed.map(s => s.speedMs || 0);
    const smoothedSpeeds = movingAverage(speeds, speedWindowSize);
    
    samplesWithSpeed.forEach((sample, index) => {
      sample.speedMs = smoothedSpeeds[index];
    });
  }
  
  // Smooth altitudes
  if (enableAltitudeSmoothing && samplesWithSpeed.length > altitudeWindowSize) {
    const altitudes = samplesWithSpeed
      .map(s => s.altM)
      .filter(alt => alt !== undefined) as number[];
    
    if (altitudes.length > altitudeWindowSize) {
      const smoothedAltitudes = movingAverage(altitudes, altitudeWindowSize);
      let altIndex = 0;
      
      samplesWithSpeed.forEach(sample => {
        if (sample.altM !== undefined) {
          sample.altM = smoothedAltitudes[altIndex];
          altIndex++;
        }
      });
    }
  }
  
  return samplesWithSpeed;
}

/**
 * Detect and remove GPS jumps (outliers)
 * @param samples Array of GPS samples
 * @param maxJumpDistance Maximum allowed distance between consecutive samples (meters)
 * @returns Filtered samples array
 */
export function removeGpsJumps(
  samples: Sample[],
  maxJumpDistance: number = 100
): Sample[] {
  if (samples.length <= 1) {
    return samples;
  }
  
  const result: Sample[] = [samples[0]];
  
  for (let i = 1; i < samples.length; i++) {
    const prevSample = result[result.length - 1];
    const currentSample = samples[i];
    
    const distance = haversineDistance(
      prevSample.lat,
      prevSample.lng,
      currentSample.lat,
      currentSample.lng
    );
    
    if (distance <= maxJumpDistance) {
      result.push(currentSample);
    } else {
      console.warn(`GPS jump detected: ${distance.toFixed(2)}m, skipping sample`);
    }
  }
  
  return result;
}

/**
 * Calculate grade (slope) for a series of samples
 * @param samples Array of GPS samples with altitude data
 * @returns Array of grade values (decimal, positive = uphill, negative = downhill)
 */
export function calculateGrades(samples: Sample[]): number[] {
  if (samples.length < 2) {
    return [];
  }
  
  const grades: number[] = [0]; // First sample has no grade
  
  for (let i = 1; i < samples.length; i++) {
    const prevSample = samples[i - 1];
    const currentSample = samples[i];
    
    if (prevSample.altM !== undefined && currentSample.altM !== undefined) {
      const grade = calculateGrade(
        prevSample.lat,
        prevSample.lng,
        prevSample.altM,
        currentSample.lat,
        currentSample.lng,
        currentSample.altM
      );
      grades.push(grade);
    } else {
      grades.push(0);
    }
  }
  
  return grades;
}

/**
 * Calculate vertical rate (altitude change per second)
 * @param samples Array of GPS samples with altitude data
 * @returns Array of vertical rates in m/s
 */
export function calculateVerticalRates(samples: Sample[]): number[] {
  if (samples.length < 2) {
    return [];
  }
  
  const rates: number[] = [0]; // First sample has no rate
  
  for (let i = 1; i < samples.length; i++) {
    const prevSample = samples[i - 1];
    const currentSample = samples[i];
    
    if (prevSample.altM !== undefined && currentSample.altM !== undefined) {
      const timeSeconds = (currentSample.ts - prevSample.ts) / 1000;
      const altitudeChange = currentSample.altM - prevSample.altM;
      const rate = timeSeconds > 0 ? altitudeChange / timeSeconds : 0;
      rates.push(rate);
    } else {
      rates.push(0);
    }
  }
  
  return rates;
}

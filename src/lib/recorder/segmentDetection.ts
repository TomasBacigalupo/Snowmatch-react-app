/**
 * Real-time segment detection for ski activities
 * Classifies GPS samples as DOWNHILL or UPHILL segments
 */

import { Sample, SegmentKind, SegmentDetectionConfig } from '../types/skiRecorder';
import { haversineDistance, calculateGrade, calculateSpeed } from '../geo/haversine';
import { movingAverage } from '../geo/smoothing';

export interface SegmentDetectionResult {
  kind: SegmentKind;
  confidence: number; // 0-1, how confident we are in this classification
  speed: number; // m/s
  grade: number; // decimal slope
  verticalRate: number; // m/s
}

export class SegmentDetector {
  private config: SegmentDetectionConfig;
  private recentSamples: Sample[] = [];
  private consecutiveClassifications: SegmentKind[] = [];
  private lastClassification: SegmentKind = 'UPHILL';
  private lastClassificationTime: number = 0;

  constructor(config: SegmentDetectionConfig) {
    this.config = config;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SegmentDetectionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Classify a new GPS sample
   * @param sample New GPS sample
   * @returns Classification result
   */
  classifySample(sample: Sample): SegmentDetectionResult {
    // Add sample to recent samples buffer
    this.recentSamples.push(sample);
    
    // Keep only the most recent samples
    if (this.recentSamples.length > this.config.rollingWindowSize) {
      this.recentSamples.shift();
    }

    // Need at least 2 samples to calculate speed and grade
    if (this.recentSamples.length < 2) {
      return {
        kind: 'UPHILL',
        confidence: 0,
        speed: 0,
        grade: 0,
        verticalRate: 0,
      };
    }

    // Calculate metrics for the most recent sample
    const metrics = this.calculateMetrics(sample);
    
    // Apply smoothing to reduce noise
    const smoothedMetrics = this.smoothMetrics(metrics);
    
    // Classify based on smoothed metrics
    const classification = this.classifyMetrics(smoothedMetrics);
    
    // Apply hysteresis to prevent flickering
    const finalClassification = this.applyHysteresis(classification);
    
    return {
      kind: finalClassification,
      confidence: this.calculateConfidence(smoothedMetrics, finalClassification),
      speed: smoothedMetrics.speed,
      grade: smoothedMetrics.grade,
      verticalRate: smoothedMetrics.verticalRate,
    };
  }

  /**
   * Calculate speed, grade, and vertical rate for a sample
   */
  private calculateMetrics(sample: Sample): {
    speed: number;
    grade: number;
    verticalRate: number;
  } {
    const prevSample = this.recentSamples[this.recentSamples.length - 2];
    
    // Calculate horizontal distance and time
    const distance = haversineDistance(
      prevSample.lat,
      prevSample.lng,
      sample.lat,
      sample.lng
    );
    const timeMs = sample.ts - prevSample.ts;
    
    // Calculate speed
    let speed = 0;
    if (timeMs > 0) {
      speed = calculateSpeed(distance, timeMs);
    }
    
    // Use provided speed if available and reasonable
    if (sample.speedMs !== undefined && sample.speedMs < this.config.maxSpeedMs) {
      speed = sample.speedMs;
    }
    
    // Calculate grade and vertical rate
    let grade = 0;
    let verticalRate = 0;
    
    if (prevSample.altM !== undefined && sample.altM !== undefined && distance > 0) {
      grade = calculateGrade(
        prevSample.lat,
        prevSample.lng,
        prevSample.altM,
        sample.lat,
        sample.lng,
        sample.altM
      );
      
      if (timeMs > 0) {
        verticalRate = (sample.altM - prevSample.altM) / (timeMs / 1000);
      }
    }
    
    return { speed, grade, verticalRate };
  }

  /**
   * Apply smoothing to reduce noise in metrics
   */
  private smoothMetrics(metrics: {
    speed: number;
    grade: number;
    verticalRate: number;
  }): {
    speed: number;
    grade: number;
    verticalRate: number;
  } {
    // Collect recent metrics for smoothing
    const recentSpeeds: number[] = [];
    const recentGrades: number[] = [];
    const recentVerticalRates: number[] = [];
    
    for (let i = 1; i < this.recentSamples.length; i++) {
      const currentSample = this.recentSamples[i];
      const prevSample = this.recentSamples[i - 1];
      
      const distance = haversineDistance(
        prevSample.lat,
        prevSample.lng,
        currentSample.lat,
        currentSample.lng
      );
      const timeMs = currentSample.ts - prevSample.ts;
      
      if (timeMs > 0) {
        const speed = calculateSpeed(distance, timeMs);
        recentSpeeds.push(speed);
        
        if (prevSample.altM !== undefined && currentSample.altM !== undefined && distance > 0) {
          const grade = calculateGrade(
            prevSample.lat,
            prevSample.lng,
            prevSample.altM,
            currentSample.lat,
            currentSample.lng,
            currentSample.altM
          );
          recentGrades.push(grade);
          
          const verticalRate = (currentSample.altM - prevSample.altM) / (timeMs / 1000);
          recentVerticalRates.push(verticalRate);
        }
      }
    }
    
    // Apply moving average smoothing
    const windowSize = Math.min(3, recentSpeeds.length);
    const smoothedSpeeds = movingAverage(recentSpeeds, windowSize);
    const smoothedGrades = movingAverage(recentGrades, windowSize);
    const smoothedVerticalRates = movingAverage(recentVerticalRates, windowSize);
    
    return {
      speed: smoothedSpeeds[smoothedSpeeds.length - 1] || metrics.speed,
      grade: smoothedGrades[smoothedGrades.length - 1] || metrics.grade,
      verticalRate: smoothedVerticalRates[smoothedVerticalRates.length - 1] || metrics.verticalRate,
    };
  }

  /**
   * Classify metrics as DOWNHILL or UPHILL
   */
  private classifyMetrics(metrics: {
    speed: number;
    grade: number;
    verticalRate: number;
  }): SegmentKind {
    const { speed, grade } = metrics;
    
    // Primary classification rule: speed > threshold AND grade <= threshold
    if (speed > this.config.speedThresholdMs && grade <= this.config.gradeThreshold) {
      return 'DOWNHILL';
    }
    
    // Secondary rule: if we have altitude data, use vertical rate
    if (metrics.verticalRate < -0.5) { // Descending at > 0.5 m/s
      return 'DOWNHILL';
    }
    
    return 'UPHILL';
  }

  /**
   * Apply hysteresis to prevent rapid switching between classifications
   */
  private applyHysteresis(classification: SegmentKind): SegmentKind {
    // Add to consecutive classifications
    this.consecutiveClassifications.push(classification);
    
    // Keep only recent classifications
    if (this.consecutiveClassifications.length > this.config.consecutiveSamplesRequired) {
      this.consecutiveClassifications.shift();
    }
    
    // Check if we have enough consecutive samples of the same type
    if (this.consecutiveClassifications.length >= this.config.consecutiveSamplesRequired) {
      const allSame = this.consecutiveClassifications.every(c => c === classification);
      
      if (allSame) {
        this.lastClassification = classification;
        this.lastClassificationTime = Date.now();
        this.consecutiveClassifications = []; // Reset
        return classification;
      }
    }
    
    // Return last stable classification
    return this.lastClassification;
  }

  /**
   * Calculate confidence in the classification
   */
  private calculateConfidence(
    metrics: { speed: number; grade: number; verticalRate: number },
    classification: SegmentKind
  ): number {
    const { speed, grade, verticalRate } = metrics;
    
    let confidence = 0.5; // Base confidence
    
    if (classification === 'DOWNHILL') {
      // Higher confidence for faster speeds and steeper descents
      const speedFactor = Math.min(speed / this.config.speedThresholdMs, 2);
      const gradeFactor = Math.min(Math.abs(grade) / Math.abs(this.config.gradeThreshold), 2);
      confidence = Math.min(0.5 + (speedFactor + gradeFactor) * 0.2, 1.0);
      
      // Boost confidence if vertical rate confirms descent
      if (verticalRate < -0.3) {
        confidence = Math.min(confidence + 0.2, 1.0);
      }
    } else {
      // UPHILL classification
      if (speed < this.config.speedThresholdMs * 0.5) {
        confidence = 0.8; // High confidence for slow speeds
      }
      
      // Boost confidence if vertical rate confirms ascent
      if (verticalRate > 0.3) {
        confidence = Math.min(confidence + 0.2, 1.0);
      }
    }
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Reset the detector state
   */
  reset(): void {
    this.recentSamples = [];
    this.consecutiveClassifications = [];
    this.lastClassification = 'UPHILL';
    this.lastClassificationTime = 0;
  }

  /**
   * Get current state for debugging
   */
  getState(): {
    recentSamplesCount: number;
    consecutiveClassifications: SegmentKind[];
    lastClassification: SegmentKind;
    lastClassificationTime: number;
  } {
    return {
      recentSamplesCount: this.recentSamples.length,
      consecutiveClassifications: [...this.consecutiveClassifications],
      lastClassification: this.lastClassification,
      lastClassificationTime: this.lastClassificationTime,
    };
  }
}

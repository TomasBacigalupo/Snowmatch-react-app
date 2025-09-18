/**
 * React hook for the Ski Activity Recorder
 * Provides a clean interface to the SkiRecorder class
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { SkiRecorder } from './SkiRecorder';
import { 
  RecordingStatus, 
  Activity, 
  Segment, 
  Sample,
  LiveMetrics, 
  SkiRecorderConfig,
  SkiRecorderHook,
  DEFAULT_CONFIG 
} from '../types/skiRecorder';

export function useSkiRecorder(initialConfig?: Partial<SkiRecorderConfig>): SkiRecorderHook {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [metrics, setMetrics] = useState<LiveMetrics>({
    duration: 0,
    distance: 0,
    currentSpeed: 0,
    maxSpeed: 0,
    avgSpeed: 0,
    totalAscent: 0,
    totalDescent: 0,
    currentSegmentKind: null,
    sampleCount: 0,
    curveCount: 0,
  });
  const [config, setConfig] = useState<SkiRecorderConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  const recorderRef = useRef<SkiRecorder | null>(null);

  // Initialize recorder
  useEffect(() => {
    recorderRef.current = new SkiRecorder(config);
    
    // Set up event callbacks
    recorderRef.current.setCallbacks({
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        setCurrentActivity(recorderRef.current?.getCurrentActivity() || null);
        setSamples(recorderRef.current?.getSamples() || []);
        setSegments(recorderRef.current?.getSegments() || []);
      },
      onMetricsUpdate: (newMetrics) => {
        setMetrics(newMetrics);
        setSamples(recorderRef.current?.getSamples() || []);
        setSegments(recorderRef.current?.getSegments() || []);
      },
      onSegmentChange: (newSegment) => {
        setCurrentSegment(newSegment);
        setSamples(recorderRef.current?.getSamples() || []);
        setSegments(recorderRef.current?.getSegments() || []);
      },
    });

    return () => {
      // Cleanup on unmount
      if (recorderRef.current) {
        recorderRef.current.discardRecording().catch(console.error);
      }
    };
  }, []);

  // Update config when it changes
  useEffect(() => {
    if (recorderRef.current) {
      recorderRef.current.updateConfig(config);
    }
  }, [config]);

  const startRecording = useCallback(async () => {
    if (!recorderRef.current) {
      throw new Error('Recorder not initialized');
    }
    
    try {
      await recorderRef.current.startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (!recorderRef.current) {
      throw new Error('Recorder not initialized');
    }
    
    try {
      recorderRef.current.pauseRecording();
    } catch (error) {
      console.error('Failed to pause recording:', error);
      throw error;
    }
  }, []);

  const resumeRecording = useCallback(async () => {
    if (!recorderRef.current) {
      throw new Error('Recorder not initialized');
    }
    
    try {
      await recorderRef.current.resumeRecording();
    } catch (error) {
      console.error('Failed to resume recording:', error);
      throw error;
    }
  }, []);

  const finishRecording = useCallback(async (notes?: string) => {
    if (!recorderRef.current) {
      throw new Error('Recorder not initialized');
    }
    
    try {
      const activity = await recorderRef.current.finishRecording(notes);
      return activity;
    } catch (error) {
      console.error('Failed to finish recording:', error);
      throw error;
    }
  }, []);

  const discardRecording = useCallback(async () => {
    if (!recorderRef.current) {
      throw new Error('Recorder not initialized');
    }
    
    try {
      await recorderRef.current.discardRecording();
    } catch (error) {
      console.error('Failed to discard recording:', error);
      throw error;
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SkiRecorderConfig>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig,
    }));
  }, []);

  return {
    status,
    currentActivity,
    currentSegment,
    samples,
    segments,
    metrics,
    config,
    startRecording,
    pauseRecording,
    resumeRecording,
    finishRecording,
    discardRecording,
    updateConfig,
  };
}

/**
 * Ski Activity Recorder persistence — browser localStorage (web).
 */

import { Activity, Segment, Sample } from '../types/skiRecorder';

const STORAGE_KEY = 'ski_recorder_web_v1';

interface Stored {
  activities: Activity[];
  segments: Segment[];
  samples: Sample[];
  nextSampleId: number;
}

class SkiRecorderDatabase {
  private data: Stored | null = null;

  private readStore(): Stored {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as Stored;
      }
    } catch (e) {
      console.warn('Ski recorder storage read failed', e);
    }
    return {
      activities: [],
      segments: [],
      samples: [],
      nextSampleId: 1,
    };
  }

  private persist(): void {
    if (!this.data) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  async initialize(): Promise<void> {
    this.data = this.readStore();
    console.log('✅ Ski Recorder Database initialized (browser storage)');
  }

  async createActivity(activity: Activity): Promise<void> {
    if (!this.data) throw new Error('Database not initialized');
    this.data.activities.push({ ...activity });
    this.persist();
  }

  async updateActivity(activity: Activity): Promise<void> {
    if (!this.data) throw new Error('Database not initialized');
    const i = this.data.activities.findIndex((a) => a.id === activity.id);
    if (i === -1) throw new Error(`Activity ${activity.id} not found`);
    this.data.activities[i] = { ...activity };
    this.persist();
  }

  async getActivity(id: string): Promise<Activity | null> {
    if (!this.data) throw new Error('Database not initialized');
    return this.data.activities.find((a) => a.id === id) ?? null;
  }

  async getAllActivities(): Promise<Activity[]> {
    if (!this.data) throw new Error('Database not initialized');
    return [...this.data.activities].sort((a, b) => b.startedAt - a.startedAt);
  }

  async deleteActivity(id: string): Promise<void> {
    if (!this.data) throw new Error('Database not initialized');
    this.data.activities = this.data.activities.filter((a) => a.id !== id);
    this.data.segments = this.data.segments.filter((s) => s.activityId !== id);
    this.data.samples = this.data.samples.filter((s) => s.activityId !== id);
    this.persist();
  }

  async createSegment(segment: Segment): Promise<void> {
    if (!this.data) throw new Error('Database not initialized');
    this.data.segments.push({ ...segment });
    this.persist();
  }

  async updateSegment(segment: Segment): Promise<void> {
    if (!this.data) throw new Error('Database not initialized');
    const i = this.data.segments.findIndex((s) => s.id === segment.id);
    if (i === -1) throw new Error(`Segment ${segment.id} not found`);
    this.data.segments[i] = { ...segment };
    this.persist();
  }

  async getSegmentsByActivity(activityId: string): Promise<Segment[]> {
    if (!this.data) throw new Error('Database not initialized');
    return this.data.segments
      .filter((s) => s.activityId === activityId)
      .sort((a, b) => a.startedAt - b.startedAt);
  }

  async createSample(sample: Sample): Promise<number> {
    if (!this.data) throw new Error('Database not initialized');
    const id = this.data.nextSampleId++;
    const row: Sample = { ...sample, id };
    this.data.samples.push(row);
    this.persist();
    return id;
  }

  async createSamplesBatch(samples: Sample[]): Promise<void> {
    if (!this.data) throw new Error('Database not initialized');
    if (samples.length === 0) return;
    for (const sample of samples) {
      const id = this.data.nextSampleId++;
      this.data.samples.push({ ...sample, id });
    }
    this.persist();
    console.log(`✅ Inserted ${samples.length} GPS samples in batch`);
  }

  async getSamplesByActivity(activityId: string): Promise<Sample[]> {
    if (!this.data) throw new Error('Database not initialized');
    return this.data.samples
      .filter((s) => s.activityId === activityId)
      .sort((a, b) => a.ts - b.ts);
  }

  async getSamplesBySegment(segmentId: string): Promise<Sample[]> {
    if (!this.data) throw new Error('Database not initialized');
    return this.data.samples
      .filter((s) => s.segmentId === segmentId)
      .sort((a, b) => a.ts - b.ts);
  }

  async close(): Promise<void> {
    this.data = null;
  }

  async isInitialized(): Promise<boolean> {
    return this.data !== null;
  }
}

export const skiRecorderDB = new SkiRecorderDatabase();

/**
 * SQLite database service for the Ski Activity Recorder
 * Handles all database operations for activities, segments, and samples
 */

import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';
import { Activity, Segment, Sample } from '../types/skiRecorder';

class SkiRecorderDatabase {
  private db: SQLiteDBConnection | null = null;
  private sqlite: SQLiteConnection | null = null;
  private readonly DB_NAME = 'ski_recorder';
  private readonly DB_VERSION = 1;

  /**
   * Initialize the database connection and create tables
   */
  async initialize(): Promise<void> {
    try {
      // Create SQLite connection - skip availability check for iOS compatibility
      this.sqlite = new SQLiteConnection(CapacitorSQLite);

      // Check if database exists
      const ret = await this.sqlite.checkConnectionsConsistency({
        dbNames: [this.DB_NAME],
      });

      const isConn = (await this.sqlite.isConnection(this.DB_NAME, false)).result;

      if (ret.result && isConn) {
        this.db = await this.sqlite.retrieveConnection(this.DB_NAME, false);
      } else {
        // Create connection with iOS-optimized settings
        this.db = await this.sqlite.createConnection(
          this.DB_NAME,
          false, // isEncryption: false for better performance
          'no-encryption',
          this.DB_VERSION,
          false // inBackground: false for better reliability
        );
      }

      // Open the database
      await this.db.open();

      // Create tables
      await this.createTables();

      console.log('✅ Ski Recorder Database initialized successfully on iOS');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const createActivitiesTable = `
      CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        total_distance_m REAL DEFAULT 0,
        total_descent_m REAL DEFAULT 0,
        total_ascent_m REAL DEFAULT 0,
        max_speed_ms REAL DEFAULT 0,
        avg_speed_ms REAL DEFAULT 0,
        downhill_time_ms INTEGER DEFAULT 0,
        uphill_time_ms INTEGER DEFAULT 0,
        notes TEXT
      );
    `;

    const createSegmentsTable = `
      CREATE TABLE IF NOT EXISTS segments (
        id TEXT PRIMARY KEY,
        activity_id TEXT NOT NULL,
        kind TEXT CHECK(kind IN ('DOWNHILL','UPHILL')) NOT NULL,
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        distance_m REAL DEFAULT 0,
        descent_m REAL DEFAULT 0,
        ascent_m REAL DEFAULT 0,
        max_speed_ms REAL DEFAULT 0,
        FOREIGN KEY(activity_id) REFERENCES activities(id) ON DELETE CASCADE
      );
    `;

    const createSamplesTable = `
      CREATE TABLE IF NOT EXISTS samples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_id TEXT NOT NULL,
        segment_id TEXT,
        ts INTEGER NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        alt_m REAL,
        accuracy_m REAL,
        speed_ms REAL,
        FOREIGN KEY(activity_id) REFERENCES activities(id) ON DELETE CASCADE
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_samples_activity ON samples(activity_id);
      CREATE INDEX IF NOT EXISTS idx_samples_segment ON samples(segment_id);
      CREATE INDEX IF NOT EXISTS idx_activities_started_at ON activities(started_at);
      CREATE INDEX IF NOT EXISTS idx_segments_activity_id ON segments(activity_id);
    `;

    try {
      await this.db.execute(createActivitiesTable);
      await this.db.execute(createSegmentsTable);
      await this.db.execute(createSamplesTable);
      await this.db.execute(createIndexes);
    } catch (error) {
      console.error('Failed to create tables:', error);
      throw error;
    }
  }

  /**
   * Activity operations with iOS optimizations
   */
  async createActivity(activity: Activity): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = `
      INSERT INTO activities (
        id, started_at, ended_at, total_distance_m, total_descent_m, 
        total_ascent_m, max_speed_ms, avg_speed_ms, downhill_time_ms, 
        uphill_time_ms, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.run(query, [
      activity.id,
      activity.startedAt,
      activity.endedAt || null,
      activity.totalDistanceM,
      activity.totalDescentM,
      activity.totalAscentM,
      activity.maxSpeedMs,
      activity.avgSpeedMs,
      activity.downhillTimeMs,
      activity.uphillTimeMs,
      activity.notes || null,
    ]);
  }

  async updateActivity(activity: Activity): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = `
      UPDATE activities SET
        ended_at = ?, total_distance_m = ?, total_descent_m = ?,
        total_ascent_m = ?, max_speed_ms = ?, avg_speed_ms = ?,
        downhill_time_ms = ?, uphill_time_ms = ?, notes = ?
      WHERE id = ?
    `;

    await this.db.run(query, [
      activity.endedAt || null,
      activity.totalDistanceM,
      activity.totalDescentM,
      activity.totalAscentM,
      activity.maxSpeedMs,
      activity.avgSpeedMs,
      activity.downhillTimeMs,
      activity.uphillTimeMs,
      activity.notes || null,
      activity.id,
    ]);
  }

  async getActivity(id: string): Promise<Activity | null> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'SELECT * FROM activities WHERE id = ?';
    const result = await this.db.query(query, [id]);

    if (result.values && result.values.length > 0) {
      const row = result.values[0] as any;
      return {
        id: row.id,
        startedAt: row.started_at,
        endedAt: row.ended_at,
        totalDistanceM: row.total_distance_m,
        totalDescentM: row.total_descent_m,
        totalAscentM: row.total_ascent_m,
        maxSpeedMs: row.max_speed_ms,
        avgSpeedMs: row.avg_speed_ms,
        downhillTimeMs: row.downhill_time_ms,
        uphillTimeMs: row.uphill_time_ms,
        notes: row.notes,
      };
    }

    return null;
  }

  async getAllActivities(): Promise<Activity[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'SELECT * FROM activities ORDER BY started_at DESC';
    const result = await this.db.query(query);

    if (result.values) {
      return result.values.map((row: any) => ({
        id: row.id,
        startedAt: row.started_at,
        endedAt: row.ended_at,
        totalDistanceM: row.total_distance_m,
        totalDescentM: row.total_descent_m,
        totalAscentM: row.total_ascent_m,
        maxSpeedMs: row.max_speed_ms,
        avgSpeedMs: row.avg_speed_ms,
        downhillTimeMs: row.downhill_time_ms,
        uphillTimeMs: row.uphill_time_ms,
        notes: row.notes,
      }));
    }

    return [];
  }

  async deleteActivity(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'DELETE FROM activities WHERE id = ?';
    await this.db.run(query, [id]);
  }

  /**
   * Segment operations
   */
  async createSegment(segment: Segment): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = `
      INSERT INTO segments (
        id, activity_id, kind, started_at, ended_at,
        distance_m, descent_m, ascent_m, max_speed_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.run(query, [
      segment.id,
      segment.activityId,
      segment.kind,
      segment.startedAt,
      segment.endedAt || null,
      segment.distanceM,
      segment.descentM,
      segment.ascentM,
      segment.maxSpeedMs,
    ]);
  }

  async updateSegment(segment: Segment): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = `
      UPDATE segments SET
        ended_at = ?, distance_m = ?, descent_m = ?,
        ascent_m = ?, max_speed_ms = ?
      WHERE id = ?
    `;

    await this.db.run(query, [
      segment.endedAt || null,
      segment.distanceM,
      segment.descentM,
      segment.ascentM,
      segment.maxSpeedMs,
      segment.id,
    ]);
  }

  async getSegmentsByActivity(activityId: string): Promise<Segment[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'SELECT * FROM segments WHERE activity_id = ? ORDER BY started_at';
    const result = await this.db.query(query, [activityId]);

    if (result.values) {
      return result.values.map((row: any) => ({
        id: row.id,
        activityId: row.activity_id,
        kind: row.kind,
        startedAt: row.started_at,
        endedAt: row.ended_at,
        distanceM: row.distance_m,
        descentM: row.descent_m,
        ascentM: row.ascent_m,
        maxSpeedMs: row.max_speed_ms,
      }));
    }

    return [];
  }

  /**
   * Sample operations
   */
  async createSample(sample: Sample): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = `
      INSERT INTO samples (
        activity_id, segment_id, ts, lat, lng, alt_m, accuracy_m, speed_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await this.db.run(query, [
      sample.activityId,
      sample.segmentId || null,
      sample.ts,
      sample.lat,
      sample.lng,
      sample.altM || null,
      sample.accuracyM || null,
      sample.speedMs || null,
    ]);

    return result.changes?.lastId || 0;
  }

  /**
   * Batch insert samples for better iOS performance
   */
  async createSamplesBatch(samples: Sample[]): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    if (samples.length === 0) return;

    const query = `
      INSERT INTO samples (
        activity_id, segment_id, ts, lat, lng, alt_m, accuracy_m, speed_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      for (const sample of samples) {
        await this.db.run(query, [
          sample.activityId,
          sample.segmentId || null,
          sample.ts,
          sample.lat,
          sample.lng,
          sample.altM || null,
          sample.accuracyM || null,
          sample.speedMs || null,
        ]);
      }

      console.log(`✅ Inserted ${samples.length} GPS samples in batch`);
    } catch (error) {
      console.error('❌ Batch insert failed:', error);
      throw error;
    }
  }

  async getSamplesByActivity(activityId: string): Promise<Sample[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'SELECT * FROM samples WHERE activity_id = ? ORDER BY ts';
    const result = await this.db.query(query, [activityId]);

    if (result.values) {
      return result.values.map((row: any) => ({
        id: row.id,
        activityId: row.activity_id,
        segmentId: row.segment_id,
        ts: row.ts,
        lat: row.lat,
        lng: row.lng,
        altM: row.alt_m,
        accuracyM: row.accuracy_m,
        speedMs: row.speed_ms,
      }));
    }

    return [];
  }

  async getSamplesBySegment(segmentId: string): Promise<Sample[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const query = 'SELECT * FROM samples WHERE segment_id = ? ORDER BY ts';
    const result = await this.db.query(query, [segmentId]);

    if (result.values) {
      return result.values.map((row: any) => ({
        id: row.id,
        activityId: row.activity_id,
        segmentId: row.segment_id,
        ts: row.ts,
        lat: row.lat,
        lng: row.lng,
        altM: row.alt_m,
        accuracyM: row.accuracy_m,
        speedMs: row.speed_ms,
      }));
    }

    return [];
  }

  /**
   * Utility methods
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
    if (this.sqlite) {
      await this.sqlite.closeConnection(this.DB_NAME, false);
      this.sqlite = null;
    }
  }

  async isInitialized(): Promise<boolean> {
    return this.db !== null;
  }
}

// Export singleton instance
export const skiRecorderDB = new SkiRecorderDatabase();

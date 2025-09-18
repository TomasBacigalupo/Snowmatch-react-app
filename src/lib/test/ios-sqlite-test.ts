/**
 * iOS SQLite Test - Optimized for @capacitor-community/sqlite
 * Tests the ski tracking database functionality on iOS
 */

import { skiRecorderDB } from '../db/sqlite';
import { Activity, Segment, Sample } from '../types/skiRecorder';

export class IOSSQLiteTest {
  async runComprehensiveTest(): Promise<{
    success: boolean;
    results: {
      databaseInit: boolean;
      activityCreation: boolean;
      batchSampleInsert: boolean;
      dataRetrieval: boolean;
      performance: {
        sampleInsertTime: number;
        queryTime: number;
        totalTime: number;
      };
      error?: string;
    };
  }> {
    const startTime = Date.now();
    const results = {
      databaseInit: false,
      activityCreation: false,
      batchSampleInsert: false,
      dataRetrieval: false,
      performance: {
        sampleInsertTime: 0,
        queryTime: 0,
        totalTime: 0,
      },
      error: undefined as string | undefined,
    };

    try {
      console.log('🧪 Starting iOS SQLite Comprehensive Test...');

      // Test 1: Initialize database
      console.log('📱 Initializing database...');
      try {
        await skiRecorderDB.initialize();
        results.databaseInit = true;
        console.log('✅ Database initialized successfully');
      } catch (initError) {
        console.error('❌ Database initialization failed:', initError);
        results.error = `Database initialization failed: ${initError instanceof Error ? initError.message : 'Unknown error'}`;
        return { success: false, results };
      }

      // Test 2: Create test activity
      console.log('🏔️ Creating test ski activity...');
      const testActivity: Activity = {
        id: `test-${Date.now()}`,
        startedAt: Date.now() - 3600000, // 1 hour ago
        endedAt: Date.now(),
        totalDistanceM: 5000, // 5km
        totalDescentM: 800, // 800m descent
        totalAscentM: 50, // 50m ascent (lifts)
        maxSpeedMs: 15, // 54 km/h
        avgSpeedMs: 5, // 18 km/h
        downhillTimeMs: 3000000, // 50 minutes
        uphillTimeMs: 600000, // 10 minutes
        notes: 'iOS Test Activity',
      };

      try {
        await skiRecorderDB.createActivity(testActivity);
        results.activityCreation = true;
        console.log('✅ Test activity created');
      } catch (activityError) {
        console.error('❌ Activity creation failed:', activityError);
        results.error = `Activity creation failed: ${activityError instanceof Error ? activityError.message : 'Unknown error'}`;
        return { success: false, results };
      }

      // Test 3: Create test samples (GPS points)
      console.log('📍 Creating GPS samples...');
      const sampleStartTime = Date.now();
      const testSamples: Sample[] = [];

      // Generate 100 GPS samples for testing
      for (let i = 0; i < 100; i++) {
        const timestamp = testActivity.startedAt + (i * 36000); // Every 36 seconds
        const lat = -41.1335 + (i * 0.0001); // Moving south
        const lng = -71.3103 + (i * 0.0001); // Moving west
        const alt = 1200 - (i * 8); // Descending 8m per sample

        testSamples.push({
          activityId: testActivity.id,
          ts: timestamp,
          lat,
          lng,
          altM: alt,
          accuracyM: 5 + Math.random() * 10, // 5-15m accuracy
          speedMs: 2 + Math.random() * 10, // 2-12 m/s
        });
      }

      try {
        await skiRecorderDB.createSamplesBatch(testSamples);
        results.batchSampleInsert = true;
        results.performance.sampleInsertTime = Date.now() - sampleStartTime;
        console.log(`✅ ${testSamples.length} GPS samples inserted in ${results.performance.sampleInsertTime}ms`);
      } catch (sampleError) {
        console.error('❌ Batch sample insert failed:', sampleError);
        results.error = `Batch sample insert failed: ${sampleError instanceof Error ? sampleError.message : 'Unknown error'}`;
        return { success: false, results };
      }

      // Test 4: Retrieve and verify data
      console.log('📖 Retrieving test data...');
      const queryStartTime = Date.now();
      
      try {
        const retrievedActivity = await skiRecorderDB.getActivity(testActivity.id);
        const retrievedSamples = await skiRecorderDB.getSamplesByActivity(testActivity.id);
        
        results.performance.queryTime = Date.now() - queryStartTime;

        if (retrievedActivity && retrievedSamples.length === testSamples.length) {
          results.dataRetrieval = true;
          console.log(`✅ Data retrieval successful: ${retrievedSamples.length} samples`);
          console.log(`📊 Activity: ${retrievedActivity.totalDistanceM}m distance, ${retrievedActivity.totalDescentM}m descent`);
        } else {
          throw new Error(`Data retrieval mismatch: Expected ${testSamples.length} samples, got ${retrievedSamples.length}`);
        }
      } catch (retrievalError) {
        console.error('❌ Data retrieval failed:', retrievalError);
        results.error = `Data retrieval failed: ${retrievalError instanceof Error ? retrievalError.message : 'Unknown error'}`;
        return { success: false, results };
      }

      // Test 5: Performance metrics
      results.performance.totalTime = Date.now() - startTime;
      
      console.log('📈 Performance Metrics:');
      console.log(`   - Sample Insert Time: ${results.performance.sampleInsertTime}ms`);
      console.log(`   - Query Time: ${results.performance.queryTime}ms`);
      console.log(`   - Total Test Time: ${results.performance.totalTime}ms`);

      // Test 6: Cleanup
      await skiRecorderDB.deleteActivity(testActivity.id);
      console.log('🧹 Test data cleaned up');

      console.log('🎉 iOS SQLite Test completed successfully!');
      return { success: true, results };

    } catch (error) {
      console.error('❌ iOS SQLite Test failed:', error);
      results.error = error instanceof Error ? error.message : 'Unknown error';
      results.performance.totalTime = Date.now() - startTime;
      return { success: false, results };
    }
  }

  /**
   * Quick test for basic functionality
   */
  async runQuickTest(): Promise<boolean> {
    try {
      console.log('⚡ Running iOS SQLite Quick Test...');
      
      // Check if database is already initialized
      const isInit = await skiRecorderDB.isInitialized();
      console.log(`📱 Database initialized: ${isInit}`);
      
      if (!isInit) {
        await skiRecorderDB.initialize();
        console.log('✅ Database initialized for quick test');
      }
      
      const testActivity: Activity = {
        id: `quick-test-${Date.now()}`,
        startedAt: Date.now(),
        totalDistanceM: 1000,
        totalDescentM: 100,
        totalAscentM: 0,
        maxSpeedMs: 10,
        avgSpeedMs: 5,
        downhillTimeMs: 600000,
        uphillTimeMs: 0,
      };

      console.log('📝 Creating test activity...');
      await skiRecorderDB.createActivity(testActivity);
      console.log('✅ Test activity created');
      
      console.log('📖 Retrieving test activity...');
      const retrieved = await skiRecorderDB.getActivity(testActivity.id);
      
      if (retrieved) {
        console.log('✅ Test activity retrieved successfully');
        await skiRecorderDB.deleteActivity(testActivity.id);
        console.log('✅ Test activity cleaned up');
        console.log('✅ Quick test passed');
        return true;
      } else {
        console.log('❌ Failed to retrieve test activity');
        return false;
      }
    } catch (error) {
      console.error('❌ Quick test failed:', error);
      console.error('Error details:', error);
      return false;
    }
  }
}

/**
 * Diagnostic function to check database state
 */
export async function diagnoseIOSSQLite(): Promise<{
  success: boolean;
  details: string;
}> {
  try {
    console.log('🔍 Diagnosing iOS SQLite setup...');
    
    // Check if database is initialized
    const isInit = await skiRecorderDB.isInitialized();
    console.log(`📱 Database initialized: ${isInit}`);
    
    if (!isInit) {
      console.log('🔧 Attempting to initialize database...');
      await skiRecorderDB.initialize();
      console.log('✅ Database initialized successfully');
    }
    
    // Test basic connection
    const testActivity: Activity = {
      id: `diagnostic-${Date.now()}`,
      startedAt: Date.now(),
      totalDistanceM: 100,
      totalDescentM: 10,
      totalAscentM: 0,
      maxSpeedMs: 5,
      avgSpeedMs: 2,
      downhillTimeMs: 60000,
      uphillTimeMs: 0,
    };
    
    console.log('📝 Testing activity creation...');
    try {
      await skiRecorderDB.createActivity(testActivity);
      console.log('✅ Activity creation successful');
    } catch (createError) {
      console.error('❌ Activity creation failed:', createError);
      throw new Error(`Activity creation failed: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
    }
    
    console.log('📖 Testing activity retrieval...');
    const retrieved = await skiRecorderDB.getActivity(testActivity.id);
    if (retrieved) {
      console.log('✅ Activity retrieval successful');
      await skiRecorderDB.deleteActivity(testActivity.id);
      console.log('✅ Activity cleanup successful');
    } else {
      throw new Error('Failed to retrieve test activity');
    }
    
    return {
      success: true,
      details: 'All diagnostic tests passed successfully'
    };
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
    return {
      success: false,
      details: `Diagnostic failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Export convenience functions
export async function testIOSSQLite(): Promise<boolean> {
  const tester = new IOSSQLiteTest();
  return await tester.runQuickTest();
}

export async function runFullIOSTest(): Promise<{
  success: boolean;
  results: any;
}> {
  const tester = new IOSSQLiteTest();
  return await tester.runComprehensiveTest();
}
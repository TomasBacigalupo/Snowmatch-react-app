# Ski Activity Recorder

A production-ready ski activity recording system for React + Capacitor v5 mobile apps. This system replicates Strava-like recording functionality optimized specifically for skiing activities with intelligent segment detection and battery optimization.

## Features

- **Real-time GPS tracking** with dynamic accuracy profiles
- **Intelligent segment detection** (Downhill vs Uphill/Lift)
- **Offline-first SQLite storage** for all activity data
- **Battery optimization** with adaptive location tracking
- **Interactive maps** with segment-colored tracks
- **Comprehensive metrics** and activity analysis
- **Auto-pause detection** for stationary periods

## Architecture

### Core Components

```
src/
├── lib/
│   ├── types/skiRecorder.ts          # TypeScript interfaces
│   ├── db/sqlite.ts                  # SQLite database service
│   ├── geo/
│   │   ├── haversine.ts              # Distance calculations
│   │   └── smoothing.ts              # GPS data filtering
│   └── recorder/
│       ├── SkiRecorder.ts            # Main recorder class
│       ├── useSkiRecorder.ts         # React hook
│       └── segmentDetection.ts       # Segment classification
├── components/skiRecorder/
│   ├── StatCard.tsx                  # Metric display components
│   ├── MapTrack.tsx                  # Map visualization
│   └── SkiRecorderApp.tsx            # Main app component
└── screens/
    ├── RecordScreen.tsx              # Recording interface
    ├── ActivitiesListScreen.tsx      # Activity browser
    └── ActivityDetailScreen.tsx      # Detailed activity view
```

## Installation

### 1. Install Dependencies

```bash
npm install @capacitor-community/sqlite@6.0.0 react-leaflet leaflet @types/leaflet --legacy-peer-deps
```

### 2. Configure Capacitor

The system uses the existing Capacitor v5 setup. Ensure these plugins are available:

- `@capacitor/geolocation` (already installed)
- `@capacitor-community/sqlite` (newly installed)

### 3. Platform Setup

#### iOS Configuration

The iOS permissions are already configured in `ios/App/App/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>SnowMatch quiere saber tu ubicación para poder mostrarte el mapa de pistas del centro de esquí en el que estás esquiando.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>SnowMatch quiere saber tu ubicación para poder mostrarte el mapa de pistas del centro de esquí en el que estás esquiando.</string>

<key>NSMotionUsageDescription</key>
<string>SnowMatch necesita acceso a los datos de movimiento para detectar automáticamente cuando estás esquiando cuesta abajo o subiendo en telesilla.</string>
```

#### Android Configuration

The Android permissions are configured in `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Location permissions for ski activity recording -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

<!-- Motion/Activity recognition for ski segment detection -->
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />

<!-- Foreground service for background location tracking -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
```

## Usage

### Basic Integration

```tsx
import { SkiRecorderApp } from './components/skiRecorder/SkiRecorderApp';

function App() {
  return <SkiRecorderApp initialScreen="activities" />;
}
```

### Using the Hook

```tsx
import { useSkiRecorder } from './lib/recorder/useSkiRecorder';

function MyComponent() {
  const {
    status,
    currentActivity,
    metrics,
    startRecording,
    pauseRecording,
    finishRecording,
  } = useSkiRecorder();

  return (
    <div>
      <p>Status: {status}</p>
      <p>Distance: {metrics.distance}m</p>
      <button onClick={startRecording}>Start</button>
    </div>
  );
}
```

## Configuration

### Tunable Constants

All configuration is centralized in `src/lib/types/skiRecorder.ts`:

```typescript
export const DEFAULT_CONFIG: SkiRecorderConfig = {
  segmentDetection: {
    speedThresholdMs: 2.0,           // Speed threshold for downhill detection
    gradeThreshold: -0.03,           // Grade threshold (-3% = downhill)
    consecutiveSamplesRequired: 3,   // Samples needed to switch segments
    rollingWindowSize: 8,            // Smoothing window size
    maxAccuracyM: 50,                // Ignore samples with worse accuracy
    maxSpeedMs: 60,                  // Ignore impossible speed jumps
    autoPauseSpeedMs: 0.5,           // Auto-pause when slower than this
    autoPauseDurationMs: 60000,      // Auto-pause after this duration
  },
  downhillProfile: {
    enableHighAccuracy: true,
    desiredIntervalMs: 1000,         // 1 second updates
    minDistanceM: 5,                 // 5m minimum distance
  },
  uphillProfile: {
    enableHighAccuracy: false,
    desiredIntervalMs: 10000,        // 10 second updates
    minDistanceM: 30,                // 30m minimum distance
  },
  batteryOptimizedProfile: {
    enableHighAccuracy: false,
    desiredIntervalMs: 20000,        // 20 second updates
    minDistanceM: 50,                // 50m minimum distance
  },
};
```

### Customizing Configuration

```tsx
const customConfig = {
  segmentDetection: {
    speedThresholdMs: 1.5,  // More sensitive downhill detection
    gradeThreshold: -0.02,  // Less steep grade requirement
  },
  downhillProfile: {
    desiredIntervalMs: 500,  // Higher frequency for downhill
  },
};

const { startRecording } = useSkiRecorder(customConfig);
```

## Database Schema

### Activities Table
```sql
CREATE TABLE activities (
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
```

### Segments Table
```sql
CREATE TABLE segments (
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
```

### Samples Table
```sql
CREATE TABLE samples (
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
```

## Segment Detection Algorithm

The system uses a sophisticated real-time algorithm to classify GPS samples:

### Classification Rules

1. **Primary Rule**: `speed > 2.0 m/s AND grade <= -0.03` → **DOWNHILL**
2. **Secondary Rule**: `vertical_rate < -0.5 m/s` → **DOWNHILL**
3. **Default**: All other cases → **UPHILL/LIFT**

### Hysteresis

To prevent rapid switching between classifications:
- Requires 3 consecutive samples of the same type to switch
- Uses a rolling window of 8 samples for smoothing
- Applies exponential moving average to reduce noise

### Dynamic Accuracy Profiles

- **Downhill**: High accuracy (1s intervals, 5m distance filter)
- **Uphill**: Reduced accuracy (10s intervals, 30m distance filter)
- **Battery Optimized**: Minimal accuracy (20s intervals, 50m distance filter)

## Performance Considerations

### Battery Optimization

- **Adaptive tracking**: Automatically adjusts accuracy based on segment type
- **Auto-pause**: Detects stationary periods and reduces tracking frequency
- **Background optimization**: Expands intervals when screen is off and user is stationary

### Data Quality

- **GPS filtering**: Removes samples with accuracy > 50m
- **Jump detection**: Ignores impossible speed jumps (> 60 m/s)
- **Smoothing**: Applies moving average and median filters to reduce noise

### Storage Efficiency

- **Local SQLite**: All data stored locally, no server required
- **Indexed queries**: Optimized database indexes for fast retrieval
- **Efficient sampling**: Adaptive sampling rates reduce storage requirements

## Testing

### Unit Tests

```bash
# Test distance calculations
npm test -- --testPathPattern=haversine

# Test segment detection
npm test -- --testPathPattern=segmentDetection

# Test database operations
npm test -- --testPathPattern=sqlite
```

### Manual Testing Scenarios

1. **Long lift → short downhill → lift**
   - Verify segments are created correctly
   - Check accuracy switches between profiles

2. **Pause on lift, resume on downhill**
   - Ensure segment continuity is maintained
   - Verify metrics are calculated correctly

3. **Airplane mode**
   - Confirm recording works without network
   - Verify data is stored locally

### Performance Testing

- **8-hour recording**: Should produce ≤ 10k samples without UI jank
- **Memory usage**: Monitor for memory leaks during long sessions
- **Battery impact**: Test battery drain over extended use

## Troubleshooting

### Common Issues

#### Location Permission Denied
```typescript
// Check permissions before starting
const permissions = await Geolocation.checkPermissions();
if (permissions.location !== 'granted') {
  const result = await Geolocation.requestPermissions();
  if (result.location !== 'granted') {
    throw new Error('Location permission required');
  }
}
```

#### Poor GPS Accuracy
- Ensure device has clear sky view
- Check device GPS settings
- Verify location services are enabled
- Consider using external GPS device for better accuracy

#### Database Initialization Failed
```typescript
// Check SQLite availability
const isAvailable = await CapacitorSQLite.isAvailable();
if (!isAvailable) {
  throw new Error('SQLite not available on this device');
}
```

#### Segment Detection Issues
- Adjust `speedThresholdMs` and `gradeThreshold` in config
- Increase `consecutiveSamplesRequired` for more stable detection
- Check altitude data availability for grade calculations

### Debug Mode

Enable debug logging:

```typescript
const recorder = new SkiRecorder({
  segmentDetection: {
    // ... other config
    debug: true,  // Enable debug logging
  }
});
```

## Platform-Specific Notes

### iOS

- **Background location**: Requires `NSLocationAlwaysAndWhenInUseUsageDescription`
- **Motion data**: Requires `NSMotionUsageDescription` for activity recognition
- **App Store**: May require justification for background location usage

### Android

- **Background location**: Requires `ACCESS_BACKGROUND_LOCATION` permission
- **Activity recognition**: Requires `ACTIVITY_RECOGNITION` permission
- **Foreground service**: May be required for reliable background tracking
- **Target SDK**: Ensure compatibility with latest Android versions

## Future Enhancements

### Planned Features

1. **GPX Export**: Export activities in standard GPX format
2. **Social Sharing**: Share activities with friends
3. **Weather Integration**: Correlate activities with weather data
4. **Advanced Analytics**: More detailed performance metrics
5. **Offline Maps**: Cache map tiles for offline viewing
6. **Bluetooth Integration**: Connect to heart rate monitors
7. **Voice Coaching**: Audio feedback during recording

### Performance Improvements

1. **Background Plugin**: Integrate `@capawesome/capacitor-background-geolocation`
2. **Web Workers**: Move heavy calculations to background threads
3. **Data Compression**: Compress stored GPS data
4. **Smart Sampling**: ML-based adaptive sampling rates

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Run tests: `npm test`
5. Build for production: `npm run build`

### Code Style

- Use TypeScript for all new code
- Follow existing ESLint configuration
- Write unit tests for new features
- Document public APIs with JSDoc

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation if needed
4. Submit pull request with description
5. Address review feedback
6. Merge after approval

## License

This ski recorder system is part of the SnowMatch application. Please refer to the main project license for usage terms.

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review existing GitHub issues
3. Create new issue with detailed description
4. Include device information and logs when possible

---

**Note**: This system is designed for production use in ski resorts and mountain environments. Always test thoroughly in real-world conditions before deployment.

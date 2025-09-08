# Exercise Bottom Sheet Steps

This directory contains the individual step components for the Exercise Bottom Sheet feature.

## Components

### ExerciseStep
- **Purpose**: Initial step showing exercise instructions and AI correction info
- **Props**: 
  - `onNext`: Function to proceed to next step
  - `level`: Course level for translations

### VideoStep  
- **Purpose**: Video trimming and upload preparation
- **Props**:
  - `videoPreviewUrl`: URL of the selected video
  - `onUpload`: Function to start upload process
  - `loadingCompresor`: Loading state for compression
  - `progress`: Upload progress percentage

### LocationStep
- **Purpose**: Location selection using geolocation and interactive map
- **Props**:
  - `onNext`: Function to proceed to next step
  - `onBack`: Function to go back to previous step
  - `onLocationSelect`: Function called when location is selected
- **Features**:
  - Automatic geolocation detection
  - Interactive Google Maps with terrain view
  - Draggable marker for precise location selection
  - Fallback to default location (Bariloche, Argentina) if geolocation fails

### UploadingStep
- **Purpose**: Shows animated loading during video upload
- **Props**: None

### SuccessStep
- **Purpose**: Success confirmation after upload
- **Props**:
  - `onClose`: Function to close the modal

## Setup Requirements

### Google Maps API
To use the LocationStep component, you need to:

1. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)
3. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `public/index.html` with your actual API key
4. Configure API key restrictions for security

### Capacitor Geolocation
The LocationStep uses Capacitor's Geolocation plugin which is already installed:
- `@capacitor/geolocation`: ^7.1.0

## Usage

The steps are automatically managed by the main `ExcerciseBottomSheet` component. The flow is:

1. **ExerciseStep** → User sees exercise instructions
2. **VideoStep** → User selects and trims video  
3. **LocationStep** → User selects location (NEW)
4. **UploadingStep** → Video uploads with location data
5. **SuccessStep** → Upload confirmation

## Location Data

The selected location is passed to the video upload process and includes:
- `latitude`: Decimal degrees
- `longitude`: Decimal degrees

This data can be used for:
- Location-based corrections
- Ski resort identification
- Weather conditions at time of recording
- Instructor recommendations based on location
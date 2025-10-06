# Video Onboarding - ProCheck Feature

This directory contains the video onboarding stepper for the ProCheck feature, which allows users to upload their skiing/snowboarding videos for professional analysis.

## Components

### Main Components

- **VideoOnboarding.jsx** - Main stepper component that orchestrates the entire flow
- **VideoOnboardingPage.jsx** - Page wrapper with routing and layout
- **index.js** - Export file for the main component

### Step Components

1. **VideoTipsStep.jsx** - Step 1: Tips and guidelines for recording videos
2. **VideoUploadStep.jsx** - Step 2: Video selection and trimming (30-second limit)
3. **VideoLocationStep.jsx** - Step 3: Resort selection from enum/resorts API
4. **VideoReviewStep.jsx** - Step 4: Choose review type (AI analysis or certified instructor)

## Features

### Step 1: Video Tips
- Interactive tips for recording quality videos
- Guidelines for lighting, stability, and content
- Visual cards with icons and descriptions

### Step 2: Video Upload
- **Mobile**: Video selection from device gallery using Capacitor plugins
- **Browser**: File input for video selection from computer
- Automatic video trimming to 30-second limit (mobile) or manual trimming (browser)
- Video preview and duration display
- Support for MP4, MOV, and AVI formats
- Minimum 720p resolution requirement
- Cross-platform compatibility with fallback mechanisms

### Step 3: Location Selection
- Resort selection from API endpoint `/api/enums/resorts`
- Grouped by categories (Argentina, Chile, USA, etc.)
- Searchable autocomplete interface
- Integration with existing resort data

### Step 4: Review Selection
- Two analysis options:
  - **Snow AI Analysis**: Automated analysis with artificial intelligence
    - Instant analysis (5 minutes)
    - Automatic technique detection
    - Performance metrics
    - Progress charts
    - Included in plan
  - **Certified Instructor**: Personalized analysis by certified professionals
    - Custom feedback (24 hours)
    - Detailed comments
    - Personal improvement suggestions
    - Video feedback
    - Direct instructor support
    - Based on selected plan
- Visual comparison of features
- Technology indicators
- Trust badges and guarantees

## Technical Implementation

### Dependencies Used
- **Video Processing**: 
  - Mobile: `@capacitor/camera`, `@coderpradp/capacitor-plugin-video-picker`, `@awesome-cordova-plugins/video-editor`
  - Browser: HTML5 File API with fallback mechanisms
- **Form Management**: `react-hook-form`, `@hookform/resolvers/yup`, `yup`
- **UI Components**: Material-UI with custom styling
- **Animation**: Framer Motion for smooth transitions
- **Payment**: MercadoPago SDK integration

### API Endpoints
- `GET /api/enums/resorts` - Fetch available resorts
- `POST /api/videos` - Upload video for analysis (future implementation)
- Review type selection processing

### Validation
- Step-by-step validation using Yup schemas
- Real-time field validation
- Error handling and user feedback

## Usage

```jsx
import VideoOnboarding from './pages/video-onboarding';

// In your routing
<Route path="/video-onboarding" component={VideoOnboardingPage} />
```

## File Structure

```
src/pages/video-onboarding/
├── VideoOnboarding.jsx          # Main stepper component
├── VideoOnboardingPage.jsx      # Page wrapper with layout
├── VideoTipsStep.jsx           # Step 1: Video tips
├── VideoUploadStep.jsx         # Step 2: Video upload & trimming
├── VideoLocationStep.jsx       # Step 3: Resort selection
├── VideoReviewStep.jsx         # Step 4: Review type selection
├── index.js                    # Export file
└── README.md                   # This documentation
```

## Future Enhancements

- [ ] Complete video upload API integration
- [ ] ProCheck analysis processing (both AI and instructor)
- [ ] Email notifications for completed analysis
- [ ] Video progress tracking
- [ ] Social sharing of analysis results
- [ ] Mobile app optimization
- [ ] Offline video caching
- [ ] Advanced video editing tools
- [ ] AI analysis engine integration
- [ ] Instructor assignment system

## Notes

- The stepper is designed to work on both desktop and mobile devices
- Video trimming is handled client-side using Capacitor plugins
- Review selection supports both AI and human analysis options
- All components follow the existing design system and patterns
- Responsive design with mobile-first approach

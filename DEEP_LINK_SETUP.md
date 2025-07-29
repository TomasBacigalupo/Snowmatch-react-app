# Deep Link Setup for SnowMatch

This document explains how deep linking is configured in the SnowMatch app and how to test it.

## Configuration Overview

The app supports Universal Links with the format:
- **Universal Links**: `https://snowmatch.pro/match/teacher/<id>`

## Supported Deep Link Routes

### Teacher Profile Links
- `https://snowmatch.pro/match/teacher/123`
- `https://snowmatch.pro/match/teacher/456`
- `https://snowmatch.pro/match/teacher/789`

### Other Routes (if needed)
- `https://snowmatch.pro/profile?id=123`
- `https://snowmatch.pro/booking?id=456`
- `https://snowmatch.pro/resort?id=789`

## Testing Deep Links

### Android Testing

1. **Using ADB (Android Debug Bridge)**:
   ```bash
   # Test teacher profile link
   adb shell am start -W -a android.intent.action.VIEW -d "https://snowmatch.pro/match/teacher/123" pro.snowmatch
   ```

2. **Using Android Studio**:
   - Open Android Studio
   - Go to Run > Edit Configurations
   - Add to "Launch Options" > "Launch Flags":
     ```
     -a android.intent.action.VIEW -d "https://snowmatch.pro/match/teacher/123"
     ```

3. **Using a web browser**:
   - Type `https://snowmatch.pro/match/teacher/123` in the browser
   - It should prompt to open the app

### iOS Testing

1. **Using Safari**:
   - Open Safari on your device
   - Type `https://snowmatch.pro/match/teacher/123`
   - It should prompt to open the app

2. **Using Xcode**:
   - Open Xcode
   - Go to Product > Scheme > Edit Scheme
   - Select "Run" and go to "Arguments" tab
   - Add to "Arguments Passed On Launch":
     ```
     -https://snowmatch.pro/match/teacher/123
     ```

3. **Using Notes app**:
   - Create a note with the deep link
   - Tap on the link to test

### Web Testing

For universal links, you can test them in any web browser:
- `https://snowmatch.pro/match/teacher/123`
- `https://snowmatch.pro/match/teacher/456`

## Implementation Details

### Files Modified

1. **`capacitor.config.ts`**: Updated to use `https://snowmatch.pro`
2. **`android/app/src/main/AndroidManifest.xml`**: Updated for snowmatch.pro domain
3. **`ios/App/App/Info.plist`**: Updated associated domains for snowmatch.pro
4. **`src/hooks/useDeepLink.js`**: Updated to handle `/match/teacher/` routes
5. **`src/utils/deepLinkUtils.js`**: Updated utilities for new format
6. **`src/App.js`**: Integrated deep link handling

### Key Features

- **Automatic URL parsing**: The app automatically parses incoming deep links
- **Teacher route handling**: `/match/teacher/<id>` routes are handled specifically
- **Parameter extraction**: Teacher ID is extracted from the URL path
- **Fallback support**: Web URLs fall back to the web version if app is not installed
- **Sharing support**: Built-in functions to share deep links

## Usage in Components

```javascript
import { generateTeacherLink, shareDeepLink } from '../utils/deepLinkUtils';

// Generate a teacher deep link
const teacherLink = generateTeacherLink('123');

// Share the deep link
await shareDeepLink(teacherLink, 'Check out this teacher!');
```

## Route Handling

When a deep link like `https://snowmatch.pro/match/teacher/123` is opened:

1. The app detects the deep link
2. Parses the URL to extract the teacher ID (`123`)
3. Navigates to the teacher profile page: `/dashboard/teacher/123`

## Troubleshooting

### Common Issues

1. **Deep links not working on Android**:
   - Make sure `android:autoVerify="true"` is set in AndroidManifest.xml
   - Verify the package name matches your app ID
   - Check that the domain is `snowmatch.pro`

2. **Deep links not working on iOS**:
   - Check that associated domains are set to `applinks:snowmatch.pro`
   - Verify the domain is properly configured in your Apple Developer account

3. **Universal links not working**:
   - Ensure you have a valid `apple-app-site-association` file on snowmatch.pro
   - Verify the domain is properly configured in your Apple Developer account

### Debugging

1. Check console logs for deep link events
2. Use the `useDeepLink` hook to monitor incoming links
3. Test with different teacher IDs

## Next Steps

1. **Set up your domain**: Create the `apple-app-site-association` file on snowmatch.pro
2. **Configure your server**: Set up proper redirects for web URLs
3. **Test thoroughly**: Test teacher profile links on both platforms
4. **Add analytics**: Track deep link usage for insights 
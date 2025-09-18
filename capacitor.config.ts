import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pro.snowmatch',
  appName: 'SnowMatch',
  webDir: 'build',
  server: {
    // androidScheme: 'https',
    // url: 'http://localhost:3000',
  },
  android: {
    useLegacyBridge: true, // Required for background geolocation to work properly
  },
  plugins: {
    App: {
      url: 'https://snowmatch.pro',
      appLinks: {
        ios: {
          appId: 'pro.snowmatch',
          appName: 'SnowMatch'
        },
        android: {
          scheme: 'https',
          packageName: 'pro.snowmatch'
        }
      }
    }
  }
};

export default config;

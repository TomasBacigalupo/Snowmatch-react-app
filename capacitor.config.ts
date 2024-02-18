import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pro.snowmatch',
  appName: 'SnowMatch',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  ios: {
    "contentInset": "always",
  },
};

export default config;

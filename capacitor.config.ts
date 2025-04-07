import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pro.snowmatch',
  appName: 'SnowMatch',
  webDir: 'build',
  server: {
    // androidScheme: 'https',
    url: 'http://192.168.0.53:3000',
  },
};

export default config;

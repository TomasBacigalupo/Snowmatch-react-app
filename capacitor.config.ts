import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pro.snowmatch',
  appName: 'SnowMatch',
  webDir: 'build',
  server: {
    // androidScheme: 'https',
    url: 'http://localhost:3000',
  },
};

export default config;

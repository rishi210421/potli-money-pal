import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.potli.app',
  appName: 'potli',
  webDir: 'www',
  server: {
    url: 'https://rishi210421-potli-money-pal.rishisenani009.workers.dev',
    cleartext: false
  }
};

export default config;
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skatespot.app',
  appName: 'SkateSpot',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1A0B2E',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
  },
};

export default config;
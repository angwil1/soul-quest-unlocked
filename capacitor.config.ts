import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aicompleteme.app',
  appName: 'AI Complete Me',
  webDir: 'dist',
  server: {
    url: "https://65aad2fc-5b33-4030-8f73-3783f744043f.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      spinnerColor: '#210100ff'
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#210100ff'
    },
    Keyboard: {
      resize: 'body'
    }
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#210100ff'
  }
};

export default config;
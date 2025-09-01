import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.65aad2fc5b3340308f733783f744043f',
  appName: 'soul-quest-unlocked',
  webDir: 'dist',
  server: {
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
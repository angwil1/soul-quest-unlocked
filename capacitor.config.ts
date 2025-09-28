import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aicompleteme.app',
  appName: 'AI Complete Me',
  webDir: 'dist',
  server: {
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#8B5CF6'
    },
    Keyboard: {
      resize: 'body'
    }
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#8B5CF6',
    themeColor: '#8B5CF6',
    versionCode: 2,
    versionName: "2.0.0",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
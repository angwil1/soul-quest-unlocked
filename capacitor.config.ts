import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aicompleteme.app',
  appName: 'AI Complete Me',
  webDir: 'dist',
  // Remove server config for local builds
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
    allowMixedContent: true,
    backgroundColor: '#8B5CF6',
    webContentsDebugging: true,
    appendUserAgent: 'AI Complete Me',
    overrideUserAgent: 'AI Complete Me Mobile App',
    mixedContentMode: 'always_allow',
    captureInput: true,
    // Enable fullscreen display
    fullscreen: true,
    // Optimize for mobile display
    themeColor: '#8B5CF6',
    // Handle display cutouts properly
    layoutFitsSystemWindows: false
  }
};

export default config;
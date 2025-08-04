import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.65aad2fc5b3340308f733783f744043f',
  appName: 'soul-quest-unlocked',
  webDir: 'dist',
  server: {
    url: 'https://aicompleteme.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false
    }
  }
};

export default config;
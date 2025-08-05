import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.65aad2fc5b3340308f733783f744043f',
  appName: 'soul-quest-unlocked',
  webDir: 'dist',
  server: {
    url: 'https://65aad2fc-5b33-4030-8f73-3783f744043f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark'
    }
  }
};

export default config;
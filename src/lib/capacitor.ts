import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

export const initializeCapacitor = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Hide splash screen after app is ready
      await SplashScreen.hide();

      // Configure status bar
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#8B5CF6' });

      // Configure keyboard behavior
      Keyboard.addListener('keyboardWillShow', () => {
        document.body.classList.add('keyboard-open');
      });

      Keyboard.addListener('keyboardWillHide', () => {
        document.body.classList.remove('keyboard-open');
      });

      // Handle app state changes
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      // Handle deep links (for future use)
      App.addListener('appUrlOpen', ({ url }) => {
        console.log('App opened with URL:', url);
      });
    }
  } catch (error) {
    console.log('Capacitor initialization failed:', error);
    // Continue running as web app if Capacitor fails
  }
};

export const isNative = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();
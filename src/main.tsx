import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Starting React app...');

// Safe Capacitor initialization
const initializeCapacitorSafely = async () => {
  try {
    console.log('🔧 Initializing Capacitor...');
    const { initializeCapacitor } = await import("./lib/capacitor");
    await initializeCapacitor();
    console.log('✅ Capacitor initialized successfully');
  } catch (error) {
    console.log('⚠️ Capacitor initialization failed, continuing as web app:', error);
    // Continue as web app - this is expected on desktop
  }
};

// Initialize Capacitor safely
initializeCapacitorSafely();

const rootElement = document.getElementById("root");
console.log('🎯 Root element found:', !!rootElement);

if (rootElement) {
  try {
    console.log('🎨 Creating React root...');
    const root = createRoot(rootElement);
    console.log('🚀 Rendering App component...');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ App rendered successfully');
  } catch (error) {
    console.error('❌ Failed to render React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red; font-family: Arial, sans-serif;">
        <h2>⚠️ App Loading Error</h2>
        <p>Failed to load the application. Please check the console for details.</p>
        <p style="font-size: 12px; color: #666;">Error: ${error}</p>
      </div>
    `;
  }
} else {
  console.error('❌ Root element not found!');
}

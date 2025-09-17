// Beta testing configuration
// Update these values with your actual business information

export const BETA_CONFIG = {
  businessName: "AI Complete Me", // Your registered business name
  buildVersion: "2.0.0", 
  isTestBuild: false, // Set to false for production release
  testerId: "PRODUCTION", // Production build identifier
  
  // Watermark settings
  showBetaWatermark: false, // Disabled for production
  trackUsage: false, // Disabled for production
  
  // Beta protection settings
  disablePremiumFeatures: false, // Enable all features for production
  showDummyData: false, // Use real data in production
  limitedFunctionality: false, // Full functionality enabled
  screenshotWarnings: false, // Disabled for production
  
  // Copyright info
  copyrightYear: new Date().getFullYear(),
  
  // Test build identifier
  getBuildId: () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${BETA_CONFIG.buildVersion}-${timestamp}`;
  },
  
  // Protection messages
  protectionMessages: {
    premiumBlocked: "Premium features disabled in beta - Full version coming soon!",
    dummyData: "Sample data shown for testing purposes only",
    copyrightWarning: "This app is protected by copyright. Unauthorized copying is prohibited."
  }
};
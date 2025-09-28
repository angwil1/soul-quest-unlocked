// Beta testing configuration
// Update these values with your actual business information

export const BETA_CONFIG = {
  businessName: "AI Complete Me", // Your registered business name
  buildVersion: "2.0.0-BETA", 
  isTestBuild: true, // Enable for closed testing
  testerId: "BETA-TESTER", // Beta testing identifier
  
  // Watermark settings
  showBetaWatermark: true, // Enable for beta testing
  trackUsage: true, // Enable usage tracking for beta
  
  // Beta protection settings
  disablePremiumFeatures: false, // Keep features enabled for testing
  showDummyData: false, // Use real data for accurate testing
  limitedFunctionality: false, // Full functionality for testing
  screenshotWarnings: true, // Enable screenshot warnings for beta
  
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
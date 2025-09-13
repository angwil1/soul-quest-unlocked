// Beta testing configuration
// Update these values with your actual business information

export const BETA_CONFIG = {
  businessName: "AI Complete Me", // Your registered business name
  buildVersion: "1.0.1-BETA", 
  isTestBuild: true,
  testerId: "BETA-USER", // This can be updated per build/tester
  
  // Watermark settings
  showBetaWatermark: true,
  trackUsage: true,
  
  // Copyright info
  copyrightYear: new Date().getFullYear(),
  
  // Test build identifier
  getBuildId: () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    return `${BETA_CONFIG.buildVersion}-${timestamp}`;
  }
};
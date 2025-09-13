import { useEffect } from "react";

interface VersionTrackerProps {
  testerId: string;
  buildVersion: string;
  businessName: string;
}

export const VersionTracker = ({ testerId, buildVersion, businessName }: VersionTrackerProps) => {
  
  useEffect(() => {
    // Track usage analytics for beta testing
    const trackBetaUsage = () => {
      const sessionData = {
        testerId,
        buildVersion,
        businessName,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        currentPage: window.location.pathname,
        sessionId: crypto.randomUUID()
      };
      
      // Store locally for tracking (in production, send to your analytics)
      const existingSessions = JSON.parse(localStorage.getItem('betaTestSessions') || '[]');
      existingSessions.push(sessionData);
      localStorage.setItem('betaTestSessions', JSON.stringify(existingSessions));
      
      console.log('Beta Test Session Tracked:', sessionData);
    };

    trackBetaUsage();

    // Track page changes
    const handlePageChange = () => {
      trackBetaUsage();
    };

    window.addEventListener('popstate', handlePageChange);
    
    return () => {
      window.removeEventListener('popstate', handlePageChange);
    };
  }, [testerId, buildVersion, businessName]);

  return null; // This component just tracks, no UI
};
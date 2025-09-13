import { useEffect, useState } from "react";
import { Shield, Eye, AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BETA_CONFIG } from "@/config/betaConfig";

export const BetaProtection = () => {
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);

  useEffect(() => {
    if (!BETA_CONFIG.isTestBuild || !BETA_CONFIG.screenshotWarnings) return;

    // Detect potential screenshot attempts
    const detectScreenshot = () => {
      setShowScreenshotWarning(true);
      setTimeout(() => setShowScreenshotWarning(false), 5000);
    };

    // Listen for visibility changes (may indicate screenshot)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        detectScreenshot();
      }
    });

    // Add context menu prevention
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      detectScreenshot();
    };

    // Add keyboard shortcuts prevention
    const preventKeyShortcuts = (e: KeyboardEvent) => {
      // Prevent common screenshot shortcuts
      if ((e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 'I')) ||
          (e.key === 'PrintScreen') ||
          (e.key === 'F12')) {
        e.preventDefault();
        detectScreenshot();
      }
    };

    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('keydown', preventKeyShortcuts);

    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('keydown', preventKeyShortcuts);
    };
  }, []);

  if (!BETA_CONFIG.isTestBuild) return null;

  return (
    <>
      {/* Floating watermark */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-10 select-none">
        <div className="text-6xl font-bold text-primary/20 rotate-45 whitespace-nowrap">
          {BETA_CONFIG.businessName} • BETA • CONFIDENTIAL
        </div>
      </div>

      {/* Screenshot warning */}
      {showScreenshotWarning && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-500/95 text-white p-6 rounded-lg shadow-xl max-w-md text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <h3 className="font-bold mb-2">Screenshot Detected!</h3>
          <p className="text-sm">
            This app is confidential beta software. Screenshots and recordings are not permitted.
          </p>
          <p className="text-xs mt-2 opacity-90">
            © {BETA_CONFIG.copyrightYear} {BETA_CONFIG.businessName} - All Rights Reserved
          </p>
        </div>
      )}

      {/* Bottom protection bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-orange-500/90 text-white text-center py-1 z-40 text-xs">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" />
          <span>BETA • CONFIDENTIAL • © {BETA_CONFIG.businessName}</span>
          <Eye className="w-3 h-3" />
          <span>Session Monitored</span>
          <Lock className="w-3 h-3" />
        </div>
      </div>
    </>
  );
};
import { useState } from "react";
import { AlertTriangle, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BetaWatermarkProps {
  testerId?: string;
  buildVersion?: string;
  businessName?: string;
}

export const BetaWatermark = ({ 
  testerId = "BETA-USER", 
  buildVersion = "1.0.1-BETA",
  businessName = "Your Business Name"
}: BetaWatermarkProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-orange-500/10 border-orange-500/30 text-orange-600 hover:bg-orange-500/20"
        >
          <Shield className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-2 right-2 z-50 bg-orange-500/90 text-white p-2 rounded-md shadow-md max-w-48">
      <div className="flex items-start gap-1.5">
        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-medium text-xs">BETA TEST</div>
          <div className="text-xs opacity-75 mt-0.5">
            v{buildVersion}
          </div>
          <div className="text-xs opacity-75">
            ID: {testerId}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="p-0.5 h-auto text-white hover:bg-white/20"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
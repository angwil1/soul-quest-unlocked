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
    <div className="fixed top-1 right-1 z-50 bg-orange-500 text-white rounded shadow-sm">
      <div className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-2">
        <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-medium text-xs md:text-sm">BETA</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="p-0.5 h-auto text-white hover:bg-white/20 hidden md:flex"
        >
          <X className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </div>
    </div>
  );
};
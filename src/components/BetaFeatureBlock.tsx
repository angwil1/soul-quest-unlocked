import { Lock, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BETA_CONFIG } from "@/config/betaConfig";

interface BetaFeatureBlockProps {
  feature: string;
  children?: React.ReactNode;
  isPremium?: boolean;
}

export const BetaFeatureBlock = ({ feature, children, isPremium = false }: BetaFeatureBlockProps) => {
  if (!BETA_CONFIG.isTestBuild || !BETA_CONFIG.disablePremiumFeatures) {
    return <>{children}</>;
  }

  if (isPremium) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="text-center text-white p-6">
            <Crown className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
            <h3 className="font-bold mb-2">Premium Feature</h3>
            <p className="text-sm mb-4">{BETA_CONFIG.protectionMessages.premiumBlocked}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              disabled
            >
              <Lock className="w-4 h-4 mr-2" />
              Available in Full Version
            </Button>
            <p className="text-xs mt-2 opacity-75">
              Testing core features only • {BETA_CONFIG.businessName}
            </p>
          </div>
        </div>
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
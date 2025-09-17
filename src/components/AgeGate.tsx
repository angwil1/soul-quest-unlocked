import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

interface AgeGateProps {
  onAgeConfirmed: () => void;
}

export const AgeGate = ({ onAgeConfirmed }: AgeGateProps) => {
  const [showExitWarning, setShowExitWarning] = useState(false);

  const handleConfirmAge = () => {
    console.log('🔞 Age confirmed - storing in localStorage');
    try {
      // Store age confirmation in localStorage
      localStorage.setItem('ageConfirmed', 'true');
      localStorage.setItem('ageConfirmedDate', new Date().toISOString());
      console.log('✅ Age confirmation stored successfully');
      onAgeConfirmed();
    } catch (error) {
      console.error('❌ Failed to store age confirmation:', error);
      // Still proceed - don't block user
      onAgeConfirmed();
    }
  };

  const handleUnderage = () => {
    setShowExitWarning(true);
    // Redirect away from the site after showing warning
    setTimeout(() => {
      window.location.href = 'https://www.google.com';
    }, 3000);
  };

  if (showExitWarning) {
    return (
      <div className="min-h-screen min-h-[100vh] min-h-[100dvh] bg-red-50 dark:bg-red-950/20 flex items-center justify-center px-4 py-6">
        <Card className="max-w-sm sm:max-w-md w-full mx-auto border-red-200 dark:border-red-800 bg-white dark:bg-card">
          <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
            <div className="mx-auto mb-3 w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-800 dark:text-red-200 text-xl sm:text-2xl">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 px-4 sm:px-6 pb-6">
            <p className="text-red-700 dark:text-red-300 text-sm sm:text-base">
              This platform is restricted to adults 18+ only. You will be redirected away from this site.
            </p>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
              Redirecting in 3 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100vh] min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-6 relative overflow-hidden">
      {/* Mobile-specific background fix */}
      <div className="absolute inset-0 bg-background md:bg-transparent"></div>
      <Card className="max-w-sm sm:max-w-md w-full mx-auto border-primary/20 bg-card shadow-xl relative z-10 overflow-hidden">
        <CardHeader className="text-center px-4 sm:px-6 pt-6 pb-4">
          <div className="mx-auto mb-3 w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-foreground leading-tight">Age Verification Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
            <p className="text-blue-800 dark:text-blue-200 font-medium mb-2 text-sm sm:text-base">Adult Content Notice</p>
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              This is a dating platform restricted to adults. You must be 18 years of age or older to enter.
            </p>
          </div>

          <div className="text-center space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg font-semibold text-foreground leading-tight">
              Are you 18 years of age or older?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                onClick={handleConfirmAge}
                className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white min-h-[44px] text-sm sm:text-base"
                size="lg"
              >
                Yes, I'm 18+
              </Button>
              <Button 
                onClick={handleUnderage}
                variant="destructive"
                className="w-full sm:flex-1 min-h-[44px] text-sm sm:text-base"
                size="lg"
              >
                No, I'm under 18
              </Button>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed px-2">
              By clicking "Yes", you confirm that you are at least 18 years old and legally permitted to view adult content in your jurisdiction.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs">
              <a href="/privacy" className="text-primary hover:underline transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-primary hover:underline transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
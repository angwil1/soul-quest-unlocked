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
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 bg-white">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-red-700">
              This platform is restricted to adults 18+ only. You will be redirected away from this site.
            </p>
            <p className="text-sm text-red-600">
              Redirecting in 3 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 relative">
      {/* Mobile-specific background fix */}
      <div className="absolute inset-0 bg-background md:bg-transparent"></div>
      <Card className="max-w-md w-full border-primary/20 bg-card shadow-xl relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Age Verification Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium mb-2">Adult Content Notice</p>
            <p className="text-sm text-blue-700">
              This is a dating platform restricted to adults. You must be 18 years of age or older to enter.
            </p>
          </div>

          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-foreground">
              Are you 18 years of age or older?
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleConfirmAge}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Yes, I'm 18+
              </Button>
              <Button 
                onClick={handleUnderage}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                No, I'm under 18
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-4">
              By clicking "Yes", you confirm that you are at least 18 years old and legally permitted to view adult content in your jurisdiction.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
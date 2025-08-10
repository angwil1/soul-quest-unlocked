import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';
import { AgeVerification } from '@/components/AgeVerification';
import SearchFilters from '@/components/SearchFilters';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);
  const [ageVerificationLoading, setAgeVerificationLoading] = useState(true);

  // Check age verification status when user logs in
  useEffect(() => {
    const checkAgeVerification = async () => {
      if (!user) {
        setAgeVerificationLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('age_verifications')
          .select('is_verified')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Age verification check error:', error);
        }

        setAgeVerified(data?.is_verified || false);
      } catch (error) {
        console.error('Age verification check error:', error);
        setAgeVerified(false);
      } finally {
        setAgeVerificationLoading(false);
      }
    };

    checkAgeVerification();
  }, [user]);

  // Show age verification first, then profile setup
  useEffect(() => {
    if (!authLoading && !ageVerificationLoading && user) {
      // If age not verified, show age verification first (always show, don't track hasShownModal for this)
      if (ageVerified === false) {
        setShowAgeVerification(true);
      } 
      // If age verified but profile incomplete, show profile setup
      else if (ageVerified === true && !profileLoading && profile && !hasShownModal) {
        const needsProfileSetup = !profile.gender || !profile.looking_for || !profile.location;
        if (needsProfileSetup) {
          setShowProfileSetup(true);
          setHasShownModal(true);
        }
      }
    }
  }, [user, profile, authLoading, profileLoading, ageVerificationLoading, ageVerified, hasShownModal]);

  const handleAgeVerificationComplete = () => {
    setShowAgeVerification(false);
    setAgeVerified(true);
    
    // Re-check age verification to ensure consistency
    setTimeout(() => {
      const checkAgeVerification = async () => {
        if (!user) return;
        
        try {
          const { data, error } = await supabase
            .from('age_verifications')
            .select('is_verified')
            .eq('user_id', user.id)
            .single();

          if (data?.is_verified) {
            setAgeVerified(true);
            // After age verification, show search filters popup
            setShowSearchFilters(true);
          }
        } catch (error) {
          console.error('Age verification re-check error:', error);
        }
      };
      
      checkAgeVerification();
    }, 500);
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
  };

  return (
    <>
      {children}
      <ProfileSetupModal 
        isOpen={showProfileSetup} 
        onComplete={handleProfileSetupComplete} 
      />
      {showAgeVerification && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <AgeVerification onVerificationComplete={handleAgeVerificationComplete} />
          </div>
        </div>
      )}
      <Sheet open={showSearchFilters} onOpenChange={setShowSearchFilters}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Set Your Preferences</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <SearchFilters
              onPreferenceChange={() => {}}
              onZipCodeChange={() => {}}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
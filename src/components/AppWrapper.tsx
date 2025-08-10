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
      console.log('Checking age verification for user:', user?.id);
      setAgeVerificationLoading(true);
      
      // For new users, clear localStorage to force verification
      if (user && profile && !profile.name) {
        console.log('New user detected, clearing age verification');
        localStorage.removeItem('ageVerified');
        setAgeVerified(false);
        setAgeVerificationLoading(false);
        return;
      }
      
      // First check localStorage for immediate verification
      const localVerification = localStorage.getItem('ageVerified');
      console.log('localStorage ageVerified:', localVerification);
      
      if (localVerification === 'true') {
        console.log('Age verified via localStorage');
        setAgeVerified(true);
        setAgeVerificationLoading(false);
        return;
      }

      // If user is logged in, also check database
      if (user) {
        try {
          console.log('Checking database for age verification...');
          const { data, error } = await supabase
            .from('age_verifications')
            .select('is_verified')
            .eq('user_id', user.id)
            .single();

          console.log('Database age verification result:', { data, error });

          if (error && error.code !== 'PGRST116') {
            console.error('Age verification check error:', error);
          }

          const dbVerified = data?.is_verified || false;
          console.log('Database verified status:', dbVerified);
          setAgeVerified(dbVerified);
          
          // Sync localStorage with database
          if (dbVerified) {
            localStorage.setItem('ageVerified', 'true');
            console.log('Synced localStorage with database verification');
          }
        } catch (error) {
          console.error('Age verification check error:', error);
          setAgeVerified(false);
        }
      } else {
        // For non-logged-in users, rely on localStorage only
        console.log('No user, setting age verified to false');
        setAgeVerified(false);
      }
      
      setAgeVerificationLoading(false);
    };

    checkAgeVerification();
  }, [user, profile]);

  // Show age verification first, then profile setup
  useEffect(() => {
    console.log('AppWrapper useEffect triggered:', {
      authLoading,
      ageVerificationLoading,
      ageVerified,
      user: !!user,
      hasShownModal
    });
    
    if (!authLoading && !ageVerificationLoading) {
      // If age not verified, show age verification modal
      if (ageVerified === false) {
        console.log('Showing age verification modal');
        setShowAgeVerification(true);
      } 
      // If age verified and user exists but profile incomplete, show profile setup
      else if (ageVerified === true && user && !profileLoading && profile && !hasShownModal) {
        const needsProfileSetup = !profile.gender || !profile.looking_for || !profile.location;
        console.log('Profile setup check:', { needsProfileSetup, profile: !!profile });
        if (needsProfileSetup) {
          setShowProfileSetup(true);
          setHasShownModal(true);
        }
      }
      // If age verified but no user (localStorage only), don't show anything
      else if (ageVerified === true && !user) {
        console.log('Age verified, no user - hiding age verification');
        setShowAgeVerification(false);
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
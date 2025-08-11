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
      console.log('=== AGE VERIFICATION CHECK ===');
      console.log('User ID:', user?.id);
      setAgeVerificationLoading(true);
      
      if (!user) {
        console.log('No user, setting age verified to false');
        setAgeVerified(false);
        setAgeVerificationLoading(false);
        return;
      }

      // ALWAYS check database for authenticated users - ignore localStorage completely
      try {
        console.log('Checking database for age verification...');
        const { data, error } = await supabase
          .from('age_verifications')
          .select('is_verified')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle to handle no results

        console.log('Database age verification result:', { data, error });

        if (error) {
          console.error('Age verification check error:', error);
          setAgeVerified(false);
        } else if (data?.is_verified === true) {
          console.log('✅ Database shows user IS verified');
          setAgeVerified(true);
          localStorage.setItem('ageVerified', 'true');
        } else {
          console.log('❌ User NOT verified in database (no record or is_verified = false)');
          localStorage.removeItem('ageVerified'); // Clear any old localStorage
          setAgeVerified(false);
        }
      } catch (error) {
        console.error('Age verification check error:', error);
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
    
    console.log('=== MODAL DISPLAY LOGIC ===');
    console.log('Auth loading:', authLoading, 'Age loading:', ageVerificationLoading, 'Age verified:', ageVerified, 'User exists:', !!user);
    
    if (!authLoading && !ageVerificationLoading) {
      // FORCE age verification for ANY user where ageVerified is false
      if (user && ageVerified === false) {
        console.log('🚨 SHOWING AGE VERIFICATION MODAL');
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
    console.log('🎉 Age verification completed!');
    setShowAgeVerification(false);
    setAgeVerified(true);
    
    // Re-check age verification to ensure consistency and update from database
    setTimeout(() => {
      const recheckAgeVerification = async () => {
        if (!user) return;
        
        try {
          const { data, error } = await supabase
            .from('age_verifications')
            .select('is_verified')
            .eq('user_id', user.id)
            .maybeSingle();

          if (data?.is_verified) {
            console.log('✅ Database confirms age verification');
            setAgeVerified(true);
            localStorage.setItem('ageVerified', 'true');
          }
        } catch (error) {
          console.error('Age verification re-check error:', error);
        }
      };
      
      recheckAgeVerification();
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
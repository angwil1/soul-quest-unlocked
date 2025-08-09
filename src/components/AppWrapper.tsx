import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';
import { AgeVerification } from '@/components/AgeVerification';
import { supabase } from '@/integrations/supabase/client';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
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
    if (!authLoading && !profileLoading && !ageVerificationLoading && user && !hasShownModal) {
      // If age not verified, show age verification first
      if (ageVerified === false) {
        setShowAgeVerification(true);
        setHasShownModal(true);
      } 
      // If age verified but profile incomplete, show profile setup
      else if (ageVerified === true && profile) {
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
    
    // After age verification, check if profile setup is needed
    if (profile) {
      const needsProfileSetup = !profile.gender || !profile.looking_for || !profile.location;
      if (needsProfileSetup) {
        setShowProfileSetup(true);
      }
    }
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <AgeVerification />
            <div className="mt-4 text-center">
              <button 
                onClick={handleAgeVerificationComplete}
                className="text-white/70 hover:text-white text-sm underline"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
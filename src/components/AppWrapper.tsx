import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';
import { AgeVerification } from '@/components/AgeVerification';

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

  // Show profile setup for new users who haven't completed basic setup
  useEffect(() => {
    if (!authLoading && !profileLoading && user && profile && !hasShownModal) {
      const needsProfileSetup = !profile.gender || !profile.looking_for || !profile.location;
      if (needsProfileSetup) {
        setShowProfileSetup(true);
        setHasShownModal(true);
      }
    }
  }, [user, profile, authLoading, profileLoading, hasShownModal]);

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    setShowAgeVerification(true);
  };

  const handleAgeVerificationComplete = () => {
    setShowAgeVerification(false);
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
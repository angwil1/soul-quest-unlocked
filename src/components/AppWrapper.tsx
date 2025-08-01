import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    // Only show modal if:
    // 1. User is authenticated
    // 2. User is on free tier (no subscription or subscription_tier is not 'Pro')
    // 3. User doesn't have a complete profile (missing basic info)
    // 4. We haven't already shown the modal in this session
    // 5. All loading states are complete
    
    if (
      user && 
      !authLoading && 
      !subscriptionLoading && 
      !profileLoading &&
      !hasShownModal
    ) {
      const isFreeUser = !subscription?.subscribed || subscription?.subscription_tier !== 'Pro';
      const hasIncompleteProfile = !profile?.gender || !profile?.looking_for || !profile?.location;
      
      if (isFreeUser && hasIncompleteProfile) {
        setShowProfileSetup(true);
        setHasShownModal(true);
      }
    }
  }, [user, subscription, profile, authLoading, subscriptionLoading, profileLoading, hasShownModal]);

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
    </>
  );
};
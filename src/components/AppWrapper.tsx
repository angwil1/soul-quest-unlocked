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

  // Removed automatic profile setup modal - users can set up profiles when they're ready

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
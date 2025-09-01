import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';
import { useLocation } from 'react-router-dom';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const location = useLocation();

  // Profile setup modal is now handled by QuizResults page
  // Only show on very specific pages where it makes sense
  useEffect(() => {
    if (!authLoading && !profileLoading && user && profile && !hasShownModal) {
      // Only show modal on these specific pages where profile setup is needed
      const allowedPaths = [
        '/matches',
        '/browse',
        '/messages'
      ];
      
      const shouldShow = allowedPaths.some(path => location.pathname.startsWith(path));
      
      if (shouldShow) {
        const needsProfileSetup = !profile.gender || !profile.looking_for || !profile.location;
        if (needsProfileSetup) {
          setShowProfileSetup(true);
          setHasShownModal(true);
        }
      }
    }
  }, [user, profile, authLoading, profileLoading, hasShownModal, location.pathname]);

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
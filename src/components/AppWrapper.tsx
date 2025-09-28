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

  // Profile setup modal should only show after signup or login
  // NOT when trying to view profiles or navigate around
  useEffect(() => {
    console.log('AppWrapper - useEffect triggered:', {
      authLoading,
      profileLoading,
      hasUser: !!user,
      hasProfile: !!profile,
      hasShownModal,
      pathname: location.pathname,
      search: location.search
    });

    // Don't interfere with password recovery
    const urlParams = new URLSearchParams(location.search);
    const isRecovery = urlParams.get('type') === 'recovery';
    
    if (isRecovery) {
      console.log('AppWrapper - Skipping logic due to recovery flow');
      return;
    }
    
    if (!authLoading && !profileLoading && user && profile && !hasShownModal) {
      // Only show modal immediately after login/signup on the main pages
      const isMainAppPage = ['/matches', '/messages'].includes(location.pathname);
      
      if (isMainAppPage) {
        const needsProfileSetup = !profile.gender || !profile.looking_for || !profile.location;
        if (needsProfileSetup) {
          // Only show on first visit to main app pages, not when navigating between them
          const hasJustLoggedIn = !sessionStorage.getItem('profile_setup_checked');
          
          if (hasJustLoggedIn) {
            setShowProfileSetup(true);
            setHasShownModal(true);
            sessionStorage.setItem('profile_setup_checked', 'true');
          }
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
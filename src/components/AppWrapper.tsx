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

  // Show profile setup when needed (exclude from most pages)
  useEffect(() => {
    if (!authLoading && !profileLoading && user && profile && !hasShownModal) {
      // Don't show modal on these pages
      const excludedPaths = [
        '/profile',
        '/profile/setup',
        '/',
        '/messages',
        '/reset-password',
        '/matches',
        '/browse',
        '/pricing',
        '/connection-dna',
        '/memory-vault',
        '/ai-digest',
        '/mission',
        '/faq',
        '/quiz-results',
        '/privacy',
        '/terms',
        '/cookies',
        '/accessibility',
        '/safety',
        '/sample-user',
        '/auth',
        '/feature-test'
      ];
      
      const shouldExclude = excludedPaths.some(path => 
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
      );
      
      // Always exclude the profile setup modal from messages page
      if (location.pathname === '/messages') {
        return;
      }
      
      if (!shouldExclude) {
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
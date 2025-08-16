import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';
import SearchFilters from '@/components/SearchFilters';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useLocation } from 'react-router-dom';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const location = useLocation();

  // Show profile setup when needed (exclude from most pages)
  useEffect(() => {
    if (!authLoading && !profileLoading && user && profile && !hasShownModal) {
      // Don't show modal on these pages
      const excludedPaths = [
        '/profile',
        '/',
        '/messages',
        '/reset-password',
        '/matches',
        '/questions', 
        '/quiz-results',
        '/sample-profiles',
        '/pricing',
        '/connection-dna',
        '/memory-vault',
        '/ai-digest',
        '/mission',
        '/faq',
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
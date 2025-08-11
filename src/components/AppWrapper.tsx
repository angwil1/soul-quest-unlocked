import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSetupModal } from '@/components/ProfileSetupModal';
import SearchFilters from '@/components/SearchFilters';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);


  // Show profile setup when needed
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
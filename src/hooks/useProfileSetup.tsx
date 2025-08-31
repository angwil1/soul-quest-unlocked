import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileCompletionStatus {
  isComplete: boolean;
  hasBasicInfo: boolean;
  hasBio: boolean;
  hasInterests: boolean;
  hasPhotos: boolean;
  hasPersonality: boolean;
  hasValues: boolean;
  completionPercentage: number;
}

export const useProfileSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileStatus, setProfileStatus] = useState<ProfileCompletionStatus>({
    isComplete: false,
    hasBasicInfo: false,
    hasBio: false,
    hasInterests: false,
    hasPhotos: false,
    hasPersonality: false,
    hasValues: false,
    completionPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkProfileCompletion();
    }
  }, [user]);

  const checkProfileCompletion = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Checking profile for user:', user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking profile:', error);
        setLoading(false);
        return;
      }

      console.log('Profile data found:', profile);

      if (!profile) {
        console.log('No profile found - setting incomplete status');
        setProfileStatus({
          isComplete: false,
          hasBasicInfo: false,
          hasBio: false,
          hasInterests: false,
          hasPhotos: false,
          hasPersonality: false,
          hasValues: false,
          completionPercentage: 0
        });
        setLoading(false);
        return;
      }

      // Check each completion criteria
      const hasBasicInfo = !!(profile.name && profile.age && profile.location);
      const hasBio = !!(profile.bio && profile.bio.length >= 50);
      const hasInterests = !!(profile.interests && profile.interests.length >= 3);
      // For now, consider photos complete if user went through the flow (personality_type exists)
      const hasPhotos = !!(profile.personality_type); // Photos step comes before personality step
      const hasPersonality = !!(profile.personality_type);
      const hasValues = !!(profile.looking_for);

      console.log('Profile completion check:', {
        hasBasicInfo,
        hasBio,
        hasInterests, 
        hasPhotos,
        hasPersonality,
        hasValues
      });

      const completedItems = [
        hasBasicInfo,
        hasBio,
        hasInterests,
        hasPhotos,
        hasPersonality,
        hasValues
      ].filter(Boolean).length;

      const completionPercentage = Math.round((completedItems / 6) * 100);
      const isComplete = completionPercentage === 100;

      console.log('Profile completion:', completionPercentage + '%', 'Complete:', isComplete);

      setProfileStatus({
        isComplete,
        hasBasicInfo,
        hasBio,
        hasInterests,
        hasPhotos,
        hasPersonality,
        hasValues,
        completionPercentage
      });

    } catch (error) {
      console.error('Error checking profile completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextStep = () => {
    const { hasBasicInfo, hasBio, hasInterests, hasPhotos, hasPersonality, hasValues } = profileStatus;

    if (!hasBasicInfo) return { step: 1, description: 'Complete basic information' };
    if (!hasBio) return { step: 2, description: 'Write your bio' };
    if (!hasInterests) return { step: 3, description: 'Select your interests' };
    if (!hasPhotos) return { step: 4, description: 'Upload photos' };
    if (!hasPersonality) return { step: 5, description: 'Answer personality questions' };
    if (!hasValues) return { step: 6, description: 'Choose your values' };

    return { step: 7, description: 'Profile complete!' };
  };

  const needsProfileSetup = () => {
    return !loading && !profileStatus.isComplete;
  };

  const showProfilePrompt = () => {
    if (profileStatus.completionPercentage > 0 && profileStatus.completionPercentage < 100) {
      toast({
        title: "Complete Your Profile",
        description: `Your profile is ${profileStatus.completionPercentage}% complete. Finish it to get better matches!`,
      });
    }
  };

  return {
    profileStatus,
    loading,
    checkProfileCompletion,
    getNextStep,
    needsProfileSetup,
    showProfilePrompt
  };
};
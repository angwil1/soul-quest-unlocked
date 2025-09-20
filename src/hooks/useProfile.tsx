import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  name: string | null;
  bio: string | null;
  age: number | null;
  gender: string | null;
  location: string | null;
  interests: string[] | null;
  avatar_url: string | null;
  photos: string[] | null;
  date_of_birth: string | null;
  height: number | null;
  occupation: string | null;
  education: string | null;
  looking_for: string | null;
  distance_preference: number | null;
  age_preference_min: number | null;
  age_preference_max: number | null;
  zip_code?: string | null;
  created_at: string;
  updated_at: string | null;
  // Premium features
  echo_badge_enabled?: boolean;
  unlocked_beyond_badge_enabled?: boolean;
  tiktok_embed_url?: string;
  vibe_gallery?: any[];
  emotional_soundtrack?: string;
  // Advanced features
  open_to_connection_invites?: boolean;
  echo_visibility_level?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!user) {
      // Clear loading state when there's no user
      setLoading(false);
      setProfile(null);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle(); // Use maybeSingle() to handle missing profiles

      if (error) throw error;
      
      // If no profile exists, create one
      if (!data) {
        console.log('No profile found, creating new profile for user:', user?.id);
        await createInitialProfile();
        return;
      }
      
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createInitialProfile = async () => {
    try {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data as Profile);
      
      toast({
        title: "Welcome!",
        description: "Your profile has been created. Let's set it up!"
      });
    } catch (error) {
      console.error('Error creating initial profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      // Clean up the updates object - convert empty strings to null for date fields
      const cleanedUpdates: Partial<Profile> = { ...updates };
      
      // Handle date_of_birth specifically - convert empty string to null
      if ('date_of_birth' in cleanedUpdates && cleanedUpdates.date_of_birth === '') {
        cleanedUpdates.date_of_birth = null;
      }
      
      // Handle other string fields that should be null instead of empty
      const stringFieldsToClean: (keyof Profile)[] = ['name', 'bio', 'gender', 'location', 'occupation', 'education', 'looking_for', 'avatar_url', 'zip_code'];
      
      stringFieldsToClean.forEach(field => {
        if (field in cleanedUpdates && cleanedUpdates[field] === '') {
          (cleanedUpdates as any)[field] = null;
        }
      });

      console.log('Updating profile with cleaned data:', cleanedUpdates);

      const { error } = await supabase
        .from('profiles')
        .update({ ...cleanedUpdates, updated_at: new Date().toISOString() })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return { error };
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive"
      });
      return null;
    }
  };

  const addPhoto = async (file: File) => {
    const url = await uploadPhoto(file);
    if (url && profile) {
      const newPhotos = [...(profile.photos || []), url];
      await updateProfile({ photos: newPhotos });
    }
  };

  const removePhoto = async (photoUrl: string) => {
    if (profile) {
      const newPhotos = (profile.photos || []).filter(url => url !== photoUrl);
      await updateProfile({ photos: newPhotos });
    }
  };

  const setAsAvatar = async (photoUrl: string) => {
    await updateProfile({ avatar_url: photoUrl });
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return {
    profile,
    loading,
    updateProfile,
    uploadPhoto,
    addPhoto,
    removePhoto,
    setAsAvatar,
    refetch: fetchProfile,
    refreshProfile
  };
};
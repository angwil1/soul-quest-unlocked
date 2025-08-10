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
  zip_code: string | null;
  created_at: string;
  updated_at: string | null;
  // Echo features
  echo_badge_enabled?: boolean;
  unlocked_beyond_badge_enabled?: boolean;
  tiktok_embed_url?: string;
  vibe_gallery?: any[];
  emotional_soundtrack?: string;
  // Echo Amplified features
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
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
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

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      return { error: null };
    } catch (error) {
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
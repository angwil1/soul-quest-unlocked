import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface EchoSubscription {
  id: string;
  user_id: string;
  subscription_type: 'monthly' | 'lifetime';
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  updated_at: string;
}

export const useEchoSubscription = () => {
  const [echoSubscription, setEchoSubscription] = useState<EchoSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkEchoSubscription();
    }
  }, [user]);

  const checkEchoSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('echo_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      setEchoSubscription(data as EchoSubscription);
    } catch (error) {
      console.error('Error checking Echo subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check Echo subscription status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const activateEchoSubscription = async (subscriptionType: 'monthly' | 'lifetime') => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      const expiresAt = subscriptionType === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        : null; // Lifetime has no expiration

      const { error } = await supabase
        .from('echo_subscriptions')
        .insert({
          user_id: user.id,
          subscription_type: subscriptionType,
          is_active: true,
          expires_at: expiresAt
        });

      if (error) throw error;

      // Also enable the Echo badge by default
      await supabase
        .from('profiles')
        .update({ echo_badge_enabled: true })
        .eq('id', user.id);

      await checkEchoSubscription();
      
      toast({
        title: "Echo activated!",
        description: `Your ${subscriptionType} Echo subscription is now active.`,
      });

      return { error: null };
    } catch (error) {
      console.error('Error activating Echo subscription:', error);
      toast({
        title: "Error",
        description: "Failed to activate Echo subscription",
        variant: "destructive"
      });
      return { error };
    }
  };

  const isEchoActive = () => {
    if (!echoSubscription || !echoSubscription.is_active) return false;
    
    // Check if subscription has expired (only for monthly)
    if (echoSubscription.subscription_type === 'monthly' && echoSubscription.expires_at) {
      return new Date(echoSubscription.expires_at) > new Date();
    }
    
    // Lifetime subscriptions never expire
    return true;
  };

  const getEchoFeatures = () => {
    return {
      tiktokEmbed: isEchoActive(),
      emotionalSoundtrack: isEchoActive(),
      vibeGallery: isEchoActive(),
      echoBadge: isEchoActive(),
    };
  };

  return {
    echoSubscription,
    loading,
    checkEchoSubscription,
    activateEchoSubscription,
    isEchoActive: isEchoActive(),
    echoFeatures: getEchoFeatures(),
  };
};
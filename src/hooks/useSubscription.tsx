import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Subscription {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      // Set default subscription state for non-authenticated users
      setSubscription({
        subscribed: false,
        subscription_tier: 'Unlocked'
      });
      setLoading(false);
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        // Temporarily suppress subscription check errors
        setSubscription({
          subscribed: false,
          subscription_tier: 'Unlocked'
        });
        return;
      }
      
      setSubscription(data || {
        subscribed: false,
        subscription_tier: 'Unlocked'
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({
        subscribed: false,
        subscription_tier: 'Unlocked'
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (plan: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });
      
      if (error) {
        console.error('Error creating checkout:', error);
        toast({
          title: "Error",
          description: "Failed to create checkout session",
          variant: "destructive"
        });
        return;
      }
      
      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive"
      });
    }
  };

  const manageBilling = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to manage billing",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error accessing billing portal:', error);
        toast({
          title: "Error",
          description: "Failed to access billing portal",
          variant: "destructive"
        });
        return;
      }
      
      if (data?.url) {
        // Open Stripe customer portal in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      toast({
        title: "Error",
        description: "Failed to access billing portal",
        variant: "destructive"
      });
    }
  };

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckout,
    manageBilling
  };
};
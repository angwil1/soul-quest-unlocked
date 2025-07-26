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
      
      // Provide fallback data instead of making API call
      const mockSubscription = {
        subscribed: false,
        subscription_tier: 'Unlocked'
      };
      
      setSubscription(mockSubscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Set fallback data on error
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
      toast({
        title: "Demo Mode",
        description: "Stripe checkout would open here in a real app",
      });
      
      // Mock successful checkout for demo
      setTimeout(() => {
        setSubscription({
          subscribed: true,
          subscription_tier: plan === 'premium' ? 'Premium' : 'Pro',
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        toast({
          title: "Success!",
          description: `Upgraded to ${plan === 'premium' ? 'Unlocked+' : 'Unlocked Pro'}`,
        });
      }, 1000);
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
      toast({
        title: "Demo Mode",
        description: "Stripe billing portal would open here in a real app",
      });
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
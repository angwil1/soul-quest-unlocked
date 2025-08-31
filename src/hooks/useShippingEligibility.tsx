import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ShippingEligibility {
  eligible: boolean;
  shipping_status?: string;
  eligible_date?: string;
  days_remaining?: number;
  reason?: string;
  eligible_since?: string;
}

export const useShippingEligibility = () => {
  const [eligibility, setEligibility] = useState<ShippingEligibility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkEligibility = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('check_shipping_eligibility', {
          p_user_id: user.id
        });

        if (error) {
          console.error('Error checking shipping eligibility:', error);
          setEligibility(null);
        } else {
          setEligibility(data as unknown as ShippingEligibility);
        }
      } catch (error) {
        console.error('Error checking shipping eligibility:', error);
        setEligibility(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkEligibility();
  }, [user]);

  const formatEligibleDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDaysRemaining = (days: number) => {
    if (days < 1) return 'Less than a day';
    if (days === 1) return '1 day';
    return `${Math.floor(days)} days`;
  };

  return {
    eligibility,
    isLoading,
    formatEligibleDate,
    formatDaysRemaining
  };
};
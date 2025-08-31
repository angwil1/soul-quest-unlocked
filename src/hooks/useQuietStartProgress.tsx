import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useQuietStartProgress = () => {
  const [claimedCount, setClaimedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClaimedCount = async () => {
      try {
        const { count } = await supabase
          .from('quiet_start_signups')
          .select('*', { count: 'exact', head: true })
          .eq('benefits_claimed', true);
        
        setClaimedCount(count || 0);
      } catch (error) {
        console.error('Error fetching claimed count:', error);
        setClaimedCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaimedCount();

    // Set up real-time subscription to track new claims
    const channel = supabase
      .channel('quiet-start-progress')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quiet_start_signups',
          filter: 'benefits_claimed=eq.true'
        },
        () => {
          // Refetch count when someone claims benefits
          fetchClaimedCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { claimedCount, isLoading };
};
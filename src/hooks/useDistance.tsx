import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DistanceCalculation {
  distance: number;
  zipCode1: string;
  zipCode2: string;
  coordinates?: {
    zipCode1: { lat: number; lon: number };
    zipCode2: { lat: number; lon: number };
  };
}

export const useDistance = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateDistance = async (zipCode1: string, zipCode2: string): Promise<DistanceCalculation | null> => {
    if (!zipCode1 || !zipCode2) {
      toast({
        title: "Error",
        description: "Both zip codes are required",
        variant: "destructive"
      });
      return null;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('calculate-distance', {
        body: { zipCode1, zipCode2 }
      });

      if (error) throw error;

      return data as DistanceCalculation;
    } catch (error) {
      console.error('Distance calculation error:', error);
      toast({
        title: "Error",
        description: "Failed to calculate distance between zip codes",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isWithinDistance = async (
    userZipCode: string, 
    targetZipCode: string, 
    maxDistance: number
  ): Promise<boolean> => {
    const result = await calculateDistance(userZipCode, targetZipCode);
    if (!result) return false;
    return result.distance <= maxDistance;
  };

  return {
    calculateDistance,
    isWithinDistance,
    loading
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface AIDigest {
  id: number;
  user_id: string;
  digest_date: string;
  generated_at: string;
  new_compatible_profiles: any;
  profile_score_deltas: any;
  ai_conversation_starters: any;
  digest_content?: {
    greeting: string;
    insights: string[];
    motivation: string;
  };
}

export const useAIDigest = () => {
  const [digest, setDigest] = useState<AIDigest | null>(null);
  const [digests, setDigests] = useState<AIDigest[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load today's digest
  const loadTodayDigest = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('compatibility_digests')
        .select('*')
        .eq('user_id', user.id)
        .eq('digest_date', today)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setDigest(data as AIDigest || null);
    } catch (error) {
      console.error('Error loading today\'s digest:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load all digests for history
  const loadAllDigests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('compatibility_digests')
        .select('*')
        .eq('user_id', user.id)
        .order('digest_date', { ascending: false })
        .limit(30); // Last 30 days

      if (error) throw error;

      setDigests(data as AIDigest[] || []);
    } catch (error) {
      console.error('Error loading digests:', error);
      toast({
        title: "Error",
        description: "Failed to load digest history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate new AI digest
  const generateAIDigest = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate AI digests",
        variant: "destructive"
      });
      return;
    }

    try {
      setGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-ai-digest', {
        body: { userId: user.id }
      });

      if (error) throw error;

      if (data?.success) {
        setDigest(data.digest);
        toast({
          title: "Success!",
          description: "Your AI digest has been generated",
        });
        
        // Refresh the digest list
        await loadTodayDigest();
      } else {
        throw new Error(data?.error || 'Failed to generate digest');
      }
    } catch (error) {
      console.error('Error generating AI digest:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI digest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  // Check if digest exists for today
  const hasTodayDigest = () => {
    if (!digest) return false;
    const today = new Date().toISOString().split('T')[0];
    return digest.digest_date === today;
  };

  useEffect(() => {
    if (user) {
      loadTodayDigest();
    }
  }, [user]);

  return {
    digest,
    digests,
    loading,
    generating,
    generateAIDigest,
    loadTodayDigest,
    loadAllDigests,
    hasTodayDigest: hasTodayDigest()
  };
};
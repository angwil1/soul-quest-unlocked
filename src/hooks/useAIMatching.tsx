import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIMatch {
  profile: {
    id: string;
    name: string;
    age: number;
    bio: string;
    location: string;
    occupation: string;
    education: string;
    interests: string[];
    avatar_url: string;
    photos: string[];
  };
  compatibility_score: number;
  explanation: string;
  shared_interests: string[];
  conversation_starters: string[];
}

export const useAIMatching = () => {
  const [matches, setMatches] = useState<AIMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAIMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Calling AI matching function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('ai-matching', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message);
      }

      if (data?.error) {
        console.error('API error:', data.error);
        throw new Error(data.error);
      }

      console.log('AI matching response:', data);
      
      if (data?.matches) {
        setMatches(data.matches);
        toast({
          title: "✨ AI Matches Generated!",
          description: `Found ${data.matches.length} compatible profiles using AI analysis.`,
        });
      } else {
        throw new Error('Invalid response format');
      }

    } catch (err) {
      console.error('Error generating AI matches:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error generating matches",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    matches,
    loading,
    error,
    generateAIMatches,
  };
};
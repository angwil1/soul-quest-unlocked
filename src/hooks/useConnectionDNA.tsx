import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface DNAProfile {
  id: string;
  user_id: string;
  emotional_intelligence_score: number;
  interaction_quality_score: number;
  empathy_score: number;
  vulnerability_comfort: number;
  communication_style: any;
  emotional_patterns: any;
  personality_markers: any;
  love_language_primary: string;
  love_language_secondary: string;
  conflict_resolution_style: string;
  last_analysis_at: string;
  created_at: string;
  updated_at: string;
}

export interface DNAInsight {
  id: string;
  user_id: string;
  insight_type: string;
  title: string;
  description: string;
  actionable_steps: string[];
  priority_level: string;
  category: string;
  confidence_level: number;
  is_read: boolean;
  is_dismissed: boolean;
  expires_at?: string;
  created_at: string;
}

export interface CompatibilityAnalysis {
  id: string;
  overall_compatibility_score: number;
  emotional_sync_score: number;
  communication_compatibility: number;
  personality_match_score: number;
  shared_values_score: number;
  growth_potential_score: number;
  strengths: string[];
  growth_areas: string[];
  conversation_starters: string[];
  date_ideas: string[];
  analysis_confidence: number;
  last_analyzed_at: string;
}

export const useConnectionDNA = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isUnlockedBeyond = false; // Simplified without subscription

  const trackInteraction = async (interactionData: {
    type: string;
    content?: string;
    other_user_id?: string;
    response_time_seconds?: number;
    [key: string]: any;
  }) => {
    if (!user || !isUnlockedBeyond) return;

    try {
      const { error } = await supabase.functions.invoke('analyze-connection-dna', {
        body: {
          analysisType: 'interaction_analysis',
          interactionData: {
            type: interactionData.type,
            content: interactionData.content,
            other_user_id: interactionData.other_user_id,
            response_time_seconds: interactionData.response_time_seconds,
            timestamp: new Date().toISOString(),
            ...interactionData
          }
        }
      });

      if (error) {
        console.error('Error tracking interaction:', error);
      }
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const updateDNAProfile = async () => {
    if (!user || !isUnlockedBeyond) return { error: 'Not authorized' };

    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('analyze-connection-dna', {
        body: {
          analysisType: 'profile_analysis'
        }
      });

      if (error) throw error;

      toast({
        title: "DNA Profile Updated",
        description: "Your Connection DNA has been refreshed with latest insights."
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating DNA profile:', error);
      toast({
        title: "Update Failed",
        description: "Could not update your Connection DNA. Please try again.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const analyzeCompatibility = async (targetUserId: string) => {
    if (!user || !isUnlockedBeyond) return { error: 'Not authorized' };

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('analyze-connection-dna', {
        body: {
          analysisType: 'compatibility_analysis',
          targetUserId
        }
      });

      if (error) throw error;

      return { data: data.compatibility, error: null };
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    if (!user || !isUnlockedBeyond) return { error: 'Not authorized' };

    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('analyze-connection-dna', {
        body: {
          analysisType: 'generate_insights'
        }
      });

      if (error) throw error;

      toast({
        title: "New Insights Generated",
        description: "Check your Connection DNA for personalized growth recommendations."
      });

      return { error: null };
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Insights Generation Failed",
        description: "Could not generate new insights. Please try again.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const getDNAProfile = async (): Promise<DNAProfile | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('connection_dna_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching DNA profile:', error);
        return null;
      }

      return data as DNAProfile;
    } catch (error) {
      console.error('Error fetching DNA profile:', error);
      return null;
    }
  };

  const getInsights = async (): Promise<DNAInsight[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('connection_dna_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching insights:', error);
        return [];
      }

      return data as DNAInsight[];
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  };

  const markInsightAsRead = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('connection_dna_insights')
        .update({ is_read: true })
        .eq('id', insightId);

      if (error) {
        console.error('Error marking insight as read:', error);
      }
    } catch (error) {
      console.error('Error marking insight as read:', error);
    }
  };

  const dismissInsight = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('connection_dna_insights')
        .update({ is_dismissed: true })
        .eq('id', insightId);

      if (error) {
        console.error('Error dismissing insight:', error);
      }
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  };

  const getCompatibilityWithUser = async (otherUserId: string): Promise<CompatibilityAnalysis | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('connection_dna_compatibility')
        .select('*')
        .or(`and(user_id_1.eq.${user.id},user_id_2.eq.${otherUserId}),and(user_id_1.eq.${otherUserId},user_id_2.eq.${user.id})`)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching compatibility:', error);
        return null;
      }

      return data as CompatibilityAnalysis;
    } catch (error) {
      console.error('Error fetching compatibility:', error);
      return null;
    }
  };

  // Helper function to automatically track common interactions
  const trackMessage = (content: string, otherUserId?: string, responseTime?: number) => {
    trackInteraction({
      type: 'message',
      content,
      other_user_id: otherUserId,
      response_time_seconds: responseTime,
      message_length: content.length
    });
  };

  const trackProfileView = (viewedUserId: string) => {
    trackInteraction({
      type: 'profile_view',
      other_user_id: viewedUserId
    });
  };

  const trackMatchReaction = (matchedUserId: string, reaction: 'like' | 'pass') => {
    trackInteraction({
      type: 'match_reaction',
      other_user_id: matchedUserId,
      reaction
    });
  };

  const trackQuizResponse = (questionId: string, response: any) => {
    trackInteraction({
      type: 'quiz_response',
      question_id: questionId,
      response
    });
  };

  return {
    loading,
    isUnlockedBeyond,
    // Core functions
    trackInteraction,
    updateDNAProfile,
    analyzeCompatibility,
    generateInsights,
    // Data fetching
    getDNAProfile,
    getInsights,
    getCompatibilityWithUser,
    // Insight management
    markInsightAsRead,
    dismissInsight,
    // Helper tracking functions
    trackMessage,
    trackProfileView,
    trackMatchReaction,
    trackQuizResponse
  };
};
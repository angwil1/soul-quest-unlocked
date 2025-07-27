import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface VaultMatch {
  id: string;
  user_id: string;
  matched_user_id: string;
  match_id?: string;
  notes?: string;
  tags: string[];
  saved_at: string;
  created_at: string;
  updated_at: string;
}

export interface VaultPrompt {
  id: string;
  user_id: string;
  prompt_text: string;
  prompt_source?: string;
  response_text?: string;
  notes?: string;
  tags: string[];
  saved_at: string;
  created_at: string;
  updated_at: string;
}

export interface VaultMoment {
  id: string;
  user_id: string;
  moment_type: string;
  title: string;
  description?: string;
  content?: any;
  related_user_id?: string;
  notes?: string;
  tags: string[];
  is_favorite: boolean;
  saved_at: string;
  moment_date?: string;
  created_at: string;
  updated_at: string;
}

export const useMemoryVault = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const saveMatch = useCallback(async (matchData: {
    matched_user_id: string;
    match_id?: string;
    notes?: string;
    tags?: string[];
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setLoading(true);
      const { error } = await supabase
        .from('memory_vault_matches')
        .insert({
          user_id: user.id,
          ...matchData,
          tags: matchData.tags || []
        });

      if (error) throw error;

      toast({
        title: "Match saved!",
        description: "Added to your Memory Vault"
      });

      return { error: null };
    } catch (error) {
      console.error('Error saving match:', error);
      toast({
        title: "Error",
        description: "Failed to save match",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const savePrompt = useCallback(async (promptData: {
    prompt_text: string;
    prompt_source?: string;
    response_text?: string;
    notes?: string;
    tags?: string[];
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setLoading(true);
      const { error } = await supabase
        .from('memory_vault_prompts')
        .insert({
          user_id: user.id,
          ...promptData,
          tags: promptData.tags || []
        });

      if (error) throw error;

      toast({
        title: "Prompt saved!",
        description: "Added to your Memory Vault"
      });

      return { error: null };
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Error",
        description: "Failed to save prompt",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const saveMoment = useCallback(async (momentData: {
    moment_type: string;
    title: string;
    description?: string;
    content?: any;
    related_user_id?: string;
    notes?: string;
    tags?: string[];
    is_favorite?: boolean;
    moment_date?: string;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setLoading(true);
      const { error } = await supabase
        .from('memory_vault_moments')
        .insert({
          user_id: user.id,
          ...momentData,
          tags: momentData.tags || [],
          is_favorite: momentData.is_favorite || false,
          moment_date: momentData.moment_date || new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Moment saved!",
        description: "Added to your Memory Vault"
      });

      return { error: null };
    } catch (error) {
      console.error('Error saving moment:', error);
      toast({
        title: "Error",
        description: "Failed to save moment",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const removeFromVault = useCallback(async (
    table: 'memory_vault_matches' | 'memory_vault_prompts' | 'memory_vault_moments',
    id: string
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Removed",
        description: "Item removed from Memory Vault"
      });

      return { error: null };
    } catch (error) {
      console.error('Error removing from vault:', error);
      toast({
        title: "Error", 
        description: "Failed to remove item",
        variant: "destructive"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const checkIfSaved = useCallback(async (
    table: 'memory_vault_matches' | 'memory_vault_prompts' | 'memory_vault_moments',
    criteria: Record<string, any>
  ) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .eq('user_id', user.id)
        .match(criteria)
        .limit(1);
      
      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking if saved:', error);
      return false;
    }
  }, [user]);

  const getVaultStats = useCallback(async () => {
    if (!user) return { matches: 0, prompts: 0, moments: 0 };

    try {
      const [matchesRes, promptsRes, momentsRes] = await Promise.all([
        supabase.from('memory_vault_matches').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('memory_vault_prompts').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('memory_vault_moments').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      return {
        matches: matchesRes.count || 0,
        prompts: promptsRes.count || 0,
        moments: momentsRes.count || 0
      };
    } catch (error) {
      console.error('Error getting vault stats:', error);
      return { matches: 0, prompts: 0, moments: 0 };
    }
  }, [user]);

  return {
    loading,
    saveMatch,
    savePrompt,
    saveMoment,
    removeFromVault,
    checkIfSaved,
    getVaultStats
  };
};
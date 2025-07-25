import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useEmailJourneys = () => {
  const { user } = useAuth();

  // Track quiz completion
  const trackQuizCompletion = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          event_type: 'quiz_completed',
          event_data: {
            completed_at: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Error tracking quiz completion:', error);
      }
    } catch (error) {
      console.error('Error tracking quiz completion:', error);
    }
  };

  // Track profile completion
  const trackProfileCompletion = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          event_type: 'profile_completed',
          event_data: {
            completed_at: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Error tracking profile completion:', error);
      }
    } catch (error) {
      console.error('Error tracking profile completion:', error);
    }
  };

  // Track match creation
  const trackMatchCreated = async (matchedUserId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          event_type: 'match_created',
          event_data: {
            matched_user_id: matchedUserId,
            created_at: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Error tracking match creation:', error);
      }
    } catch (error) {
      console.error('Error tracking match creation:', error);
    }
  };

  // Track message sent
  const trackMessageSent = async (recipientId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          event_type: 'message_sent',
          event_data: {
            recipient_id: recipientId,
            sent_at: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Error tracking message sent:', error);
      }
    } catch (error) {
      console.error('Error tracking message sent:', error);
    }
  };

  // Update last online status
  const updateLastOnline = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ last_online: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating last online:', error);
      }
    } catch (error) {
      console.error('Error updating last online:', error);
    }
  };

  // Update last online when user is active
  useEffect(() => {
    if (user) {
      updateLastOnline();
      
      // Update last online every 5 minutes while user is active
      const interval = setInterval(updateLastOnline, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    trackQuizCompletion,
    trackProfileCompletion,
    trackMatchCreated,
    trackMessageSent,
    updateLastOnline
  };
};
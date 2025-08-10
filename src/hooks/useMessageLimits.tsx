import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

export interface MessageLimits {
  remainingMessages: number;
  isPremium: boolean;
  loading: boolean;
  canSendMessage: boolean;
  subscriptionTier?: string;
  subscriptionEnd?: string;
}

export const useMessageLimits = () => {
  const { user } = useAuth();
  const { createCheckout } = useSubscription();
  const { toast } = useToast();
  const [limits, setLimits] = useState<MessageLimits>({
    remainingMessages: 5,
    isPremium: false,
    loading: true,
    canSendMessage: true,
  });

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      const isPremium = data?.subscribed || false;
      
      // Get remaining messages for free users
      let remainingMessages = -1; // Unlimited for premium
      let canSendMessage = true;

      if (!isPremium) {
        const { data: remainingData, error: remainingError } = await supabase
          .rpc('get_remaining_messages', { p_user_id: user.id });

        if (remainingError) {
          console.error('Error checking remaining messages:', remainingError);
          remainingMessages = 0;
          canSendMessage = false;
        } else {
          remainingMessages = remainingData;
          canSendMessage = remainingData > 0;
        }
      }

      setLimits({
        remainingMessages,
        isPremium,
        loading: false,
        canSendMessage,
        subscriptionTier: data?.subscription_tier,
        subscriptionEnd: data?.subscription_end,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Default to free user limits if error
      const { data: remainingData } = await supabase
        .rpc('get_remaining_messages', { p_user_id: user.id });
      
      setLimits({
        remainingMessages: remainingData || 0,
        isPremium: false,
        loading: false,
        canSendMessage: (remainingData || 0) > 0,
      });
    }
  };

  const sendMessage = async (messageText: string, matchId: string) => {
    if (!user || !limits.canSendMessage) {
      toast({
        title: "Cannot send message",
        description: limits.isPremium 
          ? "There was an error processing your request" 
          : "You've reached your daily message limit. Upgrade to Premium for unlimited messaging!",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check if user can send message (double-check on backend)
      const { data: canSend, error: canSendError } = await supabase
        .rpc('can_send_message', { p_user_id: user.id });

      if (canSendError || !canSend) {
        toast({
          title: "Message limit reached",
          description: "You've reached your daily limit of 5 messages. Upgrade to Premium for unlimited messaging!",
          variant: "destructive"
        });
        await checkSubscription(); // Refresh limits
        return false;
      }

      // Send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            message_text: messageText,
            match_id: matchId,
          }
        ]);

      if (messageError) throw messageError;

      // Increment message count for free users
      if (!limits.isPremium) {
        await supabase.rpc('increment_message_count', { p_user_id: user.id });
        
        // Update local state
        setLimits(prev => ({
          ...prev,
          remainingMessages: Math.max(0, prev.remainingMessages - 1),
          canSendMessage: prev.remainingMessages > 1,
        }));
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const upgradePrompt = () => {
    toast({
      title: "Upgrade to Premium",
      description: "Get unlimited messaging and premium features for just $9.99/month!",
      action: (
        <button 
          onClick={() => createCheckout('premium')}
          className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
        >
          Upgrade Now
        </button>
      ),
    });
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  return {
    ...limits,
    sendMessage,
    refreshLimits: checkSubscription,
    upgradePrompt,
  };
};
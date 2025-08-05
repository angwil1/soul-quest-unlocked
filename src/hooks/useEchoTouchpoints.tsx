import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface EchoQuietNote {
  id: string;
  sender_id: string;
  recipient_id: string;
  note_text: string;
  created_at: string;
  is_read: boolean;
  response_invite_sent: boolean;
}

export interface EchoResponseInvite {
  id: string;
  quiet_note_id: string;
  sender_id: string;
  recipient_id: string;
  invite_message: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  expires_at: string;
}

export interface EchoLimitedChat {
  id: string;
  response_invite_id: string;
  user1_id: string;
  user2_id: string;
  message_count: number;
  daily_message_limit: number;
  last_message_date: string | null;
  created_at: string;
  expires_at: string;
  can_complete_connection?: boolean;
}

export interface EchoLimitedMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  is_read: boolean;
}

export const useEchoTouchpoints = () => {
  const [quietNotes, setQuietNotes] = useState<EchoQuietNote[]>([]);
  const [responseInvites, setResponseInvites] = useState<EchoResponseInvite[]>([]);
  const [limitedChats, setLimitedChats] = useState<EchoLimitedChat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Send a quiet echo note
  const sendQuietNote = async (recipientId: string, noteText: string) => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      const { error } = await supabase
        .from('echo_quiet_notes')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          note_text: noteText
        });

      if (error) throw error;

      toast({
        title: "Echo sent",
        description: "Your quiet echo has been delivered",
      });

      await loadQuietNotes();
      return { error: null };
    } catch (error) {
      console.error('Error sending quiet note:', error);
      toast({
        title: "Error",
        description: "Failed to send echo",
        variant: "destructive"
      });
      return { error };
    }
  };

  // Send response invite
  const sendResponseInvite = async (quietNoteId: string, recipientId: string, inviteMessage: string) => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      const { error } = await supabase
        .from('echo_response_invites')
        .insert({
          quiet_note_id: quietNoteId,
          sender_id: user.id,
          recipient_id: recipientId,
          invite_message: inviteMessage
        });

      if (error) throw error;

      // Mark the quiet note as having a response invite sent
      await supabase
        .from('echo_quiet_notes')
        .update({ response_invite_sent: true })
        .eq('id', quietNoteId);

      toast({
        title: "Resonance invite sent",
        description: "Your invitation to continue the connection has been sent",
      });

      await loadResponseInvites();
      return { error: null };
    } catch (error) {
      console.error('Error sending response invite:', error);
      toast({
        title: "Error",
        description: "Failed to send resonance invite",
        variant: "destructive"
      });
      return { error };
    }
  };

  // Accept response invite and create limited chat
  const acceptResponseInvite = async (inviteId: string) => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      // Update invite status
      const { error: updateError } = await supabase
        .from('echo_response_invites')
        .update({ status: 'accepted' })
        .eq('id', inviteId);

      if (updateError) throw updateError;

      // Get invite details
      const { data: invite, error: inviteError } = await supabase
        .from('echo_response_invites')
        .select('*')
        .eq('id', inviteId)
        .single();

      if (inviteError) throw inviteError;

      // Create limited chat
      const { error: chatError } = await supabase
        .from('echo_limited_chats')
        .insert({
          response_invite_id: inviteId,
          user1_id: invite.sender_id,
          user2_id: invite.recipient_id
        });

      if (chatError) throw chatError;

      toast({
        title: "Connection opened",
        description: "Your limited resonance chat is now active",
      });

      await loadLimitedChats();
      return { error: null };
    } catch (error) {
      console.error('Error accepting response invite:', error);
      toast({
        title: "Error",
        description: "Failed to accept resonance invite",
        variant: "destructive"
      });
      return { error };
    }
  };

  // Send limited chat message
  const sendLimitedMessage = async (chatId: string, messageText: string) => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      // Check daily message limit
      const { data: canSend, error: limitError } = await supabase
        .rpc('check_daily_message_limit', {
          chat_id_param: chatId,
          sender_id_param: user.id
        });

      if (limitError) throw limitError;
      if (!canSend) {
        toast({
          title: "Daily limit reached",
          description: "You've reached your daily message limit for this resonance chat",
          variant: "destructive"
        });
        return { error: 'Daily limit reached' };
      }

      const { error } = await supabase
        .from('echo_limited_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          message_text: messageText
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your resonance message has been delivered",
      });

      return { error: null };
    } catch (error) {
      console.error('Error sending limited message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return { error };
    }
  };

  // Load quiet notes received
  const loadQuietNotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('echo_quiet_notes')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuietNotes(data || []);
    } catch (error) {
      console.error('Error loading quiet notes:', error);
    }
  };

  // Load response invites
  const loadResponseInvites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('echo_response_invites')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponseInvites((data || []) as EchoResponseInvite[]);
    } catch (error) {
      console.error('Error loading response invites:', error);
    }
  };

  // Load limited chats
  const loadLimitedChats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('echo_limited_chats')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLimitedChats(data || []);
    } catch (error) {
      console.error('Error loading limited chats:', error);
    }
  };

  // Mark quiet note as read
  const markQuietNoteAsRead = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('echo_quiet_notes')
        .update({ is_read: true })
        .eq('id', noteId);

      if (error) throw error;
      await loadQuietNotes();
    } catch (error) {
      console.error('Error marking note as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        loadQuietNotes(),
        loadResponseInvites(),
        loadLimitedChats()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const completeConnection = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('echo_limited_chats')
        .update({ can_complete_connection: true })
        .eq('id', chatId)
        .eq('user1_id', user!.id)
        .or(`user2_id.eq.${user!.id}`);

      if (error) throw error;

      await loadLimitedChats();
      
      toast({
        title: "Echo Continues ✨",
        description: "Your contemplative space flows on. Whispers remain, pressure dissolves.",
      });
    } catch (error) {
      console.error('Error completing connection:', error);
      toast({
        title: "Error",
        description: "Failed to complete connection",
        variant: "destructive"
      });
    }
  };

  return {
    quietNotes,
    responseInvites,
    limitedChats,
    loading,
    sendQuietNote,
    sendResponseInvite,
    acceptResponseInvite,
    sendLimitedMessage,
    markQuietNoteAsRead,
    completeConnection,
    loadQuietNotes,
    loadResponseInvites,
    loadLimitedChats
  };
};
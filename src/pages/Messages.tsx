import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessageLimits } from '@/hooks/useMessageLimits';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { VideoCallButton } from '@/components/VideoCallButton';
import { ArrowLeft, Send, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  read_at?: string;
  match_id?: string;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  other_user: {
    id: string;
    name?: string;
    email?: string;
  };
  latest_message?: string;
}

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const { sendMessage: sendMessageWithLimits, remainingMessages, isPremium, canSendMessage, upgradePrompt } = useMessageLimits();
  const { createCheckout } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    loadMatches();
    
    // Set up realtime subscription for new messages (only if user exists)
    if (!user) return;
    
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id === user.id) {
            setMessages(prev => [...prev, newMsg]);
            loadMatches(); // Refresh matches list
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;

    try {
      // Get matches where user is involved
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (matchError) throw matchError;

      // For each match, get the other user's details
      const matchesWithUsers = await Promise.all(
        (matchData || []).map(async (match) => {
          const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
          
          // Get other user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', otherUserId)
            .single();

          // Get latest message
          const { data: latestMsg } = await supabase
            .from('messages')
            .select('message_text')
            .eq('match_id', match.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...match,
            other_user: {
              id: otherUserId,
              name: profile?.name || 'Unknown User',
              email: ''
            },
            latest_message: latestMsg?.message_text || 'No messages yet'
          };
        })
      );

      setMatches(matchesWithUsers);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .neq('sender_id', user.id)
        .is('read_at', null);

    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedMatch || !newMessage.trim()) return;
    
    // Check if user can send message (with limits)
    if (!canSendMessage) {
      upgradePrompt();
      return;
    }

    const success = await sendMessageWithLimits(newMessage.trim(), selectedMatch);
    if (success) {
      setNewMessage('');
    }
  };

  const handleMatchSelect = (matchId: string) => {
    setSelectedMatch(matchId);
    loadMessages(matchId);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-4 max-w-6xl">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User will be redirected to auth if not authenticated
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Message Limits Display */}
            {!isPremium && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {remainingMessages} messages left today
                </span>
                {remainingMessages === 0 && (
                  <Button 
                    size="sm" 
                    onClick={() => createCheckout('premium')}
                    className="ml-2"
                  >
                    <Crown className="h-4 w-4 mr-1" />
                    Upgrade
                  </Button>
                )}
              </div>
            )}
            {isPremium && (
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-medium">Premium • Unlimited</span>
              </div>
            )}
            <VideoCallButton 
              matchName="Your Match" 
              variant="default" 
              size="lg"
              className="bg-primary text-primary-foreground font-semibold px-6 py-3 text-lg min-h-[52px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Matches List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Your Matches</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading matches...
                  </div>
                ) : matches.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No matches yet. Start matching to begin chatting!
                  </div>
                ) : (
                  matches.map((match) => (
                    <div
                      key={match.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedMatch === match.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleMatchSelect(match.id)}
                    >
                      <div className="font-medium">{match.other_user.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {match.latest_message}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(match.created_at), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedMatch 
                  ? matches.find(m => m.id === selectedMatch)?.other_user.name 
                  : 'Select a match to chat'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px]">
              {selectedMatch ? (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4 p-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_id === user.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div>{message.message_text}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {format(new Date(message.created_at), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                   <div className="flex gap-2">
                     <Input
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder={
                         !canSendMessage 
                           ? "Daily message limit reached - Upgrade to Premium"
                           : "Type a message..."
                       }
                       onKeyPress={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           sendMessage();
                         }
                       }}
                       disabled={!canSendMessage}
                     />
                     <Button 
                       onClick={sendMessage} 
                       disabled={!canSendMessage || !newMessage.trim()}
                     >
                       <Send className="h-4 w-4" />
                     </Button>
                   </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a match to start messaging
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
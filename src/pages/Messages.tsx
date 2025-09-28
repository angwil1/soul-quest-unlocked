import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessageLimits } from '@/hooks/useMessageLimits';

import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { VideoCallButton } from '@/components/VideoCallButton';
import { AIDigestSidebar } from '@/components/AIDigestSidebar';
import { ArrowLeft, Send, Crown, PanelRightOpen, PanelRightClose, Sparkles } from 'lucide-react';
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAIDigest, setShowAIDigest] = useState(true);
  const [isGeneratingEmojis, setIsGeneratingEmojis] = useState(false);

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

  const generateAIEmojis = async () => {
    if (!newMessage.trim() || isGeneratingEmojis) return;
    
    setIsGeneratingEmojis(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-emojis', {
        body: { messageText: newMessage }
      });
      
      if (error) {
        console.error('Error generating emojis:', error);
        toast({
          title: "Error",
          description: "Failed to generate AI emojis",
          variant: "destructive",
        });
        return;
      }
      
      const emojis = data?.emojis || [];
      if (emojis.length > 0) {
        // Add the first emoji to the message
        setNewMessage(prev => prev + ' ' + emojis[0]);
        toast({
          title: "Emoji Added!",
          description: `Added ${emojis[0]} to your message`,
        });
      }
    } catch (error) {
      console.error('Error generating emojis:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI emojis",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingEmojis(false);
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
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      <main 
        id="main-content"
        className="container mx-auto p-4 max-w-6xl"
        role="main"
        aria-labelledby="messages-heading"
      >
        <div className="mb-6">
          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Top row - Title and essential actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/matches')}
                  className="focus:ring-2 focus:ring-primary focus:ring-offset-2 p-2"
                  aria-label="Go back to matches"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <h1 id="messages-heading" className="text-xl font-bold">Messages</h1>
              </div>
              
              <VideoCallButton 
                matchName="Your Match" 
                variant="default" 
                size="sm"
                className="bg-primary text-primary-foreground font-medium px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </div>
            
            {/* Bottom row - Secondary actions and status */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIDigest(!showAIDigest)}
                className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={showAIDigest ? "Hide AI Digest sidebar" : "Show AI Digest sidebar"}
                aria-expanded={showAIDigest}
              >
                {showAIDigest ? (
                  <PanelRightClose className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="text-sm">AI Digest</span>
              </Button>
              
              {/* Compact Message Limits Display */}
              {!isPremium && (
                <div 
                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                  role="status"
                  aria-label={`${remainingMessages} messages remaining today`}
                >
                  <span className="font-medium">{remainingMessages} left</span>
                  {remainingMessages === 0 && (
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/pricing')}
                      className="ml-1 h-6 px-2 text-xs focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Upgrade to premium for unlimited messages"
                    >
                      <Crown className="h-3 w-3 mr-1" aria-hidden="true" />
                      Upgrade
                    </Button>
                  )}
                </div>
              )}
              {isPremium && (
                <div 
                  className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                  role="status"
                  aria-label="Premium user with unlimited messages"
                >
                  <Crown className="h-3 w-3" aria-hidden="true" />
                  <span className="font-medium">Premium</span>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/matches')}
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Go back to matches"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <h1 id="messages-heading" className="text-3xl font-bold">Messages</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* AI Digest Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIDigest(!showAIDigest)}
                className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={showAIDigest ? "Hide AI Digest sidebar" : "Show AI Digest sidebar"}
                aria-expanded={showAIDigest}
              >
                {showAIDigest ? (
                  <PanelRightClose className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
                )}
                AI Digest
              </Button>
              
              {/* Message Limits Display */}
              {!isPremium && (
                <div 
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                  role="status"
                  aria-label={`${remainingMessages} messages remaining today`}
                >
                  <span className="text-sm font-medium">
                    {remainingMessages} messages left today
                  </span>
                  {remainingMessages === 0 && (
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/pricing')}
                      className="ml-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Upgrade to premium for unlimited messages"
                    >
                      <Crown className="h-4 w-4 mr-1" aria-hidden="true" />
                      Upgrade
                    </Button>
                  )}
                </div>
              )}
              {isPremium && (
                <div 
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg"
                  role="status"
                  aria-label="Premium user with unlimited messages"
                >
                  <Crown className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Premium • Unlimited</span>
                </div>
              )}
              
              <VideoCallButton 
                matchName="Your Match" 
                variant="default" 
                size="lg"
                className="bg-primary text-primary-foreground font-semibold px-6 py-3 text-lg min-h-[52px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </div>
          </div>
        </div>

        <div className={`grid gap-6 h-[600px] animate-fade-in ${showAIDigest ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          {/* Matches List */}
          <Card 
            className="md:col-span-1 bg-gradient-to-br from-background via-background to-muted/20 border-muted/40 shadow-lg hover:shadow-xl transition-all duration-300"
            role="region"
            aria-labelledby="matches-list-title"
          >
            <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle id="matches-list-title" className="text-foreground font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                </div>
                Your Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground animate-pulse" role="status" aria-live="polite">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="mt-2">Loading matches...</p>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground space-y-4 animate-fade-in" role="region" aria-label="No matches available">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted/30 flex items-center justify-center">
                      <div className="text-2xl">💫</div>
                    </div>
                    <div>
                      <p className="font-medium">No matches yet</p>
                      <p className="text-sm text-muted-foreground/70">Start matching to begin chatting!</p>
                    </div>
                  </div>
                ) : (
                  <div role="listbox" aria-label="Your matches" aria-activedescendant={selectedMatch ? `match-${selectedMatch}` : undefined}>
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        id={`match-${match.id}`}
                        role="option"
                        tabIndex={0}
                        aria-selected={selectedMatch === match.id}
                        className={`group p-4 border-b border-muted/20 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-inset hover-scale ${
                          selectedMatch === match.id 
                            ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-l-primary shadow-sm' 
                            : 'hover:shadow-sm'
                        }`}
                        onClick={() => handleMatchSelect(match.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleMatchSelect(match.id);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-medium text-primary group-hover:scale-110 transition-transform duration-200">
                            {match.other_user.name?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                              {match.other_user.name}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {match.latest_message}
                            </div>
                            <div className="text-xs text-muted-foreground/60 mt-1">
                              {format(new Date(match.created_at), 'MMM d, h:mm a')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card 
            className={`${showAIDigest ? 'md:col-span-2' : 'md:col-span-2'} bg-gradient-to-br from-background via-background to-muted/10 border-muted/40 shadow-lg hover:shadow-xl transition-all duration-300`}
            role="region"
            aria-labelledby="chat-area-title"
          >
            <CardHeader className="border-b border-muted/30 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle id="chat-area-title" className="text-foreground font-semibold flex items-center gap-3">
                {selectedMatch ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-medium text-primary">
                      {matches.find(m => m.id === selectedMatch)?.other_user.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div>{matches.find(m => m.id === selectedMatch)?.other_user.name}</div>
                      <div className="text-xs text-muted-foreground font-normal">Online now</div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                      <div className="text-lg">💬</div>
                    </div>
                    Select a match to chat
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px] p-0">
              {selectedMatch ? (
                <>
                  {/* Messages */}
                  <ScrollArea 
                    className="flex-1 p-4"
                    role="log"
                    aria-label="Chat messages"
                    aria-live="polite"
                  >
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={message.id}
                          className={`flex animate-fade-in ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                          role="group"
                          aria-label={`Message from ${message.sender_id === user.id ? 'you' : matches.find(m => m.id === selectedMatch)?.other_user.name || 'other user'} at ${format(new Date(message.created_at), 'h:mm a')}`}
                          style={{animationDelay: `${index * 0.05}s`}}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                              message.sender_id === user.id
                                ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-12'
                                : 'bg-gradient-to-br from-muted/80 to-muted mr-12 border border-muted/40'
                            }`}
                          >
                            <div className="leading-relaxed">{message.message_text}</div>
                            <div className={`text-xs mt-2 ${
                              message.sender_id === user.id 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground/70'
                            }`}>
                              {format(new Date(message.created_at), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                   {/* Message Input */}
                   <div className="p-4 border-t border-muted/30 bg-gradient-to-r from-transparent to-muted/5">
                     <div className="flex gap-3" role="group" aria-label="Send message">
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
                         className="flex-1 rounded-xl border-muted/40 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200 hover:border-primary/30"
                         aria-label="Type your message"
                         aria-describedby="send-button"
                       />
                       <Button 
                         onClick={generateAIEmojis}
                         disabled={!canSendMessage || !newMessage.trim() || isGeneratingEmojis}
                         variant="outline"
                         size="icon"
                         className="rounded-xl border-muted/40 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover-scale"
                         aria-label="Generate AI emoji"
                         title="Add AI-generated emoji"
                       >
                         <Sparkles className={`h-4 w-4 ${isGeneratingEmojis ? 'animate-spin text-primary' : 'text-muted-foreground hover:text-primary'} transition-colors duration-200`} aria-hidden="true" />
                       </Button>
                       <Button 
                         id="send-button"
                         onClick={sendMessage} 
                         disabled={!canSendMessage || !newMessage.trim()}
                         className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover-scale shadow-lg hover:shadow-xl"
                         aria-label="Send message"
                       >
                         <Send className="h-4 w-4" aria-hidden="true" />
                       </Button>
                     </div>
                   </div>
                </>
              ) : (
                <>
                  <div 
                    className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4 animate-fade-in"
                    role="status"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <div className="text-4xl">💬</div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Ready to chat?</p>
                      <p className="text-sm">Select a match to start messaging</p>
                    </div>
                  </div>
                   
                   {/* Message Input - Always Show */}
                   <div className="p-4 border-t border-muted/30 bg-gradient-to-r from-transparent to-muted/5">
                     <div className="flex gap-3" role="group" aria-label="Message input (disabled)">
                       <Input
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                         placeholder="Select a match first to send a message..."
                         disabled={true}
                         className="flex-1 rounded-xl border-muted/40 bg-muted/30 backdrop-blur-sm"
                         aria-label="Message input - select a match first"
                       />
                       <Button 
                         onClick={generateAIEmojis}
                         disabled={true}
                         variant="outline"
                         size="icon"
                         className="rounded-xl border-muted/40 bg-muted/30"
                         aria-label="Generate AI emoji (disabled - select a match first)"
                         title="Add AI-generated emoji (select a match first)"
                       >
                         <Sparkles className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
                       </Button>
                       <Button 
                         disabled={true}
                         className="rounded-xl bg-muted/30"
                         aria-label="Send message (disabled - select a match first)"
                       >
                         <Send className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
                       </Button>
                     </div>
                   </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* AI Digest Sidebar */}
          {showAIDigest && (
            <Card 
              className="md:col-span-1 bg-gradient-to-br from-background via-background to-muted/20 border-muted/40 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right"
              role="complementary"
              aria-labelledby="ai-digest-title"
            >
              <AIDigestSidebar 
                selectedMatch={selectedMatch}
                otherUserId={selectedMatch ? matches.find(m => m.id === selectedMatch)?.other_user.id || null : null}
                otherUserName={selectedMatch ? matches.find(m => m.id === selectedMatch)?.other_user.name || 'Unknown' : 'Unknown'}
              />
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
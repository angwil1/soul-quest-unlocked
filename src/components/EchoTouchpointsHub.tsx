import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Heart, MessageCircle, Clock, User, ArrowUp } from 'lucide-react';
import { useEchoTouchpoints } from '@/hooks/useEchoTouchpoints';
import { EchoResponseInviteModal } from './EchoResponseInviteModal';
import { EchoConnectionCompletionModal } from './EchoConnectionCompletionModal';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const EchoTouchpointsHub = () => {
  const { 
    quietNotes, 
    responseInvites, 
    limitedChats, 
    loading,
    markQuietNoteAsRead,
    acceptResponseInvite,
    completeConnection
  } = useEchoTouchpoints();
  
  const { toast } = useToast();

  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleRespondToNote = (note: any) => {
    setSelectedNote(note);
    setShowResponseModal(true);
  };

  const handleCompleteConnection = (chat: any) => {
    setSelectedChat(chat);
    setShowCompletionModal(true);
  };

  const getEchoAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  const getEchoTimeFlowStatus = (chat: any) => {
    const age = getEchoAge(chat.created_at);
    
    if (chat.can_complete_connection) {
      return {
        message: "✨ Contemplation phase complete. Echo continues, or deepen when ready.",
        action: "complete",
        className: "text-purple-600 dark:text-purple-400"
      };
    }
    
    if (age === 3) {
      return {
        message: "🌸 Quiet Resonance. Three days of quiet reflection. Would you like to send another Echo?",
        action: "nudge",
        className: "text-blue-600 dark:text-blue-400"
      };
    }
    
    if (age === 7) {
      return {
        message: "🕯️ This Echo has lingered long enough. Would you like to complete the connection?",
        action: "completion_moment",
        className: "text-amber-600 dark:text-amber-400"
      };
    }
    
    if (age > 7) {
      return {
        message: "🌙 Some echoes drift away... Archive or rekindle?",
        action: "archive_or_rekindle",
        className: "text-muted-foreground"
      };
    }
    
    return {
      message: "🎭 Still Listening",
      action: "listening",
      className: "text-blue-600 dark:text-blue-400"
    };
  };

  const handleArchiveEcho = async (chat: any) => {
    // Archive the echo quietly
    toast({
      title: "Echo Archived 🌙",
      description: "Your gentle echo has been preserved in memory",
    });
  };

  const handleRekindleEcho = async (chat: any) => {
    // Send a gentle rekindle invitation
    toast({
      title: "Echo Rekindled ✨", 
      description: "A gentle invitation to reconnect has been sent",
    });
  };

  const onConnectionComplete = async (chatId: string) => {
    await completeConnection(chatId);
  };

  const unreadNotesCount = quietNotes.filter(note => !note.is_read).length;
  const pendingInvitesCount = responseInvites.filter(invite => 
    invite.status === 'pending' && invite.recipient_id === invite.recipient_id
  ).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-spin text-purple-500" />
            <span>Loading Echo touchpoints...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            🪞 Echo Amplified Touchpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quiet-notes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quiet-notes" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Quiet Echoes
                {unreadNotesCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                    {unreadNotesCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Resonance Invites
                {pendingInvitesCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                    {pendingInvitesCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="chats" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Limited Chats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quiet-notes" className="space-y-3 mt-4">
              {quietNotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No quiet echoes yet</p>
                  <p className="text-xs">Your received echoes will appear here</p>
                </div>
              ) : (
                quietNotes.map((note) => (
                  <Card key={note.id} className={`transition-all ${!note.is_read ? 'ring-2 ring-purple-200 dark:ring-purple-800' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Anonymous Echo</span>
                            {!note.is_read && (
                              <Badge variant="destructive" className="text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm italic mb-2">"{note.note_text}"</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!note.is_read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markQuietNoteAsRead(note.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          {!note.response_invite_sent && (
                            <Button
                              size="sm"
                              onClick={() => handleRespondToNote(note)}
                              className="bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600"
                            >
                              Respond
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="invites" className="space-y-3 mt-4">
              {responseInvites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No resonance invites yet</p>
                </div>
              ) : (
                responseInvites.map((invite) => (
                  <Card key={invite.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-pink-500" />
                            <span className="text-sm font-medium">Resonance Invite</span>
                            <Badge variant={invite.status === 'pending' ? 'default' : 'secondary'}>
                              {invite.status}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">"{invite.invite_message}"</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        {invite.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => acceptResponseInvite(invite.id)}
                            className="bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600"
                          >
                            Accept
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="chats" className="space-y-3 mt-4">
              {limitedChats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active resonance chats</p>
                </div>
              ) : (
                limitedChats.map((chat) => (
                  <Card key={chat.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Limited Resonance Chat</span>
                            {chat.can_complete_connection && (
                              <Badge variant="secondary" className="text-xs">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                Ready to Complete
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Daily limit: {chat.daily_message_limit} messages • 
                            Expires {formatDistanceToNow(new Date(chat.expires_at), { addSuffix: true })}
                          </div>
                          
                          {/* Echo Time Flow Status */}
                          <div className="text-xs italic mt-1">
                            <span className={getEchoTimeFlowStatus(chat).className}>
                              {getEchoTimeFlowStatus(chat).message}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Open Chat
                          </Button>
                          
                          {(() => {
                            const status = getEchoTimeFlowStatus(chat);
                            const age = getEchoAge(chat.created_at);
                            
                            switch (status.action) {
                              case 'complete':
                                return (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleCompleteConnection(chat)}
                                    variant="outline"
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-950/20"
                                  >
                                    Deepen Connection
                                  </Button>
                                );
                              
                              case 'nudge':
                                return (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950/20"
                                  >
                                    ✨ Send Echo
                                  </Button>
                                );
                              
                              case 'completion_moment':
                                return (
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleCompleteConnection(chat)}
                                      variant="outline"
                                      className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-950/20"
                                    >
                                      ✅ Complete
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => handleArchiveEcho(chat)}
                                      className="text-amber-600 hover:text-amber-700 dark:text-amber-400"
                                    >
                                      🕯️ Archive
                                    </Button>
                                  </div>
                                );
                              
                              case 'archive_or_rekindle':
                                return (
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => handleArchiveEcho(chat)}
                                      className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                      Archive
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleRekindleEcho(chat)}
                                      className="text-xs text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-950/20"
                                    >
                                      Rekindle
                                    </Button>
                                  </div>
                                );
                              
                              default:
                                return (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-xs text-muted-foreground"
                                    disabled
                                  >
                                    Echo Resonating...
                                  </Button>
                                );
                            }
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedNote && (
        <EchoResponseInviteModal
          isOpen={showResponseModal}
          onClose={() => {
            setShowResponseModal(false);
            setSelectedNote(null);
          }}
          quietNoteId={selectedNote.id}
          recipientId={selectedNote.sender_id}
          originalNote={selectedNote.note_text}
        />
      )}

      {selectedChat && (
        <EchoConnectionCompletionModal
          isOpen={showCompletionModal}
          onClose={() => {
            setShowCompletionModal(false);
            setSelectedChat(null);
          }}
          chatId={selectedChat.id}
          onComplete={onConnectionComplete}
        />
      )}
    </>
  );
};
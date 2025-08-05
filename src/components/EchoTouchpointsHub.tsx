import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Heart, MessageCircle, Clock, User } from 'lucide-react';
import { useEchoTouchpoints } from '@/hooks/useEchoTouchpoints';
import { EchoResponseInviteModal } from './EchoResponseInviteModal';
import { formatDistanceToNow } from 'date-fns';

export const EchoTouchpointsHub = () => {
  const { 
    quietNotes, 
    responseInvites, 
    limitedChats, 
    loading,
    markQuietNoteAsRead,
    acceptResponseInvite
  } = useEchoTouchpoints();

  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  const handleRespondToNote = (note: any) => {
    setSelectedNote(note);
    setShowResponseModal(true);
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
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Limited Resonance Chat</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Daily limit: {chat.daily_message_limit} messages • 
                            Expires {formatDistanceToNow(new Date(chat.expires_at), { addSuffix: true })}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Open Chat
                        </Button>
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
    </>
  );
};
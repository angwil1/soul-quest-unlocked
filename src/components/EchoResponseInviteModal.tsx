import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { useEchoTouchpoints } from '@/hooks/useEchoTouchpoints';

interface EchoResponseInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quietNoteId: string;
  recipientId: string;
  originalNote: string;
}

export const EchoResponseInviteModal = ({ 
  isOpen, 
  onClose, 
  quietNoteId, 
  recipientId,
  originalNote 
}: EchoResponseInviteModalProps) => {
  const [inviteMessage, setInviteMessage] = useState("I'd love to continue this resonance.");
  const [sending, setSending] = useState(false);
  const { sendResponseInvite } = useEchoTouchpoints();

  const handleSend = async () => {
    if (!inviteMessage.trim()) return;
    
    setSending(true);
    const { error } = await sendResponseInvite(quietNoteId, recipientId, inviteMessage);
    
    if (!error) {
      onClose();
    }
    setSending(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Response Invite
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Original Echo:</p>
            <p className="text-sm italic">"{originalNote}"</p>
          </div>

          <p className="text-sm text-muted-foreground">
            Their echo moved you. Send a one-time invite to open a limited resonance chat.
          </p>

          <div>
            <Label htmlFor="invite">Your Invitation</Label>
            <Textarea
              id="invite"
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              maxLength={150}
              className="mt-2 resize-none"
              rows={3}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {inviteMessage.length}/150
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300">
              <strong>Limited Chat:</strong> If accepted, you'll have a gentle conversation space with 
              daily message limits and a natural expiration to encourage meaningful connection.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!inviteMessage.trim() || sending}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600"
            >
              {sending ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
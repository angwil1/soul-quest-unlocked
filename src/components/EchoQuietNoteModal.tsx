import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { useEchoTouchpoints } from '@/hooks/useEchoTouchpoints';

interface EchoQuietNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

export const EchoQuietNoteModal = ({ 
  isOpen, 
  onClose, 
  recipientId, 
  recipientName 
}: EchoQuietNoteModalProps) => {
  const [noteText, setNoteText] = useState('');
  const [sending, setSending] = useState(false);
  const { sendQuietNote } = useEchoTouchpoints();

  const handleSend = async () => {
    if (!noteText.trim()) return;
    
    setSending(true);
    const { error } = await sendQuietNote(recipientId, noteText);
    
    if (!error) {
      setNoteText('');
      onClose();
    }
    setSending(false);
  };

  const exampleNotes = [
    "Your echo felt like dusk.",
    "Something in your story resonated.",
    "Your energy speaks my language.",
    "Found myself in your reflection."
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Send Quiet Echo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Send a one-line expressive note to <span className="font-medium">{recipientName}</span>. 
            No reply required—just a gentle resonance.
          </p>

          <div>
            <Label htmlFor="note">Your Echo</Label>
            <Textarea
              id="note"
              placeholder="Your echo felt like..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              maxLength={120}
              className="mt-2 resize-none"
              rows={3}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {noteText.length}/120
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Echo Examples</Label>
            <div className="space-y-1">
              {exampleNotes.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setNoteText(example)}
                  className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 block transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!noteText.trim() || sending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            >
              {sending ? 'Sending...' : 'Send Echo'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
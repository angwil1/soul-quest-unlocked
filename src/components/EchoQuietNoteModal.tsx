import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { useEchoTouchpoints } from '@/hooks/useEchoTouchpoints';
import { quietNoteSchema, sanitizeInput } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

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
  const [validationError, setValidationError] = useState<string>('');
  const { sendQuietNote } = useEchoTouchpoints();
  const { toast } = useToast();

  const validateAndSanitizeNote = (text: string): { isValid: boolean; sanitized: string; error?: string } => {
    const sanitized = sanitizeInput(text);
    
    try {
      quietNoteSchema.parse({ note: sanitized });
      return { isValid: true, sanitized };
    } catch (error: any) {
      const errorMessage = error.issues?.[0]?.message || 'Invalid note content';
      return { isValid: false, sanitized, error: errorMessage };
    }
  };

  const handleNoteChange = (value: string) => {
    setNoteText(value);
    setValidationError('');
    
    // Real-time validation feedback
    if (value.trim()) {
      const validation = validateAndSanitizeNote(value);
      if (!validation.isValid && validation.error) {
        setValidationError(validation.error);
      }
    }
  };

  const handleSend = async () => {
    const validation = validateAndSanitizeNote(noteText);
    
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid note content');
      toast({
        title: "Validation Error",
        description: validation.error || 'Please check your note content',
        variant: "destructive"
      });
      return;
    }
    
    setSending(true);
    try {
      const { error } = await sendQuietNote(recipientId, validation.sanitized);
      
      if (error) {
        toast({
          title: "Failed to Send Echo",
          description: "Please try again later",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Echo Sent",
          description: `Your quiet echo was sent to ${recipientName}`,
          variant: "default"
        });
        setNoteText('');
        setValidationError('');
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const exampleNotes = [
    "Your echo felt like dusk.",
    "Something in your story resonated.",
    "Your energy speaks my language.",
    "Found myself in your reflection."
  ];

  const isValid = !validationError && noteText.trim().length >= 10;

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
            Send a thoughtful note to <span className="font-medium">{recipientName}</span>. 
            No reply required—just a gentle resonance.
          </p>

          <div>
            <Label htmlFor="note">Your Echo</Label>
            <Textarea
              id="note"
              placeholder="Your echo felt like..."
              value={noteText}
              onChange={(e) => handleNoteChange(e.target.value)}
              maxLength={375}
              className={`mt-2 resize-none ${validationError ? 'border-red-500' : ''}`}
              rows={3}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-muted-foreground">
                {noteText.length}/375
              </div>
              {validationError && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertTriangle className="h-3 w-3" />
                  {validationError}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Echo Examples</Label>
            <div className="space-y-1">
              {exampleNotes.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleNoteChange(example)}
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
              disabled={!isValid || sending}
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
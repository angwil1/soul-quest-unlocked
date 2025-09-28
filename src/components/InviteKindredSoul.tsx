import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const InviteKindredSoul = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultMessage = "I found this quiet space for meaningful connections. Thought you might appreciate it too.";

  const handleInvite = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual email sending via Supabase Edge Function
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Quiet invite sent",
        description: `Your invitation has been sent to ${email}`,
      });
      
      setEmail('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Failed to send quiet invite",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-center">
          <span className="text-2xl">💌</span>
          Send a Quiet Invite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-center leading-relaxed">
          Share this quiet space with someone special.
        </p>
        <p className="text-muted-foreground text-center text-sm">
          Send a gentle invitation to someone who values authentic connections.
        </p>
        
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Enter their email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          
          <textarea
            placeholder="Add a personal message (optional)"
            value={message || defaultMessage}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[80px] p-3 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          
          <Button 
            onClick={handleInvite}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            {isLoading ? 'Sending...' : 'Send Quiet Invite'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
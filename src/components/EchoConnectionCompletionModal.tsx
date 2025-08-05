import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Crown, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface EchoConnectionCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  onComplete: (chatId: string) => void;
}

export const EchoConnectionCompletionModal = ({ 
  isOpen, 
  onClose, 
  chatId, 
  onComplete 
}: EchoConnectionCompletionModalProps) => {
  const [completing, setCompleting] = useState(false);
  const { createCheckout } = useSubscription();

  const handleComplete = async () => {
    setCompleting(true);
    await onComplete(chatId);
    setCompleting(false);
    onClose();
  };

  const handleUpgrade = async (plan: string) => {
    await createCheckout(plan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Complete Your Echo Connection
          </DialogTitle>
          <DialogDescription>
            You've shared 7 days of gentle whispers. Ready to deepen this connection?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
            <div className="flex justify-center items-center gap-2 mb-3">
              <div className="text-2xl">🪞</div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="text-2xl">💖</div>
            </div>
            <h3 className="font-semibold mb-2">From Ambient to Intentional</h3>
            <p className="text-sm text-muted-foreground">
              Transition from Echo's poetic whispers into deeper, more active emotional connection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">💖 Complete Plus</span>
                  <Badge>$7.99/mo</Badge>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground mb-4">
                  <li>• Unlimited messaging</li>
                  <li>• Video calls</li>
                  <li>• Advanced matching</li>
                  <li>• Priority support</li>
                </ul>
                <Button 
                  className="w-full bg-pink-500 hover:bg-pink-600" 
                  onClick={() => handleUpgrade('plus')}
                >
                  Upgrade to Plus
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">🌌 Complete Beyond</span>
                  <Badge>$19.99/mo</Badge>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground mb-4">
                  <li>• Everything in Plus</li>
                  <li>• AI relationship insights</li>
                  <li>• Priority matching</li>
                  <li>• Exclusive events</li>
                </ul>
                <Button 
                  className="w-full bg-purple-500 hover:bg-purple-600" 
                  onClick={() => handleUpgrade('beyond')}
                >
                  Upgrade to Beyond
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Or continue with your current plan and complete the connection
            </p>
            <Button 
              variant="outline" 
              onClick={handleComplete}
              disabled={completing}
              className="min-w-32"
            >
              {completing ? 'Completing...' : 'Complete Connection'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
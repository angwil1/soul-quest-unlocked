import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Gift, Sparkles } from 'lucide-react';

interface WelcomeConfirmationProps {
  isOpen: boolean;
  onContinue: () => void;
}

export const WelcomeConfirmation: React.FC<WelcomeConfirmationProps> = ({ isOpen, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full p-8 text-center bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
        <div className="space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              You're in.
            </h2>
            
            <div className="space-y-3">
              <p className="text-primary font-medium">
                You've unlocked 3 months of Complete Plus. Your wellness gift will ship after 90 days of membership.
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Welcome to a space where authentic connections flourish. Your wellness kit is a keepsake of your journey to meaningful relationships.
            </p>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium"
          >
            Continue to AI Complete Me
          </Button>
        </div>
      </Card>
    </div>
  );
};
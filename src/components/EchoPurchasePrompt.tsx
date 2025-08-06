import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EchoPurchasePromptProps {
  onClose?: () => void;
  className?: string;
}

export const EchoPurchasePrompt: React.FC<EchoPurchasePromptProps> = ({
  onClose,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose?.();
  };

  return (
    <Card className={`max-w-md mx-auto border-purple-200 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Unlock Echo Features
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Access deeper connections and premium dating tools
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Sample Echo Profiles for inspiration</span>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Limited messaging for deeper connections</span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Quiet notes and response invites</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Limited Time
            </Badge>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="font-bold text-lg">$4</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">or</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-600">$12</div>
                <div className="text-xs text-muted-foreground">one-time</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Crown className="h-4 w-4 mr-2" />
            Unlock Echo Access
          </Button>
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Maybe Later
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
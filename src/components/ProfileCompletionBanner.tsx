import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useProfileSetup } from '@/hooks/useProfileSetup';
import { Heart, ArrowRight, X } from 'lucide-react';

interface ProfileCompletionBannerProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
}

export const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({ 
  onDismiss, 
  showDismiss = false 
}) => {
  const { profileStatus, loading } = useProfileSetup();
  const navigate = useNavigate();

  if (loading || profileStatus.isComplete || profileStatus.completionPercentage === 0) {
    return null;
  }

  return (
    <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
      <Heart className="h-4 w-4 text-primary" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">
              Complete your profile to get better matches
            </span>
            <span className="text-sm font-bold text-primary">
              {profileStatus.completionPercentage}%
            </span>
          </div>
          <Progress 
            value={profileStatus.completionPercentage} 
            className="h-2 mb-2"
          />
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              onClick={() => navigate('/profile/setup')}
              className="h-7 text-xs"
            >
              Continue Setup
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
            {showDismiss && onDismiss && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDismiss}
                className="h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
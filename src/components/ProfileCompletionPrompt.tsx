import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useProfileSetup } from '@/hooks/useProfileSetup';
import { Heart, ArrowRight, CheckCircle, X } from 'lucide-react';

interface ProfileCompletionPromptProps {
  onDismiss?: () => void;
}

export const ProfileCompletionPrompt: React.FC<ProfileCompletionPromptProps> = ({ onDismiss }) => {
  const { profileStatus, getNextStep } = useProfileSetup();
  const navigate = useNavigate();

  if (profileStatus.isComplete) return null;

  const nextStep = getNextStep();
  
  const getCompletionColor = () => {
    if (profileStatus.completionPercentage >= 80) return 'text-green-600';
    if (profileStatus.completionPercentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const completionItems = [
    { label: 'Basic Info', completed: profileStatus.hasBasicInfo },
    { label: 'Bio & Story', completed: profileStatus.hasBio },
    { label: 'Interests', completed: profileStatus.hasInterests },
    { label: 'Photos', completed: profileStatus.hasPhotos },
    { label: 'Personality', completed: profileStatus.hasPersonality },
    { label: 'Values', completed: profileStatus.hasValues },
  ];

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Get better matches with a complete profile
              </p>
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className={`text-sm font-bold ${getCompletionColor()}`}>
              {profileStatus.completionPercentage}%
            </span>
          </div>
          
          <Progress value={profileStatus.completionPercentage} className="h-2" />

          <div className="grid grid-cols-2 gap-2">
            {completionItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted" />
                )}
                <span className={`text-sm ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <Badge variant="secondary" className="text-xs">
                Next: {nextStep.description}
              </Badge>
            </div>
            
            <Button 
              onClick={() => navigate('/profile/setup')}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              Continue Setup
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
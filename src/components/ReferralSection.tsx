import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, Gift, Share, Badge } from 'lucide-react';

interface ReferralSectionProps {
  referralCount?: number;
  successfulReferrals?: number;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({ 
  referralCount = 0, 
  successfulReferrals = 0 
}) => {
  const progressToNextReward = (successfulReferrals % 5) / 5 * 100;
  const hasWellnessKit = successfulReferrals >= 1;
  const hasFoundingBadge = successfulReferrals >= 5;
  
  const handleInvite = () => {
    // Implement referral invitation logic
    if (navigator.share) {
      navigator.share({
        title: 'Join me on AI Complete Me',
        text: 'Discover meaningful connections beyond the swipes. Join me on AI Complete Me - where real connection begins.',
        url: window.location.origin
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}?ref=${Math.random().toString(36).substr(2, 9)}`);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Share the Journey</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Invite someone to begin their Soul Quest. You'll earn a wellness gift that ships after 90 days of membership.
          </p>
        </div>

        {/* Current Status */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{referralCount}</div>
              <div className="text-xs text-muted-foreground">People Invited</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">{successfulReferrals}</div>
              <div className="text-xs text-muted-foreground">Successful Referrals</div>
            </div>
          </div>

          {/* Progress Example */}
          {successfulReferrals >= 1 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-sm text-green-700 font-medium">
                You've earned a wellness gift. It will ship after 90 days of membership.
              </p>
            </div>
          )}
          
          {successfulReferrals >= 2 && successfulReferrals < 5 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <p className="text-sm text-purple-700 font-medium">
                You've invited {referralCount} people. One more unlocks your IRL gift.
              </p>
            </div>
          )}
        </div>

        {/* Rewards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className={`p-3 rounded-lg border-2 transition-all ${
            successfulReferrals >= 1 
              ? 'border-green-200 bg-green-50 text-green-800' 
              : 'border-dashed border-muted-foreground/30 text-muted-foreground'
          }`}>
            <Gift className="h-4 w-4 mx-auto mb-1" />
            <div className="text-xs font-medium">Wellness Kit</div>
            <div className="text-xs">1 referral</div>
          </div>
          
          <div className={`p-3 rounded-lg border-2 transition-all ${
            successfulReferrals >= 5 
              ? 'border-purple-200 bg-purple-50 text-purple-800' 
              : 'border-dashed border-muted-foreground/30 text-muted-foreground'
          }`}>
            <Badge className="h-4 w-4 mx-auto mb-1" />
            <div className="text-xs font-medium">Founding Badge</div>
            <div className="text-xs">5 referrals</div>
          </div>

          <div className="p-3 rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground">
            <Heart className="h-4 w-4 mx-auto mb-1" />
            <div className="text-xs font-medium">+1 Month</div>
            <div className="text-xs">Per referral</div>
          </div>
        </div>

        {/* Invite Button */}
        <Button 
          onClick={handleInvite}
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium group"
        >
          <Share className="h-4 w-4 mr-2" />
          Invite Someone Special
          <Users className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};
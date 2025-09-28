import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package, Calendar, Heart } from 'lucide-react';
import { useShippingEligibility } from '@/hooks/useShippingEligibility';

export const ShippingProgressTracker: React.FC = () => {
  const { eligibility, isLoading, formatEligibleDate, formatDaysRemaining } = useShippingEligibility();

  if (isLoading || !eligibility) {
    return null;
  }

  // Don't show if no signup found
  if (eligibility.reason === 'no_signup_found') {
    return null;
  }

  const isEligible = eligibility.eligible;
  const daysRemaining = eligibility.days_remaining || 0;
  const totalDays = 90;
  const daysCompleted = totalDays - daysRemaining;
  const progressPercentage = Math.max(0, Math.min(100, (daysCompleted / totalDays) * 100));

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Wellness Kit Progress</h3>
            <p className="text-sm text-muted-foreground">
              {isEligible 
                ? "Your wellness kit is ready to ship! 🎉" 
                : `Your wellness kit will ship after 90 days of active membership. You're ${daysCompleted} days in.`
              }
            </p>
          </div>
        </div>

        {!isEligible && (
          <>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">
                  {daysCompleted} / {totalDays} days
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {daysRemaining > 0 
                  ? `${formatDaysRemaining(daysRemaining)} remaining`
                  : 'Eligible now!'
                }
              </span>
            </div>
          </>
        )}

        {isEligible && eligibility.shipping_status === 'eligible' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 text-green-800">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">
                Congratulations! Your wellness kit is ready to ship.
              </span>
            </div>
          </div>
        )}

        {isEligible && eligibility.shipping_status === 'shipped' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Package className="h-4 w-4" />
              <span className="text-sm font-medium">
                Your wellness kit has been shipped! 📦
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Clock, Users, Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LaunchBannerProps {
  className?: string;
  showDismiss?: boolean;
  variant?: 'homepage' | 'quiz';
}

export const LaunchBanner: React.FC<LaunchBannerProps> = ({ 
  className = "", 
  showDismiss = false,
  variant = 'homepage'
}) => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [progress, setProgress] = useState(0);

  // Calculate time remaining and progress (60 days from launch - using a fixed launch date for demo)
  useEffect(() => {
    const launchDate = new Date('2024-08-16'); // Launch date
    const endDate = new Date(launchDate.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 days later
    const totalDuration = 60 * 24 * 60 * 60 * 1000; // 60 days in milliseconds
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;
      const elapsed = totalDuration - distance;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({ days, hours, minutes });
        
        // Calculate progress percentage (how much time has elapsed)
        const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        setProgress(progressPercentage);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuizStart = () => {
    navigate('/questions');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('launchBannerDismissed', 'true');
  };

  // Check if banner was previously dismissed
  useEffect(() => {
    if (showDismiss) {
      const dismissed = localStorage.getItem('launchBannerDismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, [showDismiss]);

  if (isDismissed) return null;

  return (
    <Card className={`relative overflow-hidden bg-gradient-launch border-pink-500/30 shadow-launch ${className}`}>
      {showDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="absolute top-2 right-2 h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/20 z-10"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      <CardContent className="p-3 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          {/* Left side - Main message */}
          <div className="text-center md:text-left">
            <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2">
              🎁 Quiet Start Offer
            </h3>
            
            <p className="text-white/90 text-xs md:text-base mb-2 md:mb-3 leading-tight">
              The first 500 Soul Questers receive 3 months of Complete Plus + a wellness keepsake. Kits also available for referrers—until all 500 are claimed.
            </p>
            
            <div className="text-white/80 text-xs md:text-sm mb-1">
              🍃 Mini Wellness Kit: Calming tea sachet, soft-touch lip balm, and a poetic postcard to mark your beginning
            </div>
            
            <div className="text-white/80 text-xs md:text-sm mb-1">
              🤝 Referral Rewards: Invite someone to join. Earn bonus months, unlock badges, and receive more gifts—while supplies last
            </div>
            
            <div className="text-white/80 text-xs md:text-sm">
              ⏳ Limited to First 500 Users: Quiet window closes soon. You're invited.
            </div>
          </div>

          {/* Right side - Features and countdown */}
          <div className="flex flex-col items-center gap-2 md:gap-3 min-w-0">
            {/* Countdown */}
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <div className="text-xs md:text-sm font-medium">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left
              </div>
            </div>

            <div className="w-full max-w-48 space-y-2">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Quiet Window Progress</span>
                <span>🔒 0% claimed</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-white/80 [&>div]:to-white/60" 
              />
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-1 md:gap-2 text-xs text-white/90">
              <div className="flex items-center gap-1">
                <span>🎁 3 Months Free</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🍃 Wellness Kit</span>
              </div>
              <span>🤝 Referral Rewards</span>
            </div>

            {/* CTA Button */}
            {variant === 'homepage' && (
              <Button 
                onClick={handleQuizStart}
                variant="secondary"
                size="sm"
                className="bg-white text-black hover:bg-white/90 font-medium text-xs md:text-sm px-3 py-1.5 animate-gentle-pulse"
              >
                Claim Quiet Start Offer ✨
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
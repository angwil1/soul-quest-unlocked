import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Clock, Users, Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuietStartProgress } from '@/hooks/useQuietStartProgress';

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
  const [poeticPhrase, setPoeticPhrase] = useState("");
  const { claimedCount } = useQuietStartProgress();

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
        
        // Set poetic phrases based on time left
        if (days > 30) {
          setPoeticPhrase("The invitation extends its gentle hand...");
        } else if (days > 14) {
          setPoeticPhrase("Your moment approaches softly...");
        } else if (days > 7) {
          setPoeticPhrase("The quiet window whispers your name...");
        } else if (days > 1) {
          setPoeticPhrase("Few heartbeats remain in this sacred pause...");
        } else {
          setPoeticPhrase("The quiet window is closing. Don't miss your moment.");
        }
        
        // Calculate progress percentage (how much time has elapsed)
        const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        setProgress(progressPercentage);
      } else {
        setPoeticPhrase("The invitation continues to extend its gentle hand...");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuizStart = () => {
    navigate('/quick-start');
    // Scroll to top after navigation
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('launchBannerDismissed', 'true');
  };

  // Check if banner was previously dismissed
  useEffect(() => {
    if (showDismiss) {
      // Temporarily clear the dismissed state to show the banner again
      localStorage.removeItem('launchBannerDismissed');
      const dismissed = localStorage.getItem('launchBannerDismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, [showDismiss]);

  if (isDismissed) return null;

  return (
    <>
      <TooltipProvider>
      <Card className={`relative overflow-hidden bg-gradient-to-r from-pink-100/80 to-yellow-100 border-gold-light/30 shadow-launch dark:from-pink-900/40 dark:to-yellow-900/40 ${className}`} style={{ background: 'var(--blush-to-gold)' }}>
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
        
        <CardContent className="p-3 md:p-4 lg:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Left side - Main message */}
            <div className="text-center md:text-left flex-1">
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-amber-800 mb-1 md:mb-2 flex items-center gap-2">
                <span className="gold-badge px-3 py-1 rounded-full text-sm font-medium">🎁</span>
                Quiet Start Offer
              </h3>
              
              <p className="text-amber-800/80 text-xs md:text-sm lg:text-base mb-2 md:mb-3 leading-tight max-w-2xl">
                The first 500 Soul Questers receive 3 months of Complete Plus + a mini wellness keepsake. Kits also available for referrers—until all 500 are claimed.
              </p>
              
              <div className="space-y-1 text-amber-800/70 text-xs md:text-sm">
                <div>
                  🤝 Referral Rewards: Invite someone to join. Earn bonus months, unlock badges, and receive more gifts—while supplies last
                </div>
                
                <div>
                  ⏳ Limited to First 500 Users: Quiet window closes soon. You're invited.
                </div>
              </div>
            </div>

            {/* Right side - Features and countdown */}
            <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4 min-w-0 w-full sm:w-auto md:w-64 lg:w-auto">
              {/* Poetic Countdown */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-1 sm:gap-2 text-amber-800 text-center">
                <Clock className="h-3 w-3 md:h-4 md:w-4 animate-pulse flex-shrink-0 text-amber-700" />
                <div className="text-xs md:text-sm font-medium italic text-center leading-tight">
                  {poeticPhrase}
                </div>
              </div>

              {/* Claimed Progress Bar */}
              <div className="w-full max-w-60 sm:max-w-56 md:max-w-60 lg:max-w-48 space-y-2">
                <div className="text-center text-xs md:text-sm text-amber-800/70">
                  <span>Wellness Kits Claimed: {claimedCount} of 500</span>
                </div>
                <Progress 
                  value={(claimedCount / 500) * 100} 
                  className="h-2 md:h-3 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400/80 [&>div]:to-emerald-300/60 [&>div]:animate-pulse" 
                />
                <div className="text-center text-xs md:text-sm text-emerald-700 font-medium leading-tight">
                  {claimedCount === 0 
                    ? "The journey begins now." 
                    : claimedCount < 50 
                      ? "You're part of the first wave of connection." 
                      : `${500 - claimedCount} spots remaining`
                  }
                </div>
              </div>

              {/* Features with Mobile-Optimized Tooltips */}
              <div className="flex flex-wrap justify-center gap-1 md:gap-2 text-xs md:text-sm text-amber-800/90">
                {/* On mobile, show simple text without tooltips */}
                <div className="sm:hidden flex flex-wrap justify-center gap-2 text-xs">
                  <span>🎁 3 Months Free</span>
                  <span>🤝 Referral Rewards</span>
                </div>
                
                {/* On tablet and larger screens, show tooltips */}
                <div className="hidden sm:flex flex-wrap justify-center gap-1 md:gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help hover-scale px-1 py-0.5 rounded hover:bg-amber-100/20 transition-colors">
                        <span>🎁 3 Months Free</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Complete Plus membership with all premium features</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help hover-scale px-1 py-0.5 rounded hover:bg-amber-100/20 transition-colors">🤝 Referral Rewards</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Earn bonus months and unlock special badges</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* CTA Button */}
              {variant === 'homepage' && (
                <Button 
                  onClick={handleQuizStart}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 font-medium text-xs md:text-sm px-2 sm:px-3 md:px-4 py-1.5 hover-scale animate-pulse w-full sm:w-auto md:w-full lg:w-auto"
                >
                  See How It Works ✨
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      </TooltipProvider>
    </>
  );
};
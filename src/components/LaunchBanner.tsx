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
              Quiet Start During Launch
            </h3>
            
            <p className="text-white/90 text-xs md:text-base mb-2 md:mb-3 leading-tight">
              AI Complete Me invites you to begin quietly. 💫 No email. No payment. Just connection.
            </p>
            
            <div className="text-white/80 text-xs md:text-sm mb-2">
              ✨ All identities welcome. All journeys respected.
            </div>
            
            <div className="text-white/80 text-xs md:text-sm">
              ⏳ This quiet window won't last forever.
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

            {/* Progress Bar */}
            <div className="w-full max-w-48 space-y-2">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Quiet window progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-white/80 [&>div]:to-white/60" 
              />
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-1 md:gap-2 text-xs text-white/90">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>Compatibility Quiz</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Basic Matching</span>
              </div>
              <span>All Preferences</span>
            </div>

            {/* CTA Button */}
            {variant === 'homepage' && (
              <Button 
                onClick={handleQuizStart}
                variant="secondary"
                size="sm"
                className="bg-white text-black hover:bg-white/90 font-medium text-xs md:text-sm px-3 py-1.5 animate-gentle-pulse"
              >
                Start Quiz - Quiet Start ✨
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
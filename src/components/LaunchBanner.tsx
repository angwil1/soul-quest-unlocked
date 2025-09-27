import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Clock, Users, Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuietStartProgress } from '@/hooks/useQuietStartProgress';
import logoImage from "@/assets/logo.png";

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
      <Card className={`relative overflow-hidden quiet-start-card rounded-2xl ${className}`}>
        {showDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute top-3 right-3 h-7 w-7 p-0 text-amber-700/60 hover:text-amber-800 hover:bg-amber-100/30 z-10 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <CardContent className="p-6 md:p-8">
          {/* Centered Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={logoImage} 
              alt="AI Complete Me" 
              className="h-16 w-16 md:h-20 md:w-20 opacity-90"
            />
          </div>
          
          {/* Main Content */}
          <div className="text-center space-y-6">
            {/* Poetic Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-light text-amber-900 keepsake-heading">
                Begin quietly. Connect deeply.
              </h2>
              <p className="text-lg md:text-xl text-amber-800/80 keepsake-heading italic">
                Founding hearts receive 3 months free + a keepsake of care
              </p>
            </div>
            {/* Gentle Progress Indicator */}
            <div className="w-full max-w-md space-y-4">
              <div className="text-center text-sm text-amber-800/70 keepsake-heading">
                <span className="heart-accent">♡</span> Wellness Kits Claimed: {claimedCount} of 500 <span className="heart-accent">♡</span>
              </div>
              <Progress 
                value={(claimedCount / 500) * 100} 
                className="h-2 bg-amber-100/50 [&>div]:bg-gradient-to-r [&>div]:from-gold [&>div]:to-gold-light" 
              />
              <div className="text-center text-sm text-amber-700 keepsake-heading italic">
                {claimedCount === 0 
                  ? "Your journey awaits..." 
                  : claimedCount < 50 
                    ? "Among the first to connect..." 
                    : `${500 - claimedCount} keepsakes remain`
                }
              </div>
            </div>

            {/* Poetic Countdown */}
            <div className="flex items-center gap-2 text-amber-700 text-center">
              <Clock className="h-4 w-4 heart-accent" />
              <div className="text-sm keepsake-heading italic">
                {poeticPhrase}
              </div>
            </div>

            {/* Call to Action */}
            {variant === 'homepage' && (
              <Button 
                onClick={handleQuizStart}
                variant="secondary"
                size="lg"
                className="shimmer-button bg-white/80 text-amber-900 hover:bg-white border-2 border-gold/30 hover:border-gold/60 font-medium keepsake-heading px-8 py-3 rounded-xl"
              >
                <span className="heart-accent mr-2">♡</span>
                Begin Your Journey
                <span className="heart-accent ml-2">♡</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      </TooltipProvider>
    </>
  );
};
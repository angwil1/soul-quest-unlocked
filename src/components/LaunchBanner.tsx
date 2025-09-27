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

  const handleReopen = () => {
    setIsDismissed(false);
    localStorage.removeItem('launchBannerDismissed');
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

  if (isDismissed) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${className}`}>
        <div className="h-32 md:h-40 bg-[#fdf6f2] opacity-40 border border-gold/20 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <div className="text-center keepsake-text text-sm opacity-60">
            <span className="keepsake-heart">♡</span> Offer closed - thank you for visiting <span className="keepsake-heart">♡</span>
          </div>
          <button
            onClick={handleReopen}
            className="text-xs keepsake-heading border border-gold/40 hover:border-gold/60 px-3 py-1 rounded-full keepsake-text hover:bg-gold/10 transition-all duration-300"
          >
            Reopen Quiet Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TooltipProvider>
      <Card className={`relative overflow-hidden quiet-start-card rounded-2xl ${className}`}>
        {showDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute top-3 right-3 h-7 w-7 p-0 keepsake-text hover:keepsake-heart hover:bg-gold/10 z-10 rounded-full"
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
          <div className="text-center space-y-8">
            {/* Poetic Tagline - Positioned prominently */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-light keepsake-heading keepsake-tagline tracking-wide">
                Begin quietly. Connect deeply.
              </h2>
            </div>

            {/* Keepsake Preview */}
            <div className="keepsake-preview max-w-sm mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-8 h-1 bg-gold-gradient rounded-full"></div>
                <span className="keepsake-heart text-lg">✦</span>
                <div className="w-8 h-1 bg-gold-gradient rounded-full"></div>
              </div>
              <p className="text-sm keepsake-text keepsake-heading italic">
                A keepsake of care to mark your beginning.
              </p>
              <div className="mt-2 text-xs keepsake-text opacity-75">
                Handwritten wellness card + mindful pen
              </div>
            </div>

            {/* Offer Box */}
            <div className="offer-box p-6 max-w-md mx-auto">
              <p className="text-lg md:text-xl keepsake-text keepsake-heading italic mb-4">
                Founding hearts receive 3 months free + a keepsake of care
              </p>
              
              {/* Live Counter with Pulse */}
              <div className="keepsake-counter">
                <div className="text-center text-sm keepsake-text keepsake-heading">
                  <span className="keepsake-heart">♡</span> {claimedCount} of 500 spots claimed <span className="keepsake-heart">♡</span>
                </div>
              </div>
              
              <Progress 
                value={(claimedCount / 500) * 100} 
                className="h-2 keepsake-progress [&>div]:bg-gold-gradient mt-3" 
              />
              <div className="text-center text-sm keepsake-text keepsake-heading italic mt-2">
                {claimedCount === 0 
                  ? "Your journey awaits..." 
                  : claimedCount < 50 
                    ? "Among the first to connect..." 
                    : `${500 - claimedCount} keepsakes remain`
                }
              </div>
            </div>

            {/* Poetic Countdown */}
            <div className="flex items-center gap-2 keepsake-text text-center">
              <Clock className="h-4 w-4 keepsake-heart" />
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
                className="keepsake-button font-medium keepsake-heading px-8 py-3 rounded-xl"
              >
                <span className="keepsake-heart mr-2">♡</span>
                Claim Your Spot
                <span className="keepsake-heart ml-2">♡</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      </TooltipProvider>
    </>
  );
};
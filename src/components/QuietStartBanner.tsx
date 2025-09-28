import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Heart, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuietStartProgress } from '@/hooks/useQuietStartProgress';
import logoImage from "@/assets/logo-transparent-new.png";

interface QuietStartBannerProps {
  className?: string;
}

export const QuietStartBanner: React.FC<QuietStartBannerProps> = ({ 
  className = "" 
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { claimedCount } = useQuietStartProgress();

  // Gentle appearance after 3 seconds, positioned over ambient photos
  useEffect(() => {
    const dismissed = localStorage.getItem('quietStartBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleQuizStart = () => {
    navigate('/quick-start');
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
      localStorage.setItem('quietStartBannerDismissed', 'true');
    }, 300);
  };

  const scrollToCouples = () => {
    const couplesSection = document.querySelector('[aria-labelledby="couples-section"]');
    if (couplesSection) {
      couplesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center p-4 ${
        isVisible ? 'animate-fade-in' : 'opacity-0 pointer-events-none'
      } transition-all duration-700 ease-out ${className}`}
    >
      {/* Soft backdrop that preserves ambient photos */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-transparent backdrop-blur-[2px]"
        onClick={handleDismiss}
      />
      
      {/* Floating offer card - positioned to not dominate */}
      <Card className="relative w-full max-w-lg quiet-start-floating animate-scale-in">
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="absolute top-3 right-3 h-7 w-7 p-0 text-muted-foreground hover:text-foreground z-10 rounded-full bg-background/90 backdrop-blur-sm border border-border/20"
        >
          <X className="h-3 w-3" />
        </Button>
        
        <CardContent className="p-6 text-center space-y-6">
          {/* Compact logo */}
          <div className="flex justify-center">
            <img 
              src={logoImage} 
              alt="AI Complete Me" 
              className="h-12 w-12 opacity-80"
            />
          </div>
          
          {/* Poetic tagline - more compact */}
          <div className="space-y-1">
            <h1 className="text-xl font-light text-foreground/90 font-serif tracking-wide">
              Begin quietly. Connect deeply.
            </h1>
          </div>

          {/* Compact offer */}
          <div className="quiet-start-offer-compact">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground/80 font-serif">
                Quiet Start
              </h2>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                First 200 founding hearts: 3 months Complete Plus free + keepsake of care
              </p>
              
              {/* Minimal progress */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  <Heart className="inline h-3 w-3 mr-1 text-primary/60" />
                  {claimedCount} of 200 spots claimed
                </div>
                
                <Progress 
                  value={(claimedCount / 200) * 100} 
                  className="h-1.5 quiet-start-progress-minimal" 
                />
              </div>

              {/* Compact details */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>✓ No charge today—bill after trial</p>
                <p>✓ Full Complete Plus access</p>
              </div>
            </div>
          </div>

          {/* Gentle CTA */}
          <Button 
            onClick={handleQuizStart}
            className="quiet-start-button-subtle px-6 py-2 text-sm font-medium"
            size="sm"
          >
            <Heart className="h-3 w-3 mr-2" />
            Claim Your Spot
          </Button>
        </CardContent>
      </Card>

      {/* Scroll cue to encourage exploration below */}
      <Button
        variant="ghost"
        onClick={scrollToCouples}
        className="mt-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full p-2 animate-bounce"
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
      
      <p className="text-xs text-white/60 mt-2 font-light">
        See inspiring connections below
      </p>
    </div>
  );
};
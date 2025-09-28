import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Heart } from 'lucide-react';
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

  // Gentle appearance after 2 seconds
  useEffect(() => {
    const dismissed = localStorage.getItem('quietStartBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

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

  if (isDismissed) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isVisible ? 'animate-fade-in' : 'opacity-0 pointer-events-none'
      } transition-all duration-500 ease-out ${className}`}
    >
      {/* Soft backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      {/* Banner container - 60-70% viewport height */}
      <Card className="relative w-full max-w-2xl max-h-[70vh] overflow-y-auto quiet-start-elegant animate-scale-in">
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="absolute top-4 right-4 h-8 w-8 p-0 text-muted-foreground hover:text-foreground z-10 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardContent className="p-8 md:p-12 text-center space-y-8">
          {/* Gentle logo */}
          <div className="flex justify-center opacity-80">
            <img 
              src={logoImage} 
              alt="AI Complete Me" 
              className="h-16 w-16 md:h-20 md:w-20"
            />
          </div>
          
          {/* Poetic tagline */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-light text-foreground/90 font-serif tracking-wide">
              Begin quietly. Connect deeply.
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              AI Complete Me
            </p>
          </div>

          {/* Soft breathing space */}
          <div className="quiet-start-offer-gentle">
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-medium text-foreground/80 font-serif">
                Quiet Start
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                The first 200 founding hearts receive 3 months of Complete Plus free, 
                plus a keepsake of care to honor your beginning.
              </p>
              
              {/* Gentle progress indicator */}
              <div className="space-y-3">
                <div className="text-center text-sm text-muted-foreground">
                  <Heart className="inline h-4 w-4 mr-1 text-primary/60" />
                  {claimedCount} of 200 spots claimed
                  <Heart className="inline h-4 w-4 ml-1 text-primary/60" />
                </div>
                
                <Progress 
                  value={(claimedCount / 200) * 100} 
                  className="h-2 quiet-start-progress-gentle" 
                />
                
                <p className="text-xs text-muted-foreground italic">
                  {claimedCount === 0 
                    ? "Your journey awaits..." 
                    : claimedCount < 50 
                      ? "Among the first to connect..." 
                      : `${200 - claimedCount} keepsakes remain`
                  }
                </p>
              </div>

              {/* Gentle details */}
              <div className="space-y-2 text-sm text-muted-foreground max-w-sm mx-auto">
                <p>✓ No charge today—we'll only bill after your trial ends</p>
                <p>✓ Full access to Complete Plus features</p>
                <p>✓ Keepsake mailed after 30–60 days of enrollment</p>
              </div>
            </div>
          </div>

          {/* Soft call to action */}
          <Button 
            onClick={handleQuizStart}
            className="quiet-start-button-gentle px-8 py-3 text-base font-medium"
            size="lg"
          >
            <Heart className="h-4 w-4 mr-2" />
            Claim Your Spot Gently
          </Button>
          
          <p className="text-xs text-muted-foreground">
            A moment of quiet intention before connecting
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
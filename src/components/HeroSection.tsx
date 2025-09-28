import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, ArrowRight, ChevronDown } from 'lucide-react';
import { useQuietStartProgress } from '@/hooks/useQuietStartProgress';
import logoImage from "@/assets/logo-transparent-new.png";

// Import original rotating hero images
import coupleHeroMobile1 from '@/assets/couple-hero-mobile-1.jpg';
import coupleHeroMobile2 from '@/assets/couple-hero-mobile-2.jpg';
import coupleHeroMobile3 from '@/assets/couple-hero-mobile-3.jpg';
import coupleLgbtqMobile1 from '@/assets/couple-hero-mobile-lgbtq-1.jpg';
import coupleLgbtqHispanicRomantic from '@/assets/couple-hero-mobile-lgbtq-hispanic-romantic.jpg';

// Original rotating background images
const heroImages = [
  coupleHeroMobile1,
  coupleHeroMobile2, 
  coupleHeroMobile3,
  coupleLgbtqMobile1,
  coupleLgbtqHispanicRomantic
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { claimedCount } = useQuietStartProgress();

  // Original rotating background images effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/quick-start');
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const scrollToNext = () => {
    const nextSection = document.querySelector('#how-it-works');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[100vh] min-h-[100dvh] bg-gradient-to-br from-background via-muted/20 to-background">
      
      {/* Original rotating background images - Full screen */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHeroImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt="Loving couples celebrating authentic connections"
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/40" />
      </div>

      {/* Mobile-First Responsive Layout */}
      <div className="flex flex-col lg:flex-row min-h-[100vh] min-h-[100dvh] relative z-10">
        
        {/* Center - Quiet Start Offer */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-20">
          <div className="max-w-md lg:max-w-lg w-full space-y-6 lg:space-y-8 animate-fade-in-delayed">
            
            {/* Logo and branding */}
            <div className="text-center space-y-3 lg:space-y-4">
              <div className="flex justify-center">
                <img 
                  src={logoImage} 
                  alt="AI Complete Me" 
                  className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 opacity-90"
                />
              </div>
              <div className="space-y-1 lg:space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white font-serif tracking-wide drop-shadow-lg">
                  Begin quietly. Connect deeply.
                </h1>
                <p className="text-xs sm:text-sm text-white/90 font-serif drop-shadow-md">
                  AI Complete Me
                </p>
              </div>
            </div>

            {/* Quiet Start Offer */}
            <div className="hero-quiet-start-card backdrop-blur-md bg-white/10 border-white/20 p-4 sm:p-6 lg:p-8">
              <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-center">
                <h2 className="text-xl sm:text-2xl font-medium text-white font-serif drop-shadow-md">
                  Quiet Start
                </h2>
                
                <p className="text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-sm px-2 sm:px-0">
                  The first 200 founding hearts receive 3 months of Complete Plus free, 
                  plus a keepsake of care to honor your beginning.
                </p>
                
                {/* Progress indicator */}
                <div className="space-y-3">
                  <div className="text-center text-sm text-white/90">
                    <Heart className="inline h-4 w-4 mr-1 text-pink-300" />
                    {claimedCount} of 200 spots claimed
                    <Heart className="inline h-4 w-4 ml-1 text-pink-300" />
                  </div>
                  
                  <Progress 
                    value={(claimedCount / 200) * 100} 
                    className="h-2 hero-progress bg-white/20" 
                  />
                  
                  <p className="text-xs text-white/80 italic">
                    {claimedCount === 0 
                      ? "Your journey awaits..." 
                      : claimedCount < 50 
                        ? "Among the first to connect..." 
                        : `${200 - claimedCount} keepsakes remain`
                    }
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/90 px-2 sm:px-0">
                  <p>✓ No charge today—we'll only bill after your trial ends</p>
                  <p>✓ Full access to Complete Plus features</p>
                  <p>✓ Keepsake mailed after 30–60 days of enrollment</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-3 sm:space-y-4">
              <Button 
                onClick={handleGetStarted}
                className="hero-cta-button w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium bg-white text-primary hover:bg-white/90"
                size="lg"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Claim Your Spot
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="w-full text-xs sm:text-sm text-white/90 hover:text-white hover:bg-white/10 py-2 sm:py-3"
              >
                Already have an account? Log in
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <Button
          variant="ghost"
          onClick={scrollToNext}
          className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 animate-bounce"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
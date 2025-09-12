import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Users, ArrowRight } from 'lucide-react';
import coupleHeroMobile1 from '@/assets/couple-hero-mobile-1.jpg';
import coupleHeroMobile2 from '@/assets/couple-hero-mobile-2.jpg';
import coupleHeroMobile3 from '@/assets/couple-hero-mobile-3.jpg';
import coupleLgbtqMobile1 from '@/assets/couple-hero-mobile-lgbtq-1.jpg';
import coupleLgbtqHispanicRomantic from '@/assets/couple-hero-mobile-lgbtq-hispanic-romantic.jpg';

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

  // Hero image rotation effect - Optimized for mobile performance
  useEffect(() => {
    // Reduce frequency and use requestAnimationFrame for better performance
    const interval = setInterval(() => {
      requestAnimationFrame(() => {
        setCurrentHeroImageIndex((prevIndex) => 
          (prevIndex + 1) % heroImages.length
        );
      });
    }, 8000); // Increased from 5s to 8s for better performance

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

  return (
    <section className="relative overflow-hidden min-h-[100vh] min-h-[100dvh] flex items-center justify-center bg-white">
      
      {/* Already have account - Top Right - Mobile optimized */}
      <div className="hidden">
        <p className="text-muted-foreground mb-2 text-xs sm:text-sm text-right">Already have an account?</p>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/auth')}
          className="text-muted-foreground hover:text-foreground font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 touch-target backdrop-blur-sm border border-white/10"
        >
          Log in
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {/* Hero Content */}
      <div className="relative w-full h-full">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-purple-100/20 opacity-30 md:opacity-0 z-0"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/20 to-transparent md:hidden z-0"></div>
        
        {/* Primary Background Image - Universal mobile optimization for Android & iOS */}
         <picture className="absolute inset-0 w-full h-full z-0">
            <img 
              src={heroImages[currentHeroImageIndex]} 
              alt="Loving couples celebrating authentic connections" 
              className={`w-full h-full object-cover transition-all duration-500 object-center ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                objectPosition: 'center center',
                willChange: 'opacity'
              }}
              loading="eager"
              onLoad={() => setIsLoaded(true)}
              key={currentHeroImageIndex}
            />
         </picture>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-50/5 via-transparent to-transparent md:hidden z-5"></div>
        
        {/* Floating background elements - Simplified for performance */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-200/10 to-purple-300/5 rounded-full blur-lg animate-pulse z-1" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-300/10 to-purple-200/5 rounded-full blur-lg animate-pulse z-1" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>

        {/* Hero Content - Mobile optimized */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
          <div className="space-y-8 sm:space-y-12 lg:space-y-16 animate-fade-in">
            
            {/* Poetic Hero Content */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 mt-8 sm:mt-12">
              {/* Emotional Badge - Mobile optimized */}
              <div className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform duration-300 touch-target max-w-xs sm:max-w-sm md:max-w-none mx-auto">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-white animate-pulse flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base font-medium text-white text-center leading-tight">
                  Where souls recognize each other
                </span>
              </div>

              {/* Hero Headline - Mobile optimized */}
              <div className="space-y-4 sm:space-y-6">
                <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light leading-tight tracking-wide">
                  <span className="block text-white drop-shadow-2xl animate-fade-in" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)', animationDelay: '0.1s' }}>
                    AI Complete Me is live.
                  </span>
                </h1>
                
                <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-white max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg animate-fade-in px-4" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.7)', animationDelay: '0.4s' }}>
                  First 500 users receive 3 months free + a wellness kit. Kits also available for referrers—until all 500 are claimed.
                </p>
              </div>
            </div>

            {/* Enhanced CTA Buttons - Mobile first design */}
            <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 mt-8 sm:mt-12 max-w-sm sm:max-w-md mx-auto animate-fade-in px-4" style={{ animationDelay: '0.5s' }}>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => {
                  navigate('/quick-start');
                  setTimeout(() => window.scrollTo(0, 0), 0);
                }}
                className="w-full px-6 py-4 text-base sm:text-lg text-white hover:text-white/90 font-medium hover:bg-white/15 transform hover:scale-105 transition-all duration-300 rounded-xl backdrop-blur-md border border-white/30 hover:border-white/40 touch-target"
              >
                <Users className="h-5 w-5 mr-3" />
                See How It Works
              </Button>

              <Button
                size="lg"
                onClick={handleGetStarted}
                className="w-full px-6 py-4 text-base sm:text-lg bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl touch-target hover:shadow-primary/25"
              >
                <Heart className="h-5 w-5 mr-3 animate-pulse" />
                Get Started
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>

              {/* Mobile-only Sign In link to avoid overlap */}
              <div className="sm:hidden mt-1">
                <button
                  onClick={() => navigate('/auth')}
                  className="text-sm text-white/90 underline-offset-4 hover:underline transition-colors"
                >
                  Already have an account? Log in
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Simplified floating elements for mobile performance */}
        <div className="absolute top-32 left-16 animate-pulse z-20" style={{ animationDuration: '3s' }}>
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
        </div>
        <div className="absolute bottom-40 right-20 animate-pulse z-20" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
        </div>

        {/* Enhanced Stats - Mobile optimized */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 pb-8 sm:pb-12">              
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 hover:shadow-xl transition-all duration-500 hover:bg-white/15 touch-target">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-3">10,000+</div>
              <div className="text-white/80 font-medium text-sm sm:text-base">Meaningful Connections Made</div>
            </div>
            <div className="text-center p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 hover:shadow-xl transition-all duration-500 hover:bg-white/15 touch-target">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-3">94%</div>
              <div className="text-white/80 font-medium text-sm sm:text-base">Match Compatibility Rate</div>
            </div>
            <div className="text-center p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 hover:shadow-xl transition-all duration-500 hover:bg-white/15 touch-target">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-3">4.8★</div>
              <div className="text-white/80 font-medium text-sm sm:text-base">User Satisfaction Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
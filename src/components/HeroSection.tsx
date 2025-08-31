import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Users, ArrowRight } from 'lucide-react';
import coupleHeroMobile1 from '@/assets/couple-hero-mobile-1.jpg';
import coupleHeroMobile2 from '@/assets/couple-hero-mobile-2.jpg';
import coupleHeroMobile3 from '@/assets/couple-hero-mobile-3.jpg';

const heroImages = [
  coupleHeroMobile1,
  coupleHeroMobile2, 
  coupleHeroMobile3
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hero image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[100vh] min-h-[100dvh] flex items-center justify-center bg-white">
      
      {/* Already have account - Top Right */}
      <div className="absolute top-4 right-4 z-30 animate-fade-in">
        <p className="text-muted-foreground mb-1 text-xs">Already have an account?</p>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/auth')}
          className="text-muted-foreground hover:text-foreground font-medium text-xs px-2 py-1 rounded-md hover:bg-muted/10 transition-all duration-300 hover:scale-105"
        >
          Log in
          <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
        </Button>
      </div>

      {/* Hero Content */}
      <div className="relative w-full h-full">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-purple-100/20 opacity-30 md:opacity-0 z-0"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/20 to-transparent md:hidden z-0"></div>
        
        {/* Primary Background Image */}
        <picture className="absolute inset-0 w-full h-full z-0">
          <img 
            src={heroImages[currentHeroImageIndex]} 
            alt="Happy couple in warm connection" 
            className={`w-full h-full object-cover transition-all duration-1000 object-[center_20%] sm:object-[center_30%] md:object-[center_35%] lg:object-[center_40%] xl:object-[center_45%] ${
              isLoaded ? 'animate-fade-in' : 'opacity-0'
            }`}
            loading="eager"
            onLoad={() => setIsLoaded(true)}
          />
        </picture>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-50/5 via-transparent to-transparent md:hidden z-5"></div>
        
        {/* Floating background elements */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-24 sm:w-72 h-24 sm:h-72 bg-gradient-to-br from-purple-200/20 to-purple-300/15 rounded-full blur-xl sm:blur-3xl animate-pulse z-1"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-32 sm:w-96 h-32 sm:h-96 bg-gradient-to-br from-purple-300/15 to-purple-200/20 rounded-full blur-xl sm:blur-3xl animate-pulse z-1" style={{ animationDelay: '1s' }}></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 text-center">
          <div className="space-y-16 sm:space-y-20 lg:space-y-24 animate-fade-in">
            
            {/* Poetic Hero Content */}
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              {/* Emotional Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/5 to-purple-600/5 md:from-primary/10 md:to-purple-600/10 border border-primary/10 md:border-primary/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Heart className="h-5 w-5 mr-3 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  Where souls recognize each other
                </span>
              </div>

              {/* Hero Headline */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light leading-tight tracking-wide">
                  <span className="block text-white drop-shadow-2xl animate-fade-in" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)', animationDelay: '0.1s' }}>
                    AI Complete Me is live.
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto leading-relaxed font-light drop-shadow-lg animate-fade-in" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.5)', animationDelay: '0.4s' }}>
                  First 500 receive 3 months free + a wellness keepsake.
                </p>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 justify-center items-center mb-12 sm:mb-16 lg:mb-20 mt-8 sm:mt-12 lg:mt-24 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto animate-fade-in px-4 md:hidden lg:flex" style={{ animationDelay: '0.5s' }}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/quick-start')}
                className="w-full px-2 sm:px-8 lg:px-12 py-1 sm:py-4 lg:py-6 text-xs sm:text-lg lg:text-xl text-white hover:text-white/80 font-medium hover:bg-white/10 transform hover:scale-105 transition-all duration-300 rounded-lg sm:rounded-xl lg:rounded-2xl backdrop-blur-sm border border-white/20 hover:border-white/30"
              >
                <Users className="h-2.5 w-2.5 sm:h-5 w-5 lg:h-6 lg:w-6 mr-0.5 sm:mr-2 lg:mr-3" />
                See How It Works
              </Button>

              <div 
                onClick={() => navigate('/auth')}
                className="cursor-pointer relative bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white px-2 sm:px-4 lg:px-4 py-1.5 sm:py-3 lg:py-2 rounded-xl sm:rounded-2xl lg:rounded-xl rounded-bl-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs sm:text-base lg:text-sm font-medium max-w-fit hover:shadow-primary/25"
              >
                <Heart className="h-2.5 w-2.5 sm:h-4 w-4 lg:h-3 lg:w-3 mr-0.5 sm:mr-2 lg:mr-1 inline animate-pulse" />
                Get Started
                <ArrowRight className="h-2.5 w-2.5 sm:h-4 w-4 lg:h-3 lg:w-3 ml-0.5 sm:ml-2 lg:ml-1 inline" />
                {/* Message bubble tail */}
                <div className="absolute -bottom-0.5 sm:-bottom-1 lg:-bottom-0.5 left-1.5 sm:left-3 lg:left-2 w-2 sm:w-3 lg:w-2 h-2 sm:h-3 lg:h-2 bg-gradient-to-r from-primary to-purple-600 transform rotate-45 rounded-sm"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-32 left-16 animate-pulse hover:scale-150 transition-transform duration-500 z-20">
          <div className="w-4 h-4 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
        </div>
        <div className="absolute bottom-40 right-20 animate-pulse hover:scale-150 transition-transform duration-500 z-20" style={{ animationDelay: '1s' }}>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
        </div>
        <div className="absolute top-1/3 right-16 animate-pulse hover:scale-150 transition-transform duration-500 z-20" style={{ animationDelay: '2s' }}>
          <div className="w-5 h-5 bg-gradient-to-r from-pink-600 to-primary rounded-full"></div>
        </div>
        <div className="absolute top-2/3 left-24 animate-pulse hover:scale-150 transition-transform duration-500 z-20" style={{ animationDelay: '1.5s' }}>
          <div className="w-2 h-2 bg-gradient-to-r from-primary to-pink-600 rounded-full"></div>
        </div>

        {/* Enhanced Stats */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 pb-12">              
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-600/5 border border-primary/10 backdrop-blur-sm hover:scale-110 hover:shadow-xl transition-all duration-500 hover:bg-primary/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">10,000+</div>
              <div className="text-muted-foreground font-medium">Meaningful Connections Made</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-600/5 to-pink-600/5 border border-purple-600/10 backdrop-blur-sm hover:scale-110 hover:shadow-xl transition-all duration-500 hover:bg-purple-600/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">94%</div>
              <div className="text-muted-foreground font-medium">Match Compatibility Rate</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-600/5 to-primary/5 border border-pink-600/10 backdrop-blur-sm hover:scale-110 hover:shadow-xl transition-all duration-500 hover:bg-pink-600/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-primary bg-clip-text text-transparent mb-3">4.8★</div>
              <div className="text-muted-foreground font-medium">User Satisfaction Score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
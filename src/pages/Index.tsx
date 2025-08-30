import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingQuizButton } from '@/components/FloatingQuizButton';
import { FirstLightModal } from '@/components/FirstLightModal';
import { LaunchBanner } from '@/components/LaunchBanner';
import { AgeVerification } from '@/components/AgeVerification';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchFilters from '@/components/SearchFilters';
import { Search, Crown, ArrowRight, Heart, Users, Sparkles, MapPin, Filter, HelpCircle, MessageCircle, Star, Settings, Shield } from 'lucide-react';
import datingBackground from '@/assets/dating-background.jpg';
import coupleHero1 from '@/assets/couple-hero-1.jpg';
import coupleAmbientClear from '@/assets/couple-ambient-clear.jpg';
import coupleHeroOptimized from '@/assets/couple-hero-optimized.jpg';
import coupleHeroCoolTones from '@/assets/couple-hero-cool-tones.jpg';
import coupleHeroCool2 from '@/assets/couple-hero-cool-2.jpg';
import coupleHeroMobile1 from '@/assets/couple-hero-mobile-1.jpg';
import coupleHeroMobile2 from '@/assets/couple-hero-mobile-2.jpg';
import coupleHeroMobile3 from '@/assets/couple-hero-mobile-3.jpg';
import coupleClaspedHands from '/lovable-uploads/3a5c5b31-1df1-48ad-accf-4a340d4e914f.png';
import { AmbientCoupleCarousel } from '@/components/AmbientCoupleCarousel';
import { SoulfulInvitation } from '@/components/SoulfulInvitation';

// Hero image rotation array - mobile-optimized images with proper positioning
const heroImages = [
  coupleHeroMobile1, // Mobile-optimized cool toned couple with soft daylight
  coupleHeroMobile2, // Mobile-optimized romantic couple with serene forest background
  coupleHeroMobile3 // Mobile-optimized diverse couple with cool tones and nature background
];

// Conditional captions for specific images
const imageSpecificCaptions = {};

// Dynamic captions with accessibility support
const captions = [
  { text: "They didn't expect to find each other. But they did.", ariaLabel: "A story of unexpected love and connection" },
  { text: "Connection begins with a gesture.", ariaLabel: "The power of small moments in relationships" },
  { text: "Love looks like this. And this. And this.", ariaLabel: "Celebrating diverse expressions of love" },
  { text: "Every heart finds its rhythm.", ariaLabel: "The universal search for meaningful connection" },
  { text: "In a world of noise, they found silence together.", ariaLabel: "Finding peace and understanding in partnership" }
];

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<Array<{id: number; question: string; answer: string}>>([]);
  const [showFirstLightModal, setShowFirstLightModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSearchUpgradePrompt, setShowSearchUpgradePrompt] = useState(false);
  const [searchPreference, setSearchPreference] = useState('');
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  

  // Simplified without subscription
  const isEchoActive = false;
  const isUnlockedPlus = false;
  const isUnlockedBeyond = false;

  const handleUpgradePrompt = () => {
    navigate('/pricing');
  };

  const handleFiltersChange = (filters: string[]) => {
    setSelectedFilters(filters);
    setShowSearchUpgradePrompt(false);
  };

  const handleSearch = () => {
    if (isUnlockedPlus) {
      toast({
        title: "💖 You're not just searching. You're showing up—with heart.",
        duration: 3000,
      });
    } else if (isUnlockedBeyond) {
      toast({
        title: "🌌 You're not just matching. You're discovering what's waiting beyond the scroll.",
        duration: 3000,
      });
    }

    if (!isEchoActive && selectedFilters.length >= 3) {
      setShowSearchUpgradePrompt(true);
      return;
    }

    if (searchQuery.trim()) {
      navigate(`/matches?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/matches');
    }
  };


  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .in('id', [3, 6, 10])
        .order('id');
      
      if (data) {
        setFaqs(data);
      }
    };
    
    fetchFaqs();
    
    if (user && !localStorage.getItem('hasSeenFirstLight')) {
      setIsNewUser(true);
      setShowFirstLightModal(true);
    }
  }, [user, loading, navigate]);

  // Check if user has completed quiz
  useEffect(() => {
    const checkQuizCompletion = async () => {
      if (!user) {
        setHasCompletedQuiz(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_events')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_type', 'quiz_completed')
          .limit(1);
        
        setHasCompletedQuiz(data && data.length > 0);
      } catch (error) {
        console.error('Error checking quiz completion:', error);
        setHasCompletedQuiz(false);
      }
    };

    checkQuizCompletion();
  }, [user]);

  // Hero image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </div>
    );
  }

  // Always show the beautiful homepage regardless of login status
  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
        <Navbar />
        
        {/* Launch Banner Section - Above everything */}
        <section className="py-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <div className="max-w-2xl mx-auto px-4 md:max-w-full md:px-6 lg:px-8">
            <LaunchBanner showDismiss={true} variant="homepage" />
          </div>
        </section>
        
        {/* EMOTIONALLY INTELLIGENT HERO DESIGN */}
        <section className="relative overflow-hidden min-h-[100vh] min-h-[100dvh] flex items-center justify-center bg-white">
          
          {/* Already have account - Top Right */}
          <div className="absolute top-4 right-4 z-30 animate-fade-in">
            <p className="text-muted-foreground mb-1 text-xs">Already have an account?</p>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-muted-foreground hover:text-foreground font-medium text-xs px-2 py-1 rounded-md hover:bg-muted/10 transition-all duration-300"
            >
              Log in
              <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
            </Button>
          </div>

          {/* Simplified, breathing room design */}
          <div className="relative w-full h-full">
            {/* Gentle background fade - mobile only, hidden on desktop */}
            <div className="absolute inset-0 bg-purple-100/20 opacity-30 md:opacity-0 z-0"></div>
            
            {/* Bottom gradient fade - mobile only, hidden on desktop */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/20 to-transparent md:hidden z-0"></div>
            
            {/* Primary Background Image - Fully Responsive */}
            <picture className="absolute inset-0 w-full h-full z-0">
                <img 
                  src={heroImages[currentHeroImageIndex]} 
                  alt="Happy couple in warm connection" 
                  className="w-full h-full object-cover animate-fade-in transition-opacity duration-1000
                            object-[center_20%] sm:object-[center_30%] md:object-[center_35%] lg:object-[center_40%] xl:object-[center_45%]"
                  loading="eager"
                  onError={(e) => {
                    console.error('Hero image failed to load:', heroImages[currentHeroImageIndex]);
                  }}
                  onLoad={(e) => {
                    console.log('Hero image loaded and displayed:', heroImages[currentHeroImageIndex]);
                  }}
                />
            </picture>
            
            {/* Ultra-gentle overlay - mobile only, hidden on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-50/5 via-transparent to-transparent md:hidden z-5"></div>
            
            {/* Softer floating background elements - less dominant on mobile */}
            <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-24 sm:w-72 h-24 sm:h-72 bg-gradient-to-br from-purple-200/20 to-purple-300/15 rounded-full blur-xl sm:blur-3xl animate-pulse z-1"></div>
            <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-32 sm:w-96 h-32 sm:h-96 bg-gradient-to-br from-purple-300/15 to-purple-200/20 rounded-full blur-xl sm:blur-3xl animate-pulse z-1" style={{ animationDelay: '1s' }}></div>

            {/* JSX-Based Conditional Captions */}
            {imageSpecificCaptions[heroImages[currentHeroImageIndex]] && (
              <div className="absolute top-1/3 w-full text-center text-white text-xl sm:text-2xl font-serif z-20 px-6 animate-fade-in">
                <div 
                  className="inline-block bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-colors duration-300"
                  style={{ 
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)'
                  }}
                >
                  {imageSpecificCaptions[heroImages[currentHeroImageIndex]]}
                </div>
              </div>
            )}

            {/* Poetic Hero Section with Breathing Room - proper z-index layering */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 text-center">
              <div className="space-y-16 sm:space-y-20 lg:space-y-24 animate-fade-in">
                
                {/* Poetic Hero Content */}
                <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                  {/* Emotional Badge */}
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/5 to-purple-600/5 md:from-primary/10 md:to-purple-600/10 border border-primary/10 md:border-primary/20 backdrop-blur-sm">
                    <Heart className="h-5 w-5 mr-3 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Where souls recognize each other
                    </span>
                  </div>

                  {/* Poetic Headline */}
                  <div className="space-y-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-wide">
                      <span className="block mb-3 text-foreground">
                        Beyond the surface,
                      </span>
                      <span className="block mb-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent font-medium">
                        beneath the noise
                      </span>
                      <span className="block text-muted-foreground text-3xl sm:text-4xl lg:text-5xl">
                        real connection awaits
                      </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                      A space for meaningful encounters, authentic stories, and the kind of love that changes everything.
                    </p>
                  </div>
                </div>
                
                {/* DRAMATIC DESCRIPTION - Mobile only, positioned to not block images */}
                <div className="mb-4 sm:mb-6 md:hidden">
                  <p className="text-xs text-white font-bold max-w-xs mx-auto leading-relaxed animate-fade-in bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.3s' }}>
                    🚀 <span className="text-yellow-300 bg-black px-1 py-0.5 rounded-md text-xs">NO MORE BORING SWIPES!</span> 🚀
                    <br/>
                    <span className="block mt-1 text-xs">Find your <span className="text-yellow-300 underline decoration-1 decoration-yellow-300">SOULMATE</span> with AI!</span>
                  </p>
                </div>
                
                

                {/* Enhanced CTA Buttons - Mobile and Desktop */}
                <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 justify-center items-center mb-12 sm:mb-16 lg:mb-20 mt-8 sm:mt-12 lg:mt-24 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto animate-fade-in px-4 md:hidden lg:flex" style={{ animationDelay: '0.4s' }}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/quick-start')}
                    className="w-full px-2 sm:px-8 lg:px-12 py-1 sm:py-4 lg:py-6 text-xs sm:text-lg lg:text-xl text-white hover:text-white/80 font-medium hover:bg-white/10 transform hover:scale-105 transition-all duration-300 rounded-lg sm:rounded-xl lg:rounded-2xl backdrop-blur-sm"
                  >
                    <Users className="h-2.5 w-2.5 sm:h-5 w-5 lg:h-6 lg:w-6 mr-0.5 sm:mr-2 lg:mr-3" />
                    See How It Works
                  </Button>

                  <div 
                    onClick={() => navigate('/quick-start')}
                    className="cursor-pointer relative bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white px-2 sm:px-4 lg:px-4 py-1.5 sm:py-3 lg:py-2 rounded-xl sm:rounded-2xl lg:rounded-xl rounded-bl-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-xs sm:text-base lg:text-sm font-medium max-w-fit"
                  >
                    <Heart className="h-2.5 w-2.5 sm:h-4 w-4 lg:h-3 lg:w-3 mr-0.5 sm:mr-2 lg:mr-1 inline" />
                    Start Your Journey
                    <ArrowRight className="h-2.5 w-2.5 sm:h-4 w-4 lg:h-3 lg:w-3 ml-0.5 sm:ml-2 lg:ml-1 inline" />
                    {/* Message bubble tail */}
                    <div className="absolute -bottom-0.5 sm:-bottom-1 lg:-bottom-0.5 left-1.5 sm:left-3 lg:left-2 w-2 sm:w-3 lg:w-2 h-2 sm:h-3 lg:h-2 bg-gradient-to-r from-primary to-purple-600 transform rotate-45 rounded-sm"></div>
                  </div>
                  
                  {/* DRAMATIC DESCRIPTION - Tablet only, positioned below buttons */}
                  <div className="hidden md:block lg:hidden mt-6">
                    <p className="text-lg text-white font-bold max-w-2xl mx-auto leading-relaxed animate-fade-in bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500" style={{ animationDelay: '0.3s' }}>
                      🚀 <span className="text-yellow-300 bg-black px-2 py-1 rounded-lg text-sm">NO MORE BORING SWIPES!</span> 🚀
                      <br/>
                      <span className="text-lg">Find your <span className="text-yellow-300 underline decoration-2 decoration-yellow-300">SOULMATE</span> with AI!</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Enhanced Floating Elements with proper z-index */}
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
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-600/5 border border-primary/10 backdrop-blur-sm hover:scale-110 hover:shadow-xl transition-all duration-500">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">10,000+</div>
                  <div className="text-muted-foreground font-medium">Meaningful Connections Made</div>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-600/5 to-pink-600/5 border border-purple-600/10 backdrop-blur-sm hover:scale-110 hover:shadow-xl transition-all duration-500">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">94%</div>
                  <div className="text-muted-foreground font-medium">Match Compatibility Rate</div>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-600/5 to-primary/5 border border-pink-600/10 backdrop-blur-sm hover:scale-110 hover:shadow-xl transition-all duration-500">
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-primary bg-clip-text text-transparent mb-3">4.8★</div>
                  <div className="text-muted-foreground font-medium">User Satisfaction Score</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ambient Couple Carousel Section */}
        <section className="py-20 bg-gradient-to-br from-muted/20 to-background">
          <AmbientCoupleCarousel />
        </section>

        {/* Soulful Invitation Section */}
        <SoulfulInvitation />

        {/* Simple Features Section */}
        <section className="py-20 bg-gradient-to-br from-background to-primary/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-light text-foreground mb-12">
              Connection beyond the surface
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                <Heart className="h-8 w-8 text-primary mb-4 mx-auto" />
                <h3 className="font-medium mb-2">Emotional Intelligence</h3>
                <p className="text-sm text-muted-foreground">AI-powered matching based on authentic compatibility</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
                <Shield className="h-8 w-8 text-purple-500 mb-4 mx-auto" />
                <h3 className="font-medium mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">Your data protected with military-grade encryption</p>
              </Card>
            </div>
          </div>
        </section>
        
        <Footer />
        
        <FirstLightModal 
          isOpen={showFirstLightModal} 
          onClose={() => {
            setShowFirstLightModal(false);
            localStorage.setItem('hasSeenFirstLight', 'true');
          }}
        />
        
        <FloatingQuizButton />
        
        <AgeVerification />
      </div>
    );
};

export default Index;
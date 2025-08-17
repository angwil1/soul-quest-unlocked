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
import coupleClaspedHands from '/lovable-uploads/3a5c5b31-1df1-48ad-accf-4a340d4e914f.png';

// Single hero image - the best looking one
const heroImage = coupleHeroOptimized; // Emotionally engaging couple with best positioning and clarity

// Dynamic captions with accessibility support
const captions = [
  { text: "They didn't expect to find each other. But they did.", ariaLabel: "A story of unexpected love and connection" },
  { text: "Connection begins with a gesture.", ariaLabel: "The power of small moments in relationships" },
  { text: "Love looks like this. And this. And this.", ariaLabel: "Celebrating diverse expressions of love" },
  { text: "Every heart finds its echo.", ariaLabel: "The universal search for meaningful connection" },
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


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-background to-pink-900 overflow-hidden">
        <Navbar />
        
        {/* DRAMATIC HERO DESIGN */}
        <section className="relative min-h-[100vh] min-h-[100dvh] flex items-center justify-center">
          {/* Responsive padding to prevent overlap */}
          <div className="relative pt-8 md:pt-12 lg:pt-16 w-full h-full">
            {/* Dynamic Background with Proper Z-Index Layering */}
            <div className="absolute inset-0 z-0">
              <div className="relative w-full h-full">
                {/* Primary Background Image - Responsive with better face positioning */}
                <img 
                  src={heroImage} 
                  alt="Happy couple in warm connection" 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  style={{
                    objectPosition: window.innerWidth >= 768 && window.innerWidth < 1024 
                      ? 'center 20%' // Tablet: better positioning to avoid face cropping
                      : window.innerWidth < 768 
                        ? 'center 15%' // Mobile: centered with slight upward bias for face visibility
                        : 'center 30%' // Desktop: lower positioning
                  }}
                />
                
                {/* Responsive overlay - lighter on tablet to avoid masking */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/3 via-transparent to-pink-500/2 md:from-background/5 md:to-pink-500/3 z-10"></div>
                
                {/* Responsive Floating Background Elements */}
                <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-32 sm:w-72 h-32 sm:h-72 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full blur-2xl sm:blur-3xl animate-pulse z-10"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-pink-600/10 to-primary/10 rounded-full blur-2xl sm:blur-3xl animate-pulse z-10" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Caption for the hero image */}
            <div className="absolute top-1/3 w-full text-center text-white text-xl sm:text-2xl font-serif z-20 px-6 animate-fade-in">
              <div 
                className="inline-block bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-colors duration-300"
                style={{ 
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.6)'
                }}
              >
                Connection begins with a single gesture.
              </div>
            </div>

            {/* Hero Content - Proper Z-Index and spacing */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 sm:py-20 text-center">
              {/* Launch Banner - More top margin on mobile */}
              <div className="mb-6 sm:mb-8 mt-4 sm:mt-0 animate-fade-in">
                <LaunchBanner showDismiss={true} variant="homepage" />
              </div>
              
              <div className="animate-fade-in">
                {/* Enhanced Badge */}
                <div className="inline-flex items-center px-6 py-3 mb-12 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <Sparkles className="h-5 w-5 mr-3 text-primary animate-pulse" />
                  <span className="text-primary font-semibold">AI-Powered Emotional Intelligence Dating</span>
                </div>
                
                {/* MASSIVE TITLE - Mobile Responsive */}
                <h1 className="text-4xl sm:text-6xl md:text-9xl font-black mb-8 sm:mb-16 leading-none">
                  <span className="block bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-scale-in hover:scale-105 transition-transform duration-500">
                    🔥 HOTTEST 🔥
                  </span>
                  <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-scale-in text-3xl sm:text-8xl md:text-[12rem] hover:scale-105 transition-transform duration-500" style={{ animationDelay: '0.2s' }}>
                    DATING APP
                    <div className="absolute -bottom-4 sm:-bottom-8 left-1/2 transform -translate-x-1/2 w-32 sm:w-64 h-2 sm:h-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full animate-scale-in shadow-2xl hover:shadow-3xl transition-shadow duration-300" style={{ animationDelay: '0.5s' }}></div>
                  </span>
                </h1>
                
                {/* DRAMATIC DESCRIPTION - Mobile Responsive */}
                <div className="mb-12 sm:mb-20">
                  <p className="text-lg sm:text-2xl md:text-4xl text-white font-bold mb-8 sm:mb-12 max-w-xs sm:max-w-5xl mx-auto leading-relaxed animate-fade-in bg-gradient-to-r from-red-500 to-pink-500 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500" style={{ animationDelay: '0.3s' }}>
                    🚀 <span className="text-yellow-300 bg-black px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl text-sm sm:text-base">NO MORE BORING SWIPES!</span> 🚀
                    <br className="hidden sm:block"/>
                    <span className="block sm:inline mt-2 sm:mt-0">Find your <span className="text-yellow-300 underline decoration-2 sm:decoration-4 decoration-yellow-300">SOULMATE</span> with AI that actually works!</span>
                  </p>
                </div>

                {/* Enhanced CTA Buttons - Mobile Responsive */}
                <div className="flex flex-col gap-4 sm:gap-8 justify-center items-center mb-12 sm:mb-20 max-w-xs sm:max-w-2xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/quick-start')}
                    className="w-full px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 transform hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-3xl rounded-2xl border-0"
                  >
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                    Start Your Journey
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/quick-start')}
                    className="w-full px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold border-2 border-primary/40 hover:border-primary/60 hover:bg-primary/10 transform hover:scale-110 transition-all duration-500 rounded-2xl backdrop-blur-sm"
                  >
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                    See How It Works
                  </Button>
                </div>

                {/* Login Section - Mobile Responsive */}
                <div className="text-center mb-12 sm:mb-20 animate-fade-in px-4" style={{ animationDelay: '0.5s' }}>
                  <p className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg">Already have an account?</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/auth')}
                    className="text-primary hover:text-primary/80 font-semibold text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-primary/10 transform hover:scale-105 transition-all duration-300"
                  >
                    Log in and reconnect
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                  </Button>
                </div>

                {/* Enhanced Stats */}
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
          </div>
        </section>

        {/* BREATHING ROOM */}
        <div className="h-32"></div>

        {/* QUIET CONTRAST - Enhanced Features Section */}
        <section className="py-32 bg-gradient-to-br from-background to-primary/5 relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-8">
                What Makes Us Different
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We're redefining dating through authenticity, privacy, and meaningful connections
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const handleCloseFirstLightModal = () => {
    setShowFirstLightModal(false);
    localStorage.setItem('hasSeenFirstLight', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Dashboard Content for Logged-in Users */}
      <main className="pt-20 px-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
          <p className="text-xl text-muted-foreground">Ready to find your perfect match?</p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for your perfect match..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg rounded-xl"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          {/* Search Filters */}
          <div className="mt-6">
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full mt-6 py-3 text-lg rounded-xl"
            size="lg"
          >
            <Search className="h-5 w-5 mr-2" />
            Find Your Match
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/matches')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                Browse Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Discover people who share your interests and values</CardDescription>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/messages')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Continue conversations with your connections</CardDescription>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/profile')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Update your profile to attract better matches</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Featured Section */}
        {!hasCompletedQuiz && (
          <Card className="mb-12 bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                Complete Your Compatibility Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Take our AI-powered quiz to get better matches based on your personality and preferences.
              </CardDescription>
              <Button onClick={() => navigate('/questions')} className="w-full">
                Take Quiz Now
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
      
      <FirstLightModal 
        isOpen={showFirstLightModal} 
        onClose={handleCloseFirstLightModal}
      />
      
      <FloatingQuizButton />
      
      <AgeVerification />
    </div>
  );
};

export default Index;
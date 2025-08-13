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
import { InviteKindredSoul } from '@/components/InviteKindredSoul';
import { AgeVerification } from '@/components/AgeVerification';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchFilters from '@/components/SearchFilters';
import { Search, Crown, ArrowRight, Heart, Users, Sparkles, MapPin, Filter, HelpCircle, MessageCircle, Star, Settings, Shield } from 'lucide-react';
import datingBackground from '@/assets/dating-background.jpg';
import coupleHero1 from '@/assets/couple-hero-1.jpg';
import coupleHero2 from '@/assets/couple-hero-2.jpg';
import coupleDigital from '@/assets/couple-digital.jpg';

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-background to-pink-900">
        <Navbar />
        
        {/* DRAMATIC NEW HERO DESIGN */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Dynamic Background with Multiple Layers */}
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              {/* Primary Background Image */}
              <img 
                src={coupleHero1} 
                alt="Couple connecting" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 animate-fade-in"
              />
              
              {/* Secondary Background for Depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/15 to-pink-600/20"></div>
              
              {/* Overlay Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/75 to-background/85"></div>
              
              {/* Floating Background Elements */}
              <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-600/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="animate-fade-in">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 mr-3 text-primary animate-pulse" />
                <span className="text-primary font-semibold">AI-Powered Emotional Intelligence Dating</span>
              </div>
              
              {/* MASSIVE NEW TITLE */}
              <h1 className="text-6xl md:text-9xl font-black mb-12 leading-none">
                <span className="block bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-scale-in">
                  🔥 HOTTEST 🔥
                </span>
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-scale-in text-8xl md:text-[12rem]" style={{ animationDelay: '0.2s' }}>
                  DATING APP
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full animate-scale-in shadow-2xl" style={{ animationDelay: '0.5s' }}></div>
                </span>
              </h1>
              
              {/* DRAMATIC NEW DESCRIPTION */}
              <p className="text-2xl md:text-4xl text-white font-bold mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in bg-gradient-to-r from-red-500 to-pink-500 p-8 rounded-3xl shadow-2xl" style={{ animationDelay: '0.3s' }}>
                🚀 <span className="text-yellow-300 bg-black px-4 py-2 rounded-xl">NO MORE BORING SWIPES!</span> 🚀
                <br/>
                Find your <span className="text-yellow-300 underline decoration-4 decoration-yellow-300">SOULMATE</span> with AI that actually works!
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/quick-start')}
                  className="w-full sm:w-auto px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl border-0"
                >
                  <Heart className="h-6 w-6 mr-3" />
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/quick-start')}
                  className="w-full sm:w-auto px-12 py-6 text-xl font-semibold border-2 border-primary/40 hover:border-primary/60 hover:bg-primary/10 transform hover:scale-105 transition-all duration-300 rounded-2xl backdrop-blur-sm"
                >
                  <Users className="h-6 w-6 mr-3" />
                  See How It Works
                </Button>
              </div>

              {/* Login Section */}
              <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <p className="text-muted-foreground mb-4 text-lg">Already have an account?</p>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="text-primary hover:text-primary/80 font-semibold text-xl px-8 py-4 rounded-xl hover:bg-primary/10 transition-all duration-300"
                >
                  Log in and reconnect
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-600/5 border border-primary/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">10,000+</div>
                  <div className="text-muted-foreground font-medium">Meaningful Connections Made</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-600/5 to-pink-600/5 border border-purple-600/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">94%</div>
                  <div className="text-muted-foreground font-medium">Match Compatibility Rate</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-600/5 to-primary/5 border border-pink-600/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-primary bg-clip-text text-transparent mb-3">4.8★</div>
                  <div className="text-muted-foreground font-medium">User Satisfaction Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Floating Elements */}
          <div className="absolute top-32 left-16 animate-pulse">
            <div className="w-4 h-4 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
          </div>
          <div className="absolute bottom-40 right-20 animate-pulse" style={{ animationDelay: '1s' }}>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
          <div className="absolute top-1/3 right-16 animate-pulse" style={{ animationDelay: '2s' }}>
            <div className="w-5 h-5 bg-gradient-to-r from-pink-600 to-primary rounded-full"></div>
          </div>
          <div className="absolute top-2/3 left-24 animate-pulse" style={{ animationDelay: '1.5s' }}>
            <div className="w-2 h-2 bg-gradient-to-r from-primary to-pink-600 rounded-full"></div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-24 bg-gradient-to-br from-background to-primary/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
                What Makes Us Different
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're redefining dating through authenticity, privacy, and meaningful connections
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl">
                      <span className="text-3xl">🔐</span>
                    </div>
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                      Privacy First Always
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    No ads. No tracking. No selling your data. You are here to connect, not to be commodified. 
                    We never compromise on user trust and transparency.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-purple-600/5 to-background backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl">
                      <span className="text-3xl">🤖</span>
                    </div>
                    <CardTitle className="text-2xl font-bold group-hover:text-purple-600 transition-colors">
                      AI That Respects You
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Our matchmaking uses AI to spark real compatibility, not swipe fatigue. 
                    Receive digestible insights designed to help you reflect, not react.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <Footer />
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
      
      {/* Welcome Back Section */}
      <div className="pt-16 pb-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-primary mb-2">Welcome back!</h2>
          <p className="text-muted-foreground mb-4 text-sm">Ready to discover meaningful connections?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button 
              onClick={() => navigate('/profile')} 
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              View Profile
            </Button>
            <Button 
              onClick={() => signOut()} 
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="relative py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            Find Your
            <br />
            Perfect Match
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Search for connections that resonate with your soul through AI-powered compatibility.
          </p>

          {/* Search Section */}
          <div className="max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Search by interests, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm" className="px-4">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-center mb-4">
              <SearchFilters 
                onFiltersChange={handleFiltersChange}
                onUpgradePrompt={handleUpgradePrompt}
                onPreferenceChange={setSearchPreference}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              onClick={() => navigate('/matches')} 
              variant="outline" 
              size="default"
              className="h-12 border-primary/30 hover:border-primary/50"
            >
              <Users className="h-5 w-5 mr-2" />
              Discover Matches
            </Button>
            <Button 
              onClick={() => navigate('/profile/edit')} 
              variant="outline" 
              size="default"
              className="h-12 border-primary/30 hover:border-primary/50"
            >
              <Settings className="h-5 w-5 mr-2" />
              Edit Profile
            </Button>
            <Button 
              onClick={() => navigate('/messages')} 
              variant="outline" 
              size="default"
              className="h-12 border-primary/30 hover:border-primary/50"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Messages
            </Button>
          </div>

          {/* Journey Stats */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-lg font-semibold mb-6">Your Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Meaningful Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">AI Powered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Smart Matching</p>
                </CardContent>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Privacy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Data Protected</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      <FirstLightModal 
        isOpen={showFirstLightModal} 
        onClose={handleCloseFirstLightModal}
      />
      
      <FloatingQuizButton />
      <InviteKindredSoul />
      <AgeVerification />
    </div>
  );
};

export default Index;
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Happy Couples Background Overlay - Behind Find Your Match Section */}
      <div className="absolute top-20 left-0 right-0 h-80 z-0 overflow-hidden">
        <div className="absolute top-5 left-10 w-48 h-48 opacity-40 animate-fade-in">
          <img 
            src={coupleHero1} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-0 right-16 w-56 h-56 opacity-35 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <img 
            src={coupleHero2} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-10 left-1/3 w-40 h-40 opacity-30 animate-fade-in" style={{ animationDelay: '1s' }}>
          <img 
            src={coupleDigital} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-16 right-1/4 w-32 h-32 opacity-25 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <img 
            src={coupleHero1} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-8 left-2/3 w-36 h-36 opacity-35 animate-fade-in" style={{ animationDelay: '2s' }}>
          <img 
            src={coupleHero2} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        
        {/* Lighter gradient overlay to maintain visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/85"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Welcome Back Section - Moved Higher */}
        <div className="pt-16 pb-4 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 p-3 md:p-4 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg border border-primary/20 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-center md:text-left">
                  <h2 className="text-lg md:text-xl font-bold text-primary mb-1">Welcome back!</h2>
                  <p className="text-muted-foreground text-xs md:text-sm">Ready to discover meaningful connections?</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  <Button 
                    onClick={() => navigate('/profile')} 
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto border-primary/30 hover:border-primary/50 text-xs md:text-sm px-3 py-1"
                  >
                    View Profile
                  </Button>
                  <Button 
                    onClick={() => signOut()} 
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto text-muted-foreground hover:text-foreground text-xs md:text-sm px-3 py-1"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <FloatingQuizButton />
        
        <FirstLightModal 
          isOpen={showFirstLightModal} 
          onClose={handleCloseFirstLightModal} 
        />
        
        {/* Main Content */}
        <main className="flex-1 px-6 pb-12">
          {/* Welcome Back Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-6">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-primary font-medium">You're back! Ready to connect?</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome back, <span className="text-primary">Explorer</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              Your journey to meaningful connections continues. What will you discover today?
            </p>
          </div>

          {/* Main Dashboard Grid */}
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Primary Actions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Search Card */}
              <div className="lg:col-span-2">
                <Card className="p-8 h-full bg-gradient-to-br from-card to-card/80 border-2 border-primary/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Discover Matches</h2>
                      <p className="text-muted-foreground">Find souls that resonate with yours</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        placeholder="Search by interests, values, location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-12 h-14 text-lg bg-background/50 border-2 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button size="lg" className="h-12" onClick={() => navigate('/matches')}>
                        <Heart className="mr-2 h-5 w-5" />
                        Find Matches
                      </Button>
                      <Button variant="outline" size="lg" className="h-12">
                        <Sparkles className="mr-2 h-5 w-5" />
                        AI Suggest
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Profile Views</span>
                    <span className="text-2xl font-bold text-primary">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">New Matches</span>
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Messages</span>
                    <span className="text-2xl font-bold text-primary">12</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/profile')}>
                    <Users className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </Card>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-primary/50" onClick={() => navigate('/profile/edit')}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Edit Profile</h3>
                  <p className="text-xs text-muted-foreground">Update details</p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-primary/50" onClick={() => navigate('/messages')}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Messages</h3>
                  <p className="text-xs text-muted-foreground">Chat now</p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-primary/50" onClick={() => navigate('/matches')}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Matches</h3>
                  <p className="text-xs text-muted-foreground">View all</p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-primary/50" onClick={() => signOut()}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Sign Out</h3>
                  <p className="text-xs text-muted-foreground">Exit app</p>
                </div>
              </Card>
            </div>

            {/* Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI-Powered Matching</h3>
                <p className="text-muted-foreground leading-relaxed">Advanced algorithms analyze compatibility beyond surface-level attraction</p>
              </Card>

              <Card className="p-8 text-center bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Privacy Protected</h3>
                <p className="text-muted-foreground leading-relaxed">Your personal data is secured with enterprise-grade encryption</p>
              </Card>

              <Card className="p-8 text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Meaningful Connections</h3>
                <p className="text-muted-foreground leading-relaxed">Find relationships built on shared values and genuine compatibility</p>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
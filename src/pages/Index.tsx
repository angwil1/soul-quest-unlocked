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
import { Search, Crown, ArrowRight, Heart, Users, Sparkles, MapPin, Filter, HelpCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Modern Hero Section with Couples and Purple Gradients */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background with Couple Images */}
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              <img 
                src={coupleHero1} 
                alt="Couple connecting" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 animate-fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-primary/20"></div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Emotional Intelligence
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                  Find Your
                </span>
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent block relative">
                  Perfect Match
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full animate-scale-in"></div>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Beyond swipes. Beyond games. Discover meaningful connections through{" "}
                <span className="text-primary font-semibold">emotional intelligence</span> and{" "}
                <span className="text-primary font-semibold">genuine compatibility</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-lg mx-auto">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/quick-start')}
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transform hover:scale-105 transition-all duration-200 animate-scale-in shadow-lg hover:shadow-xl"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/quick-start')}
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transform hover:scale-105 transition-all duration-200 animate-scale-in"
                >
                  <Users className="h-5 w-5 mr-2" />
                  See How It Works
                </Button>
              </div>

              <div className="text-center mb-16">
                <p className="text-muted-foreground mb-2">Already have an account?</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/auth')}
                  className="text-primary hover:text-primary/80 font-semibold text-lg underline"
                >
                  Log in and reconnect
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center animate-fade-in">
                  <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-sm text-muted-foreground">Meaningful Connections</div>
                </div>
                <div className="text-center animate-fade-in">
                  <div className="text-3xl font-bold text-primary mb-2">94%</div>
                  <div className="text-sm text-muted-foreground">Match Compatibility Rate</div>
                </div>
                <div className="text-center animate-fade-in">
                  <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
                  <div className="text-sm text-muted-foreground">User Satisfaction Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 animate-pulse">
            <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
          </div>
          <div className="absolute bottom-32 right-16 animate-pulse" style={{ animationDelay: '1s' }}>
            <div className="w-2 h-2 bg-purple-500/40 rounded-full"></div>
          </div>
          <div className="absolute top-1/3 right-10 animate-pulse" style={{ animationDelay: '2s' }}>
            <div className="w-4 h-4 bg-pink-500/30 rounded-full"></div>
          </div>
        </section>

        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* What Makes Us Different Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">🔐</span>
                      Privacy First Always
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      No ads. No tracking. No selling your data. You are here to connect not to be commodified. We never compromise on user trust.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">🤖</span>
                      AI That Respects You
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Our matchmaking uses AI to spark real compatibility not swipe fatigue. You will receive digestible insights designed to help you reflect not react.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
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
      {/* Happy Couples Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 opacity-10 animate-fade-in">
          <img 
            src={coupleHero1} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>
        <div className="absolute top-20 right-0 w-48 h-48 opacity-15 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <img 
            src={coupleHero2} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>
        <div className="absolute bottom-20 left-10 w-56 h-56 opacity-10 animate-fade-in" style={{ animationDelay: '1s' }}>
          <img 
            src={coupleDigital} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>
        <div className="absolute bottom-10 right-20 w-40 h-40 opacity-15 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <img 
            src={coupleHero1} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 opacity-8 animate-fade-in" style={{ animationDelay: '2s' }}>
          <img 
            src={coupleHero2} 
            alt="Happy couple" 
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>
        
        {/* Gradient overlay to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <FloatingQuizButton />
        
        <FirstLightModal 
          isOpen={showFirstLightModal} 
          onClose={handleCloseFirstLightModal} 
        />
        
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-4 md:p-6 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-xl border border-primary/20 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-3xl font-bold text-primary mb-1 md:mb-2">Welcome back!</h2>
                <p className="text-muted-foreground text-sm md:text-lg">Ready to discover meaningful connections?</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 w-full md:w-auto">
                <Button 
                  onClick={() => navigate('/profile')} 
                  variant="outline"
                  className="w-full sm:w-auto border-primary/30 hover:border-primary/50 text-sm md:text-base"
                >
                  View Profile
                </Button>
                <Button 
                  onClick={() => signOut()} 
                  variant="ghost"
                  className="w-full sm:w-auto text-muted-foreground hover:text-foreground text-sm md:text-base"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">Find Your Perfect Match</h2>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  Search for connections that resonate with your soul through AI-powered compatibility
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-primary/5 to-purple-600/5 p-6 rounded-2xl border border-primary/20 mb-8">
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search by interests, location, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 text-lg py-4 h-14 bg-background/50 border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    size="lg"
                    className="px-8 h-14 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => navigate('/matches')}
                    variant="outline"
                    className="border-primary/30 hover:border-primary/50 hover:bg-primary/5"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    View All Matches
                  </Button>
                </div>
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Discover Matches</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Find connections that resonate with your soul through AI compatibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/matches')} 
                  className="w-full h-12 text-lg group-hover:scale-105 transition-transform"
                >
                  <Users className="h-5 w-5 mr-2" />
                  View Matches
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600/10 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Your Profile</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Showcase your authentic self and attract meaningful connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/profile')} 
                  className="w-full h-12 text-lg group-hover:scale-105 transition-transform"
                  variant="outline"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-pink-600/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-xl">Messages</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Connect and build relationships with your compatible matches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/messages')} 
                  className="w-full h-12 text-lg group-hover:scale-105 transition-transform"
                  variant="outline"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  View Messages
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
      <Footer />
      
    </div>
  );
};

export default Index;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
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
import { Search, Crown, ArrowRight, Heart, Users, Sparkles, MapPin, Filter } from 'lucide-react';
import datingBackground from '@/assets/dating-background.jpg';
import coupleHero1 from '@/assets/couple-hero-1.jpg';
import coupleHero2 from '@/assets/couple-hero-2.jpg';
import coupleDigital from '@/assets/couple-digital.jpg';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { subscription, loading: subscriptionLoading, isUnlockedPlus, isUnlockedBeyond } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<Array<{id: number; question: string; answer: string}>>([]);
  const [showFirstLightModal, setShowFirstLightModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSearchUpgradePrompt, setShowSearchUpgradePrompt] = useState(false);
  const [searchPreference, setSearchPreference] = useState('');

  // Check if user has Echo Amplified (premium tier)
  const isEchoActive = subscription?.subscribed && subscription?.subscription_tier === 'Pro';

  const handleUpgradePrompt = () => {
    navigate('/subscription');
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
                className="absolute inset-0 w-full h-full object-cover opacity-20 animate-fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-primary/20"></div>
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

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 max-w-lg mx-auto">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingQuizButton />
      
      <FirstLightModal 
        isOpen={showFirstLightModal} 
        onClose={handleCloseFirstLightModal} 
      />
      
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div>
              <h2 className="text-2xl font-bold text-primary">Welcome back!</h2>
              <p className="text-muted-foreground">You are successfully logged in as {user.email}</p>
            </div>
          </div>

          <div className="mb-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-6">Find Your Perfect Match</h2>
              <p className="text-center text-muted-foreground mb-8 text-lg">
                Search for connections that resonate with your soul
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by interests location or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 text-lg py-6"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  size="lg"
                  className="px-8 py-6 text-lg"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Search & Discovery Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Start Your Search
                </CardTitle>
                <CardDescription>
                  Ready to find your perfect match? Use our advanced search tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => navigate('/matches')} 
                    size="lg"
                    className="h-16 text-left flex-col items-start justify-center px-6"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-semibold">Distance Search</span>
                    </div>
                    <span className="text-xs opacity-80">Find matches near you</span>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/match-search')} 
                    variant="outline"
                    size="lg"
                    className="h-16 text-left flex-col items-start justify-center px-6"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Filter className="h-4 w-4" />
                      <span className="font-semibold">Advanced Filters</span>
                    </div>
                    <span className="text-xs opacity-80">Detailed search preferences</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your dating profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/profile')} className="w-full">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discover</CardTitle>
                <CardDescription>Find your perfect match</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/matches')} className="w-full">
                  Start Matching
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Chat with your matches</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/messages')} className="w-full">
                  View Messages
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>Unlock advanced features</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/pricing')} className="w-full">
                  View Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      
    </div>
  );
};

export default Index;
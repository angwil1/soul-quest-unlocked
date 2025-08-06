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
import SearchFilters from '@/components/SearchFilters';
import { Search, Crown, ArrowRight, Heart, Users, Sparkles } from 'lucide-react';
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

  // Check if user has Echo Amplified (premium tier)
  const isEchoActive = subscription?.subscribed && subscription?.subscription_tier === 'Pro';

  const handleUpgradePrompt = () => {
    navigate('/subscription');
  };

  const handleFiltersChange = (filters: string[]) => {
    setSelectedFilters(filters);
    // Hide search upgrade prompt when filters change
    setShowSearchUpgradePrompt(false);
  };

  const handleSearch = () => {
    // Show special messages for premium users
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

    // Check if free user has reached limit and is trying to search
    // Premium users (Echo Amplified) can search without restrictions
    if (!isEchoActive && selectedFilters.length >= 3) {
      setShowSearchUpgradePrompt(true);
      return;
    }

    // Allow search for:
    // 1. Premium users (any filter count)
    // 2. Free users with less than 3 filters
    // 3. Any user with search query (regardless of filters)
    if (searchQuery.trim()) {
      // Navigate to matches page with search query
      navigate(`/matches?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // Navigate to matches page without search
      navigate('/matches');
    }
  };

  useEffect(() => {
    // Fetch FAQs for the "What Makes Us Different" section
    const fetchFaqs = async () => {
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .in('id', [3, 6, 10]) // AI matchmaking, data deletion, privacy
        .order('id');
      
      if (data) {
        setFaqs(data);
      }
    };
    
    fetchFaqs();
    
    // Show First Light Modal for authenticated users on first visit
    if (user && !localStorage.getItem('hasSeenFirstLight')) {
      setIsNewUser(true);
      setShowFirstLightModal(true);
    }
  }, [user, loading, navigate]);

  console.log("Index component loading state:", loading, "user:", user ? "exists" : "null");

  if (loading) {
    console.log("Showing loading screen");
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
        
        {/* Modern Hero Section with Couples */}
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
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Find Your
                <br />
                <span className="relative">
                  Perfect Match
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full animate-scale-in"></div>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Beyond swipes. Beyond games. Discover meaningful connections through 
                <span className="text-primary font-semibold"> emotional intelligence</span> and 
                <span className="text-primary font-semibold"> genuine compatibility</span>.
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
                  onClick={() => navigate('/pricing')}
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
            {/* Success Stories Section */}
            <section className="py-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
              <div className="relative max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
                    <Heart className="h-4 w-4 mr-2" />
                    Success Stories
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Love Stories That Started Here
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Real couples who found their perfect match through emotional intelligence and genuine connection
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Story 1 */}
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative h-64">
                      <img 
                        src={coupleHero2} 
                        alt="Success story couple" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-red-400 fill-current" />
                          <span className="text-sm font-medium">Connected March 2024</span>
                        </div>
                        <h3 className="text-lg font-semibold">Sarah & Michael</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {"★".repeat(5)}
                        </div>
                        <span className="text-sm text-muted-foreground">96% Compatibility Match</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        "AI Complete Me helped us discover our emotional compatibility beyond surface-level attraction. The Connection DNA feature revealed how perfectly aligned our communication styles were."
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-primary font-medium">Now Engaged! 💍</span>
                        <Badge variant="secondary">Beyond Members</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Story 2 */}
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative h-64">
                      <img 
                        src={coupleDigital} 
                        alt="Success story couple" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-red-400 fill-current" />
                          <span className="text-sm font-medium">Connected January 2024</span>
                        </div>
                        <h3 className="text-lg font-semibold">Alex & Jamie</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {"★".repeat(5)}
                        </div>
                        <span className="text-sm text-muted-foreground">92% Compatibility Match</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        "The Memory Vault feature helped us save and reflect on our meaningful conversations. We knew we were compatible when our values aligned so perfectly in the compatibility analysis."
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-primary font-medium">Moving in Together! 🏠</span>
                        <Badge variant="secondary">Plus Members</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth')}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Start Your Love Story
                  </Button>
                </div>
              </div>
            </section>

            {/* What Makes Us Different Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">🔐</span>
                      Privacy First, Always
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      No ads. No tracking. No selling your data. You're here to connect — not to be commodified. We never compromise on user trust.
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
                      Our matchmaking uses AI to spark real compatibility — not swipe fatigue. You'll receive digestible insights designed to help you reflect, not react.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      Designed for Conversation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Read receipts, undo deletes, visibility boosts — these aren't gimmicks. They're tools to support meaningful dialogue, not manipulate behavior.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">🎁</span>
                      Pricing That Feels Human
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Premium access isn't a paywall — it's a support signal. We keep things gentle, clear, and optional. Because love should never feel like a transaction.
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
      
      {/* First Light Modal */}
      <FirstLightModal 
        isOpen={showFirstLightModal} 
        onClose={handleCloseFirstLightModal} 
      />
      
      <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* User Status Bar */}
        <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div>
            <h2 className="text-2xl font-bold text-primary">Welcome back!</h2>
            <p className="text-muted-foreground">You're successfully logged in as {user.email}</p>
          </div>
        </div>

        {/* Search Section */}
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
                  placeholder="Search by interests, location, or keywords..."
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
            
            {/* Search Upgrade Prompt */}
            {showSearchUpgradePrompt && !isEchoActive && (
              <Card className="mt-4 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💫</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">Want to explore more?</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Echo Amplified 🪞 adds emotional nuance, letting you match by vibe, depth, and expressive presence—not just identity.
                      </p>
                      <Button 
                        size="sm" 
                        onClick={handleUpgradePrompt}
                        className="text-xs h-8"
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        Add Echo Amplified to deepen your search
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div 
          className="text-center mb-12 relative rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `url(${datingBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-background/40"></div>
          <div className="relative z-10 py-16 px-8">
            <h1 className="text-5xl font-bold mb-6">Dating with depth, powered by trust.</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Because real connection isn't rare, it's just waiting for the right space.
            </p>
            <Button 
              onClick={() => navigate('/questions')} 
              size="lg"
              className="text-lg px-8 py-6"
            >
              Take the Compatibility Quiz
            </Button>
          </div>
        </div>

        {/* Love Stories Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Love Stories in Progress</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Real connections, found through emotional clarity
          </p>
        </div>
        
        {/* Identity Filters Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Connection Path</h2>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Start with intentional identity filtering to find meaningful connections
          </p>
          <SearchFilters 
            onFiltersChange={handleFiltersChange}
            onUpgradePrompt={handleUpgradePrompt}
          />
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
              <CardTitle className="flex items-center gap-2">
                AI Digest
                <Badge variant="secondary" className="text-xs">$12/mo</Badge>
              </CardTitle>
              <CardDescription>Personalized insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/ai-digest')} className="w-full">
                View Digest
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
        </div>


        {/* Premium Features CTA */}
        <div className="mb-8">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <span className="text-2xl">🚀</span>
                Premium Features
              </CardTitle>
              <CardDescription>
                Enhance your dating experience with priority matching, video chat, and AI insights
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => {
                  console.log("Premium Dashboard button clicked, navigating to /premium-dashboard");
                  navigate('/premium-dashboard');
                }} 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                View Premium Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-4">Unlock Premium Features</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Take your dating experience to the next level
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Visibility Boost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get shown to more compatible matches and increase your profile visibility by up to 10x.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  AI Digest Summaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive personalized daily summaries of your best matches with AI-powered compatibility insights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  Read Receipts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Know when your messages have been read and never wonder about your conversation status again.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            {subscription?.subscribed ? (
              <div className="space-y-4">
                <p className="text-lg font-medium text-green-600">
                  You're subscribed to {subscription.subscription_tier}!
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                >
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/pricing')}
              >
                View Pricing Plans
              </Button>
            )}
          </div>
        </div>

        {/* What Makes Us Different Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🔐</span>
                  Privacy First, Always
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  No ads. No tracking. No selling your data. You're here to connect — not to be commodified. We never compromise on user trust.
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
                  Our matchmaking uses AI to spark real compatibility — not swipe fatigue. You'll receive digestible insights designed to help you reflect, not react.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  Designed for Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Read receipts, undo deletes, visibility boosts — these aren't gimmicks. They're tools to support meaningful dialogue, not manipulate behavior.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  Pricing That Feels Human
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  $5/month for premium access isn't a paywall — it's a support signal. We keep things gentle, clear, and optional. Because love should never feel like a transaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  Built by Someone Who Gets It
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  GetUnlocked isn't VC-backed or mass-produced. It's handcrafted by someone who's lived this — and who believes technology can nurture deeper connection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Welcome to GetUnlocked!</CardTitle>
            <CardDescription>Your secure dating app dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your account is now secure with proper authentication and data protection. Start by setting up your profile to begin connecting with others!
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;

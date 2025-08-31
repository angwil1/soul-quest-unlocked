import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingQuizButton } from '@/components/FloatingQuizButton';
import { FirstLightModal } from '@/components/FirstLightModal';
import { LaunchBanner } from '@/components/LaunchBanner';
import { AgeVerification } from '@/components/AgeVerification';
import SearchFilters from '@/components/SearchFilters';
import { AmbientCoupleCarousel } from '@/components/AmbientCoupleCarousel';
import { SoulfulInvitation } from '@/components/SoulfulInvitation';
import { GetStarted } from '@/components/GetStarted';
import { Testimonials } from '@/components/Testimonials';
import { HowItWorks } from '@/components/HowItWorks';
import HeroSection from '@/components/HeroSection';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';
import { ProfileCompletionPrompt } from '@/components/ProfileCompletionPrompt';
import { Heart, Shield, Star } from 'lucide-react';


const Index = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showFirstLightModal, setShowFirstLightModal] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSearchUpgradePrompt, setShowSearchUpgradePrompt] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  

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


  // Check age verification on page load
  useEffect(() => {
    const checkAgeVerification = () => {
      const localVerification = localStorage.getItem('ageVerified');
      if (localVerification === 'true') {
        setIsAgeVerified(true);
      } else {
        // Show age verification modal if not verified
        setShowAgeVerification(true);
      }
    };
    
    checkAgeVerification();
  }, []);

  // Page loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && !localStorage.getItem('hasSeenFirstLight') && isAgeVerified) {
      setIsNewUser(true);
      setShowFirstLightModal(true);
    }
  }, [user, isAgeVerified]);

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



  if (loading || isPageLoading) {
    return <PageLoadingSkeleton />;
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
        <HeroSection />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Ambient Couple Carousel Section */}
        <section className="py-20 bg-gradient-to-br from-muted/20 to-background">
          <AmbientCoupleCarousel />
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Get Started Section */}
        <GetStarted />

        {/* Soulful Invitation Section */}
        <SoulfulInvitation />

        {/* Enhanced Features Section */}
        <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/5 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            {/* Enhanced Promotional Banner */}
            <div className="mb-16 animate-fade-in">
              <div className="inline-block relative">
                <div className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 p-1 rounded-2xl shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:scale-105 transform">
                  <div className="bg-background/95 backdrop-blur-sm rounded-xl px-8 py-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="animate-pulse">🚀</div>
                      <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                        Revolutionary Dating
                      </span>
                      <div className="animate-pulse">🚀</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-lg md:text-2xl font-bold text-foreground">
                        <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                          NO MORE BORING SWIPES!
                        </span>
                      </div>
                      <div className="text-sm md:text-lg text-muted-foreground">
                        Find your{' '}
                        <span className="font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          SOULMATE
                        </span>{' '}
                        with AI-powered intelligence
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  NEW
                </div>
              </div>
            </div>
            
            {/* Section Title */}
            <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">
                Connection beyond the surface
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience dating reimagined with emotional intelligence, authentic connections, and meaningful relationships
              </p>
            </div>

            {/* Enhanced Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Heart,
                  title: "Emotional Intelligence",
                  description: "AI analyzes compatibility based on values, personality, and emotional depth",
                  gradient: "from-primary/10 to-purple-500/10",
                  borderColor: "border-primary/20",
                  iconColor: "text-primary",
                  delay: "0.3s"
                },
                {
                  icon: Shield,
                  title: "Privacy & Safety First",
                  description: "Military-grade encryption protects your data with advanced verification systems",
                  gradient: "from-purple-500/10 to-pink-500/10",
                  borderColor: "border-purple-500/20",
                  iconColor: "text-purple-500",
                  delay: "0.4s"
                },
                {
                  icon: Star,
                  title: "Quality Over Quantity",
                  description: "Curated matches based on deep compatibility, not superficial attraction",
                  gradient: "from-pink-500/10 to-primary/10",
                  borderColor: "border-pink-500/20",
                  iconColor: "text-pink-500",
                  delay: "0.5s"
                }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={index}
                    className={`p-8 bg-gradient-to-br ${feature.gradient} ${feature.borderColor} hover:scale-105 hover:shadow-xl transition-all duration-500 group cursor-pointer animate-fade-in`}
                    style={{ animationDelay: feature.delay }}
                  >
                    <div className="text-center space-y-4">
                      <div className={`inline-flex p-4 rounded-full bg-background/50 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                { number: "NEW", label: "Platform Launch", icon: "🚀" },
                { number: "AI", label: "Powered Matching", icon: "🧠" },
                { number: "100%", label: "Privacy First", icon: "🔒" },
                { number: "24/7", label: "Support", icon: "🛡️" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <Footer />
        
        <AgeVerification 
          forceOpen={showAgeVerification}
          onVerificationComplete={() => {
            setShowAgeVerification(false);
            setIsAgeVerified(true);
          }}
        />
        
        <FirstLightModal 
          isOpen={showFirstLightModal} 
          onClose={() => {
            setShowFirstLightModal(false);
            localStorage.setItem('hasSeenFirstLight', 'true');
          }}
        />
        
        <FloatingQuizButton />
      </div>
    );
};

export default Index;
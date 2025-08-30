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
import { WaitlistSignup } from '@/components/WaitlistSignup';
import { Testimonials } from '@/components/Testimonials';
import { HowItWorks } from '@/components/HowItWorks';
import HeroSection from '@/components/HeroSection';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';
import { Heart, Shield } from 'lucide-react';


const Index = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showFirstLightModal, setShowFirstLightModal] = useState(false);
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


  // Page loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && !localStorage.getItem('hasSeenFirstLight')) {
      setIsNewUser(true);
      setShowFirstLightModal(true);
    }
  }, [user]);

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

        {/* Waitlist Signup Section */}
        <WaitlistSignup />

        {/* Soulful Invitation Section */}
        <SoulfulInvitation />

        {/* Simple Features Section */}
        <section className="py-20 bg-gradient-to-br from-background to-primary/5">
          <div className="max-w-4xl mx-auto px-4 text-center">
            {/* DRAMATIC DESCRIPTION - Promotional section - visible on all screens */}
            <div className="mb-12">
              <p className="text-sm md:text-lg text-white font-bold max-w-xs md:max-w-2xl mx-auto leading-relaxed animate-fade-in bg-gradient-to-r from-primary to-purple-600 p-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                🚀 <span className="text-yellow-300 bg-black px-2 py-1 rounded-lg text-xs md:text-sm">NO MORE BORING SWIPES!</span> 🚀
                <br/>
                <span className="block mt-1 text-sm md:text-lg">Find your <span className="text-yellow-300 underline decoration-1 md:decoration-2 decoration-yellow-300">SOULMATE</span> with AI!</span>
              </p>
            </div>
            
            <h2 className="text-3xl font-serif font-light text-foreground mb-12">
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
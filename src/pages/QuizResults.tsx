import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Heart, Crown, MessageCircle, Eye, EyeOff, Mail, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEmailJourneys } from '@/hooks/useEmailJourneys';
import { useToast } from '@/hooks/use-toast';

interface MatchPreview {
  id: string;
  name: string;
  age: number;
  compatibility: number;
  commonInterests: string[];
  blurredPhoto?: string;
}

const QuizResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackQuizCompletion } = useEmailJourneys();
  const { toast } = useToast();
  const [matchPreviews, setMatchPreviews] = useState<MatchPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    loadMatchPreviews();
    
    // Show success toast when results are ready
    toast({
      title: "✨ Your results are ready!",
      description: "Discover your personalized compatibility matches below",
      duration: 4000,
    });
  }, [toast]);

  const loadMatchPreviews = async () => {
    try {
      // Create engaging placeholder profiles with different types
      const placeholderPreviews: MatchPreview[] = [
        // Sample Match - builds trust with full details
        {
          id: 'sample-1',
          name: 'Alex',
          age: 28,
          compatibility: 94,
          commonInterests: ['Photography', 'Hiking'],
          blurredPhoto: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
        },
        // Mystery Match - creates intrigue
        {
          id: 'mystery-1', 
          name: 'SoulQuest Explorer',
          age: 26,
          compatibility: 89,
          commonInterests: ['Adventure', 'Art'],
          blurredPhoto: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'
        },
        // Blurred Preview - teases insights
        {
          id: 'blurred-1',
          name: 'Creative Spirit',
          age: 30,
          compatibility: 92,
          commonInterests: ['Music', 'Travel'],
          blurredPhoto: 'https://images.unsplash.com/photo-1500673922987-e212871c6c22'
        }
      ];

      setMatchPreviews(placeholderPreviews);
    } catch (error) {
      console.error('Error loading match previews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatches = () => {
    navigate('/matches');
  };

  const handleUpgradeToPremium = () => {
    navigate('/pricing');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleResendEmail = async () => {
    if (!user) return;
    
    setResending(true);
    try {
      await trackQuizCompletion();
      toast({
        title: "Email resent! 📧",
        description: "Check your inbox and spam folder for 'Your GetUnlocked Compatibility Results'",
      });
      setEmailSent(true);
    } catch (error) {
      console.error('Error resending email:', error);
      toast({
        title: "Error resending email",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your compatibility...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-primary animate-pulse" />
              <Heart className="h-8 w-8 text-red-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Quiz Complete! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            Your compatibility profile is ready and matches are waiting!
          </p>
        </div>

        {/* Connection Profile Sneak Peek */}
        <Card className="mb-8 border-primary/20 bg-gradient-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10 backdrop-blur-sm z-10"></div>
          <CardHeader className="text-center relative z-20">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Connection Profile
            </CardTitle>
            <CardDescription>Get ready for deeper insights</CardDescription>
          </CardHeader>
          <CardContent className="relative z-20">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-muted-foreground">Your Connection Profile will include:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="blur-sm">Compatibility score</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="blur-sm">Vibe signals</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="blur-sm">A unique insight about how you connect</span>
                  </div>
                </div>
              </div>
               <div className="p-4 bg-accent/30 rounded-lg border border-accent/40">
                <p className="text-sm font-medium text-accent-foreground mb-2">
                  Want early access to deeper insights?
                </p>
                <Button 
                  onClick={handleUpgradeToPremium}
                  variant="outline"
                  className="border-accent text-accent-foreground hover:bg-accent/50"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Unlocked+
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Previews */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Top Compatibility Matches</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {matchPreviews.map((match, index) => (
              <Card key={match.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/10">
                <CardContent className="p-4">
                   <div className="relative mb-3">
                     {/* Avatar with beautiful gradient background */}
                     <div className="w-20 h-20 rounded-full mx-auto relative overflow-hidden">
                       {match.blurredPhoto ? (
                         <img 
                           src={match.blurredPhoto} 
                           alt={match.name} 
                           className={`w-full h-full object-cover ${index > 0 ? 'blur-sm' : ''}`}
                         />
                       ) : (
                         <div className={`w-full h-full flex items-center justify-center text-white font-bold text-2xl
                           ${index === 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 
                             index === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 
                             'bg-gradient-to-br from-green-500 to-emerald-500'}`}>
                           {match.name.charAt(0)}
                         </div>
                       )}
                       {index > 0 && (
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           <EyeOff className="h-6 w-6 text-white" />
                         </div>
                       )}
                     </div>
                    {index === 0 && (
                      <Badge variant="secondary" className="absolute -top-2 -right-2">
                        <Crown className="h-3 w-3 mr-1" />
                        Top Match
                      </Badge>
                    )}
                  </div>
                  
                   <div className="text-center">
                     {/* Different display logic for each placeholder type */}
                     {index === 0 ? (
                       // Sample Match - Full details shown
                       <>
                         <h3 className="font-semibold">{match.name}</h3>
                         <p className="text-sm text-muted-foreground">Age: {match.age}</p>
                         <div className="my-3">
                           <div className="flex items-center justify-center gap-1 mb-1">
                             <Heart className="h-4 w-4 text-red-500" />
                             <span className="text-sm font-medium">{match.compatibility}% Match</span>
                           </div>
                           <Progress value={match.compatibility} className="h-2" />
                         </div>
                         <div className="flex flex-wrap gap-1 justify-center">
                           {match.commonInterests.map((interest) => (
                             <Badge key={interest} variant="outline" className="text-xs">
                               {interest}
                             </Badge>
                           ))}
                         </div>
                       </>
                     ) : index === 1 ? (
                       // Mystery Match - Narrative style
                       <>
                         <h3 className="font-semibold text-primary">Meet {match.name}</h3>
                         <p className="text-xs text-muted-foreground italic">Age: ••</p>
                         <div className="my-3">
                           <div className="flex items-center justify-center gap-1 mb-1">
                             <Sparkles className="h-4 w-4 text-primary" />
                             <span className="text-sm font-medium">{match.compatibility}% Match</span>
                           </div>
                           <Progress value={match.compatibility} className="h-2" />
                         </div>
                         <div className="mt-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
                           <p className="text-xs text-primary font-medium">
                             🔮 Unlock their story
                           </p>
                         </div>
                       </>
                     ) : (
                       // Blurred Preview - Teases insights
                       <>
                         <h3 className="font-semibold blur-sm">{match.name}</h3>
                         <p className="text-sm text-muted-foreground">Age: ••</p>
                         <div className="my-3">
                           <div className="flex items-center justify-center gap-1 mb-1">
                             <Heart className="h-4 w-4 text-red-500" />
                             <span className="text-sm font-medium">{match.compatibility}% Match</span>
                           </div>
                           <Progress value={match.compatibility} className="h-2" />
                         </div>
                         <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                           <p className="text-xs text-muted-foreground">
                             💫 Deep compatibility insights await
                           </p>
                         </div>
                       </>
                     )}
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Upgrade Prompt */}
        <Card className="mb-8 border-accent/40 bg-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-accent-foreground">
              <Crown className="h-5 w-5" />
              Unlock Your Full Potential
            </CardTitle>
            <CardDescription>Premium members get 3x more matches and exclusive features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">See all your matches</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Unlimited messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm">See who liked you</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Advanced compatibility insights</span>
              </div>
            </div>
            <Button 
              onClick={handleUpgradeToPremium}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-primary hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              ✨ Unlock Deeper Connections
            </Button>
          </CardContent>
        </Card>


        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button onClick={handleViewMatches} size="lg" className="flex-1 max-w-xs">
            <Heart className="h-4 w-4 mr-2" />
            View Matches
          </Button>
          <Button onClick={handleViewProfile} variant="outline" size="lg" className="flex-1 max-w-xs">
            Complete Profile
          </Button>
        </div>

        {/* Founder Note */}
        <div className="text-center py-8 border-t border-muted-foreground/10">
          <p className="text-sm text-muted-foreground italic">
            Built with care, designed for real connection ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useMessageLimits } from '@/hooks/useMessageLimits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Heart, Crown, MessageCircle, Eye, EyeOff, Mail, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useEmailJourneys } from '@/hooks/useEmailJourneys';
import { useToast } from '@/hooks/use-toast';
import { InviteKindredSoul } from '@/components/InviteKindredSoul';
import { Navbar } from '@/components/Navbar';

interface MatchPreview {
  id: string;
  name: string;
  age: number;
  compatibility: number;
  commonInterests: string[];
  blurredPhoto?: string;
}

const QuizResults = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const { trackQuizCompletion } = useEmailJourneys();
  const { toast } = useToast();
  const { remainingMessages, canSendMessage, upgradePrompt } = useMessageLimits();
  const [matchPreviews, setMatchPreviews] = useState<MatchPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (user && !profileLoading) {
      loadMatchPreviews();
    }
    
    // Show success toast when results are ready
    toast({
      title: "✨ Your results are ready!",
      description: "Discover your personalized compatibility matches below",
      duration: 4000,
    });
  }, [user, profileLoading, toast]);


  const loadMatchPreviews = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get current user's profile
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('interests, personality_type, age')
        .eq('id', user.id)
        .single();

      // Get other profiles to match with
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name, age, personality_type, interests, photos')
        .neq('id', user.id)
        .not('personality_type', 'is', null)
        .not('name', 'is', null)
        .limit(10);

      if (error) {
        console.error('Error loading profiles:', error);
        throw error;
      }

      if (!profiles || profiles.length === 0) {
        // Show placeholder if no real profiles exist
        const placeholderPreviews: MatchPreview[] = [
          {
            id: 'sample-1',
            name: 'Alex',
            age: 28,
            compatibility: 94,
            commonInterests: ['Photography', 'Hiking'],
            blurredPhoto: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
          }
        ];
        setMatchPreviews(placeholderPreviews);
        setLoading(false);
        return;
      }

      // Calculate compatibility scores based on interests and personality
      const matchedProfiles = profiles
        .map(profile => {
          let compatibilityScore = 50; // base score
          
          // Add points for shared interests
          if (currentProfile?.interests && profile.interests) {
            const userInterests = currentProfile.interests || [];
            const profileInterests = profile.interests || [];
            const sharedInterests = userInterests.filter(interest => 
              profileInterests.includes(interest)
            );
            compatibilityScore += Math.min(sharedInterests.length * 10, 30);
          }
          
          // Add points for similar personality type
          if (currentProfile?.personality_type && profile.personality_type) {
            if (currentProfile.personality_type === profile.personality_type) {
              compatibilityScore += 15;
            }
          }
          
          // Add points for similar age
          if (currentProfile?.age && profile.age) {
            const ageDiff = Math.abs(currentProfile.age - profile.age);
            if (ageDiff <= 2) compatibilityScore += 10;
            else if (ageDiff <= 5) compatibilityScore += 5;
          }
          
          // Ensure score is within range
          compatibilityScore = Math.min(Math.max(compatibilityScore, 60), 98);
          
          // Get common interests for display
          const userInterests = currentProfile?.interests || [];
          const profileInterests = profile.interests || [];
          const commonInterests = userInterests.filter(interest => 
            profileInterests.includes(interest)
          ).slice(0, 3);
          
          // If no common interests, show some of their interests
          const displayInterests = commonInterests.length > 0 
            ? commonInterests 
            : (profileInterests || []).slice(0, 2);
          
          return {
            id: profile.id,
            name: profile.name || 'Anonymous',
            age: profile.age || 25,
            compatibility: compatibilityScore,
            commonInterests: displayInterests,
            blurredPhoto: profile.photos?.[0] || undefined
          };
        })
        .sort((a, b) => b.compatibility - a.compatibility) // Sort by compatibility
        .slice(0, 3); // Take top 3

      setMatchPreviews(matchedProfiles);
    } catch (error) {
      console.error('Error loading match previews:', error);
      // Fallback to placeholder
      const placeholderPreviews: MatchPreview[] = [
        {
          id: 'sample-1',
          name: 'Alex',
          age: 28,
          compatibility: 94,
          commonInterests: ['Photography', 'Hiking'],
          blurredPhoto: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
        }
      ];
      setMatchPreviews(placeholderPreviews);
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

  const handleMatchClick = async (match: MatchPreview, index: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // All matches are accessible during the free 60-day period
    // Check if user can send messages
    if (!canSendMessage) {
      toast({
        title: "Message limit reached",
        description: `You have ${remainingMessages} messages left today. Upgrade to Premium for unlimited messaging!`,
        variant: "destructive",
        action: (
          <Button 
            size="sm" 
            onClick={upgradePrompt}
            className="ml-2"
          >
            Upgrade
          </Button>
        ),
      });
      return;
    }

    // Create or find existing match in database and navigate to messages
    try {
      // For demo purposes, we'll create a demo match
      // In a real app, this would be handled differently
      toast({
        title: "Match Connected! 💫",
        description: `You can now message ${match.name}. Start a conversation!`,
      });
      navigate('/messages');
    } catch (error) {
      console.error('Error connecting to match:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect with this match. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendEmail = async () => {
    if (!user) return;
    
    setResending(true);
    try {
      await trackQuizCompletion();
      toast({
        title: "Email resent! 📧",
        description: "Check your inbox and spam folder for 'Your AI Complete Me Compatibility Results'",
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
      <Navbar />
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
                  Complete Plus+
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
              <Card 
                key={match.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/10 cursor-pointer hover:border-primary/30"
                onClick={() => handleMatchClick(match, index)}
              >
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Avatar className="w-full h-full rounded-lg">
                      <AvatarImage 
                        src={match.blurredPhoto} 
                        alt={`${match.name}'s profile photo`}
                        className="object-cover"
                      />
                      <AvatarFallback className="w-full h-full rounded-lg text-lg">
                        {match.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">
                      Top Match!
                    </Badge>
                  )}
                  
                  <Badge 
                    className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {match.compatibility}%
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {match.name}, {match.age}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">{match.compatibility}% Match</span>
                  </div>
                  <Progress value={match.compatibility} className="h-2 mb-3" />
                  
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {match.commonInterests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMatchClick(match, index);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message {match.name}
                  </Button>
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
              Complete Your Full Potential
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
              ✨ Complete Deeper Connections
            </Button>
          </CardContent>
        </Card>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 max-w-2xl mx-auto">
          <Button onClick={handleViewMatches} size="lg" className="w-full sm:flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            <Heart className="h-4 w-4 mr-2" />
            Find Your Matches
          </Button>
          <Button onClick={handleViewProfile} variant="outline" size="lg" className="w-full sm:flex-1">
            Edit Profile
          </Button>
          <Button
            onClick={async () => {
              await signOut();
              navigate('/auth');
            }}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Log Out
          </Button>
        </div>

        {/* Invite Kindred Soul Section - Perfect emotional moment after seeing matches */}
        <div className="mb-8">
          <InviteKindredSoul />
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Heart, Crown, MessageCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [matchPreviews, setMatchPreviews] = useState<MatchPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadMatchPreviews();
  }, [user, navigate]);

  const loadMatchPreviews = async () => {
    try {
      // Fetch a few potential matches to show as previews
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, age, interests, avatar_url')
        .neq('id', user?.id)
        .limit(3);

      if (profiles) {
        const previews: MatchPreview[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || 'Anonymous',
          age: profile.age || 25,
          compatibility: Math.floor(Math.random() * 30) + 70, // Mock compatibility score
          commonInterests: (profile.interests || []).slice(0, 2),
          blurredPhoto: profile.avatar_url
        }));
        
        setMatchPreviews(previews);
      }
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

        {/* Compatibility Score */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Compatibility Score
            </CardTitle>
            <CardDescription>Based on your quiz responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-primary mb-2">92%</div>
              <p className="text-muted-foreground">Excellent compatibility potential!</p>
            </div>
            <Progress value={92} className="h-3" />
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
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto flex items-center justify-center">
                      {index === 0 ? (
                        <Eye className="h-8 w-8 text-primary/60" />
                      ) : (
                        <EyeOff className="h-8 w-8 text-muted-foreground/40" />
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
                    <h3 className="font-semibold">{index === 0 ? match.name : '•••••'}</h3>
                    <p className="text-sm text-muted-foreground">Age: {index === 0 ? match.age : '••'}</p>
                    
                    <div className="my-3">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{match.compatibility}% Match</span>
                      </div>
                      <Progress value={match.compatibility} className="h-2" />
                    </div>

                    {index === 0 && match.commonInterests.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {match.commonInterests.map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {index > 0 && (
                      <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          Unlock with Premium
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Upgrade Prompt */}
        <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
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
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button onClick={handleViewMatches} size="lg" className="flex-1 max-w-xs">
            <Heart className="h-4 w-4 mr-2" />
            View Matches
          </Button>
          <Button onClick={handleViewProfile} variant="outline" size="lg" className="flex-1 max-w-xs">
            Complete Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
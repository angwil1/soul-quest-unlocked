import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useAIMatching } from '@/hooks/useAIMatching';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Heart, X, MapPin, Briefcase, GraduationCap, Users, Video, Sparkles, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VideoCallModal from '@/components/VideoCallModal';

interface MatchProfile {
  id: string;
  name: string | null;
  age: number | null;
  bio: string | null;
  location: string | null;
  occupation: string | null;
  education: string | null;
  interests: string[] | null;
  avatar_url: string | null;
  photos: string[] | null;
  distance?: number;
  compatibility_score?: number;
}

const Matches = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [hasLikedCurrent, setHasLikedCurrent] = useState(false);
  const [aiMatches, setAIMatches] = useState<any[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const { matches: aiMatchData, loading: aiLoading, generateAIMatches } = useAIMatching();

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (aiMatchData.length > 0) {
      setAIMatches(aiMatchData);
      // Convert AI matches to MatchProfile format
      const convertedMatches = aiMatchData.map(aiMatch => ({
        ...aiMatch.profile,
        compatibility_score: aiMatch.compatibility_score,
        distance: Math.floor(Math.random() * 30) + 5 // Mock distance
      }));
      setMatches(convertedMatches);
    }
  }, [aiMatchData]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      // Don't fetch if user is not available
      if (!user?.id) {
        console.log('No user ID available, showing placeholder matches');
        // Show placeholder matches for demo
        const placeholderMatches = [
          {
            id: 'demo-1',
            name: 'Alex',
            age: 28,
            bio: 'Adventure seeker and coffee enthusiast. Love hiking, photography, and exploring new places.',
            location: 'San Francisco, CA',
            occupation: 'Product Designer',
            education: 'UC Berkeley',
            interests: ['Photography', 'Hiking', 'Coffee', 'Travel'],
            avatar_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
            photos: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'],
            compatibility_score: 94,
            distance: 12
          },
          {
            id: 'demo-2', 
            name: 'Jordan',
            age: 26,
            bio: 'Tech enthusiast by day, musician by night. Always up for trying new restaurants!',
            location: 'Oakland, CA',
            occupation: 'Software Engineer',
            education: 'Stanford University',
            interests: ['Music', 'Technology', 'Food', 'Art'],
            avatar_url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400',
            photos: ['https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400'],
            compatibility_score: 89,
            distance: 8
          },
          {
            id: 'demo-3',
            name: 'Casey',
            age: 30,
            bio: 'Yoga instructor and nature lover. Seeking genuine connections and meaningful conversations.',
            location: 'Palo Alto, CA',
            occupation: 'Yoga Instructor',
            education: 'UC Santa Barbara',
            interests: ['Yoga', 'Nature', 'Meditation', 'Reading'],
            avatar_url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400',
            photos: ['https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400'],
            compatibility_score: 92,
            distance: 15
          }
        ];
        
        setMatches(placeholderMatches);
        setLoading(false);
        return;
      }
      
      // Fetch potential matches (other users excluding current user)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(20);

      if (error) {
        console.error('Error fetching matches:', error);
        toast({
          title: "Error loading matches",
          description: "Please try again later",
          variant: "destructive"
        });
        return;
      }

      // Add mock compatibility scores and distances for demo
      const matchesWithScores = (data || []).map((profile) => ({
        ...profile,
        compatibility_score: Math.floor(Math.random() * 40) + 60, // 60-99%
        distance: Math.floor(Math.random() * 50) + 1 // 1-50km
      }));

      // Sort by compatibility score
      matchesWithScores.sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));
      
      setMatches(matchesWithScores);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error loading matches",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleLike = async () => {
    setHasLikedCurrent(true);
    
    // Simulate mutual match (in real app, this would check if they also liked you)
    const isMutualMatch = Math.random() > 0.5; // 50% chance for demo
    
    if (isMutualMatch) {
      toast({
        title: "💖 Mutual Match!",
        description: "You both liked each other! Video chat is now available.",
      });
    } else {
      toast({
        title: "💙 Profile liked",
        description: "Keep exploring to find more connections!",
      });
      
      if (currentMatchIndex < matches.length - 1) {
        setCurrentMatchIndex(currentMatchIndex + 1);
        setHasLikedCurrent(false);
      }
    }
  };

  const handlePass = () => {
    setHasLikedCurrent(false);
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    } else {
      toast({
        title: "🎉 You've seen all matches!",
        description: "Check back later for more potential connections.",
      });
    }
  };

  const handleVideoCall = () => {
    if (!subscription?.subscribed || 
        (subscription.subscription_tier !== 'unlocked-plus' && 
         subscription.subscription_tier !== 'founders-circle')) {
      toast({
        title: "Premium feature",
        description: "Video calls are available for Unlocked+ and Founder's Circle members",
        variant: "destructive"
      });
      navigate('/pricing');
      return;
    }
    
    setIsVideoCallOpen(true);
  };

  const isPremiumUser = subscription?.subscribed && 
    (subscription.subscription_tier === 'unlocked-plus' || 
     subscription.subscription_tier === 'founders-circle');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium">Discover Matches</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center space-y-8">
            {/* Main anticipation message */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Your matches will appear here
              </h2>
              <p className="text-muted-foreground">
                Real connection takes a moment.
              </p>
            </div>

            {/* Animated loading element */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-pulse bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full h-16 w-16 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary animate-bounce" />
                </div>
                <div className="absolute -top-1 -left-1 h-18 w-18 border-2 border-primary/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <p className="text-sm text-primary font-medium animate-fade-in">
                We're tuning your Connection DNA…
              </p>
            </div>

            {/* Mini founder's note */}
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground italic">
                "While we search for your people, know this: you're already enough."
              </p>
            </div>

            {/* Visual placeholder cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Coming soon...</h3>
              <div className="grid gap-4">
                {/* Placeholder card 1 */}
                <Card className="overflow-hidden">
                  <div className="relative h-32 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto animate-pulse" />
                      <p className="text-sm text-muted-foreground font-medium">Coming soon…</p>
                    </div>
                  </div>
                </Card>

                {/* Placeholder card 2 */}
                <Card className="overflow-hidden">
                  <div className="relative h-32 bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <p className="text-sm text-muted-foreground font-medium">
                        {subscription?.subscribed ? "Your vibe attracts your tribe" : "Unlock deeper matches with Unlocked+"}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Placeholder card 3 */}
                <Card className="overflow-hidden">
                  <div className="relative h-32 bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto animate-pulse" style={{ animationDelay: '1s' }} />
                      <p className="text-sm text-muted-foreground font-medium">Your vibe attracts your tribe</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Quiz completion badge */}
            <div className="flex justify-center">
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20 px-4 py-2">
                ✅ Quiz complete — Compatibility in progress…
              </Badge>
            </div>

            {/* Upgrade teaser for free tier */}
            {!subscription?.subscribed && (
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-medium mb-2">Want priority matching?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upgrade to Unlocked+ for deeper connection.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/pricing')}
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    Explore Unlocked+
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentMatchIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-medium">Discover Matches</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* AI Matching Controls */}
        {user && (
          <Card className="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">AI-Powered Matching</h3>
                    <p className="text-sm text-muted-foreground">
                      Get personalized matches using advanced AI analysis
                    </p>
                  </div>
                </div>
                <Button
                  onClick={generateAIMatches}
                  disabled={aiLoading}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Matches
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {matches.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-12">
              <h2 className="text-2xl font-bold mb-4">Ready to find your perfect match?</h2>
              <p className="text-muted-foreground mb-6">
                {user ? 
                  "Click 'Generate AI Matches' above to discover personalized connections using AI analysis!" :
                  "Complete your profile to start discovering amazing people!"
                }
              </p>
              {user ? (
                <Button 
                  onClick={generateAIMatches}
                  disabled={aiLoading}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Analyzing Compatibility...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Your First AI Matches
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={() => navigate('/profile/edit')}>
                  Complete Profile
                </Button>
              )}
            </CardContent>
          </Card>
        ) : currentMatchIndex >= matches.length ? (
          <Card className="text-center">
            <CardContent className="p-12">
              <h2 className="text-2xl font-bold mb-4">🎉 All caught up!</h2>
              <p className="text-muted-foreground mb-6">
                You've seen all available matches. Check back later for new connections!
              </p>
              <Button onClick={() => navigate('/')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {currentMatchIndex + 1} of {matches.length} matches
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentMatchIndex + 1) / matches.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Match Card */}
            <Card className="overflow-hidden">
              {/* Photo */}
              <div className="relative h-96 bg-gradient-to-br from-primary/10 to-secondary/10">
                {currentMatch.avatar_url ? (
                  <img 
                    src={currentMatch.avatar_url} 
                    alt={currentMatch.name || 'Profile'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="h-32 w-32">
                      <AvatarFallback className="text-3xl">
                        {currentMatch.name?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                
                {/* Compatibility badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 text-white">
                    {currentMatch.compatibility_score}% Match
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Basic Info */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">
                    {currentMatch.name || 'Anonymous'}
                    {currentMatch.age && <span className="text-muted-foreground">, {currentMatch.age}</span>}
                  </h2>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {currentMatch.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{currentMatch.location}</span>
                        {currentMatch.distance && <span>• {currentMatch.distance}km away</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {currentMatch.bio && (
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {currentMatch.bio}
                  </p>
                )}

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {currentMatch.occupation && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{currentMatch.occupation}</span>
                    </div>
                  )}
                  
                  {currentMatch.education && (
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{currentMatch.education}</span>
                    </div>
                  )}
                </div>

                {/* Interests */}
                {currentMatch.interests && currentMatch.interests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.interests.slice(0, 6).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {currentMatch.interests.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{currentMatch.interests.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                {aiMatches.length > 0 && aiMatches[currentMatchIndex] && (
                  <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 mb-2">AI Compatibility Insights</h4>
                          <p className="text-sm text-blue-800 mb-3 leading-relaxed">
                            {aiMatches[currentMatchIndex].explanation}
                          </p>
                          
                          {aiMatches[currentMatchIndex].shared_interests?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-blue-900 mb-1">Shared Interests:</p>
                              <div className="flex flex-wrap gap-1">
                                {aiMatches[currentMatchIndex].shared_interests.map((interest: string, index: number) => (
                                  <Badge key={index} className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {aiMatches[currentMatchIndex].conversation_starters?.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-blue-900 mb-2">Conversation Starters:</p>
                              <div className="space-y-1">
                                {aiMatches[currentMatchIndex].conversation_starters.slice(0, 2).map((starter: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <MessageCircle className="h-3 w-3 mt-0.5 text-blue-600 flex-shrink-0" />
                                    <p className="text-xs text-blue-700">{starter}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Video Call Feature for Mutual Matches */}
                {hasLikedCurrent && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg">
                    <div className="text-center space-y-3">
                      <Badge className="bg-green-500 text-white">
                        ✨ Mutual Match!
                      </Badge>
                      <h3 className="font-semibold">Ready for a deeper connection?</h3>
                      <p className="text-sm text-muted-foreground">
                        Start a video chat in a safe, blurred environment
                      </p>
                      
                      {isPremiumUser ? (
                        <Button 
                          onClick={handleVideoCall}
                          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Start Video Chat
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Video chat available for Unlocked+ and Founder's Circle members
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/pricing')}
                            size="sm"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Upgrade to Chat
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePass}
                    className="flex-1 max-w-32"
                    disabled={hasLikedCurrent}
                  >
                    <X className="h-5 w-5 mr-2" />
                    Pass
                  </Button>
                  
                  <Button
                    size="lg"
                    onClick={handleLike}
                    className="flex-1 max-w-32 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    disabled={hasLikedCurrent}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    {hasLikedCurrent ? "Matched!" : "Like"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        matchName={currentMatch?.name || 'Your match'}
      />
    </div>
  );
};

export default Matches;
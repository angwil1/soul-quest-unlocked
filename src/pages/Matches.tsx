import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Heart, X, MapPin, Briefcase, GraduationCap, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMatches();
  }, [user, navigate]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      // Fetch potential matches (other users excluding current user)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id)
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
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
      toast({
        title: "💖 It's a match!",
        description: "You've liked this profile. Keep exploring!",
      });
    } else {
      toast({
        title: "🎉 You've seen all matches!",
        description: "Check back later for more potential connections.",
      });
    }
  };

  const handlePass = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    } else {
      toast({
        title: "🎉 You've seen all matches!",
        description: "Check back later for more potential connections.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Finding your perfect matches...</h2>
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
        {matches.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-12">
              <h2 className="text-2xl font-bold mb-4">No matches found</h2>
              <p className="text-muted-foreground mb-6">
                Complete your profile to start discovering amazing people!
              </p>
              <Button onClick={() => navigate('/profile/edit')}>
                Complete Profile
              </Button>
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

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePass}
                    className="flex-1 max-w-32"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Pass
                  </Button>
                  
                  <Button
                    size="lg"
                    onClick={handleLike}
                    className="flex-1 max-w-32 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Like
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
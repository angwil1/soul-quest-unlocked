import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { useDistance } from '@/hooks/useDistance';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, MapPin, Users, Heart, Filter } from 'lucide-react';

interface MatchProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  zip_code: string;
  avatar_url?: string;
  distance?: number;
  interests?: string[];
}

const MatchSearch = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { calculateDistance } = useDistance();
  const { toast } = useToast();
  
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Sample profiles for demonstration
  const sampleProfiles: MatchProfile[] = [
    {
      id: '1',
      name: 'Alex Thompson',
      age: 28,
      bio: 'Love hiking, photography, and good coffee. Looking for genuine connections.',
      location: 'Manhattan, NY',
      zip_code: '10001',
      interests: ['hiking', 'photography', 'coffee']
    },
    {
      id: '2',
      name: 'Jordan Kim',
      age: 32,
      bio: 'Artist and yoga instructor. Passionate about mindfulness and creativity.',
      location: 'Brooklyn, NY',
      zip_code: '11201',
      interests: ['yoga', 'art', 'meditation']
    },
    {
      id: '3',
      name: 'Casey Rodriguez',
      age: 26,
      bio: 'Entrepreneur and foodie. Always trying new restaurants and adventures.',
      location: 'Queens, NY',
      zip_code: '11375',
      interests: ['food', 'business', 'travel']
    },
    {
      id: '4',
      name: 'Riley Chen',
      age: 30,
      bio: 'Software engineer who loves rock climbing and board games.',
      location: 'Bronx, NY',
      zip_code: '10451',
      interests: ['climbing', 'gaming', 'tech']
    },
    {
      id: '5',
      name: 'Morgan Davis',
      age: 29,
      bio: 'Teacher and weekend warrior. Into fitness, reading, and live music.',
      location: 'Staten Island, NY',
      zip_code: '10301',
      interests: ['fitness', 'music', 'books']
    }
  ];

  const searchMatches = async () => {
    if (!profile?.zip_code) {
      toast({
        title: "Zip Code Required",
        description: "Please add your zip code in your profile to search for matches.",
        variant: "destructive"
      });
      return;
    }

    if (!profile?.distance_preference) {
      toast({
        title: "Distance Preference Required",
        description: "Please set your distance preference in your profile.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const matchesWithDistance = [];

      for (const match of sampleProfiles) {
        // Check age preferences
        if (profile.age_preference_min && match.age < profile.age_preference_min) continue;
        if (profile.age_preference_max && match.age > profile.age_preference_max) continue;

        // Calculate distance
        const result = await calculateDistance(profile.zip_code, match.zip_code);
        if (result && result.distance <= profile.distance_preference) {
          matchesWithDistance.push({
            ...match,
            distance: result.distance
          });
        }
      }

      // Sort by distance
      matchesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setMatches(matchesWithDistance);
      
      toast({
        title: "Search Complete",
        description: `Found ${matchesWithDistance.length} matches within ${profile.distance_preference} miles`,
      });
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for matches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 5280).toFixed(0)} ft away`;
    }
    return `${distance.toFixed(1)} miles away`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/matches')}>
            <Search className="h-4 w-4 mr-2" />
            Find Matches
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile/edit')}>
            <Filter className="h-4 w-4 mr-2" />
            Edit Preferences
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Settings Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Your Search Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile?.zip_code || '?????'}
                </div>
                <div className="text-sm text-muted-foreground">Your Zip Code</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile?.distance_preference || '??'} mi
                </div>
                <div className="text-sm text-muted-foreground">Max Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile?.age_preference_min || '??'}-{profile?.age_preference_max || '??'}
                </div>
                <div className="text-sm text-muted-foreground">Age Range</div>
              </div>
              <div className="text-center">
                <Button 
                  onClick={searchMatches} 
                  disabled={loading || !profile?.zip_code || !profile?.distance_preference}
                  className="w-full"
                >
                  {loading ? 'Searching...' : 'Search Matches'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchPerformed && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Matches Found ({matches.length})
              </CardTitle>
              <CardDescription>
                Profiles within {profile?.distance_preference} miles of {profile?.zip_code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matches.map((match) => (
                    <Card key={match.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={match.avatar_url} />
                            <AvatarFallback className="text-lg">
                              {match.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{match.name}</h3>
                              <Badge variant="outline">{match.age}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {match.location}
                            </p>
                            {match.distance !== undefined && (
                              <div className="flex items-center gap-1 mb-2">
                                <MapPin className="h-3 w-3 text-primary" />
                                <span className="text-sm font-medium text-primary">
                                  {formatDistance(match.distance)}
                                </span>
                              </div>
                            )}
                            <p className="text-sm mb-3 line-clamp-2">{match.bio}</p>
                            {match.interests && (
                              <div className="flex flex-wrap gap-1">
                                {match.interests.slice(0, 3).map((interest, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Heart className="h-4 w-4 mr-1" />
                            Like
                          </Button>
                          <Button variant="default" size="sm" className="flex-1">
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                  <p>Try adjusting your search preferences:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Increase your distance range</li>
                    <li>Expand your age preferences</li>
                    <li>Check if your zip code is correct</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/profile/edit')}
                  >
                    Update Preferences
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!searchPerformed && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Ready to find your match?</h3>
              <p className="text-muted-foreground mb-6">
                Use the search button above to find compatible people near you
              </p>
              {(!profile?.zip_code || !profile?.distance_preference) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    📍 Please complete your search preferences in your profile first
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchSearch;
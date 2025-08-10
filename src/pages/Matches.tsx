import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import SearchFilters from '@/components/SearchFilters';
import { ArrowLeft, Heart, X, MapPin, Users, Search, Filter } from 'lucide-react';
import caseyProfile from '@/assets/casey-profile-realistic.jpg';
import caseyProfileAlt from '@/assets/casey-profile.jpg';
import alexProfileRealistic from '@/assets/alex-profile-realistic.jpg';
import alexProfileMain from '@/assets/alex-profile-main.jpg';
import alexProfileHiking from '@/assets/alex-profile-hiking.jpg';
import alexProfilePhotography from '@/assets/alex-profile-photography.jpg';
import jordanProfileRealistic from '@/assets/jordan-profile-realistic.jpg';
import jordanProfileMain from '@/assets/jordan-profile-main.jpg';

const Matches = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageRange, setAgeRange] = useState([18, 50]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [genderFilters, setGenderFilters] = useState<string[]>([]);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [viewedMatchesCount, setViewedMatchesCount] = useState(0);

  // Initialize filters from URL parameters
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const preference = searchParams.get('preference');
    const zip = searchParams.get('zip');
    
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    
    if (preference) {
      // Convert preference to gender filter
      const genderMap: Record<string, string[]> = {
        'men': ['men'],
        'women': ['women'], 
        'non-binary': ['non-binary'],
        'all': ['all']
      };
      
      if (genderMap[preference]) {
        setGenderFilters(genderMap[preference]);
      }
    }
  }, [searchParams]);

  // Demo matches data with everyday people
  const matches = [
    {
      id: 'demo-1',
      name: 'Alex',
      age: 26,
      gender: 'man',
      bio: "Marketing coordinator who loves weekend farmers markets and trying new brunch spots. Looking for someone to explore the city with!",
      location: 'Portland, OR',
      occupation: 'Marketing Coordinator',
      interests: ['Brunch', 'Farmers markets', 'Yoga', 'Travel'],
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 94,
      distance: 12
    },
    {
      id: 'demo-2', 
      name: 'Jordan',
      age: 29,
      gender: 'man',
      bio: "Software engineer by day, guitar player by night. Love cooking, craft beer, and hiking on weekends.",
      location: 'Austin, TX',
      occupation: 'Software Engineer',
      interests: ['Guitar', 'Cooking', 'Craft beer', 'Hiking'],
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 89,
      distance: 8
    },
    {
      id: 'demo-3',
      name: 'Casey',
      age: 24,
      gender: 'woman',
      bio: "Elementary school teacher who loves books, coffee shops, and weekend adventures. Always up for trying new restaurants!",
      location: 'Seattle, WA',
      occupation: 'Elementary School Teacher',
      interests: ['Reading', 'Coffee', 'Hiking', 'Restaurants'],
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 92,
      distance: 15
    },
    {
      id: 'demo-4',
      name: 'Taylor',
      age: 31,
      gender: 'woman',
      bio: "Nurse who values work-life balance. Love fitness classes, wine nights with friends, and exploring new neighborhoods.",
      location: 'Denver, CO',
      occupation: 'Registered Nurse',
      interests: ['Fitness', 'Wine tasting', 'Running', 'Movies'],
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 88,
      distance: 22
    },
    {
      id: 'demo-5',
      name: 'Morgan',
      age: 27,
      gender: 'non-binary',
      bio: "Graphic designer who loves good food and better company. Enjoy board games, concerts, and lazy Sunday mornings.",
      location: 'Asheville, NC',
      occupation: 'Graphic Designer',
      interests: ['Design', 'Board games', 'Concerts', 'Food'],
      avatar_url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 91,
      distance: 18
    },
    {
      id: 'demo-6',
      name: 'River',
      age: 25,
      gender: 'non-binary',
      bio: "Physical therapist who stays active and loves the outdoors. Looking for someone to share adventures and Netflix marathons with.",
      location: 'Santa Fe, NM',
      occupation: 'Physical Therapist',
      interests: ['Rock climbing', 'Netflix', 'Camping', 'Dogs'],
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 85,
      distance: 25
    },
    {
      id: 'demo-7',
      name: 'Sage',
      age: 28,
      gender: 'man',
      bio: "Accountant who loves weekends at the beach, trying new craft breweries, and playing volleyball with friends.",
      location: 'San Diego, CA',
      occupation: 'Accountant',
      interests: ['Beach volleyball', 'Craft beer', 'Surfing', 'BBQ'],
      avatar_url: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 93,
      distance: 14
    },
    {
      id: 'demo-8',
      name: 'Quinn',
      age: 30,
      gender: 'woman',
      bio: "High school English teacher who loves live music, farmers markets, and cozy coffee shops. Let's grab drinks and see where it goes!",
      location: 'Nashville, TN',
      occupation: 'High School Teacher',
      interests: ['Live music', 'Reading', 'Coffee', 'Museums'],
      avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 87,
      distance: 19
    },
    {
      id: 'demo-9',
      name: 'Avery',
      age: 26,
      gender: 'woman',
      bio: "Social worker passionate about making a difference. Love yoga, farmers markets, and trying new vegetarian restaurants.",
      location: 'Boulder, CO',
      occupation: 'Social Worker',
      interests: ['Yoga', 'Vegetarian food', 'Meditation', 'Volunteering'],
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b1e0b3cc?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 90,
      distance: 16
    },
    {
      id: 'demo-10',
      name: 'Rowan',
      age: 32,
      gender: 'man',
      bio: "Veterinarian who adores animals and outdoor adventures. Looking for someone who shares my love for nature and furry friends.",
      location: 'Bend, OR',
      occupation: 'Veterinarian',
      interests: ['Animals', 'Hiking', 'Photography', 'Camping'],
      avatar_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 86,
      distance: 20
    },
    {
      id: 'demo-11',
      name: 'Phoenix',
      age: 24,
      gender: 'non-binary',
      bio: "Barista and part-time artist who loves creating and exploring. Always down for gallery openings, coffee tastings, and deep conversations.",
      location: 'San Francisco, CA',
      occupation: 'Barista/Artist',
      interests: ['Art', 'Coffee', 'Galleries', 'Painting'],
      avatar_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 84,
      distance: 28
    },
    {
      id: 'demo-12',
      name: 'Ember',
      age: 29,
      gender: 'woman',
      bio: "Chef who believes food brings people together. Love experimenting in the kitchen, wine pairings, and cozy dinner parties.",
      location: 'Charleston, SC',
      occupation: 'Chef',
      interests: ['Cooking', 'Wine', 'Food photography', 'Travel'],
      avatar_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 95,
      distance: 12
    },
    {
      id: 'demo-13',
      name: 'Storm',
      age: 27,
      gender: 'man',
      bio: "Personal trainer who lives an active lifestyle. Love rock climbing, CrossFit, and helping others reach their fitness goals.",
      location: 'Salt Lake City, UT',
      occupation: 'Personal Trainer',
      interests: ['Rock climbing', 'CrossFit', 'Nutrition', 'Outdoor sports'],
      avatar_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 83,
      distance: 24
    },
    {
      id: 'demo-14',
      name: 'Luna',
      age: 25,
      gender: 'woman',
      bio: "Librarian by day, bookworm by night. Love quiet cafes, literary discussions, and discovering hidden bookstore gems.",
      location: 'Madison, WI',
      occupation: 'Librarian',
      interests: ['Reading', 'Writing', 'Book clubs', 'Tea'],
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 89,
      distance: 17
    },
    {
      id: 'demo-15',
      name: 'Ocean',
      age: 31,
      gender: 'woman',
      bio: "Marine biologist who's passionate about ocean conservation. Love scuba diving, beach cleanups, and sharing my love of the sea.",
      location: 'Monterey, CA',
      occupation: 'Marine Biologist',
      interests: ['Scuba diving', 'Conservation', 'Marine life', 'Photography'],
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 92,
      distance: 11
    }
  ];

  // Filter matches based on search criteria
  const filteredMatches = matches.filter(match => {
    const matchesSearch = searchTerm === '' || 
      match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase())) ||
      match.gender.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAge = match.age >= ageRange[0] && match.age <= ageRange[1];
    const matchesDistance = match.distance <= maxDistance;
    const matchesInterests = selectedInterests.length === 0 || 
      selectedInterests.some(interest => match.interests.includes(interest));
    
    // Gender filter logic
    const matchesGender = genderFilters.length === 0 || 
      genderFilters.includes('all') ||
      genderFilters.some(filter => {
        if (filter === 'men' && match.gender === 'man') return true;
        if (filter === 'women' && match.gender === 'woman') return true;
        if (filter === 'non-binary' && match.gender === 'non-binary') return true;
        return false;
      });
    
    return matchesSearch && matchesAge && matchesDistance && matchesInterests && matchesGender;
  });

  const currentMatch = filteredMatches[currentMatchIndex];

  const handleLike = () => {
    if (currentMatchIndex < filteredMatches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
      setViewedMatchesCount(prev => prev + 1);
    }
  };

  const handlePass = () => {
    if (currentMatchIndex < filteredMatches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
      setViewedMatchesCount(prev => prev + 1);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setAgeRange([18, 50]);
    setMaxDistance(50);
    setSelectedInterests([]);
    setCurrentMatchIndex(0);
  };

  // Get unique interests for filter options
  const allInterests = Array.from(new Set(matches.flatMap(match => match.interests)));


  if (currentMatchIndex >= filteredMatches.length || filteredMatches.length === 0) {
    return (
      <div className="min-h-screen bg-background">
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
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="p-12 text-center">
            {filteredMatches.length === 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-4">🔍 No matches just yet</h2>
                <p className="text-muted-foreground mb-6">
                  But connection isn't always instant—it's ambient, unfolding, and sometimes quiet. Try adjusting your filters, or simply return tomorrow. The right presence may be waiting just beyond today's horizon.
                </p>
                {(searchTerm || selectedInterests.length > 0) && (
                  <Button variant="outline" onClick={resetSearch} className="mb-4 w-full">
                    Clear All Filters
                  </Button>
                )}
              </>
            ) : viewedMatchesCount >= 15 ? (
              <>
                <h2 className="text-2xl font-bold mb-4">✨ You've explored 15 connections</h2>
                <p className="text-muted-foreground mb-6">
                  Ready to go deeper? Unlock unlimited matches and discover your perfect connection.
                </p>
                <Button 
                  className="mb-4 w-full bg-primary hover:bg-primary/90" 
                  onClick={() => navigate('/pricing')}
                >
                  Unlock More Matches
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">🎉 All caught up!</h2>
                <p className="text-muted-foreground mb-6">
                  You've seen all available matches. Check back later for new connections!
                </p>
              </>
            )}
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preferences Modal */}
      <Dialog open={showPreferencesModal} onOpenChange={setShowPreferencesModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Your Match Preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <SearchFilters 
              onFiltersChange={setGenderFilters}
              onUpgradePrompt={() => {}}
            />
            <Button 
              className="w-full" 
              onClick={() => setShowPreferencesModal(false)}
            >
              Start Browsing Matches
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, occupation, interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Quick Interest Filters */}
              <div>
                <h4 className="text-sm font-medium mb-2">Popular Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {['Hiking', 'Coffee', 'Travel', 'Music', 'Fitness', 'Reading'].map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        setSelectedInterests(prev => 
                          prev.includes(interest) 
                            ? prev.filter(i => i !== interest)
                            : [...prev, interest]
                        );
                        setCurrentMatchIndex(0);
                      }}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Clear Filters */}
              {(searchTerm || selectedInterests.length > 0) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetSearch}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Counter */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredMatches.length > 0 
              ? `${currentMatchIndex + 1} of ${filteredMatches.length} matches` 
              : `Found ${filteredMatches.length} matches`}
            {searchTerm && <span> for "{searchTerm}"</span>}
          </p>
        </div>

        {/* Match Card */}
        <Card className="overflow-hidden max-w-md mx-auto">
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-100">
              <img 
                src={currentMatch.avatar_url} 
                alt={currentMatch.name} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  {currentMatch.compatibility_score}% Match
                </Badge>
              </div>
              
              {/* Basic Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                <h2 className="text-2xl font-bold mb-1">
                  {currentMatch.name}, {currentMatch.age}
                </h2>
                <p className="text-sm opacity-90 mb-1">{currentMatch.occupation}</p>
                <div className="flex items-center gap-1 text-sm opacity-90">
                  <MapPin className="h-3 w-3" />
                  <span>{currentMatch.location}</span>
                  <span>• {currentMatch.distance}km away</span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentMatch.bio}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentMatch.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handlePass}
              >
                <X className="h-5 w-5 mr-2" />
                Pass
              </Button>
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" 
                onClick={handleLike}
              >
                <Heart className="h-5 w-5 mr-2" />
                Like
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Matches;
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
      // Convert preference to gender filter using correct singular forms
      const genderMap: Record<string, string[]> = {
        'men': ['man'],
        'women': ['woman'], 
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
      bio: "Just moved here for work and still figuring out the best coffee spots ☕ Love checking out farmers markets on weekends. Always down to try that new brunch place everyone's talking about!",
      location: 'Portland, OR',
      occupation: 'Marketing Coordinator',
      interests: ['Brunch', 'Coffee', 'Farmers markets', 'New restaurants', 'Work life balance'],
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 94,
      distance: 12
    },
    {
      id: 'demo-2', 
      name: 'Jordan',
      age: 29,
      gender: 'man',
      bio: "Developer who's probably coding right now lol. When I'm not staring at screens I'm usually playing guitar badly or attempting to cook something edible. Big craft beer fan 🍺",
      location: 'Austin, TX',
      occupation: 'Software Engineer',
      interests: ['Guitar', 'Coding', 'Craft beer', 'Hiking', 'Bad cooking'],
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 89,
      distance: 8
    },
    {
      id: 'demo-3',
      name: 'Casey',
      age: 24,
      gender: 'woman',
      bio: "Teacher who drinks way too much coffee and has strong opinions about children's books 📚 Love finding new hole-in-the-wall restaurants. Currently binge-watching The Office for the 5th time",
      location: 'Seattle, WA',
      occupation: 'Elementary School Teacher',
      interests: ['Reading', 'Coffee addiction', 'The Office', 'Food adventures', 'Kids books'],
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 92,
      distance: 15
    },
    {
      id: 'demo-4',
      name: 'Taylor',
      age: 31,
      gender: 'woman',
      bio: "Nurse who's seen some things 😅 Love my job but need someone to help me forget about work sometimes. Wine enthusiast and proud plant mom to 12 succulents",
      location: 'Denver, CO',
      occupation: 'Registered Nurse',
      interests: ['Wine', 'Plants', 'Fitness classes', 'True crime podcasts', 'Self care'],
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 88,
      distance: 22
    },
    {
      id: 'demo-5',
      name: 'Morgan',
      age: 27,
      gender: 'non-binary',
      bio: "Designer who thinks outside the box (literally and figuratively). I make pretty things for a living and collect weird board games. Currently obsessed with sourdough baking",
      location: 'Asheville, NC',
      occupation: 'Graphic Designer',
      interests: ['Design', 'Board games', 'Sourdough', 'Indie music', 'Thrift shopping'],
      avatar_url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 91,
      distance: 18
    },
    {
      id: 'demo-6',
      name: 'River',
      age: 25,
      gender: 'non-binary',
      bio: "PT by day, Netflix critic by night. I help people move better and then go home to not move at all 😂 Dog person looking for someone who gets my dad jokes",
      location: 'Santa Fe, NM',
      occupation: 'Physical Therapist',
      interests: ['Rock climbing', 'Netflix marathons', 'Dogs', 'Dad jokes', 'Camping'],
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 85,
      distance: 25
    },
    {
      id: 'demo-7',
      name: 'Sage',
      age: 28,
      gender: 'man',
      bio: "Numbers guy who's surprisingly fun at parties (I think?). Love beach volleyball, mediocre surfing, and finding the perfect brewery. Warning: I will judge your BBQ technique",
      location: 'San Diego, CA',
      occupation: 'Accountant',
      interests: ['Beach volleyball', 'Craft beer', 'Surfing attempts', 'BBQ', 'Spreadsheets'],
      avatar_url: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 93,
      distance: 14
    },
    {
      id: 'demo-8',
      name: 'Quinn',
      age: 30,
      gender: 'woman',
      bio: "English teacher who definitely judges your grammar but will never tell you. Music snob with a secret love for pop music. Let's get coffee and pretend we're intellectuals ☕",
      location: 'Nashville, TN',
      occupation: 'High School Teacher',
      interests: ['Live music', 'Secret pop music', 'Coffee shops', 'Book hoarding', 'Museums'],
      avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 87,
      distance: 19
    },
    {
      id: 'demo-9',
      name: 'Avery',
      age: 26,
      gender: 'woman',
      bio: "Social worker trying to save the world one case at a time. Yoga keeps me sane, farmers markets keep me fed. Looking for someone who appreciates good intentions and bad puns",
      location: 'Boulder, CO',
      occupation: 'Social Worker',
      interests: ['Yoga', 'Farmers markets', 'Meditation', 'Bad puns', 'Social justice'],
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 90,
      distance: 16
    },
    {
      id: 'demo-10',
      name: 'Rowan',
      age: 32,
      gender: 'woman',
      bio: "Vet who loves animals more than most people (sorry, not sorry). If you're afraid of dog hair on everything you own, we might not work out. Always up for hiking adventures! 🐕",
      location: 'Bend, OR',
      occupation: 'Veterinarian',
      interests: ['Animals', 'Hiking', 'Photography', 'Dog hair everywhere', 'Nature'],
      avatar_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 86,
      distance: 20
    },
    {
      id: 'demo-11',
      name: 'Phoenix',
      age: 24,
      gender: 'non-binary',
      bio: "Barista/artist who makes your coffee too strong and my art too weird. Gallery hopping is my cardio. Currently in my 'everything must be aesthetically pleasing' phase",
      location: 'San Francisco, CA',
      occupation: 'Barista/Artist',
      interests: ['Art', 'Strong coffee', 'Gallery shows', 'Aesthetic everything', 'Weird stuff'],
      avatar_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 84,
      distance: 28
    },
    {
      id: 'demo-12',
      name: 'Ember',
      age: 29,
      gender: 'woman',
      bio: "Chef who believes food is love language #1. I cook, you do dishes? 😉 Wine enthusiast and dinner party host. Fair warning: I will critique your knife skills",
      location: 'Charleston, SC',
      occupation: 'Chef',
      interests: ['Cooking', 'Wine', 'Food photography', 'Dinner parties', 'Knife skills'],
      avatar_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 95,
      distance: 12
    },
    {
      id: 'demo-13',
      name: 'Storm',
      age: 27,
      gender: 'man',
      bio: "Personal trainer who actually practices what I preach (most of the time). Rock climbing addict and nutrition nerd. Will definitely make you try weird protein smoothies",
      location: 'Salt Lake City, UT',
      occupation: 'Personal Trainer',
      interests: ['Rock climbing', 'CrossFit', 'Protein smoothies', 'Outdoor adventures', 'Nutrition'],
      avatar_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 83,
      distance: 24
    },
    {
      id: 'demo-14',
      name: 'Luna',
      age: 25,
      gender: 'woman',
      bio: "Librarian who's read every romance novel ever written (don't @ me). Tea snob and bookworm looking for my own love story. Bonus points if you like handwritten notes 💌",
      location: 'Madison, WI',
      occupation: 'Librarian',
      interests: ['Romance novels', 'Tea snobbery', 'Book clubs', 'Handwritten notes', 'Cozy vibes'],
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 89,
      distance: 17
    },
    {
      id: 'demo-15',
      name: 'Ocean',
      age: 31,
      gender: 'woman',
      bio: "Marine biologist who's basically a mermaid 🧜‍♀️ Passionate about saving the oceans and will talk your ear off about coral reefs. Scuba certified and looking for an adventure buddy!",
      location: 'Monterey, CA',
      occupation: 'Marine Biologist',
      interests: ['Scuba diving', 'Ocean conservation', 'Marine life facts', 'Beach cleanup', 'Mermaid life'],
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
    
    // Gender filter logic - match against actual profile gender values
    const matchesGender = genderFilters.length === 0 || 
      genderFilters.includes('all') ||
      genderFilters.includes(match.gender);
    
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, X, MapPin, Users } from 'lucide-react';

const Matches = () => {
  const navigate = useNavigate();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Demo matches data
  const matches = [
    {
      id: 'demo-1',
      name: 'Alex',
      age: 28,
      bio: 'Adventure seeker and coffee enthusiast. Love hiking, photography, and exploring new places.',
      location: 'San Francisco, CA',
      occupation: 'Product Designer',
      interests: ['Photography', 'Hiking', 'Coffee', 'Travel'],
      avatar_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
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
      interests: ['Music', 'Technology', 'Food', 'Art'],
      avatar_url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400',
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
      interests: ['Yoga', 'Nature', 'Meditation', 'Reading'],
      avatar_url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400',
      compatibility_score: 92,
      distance: 15
    }
  ];

  const currentMatch = matches[currentMatchIndex];

  const handleLike = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
  };

  const handlePass = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
  };

  if (currentMatchIndex >= matches.length) {
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
            <h2 className="text-2xl font-bold mb-4">🎉 All caught up!</h2>
            <p className="text-muted-foreground mb-6">
              You've seen all available matches. Check back later for new connections!
            </p>
            <Button onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        {/* Progress indicator */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            {currentMatchIndex + 1} of {matches.length} matches
          </p>
        </div>

        {/* Match Card */}
        <Card className="overflow-hidden max-w-md mx-auto">
          <div className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10">
              <img 
                src={currentMatch.avatar_url} 
                alt={currentMatch.name} 
                className="w-full h-full object-cover"
              />
              
              {/* Compatibility Score */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">
                  {currentMatch.compatibility_score}% Match
                </Badge>
              </div>
              
              {/* Basic Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
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
                className="flex-1 bg-pink-500 hover:bg-pink-600" 
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
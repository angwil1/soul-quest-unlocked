import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, X, MapPin, Users } from 'lucide-react';
import caseyProfile from '@/assets/casey-profile-realistic.jpg';
import alexProfileRealistic from '@/assets/alex-profile-realistic.jpg';
import jordanProfileRealistic from '@/assets/jordan-profile-realistic.jpg';

const Matches = () => {
  const navigate = useNavigate();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Demo matches data with more diverse profiles
  const matches = [
    {
      id: 'demo-1',
      name: 'Luna Celestine',
      age: 26,
      bio: 'I find poetry in Tuesday afternoons and magic in mundane moments. My heart speaks in metaphors, my soul dances to rainfall symphonies.',
      location: 'Portland, OR',
      occupation: 'Literary Editor & Weekend Poet',
      interests: ['Vintage bookstores', 'Rainy day photography', 'Handwritten letters', 'Vinyl collecting'],
      avatar_url: alexProfileRealistic,
      compatibility_score: 94,
      distance: 12
    },
    {
      id: 'demo-2', 
      name: 'River Ashford',
      age: 29,
      bio: 'I speak fluent sunrise and find God in guitar strings. Building bridges between broken hearts and forgotten dreams.',
      location: 'Austin, TX',
      occupation: 'Music Therapist & Session Musician',
      interests: ['Therapy research', 'Open mic nights', 'Emotional archaeology', 'Sacred activism'],
      avatar_url: jordanProfileRealistic,
      compatibility_score: 89,
      distance: 8
    },
    {
      id: 'demo-3',
      name: 'Sage Wildwater',
      age: 24,
      bio: 'Forest child with city dreams. I collect stories like seashells and believe in love letters written on napkins.',
      location: 'Seattle, WA',
      occupation: 'Environmental Artist & Weekend Barista',
      interests: ['Forest bathing', 'Climate art', 'Pressed flower journals', 'Thrift store treasures'],
      avatar_url: caseyProfile,
      compatibility_score: 92,
      distance: 15
    },
    {
      id: 'demo-4',
      name: 'Phoenix Merritt',
      age: 31,
      bio: 'Reformed people-pleaser learning to love my own voice. I write thank-you notes to my mistakes and paint with my tears.',
      location: 'Denver, CO',
      occupation: 'Trauma-Informed Life Coach',
      interests: ['Boundary setting', 'Expressive art therapy', 'Mountain meditation', 'Conscious communication'],
      avatar_url: alexProfileRealistic,
      compatibility_score: 88,
      distance: 22
    },
    {
      id: 'demo-5',
      name: 'Atlas Driftwood',
      age: 27,
      bio: 'Professional question-asker, amateur philosopher. I find God in good coffee and deep conversations.',
      location: 'Asheville, NC',
      occupation: 'Podcast Producer & Weekend Farmer',
      interests: ['Slow living', 'Philosophy podcasts', 'Sourdough bread', 'Stargazing'],
      avatar_url: jordanProfileRealistic,
      compatibility_score: 91,
      distance: 18
    },
    {
      id: 'demo-6',
      name: 'Iris Moonchild',
      age: 25,
      bio: 'Cosmic romantic with earthbound dreams. I read tarot for my houseplants and believe in love that feels like magic.',
      location: 'Santa Fe, NM',
      occupation: 'Holistic Wellness Practitioner',
      interests: ['Crystal healing', 'Moon rituals', 'Herbal medicine', 'Sacred geometry'],
      avatar_url: caseyProfile,
      compatibility_score: 85,
      distance: 25
    },
    {
      id: 'demo-7',
      name: 'Ocean Clearwater',
      age: 28,
      bio: 'Salt-water soul with wanderlust bones. I collect sunrise photos and believe in love letters written in the sand.',
      location: 'San Diego, CA',
      occupation: 'Marine Conservation Photographer',
      interests: ['Ocean conservation', 'Surf photography', 'Beach cleanups', 'Whale watching'],
      avatar_url: alexProfileRealistic,
      compatibility_score: 93,
      distance: 14
    },
    {
      id: 'demo-8',
      name: 'Ember Nightingale',
      age: 30,
      bio: 'Midnight poet with morning coffee rituals. I write love songs for broken hearts and find beauty in the spaces between words.',
      location: 'Nashville, TN',
      occupation: 'Singer-Songwriter & Creative Writing Teacher',
      interests: ['Songwriting', 'Poetry slams', 'Vintage vinyl', 'Late night coffee shops'],
      avatar_url: caseyProfile,
      compatibility_score: 87,
      distance: 19
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
              
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
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
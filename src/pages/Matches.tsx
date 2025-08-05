import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, X, MapPin, Users } from 'lucide-react';
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
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Demo matches data with everyday people
  const matches = [
    {
      id: 'demo-1',
      name: 'Alex',
      age: 26,
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
      bio: "Elementary school teacher who loves books, coffee shops, and weekend adventures. Always up for trying new restaurants!",
      location: 'Seattle, WA',
      occupation: 'Elementary School Teacher',
      interests: ['Reading', 'Coffee', 'Hiking', 'Restaurants'],
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 92,
      distance: 15
    },
    {
      id: 'demo-4',
      name: 'Alex',
      age: 31,
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
      name: 'Jordan',
      age: 27,
      bio: "Graphic designer who loves good food and better company. Enjoy board games, concerts, and lazy Sunday mornings.",
      location: 'Asheville, NC',
      occupation: 'Graphic Designer',
      interests: ['Design', 'Board games', 'Concerts', 'Food'],
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 91,
      distance: 18
    },
    {
      id: 'demo-6',
      name: 'Casey',
      age: 25,
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
      name: 'Alex',
      age: 28,
      bio: "Accountant who loves weekends at the beach, trying new craft breweries, and playing volleyball with friends.",
      location: 'San Diego, CA',
      occupation: 'Accountant',
      interests: ['Beach volleyball', 'Craft beer', 'Surfing', 'BBQ'],
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      compatibility_score: 93,
      distance: 14
    },
    {
      id: 'demo-8',
      name: 'Alex',
      age: 30,
      bio: "High school English teacher who loves live music, farmers markets, and cozy coffee shops. Let's grab drinks and see where it goes!",
      location: 'Nashville, TN',
      occupation: 'High School Teacher',
      interests: ['Live music', 'Reading', 'Coffee', 'Museums'],
      avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
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
            <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10">
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
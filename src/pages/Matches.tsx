import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import { Heart, Settings, MapPin, Briefcase, Sparkles, ArrowLeft, Search, Users2, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/auth');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Mock data for user's matches
  const userMatches = [
    {
      id: 'sample-5',
      name: 'Sage',
      age: 29,
      bio: 'Making documentaries about stuff I find interesting.',
      vibeTag: 'Storyteller',
      location: 'Hartford, CT',
      occupation: 'Filmmaker',
      photo: '/src/assets/sage-natural-background.jpg',
      matchScore: 94,
      isNewMatch: true,
      matchedAt: '2 hours ago',
      lastActive: 'Active now'
    },
    {
      id: 'sample-7', 
      name: 'Dev',
      age: 28,
      bio: 'Code by day, cricket by weekend.',
      vibeTag: 'Cultural Bridge',
      location: 'Stamford, CT',
      occupation: 'Software Engineer',
      photo: '/src/assets/dev-realistic-new.jpg',
      matchScore: 89,
      isNewMatch: false,
      matchedAt: '1 day ago',
      lastActive: '2 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <header className="bg-card border-b" role="banner">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2 self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/search')}
                className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto justify-center"
              >
                <Search className="h-4 w-4" />
                Find More Matches
              </Button>
              
              <Button 
                onClick={() => navigate('/profile/edit')}
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto justify-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Your Matches
          </h1>
          <p className="text-muted-foreground">
            People who liked you back and your saved connections
          </p>
        </section>

        {userMatches.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
              <p className="text-muted-foreground mb-6">
                Start browsing profiles to find your perfect match
              </p>
              <Button onClick={() => navigate('/search')}>
                <Search className="h-4 w-4 mr-2" />
                Start Searching
              </Button>
            </CardContent>
          </Card>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Matches</h2>
              <Badge variant="secondary">
                {userMatches.length} {userMatches.length === 1 ? 'match' : 'matches'}
              </Badge>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userMatches.map((match) => (
                <Card 
                  key={match.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/sample-user-profile/${match.id}`)}
                >
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Avatar className="w-full h-full rounded-lg">
                        <AvatarImage 
                          src={match.photo} 
                          alt={`${match.name}'s profile photo`}
                          className="object-cover"
                        />
                        <AvatarFallback className="w-full h-full rounded-lg text-lg">
                          {match.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {match.isNewMatch && (
                      <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">
                        New Match!
                      </Badge>
                    )}
                    
                    <Badge 
                      className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5"
                    >
                      <Sparkles className="h-2 w-2 mr-1" />
                      {match.matchScore}%
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        {match.name}, {match.age}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {match.vibeTag}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{match.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{match.occupation}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {match.bio}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Matched {match.matchedAt}</span>
                      <span>{match.lastActive}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/messages');
                        }}
                      >
                        Message
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sample-user-profile/${match.id}`);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Matches;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import { Heart, Settings, MapPin, Briefcase, Sparkles, ArrowLeft, Search, Users2, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAIMatching } from '@/hooks/useAIMatching';

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches, loading, error, generateAIMatches } = useAIMatching();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/auth');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  useEffect(() => {
    if (user && matches.length === 0 && !loading && !error) {
      generateAIMatches();
    }
  }, [user, matches.length, loading, error]); // Removed generateAIMatches from dependencies

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

        {loading ? (
          <Card className="text-center py-12">
            <CardContent>
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Generating AI Matches</h3>
              <p className="text-muted-foreground">
                Analyzing your quiz results to find compatible matches...
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Matches</h3>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              <Button onClick={() => generateAIMatches()}>
                <Sparkles className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : matches.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
              <p className="text-muted-foreground mb-6">
                Start browsing profiles to find your perfect match
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => generateAIMatches()}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Matches
                </Button>
                <Button variant="outline" onClick={() => navigate('/search')}>
                  <Search className="h-4 w-4 mr-2" />
                  Browse Profiles
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">AI-Generated Matches</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => generateAIMatches()}
                  disabled={loading}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Refresh Matches
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <Card 
                  key={match.profile.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/sample-user-profile/${match.profile.id}`)}
                >
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Avatar className="w-full h-full rounded-lg">
                        <AvatarImage 
                          src={match.profile.avatar_url || match.profile.photos?.[0]} 
                          alt={`${match.profile.name}'s profile photo`}
                          className="object-cover"
                        />
                        <AvatarFallback className="w-full h-full rounded-lg text-lg">
                          {match.profile.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">
                      AI Match!
                    </Badge>
                    
                    <Badge 
                      className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5"
                    >
                      <Sparkles className="h-2 w-2 mr-1" />
                      {Math.round(match.compatibility_score)}%
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        {match.profile.name?.split(' ')[0]}, {match.profile.age}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        AI Matched
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{match.profile.location || 'Location not set'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{match.profile.occupation || 'Occupation not set'}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {match.explanation}
                    </p>
                    
                    {match.shared_interests?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {match.shared_interests.slice(0, 3).map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
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
                          navigate(`/sample-user-profile/${match.profile.id}`);
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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import { Heart, Settings, MapPin, Briefcase, Sparkles, ArrowLeft, Users } from 'lucide-react';
import { founderCuratedProfiles } from '@/data/sampleProfiles';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    // Only redirect to auth if we're sure there's no user and not just loading
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/auth');
      }
    }, 1000); // Give 1 second for auth state to settle

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleLike = (profileId: string) => {
    setLikedProfiles(prev => new Set([...prev, profileId]));
  };

  const calculateMatchScore = () => Math.floor(Math.random() * 20) + 80; // 80-99% match

  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      {/* Header with Back Button and Actions */}
      <header className="bg-card border-b" role="banner">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Go back to homepage"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/browse-profiles')}
              className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Browse sample profiles to see examples"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Browse Profiles
            </Button>
            <Button 
              onClick={() => navigate('/profile/edit')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Open profile settings to edit your information"
            >
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              Profile Settings
            </Button>
          </div>
        </div>
      </header>
      
      <main 
        id="main-content" 
        className="max-w-4xl mx-auto px-4 py-8"
        role="main"
        aria-labelledby="matches-heading"
      >
        {/* Header */}
        <section className="mb-8">
          <div>
            <h1 id="matches-heading" className="text-3xl font-bold">Your Matches</h1>
            <p className="text-muted-foreground">
              Discover compatible people through AI-powered matching
            </p>
          </div>
        </section>

        {/* Matches Grid */}
        <section 
          className="grid gap-6 md:grid-cols-2" 
          aria-labelledby="matches-grid-title"
          role="region"
        >
          <h2 id="matches-grid-title" className="sr-only">Available Matches</h2>
          
          {founderCuratedProfiles.slice(0, 6).map((profile) => {
            const matchScore = calculateMatchScore();
            const isLiked = likedProfiles.has(profile.id);
            
            return (
              <Card 
                key={profile.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                tabIndex={0}
                role="article"
                aria-labelledby={`profile-name-${profile.id}`}
                aria-describedby={`profile-info-${profile.id}`}
              >
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage 
                        src={profile.photos[0]} 
                        alt={`${profile.name}'s profile photo - ${profile.vibeTag} vibe`}
                        className="object-cover blur-sm hover:blur-none transition-all duration-500"
                      />
                      <AvatarFallback className="w-full h-full rounded-none text-4xl">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Badge 
                    className="absolute top-3 right-3 bg-primary text-primary-foreground"
                    aria-label={`${matchScore} percent compatibility match`}
                  >
                    <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
                    {matchScore}% Match
                  </Badge>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle 
                      id={`profile-name-${profile.id}`}
                      className="text-xl"
                    >
                      {profile.name}, {profile.age}
                    </CardTitle>
                    <Badge 
                      variant="outline"
                      aria-label={`${profile.vibeTag} personality vibe`}
                    >
                      {profile.vibeTag}
                    </Badge>
                  </div>
                  <div 
                    id={`profile-info-${profile.id}`}
                    className="space-y-1 text-sm text-muted-foreground"
                    role="group"
                    aria-label="Profile details"
                  >
                    <div className="flex items-center gap-1" role="group" aria-label="Location">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-1" role="group" aria-label="Occupation">
                      <Briefcase className="h-3 w-3" aria-hidden="true" />
                      <span>{profile.occupation}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p 
                    className="text-sm text-muted-foreground line-clamp-3 mb-4"
                    aria-label={`Biography: ${profile.bio}`}
                  >
                    {profile.bio}
                  </p>
                  
                  <div 
                    className="flex gap-2 mb-4"
                    role="group"
                    aria-label={`Interests: ${profile.interests.slice(0, 3).join(', ')}`}
                  >
                    {profile.interests.slice(0, 3).map((interest) => (
                      <Badge 
                        key={interest} 
                        variant="secondary" 
                        className="text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        tabIndex={0}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2" role="group" aria-label="Profile actions">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => navigate(`/sample-user-profile/${profile.id}`)}
                      aria-label={`View full profile for ${profile.name}`}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => handleLike(profile.id)}
                      disabled={isLiked}
                      aria-label={isLiked ? `Already liked ${profile.name}` : `Like ${profile.name}'s profile`}
                    >
                      <Heart 
                        className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} 
                        aria-hidden="true"
                      />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Load More */}
        <section className="text-center mt-8" role="region" aria-labelledby="load-more-section">
          <h2 id="load-more-section" className="sr-only">Load More Matches</h2>
          <Button 
            variant="outline"
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Discover more compatible matches"
          >
            Discover More Matches
          </Button>
        </section>

        {/* Accessibility Information */}
        <section className="mt-16 p-6 bg-muted/50 rounded-lg" aria-labelledby="accessibility-info">
          <h2 id="accessibility-info" className="text-xl font-semibold mb-3 text-foreground">
            Accessibility Features
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            This matches page is fully accessible with screen reader support, keyboard navigation, and proper labeling for all profile information.
          </p>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Navigation:</span>
              <span>Use Tab to browse matches, Enter/Space to interact with buttons</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Profile Cards:</span>
              <span>Each match includes comprehensive information about compatibility, location, and interests</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Images:</span>
              <span>All profile photos have descriptive alternative text including personality vibes</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Matches;
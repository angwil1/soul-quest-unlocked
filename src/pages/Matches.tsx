import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import { Heart, Settings, MapPin, Briefcase, Sparkles } from 'lucide-react';
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
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Matches</h1>
            <p className="text-muted-foreground">
              Discover compatible people through AI-powered matching
            </p>
          </div>
          <Button onClick={() => navigate('/profile/edit')}>
            <Settings className="h-4 w-4 mr-2" />
            Profile Settings
          </Button>
        </div>

        {/* Matches Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {founderCuratedProfiles.slice(0, 6).map((profile) => {
            const matchScore = calculateMatchScore();
            const isLiked = likedProfiles.has(profile.id);
            
            return (
              <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage 
                        src={profile.photos[0]} 
                        alt={profile.name}
                        className="object-cover blur-sm hover:blur-none transition-all duration-500"
                      />
                      <AvatarFallback className="w-full h-full rounded-none text-4xl">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Badge 
                    className="absolute top-3 right-3 bg-primary text-primary-foreground"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {matchScore}% Match
                  </Badge>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      {profile.name}, {profile.age}
                    </CardTitle>
                    <Badge variant="outline">{profile.vibeTag}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {profile.occupation}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {profile.bio}
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    {profile.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/sample-user-profile/${profile.id}`)}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleLike(profile.id)}
                      disabled={isLiked}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">
            Discover More Matches
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Matches;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { founderCuratedProfiles } from '@/data/sampleProfiles';

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());

  const handleLike = (profileId: string) => {
    setLikedProfiles(prev => new Set([...prev, profileId]));
  };

  const calculateMatchScore = () => Math.floor(Math.random() * 20) + 80; // 80-99% match

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Browse Sample Profiles</h1>
            <p className="text-sm text-muted-foreground">
              Explore sample profiles to see what's possible
            </p>
          </div>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profiles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {founderCuratedProfiles.map((profile) => {
            const matchScore = calculateMatchScore();
            const isLiked = likedProfiles.has(profile.id);
            
            return (
              <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage 
                        src={profile.photos[0]} 
                        alt={profile.name}
                        className="object-cover blur-sm"
                      />
                      <AvatarFallback className="w-full h-full rounded-none text-4xl">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {/* Soft blur overlay */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                  {/* Bottom shadow for text readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge 
                    className="absolute top-3 right-3 bg-primary text-primary-foreground"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {matchScore}% Match
                  </Badge>
                  <Badge 
                    className="absolute top-3 left-3 bg-purple-600 text-white"
                  >
                    Sample Profile
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
                      View Full Profile
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

        {/* Additional Info */}
        <div className="text-center mt-12 space-y-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">These are Sample Profiles</h3>
            <p className="text-sm text-muted-foreground">
              These profiles are created to demonstrate the platform's features and inspire your own profile creation. 
              They are not real users.
            </p>
          </div>
          <Button onClick={() => navigate('/profile/edit')} size="lg">
            Create Your Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrowseProfiles;
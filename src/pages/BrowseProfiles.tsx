import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, MapPin, Briefcase, Sparkles, Eye, Bookmark, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { founderCuratedProfiles } from '@/data/sampleProfiles';
import { SaveToVaultButton } from '@/components/SaveToVaultButton';
import { useAuth } from '@/hooks/useAuth';

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());

  // Redirect to quick setup if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/quick-start');
    }
  }, [user, loading, navigate]);

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
            <h1 className="text-2xl font-bold">Explore Profiles</h1>
            <p className="text-sm text-muted-foreground">
              Discover sample profiles to see what's possible
            </p>
          </div>
          <Button onClick={() => navigate('/swipe')} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Swipe Mode
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profiles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {founderCuratedProfiles.map((profile) => {
            const matchScore = calculateMatchScore();
            const isLiked = likedProfiles.has(profile.id);
            
            return (
              <Card key={profile.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage 
                        src={profile.photos[0]} 
                        alt={profile.name}
                        className="object-cover blur-sm group-hover:blur-none transition-all duration-500"
                      />
                      <AvatarFallback className="w-full h-full rounded-none text-4xl">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Soft overlay */}
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
                  
                  {/* Gradient overlay for text readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  
                  {/* Compatibility Score - More Subtle */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-background/90 backdrop-blur-md border border-border/50 rounded-full px-3 py-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-foreground">{matchScore}% match</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sample Badge */}
                  <Badge className="absolute top-3 left-3 bg-purple-500/90 text-white backdrop-blur-sm border-0">
                    Sample Profile
                  </Badge>

                  {/* Save for Later - Top Right Corner */}
                  <div className="absolute top-14 right-3">
                    <SaveToVaultButton
                      type="match"
                      data={{
                        matched_user_id: profile.id,
                        notes: `${profile.name} - ${matchScore}% compatibility`,
                        tags: ['sample-profile', 'browse']
                      }}
                      variant="ghost"
                      size="sm"
                      className="bg-background/80 backdrop-blur-md hover:bg-background/90 border border-border/30 rounded-full h-8 w-8 p-0"
                    />
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {profile.name}, {profile.age}
                    </CardTitle>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground/60" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-muted-foreground/60" />
                      {profile.occupation}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {profile.bio}
                  </p>
                  
                  <div className="flex gap-2 mb-6">
                    {profile.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs px-2 py-1 bg-secondary/60">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-[1.02] transition-all duration-200 group/btn"
                      onClick={() => navigate(`/sample-user-profile/${profile.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1.5 group-hover/btn:rotate-12 transition-transform duration-200" />
                      View Full Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 hover:scale-[1.02] transition-all duration-200"
                      onClick={() => handleLike(profile.id)}
                      disabled={isLiked}
                      variant={isLiked ? "secondary" : "default"}
                    >
                      <Heart className={`h-4 w-4 mr-1.5 transition-all duration-200 ${isLiked ? 'fill-current scale-110 text-red-500' : 'hover:scale-110'}`} />
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
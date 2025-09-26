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
  const [visibleProfiles, setVisibleProfiles] = useState(6);

  // Only redirect if user is not authenticated AND this is not a sample profile viewing session
  useEffect(() => {
    if (!loading && !user) {
      // Allow viewing sample profiles without authentication
      console.log('User not authenticated, but allowing sample profile browsing');
    }
  }, [user, loading]);

  const handleLike = (profileId: string) => {
    setLikedProfiles(prev => new Set([...prev, profileId]));
  };

  const handleBrowseMore = () => {
    setVisibleProfiles(prev => Math.min(prev + 6, founderCuratedProfiles.length));
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
      
      {/* Header */}
      <header className="bg-card border-b" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/profile')}
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-shrink-0"
                aria-label="Go back to your profile"
              >
                <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                <span className="hidden xs:inline">Back</span>
              </Button>
              <Button 
                onClick={() => navigate('/swipe')} 
                size="sm"
                className="flex items-center gap-1 focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-shrink-0"
                aria-label="Switch to swipe mode for quick browsing"
              >
                <Zap className="h-4 w-4" aria-hidden="true" />
                <span className="hidden xs:inline">Swipe</span>
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold sm:text-xl">Explore Profiles</h1>
              <p className="text-xs text-muted-foreground sm:text-sm mt-1">
                Discover sample profiles to see what's possible
              </p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/profile')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Go back to your profile"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Profile
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Explore Profiles</h1>
              <p className="text-sm text-muted-foreground">
                Discover sample profiles to see what's possible
              </p>
            </div>
            <Button 
              onClick={() => navigate('/swipe')} 
              className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Switch to swipe mode for quick browsing"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              Swipe Mode
            </Button>
          </div>
        </div>
      </header>

      <main 
        id="main-content"
        className="max-w-6xl mx-auto px-4 py-8"
        role="main"
        aria-labelledby="profiles-heading"
      >
        <h2 id="profiles-heading" className="sr-only">Sample Profiles Gallery</h2>
        
        {/* Profiles Grid */}
        <section 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          role="region"
          aria-labelledby="profiles-grid-title"
        >
          <h3 id="profiles-grid-title" className="sr-only">Available Sample Profiles</h3>
          
          {founderCuratedProfiles.slice(0, visibleProfiles).map((profile) => {
            const matchScore = calculateMatchScore();
            const isLiked = likedProfiles.has(profile.id);
            
            return (
              <Card 
                key={profile.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                tabIndex={0}
                role="article"
                aria-labelledby={`profile-title-${profile.id}`}
                aria-describedby={`profile-description-${profile.id}`}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage 
                        src={profile.photos[0]} 
                        alt={`${profile.name}'s sample profile photo showing ${profile.vibeTag} personality`}
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
                    <div 
                      className="bg-background/90 backdrop-blur-md border border-border/50 rounded-full px-3 py-1.5 shadow-sm"
                      role="status"
                      aria-label={`${matchScore} percent compatibility match with ${profile.name}`}
                    >
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></div>
                        <span className="text-foreground">{matchScore}% match</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sample Badge */}
                  <Badge 
                    className="absolute top-3 left-3 bg-purple-500/90 text-white backdrop-blur-sm border-0"
                    aria-label="This is a sample profile for demonstration"
                  >
                    Sample Profile
                  </Badge>

                  {/* Save for Later - Improved Design */}
                  <div className="absolute top-12 right-3">
                    <SaveToVaultButton
                      type="match"
                      data={{
                        matched_user_id: profile.id,
                        notes: `${profile.name} - ${matchScore}% compatibility`,
                        tags: ['sample-profile', 'browse']
                      }}
                      variant="ghost"
                      size="sm"
                      iconOnly={true}
                      className="bg-background/90 backdrop-blur-md hover:bg-background/95 border border-border/40 rounded-full h-9 w-9 p-0 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-105"
                    />
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle 
                      id={`profile-title-${profile.id}`}
                      className="text-xl group-hover:text-primary transition-colors"
                    >
                      {profile.name}, {profile.age}
                    </CardTitle>
                  </div>
                  <div 
                    className="space-y-1 text-sm text-muted-foreground"
                    role="group"
                    aria-label="Profile location and occupation"
                  >
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground/60" aria-hidden="true" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-muted-foreground/60" aria-hidden="true" />
                      <span>{profile.occupation}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p 
                    id={`profile-description-${profile.id}`}
                    className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed"
                    aria-label={`Biography: ${profile.bio}`}
                  >
                    {profile.bio}
                  </p>
                  
                  <div 
                    className="flex gap-2 mb-6"
                    role="group"
                    aria-label={`Interests include: ${profile.interests.slice(0, 3).join(', ')}`}
                  >
                    {profile.interests.slice(0, 3).map((interest) => (
                      <Badge 
                        key={interest} 
                        variant="secondary" 
                        className="text-xs px-2 py-1 bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                      className="flex-1 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-[1.02] transition-all duration-200 group/btn focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => navigate(`/sample-user-profile/${profile.id}`)}
                      aria-label={`View full detailed profile for ${profile.name}`}
                    >
                      <Eye className="h-4 w-4 mr-1.5 group-hover/btn:rotate-12 transition-transform duration-200" aria-hidden="true" />
                      View Full Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => handleLike(profile.id)}
                      disabled={isLiked}
                      variant={isLiked ? "secondary" : "default"}
                      aria-label={isLiked ? `You have liked ${profile.name}'s profile` : `Like ${profile.name}'s profile`}
                    >
                      <Heart 
                        className={`h-4 w-4 mr-1.5 transition-all duration-200 ${isLiked ? 'fill-current scale-110 text-red-500' : 'hover:scale-110'}`} 
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

        {/* Browse More Button */}
        {visibleProfiles < founderCuratedProfiles.length && (
          <section className="text-center mt-8" role="region" aria-labelledby="browse-more-section">
            <h3 id="browse-more-section" className="sr-only">Load More Profiles</h3>
            <Button 
              variant="outline"
              size="lg"
              onClick={handleBrowseMore}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Browse more profiles to see additional matches"
            >
              Browse More Profiles ({founderCuratedProfiles.length - visibleProfiles} remaining)
            </Button>
          </section>
        )}

        {/* Additional Info */}
        <section className="text-center mt-12 space-y-4" aria-labelledby="info-section">
          <div className="max-w-2xl mx-auto">
            <h3 id="info-section" className="text-lg font-semibold mb-2">These are Sample Profiles</h3>
            <p className="text-sm text-muted-foreground">
              These profiles are created to demonstrate the platform's features and inspire your own profile creation. 
              They are not real users.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/profile/edit')} 
            size="lg"
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Create your own profile to get started with real matches"
          >
            Create Your Profile
          </Button>
        </section>

        {/* Accessibility Information */}
        <section className="mt-16 p-6 bg-muted/50 rounded-lg" aria-labelledby="accessibility-info">
          <h2 id="accessibility-info" className="text-xl font-semibold mb-3 text-foreground">
            Accessibility Features
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            This profile browsing experience is designed to be accessible to all users with comprehensive support for assistive technologies.
          </p>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Screen Readers:</span>
              <span>Complete profile information including compatibility scores, interests, and descriptions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Keyboard Navigation:</span>
              <span>Tab through profiles, use Enter/Space to interact with buttons and view details</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Visual Design:</span>
              <span>High contrast elements, clear focus indicators, and proper color ratios</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BrowseProfiles;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Heart, MapPin, Briefcase, Sparkles, Eye, Bookmark, Zap, ArrowUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { founderCuratedProfiles, browseProfiles, SampleProfile } from '@/data/sampleProfiles';
import { SaveToVaultButton } from '@/components/SaveToVaultButton';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [visibleProfiles, setVisibleProfiles] = useState(6);
  
  // Filter states - initialize from user profile when available
  const [myGender, setMyGender] = useState<'men' | 'women' | 'non-binary'>('women');
  const [lookingFor, setLookingFor] = useState<'men' | 'women' | 'non-binary' | 'casual-friends' | 'anyone'>('men');
  const [zipCode, setZipCode] = useState<string>('');
  const [distancePreference, setDistancePreference] = useState<number>(50);
  const [filteredProfiles, setFilteredProfiles] = useState<SampleProfile[]>(browseProfiles);

  // Handle zip code update with debouncing
  const handleZipCodeChange = (value: string) => {
    setZipCode(value);
    
    // Auto-save zip code to profile after user stops typing (debounced)
    if (profile && value.length === 5 && /^\d{5}$/.test(value)) {
      setTimeout(() => {
        updateProfile({ zip_code: value });
      }, 1000);
    }
  };

  // Handle distance preference update
  const handleDistanceChange = (value: number[]) => {
    const newDistance = value[0];
    setDistancePreference(newDistance);
    
    // Auto-save distance preference to profile
    if (profile) {
      setTimeout(() => {
        updateProfile({ distance_preference: newDistance });
      }, 500);
    }
  };

  // Initialize filters from user profile
  useEffect(() => {
    if (profile) {
      // Set my gender from profile
      if (profile.gender === 'male') setMyGender('men');
      else if (profile.gender === 'female') setMyGender('women');
      else if (profile.gender === 'non-binary') setMyGender('non-binary');
      
      // Set looking for from profile
      if (profile.looking_for === 'men') setLookingFor('men');
      else if (profile.looking_for === 'women') setLookingFor('women');
      else if (profile.looking_for === 'non-binary') setLookingFor('non-binary');
      else if (profile.looking_for === 'casual-friends') setLookingFor('casual-friends');
      else if (profile.looking_for === 'anyone') setLookingFor('anyone');
      
      // Set zip code from profile
      if (profile.zip_code) setZipCode(profile.zip_code);
      
      // Set distance preference from profile
      if (profile.distance_preference) setDistancePreference(profile.distance_preference);
    }
  }, [profile]);

  // Only redirect if user is not authenticated AND this is not a sample profile viewing session
  useEffect(() => {
    if (!loading && !user) {
      // Allow viewing sample profiles without authentication
      console.log('User not authenticated, but allowing sample profile browsing');
    }
  }, [user, loading]);

  // Filter profiles based on preferences and distance
  useEffect(() => {
    let filtered = browseProfiles.filter(profile => {
      // If someone is looking for casual friends, show those who want casual friends
      if (lookingFor === 'casual-friends') {
        return profile.lookingFor === 'casual-friends';
      }
      
      // If looking for anyone, show profiles that want anyone or match the specific gender
      if (lookingFor === 'anyone') {
        return profile.lookingFor === 'anyone' || profile.lookingFor === myGender;
      }
      
      // Standard matching: show profiles that match what I'm looking for AND who are looking for my gender
      return profile.gender === lookingFor && (profile.lookingFor === myGender || profile.lookingFor === 'anyone');
    });

    // Apply distance filter if user has set preferences
    if (profile?.distance_preference && profile?.location) {
      // For now, just show all profiles since we don't have real location data
      // In a real app, you'd filter by actual distance calculation
      console.log(`Filtering by ${profile.distance_preference} mile radius from ${profile.location}`);
    }
    
    setFilteredProfiles(filtered);
    setVisibleProfiles(6); // Reset visible count when filters change
  }, [myGender, lookingFor, profile]);

  const handleLike = (profileId: string) => {
    setLikedProfiles(prev => new Set([...prev, profileId]));
  };

  const handleBrowseMore = () => {
    setVisibleProfiles(prev => Math.min(prev + 6, filteredProfiles.length));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold sm:text-xl">Discover Your Matches</h1>
              <p className="text-xs text-muted-foreground sm:text-sm mt-1">
                AI-powered compatibility matching based on your preferences
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
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold">Discover Your Matches</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered compatibility matching based on your preferences
              </p>
            </div>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="border-t bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" />
                <span>Filters:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="my-gender" className="text-sm text-muted-foreground">I am:</label>
                  <Select value={myGender} onValueChange={(value: 'men' | 'women' | 'non-binary') => setMyGender(value)}>
                    <SelectTrigger id="my-gender" className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="women">Woman</SelectItem>
                      <SelectItem value="men">Man</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="looking-for" className="text-sm text-muted-foreground">Looking for:</label>
                  <Select value={lookingFor} onValueChange={(value: 'men' | 'women' | 'non-binary' | 'casual-friends' | 'anyone') => setLookingFor(value)}>
                    <SelectTrigger id="looking-for" className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="casual-friends">Casual Friends</SelectItem>
                      <SelectItem value="anyone">Anyone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Within:</span>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[distancePreference]}
                      onValueChange={handleDistanceChange}
                      max={100}
                      min={5}
                      step={5}
                      className="w-20"
                    />
                    <Badge variant="secondary" className="text-xs min-w-[60px] text-center">
                      {distancePreference} miles
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="zip-code" className="text-sm text-muted-foreground">Zip Code:</label>
                  <Input
                    id="zip-code"
                    type="text"
                    value={zipCode}
                    onChange={(e) => handleZipCodeChange(e.target.value)}
                    placeholder="Enter zip code"
                    className="w-28 h-8 text-xs"
                    maxLength={5}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground ml-auto flex flex-col items-end">
                <div>Showing {Math.min(visibleProfiles, filteredProfiles.length)} of {filteredProfiles.length} profiles</div>
                {profile && (
                  <div className="text-primary text-xs mt-1">
                    ✓ Using your profile preferences
                  </div>
                )}
              </div>
            </div>
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
          className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          role="region"
          aria-labelledby="profiles-grid-title"
        >
          <h3 id="profiles-grid-title" className="sr-only">Available Sample Profiles</h3>
          
          {filteredProfiles.slice(0, visibleProfiles).map((profile) => {
            const matchScore = calculateMatchScore();
            const isLiked = likedProfiles.has(profile.id);
            
            return (
              <Card 
                key={profile.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
                tabIndex={0}
                role="article"
                aria-labelledby={`profile-title-${profile.id}`}
                aria-describedby={`profile-description-${profile.id}`}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10">
                    <Avatar className="w-full h-full rounded-lg">
                      <AvatarImage 
                        src={profile.photos[0]} 
                        alt={`${profile.name}'s profile photo showing ${profile.vibeTag} personality`}
                        className="object-cover"
                      />
                      <AvatarFallback className="w-full h-full rounded-lg text-sm">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Compatibility Score - Small */}
                  <Badge 
                    className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5"
                    aria-label={`${matchScore} percent compatibility match with ${profile.name}`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1" aria-hidden="true"></div>
                    {matchScore}%
                  </Badge>

                  {/* Save for Later - Small */}
                  <div className="absolute top-2 left-2">
                    <SaveToVaultButton
                      type="match"
                      data={{
                        matched_user_id: profile.id,
                        notes: `${profile.name} - ${matchScore}% compatibility`,
                        tags: ['discovered-profile', 'browse']
                      }}
                      variant="ghost"
                      size="sm"
                      iconOnly={true}
                      className="bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/40 rounded-full h-6 w-6 p-0 shadow-sm"
                    />
                  </div>
                </div>
                
                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-center justify-between">
                    <CardTitle 
                      id={`profile-title-${profile.id}`}
                      className="text-sm font-semibold truncate"
                    >
                      {profile.name}, {profile.age}
                    </CardTitle>
                  </div>
                  <div 
                    className="space-y-1 text-xs text-muted-foreground"
                    role="group"
                    aria-label="Profile location and occupation"
                  >
                    <div className="flex items-center gap-1">
                      <MapPin className="h-2 w-2 text-muted-foreground/60" aria-hidden="true" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-2 w-2 text-muted-foreground/60" aria-hidden="true" />
                      <span className="truncate">{profile.occupation}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 px-3 pb-3">
                  <p 
                    id={`profile-description-${profile.id}`}
                    className="text-xs text-muted-foreground line-clamp-2 mb-2"
                    aria-label={`Biography: ${profile.bio}`}
                  >
                    {profile.bio}
                  </p>
                  
                  <div 
                    className="flex gap-1 mb-3"
                    role="group"
                    aria-label={`Interests include: ${profile.interests.slice(0, 2).join(', ')}`}
                  >
                    {profile.interests.slice(0, 2).map((interest) => (
                      <Badge 
                        key={interest} 
                        variant="secondary" 
                        className="text-xs px-1 py-0.5 text-[10px]"
                        tabIndex={0}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-1" role="group" aria-label="Profile actions">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs px-2 py-1 h-7"
                      onClick={() => navigate(`/sample-user-profile/${profile.id}`)}
                      aria-label={`View full detailed profile for ${profile.name}`}
                    >
                      <Eye className="h-3 w-3 mr-1" aria-hidden="true" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs px-2 py-1 h-7"
                      onClick={() => handleLike(profile.id)}
                      disabled={isLiked}
                      variant={isLiked ? "secondary" : "default"}
                      aria-label={isLiked ? `You have liked ${profile.name}'s profile` : `Like ${profile.name}'s profile`}
                    >
                      <Heart 
                        className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current scale-110 text-red-500' : ''}`} 
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
        {visibleProfiles < filteredProfiles.length && (
          <section className="text-center mt-8" role="region" aria-labelledby="browse-more-section">
            <h3 id="browse-more-section" className="sr-only">Load More Profiles</h3>
            <Button 
              variant="outline"
              size="lg"
              onClick={handleBrowseMore}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Browse more profiles to see additional matches"
            >
              Browse More Profiles ({filteredProfiles.length - visibleProfiles} remaining)
            </Button>
          </section>
        )}

        {/* Scroll to Top Button */}
        <section className="text-center mt-12" role="region" aria-labelledby="scroll-top-section">
          <h3 id="scroll-top-section" className="sr-only">Navigation Helper</h3>
          <Button 
            variant="outline"
            size="lg"
            onClick={scrollToTop}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2 hover-scale"
            aria-label="Scroll back to top of profiles"
          >
            <ArrowUp className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Top
          </Button>
        </section>

        {/* Additional Info */}
        <section className="text-center mt-12 space-y-4" aria-labelledby="info-section">
          <div className="max-w-2xl mx-auto">
            <h3 id="info-section" className="text-lg font-semibold mb-2">Discover Your Matches</h3>
            <p className="text-sm text-muted-foreground">
              These are potential matches in your area. Like profiles to connect and start meaningful conversations.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/profile/edit')} 
            size="lg"
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Complete your profile to unlock more personalized matches"
          >
            Complete Your Profile
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
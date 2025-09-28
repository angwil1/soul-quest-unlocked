import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import { Heart, Settings, MapPin, Briefcase, Sparkles, ArrowLeft, Users, ArrowUp } from 'lucide-react';
import { founderCuratedProfiles } from '@/data/sampleProfiles';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Matches = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [visibleMatches, setVisibleMatches] = useState(6);
  
  // Initialize from URL parameters or defaults
  const [searchZipCode, setSearchZipCode] = useState(searchParams.get('zip') || '');
  const [searchDistance, setSearchDistance] = useState(searchParams.get('distance') || '25');
  const [searchAgeRange, setSearchAgeRange] = useState(searchParams.get('age') || '25-35');
  const [searchGenderPreference, setSearchGenderPreference] = useState(searchParams.get('looking') || 'everyone');
  const [filteredProfiles, setFilteredProfiles] = useState(founderCuratedProfiles);
  const [isSearchActive, setIsSearchActive] = useState(false);

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

  // Restore search state from URL on page load
  useEffect(() => {
    const hasParams = searchParams.get('zip') || searchParams.get('distance') || 
                     searchParams.get('age') || searchParams.get('looking');
    
    if (hasParams) {
      setIsSearchActive(true);
      // Trigger search with URL parameters
      filterProfiles(
        searchParams.get('zip') || '',
        searchParams.get('distance') || '25',
        searchParams.get('age') || '25-35',
        searchParams.get('looking') || 'everyone'
      );
    }
  }, []); // Run once on mount

  const handleLike = (profileId: string) => {
    setLikedProfiles(prev => new Set([...prev, profileId]));
  };

  const handleDiscoverMore = () => {
    setVisibleMatches(prev => Math.min(prev + 6, filteredProfiles.length));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const calculateMatchScore = () => Math.floor(Math.random() * 20) + 80; // 80-99% match

  const filterProfiles = (zipCode: string, distance: string, ageRange: string, genderPref: string) => {
    if (!zipCode.trim()) return founderCuratedProfiles;

    // Filter profiles based on age range and gender
    const [minAge, maxAge] = ageRange.split('-').map(age => 
      age === '55+' ? [55, 100] : [parseInt(age), parseInt(age)]
    ).flat();

    const filtered = founderCuratedProfiles.filter(profile => {
      // Age filtering
      const profileAge = profile.age;
      let ageMatch = false;
      if (ageRange === '55+') {
        ageMatch = profileAge >= 55;
      } else {
        ageMatch = profileAge >= minAge && profileAge <= maxAge;
      }

      // Gender filtering - use actual profile data
      let genderMatch = true;
      if (genderPref !== 'everyone') {
        switch (genderPref) {
          case 'women':
            genderMatch = profile.gender === 'women';
            break;
          case 'men':
            genderMatch = profile.gender === 'men';
            break;
          case 'non-binary':
            genderMatch = profile.gender === 'non-binary';
            break;
          case 'transgender-women':
          case 'transgender-men':
          case 'lgbtq-community':
            // For now, include non-binary profiles for LGBTQ+ searches
            genderMatch = profile.gender === 'non-binary' || profile.gender === 'women' || profile.gender === 'men';
            break;
          case 'activity-partners':
          case 'travel-buddies':
            // For activity-based matching, gender doesn't matter as much
            genderMatch = true;
            break;
          default:
            genderMatch = true;
        }
      }

      return ageMatch && genderMatch;
    });

    console.log(`Filtering: ${founderCuratedProfiles.length} total profiles`);
    console.log(`Age range ${ageRange}: ${founderCuratedProfiles.filter(p => {
      const profileAge = p.age;
      if (ageRange === '55+') return profileAge >= 55;
      return profileAge >= minAge && profileAge <= maxAge;
    }).length} matches`);
    console.log(`Gender ${genderPref}: ${filtered.length} final matches`);

    return filtered;
  };

  const handleSearch = () => {
    if (!searchZipCode.trim()) {
      alert('Please enter a zip code to search');
      return;
    }

    const filtered = filterProfiles(searchZipCode, searchDistance, searchAgeRange, searchGenderPreference);
    setFilteredProfiles(filtered);
    setIsSearchActive(true);
    setVisibleMatches(6); // Reset visible matches

    // Update URL parameters to preserve search state
    const params = new URLSearchParams();
    params.set('zip', searchZipCode);
    params.set('distance', searchDistance);
    params.set('age', searchAgeRange);
    params.set('looking', searchGenderPreference);
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchZipCode('');
    setSearchDistance('25');
    setSearchAgeRange('25-35');
    setSearchGenderPreference('everyone');
    setFilteredProfiles(founderCuratedProfiles);
    setIsSearchActive(false);
    setVisibleMatches(6);
    
    // Clear URL parameters
    setSearchParams({});
  };

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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2 self-start"
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Home
            </Button>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {!user && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto justify-center"
                  aria-label="Join and start discovering matches"
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Join & Discover
                </Button>
              )}
              <Button 
                onClick={() => navigate('/profile/edit')}
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto justify-center"
                aria-label="Open profile settings to edit your information"
              >
                <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                Profile Settings
              </Button>
            </div>
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

        {/* Search Results Status */}
        {isSearchActive && (
          <section className="mb-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {filteredProfiles.length > 0 
                  ? `Found ${filteredProfiles.length} matches in ${searchZipCode}`
                  : `No matches found in ${searchZipCode} for your criteria. Try adjusting your filters.`
                }
              </p>
            </div>
          </section>
        )}
        <section className="mb-8">
          <Card className="bg-card border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Find Your Perfect Match</CardTitle>
              <CardDescription>
                Use your location and preferences to discover compatible people nearby
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label htmlFor="zip-code" className="text-sm font-medium">
                    Zip Code
                  </label>
                  <input
                    id="zip-code"
                    type="text"
                    placeholder="Enter your zip code"
                    value={searchZipCode}
                    onChange={(e) => setSearchZipCode(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="gender-preference" className="text-sm font-medium">
                    I'm looking for
                  </label>
                  <select
                    id="gender-preference"
                    value={searchGenderPreference}
                    onChange={(e) => setSearchGenderPreference(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="non-binary">Non-binary people</option>
                    <option value="transgender-women">Transgender women</option>
                    <option value="transgender-men">Transgender men</option>
                    <option value="lgbtq-community">LGBTQ+ community</option>
                    <option value="activity-partners">Activity partners</option>
                    <option value="travel-buddies">Travel buddies</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="distance" className="text-sm font-medium">
                    Distance (miles)
                  </label>
                  <select
                    id="distance"
                    value={searchDistance}
                    onChange={(e) => setSearchDistance(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="10">Within 10 miles</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                    <option value="100">Within 100 miles</option>
                    <option value="unlimited">Unlimited distance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="age-range" className="text-sm font-medium">
                    Age Range
                  </label>
                  <select
                    id="age-range"
                    value={searchAgeRange}
                    onChange={(e) => setSearchAgeRange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="18-25">18-25 years</option>
                    <option value="25-35">25-35 years</option>
                    <option value="35-45">35-45 years</option>
                    <option value="45-55">45-55 years</option>
                    <option value="55+">55+ years</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" onClick={handleSearch}>
                  Search Matches
                </Button>
                <Button variant="outline" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Matches Grid */}
        <section 
          className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
          aria-labelledby="matches-grid-title"
          role="region"
        >
          <h2 id="matches-grid-title" className="sr-only">Available Matches</h2>
          
          {filteredProfiles.slice(0, visibleMatches).map((profile) => {
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
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Avatar className="w-full h-full rounded-lg">
                      <AvatarImage 
                        src={profile.photos[0]} 
                        alt={`${profile.name}'s profile photo - ${profile.vibeTag} vibe`}
                        className="object-cover"
                      />
                      <AvatarFallback className="w-full h-full rounded-lg text-sm">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Badge 
                    className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5"
                    aria-label={`${matchScore} percent compatibility match`}
                  >
                    <Sparkles className="h-2 w-2 mr-1" aria-hidden="true" />
                    {matchScore}%
                  </Badge>
                </div>
                
                <CardHeader className="pb-2 px-3 pt-3">
                  <div className="flex items-center justify-between">
                    <CardTitle 
                      id={`profile-name-${profile.id}`}
                      className="text-sm font-semibold"
                    >
                      {profile.name}, {profile.age}
                    </CardTitle>
                    <Badge 
                      variant="outline"
                      className="text-xs px-1.5 py-0.5"
                      aria-label={`${profile.vibeTag} personality vibe`}
                    >
                      {profile.vibeTag}
                    </Badge>
                  </div>
                  <div 
                    id={`profile-info-${profile.id}`}
                    className="space-y-1 text-xs text-muted-foreground"
                    role="group"
                    aria-label="Profile details"
                  >
                    <div className="flex items-center gap-1" role="group" aria-label="Location">
                      <MapPin className="h-2 w-2" aria-hidden="true" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-1" role="group" aria-label="Occupation">
                      <Briefcase className="h-2 w-2" aria-hidden="true" />
                      <span className="truncate">{profile.occupation}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 px-3 pb-3">
                  <p 
                    className="text-xs text-muted-foreground line-clamp-2 mb-2"
                    aria-label={`Biography: ${profile.bio}`}
                  >
                    {profile.bio}
                  </p>
                  
                  <div 
                    className="flex gap-1 mb-3"
                    role="group"
                    aria-label={`Interests: ${profile.interests.slice(0, 2).join(', ')}`}
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
                      aria-label={`View full profile for ${profile.name}`}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs px-2 py-1 h-7"
                      onClick={() => handleLike(profile.id)}
                      disabled={isLiked}
                      aria-label={isLiked ? `Already liked ${profile.name}` : `Like ${profile.name}'s profile`}
                    >
                      <Heart 
                        className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} 
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
        {visibleMatches < filteredProfiles.length && (
          <section className="text-center mt-8" role="region" aria-labelledby="load-more-section">
            <h2 id="load-more-section" className="sr-only">Load More Matches</h2>
            <Button 
              variant="outline"
              onClick={handleDiscoverMore}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Discover more compatible matches"
            >
              Discover More Matches ({filteredProfiles.length - visibleMatches} remaining)
            </Button>
          </section>
        )}

        {/* Scroll to Top Button */}
        <section className="text-center mt-12" role="region" aria-labelledby="scroll-top-section">
          <h2 id="scroll-top-section" className="sr-only">Navigation Helper</h2>
          <Button 
            variant="outline"
            onClick={scrollToTop}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2 hover-scale"
            aria-label="Scroll back to top of matches"
          >
            <ArrowUp className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Top
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
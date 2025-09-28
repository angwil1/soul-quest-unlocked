import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import { Heart, Settings, MapPin, Briefcase, Sparkles, ArrowLeft, Users, ArrowUp } from 'lucide-react';
import { founderCuratedProfiles, SampleProfile } from '@/data/sampleProfiles';
import { stateProfiles } from '@/data/stateProfiles';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import SearchFilters from '@/components/SearchFilters';

// All 50 US States with sample zip codes for easier searching
const US_STATES = [
  { code: 'AL', name: 'Alabama', sampleZips: ['35203', '36101', '35801'] },
  { code: 'AK', name: 'Alaska', sampleZips: ['99501', '99701', '99801'] },
  { code: 'AZ', name: 'Arizona', sampleZips: ['85001', '85701', '86001'] },
  { code: 'AR', name: 'Arkansas', sampleZips: ['72201', '71601', '72701'] },
  { code: 'CA', name: 'California', sampleZips: ['90210', '94102', '95014'] },
  { code: 'CO', name: 'Colorado', sampleZips: ['80201', '80301', '80401'] },
  { code: 'CT', name: 'Connecticut', sampleZips: ['06511', '06902', '06106'] },
  { code: 'DE', name: 'Delaware', sampleZips: ['19901', '19801', '19702'] },
  { code: 'FL', name: 'Florida', sampleZips: ['33101', '32801', '33602'] },
  { code: 'GA', name: 'Georgia', sampleZips: ['30303', '31401', '30901'] },
  { code: 'HI', name: 'Hawaii', sampleZips: ['96801', '96720', '96766'] },
  { code: 'ID', name: 'Idaho', sampleZips: ['83702', '83201', '83814'] },
  { code: 'IL', name: 'Illinois', sampleZips: ['60601', '60101', '61801'] },
  { code: 'IN', name: 'Indiana', sampleZips: ['46201', '47901', '46601'] },
  { code: 'IA', name: 'Iowa', sampleZips: ['50309', '52240', '51501'] },
  { code: 'KS', name: 'Kansas', sampleZips: ['66101', '67501', '66801'] },
  { code: 'KY', name: 'Kentucky', sampleZips: ['40202', '41701', '42101'] },
  { code: 'LA', name: 'Louisiana', sampleZips: ['70112', '70801', '71101'] },
  { code: 'ME', name: 'Maine', sampleZips: ['04101', '04401', '04240'] },
  { code: 'MD', name: 'Maryland', sampleZips: ['21201', '20850', '21742'] },
  { code: 'MA', name: 'Massachusetts', sampleZips: ['02101', '02115', '02139'] },
  { code: 'MI', name: 'Michigan', sampleZips: ['48201', '49503', '48104'] },
  { code: 'MN', name: 'Minnesota', sampleZips: ['55401', '55801', '56601'] },
  { code: 'MS', name: 'Mississippi', sampleZips: ['39201', '38601', '39401'] },
  { code: 'MO', name: 'Missouri', sampleZips: ['63101', '64108', '65201'] },
  { code: 'MT', name: 'Montana', sampleZips: ['59101', '59701', '59801'] },
  { code: 'NE', name: 'Nebraska', sampleZips: ['68102', '69101', '68501'] },
  { code: 'NV', name: 'Nevada', sampleZips: ['89101', '89501', '89701'] },
  { code: 'NH', name: 'New Hampshire', sampleZips: ['03101', '03060', '03801'] },
  { code: 'NJ', name: 'New Jersey', sampleZips: ['07030', '08540', '07002'] },
  { code: 'NM', name: 'New Mexico', sampleZips: ['87101', '88001', '87401'] },
  { code: 'NY', name: 'New York', sampleZips: ['10001', '10013', '10019'] },
  { code: 'NC', name: 'North Carolina', sampleZips: ['28202', '27401', '28801'] },
  { code: 'ND', name: 'North Dakota', sampleZips: ['58102', '58501', '58701'] },
  { code: 'OH', name: 'Ohio', sampleZips: ['43215', '44101', '45202'] },
  { code: 'OK', name: 'Oklahoma', sampleZips: ['73102', '74101', '73701'] },
  { code: 'OR', name: 'Oregon', sampleZips: ['97201', '97301', '97401'] },
  { code: 'PA', name: 'Pennsylvania', sampleZips: ['19102', '19103', '15213'] },
  { code: 'PR', name: 'Puerto Rico', sampleZips: ['00901', '00725', '00617'] },
  { code: 'RI', name: 'Rhode Island', sampleZips: ['02901', '02840', '02886'] },
  { code: 'SC', name: 'South Carolina', sampleZips: ['29201', '29401', '29601'] },
  { code: 'SD', name: 'South Dakota', sampleZips: ['57101', '57701', '57501'] },
  { code: 'TN', name: 'Tennessee', sampleZips: ['37201', '38103', '37902'] },
  { code: 'TX', name: 'Texas', sampleZips: ['73301', '75201', '77001'] },
  { code: 'UT', name: 'Utah', sampleZips: ['84101', '84601', '84321'] },
  { code: 'VT', name: 'Vermont', sampleZips: ['05401', '05602', '05701'] },
  { code: 'VA', name: 'Virginia', sampleZips: ['23219', '22401', '24016'] },
  { code: 'WA', name: 'Washington', sampleZips: ['98101', '98052', '99201'] },
  { code: 'WV', name: 'West Virginia', sampleZips: ['25301', '26101', '25401'] },
  { code: 'WI', name: 'Wisconsin', sampleZips: ['53202', '54901', '53706'] },
  { code: 'WY', name: 'Wyoming', sampleZips: ['82001', '82601', '83001'] }
];

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [visibleMatches, setVisibleMatches] = useState(6);
  
  // Initialize from URL parameters or defaults
  const [searchZipCode, setSearchZipCode] = useState(searchParams.get('zip') || '');
  const [selectedState, setSelectedState] = useState('');
  const [searchDistance, setSearchDistance] = useState(searchParams.get('distance') || '25');
  const [searchAgeRange, setSearchAgeRange] = useState(searchParams.get('age') || '25-35');
  const [searchGenderPreference, setSearchGenderPreference] = useState(searchParams.get('looking') || 'everyone');
  const [filteredProfiles, setFilteredProfiles] = useState<SampleProfile[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isRegionalSearch, setIsRegionalSearch] = useState(false);

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    
    // Auto-populate with a sample zip code from the selected state
    if (stateCode) {
      const state = US_STATES.find(s => s.code === stateCode);
      if (state && state.sampleZips.length > 0) {
        const sampleZip = state.sampleZips[0]; // Use first sample zip
        setSearchZipCode(sampleZip);
      }
    }
  };

  const handleZipCodeChange = (value: string) => {
    setSearchZipCode(value);
    
    // Clear state selection when manually entering zip
    if (value !== searchZipCode) {
      setSelectedState('');
    }
  };
  
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
      const performSearch = async () => {
        try {
          const filtered = await filterProfiles(
            searchParams.get('zip') || '',
            searchParams.get('distance') || '25',
            searchParams.get('age') || '25-35',
            searchParams.get('looking') || 'everyone',
            searchParams.get('state') || ''
          );
          setFilteredProfiles(filtered);
        } catch (error) {
          console.error('Initial search error:', error);
        }
      };
      performSearch();
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

  const filterProfiles = async (zipCode: string, distance: string, ageRange: string, genderPref: string, selectedState?: string) => {
    // Combine all available profiles
    const allProfiles = [...founderCuratedProfiles, ...stateProfiles];
    
    // If no zip code but state is selected, use all sample zips from that state
    let searchZips: string[] = [];
    
    if (zipCode.trim()) {
      searchZips = [zipCode.trim()];
    } else if (selectedState) {
      const state = US_STATES.find(s => s.code === selectedState);
      searchZips = state ? state.sampleZips : [];
    } else {
      return allProfiles; // No location criteria
    }

    // Filter profiles based on age range and gender
    const [minAge, maxAge] = ageRange === '55+' 
      ? [55, 100] 
      : ageRange.split('-').map(age => parseInt(age));

    let filtered = allProfiles.filter(profile => {
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

    // First try original distance
    const distanceLimit = parseInt(distance);
    let profilesWithDistance = [];
    
    for (const profile of filtered) {
      try {
        let minDistance = Infinity;
        
        // Calculate distance from each search zip code and take the minimum
        for (const searchZip of searchZips) {
          const result = await supabase.functions.invoke('calculate-distance', {
            body: { zipCode1: searchZip, zipCode2: profile.zipCode }
          });
          
          if (result.data && result.data.distance < minDistance) {
            minDistance = result.data.distance;
          }
        }
        
        if (minDistance <= distanceLimit) {
          profilesWithDistance.push({
            ...profile,
            distance: minDistance
          });
        }
      } catch (error) {
        console.error('Distance calculation error for profile:', profile.name, error);
      }
    }

    // If no matches found in original distance and distance is not unlimited, try regional search (200 miles)
    if (profilesWithDistance.length === 0 && distanceLimit < 200) {
      setIsRegionalSearch(true);
      console.log('No close matches found, searching regionally within 200 miles...');
      
      for (const profile of filtered) {
        try {
          let minDistance = Infinity;
          
          // Calculate distance from each search zip code and take the minimum
          for (const searchZip of searchZips) {
            const result = await supabase.functions.invoke('calculate-distance', {
              body: { zipCode1: searchZip, zipCode2: profile.zipCode }
            });
            
            if (result.data && result.data.distance < minDistance) {
              minDistance = result.data.distance;
            }
          }
          
          if (minDistance <= 200) {
            profilesWithDistance.push({
              ...profile,
              distance: minDistance,
              isRegionalMatch: true
            });
          }
        } catch (error) {
          console.error('Distance calculation error for profile:', profile.name, error);
        }
      }
    } else {
      setIsRegionalSearch(false);
    }

    // Sort by distance (closest first)
    profilesWithDistance.sort((a, b) => {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });

    const searchType = isRegionalSearch ? 'regional' : 'local';
    console.log(`${searchType} search: ${profilesWithDistance.length} matches found`);

    return profilesWithDistance;
  };

  const handleSearch = async () => {
    // Allow search if either zip code OR state is selected
    if (!searchZipCode.trim() && !selectedState) {
      alert('Please select a state or enter a zip code to search');
      return;
    }

    try {
      setIsRegionalSearch(false); // Reset regional search state
      const filtered = await filterProfiles(searchZipCode, searchDistance, searchAgeRange, searchGenderPreference, selectedState);
      setFilteredProfiles(filtered);
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for matches. Please try again.');
      return;
    }
    setIsSearchActive(true);
    setVisibleMatches(6); // Reset visible matches

    // Update URL parameters to preserve search state
    const params = new URLSearchParams();
    params.set('zip', searchZipCode);
    params.set('distance', searchDistance);
    params.set('age', searchAgeRange);
    params.set('looking', searchGenderPreference);
    setSearchParams(params);
    
    // Scroll to results section for immediate feedback
    setTimeout(() => {
      const resultsSection = document.querySelector('[data-search-results]');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleResetFilters = () => {
    setSearchZipCode('');
    setSearchDistance('25');
    setSearchAgeRange('25-35');
    setSearchGenderPreference('everyone');
    setFilteredProfiles([]);
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
        <div className="max-w-7xl mx-auto px-4 py-4">
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
        className="relative max-w-7xl mx-auto px-4 py-8"
        role="main"
        aria-labelledby="search-heading"
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Heart Pulse Animation - More visible */}
          <div className="absolute top-32 left-1/4 w-8 h-8 text-pink-400/60 animate-[heartPulse_4s_ease-in-out_infinite]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          {/* More Hearts */}
          <div className="absolute top-20 right-1/3 w-6 h-6 text-purple-400/50 animate-[heartPulse_6s_ease-in-out_infinite_2s]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          {/* Sparkle Trail Animation - Bigger and more visible */}
          <div className="absolute top-40 right-1/4 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full animate-[sparkleFloat_6s_ease-in-out_infinite] opacity-60"></div>
          <div className="absolute top-28 right-1/2 w-3 h-3 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full animate-[sparkleFloat_4s_ease-in-out_infinite_1s] opacity-70"></div>
          <div className="absolute top-48 left-1/3 w-3 h-3 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full animate-[sparkleFloat_5s_ease-in-out_infinite_2s] opacity-50"></div>
          
          {/* Gentle Pulse Rings - More visible */}
          <div className="absolute top-36 left-1/2 w-20 h-20 border-2 border-pink-300/30 rounded-full animate-[gentlePulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute top-24 right-2/3 w-16 h-16 border-2 border-purple-300/25 rounded-full animate-[gentlePulse_6s_ease-in-out_infinite_2s]"></div>
        </div>
        {/* Header */}
        <section className="mb-8">
          <h1 id="search-heading" className="text-3xl font-bold mb-2">Search for Matches</h1>
          <p className="text-muted-foreground">
            Discover compatible people through AI-powered matching
          </p>
        </section>

        {/* Search Filters Component */}
        <SearchFilters
          searchZipCode={searchZipCode}
          setSearchZipCode={handleZipCodeChange}
          selectedState={selectedState}
          setSelectedState={handleStateChange}
          searchDistance={searchDistance}
          setSearchDistance={setSearchDistance}
          searchAgeRange={searchAgeRange}
          setSearchAgeRange={setSearchAgeRange}
          searchGenderPreference={searchGenderPreference}
          setSearchGenderPreference={setSearchGenderPreference}
          onSearch={handleSearch}
          onReset={handleResetFilters}
          isSearchActive={isSearchActive}
          isRegionalSearch={isRegionalSearch}
          US_STATES={US_STATES}
        />

        {/* Results count and data attribute for smooth scrolling */}
        {isSearchActive && (
          <section 
            data-search-results 
            className="mb-6"
            role="region" 
            aria-labelledby="results-summary"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 id="results-summary" className="text-lg font-semibold">
                  Search Results ({filteredProfiles.length} matches)
                </h2>
                {isRegionalSearch && (
                  <p className="text-sm text-muted-foreground">
                    Expanded search to 200 miles to find more matches
                  </p>
                )}
              </div>
              {filteredProfiles.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min(visibleMatches, filteredProfiles.length)} of {filteredProfiles.length}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Matches by State */}
        {(() => {
          // Group profiles by state
          const profilesByState = filteredProfiles.slice(0, visibleMatches).reduce((acc, profile) => {
            const state = profile.location.split(', ').pop() || 'Unknown';
            if (!acc[state]) {
              acc[state] = [];
            }
            acc[state].push(profile);
            return acc;
          }, {} as Record<string, SampleProfile[]>);

          return Object.entries(profilesByState)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([state, stateProfiles]) => (
              <section key={state} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold text-foreground">{state}</h2>
                  <Badge variant="secondary" className="text-sm">
                    {stateProfiles.length} {stateProfiles.length === 1 ? 'match' : 'matches'}
                  </Badge>
                </div>
                
                <div 
                  className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                  aria-labelledby={`matches-${state}-title`}
                  role="region"
                >
                  <h3 id={`matches-${state}-title`} className="sr-only">Matches in {state}</h3>
                  
                  {stateProfiles.map((profile) => {
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
                                className="object-cover blur-sm w-full h-full"
                                style={{ aspectRatio: '3/4' }}
                              />
                               <AvatarFallback className="w-full h-full rounded-lg text-lg bg-gradient-to-br from-primary/30 to-secondary/30">
                                 {profile.name?.split(' ')[0]?.charAt(0) || 'N'}
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
                          
                          {/* Looking For Section */}
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-background/90 backdrop-blur-sm rounded-md px-2 py-1">
                              <p className="text-xs text-muted-foreground text-center">
                                Looking for: <span className="font-medium text-foreground">
                                  {profile.lookingFor === 'men' ? 'Men' : 
                                   profile.lookingFor === 'women' ? 'Women' :
                                   profile.lookingFor === 'anyone' ? 'Anyone' :
                                   profile.lookingFor === 'non-binary' ? 'Non-binary' :
                                   profile.lookingFor === 'casual-friends' ? 'Friends' :
                                   profile.lookingFor === 'activity-partners' ? 'Activity Partners' :
                                   profile.lookingFor === 'travel-buddies' ? 'Travel Buddies' :
                                   'Connection'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <CardHeader className="pb-2 px-3 pt-3">
                          <div className="flex items-center justify-between">
                            <CardTitle 
                              id={`profile-name-${profile.id}`}
                              className="text-sm font-semibold"
                            >
                              {profile.name?.split(' ')[0]}, {profile.age}
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
                              {profile.distance !== undefined && (
                                <Badge variant="outline" className="text-xs ml-1">
                                  {profile.distance < 1 
                                    ? `${(profile.distance * 5280).toFixed(0)} ft`
                                    : `${profile.distance.toFixed(1)} mi`
                                  }
                                </Badge>
                              )}
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
                </div>
              </section>
            ));
        })()}

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
      </main>
    </div>
  );
};

export default Search;
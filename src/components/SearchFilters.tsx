import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw, MapPin, Users, Calendar, Sliders } from 'lucide-react';

interface SearchFiltersProps {
  searchZipCode: string;
  setSearchZipCode: (value: string) => void;
  selectedState: string;
  setSelectedState: (value: string) => void;
  searchDistance: string;
  setSearchDistance: (value: string) => void;
  searchAgeRange: string;
  setSearchAgeRange: (value: string) => void;
  searchGenderPreference: string;
  setSearchGenderPreference: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearchActive: boolean;
  isRegionalSearch: boolean;
  US_STATES: Array<{ code: string; name: string; sampleZips: string[] }>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchZipCode,
  setSearchZipCode,
  selectedState,
  setSelectedState,
  searchDistance,
  setSearchDistance,
  searchAgeRange,
  setSearchAgeRange,
  searchGenderPreference,
  setSearchGenderPreference,
  onSearch,
  onReset,
  isSearchActive,
  isRegionalSearch,
  US_STATES
}) => {
  return (
    <section className="mb-8">
      <Card className="bg-card border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" aria-hidden="true" />
            Find Your Perfect Match
          </CardTitle>
          <CardDescription>
            Use your location and preferences to discover compatible people nearby
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="state-select" className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                State (optional)
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger 
                  id="state-select"
                  className="focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  aria-label="Select state for location search"
                >
                  <SelectValue placeholder="Choose state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip-code" className="text-sm font-medium">
                ZIP Code
              </Label>
              <Input
                id="zip-code"
                type="text"
                placeholder="Enter ZIP code"
                value={searchZipCode}
                onChange={(e) => setSearchZipCode(e.target.value)}
                maxLength={5}
                pattern="[0-9]{5}"
                className="focus:ring-2 focus:ring-primary focus:ring-offset-1"
                aria-label="Enter ZIP code for location search"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance-select" className="text-sm font-medium">
                Distance (miles)
              </Label>
              <Select value={searchDistance} onValueChange={setSearchDistance}>
                <SelectTrigger 
                  id="distance-select"
                  className="focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  aria-label="Select maximum distance for search"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                  <SelectItem value="100">Within 100 miles</SelectItem>
                  <SelectItem value="200">Within 200 miles</SelectItem>
                  <SelectItem value="500">Within 500 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age-select" className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                Age Range
              </Label>
              <Select value={searchAgeRange} onValueChange={setSearchAgeRange}>
                <SelectTrigger 
                  id="age-select"
                  className="focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  aria-label="Select age range for matches"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18-25 years</SelectItem>
                  <SelectItem value="25-35">25-35 years</SelectItem>
                  <SelectItem value="35-45">35-45 years</SelectItem>
                  <SelectItem value="45-55">45-55 years</SelectItem>
                  <SelectItem value="55+">55+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender-select" className="text-sm font-medium flex items-center gap-1">
                <Users className="h-3 w-3" aria-hidden="true" />
                Looking for
              </Label>
              <Select value={searchGenderPreference} onValueChange={setSearchGenderPreference}>
                <SelectTrigger 
                  id="gender-select"
                  className="focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  aria-label="Select gender preference for matches"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="transgender-women">Transgender Women</SelectItem>
                  <SelectItem value="transgender-men">Transgender Men</SelectItem>
                  <SelectItem value="lgbtq-community">LGBTQ+ Community</SelectItem>
                  <SelectItem value="activity-partners">Activity Partners</SelectItem>
                  <SelectItem value="travel-buddies">Travel Buddies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              onClick={onSearch}
              className="flex-1 sm:flex-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Search for matches with selected criteria"
            >
              <Search className="h-4 w-4 mr-2" aria-hidden="true" />
              Search for Matches
            </Button>
            
            {isSearchActive && (
              <Button 
                variant="outline"
                onClick={onReset}
                className="flex-1 sm:flex-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Reset all search filters"
              >
                <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                Reset Filters
              </Button>
            )}
          </div>
          
          {isRegionalSearch && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Sliders className="h-4 w-4 text-blue-600 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Expanded Search Active
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    We couldn't find matches in your preferred distance, so we expanded the search to 200 miles to show you more potential connections.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default SearchFilters;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Crown, ArrowRight, Settings, MapPin, Heart, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// US States with major zip code ranges for easier searching
const US_STATES = [
  { code: 'CA', name: 'California', sampleZips: ['90210', '94102', '95014'] },
  { code: 'NY', name: 'New York', sampleZips: ['10001', '10013', '10019'] },
  { code: 'TX', name: 'Texas', sampleZips: ['73301', '75201', '77001'] },
  { code: 'FL', name: 'Florida', sampleZips: ['33101', '32801', '33602'] },
  { code: 'PA', name: 'Pennsylvania', sampleZips: ['19102', '19103', '15213'] },
  { code: 'MA', name: 'Massachusetts', sampleZips: ['02101', '02115', '02139'] },
  { code: 'CT', name: 'Connecticut', sampleZips: ['06511', '06902', '06106'] },
  { code: 'NJ', name: 'New Jersey', sampleZips: ['07030', '08540', '07002'] },
  { code: 'NH', name: 'New Hampshire', sampleZips: ['03101', '03060', '03801'] },
  { code: 'VT', name: 'Vermont', sampleZips: ['05401', '05602', '05701'] },
  { code: 'WA', name: 'Washington', sampleZips: ['98101', '98052', '99201'] },
  { code: 'OR', name: 'Oregon', sampleZips: ['97201', '97301', '97401'] },
  { code: 'CO', name: 'Colorado', sampleZips: ['80201', '80301', '80401'] },
  { code: 'IL', name: 'Illinois', sampleZips: ['60601', '60101', '61801'] },
  { code: 'MI', name: 'Michigan', sampleZips: ['48201', '49503', '48104'] },
];

interface SearchFiltersProps {
  onFiltersChange?: (filters: string[]) => void;
  onUpgradePrompt?: () => void;
  onPreferenceChange?: (preference: string) => void;
  onZipCodeChange?: (zipCode: string) => void;
}

const SearchFilters = ({ onFiltersChange, onUpgradePrompt, onPreferenceChange, onZipCodeChange }: SearchFiltersProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchPreference, setSearchPreference] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const identityOptions: { id: string; label: string }[] = [];

  const handleFilterChange = (filterId: string, checked: boolean) => {
    let newFilters: string[];
    
    if (checked) {
      newFilters = [...selectedFilters, filterId];
    } else {
      newFilters = selectedFilters.filter(id => id !== filterId);
    }

    setSelectedFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleLookingForClick = () => {
    if (!user) {
      // Redirect non-authenticated users to quick setup
      navigate('/quick-start');
      return;
    }
    // For authenticated users, handle normally
  };

  const handleLocationClick = () => {
    if (!user) {
      // Redirect non-authenticated users to quick setup  
      navigate('/quick-start');
      return;
    }
    // For authenticated users, handle normally
  };

  const handleStateChange = (stateCode: string) => {
    if (!user) {
      handleLocationClick();
      return;
    }
    
    setSelectedState(stateCode);
    
    // Auto-populate with a sample zip code from the selected state
    if (stateCode) {
      const state = US_STATES.find(s => s.code === stateCode);
      if (state && state.sampleZips.length > 0) {
        const sampleZip = state.sampleZips[0]; // Use first sample zip
        setZipCode(sampleZip);
        onZipCodeChange?.(sampleZip);
      }
    }
  };

  const handleZipCodeChange = (value: string) => {
    if (!user) {
      handleLocationClick();
      return;
    }
    setZipCode(value);
    onZipCodeChange?.(value);
    
    // Clear state selection when manually entering zip
    if (value !== zipCode) {
      setSelectedState('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Simplified Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">All identities welcome</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Find meaningful connections in our inclusive community
        </p>
      </div>

      {/* Filters Grid */}
      <div className="grid gap-4">
        {/* Gender Preference */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            Looking for
          </label>
          <Select 
            value={searchPreference} 
            onValueChange={(value) => {
              if (!user) {
                handleLookingForClick();
                return;
              }
              setSearchPreference(value);
              onPreferenceChange?.(value);
            }}
            onOpenChange={(open) => {
              if (open && !user) {
                handleLookingForClick();
              }
            }}
          >
            <SelectTrigger className="w-full h-10 bg-background">
              <SelectValue placeholder={user ? "Choose preference" : "Sign up to filter"} />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-lg z-50">
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="non-binary">Non-binary folks</SelectItem>
              <SelectItem value="all">Everyone</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Location Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Location
          </label>
          
          {/* State Selection */}
          <Select 
            value={selectedState} 
            onValueChange={handleStateChange}
            onOpenChange={(open) => {
              if (open && !user) {
                handleLocationClick();
              }
            }}
          >
            <SelectTrigger className="w-full h-10 bg-background">
              <SelectValue placeholder={user ? "Choose state (optional)" : "Sign up to set location"} />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-lg z-50 max-h-48 overflow-y-auto">
              {US_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Zip Code Input */}
          <Input
            type="text"
            placeholder={user ? "Or enter specific zip code" : "Sign up to set location"}
            value={zipCode}
            onChange={(e) => handleZipCodeChange(e.target.value)}
            onClick={() => {
              if (!user) {
                handleLocationClick();
              }
            }}
            readOnly={!user}
            maxLength={10}
            className={`w-full h-10 bg-background ${!user ? 'cursor-pointer' : ''}`}
          />
          
          {selectedState && (
            <p className="text-xs text-muted-foreground">
              Using {US_STATES.find(s => s.code === selectedState)?.name}. You can still enter a specific zip code above.
            </p>
          )}
        </div>
      </div>
      
      {selectedFilters.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-1">
            {selectedFilters.map((filterId) => {
              const option = identityOptions.find(opt => opt.id === filterId);
              return (
                <Badge key={filterId} variant="secondary" className="text-xs">
                  {option?.label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
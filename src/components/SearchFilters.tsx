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
            <SelectContent className="bg-background border border-border shadow-lg z-[60] max-h-60 overflow-y-auto">
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
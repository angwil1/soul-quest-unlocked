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
          <Input
            type="text"
            placeholder={user ? "Enter zip code" : "Sign up to set location"}
            value={zipCode}
            onChange={(e) => {
              if (!user) {
                handleLocationClick();
                return;
              }
              setZipCode(e.target.value);
              onZipCodeChange?.(e.target.value);
            }}
            onClick={() => {
              if (!user) {
                handleLocationClick();
              }
            }}
            readOnly={!user}
            maxLength={10}
            className={`w-full h-10 bg-background ${!user ? 'cursor-pointer' : ''}`}
          />
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
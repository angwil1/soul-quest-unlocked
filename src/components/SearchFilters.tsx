import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Crown, ArrowRight, Settings, MapPin, Heart, Filter } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange?: (filters: string[]) => void;
  onUpgradePrompt?: () => void;
  onPreferenceChange?: (preference: string) => void;
  onZipCodeChange?: (zipCode: string) => void;
}

const SearchFilters = ({ onFiltersChange, onUpgradePrompt, onPreferenceChange, onZipCodeChange }: SearchFiltersProps) => {
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

  return (
    <div className="space-y-5">
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-lg">
        <CardHeader className="px-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Inclusive Space</span>
            </div>
            <p className="text-base font-medium leading-relaxed text-foreground">
              Welcome to AI Complete Me - a space where all identities, orientations, and expressions are celebrated. 
              Whether you&apos;re LGBTQ+, questioning, or exploring - <span className="font-semibold text-primary">you belong here</span>.
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {/* Navigate to visibility settings */}}
                className="text-xs h-8"
              >
                <Settings className="h-3 w-3 mr-1" />
                Privacy Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <div className="grid gap-4">
            {/* Gender Preference */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                I'm looking for
              </label>
              <Select value={searchPreference} onValueChange={(value) => {
                setSearchPreference(value);
                onPreferenceChange?.(value);
              }}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Choose your preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="non-binary">Non-binary folks</SelectItem>
                  <SelectItem value="all">Everyone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Location
              </label>
              <Input
                type="text"
                placeholder="Enter zip code (e.g., 10001)"
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value);
                  onZipCodeChange?.(e.target.value);
                }}
                maxLength={10}
                className="w-full h-11"
              />
            </div>
          </div>
          
          {selectedFilters.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Selected filters:</p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilters;
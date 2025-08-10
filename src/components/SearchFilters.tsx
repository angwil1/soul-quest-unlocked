import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Crown, ArrowRight, Settings, MapPin, Heart, Filter } from 'lucide-react';
import { useEchoSubscription } from '@/hooks/useEchoSubscription';

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
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { isEchoActive } = useEchoSubscription();

  const identityOptions: { id: string; label: string }[] = [];
  // Identity options removed since they're covered in the "I'm looking for" dropdown

  const handleFilterChange = (filterId: string, checked: boolean) => {
    let newFilters: string[];
    
    if (checked) {
      // Free tier limit of 3 filters
      if (selectedFilters.length >= 3 && !isEchoActive) {
        setShowUpgradePrompt(true);
        return;
      }
      newFilters = [...selectedFilters, filterId];
    } else {
      newFilters = selectedFilters.filter(id => id !== filterId);
    }
    
    setSelectedFilters(newFilters);
    onFiltersChange?.(newFilters);

    // Show upgrade prompt after selecting all 3 options
    if (newFilters.length === 3 && !isEchoActive) {
      setShowUpgradePrompt(true);
    }
  };

  const handleUpgrade = () => {
    onUpgradePrompt?.();
    setShowUpgradePrompt(false);
  };

  return (
    <div className="space-y-5">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pb-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Welcome to AI Complete Me - a space where all identities, orientations, and expressions are celebrated. 
              Whether you're LGBTQ+, questioning, or exploring - you belong here.
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
          {!isEchoActive && (
            <p className="text-xs text-muted-foreground italic">
              ✨ Premium members get expanded matching options
            </p>
          )}
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

      {/* Upgrade Prompt for Free Tier Users */}
      {showUpgradePrompt && !isEchoActive && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💫</div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Want to explore more?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Echo Amplified 🪞 adds emotional nuance, letting you match by vibe, depth, and expressive presence—not just identity.
                </p>
                <Button 
                  size="sm" 
                  onClick={handleUpgrade}
                  className="text-xs h-8"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Add Echo Amplified to deepen your search
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchFilters;
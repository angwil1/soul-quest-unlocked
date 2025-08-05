import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Crown, ArrowRight } from 'lucide-react';
import { useEchoSubscription } from '@/hooks/useEchoSubscription';

interface SearchFiltersProps {
  onFiltersChange?: (filters: string[]) => void;
  onUpgradePrompt?: () => void;
}

const SearchFilters = ({ onFiltersChange, onUpgradePrompt }: SearchFiltersProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { isEchoActive } = useEchoSubscription();

  const identityOptions = [
    { id: 'men', label: 'People who identify as men' },
    { id: 'women', label: 'People who identify as women' },
    { id: 'non-binary', label: 'People beyond the binary' }
  ];

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Identity Filters
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI Complete Me invites you to begin with 3 identity filters—designed for clarity, not constraint.
          </p>
          {!isEchoActive && (
            <p className="text-xs text-muted-foreground">
              Premium tiers offer expanded matching pathways and deeper identity exploration
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {identityOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedFilters.includes(option.id)}
                onCheckedChange={(checked) => handleFilterChange(option.id, !!checked)}
              />
              <label
                htmlFor={option.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
          
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
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMemoryVault } from '@/hooks/useMemoryVault';
import { useSubscription } from '@/hooks/useSubscription';
import { Heart, Lightbulb, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MemoryVaultWidget = () => {
  const { getVaultStats } = useMemoryVault();
  const { subscription } = useSubscription();
  const [stats, setStats] = useState({ matches: 0, prompts: 0, moments: 0 });
  const [loading, setLoading] = useState(true);

  const isUnlockedBeyond = subscription?.subscription_tier === 'Pro' && subscription?.subscribed;

  useEffect(() => {
    if (isUnlockedBeyond) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [isUnlockedBeyond]);

  const loadStats = async () => {
    try {
      const vaultStats = await getVaultStats();
      setStats(vaultStats);
    } catch (error) {
      console.error('Error loading vault stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isUnlockedBeyond) {
    return (
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="text-2xl">🔮</div>
            <div>
              <CardTitle className="text-lg">Memory Vault</CardTitle>
              <CardDescription>Save your favorite moments, prompts, and matches</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Available with Unlocked Beyond subscription
          </p>
          <Link to="/pricing">
            <Button size="sm" className="w-full">
              Upgrade to Access
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  const totalItems = stats.matches + stats.prompts + stats.moments;

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🔮</div>
            <div>
              <CardTitle className="text-lg">Memory Vault</CardTitle>
              <CardDescription>
                {totalItems === 0 ? 'Start building your collection' : `${totalItems} saved items`}
              </CardDescription>
            </div>
          </div>
          <Link to="/memory-vault">
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {totalItems === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Your vault is empty. Start saving meaningful moments!
            </p>
            <Link to="/memory-vault">
              <Button size="sm">
                Explore Vault
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <Star className="h-5 w-5 text-purple-500 mb-1" />
                <span className="text-lg font-semibold">{stats.moments}</span>
                <span className="text-xs text-muted-foreground">Moments</span>
              </div>
              <div className="flex flex-col items-center">
                <Lightbulb className="h-5 w-5 text-yellow-500 mb-1" />
                <span className="text-lg font-semibold">{stats.prompts}</span>
                <span className="text-xs text-muted-foreground">Prompts</span>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-5 w-5 text-red-500 mb-1" />
                <span className="text-lg font-semibold">{stats.matches}</span>
                <span className="text-xs text-muted-foreground">Matches</span>
              </div>
            </div>
            <Link to="/memory-vault">
              <Button size="sm" variant="outline" className="w-full">
                View Vault
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
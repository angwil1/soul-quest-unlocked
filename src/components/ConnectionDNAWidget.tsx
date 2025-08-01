import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useConnectionDNA } from '@/hooks/useConnectionDNA';
import { useSubscription } from '@/hooks/useSubscription';
import { Brain, Heart, MessageSquare, Target, ChevronRight, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ConnectionDNAWidget = () => {
  const { getDNAProfile, getInsights, isUnlockedBeyond } = useConnectionDNA();
  const { subscription } = useSubscription();
  const [dnaProfile, setDnaProfile] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isUnlockedBeyond) {
      loadDNAData();
    } else {
      setLoading(false);
    }
  }, [isUnlockedBeyond]);

  const loadDNAData = async () => {
    try {
      const [profile, userInsights] = await Promise.all([
        getDNAProfile(),
        getInsights()
      ]);
      
      setDnaProfile(profile);
      setInsights(userInsights.filter(i => !i.is_read));
    } catch (error) {
      console.error('Error loading DNA data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isUnlockedBeyond) {
    return (
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="text-2xl">🧬</div>
            <div>
              <CardTitle className="text-lg">Connection DNA</CardTitle>
              <CardDescription>Evolving emotional intelligence for deeper matches</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Available with Unlocked Beyond subscription
          </p>
          <Link to="/pricing">
            <Button size="sm" className="w-full">
              <Crown className="h-4 w-4 mr-2" />
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

  if (!dnaProfile) {
    return (
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="text-2xl">🧬</div>
            <div>
              <CardTitle className="text-lg">Connection DNA</CardTitle>
              <CardDescription>Build your emotional intelligence profile</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Start analyzing your interactions to unlock insights about your emotional intelligence
          </p>
          <Link to="/connection-dna">
            <Button size="sm" className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Create DNA Profile
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const averageScore = Math.round(
    (dnaProfile.emotional_intelligence_score + 
     dnaProfile.empathy_score + 
     dnaProfile.interaction_quality_score + 
     dnaProfile.vulnerability_comfort) / 4
  );

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🧬</div>
            <div>
              <CardTitle className="text-lg">Connection DNA</CardTitle>
              <CardDescription>
                Overall EQ: {averageScore}/100
                {insights.length > 0 && (
                  <Badge className="ml-2 bg-destructive text-destructive-foreground">
                    {insights.length} new insight{insights.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          <Link to="/connection-dna">
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Mini score grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <Brain className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <div className="text-sm font-semibold">{Math.round(dnaProfile.emotional_intelligence_score)}</div>
              <div className="text-xs text-muted-foreground">EQ Score</div>
            </div>
            <div className="text-center">
              <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <div className="text-sm font-semibold">{Math.round(dnaProfile.empathy_score)}</div>
              <div className="text-xs text-muted-foreground">Empathy</div>
            </div>
            <div className="text-center">
              <MessageSquare className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <div className="text-sm font-semibold">{Math.round(dnaProfile.interaction_quality_score)}</div>
              <div className="text-xs text-muted-foreground">Communication</div>
            </div>
            <div className="text-center">
              <Target className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <div className="text-sm font-semibold">{Math.round(dnaProfile.vulnerability_comfort)}</div>
              <div className="text-xs text-muted-foreground">Vulnerability</div>
            </div>
          </div>

          {/* Overall progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Emotional Intelligence</span>
              <span>{averageScore}%</span>
            </div>
            <Progress value={averageScore} className="h-2" />
          </div>

          {/* Love language if available */}
          {dnaProfile.love_language_primary && (
            <div className="text-center pt-2 border-t">
              <Badge variant="secondary" className="text-xs">
                💝 {dnaProfile.love_language_primary.replace('_', ' ')}
              </Badge>
            </div>
          )}

          <Link to="/connection-dna">
            <Button size="sm" variant="outline" className="w-full">
              View Full Analysis
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
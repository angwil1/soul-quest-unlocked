import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Crown, 
  Lock,
  Sparkles,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AIDigestSidebarProps {
  selectedMatch: string | null;
  otherUserId: string | null;
  otherUserName: string;
}

interface EmotionalSignals {
  overall_sentiment: string;
  vulnerability_level: number;
  engagement_score: number;
  communication_style: string;
}

interface CompatibilityHighlights {
  compatibility_score: number;
  shared_interests: string[];
  personality_match: string;
  connection_potential: string;
}

interface SuggestedActions {
  next_steps: string[];
  conversation_starters: string[];
  date_ideas: string[];
}

export const AIDigestSidebar = ({ selectedMatch, otherUserId, otherUserName }: AIDigestSidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCompletePlus, setIsCompletePlus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emotionalSignals, setEmotionalSignals] = useState<EmotionalSignals | null>(null);
  const [compatibilityHighlights, setCompatibilityHighlights] = useState<CompatibilityHighlights | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<SuggestedActions | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;

      try {
        // Check for Complete Plus or Beyond subscription
        const { data: profileData } = await supabase
          .from('profiles')
          .select('unlocked_beyond_badge_enabled, is_premium')
          .eq('id', user.id)
          .single();
        
        setIsCompletePlus(profileData?.unlocked_beyond_badge_enabled || profileData?.is_premium || false);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setIsCompletePlus(false);
      }
    };

    checkSubscription();
  }, [user]);

  // Load AI digest data for the selected conversation
  useEffect(() => {
    if (selectedMatch && otherUserId && isCompletePlus) {
      loadAIDigestData();
    }
  }, [selectedMatch, otherUserId, isCompletePlus]);

  const loadAIDigestData = async () => {
    if (!user || !otherUserId) return;

    setLoading(true);
    try {
      // Get compatibility analysis
      const { data: compatibilityData } = await supabase
        .from('connection_dna_compatibility')
        .select('*')
        .or(`and(user_id_1.eq.${user.id},user_id_2.eq.${otherUserId}),and(user_id_1.eq.${otherUserId},user_id_2.eq.${user.id})`)
        .single();

      if (compatibilityData) {
        // Helper function to safely convert JSON array to string array
        const safeStringArray = (data: any): string[] => {
          if (Array.isArray(data)) {
            return data.filter(item => typeof item === 'string');
          }
          return [];
        };

        setCompatibilityHighlights({
          compatibility_score: compatibilityData.overall_compatibility_score || 0,
          shared_interests: safeStringArray(compatibilityData.strengths),
          personality_match: compatibilityData.personality_match_score > 80 ? 'Excellent' : 
                           compatibilityData.personality_match_score > 60 ? 'Good' : 'Developing',
          connection_potential: compatibilityData.growth_potential_score > 80 ? 'High' : 
                              compatibilityData.growth_potential_score > 60 ? 'Medium' : 'Growing'
        });

        setSuggestedActions({
          next_steps: safeStringArray(compatibilityData.growth_areas).slice(0, 3).length > 0
            ? safeStringArray(compatibilityData.growth_areas).slice(0, 3)
            : [
                'Share more about your interests',
                'Ask about their goals and values',
                'Suggest a casual meetup'
              ],
          conversation_starters: safeStringArray(compatibilityData.conversation_starters).slice(0, 3).length > 0
            ? safeStringArray(compatibilityData.conversation_starters).slice(0, 3)
            : [
                'What has been the highlight of your week?',
                'I noticed we both love similar things...',
                'What are you most passionate about lately?'
              ],
          date_ideas: safeStringArray(compatibilityData.date_ideas).slice(0, 3).length > 0
            ? safeStringArray(compatibilityData.date_ideas).slice(0, 3)
            : [
                'Coffee at a cozy local café',
                'Walk in the park',
                'Visit a local museum or gallery'
              ]
        });

        setLastAnalyzed(compatibilityData.last_analyzed_at);
      }

      // Simulate emotional signals analysis (would come from message analysis)
      setEmotionalSignals({
        overall_sentiment: 'Positive',
        vulnerability_level: 65,
        engagement_score: 78,
        communication_style: 'Thoughtful and warm'
      });

    } catch (error) {
      console.error('Error loading AI digest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewAnalysis = async () => {
    if (!user || !otherUserId) return;

    setLoading(true);
    try {
      await supabase.functions.invoke('analyze-connection-dna', {
        body: {
          analysisType: 'compatibility_analysis',
          targetUserId: otherUserId
        }
      });
      
      // Reload data after analysis
      await loadAIDigestData();
    } catch (error) {
      console.error('Error generating analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedMatch) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-muted-foreground">AI Digest</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Select a conversation to see emotional insights and compatibility analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isCompletePlus) {
    return (
      <Card className="h-full">
        <CardHeader className="text-center pb-4">
          <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
          <CardTitle className="text-lg">AI Digest</CardTitle>
          <CardDescription className="text-sm">
            AI Digest is part of Complete Plus. Upgrade to unlock emotional summaries and compatibility insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-primary" />
              <span>Emotional signals</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-primary" />
              <span>Compatibility highlights</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span>Suggested next steps</span>
            </div>
          </div>
          
          <Separator />
          
          <Button 
            onClick={() => navigate('/pricing')}
            className="w-full"
            size="sm"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Complete Plus
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Digest</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Plus
          </Badge>
        </div>
        <CardDescription className="text-sm">
          Insights for your conversation with {otherUserName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-muted-foreground">Analyzing conversation...</p>
          </div>
        ) : (
          <>
            {/* Emotional Signals */}
            {emotionalSignals && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  Emotional Signals
                </h4>
                <div className="space-y-2 pl-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overall Tone:</span>
                    <Badge variant="outline" className="text-xs">
                      {emotionalSignals.overall_sentiment}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engagement:</span>
                    <span className="font-medium">{emotionalSignals.engagement_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Style:</span>
                    <span className="font-medium text-xs">{emotionalSignals.communication_style}</span>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Compatibility Highlights */}
            {compatibilityHighlights && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Compatibility
                </h4>
                <div className="space-y-2 pl-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Match Score:</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(compatibilityHighlights.compatibility_score)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Potential:</span>
                    <span className="font-medium text-xs">{compatibilityHighlights.connection_potential}</span>
                  </div>
                  {compatibilityHighlights.shared_interests.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-1">Shared Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {compatibilityHighlights.shared_interests.slice(0, 2).map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Suggested Next Steps */}
            {suggestedActions && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Next Steps
                </h4>
                <div className="space-y-3 pl-6">
                  {suggestedActions.conversation_starters.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-2">Try asking:</p>
                      <div className="space-y-1">
                        {suggestedActions.conversation_starters.slice(0, 2).map((starter, idx) => (
                          <p key={idx} className="text-xs italic bg-muted/50 p-2 rounded">
                            "{starter}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {suggestedActions.next_steps.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-2">Consider:</p>
                      <ul className="space-y-1">
                        {suggestedActions.next_steps.slice(0, 2).map((step, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Update Analysis Button */}
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateNewAnalysis}
                disabled={loading}
                className="w-full text-xs"
              >
                <TrendingUp className="h-3 w-3 mr-2" />
                {loading ? 'Updating...' : 'Update Analysis'}
              </Button>
              {lastAnalyzed && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Last updated {new Date(lastAnalyzed).toLocaleDateString()}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
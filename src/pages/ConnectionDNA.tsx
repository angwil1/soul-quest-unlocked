import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Heart, MessageSquare, Users, TrendingUp, Lightbulb, Target, Star, RefreshCw, Crown } from 'lucide-react';
import { format } from 'date-fns';

interface DNAProfile {
  id: string;
  emotional_intelligence_score: number;
  interaction_quality_score: number;
  empathy_score: number;
  vulnerability_comfort: number;
  communication_style: any;
  emotional_patterns: any;
  personality_markers: any;
  love_language_primary: string;
  love_language_secondary: string;
  conflict_resolution_style: string;
  last_analysis_at: string;
}

interface DNAInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  actionable_steps: string[];
  priority_level: string;
  category: string;
  confidence_level: number;
  is_read: boolean;
  created_at: string;
}

const ConnectionDNA = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Sample data for demo
  const [dnaProfile, setDnaProfile] = useState<DNAProfile | null>({
    id: '1',
    emotional_intelligence_score: 78,
    interaction_quality_score: 85,
    empathy_score: 72,
    vulnerability_comfort: 68,
    communication_style: {
      primary: 'Supportive',
      secondary: 'Direct',
      traits: ['active_listener', 'empathetic', 'clear_communicator']
    },
    emotional_patterns: {
      response_time: 'thoughtful',
      emotional_range: 'balanced',
      stress_indicators: ['quick_responses', 'shorter_messages']
    },
    personality_markers: {
      openness: 82,
      conscientiousness: 75,
      extraversion: 68,
      agreeableness: 88,
      neuroticism: 35
    },
    love_language_primary: 'quality_time',
    love_language_secondary: 'words_of_affirmation',
    conflict_resolution_style: 'collaborative',
    last_analysis_at: new Date().toISOString()
  });
  const [insights, setInsights] = useState<DNAInsight[]>([
    {
      id: '1',
      insight_type: 'communication_improvement',
      title: 'Enhance Emotional Validation',
      description: 'Your empathy score shows great potential. Focus on acknowledging your matches\' feelings before offering solutions.',
      actionable_steps: [
        'Start responses with "I can understand how that feels"',
        'Ask follow-up questions about emotions',
        'Share your own similar experiences when appropriate'
      ],
      priority_level: 'high',
      category: 'communication',
      confidence_level: 0.87,
      is_read: false,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      insight_type: 'vulnerability_growth',
      title: 'Comfort with Vulnerability',
      description: 'Your vulnerability comfort level suggests you might benefit from gradually sharing more personal experiences to deepen connections.',
      actionable_steps: [
        'Share one meaningful memory per week',
        'Express your authentic feelings about dates',
        'Ask deeper questions about values and dreams'
      ],
      priority_level: 'medium',
      category: 'emotional_growth',
      confidence_level: 0.75,
      is_read: false,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      insight_type: 'communication_strength',
      title: 'Natural Conversation Flow',
      description: 'Your interaction quality score is excellent! You naturally create engaging conversations that make others feel heard.',
      actionable_steps: [
        'Continue your supportive communication style',
        'Use your natural listening skills as a strength',
        'Help others open up by sharing first'
      ],
      priority_level: 'low',
      category: 'strengths',
      confidence_level: 0.92,
      is_read: true,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [hasAICompleteMe, setHasAICompleteMe] = useState(true); // Demo: showing premium experience

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setHasAICompleteMe(false);
        return;
      }

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('unlocked_beyond_badge_enabled')
          .eq('id', user.id)
          .single();
        
        setHasAICompleteMe(profileData?.unlocked_beyond_badge_enabled || false);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasAICompleteMe(false);
      }
    };

    checkSubscription();
  }, [user]);

  useEffect(() => {
    if (user && hasAICompleteMe) {
      fetchDNAData();
    } else {
      setLoading(false);
    }
  }, [user, hasAICompleteMe]);

  const fetchDNAData = async () => {
    try {
      const [profileRes, insightsRes] = await Promise.all([
        supabase.from('connection_dna_profiles').select('*').eq('user_id', user?.id).single(),
        supabase.from('connection_dna_insights').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
      ]);

      if (profileRes.data) {
        setDnaProfile(profileRes.data);
      }
      
      if (insightsRes.data) {
        const typedInsights = insightsRes.data.map(insight => ({
          ...insight,
          actionable_steps: Array.isArray(insight.actionable_steps) 
            ? insight.actionable_steps 
            : typeof insight.actionable_steps === 'string' 
              ? [insight.actionable_steps]
              : []
        })) as DNAInsight[];
        setInsights(typedInsights);
      }
    } catch (error) {
      console.error('Error fetching DNA data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!user) return;

    setAnalyzing(true);
    try {
      // Run profile analysis
      const { error } = await supabase.functions.invoke('analyze-connection-dna', {
        body: {
          analysisType: 'profile_analysis'
        }
      });

      if (error) throw error;

      // Generate new insights
      await supabase.functions.invoke('analyze-connection-dna', {
        body: {
          analysisType: 'generate_insights'
        }
      });

      toast({
        title: "Analysis Complete!",
        description: "Your Connection DNA has been updated with new insights."
      });

      // Refresh data
      await fetchDNAData();
    } catch (error) {
      console.error('Error running analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to update your Connection DNA. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Developing';
    return 'Needs Growth';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your Connection DNA...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Connection DNA</h1>
          <p className="text-xl text-muted-foreground mb-8">Please log in to access your Connection DNA</p>
          <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (!hasAICompleteMe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🧬</div>
            <h1 className="text-4xl font-bold mb-4">Connection DNA</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connection DNA is part of AI Complete Me. Upgrade to explore your evolving compatibility profile.
            </p>
            <div className="bg-card rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">What Connection DNA reveals:</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-center">
                  <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-medium">Emotional Intelligence</h4>
                  <p className="text-sm text-muted-foreground">Track your EQ growth over time</p>
                </div>
                <div className="text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-medium">Love Language</h4>
                  <p className="text-sm text-muted-foreground">Discover how you give and receive love</p>
                </div>
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium">Communication Style</h4>
                  <p className="text-sm text-muted-foreground">Understand your interaction patterns</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium">Compatibility Analysis</h4>
                  <p className="text-sm text-muted-foreground">AI-powered match insights</p>
                </div>
              </div>
            </div>
            <Button onClick={() => window.location.href = '/pricing'} size="lg">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to AI Complete Me
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧬</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Connection DNA
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Your evolving emotional intelligence for deeper connections
          </p>
          <Button onClick={runAnalysis} disabled={analyzing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'Analyzing...' : 'Update Analysis'}
          </Button>
        </div>

        {!dnaProfile ? (
          <Card className="text-center py-12">
            <CardContent>
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Building Your Connection DNA</h3>
              <p className="text-muted-foreground mb-6">
                We need to analyze your interactions to create your unique emotional intelligence profile.
              </p>
              <Button onClick={runAnalysis} disabled={analyzing}>
                <Brain className="h-4 w-4 mr-2" />
                {analyzing ? 'Analyzing...' : 'Create My DNA Profile'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                <Brain className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Lightbulb className="h-4 w-4 mr-2" />
                Insights ({insights.filter(i => !i.is_read).length})
              </TabsTrigger>
              <TabsTrigger value="growth">
                <TrendingUp className="h-4 w-4 mr-2" />
                Growth
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Emotional Intelligence Scores */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      Emotional IQ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2 text-purple-600">
                      {Math.round(dnaProfile.emotional_intelligence_score)}
                    </div>
                    <Progress value={dnaProfile.emotional_intelligence_score} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {getScoreDescription(dnaProfile.emotional_intelligence_score)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Empathy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2 text-red-600">
                      {Math.round(dnaProfile.empathy_score)}
                    </div>
                    <Progress value={dnaProfile.empathy_score} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {getScoreDescription(dnaProfile.empathy_score)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2 text-blue-600">
                      {Math.round(dnaProfile.interaction_quality_score)}
                    </div>
                    <Progress value={dnaProfile.interaction_quality_score} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {getScoreDescription(dnaProfile.interaction_quality_score)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      Vulnerability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2 text-green-600">
                      {Math.round(dnaProfile.vulnerability_comfort)}
                    </div>
                    <Progress value={dnaProfile.vulnerability_comfort} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {getScoreDescription(dnaProfile.vulnerability_comfort)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Love Language & Communication Style */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Love Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dnaProfile.love_language_primary && (
                      <div>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                          Primary: {dnaProfile.love_language_primary.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}
                    {dnaProfile.love_language_secondary && (
                      <div>
                        <Badge variant="outline">
                          Secondary: {dnaProfile.love_language_secondary.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}
                    {!dnaProfile.love_language_primary && (
                      <p className="text-sm text-muted-foreground">
                        Continue interacting to discover your love language
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      Communication Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dnaProfile.communication_style?.primary ? (
                      <div className="space-y-2">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          {dnaProfile.communication_style.primary}
                        </Badge>
                        {dnaProfile.communication_style.secondary && (
                          <Badge variant="outline">
                            {dnaProfile.communication_style.secondary}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Analyzing your communication patterns...
                      </p>
                    )}
                    {dnaProfile.conflict_resolution_style && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">Conflict Style:</p>
                        <Badge variant="secondary">{dnaProfile.conflict_resolution_style}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Last Analysis */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Analysis</p>
                      <p className="font-medium">{format(new Date(dnaProfile.last_analysis_at), 'PPP')}</p>
                    </div>
                    <Button variant="outline" onClick={runAnalysis} disabled={analyzing}>
                      Update Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {insights.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No insights yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Keep interacting to generate personalized insights
                    </p>
                    <Button onClick={runAnalysis} disabled={analyzing}>
                      Generate Insights
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                insights.map((insight) => (
                  <Card key={insight.id} className={`${!insight.is_read ? 'border-primary' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {insight.priority_level === 'high' && <Star className="h-4 w-4 text-yellow-500" />}
                            {insight.title}
                            {!insight.is_read && <Badge variant="default">New</Badge>}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <Badge variant="outline">{insight.category}</Badge>
                            <Badge variant="secondary" className="ml-2">{insight.priority_level} priority</Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{insight.description}</p>
                      {insight.actionable_steps.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Action Steps:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {insight.actionable_steps.map((step, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="growth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Tracking</CardTitle>
                  <CardDescription>
                    Your emotional intelligence development over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Growth charts coming soon</h3>
                    <p className="text-muted-foreground">
                      Continue using the app to build your growth history
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ConnectionDNA;
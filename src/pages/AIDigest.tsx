import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAIDigest } from '@/hooks/useAIDigest';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Clock, Sparkles, MessageCircle, TrendingUp, Calendar, Users, Crown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIDigest = () => {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { 
    digest, 
    digests, 
    loading, 
    generating, 
    generateAIDigest, 
    loadAllDigests, 
    hasTodayDigest 
  } = useAIDigest();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");

  const handleGenerateDigest = async () => {
    await generateAIDigest();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "history") {
      loadAllDigests();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="p-4 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Please sign in to view your AI digest summaries.</p>
              <Button onClick={() => navigate('/auth')} className="mt-4">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Premium feature check
  if (!subscription?.subscribed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="p-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <Crown className="h-8 w-8 text-primary" />
              AI Digest Summaries
            </h1>
            <p className="text-muted-foreground text-lg">
              Personalized insights and compatibility analysis powered by AI
            </p>
          </div>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader className="text-center">
              <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Premium Feature</CardTitle>
              <CardDescription className="text-lg">
                AI Digest Summaries are exclusive to Unlocked+ members
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Personalized daily compatibility insights</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>AI-generated conversation starters</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Match analysis and behavioral patterns</span>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Historical digest tracking</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Upgrade to Unlocked+ to unlock AI-powered insights that help you understand your dating patterns and improve your connections.
                </p>
                <Button 
                  onClick={() => navigate('/pricing')} 
                  size="lg"
                  className="min-w-[200px]"
                >
                  Upgrade to Unlocked+
                </Button>
                <p className="text-sm text-muted-foreground">
                  Starting at just $12/month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-primary" />
            AI Digest Summaries
            <Badge variant="secondary" className="ml-2">Premium</Badge>
          </h1>
          <p className="text-muted-foreground text-lg">
            Personalized insights and compatibility analysis powered by AI
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today's Digest
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {!hasTodayDigest ? (
              <Card className="border-dashed border-2 border-muted">
                <CardHeader className="text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle>No Digest Generated Today</CardTitle>
                  <CardDescription>
                    Generate your personalized AI digest to see compatibility insights and conversation starters
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={handleGenerateDigest} 
                    disabled={generating}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    {generating ? "Generating..." : "Generate AI Digest"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    This may take a few moments while AI analyzes your matches
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Greeting & Summary */}
                {digest?.digest_content?.greeting && (
                  <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Daily Greeting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg leading-relaxed">
                        {digest.digest_content.greeting}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* New Compatible Profiles */}
                {digest?.new_compatible_profiles && digest.new_compatible_profiles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        New Compatible Profiles
                      </CardTitle>
                      <CardDescription>
                        Fresh matches with high compatibility potential
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {digest.new_compatible_profiles.map((profile, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{profile.name}</h4>
                            <Badge variant="secondary">
                              {Math.round(profile.compatibility_score * 100)}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {profile.summary}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* AI Insights */}
                {digest?.digest_content?.insights && digest.digest_content.insights.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        AI Insights
                      </CardTitle>
                      <CardDescription>
                        Personalized observations about your dating patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {digest.digest_content.insights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Conversation Starters */}
                {digest?.ai_conversation_starters && digest.ai_conversation_starters.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        AI Conversation Starters
                      </CardTitle>
                      <CardDescription>
                        Personalized opening lines for your best matches
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {digest.ai_conversation_starters.map((starter, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{starter.name}</h5>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate('/messages')}
                            >
                              Send Message
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground italic">
                            "{starter.starter}"
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Motivation */}
                {digest?.digest_content?.motivation && (
                  <Card className="bg-gradient-to-br from-secondary/5 to-background border-secondary/20">
                    <CardContent className="pt-6">
                      <p className="text-center text-lg leading-relaxed font-medium">
                        {digest.digest_content.motivation}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Regenerate Button */}
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateDigest} 
                    disabled={generating}
                  >
                    {generating ? "Regenerating..." : "Regenerate Digest"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p>Loading digest history...</p>
                </CardContent>
              </Card>
            ) : digests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No digest history found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {digests.map((historicalDigest) => (
                  <Card key={historicalDigest.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {new Date(historicalDigest.digest_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </CardTitle>
                          <CardDescription>
                            Generated {new Date(historicalDigest.generated_at).toLocaleTimeString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">
                          {historicalDigest.new_compatible_profiles?.length || 0} new matches
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {historicalDigest.digest_content?.greeting && (
                          <p className="text-sm text-muted-foreground">
                            {historicalDigest.digest_content.greeting}
                          </p>
                        )}
                        
                        {historicalDigest.new_compatible_profiles && historicalDigest.new_compatible_profiles.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">New Matches:</h5>
                            <div className="flex flex-wrap gap-2">
                              {historicalDigest.new_compatible_profiles.map((profile, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {profile.name} ({Math.round(profile.compatibility_score * 100)}%)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIDigest;
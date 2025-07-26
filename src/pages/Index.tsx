import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<Array<{id: number; question: string; answer: string}>>([]);

  useEffect(() => {
    // Remove automatic redirect - let users see the landing page with login buttons
    
    // Fetch FAQs for the "What Makes Us Different" section
    const fetchFaqs = async () => {
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .in('id', [3, 6, 10]) // AI matchmaking, data deletion, privacy
        .order('id');
      
      if (data) {
        setFaqs(data);
      }
    };
    
    fetchFaqs();
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section for non-logged in users */}
          <div className="text-center mb-12 mt-16">
            <h1 className="text-5xl font-bold mb-6">Dating with depth, powered by trust.</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Because real connection isn't rare, it's just waiting for the right space.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Get Started
              </Button>
              <Button 
                onClick={() => navigate('/auth')} 
                variant="outline" 
                size="lg"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* What Makes Us Different Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🔐</span>
                    Privacy First, Always
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    No ads. No tracking. No selling your data. You're here to connect — not to be commodified. We never compromise on user trust.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    AI That Respects You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Our matchmaking uses AI to spark real compatibility — not swipe fatigue. You'll receive digestible insights designed to help you reflect, not react.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">💬</span>
                    Designed for Conversation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Read receipts, undo deletes, visibility boosts — these aren't gimmicks. They're tools to support meaningful dialogue, not manipulate behavior.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🎁</span>
                    Pricing That Feels Human
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    $5/month for premium access isn't a paywall — it's a support signal. We keep things gentle, clear, and optional. Because love should never feel like a transaction.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🌱</span>
                    Built by Someone Who Gets It
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    GetUnlocked isn't VC-backed or mass-produced. It's handcrafted by someone who's lived this — and who believes technology can nurture deeper connection.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">Dating with depth, powered by trust.</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Because real connection isn't rare, it's just waiting for the right space.
          </p>
          <Button 
            onClick={() => navigate('/questions')} 
            size="lg"
            className="text-lg px-8 py-6"
          >
            Take the Compatibility Quiz
          </Button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Welcome to GetUnlocked</h2>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/profile')} variant="outline">
              My Profile
            </Button>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your dating profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/profile')} className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discover</CardTitle>
              <CardDescription>Find your perfect match</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/matches')} className="w-full">
                Start Matching
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Chat with your matches</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-4">Unlock Premium Features</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Take your dating experience to the next level
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Visibility Boost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get shown to more compatible matches and increase your profile visibility by up to 10x.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  AI Digest Summaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive personalized daily summaries of your best matches with AI-powered compatibility insights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  Read Receipts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Know when your messages have been read and never wonder about your conversation status again.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            {subscription?.subscribed ? (
              <div className="space-y-4">
                <p className="text-lg font-medium text-green-600">
                  You're subscribed to {subscription.subscription_tier}!
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                >
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/pricing')}
              >
                View Pricing Plans
              </Button>
            )}
          </div>
        </div>

        {/* What Makes Us Different Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🔐</span>
                  Privacy First, Always
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  No ads. No tracking. No selling your data. You're here to connect — not to be commodified. We never compromise on user trust.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  AI That Respects You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Our matchmaking uses AI to spark real compatibility — not swipe fatigue. You'll receive digestible insights designed to help you reflect, not react.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  Designed for Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Read receipts, undo deletes, visibility boosts — these aren't gimmicks. They're tools to support meaningful dialogue, not manipulate behavior.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  Pricing That Feels Human
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  $5/month for premium access isn't a paywall — it's a support signal. We keep things gentle, clear, and optional. Because love should never feel like a transaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  Built by Someone Who Gets It
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  GetUnlocked isn't VC-backed or mass-produced. It's handcrafted by someone who's lived this — and who believes technology can nurture deeper connection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Welcome to GetUnlocked!</CardTitle>
            <CardDescription>Your secure dating app dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your account is now secure with proper authentication and data protection. Start by setting up your profile to begin connecting with others!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

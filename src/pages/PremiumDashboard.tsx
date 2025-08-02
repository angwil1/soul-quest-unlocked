import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PriorityMatchingWidget } from '@/components/PriorityMatchingWidget';
import { VideoCallButton } from '@/components/VideoCallButton';
import { Crown, Sparkles, Settings, BarChart3 } from 'lucide-react';

const PremiumDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading premium dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const isSubscribed = subscription?.subscribed || false;
  const subscriptionTier = subscription?.subscription_tier;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Premium Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-4">
            Manage your premium features and enhanced dating experience
          </p>
          {isSubscribed && (
            <Badge className="bg-gradient-to-r from-purple-500 to-primary text-white text-sm px-4 py-1">
              <Crown className="h-4 w-4 mr-2" />
              {subscriptionTier} Member
            </Badge>
          )}
        </div>

        {/* Subscription Status */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Premium Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {isSubscribed ? (
                <div>
                  <p className="text-lg font-medium text-green-600 mb-2">
                    🎉 You're subscribed to {subscriptionTier}!
                  </p>
                  {subscription?.subscription_end && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Renews on {new Date(subscription.subscription_end).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-4 justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/subscription')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Button>
                    <Button 
                      onClick={() => navigate('/ai-digest')}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View AI Digest
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Unlock premium features to enhance your dating experience
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/subscription')}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Premium Features Grid */}
        <div className="grid gap-6 mb-8">
          {/* Priority Matching Widget */}
          <PriorityMatchingWidget />

          {/* Video Chat Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                Video Chat with Matches
                <Badge variant="secondary" className="text-xs">Premium</Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Connect face-to-face with your compatible matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <VideoCallButton matchName="Demo Match" variant="default" size="lg" className="w-full sm:w-auto" />
                <p className="text-sm text-muted-foreground">
                  Premium feature available with Unlocked+ subscription
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Benefits Section */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
              <Sparkles className="h-5 w-5" />
              Premium Benefits
            </CardTitle>
            <CardDescription>Why premium members have 3x more meaningful connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center p-4 bg-white/50 dark:bg-background/50 rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold mb-1 text-sm">Priority Visibility</h3>
                <p className="text-xs text-muted-foreground">Get seen by more compatible matches</p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-background/50 rounded-lg">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold mb-1 text-sm">Video Chat</h3>
                <p className="text-xs text-muted-foreground">Face-to-face connections with matches</p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-background/50 rounded-lg">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-semibold mb-1 text-sm">AI Insights</h3>
                <p className="text-xs text-muted-foreground">Personalized compatibility summaries</p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-background/50 rounded-lg">
                <div className="text-2xl mb-2">✓</div>
                <h3 className="font-semibold mb-1 text-sm">Read Receipts</h3>
                <p className="text-xs text-muted-foreground">Know when messages are read</p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-background/50 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1 text-sm">Smart Matching</h3>
                <p className="text-xs text-muted-foreground">Enhanced compatibility algorithms</p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-background/50 rounded-lg">
                <div className="text-2xl mb-2">🔓</div>
                <h3 className="font-semibold mb-1 text-sm">Exclusive Features</h3>
                <p className="text-xs text-muted-foreground">Access to beta features first</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Explore Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/matches')} className="w-full" variant="outline">
                Find Connections
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/profile')} className="w-full" variant="outline">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/messages')} className="w-full" variant="outline">
                View Chats
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/subscription')} className="w-full" variant="outline">
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PremiumDashboard;
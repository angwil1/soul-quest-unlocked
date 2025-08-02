import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Heart, MessageCircle, Eye, Sparkles, Star, Zap, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { UnlockedBeyondBadgeToggle } from '@/components/UnlockedBeyondBadgeToggle';
import { UnlockedMode } from '@/components/UnlockedMode';

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription, loading, checkSubscription, createCheckout, manageBilling } = useSubscription();
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const currentTier = 'Unlocked';
  const isSubscribed = subscription?.subscribed || false;

  const handleUpgrade = async (plan: string) => {
    setUpgrading(true);
    try {
      await createCheckout(plan);
    } catch (error) {
      toast({
        title: "Error creating checkout",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUpgrading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      await manageBilling();
    } catch (error) {
      toast({
        title: "Error opening billing portal",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const tiers = [
    {
      name: 'Free',
      icon: '',
      price: '$0/month',
      description: 'Opens curiosity, perfect for getting started',
      features: [
        'Take the compatibility quiz',
        'View matches',
        'Limited messaging',
        'Explore onboarding questions and sample prompts',
        'Feel the brand before committing'
      ],
      current: !isSubscribed,
      buttonText: 'Current Plan',
      disabled: true,
      plan: null
    },
    {
      name: '🔓 Unlocked+',
      icon: '',
      price: '$12/month',
      description: 'Offers the upgrade logic for better connections',
      features: [
        'Video chat with matches',
        'AI Digest summaries',
        'Priority matching',
        'All free features'
      ],
      current: subscription?.subscription_tier === 'Premium' && isSubscribed,
      buttonText: subscription?.subscription_tier === 'Premium' && isSubscribed ? 'Current Plan' : 'Get Unlocked+',
      disabled: subscription?.subscription_tier === 'Premium' && isSubscribed,
      plan: 'unlocked-plus'
    },
    {
      name: '🔓 Unlocked Beyond',
      icon: '',
      price: '$39/year',
      description: 'An invitation to co-create our community',
      features: [
        'Lifetime access to all Unlocked+ features',
        '"Unlocked Beyond" badge on profile (optional)',
        'Unlocked Mode: values-first compatibility journeys',
        'Memory Vault: revisit favorite moments, prompts, and saved matches',
        'Connection DNA: evolving emotional intelligence for deeper match potential'
      ],
      current: subscription?.subscription_tier === 'Pro' && isSubscribed,
      buttonText: subscription?.subscription_tier === 'Pro' && isSubscribed ? 'Current Plan' : 'Get Unlocked Beyond',
      disabled: subscription?.subscription_tier === 'Pro' && isSubscribed,
      plan: 'unlocked-beyond'
    },
    {
      name: '🔓 Unlocked Echo',
      icon: '',
      price: '$4/month',
      description: 'Expressive upgrade for creative visibility',
      features: [
        'TikTok-style profile embed (optional)',
        'Emotional soundtrack prompts',
        'Discoverability via vibe gallery',
        'Echo badge toggle'
      ],
      current: false,
      buttonText: 'Get Echo Monthly',
      disabled: false,
      plan: 'unlocked-echo-monthly',
      isEcho: true,
      highlight: true,
      alternativeOption: {
        price: '$12',
        period: 'one-time',
        buttonText: 'Unlock Echo Forever',
        plan: 'unlocked-echo-lifetime'
      }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscription details...</p>
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Your Subscription
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-2">
            You're currently in <span className="font-semibold text-primary">'{currentTier}'</span> — explore deeper connections with our premium tiers.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground">
            Add Unlocked Echo to any plan, or purchase on its own. Expression isn't reserved for premium—it's available to all.
          </p>
        </div>

        {/* Current Status Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <Badge variant={isSubscribed ? "default" : "secondary"} className="text-lg px-4 py-1">
                {currentTier}
              </Badge>
              {isSubscribed && subscription?.subscription_end && (
                <p className="text-sm text-muted-foreground">
                  Renews on {new Date(subscription.subscription_end).toLocaleDateString()}
                </p>
              )}
              {isSubscribed && (
                <Button 
                  variant="outline" 
                  onClick={handleManageBilling}
                  className="mt-4"
                >
                  Manage Billing
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {tiers.map((tier) => {
            const isEcho = 'isEcho' in tier && tier.isEcho;
            const isHighlight = 'highlight' in tier && tier.highlight;
            
            return (
              <Card 
                key={tier.name} 
                className={`relative ${
                  tier.current ? 'border-primary ring-2 ring-primary/20' : 
                  isHighlight ? 'border-purple-300 ring-2 ring-purple-200 shadow-lg' :
                  'border-border'
                } hover:shadow-lg transition-all duration-300`}
              >
                {tier.current ? (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Current Plan
                  </Badge>
                ) : isEcho ? (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                    Add-On
                  </Badge>
                ) : null}
                
                <CardHeader className="text-center px-4 py-4">
                  <div className="flex justify-center mb-2">
                    <span className="text-3xl sm:text-4xl">{tier.icon}</span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{tier.description}</CardDescription>
                  <div className="text-2xl sm:text-3xl font-bold text-primary mt-2">{tier.price}</div>
                </CardHeader>
                
                <CardContent className="px-4 pb-4">
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {(tier as any).alternativeOption ? (
                    <div className="space-y-2">
                      <Button 
                        className={`w-full ${isEcho ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                        variant="outline"
                        disabled={tier.disabled || upgrading}
                        onClick={() => tier.plan && handleUpgrade(tier.plan)}
                      >
                        {upgrading && tier.plan ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            Processing...
                          </div>
                        ) : (
                          tier.buttonText
                        )}
                      </Button>
                      <div className="text-center text-xs text-muted-foreground">or</div>
                      <Button 
                        className={`w-full ${isEcho ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                        variant="default"
                        disabled={tier.disabled || upgrading}
                        onClick={() => (tier as any).alternativeOption.plan && handleUpgrade((tier as any).alternativeOption.plan)}
                      >
                        {upgrading && (tier as any).alternativeOption.plan ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            Processing...
                          </div>
                        ) : (
                          (tier as any).alternativeOption.buttonText
                        )}
                      </Button>
                      <div className="text-center text-xs text-muted-foreground">
                        {(tier as any).alternativeOption.price} {(tier as any).alternativeOption.period}
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className={`w-full ${isEcho ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                      variant={tier.current ? "secondary" : "default"}
                      disabled={tier.disabled || upgrading}
                      onClick={() => tier.plan && handleUpgrade(tier.plan)}
                    >
                      {upgrading && tier.plan ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                          Processing...
                        </div>
                      ) : (
                        tier.buttonText
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Unlocked Mode Feature */}
        <div className="mb-8">
          <UnlockedMode />
        </div>

        {/* Badge Settings for Unlocked Beyond subscribers */}
        {subscription?.subscription_tier === 'Pro' && subscription?.subscribed && (
          <div className="mb-8">
            <UnlockedBeyondBadgeToggle />
          </div>
        )}

        {/* Benefits Section */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
              <Sparkles className="h-5 w-5" />
              Why Upgrade?
            </CardTitle>
            <CardDescription>Premium members experience 3x more meaningful connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">See Who Likes You</h3>
                <p className="text-sm text-muted-foreground">No more guessing games</p>
              </div>
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Unlimited Messaging</h3>
                <p className="text-sm text-muted-foreground">Chat without limits</p>
              </div>
              <div className="text-center">
                <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Priority Visibility</h3>
                <p className="text-sm text-muted-foreground">Get seen by more people</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Premium Features</h3>
                <p className="text-sm text-muted-foreground">Advanced matching & more</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
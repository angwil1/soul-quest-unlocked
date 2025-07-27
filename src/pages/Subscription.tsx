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

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription, loading, checkSubscription, createCheckout, manageBilling } = useSubscription();
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const currentTier = subscription?.subscription_tier || 'Unlocked';
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
      icon: '🌱',
      price: 'Free',
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
      name: 'Unlocked+',
      icon: '💬',
      price: '$12/month',
      description: 'Offers the upgrade logic for better connections',
      features: [
        'Video chat with matches',
        'AI Digest summaries',
        'Priority matching',
        'All Unlocked features'
      ],
      current: currentTier === 'Premium' && isSubscribed,
      buttonText: currentTier === 'Premium' && isSubscribed ? 'Current Plan' : 'Get Unlocked+',
      disabled: currentTier === 'Premium' && isSubscribed,
      plan: 'unlocked-plus'
    },
    {
      name: 'Unlocked Beyond',
      icon: '🔮',
      price: '$39/year',
      description: 'An invitation to co-create our community',
      features: [
        'Lifetime access to all Unlocked+ features',
        '"Unlocked Beyond" badge on profile (optional)',
        'Unlocked Mode: values-first compatibility journeys',
        'Memory Vault: revisit favorite moments, prompts, and saved matches',
        'Connection DNA: evolving emotional intelligence for deeper match potential'
      ],
      current: currentTier === 'Pro' && isSubscribed,
      buttonText: currentTier === 'Pro' && isSubscribed ? 'Current Plan' : 'Get Unlocked Beyond',
      disabled: currentTier === 'Pro' && isSubscribed,
      plan: 'unlocked-beyond'
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Your Subscription
          </h1>
          <p className="text-xl text-muted-foreground">
            You're currently in <span className="font-semibold text-primary">'{currentTier}'</span> — explore deeper connections with our premium tiers.
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
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {tiers.map((tier) => {
            return (
              <Card 
                key={tier.name} 
                className={`relative ${tier.current ? 'border-primary ring-2 ring-primary/20' : 'border-border'} hover:shadow-lg transition-all duration-300`}
              >
                {tier.current && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Current Plan
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    <span className="text-4xl">{tier.icon}</span>
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="text-3xl font-bold text-primary mt-2">{tier.price}</div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
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
                </CardContent>
              </Card>
            );
          })}
        </div>

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
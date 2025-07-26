import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { subscription, loading, createCheckout } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Take the compatibility quiz",
        "View matches", 
        "Limited messaging"
      ],
      restrictedFeatures: [
        "Video chat"
      ],
      buttonText: "Current Plan",
      plan: null,
      popular: false
    },
    {
      name: "Unlocked",
      price: "$5",
      period: "/month",
      description: "Supporting something meaningful",
      features: [
        "Video chat with matches",
        "Read receipts",
        "Undo delete", 
        "Visibility boost",
        "All Free features"
      ],
      buttonText: "Get Unlocked",
      plan: "unlocked",
      popular: true
    },
    {
      name: "Unlocked+",
      price: "$12",
      period: "/month", 
      description: "Investment in better connections",
      features: [
        "Video chat with matches",
        "AI Digest summaries",
        "Priority matching",
        "All Unlocked features"
      ],
      buttonText: "Get Unlocked+",
      plan: "unlocked-plus",
      popular: false
    },
    {
      name: "Founder's Circle",
      price: "$39",
      period: "/year",
      description: "Join our community",
      features: [
        "Video chat with matches",
        "Lifetime Unlocked+ access",
        "Personal welcome note from founder",
        "Early tool access"
      ],
      buttonText: "Join Founder's Circle",
      plan: "founders-circle",
      popular: false
    }
  ];

  const handleSubscribe = (plan: string | null) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (plan) {
      createCheckout(plan);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription?.subscribed) return "Free";
    return subscription.subscription_tier || "Unknown";
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">GetUnlocked Pricing Plans</h1>
          <p className="text-lg text-muted-foreground mb-2">Gentler Edition</p>
          <p className="text-muted-foreground">
            Choose the plan that feels right for your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = getCurrentPlan() === plan.name;
            const isFree = plan.name === "Free";
            
            return (
              <Card 
                key={plan.name} 
                className={`relative ${
                  plan.popular 
                    ? "border-primary shadow-lg scale-105" 
                    : "border-border"
                } ${isCurrentPlan ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                    Current Plan
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.restrictedFeatures?.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-red-500">✗</span>
                        <span className="text-sm text-muted-foreground line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full mt-6"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={loading || isCurrentPlan || isFree}
                    onClick={() => handleSubscribe(plan.plan)}
                  >
                    {isCurrentPlan ? "Current Plan" : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include our core matching experience. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

const Pricing = () => {
  const { subscription, loading, createCheckout } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      icon: "",
      price: "$0",
      period: "/month",
      description: "Opens curiosity, perfect for getting started",
      features: [
        "Take the compatibility quiz",
        "View matches", 
        "Limited messaging",
        "Explore onboarding questions and sample prompts",
        "Feel the brand before committing"
      ],
      restrictedFeatures: [
        "Video chat"
      ],
      buttonText: "Current Plan",
      plan: null,
      popular: false
    },
    {
      name: "Complete Plus 💖",
      icon: "",
      price: "$12",
      period: "/month", 
      description: "Offers the upgrade logic for better connections",
      features: [
        "Video chat with matches",
        "AI Digest summaries",
        "Priority matching",
        "All free features"
      ],
      buttonText: "Get Complete Plus",
      plan: "unlocked-plus",
      popular: false
    },
    {
      name: "Complete Beyond 🌌",
      icon: "",
      price: "$39",
      period: "/year",
      description: "An invitation to co-create our community",
      features: [
        "Lifetime access to all Complete Plus features",
        "\"Complete Beyond\" badge on profile (optional)",
        "Unlocked Mode: values-first compatibility journeys",
        "Memory Vault: revisit favorite moments, prompts, and saved matches",
        "Connection DNA: evolving emotional intelligence for deeper match potential"
      ],
      buttonText: "Get Complete Beyond",
      plan: "unlocked-beyond",
      popular: false,
      hoverTexts: {
        "Unlocked Mode: values-first compatibility journeys": "Find clarity in Unlocked Mode",
        "Memory Vault: revisit favorite moments, prompts, and saved matches": "Your vault of remembered connections"
      }
    },
    {
      name: "Echo Amplified 🪞",
      icon: "",
      price: "$4",
      period: "/month",
      description: "Every Echo holds its own rhythm—quiet reflection for 3 days, and the option to complete after 7.",
      features: [
        "TikTok-style profile embed (optional)",
        "Emotional soundtrack prompts",
        "Discoverability via vibe gallery",
        "Echo badge toggle",
        "7-day Echo completion arc with gentle flois"
      ],
      buttonText: "Get Echo Monthly",
      plan: "unlocked-echo-monthly",
      popular: false,
      isAddOn: true,
      alternativeOption: {
        price: "$12",
        period: "one-time",
        buttonText: "Unlock Echo Forever",
        plan: "unlocked-echo-lifetime"
      }
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
          <h1 className="text-4xl font-bold mb-4">AI Complete Me Pricing Plans</h1>
          <p className="text-lg text-muted-foreground mb-2">Gentle by design. Emotionally intelligent by intention.</p>
          <p className="text-muted-foreground mb-4">
            Choose the plan that resonates with your journey toward deeper connection.
          </p>
          <div className="inline-block bg-muted/50 rounded-lg px-4 py-2 text-sm text-muted-foreground">
            💡 Spend $12/month or unlock everything for just $39/year—a quiet nudge toward completeness.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = getCurrentPlan() === plan.name.replace(" 💖", "").replace(" 🌌", "").replace(" 🪞", "");
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
                {isCurrentPlan ? (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                    Current Plan
                  </Badge>
                ) : plan.popular ? (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                ) : plan.isAddOn ? (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                    Add-On
                  </Badge>
                ) : null}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                    <span className="text-2xl">{plan.icon}</span>
                    {plan.name}
                  </CardTitle>
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

                  {plan.isAddOn && plan.alternativeOption ? (
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        variant="outline"
                        disabled={loading || isCurrentPlan}
                        onClick={() => handleSubscribe(plan.plan)}
                      >
                        {plan.buttonText}
                      </Button>
                      <div className="text-center text-xs text-muted-foreground">or</div>
                      <Button 
                        className="w-full"
                        variant="default"
                        disabled={loading || isCurrentPlan}
                        onClick={() => handleSubscribe(plan.alternativeOption.plan)}
                      >
                        {plan.alternativeOption.buttonText}
                      </Button>
                      <div className="text-center text-xs text-muted-foreground">
                        {plan.alternativeOption.price} {plan.alternativeOption.period}
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full mt-6"
                      variant={plan.popular ? "default" : "outline"}
                      disabled={loading || isCurrentPlan || isFree}
                      onClick={() => handleSubscribe(plan.plan)}
                    >
                      {isCurrentPlan ? "Current Plan" : plan.buttonText}
                    </Button>
                  )}
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
      <Footer />
    </div>
  );
};

export default Pricing;
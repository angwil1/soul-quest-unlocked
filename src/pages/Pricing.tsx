import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const subscription = null; // Simplified without subscription
  const loading = false;

  const plans = [
    {
      name: "Quiet Start",
      icon: "🌱",
      price: "$0",
      period: "/month",
      description: "A gentle introduction to meaningful connections.",
      features: [
        "Complete your profile",
        "View matches", 
        "Limited messaging",
        "Explore onboarding questions and sample prompts",
        "Feel the brand before committing"
      ],
      restrictedFeatures: [
        "Video chat"
      ],
      buttonText: "Start Quietly – Free",
      plan: null,
      popular: false
    },
    {
      name: "Complete Plus",
      icon: "✨",
      price: "$12",
      period: "/month", 
      description: "Offers the upgrade logic for better connections.",
      features: [
        "Video chat with matches",
        "AI Digest summaries",
        "Priority matching",
        "All Quiet Start features"
      ],
      buttonText: "Upgrade to Complete Plus – $12/mo",
      plan: "unlocked-plus",
      popular: false
    },
    {
      name: "Complete Beyond 🌌",
      icon: "",
      price: "$39",
      period: "/year",
      description: "An invitation to co-create our community.",
      features: [
        "Lifetime access to all Complete Plus features",
        "\"Complete Beyond\" badge on profile (optional)",
        "Unlocked Mode: values-first compatibility journeys",
        "Memory Vault: revisit favorite moments, prompts, and saved matches",
        "Connection DNA: evolving emotional intelligence for deeper match potential"
      ],
      buttonText: "Go Beyond – $39/year",
      plan: "unlocked-beyond",
      popular: false,
      hoverTexts: {
        "Unlocked Mode: values-first compatibility journeys": "Find clarity in Unlocked Mode",
        "Memory Vault: revisit favorite moments, prompts, and saved matches": "Your vault of remembered connections"
      }
    }
  ];

  const handleSubscribe = async (plan: string | null) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!plan) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-payment', {
        body: { 
          plan, 
          userId: user.id 
        }
      });

      if (error) {
        console.error('PayPal payment error:', error);
        return;
      }

      if (data?.approvalUrl) {
        // Redirect to PayPal for payment approval
        window.open(data.approvalUrl, '_blank');
      }
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription?.subscribed) return "Quiet Start";
    return subscription.subscription_tier || "Unknown";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              AI Complete Me Pricing Plans
            </h1>
            <p className="text-lg text-muted-foreground mb-2">Gentle by design. Emotionally intelligent by intention.</p>
            <p className="text-muted-foreground mb-4">
              Choose the plan that resonates with your journey toward deeper connection.
            </p>
            <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg px-4 py-2 text-sm border border-purple-200 dark:border-purple-700">
              💡 Spend $12/month or unlock everything for just $39/year—a quiet nudge toward completeness.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const isCurrentPlan = getCurrentPlan() === plan.name.replace(" 💖", "").replace(" 🌌", "");
              const isFree = plan.name === "Quiet Start";
              
              return (
                <Card 
                  key={plan.name} 
                  className={`relative backdrop-blur-sm ${
                    isFree
                      ? "bg-gradient-to-br from-purple-50/80 via-purple-100/60 to-purple-200/40 dark:from-purple-950/30 dark:via-purple-900/20 dark:to-purple-950/40 border-2 border-purple-300/60 dark:border-purple-600/50 shadow-purple-100/50 dark:shadow-purple-900/20"
                      : plan.popular 
                      ? "border-primary shadow-lg scale-105 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" 
                      : "border-border bg-white/70 dark:bg-gray-800/70 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30"
                  } ${isCurrentPlan && !isFree ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950" : ""} transition-all duration-300 hover:shadow-lg`}
                >
                  {isFree && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs px-3 py-1">
                      Launch Window
                    </Badge>
                  )}
                  {isCurrentPlan && !isFree ? (
                    <Badge className="absolute -top-3 right-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 border border-green-200 dark:border-green-800">
                      Current Plan
                    </Badge>
                  ) : plan.popular ? (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white">
                      Most Popular
                    </Badge>
                  ) : null}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                      <span className="text-2xl">{plan.icon}</span>
                      {plan.name}
                    </CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{plan.price}</span>
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
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.restrictedFeatures?.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="text-rose-500 font-bold">✗</span>
                          <span className="text-sm text-muted-foreground line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-center mt-6">
                      <button
                        className={`w-full px-6 py-3 rounded-lg font-medium text-center transition-all duration-300 transform ${
                          isCurrentPlan 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-default" 
                            : isFree
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50 hover:scale-[1.02] cursor-default"
                            : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-200 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800 dark:hover:to-pink-800 hover:shadow-lg hover:shadow-purple-200 dark:hover:shadow-purple-900/50 hover:scale-[1.02] border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600"
                        }`}
                        disabled={loading || isCurrentPlan || isFree}
                        onClick={() => handleSubscribe(plan.plan)}
                      >
                        <span className="relative">
                          {isCurrentPlan ? "Current Plan" : plan.buttonText}
                          {!isCurrentPlan && !isFree && (
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                          )}
                        </span>
                      </button>
                    </div>
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
    </>
  );
};

export default Pricing;
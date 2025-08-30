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
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-900 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200" style={{ color: '#6B4C8A' }}>
                AI Complete Me Pricing Plans
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">Gentle by design. Emotionally intelligent by intention.</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose the plan that resonates with your journey toward deeper connection.
              </p>
              <div className="inline-block rounded-lg px-6 py-3 text-sm border" style={{ backgroundColor: '#F4F0FA', borderColor: '#6B4C8A', color: '#6B4C8A' }}>
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
                    className={`relative bg-white dark:bg-gray-800 border-t-4 ${
                      isFree
                        ? "border-t-purple-500 shadow-lg" 
                        : plan.popular 
                        ? "border-t-purple-600 shadow-lg scale-105" 
                        : "border-t-purple-400 shadow-md hover:shadow-lg"
                    } ${isCurrentPlan && !isFree ? "border-t-green-500" : ""} transition-all duration-300`}
                  >
                    {isFree && (
                      <>
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs px-3 py-1">
                          Launch Window
                        </Badge>
                        {isCurrentPlan && (
                          <Badge className="absolute -top-3 right-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 border border-green-200 dark:border-green-800">
                            Current Plan
                          </Badge>
                        )}
                      </>
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
                      <CardTitle className="text-xl font-bold flex items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                        {isFree ? (
                          <>
                            <span className="text-2xl">🌱</span>
                            <span>Quiet Start</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">{plan.icon}</span>
                            {plan.name}
                          </>
                        )}
                      </CardTitle>
                      <div className="flex items-baseline justify-center gap-1">
                        {isFree ? (
                          <span className="text-lg font-medium text-purple-600 dark:text-purple-400">
                            Launch Window – $0/month
                          </span>
                        ) : (
                          <>
                            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{plan.price}</span>
                            <span className="text-neutral-700 dark:text-neutral-300">{plan.period}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
                        {plan.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="text-left">
                        <p className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">Includes:</p>
                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <span className="text-green-500">✅</span>
                              <span className="text-sm text-neutral-700 dark:text-neutral-300">{feature}</span>
                            </li>
                          ))}
                          {plan.restrictedFeatures?.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <span className="text-red-500">❌</span>
                              <span className="text-sm text-neutral-500 dark:text-neutral-400">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-center mt-6">
                        <button
                          className={`w-full px-6 py-3 rounded-md font-medium text-center transition-all duration-300 ${
                            isCurrentPlan 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-default" 
                              : isFree
                              ? "bg-purple-600 text-white hover:bg-purple-700 cursor-default"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                          }`}
                          disabled={loading || isCurrentPlan || isFree}
                          onClick={() => handleSubscribe(plan.plan)}
                        >
                          {isCurrentPlan ? "Current Plan" : plan.buttonText}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All plans include our core matching experience. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Pricing;
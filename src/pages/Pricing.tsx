import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Smartphone, ArrowLeft, CreditCard } from "lucide-react";
import { MobileOptimizedPayment } from "@/components/MobileOptimizedPayment";
import { useMobilePayments } from "@/hooks/useMobilePayments";

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const subscription = null; // Simplified without subscription
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [quietStartStatus, setQuietStartStatus] = useState<any>(null);
  const [showMobilePayment, setShowMobilePayment] = useState(false);
  const [mobilePaymentPlan, setMobilePaymentPlan] = useState<any>(null);
  const { deviceInfo, paymentMethods } = useMobilePayments();

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

  // Check if user is part of Quiet Start program
  useEffect(() => {
    const checkQuietStartStatus = async () => {
      if (!user) return;

      try {
        const { data: quietStart } = await supabase
          .from('quiet_start_signups')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setQuietStartStatus(quietStart);
      } catch (error) {
        console.log('No Quiet Start record found');
      }
    };

    checkQuietStartStatus();
  }, [user]);

  const handleSubscribe = async (plan: string | null) => {
    console.log('[PayPal Debug] handleSubscribe called with plan:', plan);
    
    if (!user) {
      console.log('[PayPal Debug] No user found, redirecting to auth');
      navigate('/auth');
      return;
    }
    
    console.log('[PayPal Debug] User found:', user.id);
    
    if (!plan) {
      console.log('[PayPal Debug] No plan provided, returning');
      return;
    }

    // Check if user has Quiet Start benefits (first 500 users)
    if (quietStartStatus?.benefits_claimed) {
      console.log('[PayPal Debug] User has Quiet Start benefits:', quietStartStatus);
      
      // Calculate trial expiration (90 days from signup)
      const signupDate = new Date(quietStartStatus.created_at);
      const trialExpiresAt = new Date(signupDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days
      const now = new Date();
      
      console.log('[PayPal Debug] Trial expires at:', trialExpiresAt, 'Current time:', now);
      
      if (now < trialExpiresAt) {
        // Still in free trial period
        const daysRemaining = Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        console.log('[PayPal Debug] Still in trial, days remaining:', daysRemaining);
        
        toast({
          title: "Quiet Start Trial Active",
          description: `You have ${daysRemaining} days remaining in your free trial. No payment needed yet!`,
        });
        navigate('/premium-dashboard');
        return;
      }
      
      // Trial expired, allow them to subscribe
      console.log('[PayPal Debug] Trial expired, proceeding with PayPal');
      toast({
        title: "Free Trial Ended",
        description: "Your 90-day free trial has ended. Subscribe now to continue accessing premium features!",
      });
      // Continue with normal PayPal flow below
    }

    console.log('[PayPal Debug] Setting loading state and calling PayPal function');
    setLoading(true);
    setLoadingPlan(plan);

    try {
      toast({
        title: "Creating PayPal payment...",
        description: "Please wait while we set up your payment.",
      });

      console.log('[PayPal Debug] Invoking create-paypal-payment function with:', { 
        plan, 
        userId: user.id 
      });

      const { data, error } = await supabase.functions.invoke('create-paypal-payment', {
        body: { 
          plan, 
          userId: user.id 
        }
      });

      console.log('[PayPal Debug] PayPal function response:', { data, error });

      if (error) {
        console.error('[PayPal Debug] PayPal payment error:', error);
        toast({
          title: "Payment Error",
          description: "Failed to create PayPal payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.approvalUrl) {
        console.log('[PayPal Debug] Got approval URL:', data.approvalUrl);
        
        toast({
          title: "Opening PayPal",
          description: "A new tab will open for secure PayPal payment.",
        });
        
        // Open PayPal in new tab (more reliable)
        console.log('[PayPal Debug] Opening PayPal in new tab...');
        window.open(data.approvalUrl, '_blank');
      } else {
        console.error('[PayPal Debug] No approval URL in response:', data);
        toast({
          title: "Payment Error",
          description: "No payment URL received. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[PayPal Debug] Exception in PayPal payment:', error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log('[PayPal Debug] Cleaning up loading state');
      setLoading(false);
      setLoadingPlan(null);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription?.subscribed) return "Quiet Start";
    return subscription.subscription_tier || "Unknown";
  };

  const handleMobilePayment = (plan: any) => {
    setMobilePaymentPlan(plan);
    setShowMobilePayment(true);
  };

  const isMobileDevice = deviceInfo?.platform === 'ios' || deviceInfo?.platform === 'android';
  const hasMobilePayments = paymentMethods.some(p => p.type === 'apple-pay' || p.type === 'google-pay');

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      {/* Header with Back Button */}
      <header className="bg-white dark:bg-gray-800 border-b" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Go back to homepage"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/faq')}
              className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="View frequently asked questions about pricing"
            >
              Pricing FAQ
            </Button>
          </div>
        </div>
      </header>
      
      <main id="main-content" className="min-h-screen bg-white dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-900 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-purple-700 dark:text-purple-400">
                AI Complete Me Pricing Plans
              </h1>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-normal mb-2">Gentle by design. Emotionally intelligent by intention.</p>
              <p className="text-gray-700 dark:text-gray-300 font-normal mb-6">
                Choose the plan that resonates with your journey toward deeper connection.
              </p>
              <div className="inline-block rounded-lg px-6 py-3 text-sm border" style={{ backgroundColor: '#F4F0FA', borderColor: '#6B4C8A', color: '#6B4C8A' }}>
                💡 Spend $12/month or unlock everything for just $39/year—a quiet nudge toward completeness.
              </div>
              
              {/* Show trial status for Quiet Start users */}
              {quietStartStatus?.benefits_claimed && (() => {
                const signupDate = new Date(quietStartStatus.created_at);
                const trialExpiresAt = new Date(signupDate.getTime() + (90 * 24 * 60 * 60 * 1000));
                const now = new Date();
                const daysRemaining = Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                
                if (now < trialExpiresAt) {
                  return (
                    <div className="mt-4 inline-block rounded-lg px-6 py-3 text-sm border" style={{ backgroundColor: '#E8F5E8', borderColor: '#4A7C59', color: '#2D5016' }}>
                      🌱 <strong>Quiet Start Trial:</strong> {daysRemaining} days of free premium access remaining!
                    </div>
                  );
                } else {
                  return (
                    <div className="mt-4 inline-block rounded-lg px-6 py-3 text-sm border" style={{ backgroundColor: '#FFF3E0', borderColor: '#E65100', color: '#BF360C' }}>
                      ⏰ <strong>Trial Expired:</strong> Your 90-day free trial has ended. Subscribe below to continue!
                    </div>
                  );
                }
              })()}
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
                        <div className="w-full space-y-2">
                          <button
                            className={`w-full px-6 py-3 rounded-md font-medium text-center transition-all duration-300 ${
                              isCurrentPlan 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-default" 
                                : isFree
                                ? "bg-purple-600 text-white hover:bg-purple-700 cursor-default"
                                : "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                            }`}
                            disabled={loading || isCurrentPlan || isFree}
                            onClick={() => handleSubscribe(plan.plan)}
                          >
                            {loading && loadingPlan === plan.plan ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing...
                              </span>
                            ) : isCurrentPlan ? (
                              "Current Plan"
                            ) : (
                              plan.buttonText
                            )}
                          </button>

                          {/* Mobile Payment Option */}
                          {isMobileDevice && !isFree && !isCurrentPlan && (
                            <Dialog open={showMobilePayment && mobilePaymentPlan?.name === plan.name} onOpenChange={setShowMobilePayment}>
                              <DialogTrigger asChild>
                                <Button 
                                  onClick={() => handleMobilePayment(plan)}
                                  variant="outline" 
                                  className="w-full text-sm flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                                >
                                  <Smartphone size={16} />
                                  Mobile Pay
                                  {hasMobilePayments && (
                                    <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 text-xs">
                                      Fast
                                    </Badge>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <MobileOptimizedPayment
                                  planName={plan.name}
                                  amount={parseFloat(plan.price.replace('$', ''))}
                                  planId={plan.plan}
                                  onClose={() => setShowMobilePayment(false)}
                                />
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Alternative Offer Section */}
            <section 
              className="py-8 mt-12 relative overflow-hidden"
              role="region"
              aria-label="Alternative trial offer"
            >
              {/* Ambient background with sunflower blush gradient */}
              <div className="absolute inset-0 opacity-60" style={{ background: 'var(--gradient-sunflower-blush)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/40"></div>
              
              <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <div className="backdrop-blur-sm bg-background/80 border border-border/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Alternative Offer</span>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  
                  <p className="text-foreground leading-relaxed text-lg">
                    <span className="font-semibold text-primary">If you missed Quiet Start</span>, you'll still receive{' '}
                    <span className="font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">30 days of Complete Premium free</span>. 
                  </p>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    After your trial, you'll be automatically enrolled in Complete Plus ($12/month) unless you choose a different plan. 
                    You can upgrade to Premium or downgrade to Basic anytime.
                  </p>
                </div>
              </div>
            </section>

            <div className="text-center mt-12">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All plans include our core matching experience. Cancel anytime.
              </p>
              {isMobileDevice && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  📱 Mobile payments available • Apple Pay & Google Pay supported
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Pricing;
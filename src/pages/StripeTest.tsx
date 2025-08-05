import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const StripeTest = () => {
  const { subscription, loading, createCheckout, checkSubscription } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);

  const testPlans = [
    { name: "Complete Plus", plan: "unlocked-plus", price: "$12/month" },
    { name: "Complete Beyond", plan: "unlocked-beyond", price: "$39/year" },
    { name: "Echo Monthly", plan: "unlocked-echo-monthly", price: "$4/month" },
    { name: "Echo Lifetime", plan: "unlocked-echo-lifetime", price: "$12 one-time" }
  ];

  const handleTestCheckout = async (plan: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to test checkout",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      await createCheckout(plan);
      toast({
        title: "Checkout Initiated",
        description: "Stripe checkout should open in a new tab",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Check console for error details",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const handleRefreshSubscription = async () => {
    await checkSubscription();
    toast({
      title: "Subscription Refreshed",
      description: "Latest subscription status loaded",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stripe Integration Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">User Status:</h3>
                <p>Authenticated: {user ? "✅ Yes" : "❌ No"}</p>
                <p>Email: {user?.email || "Not logged in"}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Subscription Status:</h3>
                <p>Loading: {loading ? "Yes" : "No"}</p>
                <p>Subscribed: {subscription?.subscribed ? "✅ Yes" : "❌ No"}</p>
                <p>Tier: {subscription?.subscription_tier || "None"}</p>
                <p>Ends: {subscription?.subscription_end || "N/A"}</p>
              </div>
            </div>
            
            <Button onClick={handleRefreshSubscription} variant="outline">
              Refresh Subscription Status
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Checkout Flows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testPlans.map((plan) => (
                <div key={plan.plan} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{plan.price}</p>
                  <Button 
                    onClick={() => handleTestCheckout(plan.plan)}
                    disabled={testing || loading || !user}
                    className="w-full"
                  >
                    Test {plan.name} Checkout
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Test Instructions:</h4>
              <ol className="text-sm space-y-1">
                <li>1. Make sure you're logged in</li>
                <li>2. Click any test checkout button</li>
                <li>3. Stripe checkout should open in a new tab</li>
                <li>4. Use test card: 4242 4242 4242 4242</li>
                <li>5. Any future date and CVC</li>
                <li>6. Complete the test payment</li>
                <li>7. Check if subscription status updates</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StripeTest;
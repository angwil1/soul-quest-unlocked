import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const token = searchParams.get('token');
      const paymentId = searchParams.get('paymentId');
      const PayerID = searchParams.get('PayerID');

      if (!token && !paymentId) {
        setStatus('error');
        toast({
          title: "Payment Error",
          description: "No payment information found. Please try again.",
          variant: "destructive",
        });
        return;
      }

      try {
        // Check if payment exists in database
        const { data: payment, error } = await supabase
          .from('paypal_payments')
          .select('*')
          .eq('paypal_order_id', token || paymentId)
          .single();

        if (error || !payment) {
          setStatus('error');
          toast({
            title: "Payment Not Found",
            description: "We couldn't find your payment. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        setPaymentDetails(payment);

        if (payment.status === 'completed') {
          setStatus('success');
          toast({
            title: "Payment Successful!",
            description: `Your ${payment.plan_name} subscription is now active.`,
          });
        } else {
          setStatus('success');
          toast({
            title: "Payment Received",
            description: "Your payment is being processed. You'll receive confirmation shortly.",
          });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
        toast({
          title: "Error",
          description: "Failed to verify payment status. Please contact support.",
          variant: "destructive",
        });
      }
    };

    handlePaymentReturn();
  }, [searchParams, toast]);

  const getPlanDisplayName = (planName: string) => {
    switch (planName) {
      case 'unlocked-plus':
        return 'Complete Plus';
      case 'unlocked-beyond':
        return 'Complete Beyond';
      default:
        return planName;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-6">
              <div className="flex justify-center mb-4">
                {status === 'loading' && (
                  <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
                )}
                {status === 'success' && (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                )}
                {status === 'error' && (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {status === 'loading' && "Processing Payment..."}
                {status === 'success' && "Payment Successful!"}
                {status === 'error' && "Payment Error"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {status === 'loading' && (
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we verify your payment with PayPal...
                </p>
              )}

              {status === 'success' && paymentDetails && (
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Thank you for subscribing to <strong>{getPlanDisplayName(paymentDetails.plan_name)}</strong>!
                  </p>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Plan:</span>
                        <span className="font-medium">{getPlanDisplayName(paymentDetails.plan_name)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">${paymentDetails.amount} {paymentDetails.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Status:</span>
                        <span className="font-medium capitalize">{paymentDetails.status}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400">
                    You now have access to all premium features. Start exploring your enhanced dating experience!
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    We encountered an issue processing your payment. Please contact our support team for assistance.
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center pt-6">
                <Button 
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                >
                  View Plans
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Continue to App
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
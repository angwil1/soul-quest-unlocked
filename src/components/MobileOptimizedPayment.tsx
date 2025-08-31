import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobilePaymentButton } from './MobilePaymentButton';
import { Smartphone, CreditCard, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMobilePayments } from '@/hooks/useMobilePayments';

interface MobileOptimizedPaymentProps {
  planName: string;
  amount: number;
  planId?: string;
  onClose?: () => void;
}

export const MobileOptimizedPayment: React.FC<MobileOptimizedPaymentProps> = ({
  planName,
  amount,
  planId,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { deviceInfo } = useMobilePayments();

  const handlePayPalPayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-payment', {
        body: { 
          plan: planId || planName.toLowerCase().replace(/\s+/g, '-'),
          isMobile: true
        }
      });

      if (error) throw error;

      if (data?.approvalUrl) {
        // Open PayPal in same window on mobile for better UX
        if (deviceInfo?.platform === 'ios' || deviceInfo?.platform === 'android') {
          window.location.href = data.approvalUrl;
        } else {
          window.open(data.approvalUrl, '_blank');
        }
        
        toast({
          title: "Redirecting to PayPal",
          description: "Complete your payment securely with PayPal",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate PayPal payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMobilePaymentSuccess = (method: string, result?: any) => {
    toast({
      title: "Payment Successful!",
      description: `Your ${planName} subscription is now active.`,
    });
    onClose?.();
  };

  const handleMobilePaymentError = (error: string) => {
    toast({
      title: "Payment Failed", 
      description: error,
      variant: "destructive"
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Smartphone size={24} />
          Mobile Payment
        </CardTitle>
        <div className="text-lg font-semibold text-primary">
          {planName} - ${amount}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground mb-4">
          Choose your preferred payment method
        </div>

        {/* Mobile Wallet Payments */}
        <MobilePaymentButton
          planName={planName}
          amount={amount}
          onPaymentSuccess={handleMobilePaymentSuccess}
          onPaymentError={handleMobilePaymentError}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or pay with
            </span>
          </div>
        </div>

        {/* PayPal Payment */}
        <Button
          onClick={handlePayPalPayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <ExternalLink size={16} />
              PayPal
            </>
          )}
        </Button>

        {/* Device Info */}
        {deviceInfo && (
          <div className="text-xs text-center text-muted-foreground mt-4 p-2 bg-muted rounded">
            Device: {deviceInfo.platform} • Model: {deviceInfo.model}
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground">
          🔒 All payments are secure and encrypted
        </div>
      </CardContent>
    </Card>
  );
};
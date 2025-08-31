import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, CreditCard } from 'lucide-react';
import { useMobilePayments } from '@/hooks/useMobilePayments';
import { useToast } from '@/hooks/use-toast';

interface MobilePaymentButtonProps {
  planName: string;
  amount: number;
  onPaymentSuccess: (method: string, result?: any) => void;
  onPaymentError: (error: string) => void;
}

export const MobilePaymentButton: React.FC<MobilePaymentButtonProps> = ({
  planName,
  amount,
  onPaymentSuccess,
  onPaymentError
}) => {
  const { paymentMethods, loading, processApplePay, processGooglePay } = useMobilePayments();
  const { toast } = useToast();

  const handleApplePay = async () => {
    try {
      const result = await processApplePay(amount, planName);
      onPaymentSuccess('apple-pay', result);
      toast({
        title: "Apple Pay Payment",
        description: "Payment processed successfully!",
      });
    } catch (error: any) {
      onPaymentError(error.message);
      toast({
        title: "Apple Pay Error", 
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleGooglePay = async () => {
    try {
      const result = await processGooglePay(amount, planName);
      onPaymentSuccess('google-pay', result);
      toast({
        title: "Google Pay Payment",
        description: "Payment processed successfully!",
      });
    } catch (error: any) {
      onPaymentError(error.message);
      toast({
        title: "Google Pay Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse h-10 bg-muted rounded-md"></div>;
  }

  const applePay = paymentMethods.find(m => m.type === 'apple-pay');
  const googlePay = paymentMethods.find(m => m.type === 'google-pay');

  return (
    <div className="flex flex-col gap-2 w-full">
      {applePay?.available && (
        <Button
          onClick={handleApplePay}
          className="w-full bg-black text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <Smartphone size={16} />
          Pay with Apple Pay
        </Button>
      )}
      
      {googlePay?.available && (
        <Button
          onClick={handleGooglePay}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Smartphone size={16} />
          Pay with Google Pay
        </Button>
      )}

      {!applePay?.available && !googlePay?.available && (
        <div className="text-sm text-muted-foreground text-center py-2">
          Mobile payments not available on this device
        </div>
      )}
    </div>
  );
};
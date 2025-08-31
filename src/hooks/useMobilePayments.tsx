import { useState, useEffect } from 'react';
import { Device } from '@capacitor/device';
import { useToast } from './use-toast';

interface PaymentMethod {
  type: 'apple-pay' | 'google-pay' | 'paypal' | 'card';
  available: boolean;
  label: string;
}

export const useMobilePayments = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkDeviceAndPaymentMethods();
  }, []);

  const checkDeviceAndPaymentMethods = async () => {
    try {
      const info = await Device.getInfo();
      setDeviceInfo(info);

      const methods: PaymentMethod[] = [];

      // Check for Apple Pay (iOS Safari/WebView)
      if (info.platform === 'ios' && window.ApplePaySession?.canMakePayments()) {
        methods.push({
          type: 'apple-pay',
          available: true,
          label: 'Apple Pay'
        });
      }

      // Check for Google Pay (Android Chrome/WebView)
      if (info.platform === 'android' && window.PaymentRequest) {
        try {
          const paymentRequest = new PaymentRequest(
            [{ supportedMethods: 'https://google.com/pay' }],
            { total: { label: 'Test', amount: { currency: 'USD', value: '0.01' } } }
          );
          const canMakePayment = await paymentRequest.canMakePayment();
          if (canMakePayment) {
            methods.push({
              type: 'google-pay',
              available: true,
              label: 'Google Pay'
            });
          }
        } catch (error) {
          console.log('Google Pay not available');
        }
      }

      // PayPal is always available
      methods.push({
        type: 'paypal',
        available: true,
        label: 'PayPal'
      });

      // Card payments always available
      methods.push({
        type: 'card',
        available: true,
        label: 'Credit Card'
      });

      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error checking payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const processApplePay = async (amount: number, planName: string) => {
    if (!window.ApplePaySession?.canMakePayments()) {
      throw new Error('Apple Pay not available');
    }

    const paymentRequest = {
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: planName,
        amount: amount.toString()
      }
    };

    return new Promise((resolve, reject) => {
      const session = new (window.ApplePaySession as any)(3, paymentRequest);
      
      session.onvalidatemerchant = (event: any) => {
        // In production, you'd validate with your server
        reject(new Error('Apple Pay merchant validation required'));
      };

      session.onpaymentauthorized = (event: any) => {
        // Process payment with your backend
        session.completePayment((window.ApplePaySession as any).STATUS_SUCCESS);
        resolve(event.payment);
      };

      session.begin();
    });
  };

  const processGooglePay = async (amount: number, planName: string) => {
    if (!window.PaymentRequest) {
      throw new Error('Google Pay not available');
    }

    const paymentMethods = [
      {
        supportedMethods: 'https://google.com/pay',
        data: {
          environment: 'TEST', // Change to 'PRODUCTION' for live
          apiVersion: 2,
          apiVersionMinor: 0,
          merchantInfo: {
            merchantName: 'AI Complete Me',
            merchantId: '12345678901234567890' // Replace with your merchant ID
          },
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA']
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId'
                }
              }
            }
          ]
        }
      }
    ];

    const paymentDetails = {
      total: {
        label: planName,
        amount: {
          currency: 'USD',
          value: amount.toString()
        }
      }
    };

    const request = new PaymentRequest(paymentMethods, paymentDetails);
    
    try {
      const result = await request.show();
      await result.complete('success');
      return result;
    } catch (error) {
      throw new Error('Google Pay payment failed');
    }
  };

  return {
    deviceInfo,
    paymentMethods,
    loading,
    processApplePay,
    processGooglePay
  };
};

// Extend Window interface for Apple Pay and Payment Request API
declare global {
  interface Window {
    ApplePaySession?: {
      canMakePayments(): boolean;
      STATUS_SUCCESS: number;
      new(version: number, paymentRequest: any): any;
    };
    PaymentRequest?: {
      new(methodData: any[], details: any, options?: any): any;
    };
  }
}
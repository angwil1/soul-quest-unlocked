-- Create table for PayPal payments tracking
CREATE TABLE public.paypal_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL,
  paypal_order_id TEXT,
  paypal_subscription_id TEXT,
  paypal_capture_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  payment_provider TEXT NOT NULL DEFAULT 'paypal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.paypal_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for PayPal payments
CREATE POLICY "Users can view their own PayPal payments" 
ON public.paypal_payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage PayPal payments" 
ON public.paypal_payments 
FOR ALL 
USING (true);

-- Create or update subscribers table to track active subscriptions
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE,
  payment_provider TEXT DEFAULT 'paypal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subscribers if not already enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions" 
ON public.subscribers 
FOR ALL 
USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_paypal_payments_user_id ON public.paypal_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_paypal_payments_order_id ON public.paypal_payments(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
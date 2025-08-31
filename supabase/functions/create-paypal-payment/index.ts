import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan, userId } = await req.json();
    
    if (!plan || !userId) {
      throw new Error('Missing required fields: plan and userId');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Plan pricing mapping
    const planPricing = {
      'unlocked-plus': { amount: '12.00', currency: 'USD', recurring: true, period: 'monthly' },
      'unlocked-beyond': { amount: '39.00', currency: 'USD', recurring: true, period: 'yearly' },
      'unlocked-echo-monthly': { amount: '4.00', currency: 'USD', recurring: true, period: 'monthly' },
      'unlocked-echo-lifetime': { amount: '12.00', currency: 'USD', recurring: false, period: null }
    };

    const pricing = planPricing[plan as keyof typeof planPricing];
    if (!pricing) {
      throw new Error('Invalid plan selected');
    }

    // PayPal API credentials
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    // Default to sandbox if no environment specified
    const isProduction = false;
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    const paypalApiUrl = isProduction 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    // Get PayPal access token
    const tokenResponse = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('PayPal token response error:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        body: errorText,
        clientId: clientId ? 'present' : 'missing',
        clientSecret: clientSecret ? 'present' : 'missing'
      });
      throw new Error(`Failed to get PayPal access token: ${tokenResponse.status} ${errorText}`);
    }

    const { access_token } = await tokenResponse.json();

    // Always create one-time payments for now (subscriptions require pre-created plans)
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: pricing.currency,
          value: pricing.amount
        },
        description: `AI Complete Me - ${plan}`
      }],
      application_context: {
        brand_name: "AI Complete Me",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${req.headers.get('origin')}/payment-success`,
        cancel_url: `${req.headers.get('origin')}/pricing`
      }
    };

    const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error('PayPal order error:', {
        status: orderResponse.status,
        statusText: orderResponse.statusText,
        body: error
      });
      throw new Error(`Failed to create PayPal order: ${orderResponse.status}`);
    }

    const paypalOrder = await orderResponse.json();

    // Store payment record in database
    const { error: dbError } = await supabaseClient
      .from('paypal_payments')
      .insert({
        user_id: userId,
        plan_name: plan,
        paypal_order_id: paypalOrder.id,
        amount: pricing.amount,
        currency: pricing.currency,
        status: 'pending',
        is_recurring: false // Always one-time payments for now
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store payment record');
    }

    // Get approval URL
    const approvalUrl = paypalOrder.links?.find((link: any) => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      throw new Error('No approval URL found in PayPal response');
    }

    console.log('PayPal payment created successfully:', paypalOrder.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        approvalUrl,
        orderId: paypalOrder.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('PayPal payment error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
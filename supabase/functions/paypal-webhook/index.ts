import { serve } from "serve";
import { createClient } from 'supabase';
import { createHash, createHmac } from "crypto";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `webhook:${ip}`;
  const limit = rateLimitStore.get(key);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 10) { // Max 10 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
}

async function verifyPayPalWebhook(body: string, headers: Record<string, string>): Promise<boolean> {
  try {
    const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID');
    const authToken = await getPayPalAccessToken();
    
    if (!webhookId || !authToken) {
      console.error('Missing PayPal webhook ID or auth token');
      return false;
    }

    const verifyUrl = `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`;
    
    const verifyData = {
      auth_algo: headers['paypal-auth-algo'] || '',
      cert_id: headers['paypal-cert-id'] || '',
      transmission_id: headers['paypal-transmission-id'] || '',
      transmission_sig: headers['paypal-transmission-sig'] || '',
      transmission_time: headers['paypal-transmission-time'] || '',
      webhook_id: webhookId,
      webhook_event: JSON.parse(body)
    };

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(verifyData)
    });

    const result = await response.json();
    return result.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('PayPal webhook verification failed:', error);
    return false;
  }
}

async function getPayPalAccessToken(): Promise<string | null> {
  try {
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      console.error('Missing PayPal credentials');
      return null;
    }

    const auth = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get PayPal access token:', error);
    return null;
  }
}

function getPayPalBaseUrl(): string {
  return Deno.env.get('PAYPAL_ENVIRONMENT') === 'production' 
    ? 'https://api.paypal.com' 
    : 'https://api.sandbox.paypal.com';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const webhookBody = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    
    // Verify webhook signature for security
    const isValidSignature = await verifyPayPalWebhook(webhookBody, headers);
    if (!isValidSignature) {
      console.error('Invalid PayPal webhook signature');
      // Log security event
      await supabaseClient.rpc('log_security_event', {
        p_event_type: 'webhook_signature_invalid',
        p_event_data: { 
          source: 'paypal_webhook',
          ip: clientIP,
          headers: Object.keys(headers)
        }
      });
      
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }
    
    const event = JSON.parse(webhookBody);
    console.log('PayPal webhook received:', event.event_type);

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(supabaseClient, event);
        break;
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(supabaseClient, event);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(supabaseClient, event);
        break;
      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
        await handleSubscriptionPaymentFailed(supabaseClient, event);
        break;
      default:
        console.log('Unhandled event type:', event.event_type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('PayPal webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

async function handlePaymentCompleted(supabaseClient: any, event: any) {
  const orderId = event.resource.id;
  
  // Update payment status
  const { error: updateError } = await supabaseClient
    .from('paypal_payments')
    .update({ 
      status: 'completed',
      paypal_capture_id: orderId,
      completed_at: new Date().toISOString()
    })
    .eq('paypal_order_id', orderId);

  if (updateError) {
    console.error('Error updating payment:', updateError);
    return;
  }

  // Get payment record to find user
  const { data: payment } = await supabaseClient
    .from('paypal_payments')
    .select('user_id, plan_name')
    .eq('paypal_order_id', orderId)
    .single();

  if (payment) {
    // Activate subscription for user
    await activateUserSubscription(supabaseClient, payment.user_id, payment.plan_name);
  }
}

async function handleSubscriptionActivated(supabaseClient: any, event: any) {
  const subscriptionId = event.resource.id;
  
  // Find payment record by subscription ID
  const { data: payment } = await supabaseClient
    .from('paypal_payments')
    .select('user_id, plan_name')
    .eq('paypal_subscription_id', subscriptionId)
    .single();

  if (payment) {
    await activateUserSubscription(supabaseClient, payment.user_id, payment.plan_name);
  }
}

async function handleSubscriptionCancelled(supabaseClient: any, event: any) {
  const subscriptionId = event.resource.id;
  
  // Find payment record and deactivate subscription
  const { data: payment } = await supabaseClient
    .from('paypal_payments')
    .select('user_id')
    .eq('paypal_subscription_id', subscriptionId)
    .single();

  if (payment) {
    await deactivateUserSubscription(supabaseClient, payment.user_id);
  }
}

async function handleSubscriptionPaymentFailed(supabaseClient: any, event: any) {
  console.log('Subscription payment failed:', event.resource.id);
  // Handle payment failure logic here
}

async function activateUserSubscription(supabaseClient: any, userId: string, planName: string) {
  // Update or insert subscription record
  const { error } = await supabaseClient
    .from('subscribers')
    .upsert({
      user_id: userId,
      subscribed: true,
      subscription_tier: planName,
      subscription_start: new Date().toISOString(),
      subscription_end: null, // PayPal handles recurring billing
      payment_provider: 'paypal'
    });

  if (error) {
    console.error('Error activating subscription:', error);
  } else {
    console.log('Subscription activated for user:', userId);
  }
}

async function deactivateUserSubscription(supabaseClient: any, userId: string) {
  const { error } = await supabaseClient
    .from('subscribers')
    .update({
      subscribed: false,
      subscription_end: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error deactivating subscription:', error);
  } else {
    console.log('Subscription deactivated for user:', userId);
  }
}
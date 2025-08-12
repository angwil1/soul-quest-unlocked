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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const webhookBody = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    
    // Verify webhook signature (simplified for demo)
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
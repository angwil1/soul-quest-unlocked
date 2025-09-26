import { serve } from "serve";
import { createClient } from 'supabase';

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

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid or expired token');
    }

    console.log('Checking subscription for user:', user.id);

    // Check for active subscription in the subscribers table
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .eq('subscribed', true)
      .single();

    if (subError && subError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking subscription:', subError);
      throw new Error('Failed to check subscription status');
    }

    // Check for premium membership in premium_memberships table as backup
    let isPremium = false;
    let membershipTier = null;

    if (!subscription) {
      const { data: membership, error: memberError } = await supabaseClient
        .from('premium_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (membership && !memberError) {
        isPremium = true;
        membershipTier = membership.tier;
      }
    }

    // Determine subscription status
    const isSubscribed = !!subscription || isPremium;
    const tier = subscription?.subscription_tier || membershipTier || null;
    const subscriptionEnd = subscription?.subscription_end || null;

    console.log('Subscription check result:', {
      subscribed: isSubscribed,
      tier: tier,
      subscription_end: subscriptionEnd
    });

    return new Response(
      JSON.stringify({
        subscribed: isSubscribed,
        subscription_tier: tier,
        subscription_end: subscriptionEnd,
        user_id: user.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Check subscription error:', error);
    return new Response(
      JSON.stringify({ 
        subscribed: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to avoid breaking the UI, just set subscribed to false
      },
    );
  }
});
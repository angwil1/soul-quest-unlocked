import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing email events...');

    // Process signup events (welcome emails)
    await processSignupEvents(supabase);
    
    // Process quiz completion events
    await processQuizCompletionEvents(supabase);
    
    // Process match velocity slow events
    await processMatchVelocityEvents(supabase);

    return new Response(
      JSON.stringify({ message: 'Email events processed successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing email events:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processSignupEvents(supabase: any) {
  console.log('Processing signup events...');
  
  // Find users who signed up but haven't received welcome email
  const { data: signupEvents } = await supabase
    .from('user_events')
    .select(`
      user_id,
      event_data,
      created_at,
      profiles!inner(name)
    `)
    .eq('event_type', 'signup')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
    .order('created_at', { ascending: false });

  if (!signupEvents || signupEvents.length === 0) {
    console.log('No recent signup events found');
    return;
  }

  for (const event of signupEvents) {
    // Check if welcome email already sent
    const { data: existingJourney } = await supabase
      .from('email_journeys')
      .select('id')
      .eq('user_id', event.user_id)
      .eq('journey_type', 'welcome')
      .single();

    if (!existingJourney) {
      console.log(`Sending welcome email for user ${event.user_id}`);
      
      // Get user email from auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(event.user_id);
      
      if (authUser?.user?.email) {
        await sendJourneyEmail(supabase, {
          userId: event.user_id,
          journeyType: 'welcome',
          userEmail: authUser.user.email,
          userName: event.profiles?.name || 'there'
        });
      }
    }
  }
}

async function processQuizCompletionEvents(supabase: any) {
  console.log('Processing quiz completion events...');
  
  // Find users who completed quiz but haven't received quiz completion email
  const { data: quizEvents } = await supabase
    .from('user_events')
    .select(`
      user_id,
      event_data,
      created_at,
      profiles!inner(name)
    `)
    .eq('event_type', 'quiz_completed')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
    .order('created_at', { ascending: false });

  if (!quizEvents || quizEvents.length === 0) {
    console.log('No recent quiz completion events found');
    return;
  }

  for (const event of quizEvents) {
    // Check if quiz completion email already sent
    const { data: existingJourney } = await supabase
      .from('email_journeys')
      .select('id')
      .eq('user_id', event.user_id)
      .eq('journey_type', 'quiz_completed')
      .single();

    if (!existingJourney) {
      console.log(`Sending quiz completion email for user ${event.user_id}`);
      
      // Get user email from auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(event.user_id);
      
      if (authUser?.user?.email) {
        await sendJourneyEmail(supabase, {
          userId: event.user_id,
          journeyType: 'quiz_completed',
          userEmail: authUser.user.email,
          userName: event.profiles?.name || 'there'
        });
      }
    }
  }
}

async function processMatchVelocityEvents(supabase: any) {
  console.log('Processing match velocity events...');
  
  // Find users who haven't been active recently (no matches or messages in last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  
  // Get users who were active 7-14 days ago but not in the last 7 days
  const { data: inactiveUsers } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      last_online
    `)
    .lt('last_online', sevenDaysAgo)
    .gte('last_online', fourteenDaysAgo);

  if (!inactiveUsers || inactiveUsers.length === 0) {
    console.log('No inactive users found for re-engagement');
    return;
  }

  for (const user of inactiveUsers) {
    // Check if re-engagement email already sent recently
    const { data: existingJourney } = await supabase
      .from('email_journeys')
      .select('id')
      .eq('user_id', user.id)
      .eq('journey_type', 'match_velocity_slow')
      .gte('sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Within last 7 days
      .single();

    if (!existingJourney) {
      console.log(`Sending re-engagement email for user ${user.id}`);
      
      // Get user email from auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(user.id);
      
      if (authUser?.user?.email) {
        await sendJourneyEmail(supabase, {
          userId: user.id,
          journeyType: 'match_velocity_slow',
          userEmail: authUser.user.email,
          userName: user.name || 'there'
        });
      }
    }
  }
}

async function sendJourneyEmail(supabase: any, emailData: any) {
  try {
    const response = await supabase.functions.invoke('send-journey-email', {
      body: emailData
    });
    
    if (response.error) {
      console.error('Error sending journey email:', response.error);
    } else {
      console.log('Journey email sent successfully:', response.data);
    }
  } catch (error) {
    console.error('Error invoking send-journey-email function:', error);
  }
}
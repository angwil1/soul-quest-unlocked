import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DigestRequest {
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId }: DigestRequest = await req.json();
    console.log('Generating AI digest for user:', userId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user has premium subscription
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    console.log('Checking subscription status...');
    const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke('check-subscription', {
      headers: {
        Authorization: authHeader,
      }
    });

    if (subscriptionError) {
      console.error('Subscription check error:', subscriptionError);
      throw new Error('Failed to check subscription status');
    }

    if (!subscriptionData?.subscribed) {
      console.log('User does not have active subscription');
      return new Response(JSON.stringify({
        success: false,
        error: 'Premium subscription required. Please upgrade to Complete+ to access AI digest summaries.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User has valid subscription, proceeding with digest generation');

    // Get user's profile data
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // For now, create mock match data since premium_matches table might not have data yet
    const mockMatches = [
      {
        matched_user_id: 'mock-1',
        compatibility_score: 0.85,
        ai_match_summary: 'Great compatibility based on shared interests in hiking and photography',
        matched_user_profiles: { name: 'Alex', age: 28, interests: ['hiking', 'photography'] }
      },
      {
        matched_user_id: 'mock-2', 
        compatibility_score: 0.78,
        ai_match_summary: 'Strong potential connection through love of books and travel',
        matched_user_profiles: { name: 'Sam', age: 26, interests: ['reading', 'travel'] }
      },
      {
        matched_user_id: 'mock-3',
        compatibility_score: 0.82, 
        ai_match_summary: 'Creative souls unite - shared passion for music and art',
        matched_user_profiles: { name: 'Jordan', age: 30, interests: ['music', 'art'] }
      }
    ];

    // Try to get real matches, fall back to mock data
    const { data: realMatches } = await supabase
      .from('premium_matches')
      .select(`
        *,
        matched_user_profiles:profiles!premium_matches_matched_user_id_fkey(*)
      `)
      .eq('user_id', userId)
      .order('match_timestamp', { ascending: false })
      .limit(5);

    const recentMatches = realMatches && realMatches.length > 0 ? realMatches : mockMatches;

    // Get existing digest for today to check if we need to update
    const today = new Date().toISOString().split('T')[0];
    const { data: existingDigest } = await supabase
      .from('compatibility_digests')
      .select('*')
      .eq('user_id', userId)
      .eq('digest_date', today)
      .single();

    // Generate AI digest content using OpenAI
    const prompt = `
You are a dating app AI assistant creating a personalized daily digest. Generate insights based on this user's profile and recent matches.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Recent Matches:
${JSON.stringify(recentMatches, null, 2)}

Please generate:
1. A warm, personalized greeting
2. 3-5 insights about their recent matches
3. 2-3 AI-generated conversation starters for their best matches
4. A motivational closing message

Keep the tone friendly, encouraging, and insightful. Focus on meaningful connections rather than superficial aspects.

Return the response as a JSON object with this structure:
{
  "greeting": "Personalized greeting here",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "conversationStarters": [
    {"matchId": "match_id", "name": "match_name", "starter": "conversation starter"},
    {"matchId": "match_id", "name": "match_name", "starter": "conversation starter"}
  ],
  "motivation": "Motivational closing message"
}
`;

    console.log('Making OpenAI API call...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful AI dating coach that creates personalized daily digest summaries. Always respond with valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 1000, // Use max_completion_tokens for GPT-4.1+ models
        // Note: temperature not supported in GPT-4.1+ models
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, response.statusText, errorText);
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI response received');
    
    let digestContent;
    try {
      digestContent = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', aiResponse.choices[0].message.content);
      // Fallback digest content
      digestContent = {
        greeting: "Welcome to your daily AI Complete Me digest!",
        insights: [
          "Your profile shows great authenticity and depth",
          "You're attracting quality matches based on shared interests",
          "Your communication style suggests strong emotional intelligence"
        ],
        conversationStarters: [
          { matchId: "sample", name: "Your Match", starter: "I noticed we both love adventure - what's the most spontaneous trip you've ever taken?" }
        ],
        motivation: "Keep being your authentic self - the right connections are finding you!"
      };
    }

    // Prepare data for database
    const newCompatibleProfiles = recentMatches?.slice(0, 3).map(match => ({
      id: match.matched_user_id,
      name: match.matched_user_profiles?.name || 'Anonymous',
      compatibility_score: match.compatibility_score,
      summary: match.ai_match_summary
    })) || [];

    const scoreDeltas = recentMatches?.map(match => ({
      match_id: match.matched_user_id,
      score_change: "+new", // Since these are new matches
      previous_score: 0,
      current_score: match.compatibility_score
    })) || [];

    const conversationStarters = digestContent.conversationStarters || [];

    // Insert or update digest
    const digestData = {
      user_id: userId,
      digest_date: today,
      new_compatible_profiles: newCompatibleProfiles,
      profile_score_deltas: scoreDeltas,
      ai_conversation_starters: conversationStarters,
      digest_content: {
        greeting: digestContent.greeting,
        insights: digestContent.insights,
        motivation: digestContent.motivation
      }
    };

    let digestResult;
    if (existingDigest) {
      // Update existing digest
      const { data, error } = await supabase
        .from('compatibility_digests')
        .update(digestData)
        .eq('id', existingDigest.id)
        .select()
        .single();
      
      if (error) throw error;
      digestResult = data;
    } else {
      // Create new digest
      const { data, error } = await supabase
        .from('compatibility_digests')
        .insert(digestData)
        .select()
        .single();
      
      if (error) throw error;
      digestResult = data;
    }

    console.log('AI digest generated successfully:', digestResult.id);

    return new Response(JSON.stringify({
      success: true,
      digest: digestResult,
      message: 'AI digest generated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating AI digest:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate AI digest'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
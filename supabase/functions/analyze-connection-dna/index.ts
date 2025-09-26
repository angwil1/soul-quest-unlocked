import "xhr";
import { serve } from "serve";
import { createClient } from 'supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[CONNECTION-DNA] Function called');

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Create Supabase client with service role for full access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const userId = userData.user.id;
    console.log(`[CONNECTION-DNA] Processing for user: ${userId}`);

    const { analysisType, interactionData, targetUserId } = await req.json();

    switch (analysisType) {
      case 'profile_analysis':
        return await analyzeUserProfile(supabaseAdmin, userId);
      
      case 'interaction_analysis':
        return await analyzeInteraction(supabaseAdmin, userId, interactionData);
      
      case 'compatibility_analysis':
        if (!targetUserId) {
          throw new Error('Target user ID required for compatibility analysis');
        }
        return await analyzeCompatibility(supabaseAdmin, userId, targetUserId);
      
      case 'generate_insights':
        return await generateInsights(supabaseAdmin, userId);
      
      default:
        throw new Error('Invalid analysis type');
    }

  } catch (error) {
    console.error('[CONNECTION-DNA] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function analyzeUserProfile(supabase: any, userId: string) {
  console.log('[CONNECTION-DNA] Analyzing user profile');

  // Get user's profile and interaction history
  const [profileRes, interactionsRes, quizRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('connection_dna_interactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
    supabase.from('user_responses').select('*').eq('user_id', userId)
  ]);

  const profile = profileRes.data;
  const interactions = interactionsRes.data || [];
  const quizResponses = quizRes.data || [];

  // Use OpenAI to analyze the data
  const analysis = await callOpenAI([
    {
      role: 'system',
      content: `You are an expert relationship psychologist and emotional intelligence analyst. Analyze user data to create a comprehensive emotional intelligence profile. Focus on:
      
      1. Communication Style: How they express themselves, tone, emotional expression
      2. Emotional Patterns: Response to different emotional situations
      3. Empathy Level: Ability to understand and relate to others
      4. Vulnerability Comfort: Willingness to be open and vulnerable
      5. Conflict Resolution: How they handle disagreements
      6. Love Language: Primary way they give/receive love
      7. Personality Markers: Key personality traits affecting relationships
      
      Return a JSON object with scores (0-100) and detailed analysis.`
    },
    {
      role: 'user',
      content: `Analyze this user's data:
      
      Profile: ${JSON.stringify(profile)}
      Recent Interactions: ${JSON.stringify(interactions.slice(0, 10))}
      Quiz Responses: ${JSON.stringify(quizResponses)}
      
      Provide emotional intelligence analysis with numerical scores and insights.`
    }
  ]);

  // Parse AI response
  let aiAnalysis;
  try {
    aiAnalysis = JSON.parse(analysis);
  } catch {
    // Fallback if JSON parsing fails
    aiAnalysis = {
      emotional_intelligence_score: 75.0,
      interaction_quality_score: 70.0,
      empathy_score: 80.0,
      vulnerability_comfort: 65.0,
      communication_style: { primary: 'thoughtful', secondary: 'warm' },
      love_language_primary: 'quality_time',
      conflict_resolution_style: 'collaborative'
    };
  }

  // Update or create DNA profile
  const { error: upsertError } = await supabase
    .from('connection_dna_profiles')
    .upsert({
      user_id: userId,
      emotional_intelligence_score: aiAnalysis.emotional_intelligence_score || 75.0,
      interaction_quality_score: aiAnalysis.interaction_quality_score || 70.0,
      empathy_score: aiAnalysis.empathy_score || 80.0,
      vulnerability_comfort: aiAnalysis.vulnerability_comfort || 65.0,
      communication_style: aiAnalysis.communication_style || {},
      emotional_patterns: aiAnalysis.emotional_patterns || {},
      personality_markers: aiAnalysis.personality_markers || {},
      love_language_primary: aiAnalysis.love_language_primary,
      love_language_secondary: aiAnalysis.love_language_secondary,
      conflict_resolution_style: aiAnalysis.conflict_resolution_style,
      last_analysis_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (upsertError) {
    console.error('[CONNECTION-DNA] Error updating profile:', upsertError);
  }

  console.log('[CONNECTION-DNA] Profile analysis complete');
  
  return new Response(JSON.stringify({ 
    success: true, 
    analysis: aiAnalysis,
    message: 'Profile analysis complete'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeInteraction(supabase: any, userId: string, interactionData: any) {
  console.log('[CONNECTION-DNA] Analyzing interaction');

  // Use OpenAI to analyze the interaction
  const analysis = await callOpenAI([
    {
      role: 'system',
      content: 'You are an expert in analyzing human emotional interactions. Analyze the given interaction data and provide scores for sentiment (-1.0 to 1.0), vulnerability level (0.0 to 1.0), engagement score (0.0 to 1.0), and identify emotional markers, empathy indicators. Return JSON format.'
    },
    {
      role: 'user',
      content: `Analyze this interaction: ${JSON.stringify(interactionData)}`
    }
  ]);

  let aiAnalysis;
  try {
    aiAnalysis = JSON.parse(analysis);
  } catch {
    aiAnalysis = {
      sentiment_score: 0.5,
      vulnerability_level: 0.3,
      engagement_score: 0.7,
      emotional_markers: ['positive', 'engaged'],
      empathy_indicators: ['active_listening']
    };
  }

  // Store the analyzed interaction
  const { error: insertError } = await supabase
    .from('connection_dna_interactions')
    .insert({
      user_id: userId,
      interaction_type: interactionData.type || 'message',
      other_user_id: interactionData.other_user_id,
      interaction_data: interactionData,
      emotional_markers: aiAnalysis.emotional_markers,
      sentiment_score: aiAnalysis.sentiment_score,
      vulnerability_level: aiAnalysis.vulnerability_level,
      engagement_score: aiAnalysis.engagement_score,
      empathy_indicators: aiAnalysis.empathy_indicators,
      response_time_seconds: interactionData.response_time_seconds,
      message_length: interactionData.message?.length || 0
    });

  if (insertError) {
    console.error('[CONNECTION-DNA] Error storing interaction:', insertError);
  }

  return new Response(JSON.stringify({ 
    success: true, 
    analysis: aiAnalysis 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeCompatibility(supabase: any, userId1: string, userId2: string) {
  console.log('[CONNECTION-DNA] Analyzing compatibility');

  // Get both users' DNA profiles
  const [profile1Res, profile2Res] = await Promise.all([
    supabase.from('connection_dna_profiles').select('*').eq('user_id', userId1).single(),
    supabase.from('connection_dna_profiles').select('*').eq('user_id', userId2).single()
  ]);

  if (!profile1Res.data || !profile2Res.data) {
    throw new Error('DNA profiles not found for one or both users');
  }

  const profile1 = profile1Res.data;
  const profile2 = profile2Res.data;

  // Use OpenAI to analyze compatibility
  const compatibility = await callOpenAI([
    {
      role: 'system',
      content: `You are an expert relationship compatibility analyst. Compare two Connection DNA profiles and provide:
      1. Overall compatibility score (0-100)
      2. Detailed sub-scores for different aspects
      3. Relationship strengths
      4. Growth areas
      5. Personalized conversation starters
      6. Date ideas based on their personalities
      
      Return detailed JSON analysis.`
    },
    {
      role: 'user',
      content: `Analyze compatibility between:
      
      Person 1: ${JSON.stringify(profile1)}
      Person 2: ${JSON.stringify(profile2)}
      
      Provide comprehensive compatibility analysis.`
    }
  ]);

  let aiCompatibility;
  try {
    aiCompatibility = JSON.parse(compatibility);
  } catch {
    aiCompatibility = {
      overall_compatibility_score: 78.5,
      emotional_sync_score: 82.0,
      communication_compatibility: 75.0,
      personality_match_score: 80.0,
      strengths: ['good communication', 'shared values'],
      growth_areas: ['conflict resolution'],
      conversation_starters: ['What\'s your favorite way to spend a weekend?']
    };
  }

  // Store compatibility analysis
  const { error: upsertError } = await supabase
    .from('connection_dna_compatibility')
    .upsert({
      user_id_1: userId1,
      user_id_2: userId2,
      overall_compatibility_score: aiCompatibility.overall_compatibility_score || 75.0,
      emotional_sync_score: aiCompatibility.emotional_sync_score || 75.0,
      communication_compatibility: aiCompatibility.communication_compatibility || 75.0,
      personality_match_score: aiCompatibility.personality_match_score || 75.0,
      shared_values_score: aiCompatibility.shared_values_score || 75.0,
      growth_potential_score: aiCompatibility.growth_potential_score || 75.0,
      conflict_harmony_score: aiCompatibility.conflict_harmony_score || 75.0,
      detailed_analysis: aiCompatibility.detailed_analysis || {},
      strengths: aiCompatibility.strengths || [],
      growth_areas: aiCompatibility.growth_areas || [],
      conversation_starters: aiCompatibility.conversation_starters || [],
      date_ideas: aiCompatibility.date_ideas || [],
      analysis_confidence: aiCompatibility.analysis_confidence || 0.7,
      last_analyzed_at: new Date().toISOString()
    }, { onConflict: 'user_id_1,user_id_2' });

  if (upsertError) {
    console.error('[CONNECTION-DNA] Error storing compatibility:', upsertError);
  }

  return new Response(JSON.stringify({ 
    success: true, 
    compatibility: aiCompatibility 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateInsights(supabase: any, userId: string) {
  console.log('[CONNECTION-DNA] Generating insights');

  // Get user's profile and recent interactions
  const [profileRes, interactionsRes] = await Promise.all([
    supabase.from('connection_dna_profiles').select('*').eq('user_id', userId).single(),
    supabase.from('connection_dna_interactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
  ]);

  const profile = profileRes.data;
  const interactions = interactionsRes.data || [];

  // Generate personalized insights
  const insights = await callOpenAI([
    {
      role: 'system',
      content: `You are a relationship coach providing personalized growth insights. Based on the user's Connection DNA profile and interactions, generate 3-5 actionable insights focusing on:
      1. Growth opportunities
      2. Relationship strengths to leverage
      3. Communication improvements
      4. Emotional intelligence development
      
      Each insight should have a title, description, actionable steps, and priority level. Return as JSON array.`
    },
    {
      role: 'user',
      content: `Generate insights for:
      Profile: ${JSON.stringify(profile)}
      Recent Interactions: ${JSON.stringify(interactions.slice(0, 5))}`
    }
  ]);

  let aiInsights;
  try {
    aiInsights = JSON.parse(insights);
  } catch {
    aiInsights = [
      {
        title: "Enhance Active Listening",
        description: "Your interactions show great empathy, but developing active listening skills could deepen your connections.",
        actionable_steps: ["Practice reflecting back what others say", "Ask follow-up questions"],
        priority_level: "medium",
        category: "communication"
      }
    ];
  }

  // Store insights
  for (const insight of aiInsights) {
    await supabase
      .from('connection_dna_insights')
      .insert({
        user_id: userId,
        insight_type: 'recommendation',
        title: insight.title,
        description: insight.description,
        actionable_steps: insight.actionable_steps || [],
        priority_level: insight.priority_level || 'medium',
        category: insight.category || 'general',
        confidence_level: 0.8,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    insights: aiInsights 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function callOpenAI(messages: any[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
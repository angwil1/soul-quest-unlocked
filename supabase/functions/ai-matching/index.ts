import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProfileWithQuiz {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  occupation: string;
  education: string;
  interests: string[];
  personality_traits: string[];
  values: string[];
  lifestyle: string[];
  quiz_results?: {
    personality_scores: any;
    compatibility_factors: any;
    love_languages: any;
    relationship_goals: any;
    lifestyle_preferences: any;
    communication_style: any;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!;
    
    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating AI matches for user:', user.id);

    // Get user's profile data AND quiz results for enhanced matching
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      console.error('Profile error:', profileError);
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's quiz results
    const { data: userQuizResults } = await supabaseClient
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get all other profiles with their quiz results
    const { data: allProfiles, error: allProfilesError } = await supabaseClient
      .from('profiles')
      .select(`
        *,
        quiz_results!inner (
          personality_scores,
          compatibility_factors,
          love_languages,
          relationship_goals,
          lifestyle_preferences,
          communication_style
        )
      `)
      .neq('id', user.id)
      .limit(50);

    if (allProfilesError) {
      console.log('Error with quiz results join, falling back to basic profiles');
      // Fallback to profiles without quiz data
      const { data: basicProfiles } = await supabaseClient
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(50);
      
      if (!basicProfiles || basicProfiles.length === 0) {
        return new Response(JSON.stringify({ error: 'No profiles found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const profiles = allProfiles || [];
    console.log(`Found ${profiles.length} potential matches`);

    // Use OpenAI for enhanced compatibility analysis
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const matches = [];

    // Process profiles in batches to avoid timeout
    const batchSize = 3;
    for (let i = 0; i < Math.min(profiles.length, 12); i += batchSize) {
      const batch = profiles.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (profile) => {
        try {
          // Build comprehensive compatibility prompt using quiz data
          const userQuizSummary = userQuizResults ? `
QUIZ RESULTS:
Communication Style: ${userQuizResults.personality_scores?.communication_style || 'Not provided'}
Social Energy: ${userQuizResults.personality_scores?.social_energy || 'Not provided'}
Relationship Values: ${userQuizResults.compatibility_factors?.relationship_values || 'Not provided'}
Conflict Resolution: ${userQuizResults.compatibility_factors?.conflict_resolution || 'Not provided'}
Love Language: ${userQuizResults.love_languages?.primary || 'Not provided'}
Family Importance: ${userQuizResults.relationship_goals?.family_importance || 'Not provided'}
Life Planning Style: ${userQuizResults.personality_scores?.life_planning || 'Not provided'}
Personal Growth Priority: ${userQuizResults.compatibility_factors?.personal_growth || 'Not provided'}
Quality Time Preference: ${userQuizResults.compatibility_factors?.quality_time || 'Not provided'}` : 'Quiz not completed';

          const matchQuizSummary = profile.quiz_results ? `
QUIZ RESULTS:
Communication Style: ${profile.quiz_results.personality_scores?.communication_style || 'Not provided'}
Social Energy: ${profile.quiz_results.personality_scores?.social_energy || 'Not provided'}
Relationship Values: ${profile.quiz_results.compatibility_factors?.relationship_values || 'Not provided'}
Conflict Resolution: ${profile.quiz_results.compatibility_factors?.conflict_resolution || 'Not provided'}
Love Language: ${profile.quiz_results.love_languages?.primary || 'Not provided'}
Family Importance: ${profile.quiz_results.relationship_goals?.family_importance || 'Not provided'}
Life Planning Style: ${profile.quiz_results.personality_scores?.life_planning || 'Not provided'}
Personal Growth Priority: ${profile.quiz_results.compatibility_factors?.personal_growth || 'Not provided'}
Quality Time Preference: ${profile.quiz_results.compatibility_factors?.quality_time || 'Not provided'}` : 'Quiz not completed';

          const compatibilityPrompt = `
Analyze deep compatibility between these two people using both their profiles AND detailed quiz responses.

USER PROFILE:
Name: ${userProfile.name || 'Not provided'}
Age: ${userProfile.age || 'Not provided'}
Bio: ${userProfile.bio || 'Not provided'}
Location: ${userProfile.location || 'Not provided'}
Occupation: ${userProfile.occupation || 'Not provided'}
Education: ${userProfile.education || 'Not provided'}
Interests: ${Array.isArray(userProfile.interests) ? userProfile.interests.join(', ') : 'Not provided'}
${userQuizSummary}

POTENTIAL MATCH:
Name: ${profile.name || 'Not provided'}
Age: ${profile.age || 'Not provided'}
Bio: ${profile.bio || 'Not provided'}
Location: ${profile.location || 'Not provided'}
Occupation: ${profile.occupation || 'Not provided'}
Education: ${profile.education || 'Not provided'}
Interests: ${Array.isArray(profile.interests) ? profile.interests.join(', ') : 'Not provided'}
${matchQuizSummary}

Analyze their compatibility focusing on:
1. Communication compatibility (how well their styles complement each other)
2. Relationship values alignment (trust/honesty vs adventure vs stability vs fun)
3. Conflict resolution compatibility (how their approaches work together)
4. Love language compatibility (can they meet each other's needs)
5. Social energy balance (introvert/extrovert dynamics)
6. Life planning harmony (structured vs flexible vs spontaneous)
7. Personal growth alignment (importance of development together)
8. Family values compatibility
9. Shared interests and lifestyle compatibility

Provide a sophisticated analysis that goes beyond surface-level matching.

Respond with ONLY a JSON object in this exact format:
{
  "compatibility_score": 87,
  "explanation": "Exceptional compatibility with complementary communication styles. Both value trust and growth while balancing planning with spontaneity.",
  "compatibility_breakdown": {
    "communication": 90,
    "values": 85,
    "lifestyle": 80,
    "love_languages": 95,
    "conflict_resolution": 75
  },
  "strengths": ["Complementary communication styles", "Shared growth mindset", "Compatible love languages"],
  "potential_challenges": ["Different conflict resolution approaches", "Varied social energy needs"],
  "shared_interests": ["personal growth", "meaningful conversations"],
  "conversation_starters": ["Ask about their perspective on balancing planning with spontaneity", "Share thoughts on what personal growth means in relationships"],
  "relationship_prediction": "High potential for deep, meaningful connection with excellent communication foundation"
}

The compatibility_score should be between 1-100 and reflect genuine deep compatibility, not just surface attraction.`;

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert relationship compatibility analyst with deep understanding of psychology, communication patterns, and relationship dynamics. Provide sophisticated compatibility assessments based on personality psychology and relationship science. Always respond with valid JSON only.'
                },
                {
                  role: 'user',
                  content: compatibilityPrompt
                }
              ],
              temperature: 0.3,
              max_tokens: 500,
            }),
          });

          if (!response.ok) {
            console.error(`OpenAI API error for profile ${profile.id}:`, response.status, response.statusText);
            return null;
          }

          const data = await response.json();
          const aiAnalysis = JSON.parse(data.choices[0].message.content);

          return {
            profile,
            compatibility_score: aiAnalysis.compatibility_score,
            explanation: aiAnalysis.explanation,
            compatibility_breakdown: aiAnalysis.compatibility_breakdown || {},
            strengths: aiAnalysis.strengths || [],
            potential_challenges: aiAnalysis.potential_challenges || [],
            shared_interests: aiAnalysis.shared_interests || [],
            conversation_starters: aiAnalysis.conversation_starters || [],
            relationship_prediction: aiAnalysis.relationship_prediction || '',
            has_quiz_data: !!profile.quiz_results
          };
        } catch (error) {
          console.error(`Error processing profile ${profile.id}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      matches.push(...batchResults.filter(result => result !== null));

      // Small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Sort by compatibility score, prioritizing those with quiz data
    matches.sort((a, b) => {
      // Boost score for profiles with quiz data
      const scoreA = a.has_quiz_data ? a.compatibility_score + 5 : a.compatibility_score;
      const scoreB = b.has_quiz_data ? b.compatibility_score + 5 : b.compatibility_score;
      return scoreB - scoreA;
    });

    // Take top 8 matches
    const topMatches = matches.slice(0, 8);

    console.log(`Generated ${topMatches.length} AI-powered matches with enhanced compatibility analysis`);

    return new Response(JSON.stringify({ 
      matches: topMatches,
      total_analyzed: Math.min(profiles.length, 12),
      user_has_quiz: !!userQuizResults,
      message: userQuizResults ? "Matches generated using detailed compatibility quiz data" : "Complete your compatibility quiz for even better matches!"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-matching function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
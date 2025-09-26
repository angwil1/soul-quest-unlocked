import "xhr";
import { serve } from "serve";
import { createClient } from 'supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchProfile {
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

    // Get user's profile data for matching
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

    // Get all other profiles to match against
    const { data: allProfiles, error: allProfilesError } = await supabaseClient
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .limit(50);

    if (allProfilesError || !allProfiles) {
      console.error('Error fetching profiles:', allProfilesError);
      return new Response(JSON.stringify({ error: 'Could not fetch profiles' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${allProfiles.length} potential matches`);

    // Use OpenAI to generate compatibility scores and explanations
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const matches = [];

    // Process profiles in batches to avoid timeout
    const batchSize = 5;
    for (let i = 0; i < Math.min(allProfiles.length, 15); i += batchSize) {
      const batch = allProfiles.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (profile) => {
        try {
          const compatibilityPrompt = `
Analyze compatibility between these two dating profiles and provide a compatibility score and explanation.

USER PROFILE:
Name: ${userProfile.name || 'Not provided'}
Age: ${userProfile.age || 'Not provided'}
Bio: ${userProfile.bio || 'Not provided'}
Location: ${userProfile.location || 'Not provided'}
Occupation: ${userProfile.occupation || 'Not provided'}
Education: ${userProfile.education || 'Not provided'}
Interests: ${Array.isArray(userProfile.interests) ? userProfile.interests.join(', ') : 'Not provided'}

POTENTIAL MATCH:
Name: ${profile.name || 'Not provided'}
Age: ${profile.age || 'Not provided'}
Bio: ${profile.bio || 'Not provided'}
Location: ${profile.location || 'Not provided'}
Occupation: ${profile.occupation || 'Not provided'}
Education: ${profile.education || 'Not provided'}
Interests: ${Array.isArray(profile.interests) ? profile.interests.join(', ') : 'Not provided'}

Please analyze their compatibility and respond with ONLY a JSON object in this exact format:
{
  "compatibility_score": 85,
  "explanation": "Strong compatibility based on shared interests in photography and travel. Both are creative professionals with similar life goals.",
  "shared_interests": ["photography", "travel"],
  "conversation_starters": ["Ask about their recent photography projects", "Share travel stories from San Francisco"]
}

The compatibility_score should be between 1-100. Focus on genuine compatibility factors like shared values, interests, life goals, and communication styles.`;

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
                  content: 'You are an expert relationship compatibility analyzer. Provide thoughtful, genuine compatibility assessments based on the profiles provided. Always respond with valid JSON only.'
                },
                {
                  role: 'user',
                  content: compatibilityPrompt
                }
              ],
              temperature: 0.7,
              max_tokens: 300,
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
            shared_interests: aiAnalysis.shared_interests || [],
            conversation_starters: aiAnalysis.conversation_starters || []
          };
        } catch (error) {
          console.error(`Error processing profile ${profile.id}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      matches.push(...batchResults.filter(result => result !== null));
    }

    // Sort by compatibility score
    matches.sort((a, b) => b.compatibility_score - a.compatibility_score);

    // Take top 10 matches
    const topMatches = matches.slice(0, 10);

    console.log(`Generated ${topMatches.length} AI-powered matches`);

    return new Response(JSON.stringify({ 
      matches: topMatches,
      total_analyzed: Math.min(allProfiles.length, 15)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-matching function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
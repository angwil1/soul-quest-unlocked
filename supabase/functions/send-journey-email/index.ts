import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  userId: string;
  email: string;
  eventType: string;
  userData?: {
    name?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[SEND-JOURNEY-EMAIL] Function started");
    
    const { userId, email, eventType, userData }: EmailRequest = await req.json();
    
    console.log("[SEND-JOURNEY-EMAIL] Processing request:", { userId, email, eventType });

    let emailSubject = "";
    let emailHtml = "";

    switch (eventType) {
      case "quiz_completed":
        // Get user's top matches from database
        const { data: matches } = await supabase
          .from('matches')
          .select(`
            user2_id,
            score,
            profiles!matches_user2_id_fkey(name, age, interests)
          `)
          .eq('user1_id', userId)
          .order('score', { ascending: false })
          .limit(3);

        console.log("[SEND-JOURNEY-EMAIL] Found matches:", matches);

        let matchesHtml = '';
        if (matches && matches.length > 0) {
          matchesHtml = matches.map((match, index) => {
            const profile = match.profiles;
            const interests = Array.isArray(profile?.interests) ? profile.interests.slice(0, 2) : [];
            
            return `
              <div style="background: white; border: 2px solid ${index === 0 ? '#6366f1' : '#e5e7eb'}; border-radius: 12px; padding: 20px; margin-bottom: 15px; position: relative;">
                ${index === 0 ? '<div style="position: absolute; top: -10px; right: 15px; background: #6366f1; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">Top Match</div>' : ''}
                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
                    ${profile?.name?.charAt(0) || '?'}
                  </div>
                  <div style="flex: 1;">
                    <h3 style="margin: 0 0 5px 0; color: #374151; font-size: 18px;">${profile?.name || 'Mystery Match'}</h3>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Age: ${profile?.age || 'Not specified'}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        ${Math.round((match.score || 0) * 100)}% Match
                      </div>
                      ${interests.length > 0 ? `
                        <div style="color: #6b7280; font-size: 12px;">
                          ${interests.join(', ')}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        } else {
          matchesHtml = `
            <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 15px;">
              <p style="color: #6b7280; margin: 0;">We're still finding your perfect matches! Check back soon.</p>
            </div>
          `;
        }

        emailSubject = "🎉 Your Quiz Results + Top Matches Inside!";
        emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366f1; margin-bottom: 10px;">🎉 Your Quiz Results Are Ready!</h1>
              <p style="color: #6b7280; font-size: 16px;">Your personalized matches based on compatibility</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 25px; border-radius: 12px; color: white; margin-bottom: 30px; text-align: center;">
              <h2 style="margin: 0 0 10px 0; font-size: 22px;">✨ Your Top Matches</h2>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">
                Based on your quiz responses, here are your most compatible connections
              </p>
            </div>

            <div style="margin-bottom: 30px;">
              ${matchesHtml}
            </div>

            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #0369a1; margin: 0 0 10px 0; font-size: 16px;">🔮 Want to see ALL your matches?</h3>
              <p style="color: #0369a1; margin: 0 0 15px 0; font-size: 14px;">
                Unlock your complete compatibility profile with deeper insights, conversation starters, and unlimited matches.
              </p>
              <a href="https://aicompleteme.com/pricing" 
                 style="background: #0ea5e9; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px;">
                Upgrade to Premium
              </a>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://aicompleteme.com/quiz-results" 
                 style="background: #6366f1; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                View All Results
              </a>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                Ready to start conversations? Your matches are waiting! 💕
              </p>
            </div>
          </div>
        `;
        break;

      case "profile_completed":
        emailSubject = "Welcome to GetUnlocked - Your Profile is Live!";
        emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #6366f1;">Welcome to GetUnlocked!</h1>
            <p>Your profile is now live and we're already finding compatible matches for you.</p>
            <p>Get ready to discover meaningful connections!</p>
          </div>
        `;
        break;

      default:
        console.log("[SEND-JOURNEY-EMAIL] Unknown event type:", eventType);
        return new Response(
          JSON.stringify({ error: "Unknown event type" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
    }

    const emailResponse = await resend.emails.send({
      from: "GetUnlocked <noreply@getunlockedapp.com>",
      to: [email],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("[SEND-JOURNEY-EMAIL] Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("[SEND-JOURNEY-EMAIL] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
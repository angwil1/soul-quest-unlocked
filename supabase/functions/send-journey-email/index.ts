import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
        emailSubject = "Your GetUnlocked Compatibility Results";
        emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366f1; margin-bottom: 10px;">🎉 Your Compatibility Profile is Ready!</h1>
              <p style="color: #6b7280; font-size: 16px;">Discover your unique connection insights</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px; color: white; margin-bottom: 30px;">
              <h2 style="margin: 0 0 15px 0; font-size: 24px;">Your Results Are In!</h2>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">
                We've analyzed your quiz responses and found some amazing insights about how you connect with others.
              </p>
            </div>

            <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #374151; margin: 0 0 15px 0;">Your Profile Includes:</h3>
              <ul style="color: #6b7280; line-height: 1.6; padding-left: 20px;">
                <li>Personalized compatibility score</li>
                <li>Your unique vibe signals</li>
                <li>Deep insights about your connection style</li>
                <li>Curated matches based on your responses</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://65aad2fc-5b33-4030-8f73-3783f744043f.lovableproject.com/quiz-results" 
                 style="background: #6366f1; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                View Your Full Results
              </a>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                Ready to find deeper connections? Your matches are waiting for you.
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
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  userId: string;
  journeyType: 'welcome' | 'quiz_completed' | 'match_velocity_slow';
  userEmail: string;
  userName?: string;
  additionalData?: any;
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    const { userId, journeyType, userEmail, userName, additionalData }: EmailRequest = await req.json();

    console.log(`Sending ${journeyType} email to ${userEmail} for user ${userId}`);

    // Check if we've already sent this journey type to this user recently
    const { data: existingJourney } = await supabase
      .from('email_journeys')
      .select('*')
      .eq('user_id', userId)
      .eq('journey_type', journeyType)
      .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Within last 24 hours
      .single();

    if (existingJourney) {
      console.log(`Email journey ${journeyType} already sent to user ${userId} recently`);
      return new Response(
        JSON.stringify({ message: 'Email already sent recently' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let emailData: any = {};
    let subject = '';
    let html = '';

    // Generate email content based on journey type
    switch (journeyType) {
      case 'welcome':
        subject = '🎉 Welcome to GetUnlocked - Your Love Story Starts Here!';
        html = generateWelcomeEmail(userName || 'there');
        break;
      
      case 'quiz_completed':
        subject = '✨ Amazing! Your Compatibility Profile is Ready';
        html = generateQuizCompletedEmail(userName || 'there');
        break;
      
      case 'match_velocity_slow':
        subject = '💫 New Compatible Profiles Are Waiting for You';
        html = generateReEngagementEmail(userName || 'there');
        break;
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: 'GetUnlocked <onboarding@resend.dev>',
      to: [userEmail],
      subject,
      html,
    });

    console.log('Email sent successfully:', emailResponse);

    // Record the email journey in database
    const { error: insertError } = await supabase
      .from('email_journeys')
      .insert({
        user_id: userId,
        journey_type: journeyType,
        email_address: userEmail,
        email_status: 'sent',
        email_data: {
          resend_id: emailResponse.data?.id,
          subject,
          additional_data: additionalData
        }
      });

    if (insertError) {
      console.error('Error recording email journey:', insertError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        resend_id: emailResponse.data?.id,
        journey_type: journeyType 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-journey-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateWelcomeEmail(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to GetUnlocked</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; margin-bottom: 10px;">🎉 Welcome to GetUnlocked!</h1>
          <p style="font-size: 18px; color: #666;">Your journey to meaningful connections starts now</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; padding: 30px; color: white; margin-bottom: 30px;">
          <h2 style="margin-top: 0; font-size: 24px;">Hey ${userName}! 👋</h2>
          <p style="font-size: 16px; margin-bottom: 20px;">
            You've just joined thousands of people who are serious about finding authentic, lasting connections. 
            Unlike other dating apps, we use advanced compatibility matching to help you find someone truly special.
          </p>
          <div style="text-align: center;">
            <a href="https://getunlocked.com/questions" style="background: white; color: #6366f1; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Take Your Compatibility Quiz →
            </a>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #6366f1; margin-bottom: 15px;">🚀 Here's what happens next:</h3>
          <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; margin-bottom: 15px;">
            <strong>1. Complete Your Compatibility Quiz</strong><br>
            <span style="color: #666;">Answer thoughtful questions that reveal your true personality and relationship goals.</span>
          </div>
          <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; margin-bottom: 15px;">
            <strong>2. Build Your Profile</strong><br>
            <span style="color: #666;">Add photos and details that showcase your authentic self.</span>
          </div>
          <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 20px;">
            <strong>3. Discover Quality Matches</strong><br>
            <span style="color: #666;">Our AI finds people who truly align with your values and lifestyle.</span>
          </div>
        </div>

        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h4 style="color: #92400e; margin-top: 0;">✨ Pro Tip for Better Matches</h4>
          <p style="color: #92400e; margin-bottom: 0;">
            Users who complete their full profile within the first 48 hours get 3x more quality matches. 
            <strong>Ready to unlock your potential?</strong>
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0; color: #666; font-size: 14px;">
          <p>Need help? Reply to this email or visit our <a href="https://getunlocked.com/help" style="color: #6366f1;">Help Center</a></p>
          <p>❤️ The GetUnlocked Team</p>
        </div>
      </body>
    </html>
  `;
}

function generateQuizCompletedEmail(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Compatibility Profile is Ready!</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin-bottom: 10px;">✨ Compatibility Profile Complete!</h1>
          <p style="font-size: 18px; color: #666;">Your unique personality insights are ready</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); border-radius: 12px; padding: 30px; color: white; margin-bottom: 30px;">
          <h2 style="margin-top: 0; font-size: 24px;">Awesome work, ${userName}! 🎯</h2>
          <p style="font-size: 16px; margin-bottom: 20px;">
            You've just unlocked the power of science-based matching! Your thoughtful answers give us incredible 
            insights into your personality, values, and what makes you tick.
          </p>
          <div style="text-align: center;">
            <a href="https://getunlocked.com/profile" style="background: white; color: #10b981; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Complete Your Profile →
            </a>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #10b981; margin-bottom: 15px;">🧬 What Your Quiz Revealed:</h3>
          <div style="background: #f0fdfa; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="margin-bottom: 15px;">Based on your responses, our compatibility algorithm can now:</p>
            <ul style="color: #047857; margin: 0; padding-left: 20px;">
              <li>Identify your core personality traits and communication style</li>
              <li>Understand your relationship goals and values</li>
              <li>Find people with complementary personalities</li>
              <li>Predict long-term compatibility potential</li>
            </ul>
          </div>
        </div>

        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h4 style="color: #92400e; margin-top: 0;">🚀 Next Step: Add Photos & Details</h4>
          <p style="color: #92400e; margin-bottom: 10px;">
            Now that we know your personality, let's show the world your authentic self! 
            <strong>Complete your profile to start receiving matches.</strong>
          </p>
          <div style="text-align: center; margin-top: 15px;">
            <a href="https://getunlocked.com/profile/edit" style="background: #f59e0b; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              Add Photos & Complete Profile
            </a>
          </div>
        </div>

        <div style="background: #e0e7ff; border: 1px solid #6366f1; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h4 style="color: #4338ca; margin-top: 0;">💎 Want Premium Matching?</h4>
          <p style="color: #4338ca; margin-bottom: 15px;">
            Upgrade to see who likes you, get unlimited super-likes, and access our premium compatibility reports.
          </p>
          <div style="text-align: center;">
            <a href="https://getunlocked.com/pricing" style="background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              View Premium Features
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0; color: #666; font-size: 14px;">
          <p>Questions about your results? Reply to this email!</p>
          <p>🧡 The GetUnlocked Team</p>
        </div>
      </body>
    </html>
  `;
}

function generateReEngagementEmail(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Compatible Profiles Await</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ec4899; margin-bottom: 10px;">💫 New Matches Are Here!</h1>
          <p style="font-size: 18px; color: #666;">Your perfect match might be just one swipe away</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); border-radius: 12px; padding: 30px; color: white; margin-bottom: 30px;">
          <h2 style="margin-top: 0; font-size: 24px;">Hey ${userName}! 👋</h2>
          <p style="font-size: 16px; margin-bottom: 20px;">
            We've been working behind the scenes to find you some incredible new matches. 
            Our compatibility algorithm has discovered profiles that align beautifully with your personality and values.
          </p>
          <div style="text-align: center;">
            <a href="https://getunlocked.com/" style="background: white; color: #ec4899; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              See Your New Matches →
            </a>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #ec4899; margin-bottom: 15px;">🎯 Why These Matches Are Special:</h3>
          <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 20px; margin-bottom: 15px;">
            <strong>🧬 High Compatibility Scores</strong><br>
            <span style="color: #666;">These profiles scored 85%+ compatibility with your personality type.</span>
          </div>
          <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 20px; margin-bottom: 15px;">
            <strong>🎯 Shared Values</strong><br>
            <span style="color: #666;">Similar relationship goals and life priorities.</span>
          </div>
          <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 20px;">
            <strong>✨ Active Users</strong><br>
            <span style="color: #666;">All profiles have been active within the last week.</span>
          </div>
        </div>

        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h4 style="color: #92400e; margin-top: 0;">⏰ Don't Miss Out!</h4>
          <p style="color: #92400e; margin-bottom: 10px;">
            Great profiles don't last long on dating apps. The best matches often get snatched up quickly by other users.
            <strong>Take a few minutes to browse today!</strong>
          </p>
        </div>

        <div style="background: #e0e7ff; border: 1px solid #6366f1; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h4 style="color: #4338ca; margin-top: 0;">🚀 Boost Your Visibility</h4>
          <p style="color: #4338ca; margin-bottom: 15px;">
            Want to stand out? Premium members get 5x more profile views and can see who likes them instantly. 
            Perfect timing for these new matches!
          </p>
          <div style="text-align: center;">
            <a href="https://getunlocked.com/pricing" style="background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              Upgrade for Better Results
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: #f8fafc; border-radius: 8px; padding: 25px;">
            <h4 style="color: #374151; margin-top: 0;">💡 Dating Tip of the Week</h4>
            <p style="color: #6b7280; font-style: italic; margin-bottom: 0;">
              "The best conversations start with genuine curiosity about the other person. 
              Ask about their passions, not just their job!"
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0; color: #666; font-size: 14px;">
          <p>Getting too many emails? <a href="#" style="color: #ec4899;">Adjust your preferences</a></p>
          <p>💖 The GetUnlocked Team</p>
        </div>
      </body>
    </html>
  `;
}
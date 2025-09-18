import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 mb-4 min-h-[44px] px-4 py-2 touch-target hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">
              <strong>Effective Date:</strong> July 26, 2025 | <strong>Last Updated:</strong> July 26, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <p>
              AI Complete Me ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our services via www.aicompleteme.com (the "Site") and related platforms.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>We collect only the information you choose to share with us.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Basic Profile Info:</strong> Interests, personality quiz answers, subscription level.</li>
                <li><strong>Usage Data:</strong> Feature engagement, interaction history, mood check-ins.</li>
                <li><strong>Optional Inputs:</strong> Video intros, emotional reflections, feedback submissions.</li>
              </ul>
              <p>
                We do not require email, phone number, or real-world identity to use core features. Authentication is handled securely via Supabase Edge Functions and RLS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To personalize your experience and generate matches using AI</li>
                <li>To improve platform performance, emotional resonance, and user experience</li>
                <li>To manage subscriptions, billing, and feature access via Stripe</li>
                <li>To protect community safety and enforce platform integrity</li>
              </ul>
              <p>We do not sell or share your data with third-party advertisers.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. AI and Matchmaking</h2>
              <p>
                Our AI insights (Emotional Forecast, Connection DNA) are powered by OpenAI and internal algorithms. You control what inputs are used for matching, and can opt out of premium-only digests or features at any time.
              </p>
              <p>
                Your inputs may be temporarily processed by external services (OpenAI API) for compatibility scoring. No data is used for training external models.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Your Controls and Choices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Blur Toggle:</strong> Control visual comfort in video chat</li>
                <li><strong>Data Visibility:</strong> No default public profile, anonymized matches</li>
                <li><strong>Subscription Opt-In:</strong> Premium features are gated but optional</li>
                <li><strong>Feedback Submission:</strong> Journaling and polls can be anonymous</li>
              </ul>
              <p>
                You may request data deletion or export by contacting us at: support@aicompleteme.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Security Practices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hosted on secure Supabase infrastructure with RLS policies</li>
                <li>All secrets, keys, and match logic are protected using least privilege access</li>
                <li>Stripe billing and subscription data is managed securely via encrypted tokens</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Changes to This Policy</h2>
              <p>
                We may update this policy to reflect evolving laws or feature changes. We'll notify users through in-app alerts or homepage banners if changes are significant.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Data Sharing for App Store Compliance</h2>
              <p>
                For Google Play Store billing and subscription management, we may share minimal necessary data with Google:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>User ID and subscription status for billing verification</li>
                <li>Purchase confirmation data required by Google Play Store policies</li>
                <li>Anonymous usage analytics to improve app store recommendations (optional)</li>
              </ul>
              <p>
                This data sharing is limited to what's required for app store functionality and billing. No personal dating or profile information is shared with Google or other third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
              <p>
                For questions or privacy requests:<br />
                📧 support@aicompleteme.com<br />
                🌐 www.aicompleteme.com/privacy
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
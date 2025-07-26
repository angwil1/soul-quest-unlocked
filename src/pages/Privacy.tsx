import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">
              <strong>Effective Date:</strong> January 1, 2024 | <strong>Last Updated:</strong> January 1, 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <p>
              GetUnlocked ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our services via www.getunlockedapp.com (the "Site") and related platforms.
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
                You may request data deletion or export by contacting us at: support@getunlockedapp.com
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
              <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
              <p>
                For questions or privacy requests:<br />
                📧 support@getunlockedapp.com<br />
                🌐 www.getunlockedapp.com/privacy
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
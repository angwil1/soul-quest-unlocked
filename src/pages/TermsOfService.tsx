import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
            <p className="text-center text-muted-foreground">
              <strong>Effective Date:</strong> July 26, 2025 | <strong>Last Updated:</strong> July 26, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <p>
              Welcome to AI Complete Me ("we," "us," or "our"). These Terms of Service ("Terms") govern your use of our dating platform accessible at www.aicompleteme.com (the "Service").
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use AI Complete Me</li>
                <li>You must provide accurate and truthful information</li>
                <li>You must not have been previously banned from the platform</li>
                <li>You represent that you have the legal capacity to enter into these Terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Account Registration</h2>
              <p>
                To access certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and up-to-date information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any unlawful purpose or in violation of these Terms</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload false, misleading, or inappropriate content</li>
                <li>Attempt to circumvent security measures or access unauthorized areas</li>
                <li>Use automated systems to interact with the Service</li>
                <li>Impersonate another person or entity</li>
                <li>Solicit money or personal information from other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Premium Subscriptions & Billing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Billing:</strong> Subscriptions are billed monthly or annually as selected through Google Play Store</li>
                <li><strong>Cancellation:</strong> You may cancel at any time through your Google Play Store account settings</li>
                <li><strong>Refunds:</strong> Refunds are handled according to Google Play Store refund policies</li>
                <li><strong>Auto-renewal:</strong> Subscriptions automatically renew until canceled through Google Play Store</li>
                <li><strong>Price Changes:</strong> We may adjust pricing with 30 days advance notice through the store</li>
                <li><strong>Currency:</strong> All prices are displayed in your local currency through Google Play Store</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                For billing support, subscription management, and refunds, please contact Google Play Store customer service or manage through your Google Play account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Content and Intellectual Property</h2>
              <p>
                You retain ownership of content you upload but grant us a license to use, display, and distribute it for Service operation. All platform content, features, and functionality are owned by AI Complete Me and protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Privacy and Data</h2>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the Service, you consent to our data practices as described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Disclaimers</h2>
              <p>
                The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free. We are not responsible for the conduct of users or the outcome of any interactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, AI Complete Me shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where AI Complete Me is incorporated, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of significant changes through the Service or via email. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Content Rating & Age Restrictions</h2>
              <p>
                AI Complete Me is rated for mature audiences (17+) and is intended for adults 18 years and older. The app contains:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dating and relationship content suitable for mature audiences</li>
                <li>User-generated content that may include mature themes</li>
                <li>Communication features between consenting adults</li>
                <li>Profile photos and personal information sharing capabilities</li>
              </ul>
              <p>
                This app is not intended for users under 18 years of age. Age verification is required and enforced upon first app access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">15. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:<br />
                📧 support@aicompleteme.com<br />
                🌐 www.aicompleteme.com/terms
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
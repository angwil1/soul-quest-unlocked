import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookieStatement() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Cookie Statement</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              AI Complete Me uses only essential cookies to support secure login and remember your preferences. We do not use tracking technologies, analytics cookies, or third-party advertising. Your experience is private, ambient, and yours alone.
            </p>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">What Are Cookies?</h3>
              <p>
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and keeping you securely logged in.
              </p>
              
              <h3 className="text-xl font-semibold">Essential Cookies Only</h3>
              <p>
                We only use essential cookies that are necessary for the basic functionality of our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Authentication Cookies:</strong> To keep you securely logged in to your account</li>
                <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
                <li><strong>Security Cookies:</strong> To protect against fraud and ensure secure connections</li>
              </ul>
              
              <h3 className="text-xl font-semibold">Data Collection for Legal Compliance</h3>
              <p>
                In addition to essential cookies, we collect minimal personal information required by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Date of Birth:</strong> Collected during registration solely for age verification to comply with legal requirements that restrict access to users 18 and older</li>
                <li><strong>Email Address:</strong> Required for account creation and secure login</li>
                <li><strong>Profile Information:</strong> Only what you choose to share in your dating profile</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>Privacy Promise:</strong> Your date of birth is used only for age verification and legal compliance. We do not use it for advertising, marketing, or any other purpose beyond ensuring you meet the minimum age requirement for our platform.
              </p>
              
              <h3 className="text-xl font-semibold">What We Don't Use</h3>
              <p>
                Unlike many other platforms, AI Complete Me does not use:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tracking cookies or pixels</li>
                <li>Analytics cookies (even basic ones)</li>
                <li>Third-party advertising cookies</li>
                <li>Social media tracking cookies</li>
                <li>Marketing or behavioral targeting cookies</li>
              </ul>
              
              <h3 className="text-xl font-semibold">Your Control</h3>
              <p>
                You can control cookie settings in your browser, but please note that disabling essential cookies may affect the functionality of our platform, including your ability to log in and access your account.
              </p>
              
              <h3 className="text-xl font-semibold">Questions?</h3>
              <p>
                If you have any questions about our cookie practices, please contact us at{" "}
                <a href="mailto:privacy@getunlockedapp.com" className="text-primary hover:underline">
                  privacy@getunlockedapp.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
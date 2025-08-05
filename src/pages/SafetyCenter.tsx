import { Navbar } from "@/components/Navbar";
import { AgeVerification } from "@/components/AgeVerification";
import { SafetySettings } from "@/components/SafetySettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, AlertTriangle, Phone } from "lucide-react";

const SafetyCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Safety Center</h1>
          </div>
          <p className="text-muted-foreground">
            Your safety is our priority. Manage your security settings and learn about our safety features.
          </p>
        </div>

        <div className="space-y-6">
          {/* Age Verification */}
          <AgeVerification />

          {/* Safety Settings */}
          <SafetySettings />

          {/* Safety Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Safety Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Report Concerns</h3>
                  <p className="text-sm text-muted-foreground">
                    Report any inappropriate behavior, harassment, or safety concerns using the report button on user profiles.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Block Users</h3>
                  <p className="text-sm text-muted-foreground">
                    Block users who make you uncomfortable. They won't be able to contact you or see your profile.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Meeting Safely</h3>
                  <p className="text-sm text-muted-foreground">
                    Always meet in public places, tell a friend your plans, and trust your instincts.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Privacy Protection</h3>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile and personal information with our privacy settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">1</Badge>
                  <p className="text-sm">Be respectful and kind to all community members</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">2</Badge>
                  <p className="text-sm">Use recent and authentic photos that represent you accurately</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">3</Badge>
                  <p className="text-sm">Do not share inappropriate, offensive, or explicit content</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">4</Badge>
                  <p className="text-sm">Respect boundaries and consent in all interactions</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">5</Badge>
                  <p className="text-sm">Report any violations or concerns to help keep our community safe</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Resources */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <Phone className="h-5 w-5" />
                Emergency Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-red-700 dark:text-red-300">
                <p className="font-semibold">If you're in immediate danger, call emergency services:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Emergency: 911 (US)</li>
                  <li>• National Domestic Violence Hotline: 1-800-799-7233</li>
                  <li>• Crisis Text Line: Text HOME to 741741</li>
                  <li>• RAINN National Sexual Assault Hotline: 1-800-656-4673</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SafetyCenter;
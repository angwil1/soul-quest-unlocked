import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Heart, Users, Brain, Sparkles } from "lucide-react";

const Mission = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Our Mission
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI Complete Me doesn't promise romantic destiny. It offers emotional clarity, gentle insight, and space to reflect on what truly resonates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Emotional Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe connection starts with understanding yourself. Our platform helps you explore your emotional patterns and what truly matters to you in relationships.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Authentic Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're not about quick swipes or surface-level interactions. Every feature is designed to help you form meaningful connections based on genuine compatibility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Mindful Matching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI doesn't promise perfect matches—it observes patterns and emotional cues to help you notice more about yourself and potential connections.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Privacy First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vulnerability is earned, not demanded. You control your pace, your privacy, and what you choose to share. Trust builds over time.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Makes Us Different</CardTitle>
              <CardDescription>
                Connection doesn't always mean romance—it means understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">No False Promises</h3>
                  <p className="text-muted-foreground">
                    We don't guarantee love or perfect matches. Connection requires curiosity, presence, and trust—we just help you notice more.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">Emotional Reflection</h3>
                  <p className="text-muted-foreground">
                    Our platform offers space to reflect on what truly resonates with you, helping you understand your own patterns and desires.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">Quality Over Quantity</h3>
                  <p className="text-muted-foreground">
                    Sometimes emotional resonance takes time. We focus on meaningful connections rather than endless options.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Begin?</h2>
            <p className="text-muted-foreground mb-6">
              Start your journey toward deeper connections and emotional clarity
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
              <Link to="/faq">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
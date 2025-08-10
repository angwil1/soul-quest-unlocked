import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CheckCircle, ArrowRight, Heart, Zap, Brain, User, UserCheck, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

const QuickStart = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if profile is considered complete (has basic info like name, age, etc.)
  const isProfileComplete = profile?.name && profile?.age && profile?.zip_code;
  const canTakeQuiz = user && isProfileComplete;

  const handleStepClick = (step: number) => {
    switch (step) {
      case 1:
        // Create Account
        if (!user) {
          navigate('/auth');
        } else {
          // User already has account, go to step 2
          navigate('/profile/edit');
        }
        break;
      case 2:
        // Complete Profile  
        if (!user) {
          toast({
            title: "Create Account First",
            description: "Please create an account before completing your profile.",
            variant: "destructive"
          });
          navigate('/auth');
        } else {
          navigate('/profile/edit');
        }
        break;
      case 3:
        // Take Quiz
        if (!user) {
          toast({
            title: "Create Account First",
            description: "Please create an account and complete your profile before taking the quiz.",
            variant: "destructive"
          });
          navigate('/auth');
        } else if (!isProfileComplete) {
          toast({
            title: "Complete Profile First",
            description: "Please complete your profile before taking the personality quiz.",
            variant: "destructive"
          });
          navigate('/profile/edit');
        } else {
          navigate('/questions');
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Quick Start Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Get started with AI Complete Me in just a few simple steps
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Your Journey Begins Here
              </CardTitle>
              <CardDescription>
                Follow these steps to create meaningful connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div 
                  className="text-center p-6 rounded-lg bg-muted/50 border hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 group"
                  onClick={() => handleStepClick(1)}
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {user ? <CheckCircle className="h-6 w-6" /> : "1"}
                  </div>
                  <h3 className="font-semibold mb-2">Create Your Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">Sign up with your email and set your basic preferences</p>
                  <div className="flex items-center justify-center gap-2">
                    {user ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Complete</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-xs text-primary font-medium">Click to start</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`text-center p-6 rounded-lg border transition-all duration-200 group ${
                    !user 
                      ? "bg-muted/50 hover:border-primary/50 hover:bg-primary/5 cursor-pointer" 
                      : "bg-green-50 border-green-200 cursor-default"
                  }`}
                  onClick={() => handleStepClick(2)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 transition-transform ${
                    !user 
                      ? "bg-primary text-primary-foreground group-hover:scale-110" 
                      : "bg-green-500 text-white"
                  }`}>
                    {user && isProfileComplete ? <CheckCircle className="h-6 w-6" /> : (user ? "2" : "2")}
                  </div>
                  <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add photos, verify your age, and fill out your profile details</p>
                  <div className="flex items-center justify-center gap-2">
                    {user && isProfileComplete ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Complete</span>
                      </>
                    ) : user ? (
                      <>
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs text-primary font-medium">Click to complete</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">Account required</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`text-center p-6 rounded-lg border transition-all duration-200 group ${
                    canTakeQuiz 
                      ? "bg-muted/50 hover:border-primary/50 hover:bg-primary/5 cursor-pointer" 
                      : "bg-muted/30 border-muted cursor-not-allowed opacity-60"
                  }`}
                  onClick={() => handleStepClick(3)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 transition-transform ${
                    canTakeQuiz 
                      ? "bg-primary text-primary-foreground group-hover:scale-110" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {canTakeQuiz ? "3" : <Lock className="h-6 w-6" />}
                  </div>
                  <h3 className="font-semibold mb-2">Take the Personality Quiz</h3>
                  <p className="text-sm text-muted-foreground mb-4">Complete our AI assessment to find compatible matches</p>
                  <div className="flex items-center justify-center gap-2">
                    {canTakeQuiz ? (
                      <>
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-xs text-primary font-medium">Click to begin</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-medium">Complete steps 1 & 2 first</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                {canTakeQuiz ? (
                  <Link to="/questions">
                    <Button size="lg" className="gap-2">
                      <Brain className="h-4 w-4" />
                      Take Quiz
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    size="lg" 
                    className="gap-2" 
                    disabled 
                    onClick={() => handleStepClick(3)}
                  >
                    <Lock className="h-4 w-4" />
                    Complete Steps 1 & 2 First
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  How AI Matching Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <p className="text-sm">AI analyzes your personality quiz responses</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <p className="text-sm">Matches based on emotional compatibility</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <p className="text-sm">Suggests conversation starters and connection tips</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Pro Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                    <p className="text-sm font-medium">Be Authentic</p>
                    <p className="text-xs text-muted-foreground">Share your real interests and personality</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                    <p className="text-sm font-medium">Complete Your Profile</p>
                    <p className="text-xs text-muted-foreground">More details lead to better matches</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                    <p className="text-sm font-medium">Take Your Time</p>
                    <p className="text-xs text-muted-foreground">Quality connections develop gradually</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Connection Tips</CardTitle>
              <CardDescription>
                Creating meaningful connections through thoughtful guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Build Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    You're not just selling features—you're guiding users through an emotional journey. Tips show care.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Reduce Anxiety</h3>
                  <p className="text-sm text-muted-foreground">
                    New users often feel unsure how to start conversations or present themselves. A gentle nudge goes a long way.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Set the Tone</h3>
                  <p className="text-sm text-muted-foreground">
                    You're shaping culture. Your platform isn't hookup-centric or transactional—it's about meaningful connection.
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span className="text-green-500">🌿</span>
                  Conversation Starters
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                    "Start with a story—not a résumé. Let them feel who you are."
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                    "If you're nervous, say so. Vulnerability builds bridges."
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                    "Don't rush past silence. Emotional resonance often blooms there."
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                    "Ask before sharing deeper layers. Consent is sexy."
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Begin?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of users finding meaningful connections
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/faq">
                <Button variant="outline" size="lg">View FAQ</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;
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
  console.log('Profile data:', { 
    name: profile?.name, 
    age: profile?.age, 
    zip_code: profile?.zip_code,
    gender: profile?.gender,
    looking_for: profile?.looking_for,
    fullProfile: profile
  });
  // More realistic completeness check - just need name and basic preferences
  const isProfileComplete = profile?.name && profile?.gender && profile?.looking_for;
  const canTakeQuiz = user && isProfileComplete;

  const handleStepClick = (step: number) => {
    console.log('Step clicked:', step, { user: !!user, isProfileComplete });
    switch (step) {
      case 1:
        // Create Account
        console.log('Navigating to auth - no user');
        if (!user) {
          navigate('/auth');
        } else {
          // User already has account, go to step 2
          console.log('User exists, navigating to profile edit');
          navigate('/profile/edit');
        }
        break;
      case 2:
        // Complete Profile  
        console.log('Step 2 clicked - Complete Profile');
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
        console.log('Step 3 clicked - Take Quiz');
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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-6">
              <Heart className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Your Journey to Connection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Quick Start Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with AI Complete Me in just 3 simple steps and find your perfect match
            </p>
          </div>

          <Card className="mb-12 bg-gradient-to-br from-background to-muted/5 border-primary/10 shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Heart className="h-7 w-7 text-primary animate-pulse" />
                Your Journey Begins Here
              </CardTitle>
              <CardDescription className="text-lg">
                Follow these steps to create meaningful connections and find your soulmate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative group">
                  <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border-2 border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                        {user ? <CheckCircle className="h-8 w-8" /> : "1"}
                      </div>
                      {user && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-foreground">Create Your Account</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Sign up with your email and set your basic preferences to get started on your journey
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {user ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600 font-semibold">✓ Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-sm text-primary font-medium">Ready to start</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleStepClick(1)}
                      size="lg"
                      className={`w-full h-12 font-semibold transition-all duration-200 ${
                        user 
                          ? "bg-green-500 hover:bg-green-600 text-white" 
                          : "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl"
                      }`}
                      disabled={!!user}
                    >
                      {user ? "✓ Account Created" : "Create Account"}
                    </Button>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-2 border-purple-500/20 hover:border-purple-500/40 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                        {user && isProfileComplete ? <CheckCircle className="h-8 w-8" /> : "2"}
                      </div>
                      {user && isProfileComplete && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-foreground">Complete Your Profile</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Add photos, verify your age, and fill out your profile details to attract quality matches
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {user && isProfileComplete ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600 font-semibold">✓ Complete</span>
                        </div>
                      ) : user ? (
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-purple-500" />
                          <span className="text-sm text-purple-500 font-medium">Ready to complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground font-medium">Step 1 required</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleStepClick(2)}
                      size="lg"
                      className={`w-full h-12 font-semibold transition-all duration-200 ${
                        user && isProfileComplete 
                          ? "bg-green-500 hover:bg-green-600 text-white" 
                          : !user 
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
                      }`}
                      disabled={!user || (!!user && !!isProfileComplete)}
                    >
                      {user && isProfileComplete ? "✓ Profile Complete" : !user ? "Complete Step 1 First" : "Setup Profile"}
                    </Button>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-500/5 to-primary/5 border-2 border-pink-500/20 hover:border-pink-500/40 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform ${
                        canTakeQuiz 
                          ? "bg-gradient-to-r from-pink-500 to-primary" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {canTakeQuiz ? "3" : <Lock className="h-8 w-8" />}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-foreground">Take the Quiz</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Complete our comprehensive personality and compatibility assessment to find your perfect matches
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {canTakeQuiz ? (
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-pink-500" />
                          <span className="text-sm text-pink-500 font-medium">Ready to begin</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground font-medium">Complete Steps 1 & 2</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleStepClick(3)}
                      size="lg"
                      className={`w-full h-12 font-semibold transition-all duration-200 ${
                        canTakeQuiz 
                          ? "bg-gradient-to-r from-pink-500 to-primary hover:from-pink-600 hover:to-primary/90 text-white shadow-lg hover:shadow-xl"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                      disabled={!canTakeQuiz}
                    >
                      {canTakeQuiz ? "Start Quiz" : "Complete Previous Steps"}
                    </Button>
                  </div>
                </div>
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
                    <p className="text-sm">Take our 25+ question compatibility quiz</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <p className="text-sm">AI analyzes your personality, values, and communication style</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <p className="text-sm">Generates compatibility scores with other users</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
                    <p className="text-sm">Provides conversation starters and connection insights</p>
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
                    <p className="text-sm font-medium">Answer Thoughtfully</p>
                    <p className="text-xs text-muted-foreground">The quiz takes 10-15 minutes - honest answers give better matches</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                    <p className="text-sm font-medium">Upload Quality Photos</p>
                    <p className="text-xs text-muted-foreground">Clear, recent photos help others connect with you</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                    <p className="text-sm font-medium">Claim Your Quiet Start</p>
                    <p className="text-xs text-muted-foreground">First 500 users get 3 months free + wellness kit</p>
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
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Ready to Begin?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users finding meaningful connections through AI-powered compatibility matching
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl px-8 py-6 text-lg"
                  onClick={() => navigate('/auth')}
                >
                  Start Your Journey <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-6 text-lg border-2 hover:bg-muted/50"
                  onClick={() => navigate('/faq')}
                >
                  View FAQ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;
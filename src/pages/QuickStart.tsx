import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CheckCircle, ArrowRight, Heart, Zap, Brain, User, UserCheck, Lock, ArrowLeft } from "lucide-react";
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
          // User already has account, direct them to edit their profile
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
          navigate('/matches');
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-4 md:mb-6">
              <Heart className="h-4 w-4 mr-2 text-primary" />
              <span className="text-xs md:text-sm font-medium text-primary">Your Journey to Connection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 px-4">
              Quick Start Guide
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
              Get started with AI Complete Me in just 3 simple steps and find your perfect match
            </p>
          </div>

          <Card className="mb-8 md:mb-12 bg-gradient-to-br from-background to-muted/5 border-primary/10 shadow-lg">
            <CardHeader className="text-center pb-6 md:pb-8 px-4 md:px-6">
              <CardTitle className="flex items-center justify-center gap-2 md:gap-3 text-xl md:text-2xl">
                <Heart className="h-6 w-6 md:h-7 md:w-7 text-primary animate-pulse" />
                Your Journey Begins Here
              </CardTitle>
              <CardDescription className="text-base md:text-lg px-2">
                Follow these steps to create meaningful connections and find your soulmate
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <div className="space-y-6">
                 {/* Step 1 */}
                 <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-2 border-primary/20 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300">
                   <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                     <div className="flex-shrink-0 self-center sm:self-start">
                       <div className="relative">
                         <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white flex items-center justify-center text-lg md:text-2xl font-bold shadow-lg">
                           {user ? <CheckCircle className="h-6 w-6 md:h-8 md:w-8" /> : "1"}
                         </div>
                         {user && (
                           <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500 flex items-center justify-center">
                             <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-white" />
                           </div>
                         )}
                       </div>
                     </div>
                     <div className="flex-grow min-w-0 text-center sm:text-left">
                       <h3 className="font-bold text-lg md:text-xl mb-2 text-foreground">Create Your Account</h3>
                       <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                         Sign up with your email and set your basic preferences to get started
                       </p>
                       <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                         {user ? (
                           <div className="flex items-center gap-2">
                             <CheckCircle className="h-4 w-4 text-green-500" />
                             <span className="text-sm text-green-600 font-medium">✓ Complete</span>
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
                         className={`w-full sm:w-auto min-w-0 ${
                           user 
                             ? "bg-green-500 hover:bg-green-600 text-white" 
                             : "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
                         }`}
                         disabled={!!user}
                       >
                         {user ? "✓ Account Created" : "Create Account"}
                       </Button>
                     </div>
                   </div>
                 </div>

                 {/* Step 2 */}
                 <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-2 border-purple-500/20 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300">
                   <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                     <div className="flex-shrink-0 self-center sm:self-start">
                       <div className="relative">
                         <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-lg md:text-2xl font-bold shadow-lg">
                           {user && isProfileComplete ? <CheckCircle className="h-6 w-6 md:h-8 md:w-8" /> : "2"}
                         </div>
                         {user && isProfileComplete && (
                           <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500 flex items-center justify-center">
                             <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-white" />
                           </div>
                         )}
                       </div>
                     </div>
                     <div className="flex-grow min-w-0 text-center sm:text-left">
                       <h3 className="font-bold text-lg md:text-xl mb-2 text-foreground">Complete Your Profile</h3>
                       <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                         Add photos, verify your age, and fill out your profile details to attract quality matches
                       </p>
                       <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                         {user && isProfileComplete ? (
                           <div className="flex items-center gap-2">
                             <CheckCircle className="h-4 w-4 text-green-500" />
                             <span className="text-sm text-green-600 font-medium">✓ Complete</span>
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
                         className={`w-full sm:w-auto min-w-0 text-sm ${
                           user && isProfileComplete 
                             ? "bg-green-500 hover:bg-green-600 text-white" 
                             : !user 
                               ? "bg-muted text-muted-foreground cursor-not-allowed"
                               : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                         }`}
                         disabled={!user || (!!user && !!isProfileComplete)}
                       >
                         {user && isProfileComplete ? "✓ Profile Complete" : !user ? "Complete Step 1 First" : "Setup Profile"}
                       </Button>
                     </div>
                   </div>
                 </div>

                 {/* Step 3 */}
                 <div className="bg-gradient-to-r from-pink-500/5 to-primary/5 border-2 border-pink-500/20 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300">
                   <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                     <div className="flex-shrink-0 self-center sm:self-start">
                       <div className="relative">
                         <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full text-white flex items-center justify-center text-lg md:text-2xl font-bold shadow-lg ${
                           canTakeQuiz 
                             ? "bg-gradient-to-r from-pink-500 to-primary" 
                             : "bg-muted text-muted-foreground"
                         }`}>
                           {canTakeQuiz ? "3" : <Lock className="h-6 w-6 md:h-8 md:w-8" />}
                         </div>
                       </div>
                     </div>
                      <div className="flex-grow min-w-0 text-center sm:text-left">
                        <h3 className="font-bold text-lg md:text-xl mb-2 text-foreground">Complete Onboarding Quiz</h3>
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                          Take our one-time personality quiz to set up your compatibility profile and enable AI matching
                        </p>
                       <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
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
                         className={`w-full sm:w-auto min-w-0 text-sm ${
                           canTakeQuiz 
                             ? "bg-gradient-to-r from-pink-500 to-primary hover:from-pink-600 hover:to-primary/90 text-white"
                             : "bg-muted text-muted-foreground cursor-not-allowed"
                         }`}
                         disabled={!canTakeQuiz}
                       >
                         {canTakeQuiz ? "Start Quiz" : "Complete Previous Steps"}
                       </Button>
                     </div>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  How AI Matching Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 md:px-6">
                 <div className="space-y-3">
                   <div className="flex gap-3 items-start">
                     <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                     <p className="text-sm leading-relaxed">Complete our one-time onboarding quiz during signup</p>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                     <p className="text-sm leading-relaxed">AI analyzes your personality, values, and communication style</p>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                     <p className="text-sm leading-relaxed">Your compatibility profile is created for lifetime matching</p>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                     <p className="text-sm leading-relaxed">Provides ongoing match suggestions and connection insights</p>
                   </div>
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  Pro Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-4 md:px-6">
                <div className="space-y-3">
                   <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                     <p className="text-sm font-medium mb-1">Complete Onboarding</p>
                     <p className="text-xs text-muted-foreground leading-relaxed">The one-time quiz sets up your profile for all future matches</p>
                   </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                    <p className="text-sm font-medium mb-1">Upload Quality Photos</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Clear, recent photos help others connect with you</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                    <p className="text-sm font-medium mb-1">Claim Your Quiet Start</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">First 500 users get 3 months free + wellness kit</p>
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
                 <div className="grid sm:grid-cols-2 gap-4 text-sm">
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
              <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 rounded-2xl p-6 md:p-8 mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent px-2">Ready to Begin?</h2>
                <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
                  {!user 
                    ? "Sign in to your account or create a new one to join thousands of users finding meaningful connections through AI-powered compatibility matching"
                    : "Continue your journey to find meaningful connections through AI-powered compatibility matching"
                  }
                </p>
                {!user && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-200">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">New or Returning User</span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 text-center">
                      Sign in to your existing account or create a new one to get started
                    </p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                  <Button 
                    size="lg" 
                    className={`gap-2 shadow-lg hover:shadow-xl px-6 md:px-8 py-4 md:py-6 text-base md:text-lg min-w-0 ${
                      !user 
                        ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    }`}
                    onClick={() => {
                      if (!user) {
                        navigate('/auth');
                      } else if (!isProfileComplete) {
                        // If no profile exists at all, go to setup; otherwise go to edit
                        navigate(profile ? '/profile/edit' : '/profile/setup');
                      } else if (canTakeQuiz) {
                        navigate('/matches');
                      } else {
                        navigate('/profile');
                      }
                    }}
                  >
                    <span className="truncate">{!user ? 'Sign In / Create Account' : 'Continue Your Journey'}</span> <ArrowRight className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg border-2 hover:bg-muted/50 min-w-0"
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Gift, Heart, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AgeVerification } from '@/components/AgeVerification';
import { WelcomeConfirmation } from '@/components/WelcomeConfirmation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SignupStep = 'details' | 'age-verification' | 'email-confirmation' | 'profile-setup' | 'complete';

interface SignupFlowProps {
  onComplete: () => void;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const { signUp, user, session } = useAuth();
  const { toast } = useToast();

  // Check if user is already confirmed
  useEffect(() => {
    if (user && session) {
      // Check if email is confirmed
      if (user.email_confirmed_at) {
        setIsEmailConfirmed(true);
        // Check if they've completed profile setup
        checkProfileCompletion();
      }
    }
  }, [user, session]);

  const checkProfileCompletion = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profile && profile.name) {
        // Profile is complete, show welcome
        setCurrentStep('complete');
        setShowWelcome(true);
      } else {
        setCurrentStep('profile-setup');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setCurrentStep('profile-setup');
    }
  };

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'details': return 20;
      case 'age-verification': return 40;
      case 'email-confirmation': return 60;
      case 'profile-setup': return 80;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signUp(email, password);
      
      if (!result?.error) {
        toast({
          title: "Account created!",
          description: "Please verify your age to continue.",
        });
        setCurrentStep('age-verification');
        setShowAgeVerification(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgeVerificationComplete = async () => {
    setShowAgeVerification(false);
    setCurrentStep('email-confirmation');
    
    toast({
      title: "Age verified!",
      description: "Check your email for a confirmation link to complete your account setup.",
    });
  };

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    
    try {
      // Update profile with name
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: name,
          Avatar_url: null
        });
        
      if (error) throw error;
      
      // Mark as Quiet Start user and grant benefits
      await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          event_type: 'quiet_start_claimed',
          event_data: {
            email: user.email,
            claimed_at: new Date().toISOString(),
            benefits: {
              months_free: 3,
              wellness_kit: true
            }
          }
        });
      
      toast({
        title: "Profile complete!",
        description: "Welcome to your Soul Quest journey.",
      });
      
      setCurrentStep('complete');
      setShowWelcome(true);
      
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        title: "Error",
        description: "Failed to complete profile setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    onComplete();
  };

  if (showWelcome) {
    return (
      <WelcomeConfirmation 
        isOpen={showWelcome} 
        onContinue={handleWelcomeComplete}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-primary">Quiet Start Journey</span>
              <span className="text-muted-foreground">{getProgressPercentage()}% Complete</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Complete all steps to claim your 3 months free + wellness kit
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Begin Your Soul Quest
            </CardTitle>
            <CardDescription>
              Create your account to join the first 500 Soul Questers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Your Quiet Start Benefits
                </h4>
                <ul className="text-xs text-emerald-700 space-y-1">
                  <li>• 3 months of Complete Plus (premium features)</li>
                  <li>• Mini wellness kit delivered to your door</li>
                  <li>• Priority matching and enhanced connection tools</li>
                </ul>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating your account...' : 'Continue to Age Verification'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {currentStep === 'email-confirmation' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Check Your Email
            </CardTitle>
            <CardDescription>
              We've sent a confirmation link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800 mb-2">
                <strong>Almost there!</strong> Click the confirmation link in your email to continue.
              </p>
              <p className="text-xs text-blue-600">
                Check your spam folder if you don't see it within a few minutes.
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                After confirming your email, you'll complete your profile and claim your benefits.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'profile-setup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Complete Your Profile
            </CardTitle>
            <CardDescription>
              Final step to claim your Quiet Start benefits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSetup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="How should we address you?"
                  required
                />
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Ready to Claim
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/70 rounded p-2 text-center">
                    <div className="font-semibold text-primary">3 Months Free</div>
                    <div className="text-muted-foreground">Complete Plus</div>
                  </div>
                  <div className="bg-white/70 rounded p-2 text-center">
                    <div className="font-semibold text-purple-600">Wellness Kit</div>
                    <div className="text-muted-foreground">Physical gift</div>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Claiming your benefits...' : 'Complete & Claim Benefits 🎁'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Age Verification Modal */}
      {showAgeVerification && (
        <AgeVerification 
          onVerificationComplete={handleAgeVerificationComplete}
          forceOpen={true}
        />
      )}
    </div>
  );
};
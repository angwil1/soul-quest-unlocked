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

export type SignupStep = 'details' | 'age-verification' | 'email-confirmation' | 'profile-setup' | 'shipping-address' | 'complete';

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
        // Profile is complete, check if address is collected
        checkAddressCollection();
      } else {
        setCurrentStep('profile-setup');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setCurrentStep('profile-setup');
    }
  };

  const checkAddressCollection = async () => {
    if (!user) return;
    
    try {
      const { data: signup } = await supabase
        .from('quiet_start_signups')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (signup?.shipping_address_line1) {
        // Address collected, show welcome
        setCurrentStep('complete');
        setShowWelcome(true);
      } else {
        setCurrentStep('shipping-address');
      }
    } catch (error) {
      console.error('Error checking address:', error);
      setCurrentStep('shipping-address');
    }
  };

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'details': return 15;
      case 'age-verification': return 30;
      case 'email-confirmation': return 45;
      case 'profile-setup': return 60;
      case 'shipping-address': return 80;
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
        // Create initial tracking record
        await supabase
          .from('quiet_start_signups')
          .insert({
            user_id: user?.id || '', // Will be updated when user is available
            email: email,
            signup_step: 'email_signup'
          });

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
    
    // Update signup progress
    if (user) {
      await supabase
        .from('quiet_start_signups')
        .update({ signup_step: 'age_verified' })
        .eq('user_id', user.id);
    }
    
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
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: name,
          Avatar_url: null
        });
        
      if (profileError) throw profileError;
      
      // Update signup progress
      await supabase
        .from('quiet_start_signups')
        .update({ signup_step: 'profile_completed' })
        .eq('user_id', user.id);
      
      toast({
        title: "Profile saved!",
        description: "Now let's get your shipping address for the wellness kit.",
      });
      
      setCurrentStep('shipping-address');
      
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
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

  const validateAddress = (formData: FormData) => {
    const name = formData.get('shipping_name') as string;
    const address1 = formData.get('address_line1') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const postalCode = formData.get('postal_code') as string;
    const country = formData.get('country') as string || 'United States';

    // Check for fake address patterns
    const fakePatterns = [
      /fake/i, /test/i, /dummy/i, /placeholder/i, /example/i,
      /123\s+fake/i, /999\s+test/i, /111\s+main/i,
      /^123\s+(main|elm|oak|first)/i,
      /asdf|qwerty|zxcv/i
    ];

    const addressToCheck = `${name} ${address1} ${city}`;
    for (const pattern of fakePatterns) {
      if (pattern.test(addressToCheck)) {
        throw new Error('Please provide a valid address. Fake or test addresses are not accepted.');
      }
    }

    // Validate US postal codes
    if (country.toLowerCase().includes('united states') || country.toLowerCase().includes('usa')) {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(postalCode)) {
        throw new Error('Please enter a valid US ZIP code (e.g., 12345 or 12345-6789).');
      }
    }

    // Basic field length validation
    if (name.length < 2) throw new Error('Please enter a valid full name.');
    if (address1.length < 5) throw new Error('Please enter a complete street address.');
    if (city.length < 2) throw new Error('Please enter a valid city name.');
    if (state.length < 2) throw new Error('Please enter a valid state.');

    // Check for suspicious patterns in city/state
    if (/^\d+$/.test(city) || /^\d+$/.test(state)) {
      throw new Error('City and state cannot be only numbers.');
    }
  };

  const handleShippingAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Validate address before processing
      validateAddress(formData);
      
      // Get next available kit number
      const { data: kitNumber } = await supabase.rpc('get_next_kit_number');
      
      if (kitNumber === null) {
        toast({
          title: "Offer Expired",
          description: "Sorry, all 500 wellness kits have been claimed.",
          variant: "destructive"
        });
        return;
      }
      
      // Save shipping address and claim benefits
      const { error: signupError } = await supabase
        .from('quiet_start_signups')
        .update({
          signup_step: 'completed',
          benefits_claimed: true,
          claimed_at: new Date().toISOString(),
          kit_number: kitNumber,
          shipping_name: formData.get('shipping_name') as string,
          shipping_address_line1: formData.get('address_line1') as string,
          shipping_address_line2: formData.get('address_line2') as string,
          shipping_city: formData.get('city') as string,
          shipping_state: formData.get('state') as string,
          shipping_postal_code: formData.get('postal_code') as string,
          shipping_country: formData.get('country') as string || 'United States',
          address_collected_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (signupError) throw signupError;
      
      // Mark as Quiet Start user
      await supabase
        .from('user_events')
        .insert({
          user_id: user.id,
          event_type: 'quiet_start_claimed',
          event_data: {
            email: user.email,
            kit_number: kitNumber,
            claimed_at: new Date().toISOString(),
            benefits: {
              months_free: 3,
              wellness_kit: true
            }
          }
        });
      
      toast({
        title: "Benefits claimed!",
        description: `You're Quiet Start user #${kitNumber}! Your wellness kit will be shipped to your address.`,
      });
      
      setCurrentStep('complete');
      setShowWelcome(true);
      
    } catch (error) {
      console.error('Shipping address error:', error);
      toast({
        title: "Error",
        description: "Failed to save shipping address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Next: Shipping Address
                </h4>
                <p className="text-xs text-blue-700">
                  After saving your profile, we'll collect your shipping address for the wellness kit delivery.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving profile...' : 'Continue to Shipping Address'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {currentStep === 'shipping-address' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Wellness Kit Address
            </CardTitle>
            <CardDescription>
              We'll send your wellness kit after you've been actively connected for 3 months. This ensures it's a meaningful keepsake of your journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleShippingAddress} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping_name">Full Name</Label>
                <Input
                  id="shipping_name"
                  name="shipping_name"
                  type="text"
                  placeholder="Full name for shipping"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  type="text"
                  placeholder="Street address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  type="text"
                  placeholder="Apartment, suite, etc."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">ZIP Code</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    type="text"
                    placeholder="ZIP code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    defaultValue="United States"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Final Step - Claim Your Benefits
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                  <div className="bg-white/70 rounded p-2 text-center">
                    <div className="font-semibold text-primary">3 Months Free</div>
                    <div className="text-muted-foreground">Complete Plus</div>
                  </div>
                  <div className="bg-white/70 rounded p-2 text-center">
                    <div className="font-semibold text-purple-600">Wellness Kit</div>
                    <div className="text-muted-foreground">Shipped free</div>
                  </div>
                </div>
                <p className="text-xs text-emerald-700">
                  🍃 Calming tea sachet • 💄 Soft-touch lip balm • 💌 Poetic postcard
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Claiming your wellness kit...' : 'Complete & Claim Benefits 🎁'}
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
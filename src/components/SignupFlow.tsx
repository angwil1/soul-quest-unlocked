import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Gift, Heart, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
// Age verification now handled in signup form
import { WelcomeConfirmation } from '@/components/WelcomeConfirmation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SignupStep = 'details' | 'email-confirmation' | 'profile-setup' | 'complete-profile' | 'shipping-address' | 'complete';

interface SignupFlowProps {
  onComplete: () => void;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const { signUp, user, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for completed profile setup on component mount
  useEffect(() => {
    const checkProfileSetupCompletion = async () => {
      if (!user || !isEmailConfirmed) return;
      
      // Check if we just came back from profile setup
      const urlParams = new URLSearchParams(window.location.search);
      const step = urlParams.get('step');
      
      if (step === 'shipping-address') {
        setCurrentStep('shipping-address');
        return;
      }
      
      // Regular profile completion check
      checkProfileCompletion();
    };
    
    checkProfileSetupCompletion();
  }, [user, isEmailConfirmed]);

  // Store age verification when user is confirmed
  useEffect(() => {
    const storeAgeVerification = async () => {
      if (user && dateOfBirth && !isEmailConfirmed) {
        try {
          console.log('🔒 Storing age verification in database');
          const { error } = await supabase.rpc('verify_user_age', {
            p_date_of_birth: dateOfBirth
          });
          
          if (error) {
            console.error('Age verification storage error:', error);
          } else {
            console.log('✅ Age verification stored successfully');
          }
        } catch (error) {
          console.error('Age verification storage error:', error);
        }
      }
    };

    const createInitialSignupRecord = async () => {
      if (!user) return;
      
      try {
        // Check if record already exists
        const { data: existing } = await supabase
          .from('quiet_start_signups')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (!existing) {
          // Create initial signup record
          const { error } = await supabase
            .from('quiet_start_signups')
            .insert({
              user_id: user.id,
              email: user.email || email,
              signup_step: 'email_confirmed'
            });
            
          if (error) {
            console.error('Error creating signup record:', error);
          } else {
            console.log('✅ Initial signup record created');
          }
        }
      } catch (error) {
        console.error('Error checking/creating signup record:', error);
      }
    };

    if (user && session && user.email_confirmed_at) {
      setIsEmailConfirmed(true);
      createInitialSignupRecord().then(() => {
        storeAgeVerification();
        checkProfileCompletion();
      });
    }
  }, [user, session, dateOfBirth, isEmailConfirmed, email]);

  const checkProfileCompletion = async () => {
    if (!user) return;
    
    try {
      console.log('🔍 Checking profile completion for user:', user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      console.log('📋 Profile data:', profile);
        
      if (profile && profile.name) {
        // Check if full profile is complete (bio, interests, personality_type indicates photos step completed)
        const hasFullProfile = profile.bio && 
                              profile.interests?.length >= 3 && 
                              profile.personality_type; // This indicates photos step was completed
        
        console.log('✅ Profile completion status:', {
          hasBio: !!profile.bio,
          hasInterests: profile.interests?.length >= 3,
          hasPersonalityType: !!profile.personality_type,
          fullProfileComplete: hasFullProfile
        });
        
        if (hasFullProfile) {
          // Full profile is complete, check if address is collected
          console.log('🎯 Full profile complete - checking address collection');
          checkAddressCollection();
        } else {
          // Need to complete full profile
          console.log('📝 Profile incomplete - directing to complete-profile step');
          setCurrentStep('complete-profile');
        }
      } else {
        console.log('👤 No profile found - directing to profile-setup');
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
      console.log('📦 Checking address collection for user:', user.id);
      const { data: signup } = await supabase
        .from('quiet_start_signups')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      console.log('📄 Signup record:', signup);
        
      if (signup?.shipping_address_line1) {
        // Address collected, show welcome
        console.log('✅ Address already collected - completing signup');
        setCurrentStep('complete');
        setShowWelcome(true);
      } else {
        // Check if wellness kits are still available (first 500 only)
        console.log('🎁 Checking kit availability...');
        const { data: kitNumber } = await supabase.rpc('get_next_kit_number');
        console.log('🔢 Next kit number:', kitNumber);
        
        if (kitNumber === null) {
          // All 500 kits have been claimed - skip address collection
          console.log('🚫 All kits claimed - skipping address collection');
          toast({
            title: "Welcome to AI Complete Me! 🎉",
            description: "You're all set up! While the first 500 wellness kits have been claimed, you still get 3 months of premium features.",
          });
          setCurrentStep('complete');
          setShowWelcome(true);
        } else {
          // Kits still available - collect address
          console.log('📋 Kit available - showing address collection');
          setCurrentStep('shipping-address');
        }
      }
    } catch (error) {
      console.error('Error checking address:', error);
      // Default to showing address collection on error
      console.log('❌ Error occurred - defaulting to address collection');
      setCurrentStep('shipping-address');
    }
  };

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'details': return 15;
      case 'email-confirmation': return 30;
      case 'profile-setup': return 45;
      case 'complete-profile': return 65;
      case 'shipping-address': return 85;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate date of birth
      if (!dateOfBirth) {
        toast({
          title: "Date of birth required",
          description: "Please enter your date of birth to continue.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const age = calculateAge(dateOfBirth);
      if (age < 18) {
        toast({
          title: "Age requirement not met",
          description: "You must be 18 or older to use this platform.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const result = await signUp(email, password);
      
      if (!result?.error) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        setCurrentStep('email-confirmation');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Age verification now handled directly in signup form

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const occupation = formData.get('occupation') as string;
    const education = formData.get('education') as string;
    
    try {
      // Update profile with basic info
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: name,
          occupation: occupation,
          education: education,
          Avatar_url: null
        });
        
      if (profileError) throw profileError;
      
      // Update signup progress
      await supabase
        .from('quiet_start_signups')
        .update({ signup_step: 'basic_profile_completed' })
        .eq('user_id', user.id);
      
      toast({
        title: "Basic profile saved!",
        description: "Now let's complete your full profile to find better matches.",
      });
      
      setCurrentStep('complete-profile');
      
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

  const validateAddress = async (formData: FormData) => {
    const name = formData.get('shipping_name') as string;
    const address1 = formData.get('address_line1') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const postalCode = formData.get('postal_code') as string;
    const country = formData.get('country') as string || 'United States';

    // Enhanced fake address pattern detection
    const fakePatterns = [
      /fake/i, /test/i, /dummy/i, /placeholder/i, /example/i, /sample/i,
      /123\s+fake/i, /999\s+test/i, /111\s+main/i, /000\s+test/i,
      /^123\s+(main|elm|oak|first|second|third)/i,
      /^1234\s+(main|elm|oak|first)/i,
      /asdf|qwerty|zxcv|hjkl|uiop/i,
      /^(no|none|na|n\/a)\s/i,
      /lorem\s+ipsum/i,
      /abc\s+(street|st|avenue|ave|road|rd)/i,
      /mickey\s+mouse|donald\s+duck|bugs\s+bunny/i,
      /^(street|address|city|state)$/i
    ];

    // Check for repetitive characters (like "aaaa" or "1111")
    const repetitivePattern = /(.)\1{3,}/;
    
    // Check for obviously fake addresses
    const addressToCheck = `${name} ${address1} ${city} ${state}`.toLowerCase();
    
    for (const pattern of fakePatterns) {
      if (pattern.test(addressToCheck)) {
        throw new Error('Please provide a valid address. Fake or test addresses are not accepted.');
      }
    }

    if (repetitivePattern.test(address1) || repetitivePattern.test(name)) {
      throw new Error('Please provide a valid address with real information.');
    }

    // Check for duplicate addresses from this user
    if (user) {
      const { data: existingAddress } = await supabase
        .from('quiet_start_signups')
        .select('shipping_address_line1, shipping_city, shipping_postal_code')
        .eq('user_id', user.id)
        .eq('benefits_claimed', true)
        .maybeSingle();

      if (existingAddress && (
        existingAddress.shipping_address_line1?.toLowerCase() === address1.toLowerCase() ||
        existingAddress.shipping_postal_code === postalCode
      )) {
        throw new Error('You have already submitted an address for your wellness kit.');
      }
    }

    // Validate US postal codes
    if (country.toLowerCase().includes('united states') || country.toLowerCase().includes('usa')) {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(postalCode)) {
        throw new Error('Please enter a valid US ZIP code (e.g., 12345 or 12345-6789).');
      }
    }

    // Enhanced field validation
    if (name.length < 2 || name.length > 100) throw new Error('Please enter a valid full name (2-100 characters).');
    if (address1.length < 5 || address1.length > 200) throw new Error('Please enter a complete street address (5-200 characters).');
    if (city.length < 2 || city.length > 100) throw new Error('Please enter a valid city name (2-100 characters).');
    if (state.length < 2 || state.length > 50) throw new Error('Please enter a valid state (2-50 characters).');

    // Check for suspicious patterns in city/state
    if (/^\d+$/.test(city) || /^\d+$/.test(state)) {
      throw new Error('City and state cannot be only numbers.');
    }

    // Check for minimum word count in address
    if (address1.split(/\s+/).length < 2) {
      throw new Error('Please provide a complete street address (street number and name).');
    }

    // Validate name doesn't contain numbers or special characters (except spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
      throw new Error('Please enter a valid name using only letters, spaces, hyphens, and apostrophes.');
    }
  };

  const handleShippingAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Validate address before processing (now async)
      await validateAddress(formData);
      
      // Double-check that this user hasn't already claimed benefits
      const { data: existingClaim } = await supabase
        .from('quiet_start_signups')
        .select('benefits_claimed, kit_number')
        .eq('user_id', user.id)
        .eq('benefits_claimed', true)
        .maybeSingle();

      if (existingClaim) {
        toast({
          title: "Already Claimed",
          description: `You've already claimed your wellness kit #${existingClaim.kit_number}!`,
          variant: "destructive"
        });
        setCurrentStep('complete');
        setShowWelcome(true);
        return;
      }
      
      // Get next available kit number
      const { data: kitNumber } = await supabase.rpc('get_next_kit_number');
      
      if (kitNumber === null) {
        toast({
          title: "Offer Expired",
          description: "Sorry, all 500 wellness kits have been claimed.",
          variant: "destructive"
        });
        // Still mark as complete but without physical benefits
        await supabase
          .from('quiet_start_signups')
          .update({
            signup_step: 'completed',
            benefits_claimed: false,
            claimed_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
        
        setCurrentStep('complete');
        setShowWelcome(true);
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
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date(Date.now() - 567648000000).toISOString().split('T')[0]} // 18 years ago
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be 18 or older. Your age will be calculated from this date.
                </p>
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

              <div className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating your account...' : 'Create Account & Continue'}
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
              
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Select name="occupation" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your occupation" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg max-h-[200px]">
                    <SelectItem value="Business & Finance">Business & Finance</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Creative Arts">Creative Arts</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Marketing & Sales">Marketing & Sales</SelectItem>
                    <SelectItem value="Science & Research">Science & Research</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Nonprofit">Nonprofit</SelectItem>
                    <SelectItem value="Hospitality & Tourism">Hospitality & Tourism</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Media & Communications">Media & Communications</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <Select name="education" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg max-h-[200px]">
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Some College">Some College</SelectItem>
                    <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                    <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                    <SelectItem value="PhD/Doctorate">PhD/Doctorate</SelectItem>
                    <SelectItem value="Professional Degree">Professional Degree</SelectItem>
                    <SelectItem value="Trade School">Trade School</SelectItem>
                    <SelectItem value="Certification Program">Certification Program</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Next: Complete Your Profile
                </h4>
                <p className="text-xs text-blue-700">
                  After saving your basic info, we'll help you create a full profile to find better matches.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving basic info...' : 'Continue to Profile Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {currentStep === 'complete-profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Build Your Profile
            </CardTitle>
            <CardDescription>
              Create a complete profile to find your perfect matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-purple-800 mb-2">
                  Complete Your Full Profile
                </h4>
                <p className="text-xs text-purple-700 mb-3">
                  Add photos, write your bio, and share your interests to get better matches.
                </p>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• Add at least 2 photos</li>
                  <li>• Write a compelling bio</li>
                  <li>• Select your interests</li>
                  <li>• Set your preferences</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  After Profile Setup
                </h4>
                <p className="text-xs text-amber-700">
                  Once your profile is complete, we'll collect your shipping address for the wellness kit delivery.
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/profile-setup?from=signup')} 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Complete My Profile
              </Button>
            </div>
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
    </div>
  );
};
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
import { calculateAge } from '@/lib/ageUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SignupStep = 'details' | 'email-confirmation' | 'complete-profile' | 'shipping-address' | 'complete';

interface SignupFlowProps {
  onComplete: () => void;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [lookingFor, setLookingFor] = useState('');
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
        console.log('Ignoring forced shipping-address step during signup; will collect later when eligible');
        // Intentionally not navigating to shipping-address at signup
      }
      
      // Regular profile completion check
      checkProfileCompletion();
    };
    
    checkProfileSetupCompletion();
  }, [user, isEmailConfirmed]);

  // Store age verification when user is confirmed
  useEffect(() => {
    const storeAgeVerification = async () => {
      // Store date of birth in profiles table with calculated age
      if (user && dateOfBirth && !isEmailConfirmed) {
        try {
          console.log('🔒 Storing age verification and profile data');
          
          // First verify age in age_verifications table
          const { error: ageError } = await supabase.rpc('verify_user_age', {
            p_date_of_birth: dateOfBirth
          });
          
          if (ageError) {
            console.error('Age verification storage error:', ageError);
          } else {
            console.log('✅ Age verification stored successfully');
          }

          // Then store in profiles table with calculated age
          const age = calculateAge(dateOfBirth);
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              id: user.id,
              date_of_birth: dateOfBirth,
              age: age,
              updated_at: new Date().toISOString()
            }, { 
              onConflict: 'id' 
            });
          
          if (profileError) {
            console.error('Profile date of birth storage error:', profileError);
          } else {
            console.log('✅ Date of birth and age stored in profile successfully');
          }
        } catch (error) {
          console.error('Age/profile storage error:', error);
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
        console.log('👤 No profile found - directing to complete profile setup');
        navigate('/profile/setup?from=signup');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      navigate('/profile/setup?from=signup');
    }
  };

  const checkAddressCollection = async () => {
    if (!user) return;
    
    try {
      console.log('📦 Skipping address collection at signup for user:', user.id);
      // New behavior: Do NOT collect shipping address during signup.
      // We complete signup now and will collect address only after eligibility (≈3 months).
      toast({
        title: "You're all set!",
        description: "We'll collect your shipping address when you're eligible (about 3 months).",
      });
      setCurrentStep('complete');
      setShowWelcome(true);
    } catch (error) {
      console.error('Error in address step handling:', error);
      setCurrentStep('complete');
      setShowWelcome(true);
    }
  };

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'details': return 15;
      case 'email-confirmation': return 30;
      case 'complete-profile': return 45;
      case 'complete-profile': return 65;
      case 'shipping-address': return 85;
      case 'complete': return 100;
      default: return 0;
    }
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

      // Validate looking for selection
      if (!lookingFor) {
        toast({
          title: "Please select what you're looking for",
          description: "This helps us show you better matches.",
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
        // Also store date_of_birth in user metadata and calculate age
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            data: { 
              looking_for: lookingFor,
              date_of_birth: dateOfBirth,
              age: calculateAge(dateOfBirth)
            }
          });
          
          if (updateError) {
            console.error('Error updating user metadata:', updateError);
          }
        } catch (error) {
          console.error('Error updating user metadata:', error);
        }
        
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

  // Removed intermediate profile setup - going directly to full profile setup
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
        throw new Error('You have already submitted an address for your keepsake.');
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
          description: `You've already claimed your keepsake #${existingClaim.kit_number}!`,
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
          description: "Sorry, all 200 keepsakes have been claimed.",
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
        description: `You're enrolled in the 60-day free trial! Welcome to AI Complete Me.`,
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
              Complete all steps to start your 60-day free trial
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
              Create your account to join the first 200 Soul Questers
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
              
              <div className="space-y-2">
                <Label htmlFor="lookingFor">What are you hoping to find?</Label>
                <Select value={lookingFor} onValueChange={setLookingFor} required>
                  <SelectTrigger id="lookingFor">
                    <SelectValue placeholder="Select what you're looking for" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="anyone">Anyone</SelectItem>
                    <SelectItem value="non-binary">Non-binary people</SelectItem>
                    <SelectItem value="casual-friends">Casual friends</SelectItem>
                    <SelectItem value="activity-partners">Activity partners</SelectItem>
                    <SelectItem value="travel-buddies">Travel buddies</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This helps us show you better matches
                </p>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Your 60-Day Free Trial
                </h4>
                <ul className="text-xs text-emerald-700 space-y-1">
                  <li>• 60 days of Complete Plus features</li>
                  <li>• Full access to premium matching and connection tools</li>
                  <li>• No charge until your trial ends</li>
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

      {/* Removed intermediate profile-setup step - going directly to complete profile setup */}

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
                  Once your profile is complete, you're in! We'll invite you to provide a shipping address when you're eligible (about 3 months).
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/profile/setup?from=signup')} 
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
              Keepsake Address
            </CardTitle>
            <CardDescription>
              We'll send your keepsake after you've been actively connected for 3 months. This ensures it's a meaningful keepsake of your journey.
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
                    <div className="font-semibold text-purple-600">Keepsake</div>
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
                {isLoading ? 'Claiming your keepsake...' : 'Complete & Claim Benefits 🎁'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
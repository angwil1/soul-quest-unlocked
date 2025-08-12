import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { AgeVerification } from '@/components/AgeVerification';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [pendingSignup, setPendingSignup] = useState<{email: string, password: string} | null>(null);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated - check if user has completed quiz first
  useEffect(() => {
    if (user) {
      // Check if user has completed quiz by checking if they have quiz answers
      const checkQuizCompletion = async () => {
        try {
          const { data } = await supabase
            .from('user_events')
            .select('*')
            .eq('user_id', user.id)
            .eq('event_type', 'quiz_completed')
            .limit(1);
          
          if (data && data.length > 0) {
            // User has completed quiz, go to main page
            navigate('/');
          } else {
            // User hasn't completed quiz, send to quiz
            navigate('/questions');
          }
        } catch (error) {
          console.error('Error checking quiz completion:', error);
          // Default to quiz if error
          navigate('/questions');
        }
      };
      
      checkQuizCompletion();
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      // After successful login, check if user has completed quiz
      try {
        const { data } = await supabase
          .from('user_events')
          .select('*')
          .eq('user_id', user?.id || '')
          .eq('event_type', 'quiz_completed')
          .limit(1);
        
        if (data && data.length > 0) {
          // User has completed quiz, go to main page
          navigate('/');
        } else {
          // User hasn't completed quiz, send to quiz
          navigate('/questions');
        }
      } catch (error) {
        console.error('Error checking quiz completion:', error);
        // Default to quiz if error
        navigate('/questions');
      }
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if age verification is already done
    const ageVerified = localStorage.getItem('ageVerified') === 'true';
    
    if (ageVerified) {
      // Age already verified, proceed with signup immediately
      setIsLoading(true);
      const result = await signUp(email, password);
      setIsLoading(false);
      
      // Check if signup was successful and redirect to quiz
      if (!result?.error) {
        navigate('/questions');
      }
    } else {
      // Need age verification first
      setPendingSignup({ email, password });
      setShowAgeVerification(true);
    }
  };

  const handleAgeVerificationComplete = async () => {
    console.log("Age verification complete callback triggered");
    console.log("Pending signup:", pendingSignup);
    
    if (!pendingSignup) {
      console.error("No pending signup found!");
      setShowAgeVerification(false);
      return;
    }
    
    setIsLoading(true);
    setShowAgeVerification(false);
    
    console.log("Attempting signup with:", pendingSignup.email);
    const result = await signUp(pendingSignup.email, pendingSignup.password);
    console.log("Signup result:", result);
    
    // Check if signup was successful and redirect to quiz
    if (!result?.error) {
      navigate('/questions');
    }
    
    setPendingSignup(null);
    setIsLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert('Please enter your email address first');
      return;
    }

    setResetLoading(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        alert('Error sending reset email: ' + error.message);
      } else {
        alert('Password reset email sent! Check your inbox.');
      }
    } catch (error) {
      alert('Error sending reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 pt-20">
        {/* Top Login Button */}
        <div className="w-full max-w-md mb-6">
          <Button className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90">
            Log In / Sign Up
          </Button>
        </div>
        
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to AI Complete Me</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="text-center">
                  <Button 
                    type="button"
                    variant="link" 
                    onClick={handlePasswordReset}
                    disabled={resetLoading}
                    className="text-sm"
                  >
                    {resetLoading ? 'Sending...' : 'Forgot Password?'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Choose a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Age Verification Modal */}
      {showAgeVerification && (
        <AgeVerification 
          onVerificationComplete={handleAgeVerificationComplete}
          forceOpen={true}
        />
      )}
      </div>
    </div>
  );
};

export default Auth;
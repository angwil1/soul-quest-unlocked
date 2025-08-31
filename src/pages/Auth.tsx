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
import { SignupFlow } from '@/components/SignupFlow';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showSignupFlow, setShowSignupFlow] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Only redirect if already authenticated
  useEffect(() => {
    if (user && !showSignupFlow) {
      // Don't interfere if user is already on profile setup page
      if (window.location.pathname === '/profile/setup') {
        return;
      }
      
      // Check if user has a complete profile first
      const checkProfile = async () => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          // If no profile or incomplete profile, go to setup
          if (!profile || !profile.name || !profile.location || !profile.bio) {
            navigate('/profile/setup');
            return;
          }
          
          // If profile complete, check quiz completion
          const { data } = await supabase
            .from('user_events')
            .select('*')
            .eq('user_id', user.id)
            .eq('event_type', 'quiz_completed')
            .limit(1);
          
          if (data && data.length > 0) {
            navigate('/');
          } else {
            navigate('/questions');
          }
        } catch (error) {
          console.error('Error checking profile/quiz completion:', error);
          navigate('/profile/setup');
        }
      };
      
      checkProfile();
    }
  }, [user, navigate, showSignupFlow]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      // Navigation will be handled by the useEffect hook that checks profile completion
    }
    
    setIsLoading(false);
  };

  const handleStartSignup = () => {
    setShowSignupFlow(true);
  };

  const handleSignupComplete = () => {
    setShowSignupFlow(false);
    navigate('/profile/setup');
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert('Please enter your email address first');
      return;
    }

    setResetLoading(true);
    
    try {
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

  if (showSignupFlow) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center p-4 pt-20">
          <SignupFlow onComplete={handleSignupComplete} />
        </div>
      </div>
    );
  }

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
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/5 to-purple-600/5 border border-primary/20 rounded-lg p-4 text-center space-y-3">
                    <h3 className="font-semibold text-primary">🎁 Quiet Start Offer</h3>
                    <p className="text-sm text-muted-foreground">
                      Join the first 500 Soul Questers and receive:
                    </p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>✨ 3 months of Complete Plus free</div>
                      <div>🍃 Mini wellness kit delivered</div>
                      <div>🎯 Priority matching & premium features</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleStartSignup}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    Start Your Soul Quest Journey
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Complete our guided signup to claim your benefits
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { SignupFlow } from '@/components/SignupFlow';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
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
          
          // For existing users with complete profiles, go to home instead of forcing quiz
          navigate('/');
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
        {/* Top Sign In Area */}
        <div className="w-full max-w-md mb-6">
          {!showSignIn ? (
            <Button 
              onClick={() => setShowSignIn(true)}
              variant="outline" 
              className="w-full h-14 text-xl font-bold"
            >
              Already have an account? Sign In
            </Button>
          ) : (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Sign In</CardTitle>
              </CardHeader>
              <CardContent>
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
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowSignIn(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join AI Complete Me</CardTitle>
            <CardDescription>Create your account and find meaningful connections</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
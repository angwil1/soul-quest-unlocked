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
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoImage from "@/assets/logo-transparent-new.png";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignupFlow, setShowSignupFlow] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simplified auth redirect for mobile compatibility
  useEffect(() => {
    // Don't redirect if we're on a password reset flow
    const urlParams = new URLSearchParams(window.location.search);
    const isPasswordReset = urlParams.get('type') === 'recovery';
    const redirectPath = urlParams.get('redirect');
    
    console.log('Auth page - user exists:', !!user, 'showSignupFlow:', showSignupFlow, 'isPasswordReset:', isPasswordReset, 'redirectPath:', redirectPath);
    
    if (user && !showSignupFlow && !isPasswordReset) {
      // If there's a redirect parameter, go there, otherwise go to home
      const targetPath = redirectPath === 'browse' ? '/browse' : '/';
      console.log('User authenticated, redirecting to:', targetPath);
      navigate(targetPath);
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Use the exact current domain with the reset path
    const resetUrl = `${window.location.protocol}//${window.location.host}/reset-password`;
    console.log('Sending reset email with redirectTo:', resetUrl);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl
    });

    if (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      setShowForgotPassword(false);
    }
    
    setIsLoading(false);
  };

  if (showSignupFlow) {
    return (
      <div className="min-h-screen bg-background">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        <Navbar />
        
        {/* Header with Back Button */}
        <header className="bg-card border-b" role="banner">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSignupFlow(false)}
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Cancel signup and return to sign in"
              >
                <LogIn className="h-4 w-4 mr-1" aria-hidden="true" />
                Sign In Instead
              </Button>
            </div>
          </div>
        </header>
        
        <main id="main-content" className="flex flex-col items-center justify-center p-4 pt-20">
          <SignupFlow onComplete={handleSignupComplete} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      {/* Header with Back Button */}
      <header className="bg-card border-b" role="banner">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Go back to homepage"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/faq')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="View frequently asked questions"
            >
              Help & FAQ
            </Button>
          </div>
        </div>
      </header>
      <main 
        id="main-content" 
        className="flex flex-col items-center justify-center p-4 pt-20"
        role="main"
        aria-labelledby="auth-heading"
      >
        <h1 id="auth-heading" className="sr-only">Authentication</h1>
        
        {/* Top Sign In Area */}
        <section className="w-full max-w-md mb-6" aria-labelledby="signin-section">
          <h2 id="signin-section" className="sr-only">Sign In to Existing Account</h2>
          
          {!showSignIn ? (
            <Button 
              onClick={() => setShowSignIn(true)}
              variant="outline" 
              className="w-full h-14 text-xl font-bold focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-describedby="signin-description"
            >
              Already have an account? Sign In
            </Button>
          ) : showForgotPassword ? (
            <Card role="form" aria-labelledby="forgot-password-title">
              <CardHeader className="pb-4">
                <CardTitle id="forgot-password-title" className="text-lg">Reset Password</CardTitle>
                <CardDescription>Enter your email to receive reset instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email Address</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      autoComplete="email"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Email'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Back
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card role="form" aria-labelledby="signin-card-title">
              <CardHeader className="pb-4">
                <CardTitle id="signin-card-title" className="text-lg">Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-describedby="signin-email-error"
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      autoComplete="email"
                    />
                    <div id="signin-email-error" className="sr-only" aria-live="polite">
                      {/* Error messages would go here */}
                    </div>
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
                      aria-describedby="signin-password-error"
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      autoComplete="current-password"
                    />
                     <div id="signin-password-error" className="sr-only" aria-live="polite">
                      {/* Error messages would go here */}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                      disabled={isLoading}
                      aria-describedby="signin-status"
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowSignIn(false)}
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Cancel sign in"
                    >
                      Cancel
                    </Button>
                  </div>
                   <div id="signin-status" className="sr-only" aria-live="polite">
                     {isLoading ? 'Processing sign in...' : ''}
                   </div>
                   
                   <div className="text-center">
                     <Button 
                       type="button"
                       variant="link"
                       onClick={() => setShowForgotPassword(true)}
                       className="text-sm"
                     >
                       Forgot Password?
                     </Button>
                   </div>
                </form>
              </CardContent>
            </Card>
          )}
          <p id="signin-description" className="sr-only">
            Sign in to access your existing AI Complete Me account and continue your journey to meaningful connections.
          </p>
        </section>
        
        <section className="w-full max-w-md" aria-labelledby="signup-section">
          <Card role="form" aria-labelledby="signup-card-title">
            <CardHeader className="text-center">
              <CardTitle id="signup-card-title" className="text-2xl font-bold">Join AI Complete Me</CardTitle>
              <CardDescription>Create your account and find meaningful connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="quiet-start-card rounded-2xl p-6 text-center space-y-4"
                  role="region"
                  aria-labelledby="offer-title"
                >
                  {/* Centered Logo */}
                  <div className="flex justify-center mb-4">
                    <img 
                      src={logoImage} 
                      alt="AI Complete Me" 
                      className="h-12 w-12 md:h-16 md:w-16 opacity-90"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 id="offer-title" className="text-xl md:text-2xl font-light text-amber-900 keepsake-heading">
                      Begin quietly. Connect deeply.
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-amber-800/80">
                      <span className="heart-accent">♡</span>
                      <span className="keepsake-heading italic">Founding hearts receive 3 months free + a keepsake of care</span>
                      <span className="heart-accent">♡</span>
                    </div>
                  </div>
                  <p className="text-sm text-amber-800/70 keepsake-heading">
                    Join the first 200 founding members:
                  </p>
                  <ul className="space-y-2 text-sm text-amber-800/80 keepsake-heading" role="list">
                    <li className="flex items-center justify-center gap-2">
                      <span className="heart-accent">♡</span>
                      <span>3 months of Complete Plus free</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <span className="heart-accent">♡</span>
                      <span>Priority matching & premium features</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleStartSignup}
                  className="shimmer-button w-full h-12 text-lg font-medium keepsake-heading bg-white/80 text-amber-900 hover:bg-white border-2 border-gold/30 hover:border-gold/60 rounded-xl"
                  aria-describedby="signup-description"
                >
                  <span className="heart-accent mr-2">♡</span>
                  Begin Your Soul Quest Journey
                  <span className="heart-accent ml-2">♡</span>
                </Button>
                
                <p id="signup-description" className="text-xs text-muted-foreground text-center">
                  Complete our guided signup to claim your benefits and begin creating meaningful connections through AI-powered compatibility.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 max-w-2xl text-center" aria-labelledby="accessibility-info">
          <h2 id="accessibility-info" className="text-lg font-semibold mb-3 text-foreground">
            Accessible for Everyone
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            AI Complete Me is accessible to everyone, no matter your abilities or the technology you use. 
            We support screen readers, keyboard navigation, and follow WCAG accessibility guidelines.
          </p>
          <div className="grid gap-2 text-xs text-muted-foreground">
            <div>🔍 Screen reader compatible • ⌨️ Full keyboard navigation • 🎯 High contrast support</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Auth;
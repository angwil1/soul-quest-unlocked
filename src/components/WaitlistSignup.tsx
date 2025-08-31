import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Users, Sparkles } from 'lucide-react';

export const WaitlistSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(2847); // Start with existing number
  const { toast } = useToast();

  // Fetch waitlist count on component mount
  useEffect(() => {
    fetchWaitlistCount();
  }, []);

  const fetchWaitlistCount = async () => {
    try {
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching waitlist count:', error);
        return;
      }
      
      // Add the base number to the actual count to maintain the existing number
      setWaitlistCount(2847 + (count || 0));
    } catch (error) {
      console.error('Error fetching waitlist count:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ 
          email: email.toLowerCase().trim(),
          referral_source: 'homepage_waitlist',
          user_agent: navigator.userAgent
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already on the list! 📋",
            description: "This email is already signed up. We'll notify you when we launch!",
            variant: "default"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "You're on the list! 🎉",
          description: "We'll notify you when we launch. Get ready for meaningful connections!",
          duration: 4000,
        });
        
        // Update the count
        setWaitlistCount(prev => prev + 1);
      }
      
      setEmail('');
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Be Among the First</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Join the Waitlist
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be the first to experience authentic connections. Join thousands who are ready for something real.
          </p>
          
          <Card className="p-8 max-w-md mx-auto bg-gradient-to-br from-background to-muted/5 border-primary/10 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-primary/20 focus:border-primary/40"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Joining...
                  </div>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Join Waitlist
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-medium">
                {waitlistCount.toLocaleString()} people already signed up
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
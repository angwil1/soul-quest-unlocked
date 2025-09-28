import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight, Users } from 'lucide-react';

export const GetStarted = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/quick-start');
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Now Live & Ready</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Start Your Journey Today
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're just beginning. You're invited to grow with us. Explore freely for 60 days.
          </p>
          
          <Card className="p-8 max-w-md mx-auto bg-gradient-to-br from-background to-muted/5 border-primary/10 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-red-500" />
                  <span>60 days free</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-primary" />
                  <span>Full features</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-purple-500" />
                  <span>Referral rewards</span>
                </div>
              </div>
              
              <Button 
                onClick={handleGetStarted}
                className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium group"
              >
                <Heart className="h-4 w-4 mr-2" />
                Get Started Now
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Free for 60 days • Create profile in under 2 minutes
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
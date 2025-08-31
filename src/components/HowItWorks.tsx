import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Brain, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignupFlow } from '@/components/SignupFlow';
import { useState } from 'react';

const steps = [
  {
    id: 1,
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Our advanced algorithm analyzes emotional compatibility, shared values, and deeper connections beyond surface-level attraction.",
    color: "from-primary to-purple-600"
  },
  {
    id: 2, 
    icon: Heart,
    title: "Meaningful Conversations",
    description: "Skip the small talk. Start with questions that matter and conversations that reveal who you really are.",
    color: "from-purple-600 to-pink-600"
  },
  {
    id: 3,
    icon: MessageCircle,
    title: "Real Connections",
    description: "Build authentic relationships with people who understand your depth, share your values, and complement your energy.",
    color: "from-pink-600 to-primary"
  }
];

export const HowItWorks = () => {
  const navigate = useNavigate();
  const [showSignupFlow, setShowSignupFlow] = useState(false);

  const handleSignupComplete = () => {
    setShowSignupFlow(false);
    navigate('/profile-setup');
  };

  return (
    <>
      {showSignupFlow && <SignupFlow onComplete={handleSignupComplete} />}
      <section className="py-20 bg-gradient-to-br from-muted/5 to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Simple Process</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to finding meaningful connections that go beyond the surface.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card 
                className="p-8 text-center bg-gradient-to-br from-background to-muted/5 border-primary/10 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in h-full"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} mb-6`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Step {step.id}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
              
              {/* Connection Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={() => setShowSignupFlow(true)}
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium px-8 py-3 rounded-xl"
          >
            <Heart className="h-5 w-5 mr-2" />
            Start Your Journey
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands ready for authentic connections
          </p>
        </div>
      </div>
    </section>
    </>
  );
};
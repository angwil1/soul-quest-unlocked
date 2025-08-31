import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SignupFlow } from '@/components/SignupFlow';
import { useState } from 'react';
import profileSilhouette from '@/assets/profile-silhouette.jpg';

export const SoulfulInvitation = () => {
  const navigate = useNavigate();
  const [showSignupFlow, setShowSignupFlow] = useState(false);

  const handleSignupComplete = () => {
    setShowSignupFlow(false);
    navigate('/profile-setup');
  };

  return (
    <>
      {showSignupFlow && <SignupFlow onComplete={handleSignupComplete} />}
      <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">
            Your story is waiting
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Step beyond the surface. Discover connections that honor who you truly are.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Ambient Silhouettes */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={profileSilhouette}
                alt="Silhouettes of people connecting meaningfully"
                className="w-full h-80 sm:h-96 md:h-[30rem] lg:h-[32rem] object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-lg font-light italic">
                  "I never believed in soulmates until I found mine here."
                </p>
                <p className="text-sm opacity-80 mt-2">— Alex & Jordan, connected 2024</p>
              </div>
            </div>
          </div>

          {/* Invitation Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      Beyond the swipe
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Experience dating that honors your emotional intelligence and authentic self.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      Privacy by design
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your heart, your story, your choice. We protect what matters most.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg"
                onClick={() => setShowSignupFlow(true)}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium"
              >
                Begin Your Story
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};
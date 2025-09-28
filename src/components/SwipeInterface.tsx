import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, X, Star, MapPin, Briefcase, Eye, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface SwipeProfile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  location: string;
  occupation: string;
  interests: string[];
  distance?: number;
}

interface SwipeInterfaceProps {
  profiles: SwipeProfile[];
  onSwipe: (profileId: string, direction: 'left' | 'right' | 'super') => void;
  onProfilesExhausted: () => void;
}

export const SwipeInterface = ({ profiles, onSwipe, onProfilesExhausted }: SwipeInterfaceProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-30, 0, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = async (direction: 'left' | 'right' | 'super') => {
    if (!user || !currentProfile || isAnimating) return;

    setIsAnimating(true);

    try {
      // Record swipe in database
      const { error } = await supabase
        .from('swipe_interactions')
        .insert({
          user_id: user.id,
          swiped_user_id: currentProfile.id,
          swipe_direction: direction
        });

      if (error && error.code !== '23505') { // Ignore unique constraint violations (already swiped)
        throw error;
      }

      // Move to next profile
      const nextIndex = currentIndex + 1;
      if (nextIndex >= profiles.length) {
        onProfilesExhausted();
      } else {
        setCurrentIndex(nextIndex);
      }

      // Show feedback
      if (direction === 'right') {
        toast({
          title: "Nice choice! 💕",
          description: "If they like you back, it's a match!",
        });
      } else if (direction === 'super') {
        toast({
          title: "Super Like sent! ⭐",
          description: "They'll see that you're really interested!",
        });
      }

      onSwipe(currentProfile.id, direction);
    } catch (error) {
      console.error('Swipe error:', error);
      toast({
        title: "Something went wrong",
        description: "Failed to record your swipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnimating(false);
      x.set(0); // Reset position
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 150;
    const velocity = info.velocity.x;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else {
      // Snap back to center
      x.set(0);
    }
  };

  if (!currentProfile) {
    return (
      <div className="max-w-sm mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-xl font-semibold">No more profiles!</h3>
              <p className="text-muted-foreground">
                You've seen everyone in your area. Check back later for new matches!
              </p>
              <Button onClick={onProfilesExhausted}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Explore More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto relative">
      {/* Stack Effect - Show next card behind */}
      {profiles[currentIndex + 1] && (
        <Card className="absolute inset-0 bg-muted/20 scale-95 z-0" />
      )}
      {profiles[currentIndex + 2] && (
        <Card className="absolute inset-0 bg-muted/10 scale-90 z-0" />
      )}

      {/* Current Card */}
      <motion.div
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity }}
        className="relative z-10"
        whileTap={{ scale: 0.95 }}
      >
        <Card className="overflow-hidden shadow-xl">
          {/* Photo Section */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage 
                src={currentProfile.photos[0]} 
                alt={currentProfile.name}
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="w-full h-full rounded-none text-4xl">
                {currentProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* Swipe Indicators */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-green-500/80 text-white text-4xl font-bold"
              style={{ 
                opacity: useTransform(x, [0, 150], [0, 1]),
                scale: useTransform(x, [0, 150], [0.8, 1])
              }}
            >
              LIKE
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-red-500/80 text-white text-4xl font-bold"
              style={{ 
                opacity: useTransform(x, [-150, 0], [1, 0]),
                scale: useTransform(x, [-150, 0], [1, 0.8])
              }}
            >
              NOPE
            </motion.div>

            {/* Distance Badge */}
            {currentProfile.distance && (
              <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">
                {currentProfile.distance} miles away
              </Badge>
            )}
          </div>

          {/* Profile Info */}
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold">
                  {currentProfile.name?.split(' ')[0]}, {currentProfile.age}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {currentProfile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {currentProfile.occupation}
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed line-clamp-3">
                {currentProfile.bio}
              </p>

              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {currentProfile.interests.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{currentProfile.interests.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full h-14 w-14 p-0 border-2 border-red-200 hover:bg-red-50 hover:border-red-300"
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="rounded-full h-12 w-12 p-0 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
          onClick={() => handleSwipe('super')}
          disabled={isAnimating}
        >
          <Star className="h-5 w-5 text-blue-500" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="rounded-full h-14 w-14 p-0 border-2 border-green-200 hover:bg-green-50 hover:border-green-300"
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
        >
          <Heart className="h-6 w-6 text-green-500" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 space-y-1">
        <p className="text-xs text-muted-foreground">
          Swipe or use buttons • 
          <X className="h-3 w-3 inline mx-1 text-red-500" />Pass • 
          <Star className="h-3 w-3 inline mx-1 text-blue-500" />Super Like • 
          <Heart className="h-3 w-3 inline mx-1 text-green-500" />Like
        </p>
      </div>
    </div>
  );
};
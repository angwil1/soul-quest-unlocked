import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SwipeInterface } from '@/components/SwipeInterface';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { founderCuratedProfiles } from '@/data/sampleProfiles';

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

const SwipeMode = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<SwipeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipedProfiles, setSwipedProfiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadProfiles();
  }, [user, navigate]);

  const loadProfiles = async () => {
    if (!user) return;

    try {
      // Get already swiped profiles
      const { data: swipedData } = await supabase
        .from('swipe_interactions')
        .select('swiped_user_id')
        .eq('user_id', user.id);

      const swipedIds = new Set(swipedData?.map(s => s.swiped_user_id) || []);
      setSwipedProfiles(swipedIds);

      // Convert sample profiles to SwipeProfile format and filter out swiped ones
      const availableProfiles: SwipeProfile[] = founderCuratedProfiles
        .filter(profile => !swipedIds.has(profile.id))
        .map(profile => ({
          id: profile.id,
          name: profile.name,
          age: profile.age,
          photos: profile.photos,
          bio: profile.bio,
          location: profile.location,
          occupation: profile.occupation,
          interests: profile.interests,
          distance: Math.floor(Math.random() * 25) + 1 // Random distance for demo
        }));

      setProfiles(availableProfiles);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error loading profiles",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (profileId: string, direction: 'left' | 'right' | 'super') => {
    // Add to swiped set
    setSwipedProfiles(prev => new Set([...prev, profileId]));
  };

  const handleProfilesExhausted = () => {
    toast({
      title: "All caught up! 🎉",
      description: "Check back later for new profiles to discover.",
    });
    navigate('/matches');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/browse')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Discover</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              {profiles.length} profiles to explore
            </p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Swipe Interface */}
        <SwipeInterface
          profiles={profiles}
          onSwipe={handleSwipe}
          onProfilesExhausted={handleProfilesExhausted}
        />

        {/* Tips */}
        <div className="mt-8 text-center">
          <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-semibold mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Swipe right if you're interested</li>
              <li>• Use Super Like for someone special</li>
              <li>• If you both like each other, it's a match!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeMode;
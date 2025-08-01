import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Heart, MessageCircle, Share, Play } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEchoSubscription } from '@/hooks/useEchoSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VibeGalleryItem {
  id: string;
  user_id: string;
  content_type: 'video' | 'image' | 'audio';
  file_url: string;
  caption?: string;
  mood_tags: string[];
  is_public: boolean;
  created_at: string;
  user_name?: string;
}

interface VibeGalleryProps {
  isOwnProfile?: boolean;
  userId?: string;
}

export const VibeGallery = ({ isOwnProfile = false, userId }: VibeGalleryProps) => {
  const { user } = useAuth();
  const { isEchoActive } = useEchoSubscription();
  const { toast } = useToast();
  const [items, setItems] = useState<VibeGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newMoodTags, setNewMoodTags] = useState('');

  const moodTagSuggestions = [
    'cozy', 'energetic', 'dreamy', 'confident', 'playful', 'mysterious',
    'romantic', 'adventurous', 'chill', 'passionate', 'quirky', 'elegant'
  ];

  const loadVibeGallery = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('vibe_gallery_items')
        .select(`
          *,
          profiles(name)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        // Loading specific user's gallery
        query = query.eq('user_id', userId);
        if (!isOwnProfile) {
          query = query.eq('is_public', true);
        }
      } else {
        // Loading public gallery for discovery
        query = query.eq('is_public', true).limit(20);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setItems((data as any) || []);
    } catch (error) {
      console.error('Error loading vibe gallery:', error);
      toast({
        title: "Error",
        description: "Failed to load vibe gallery items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (fileUrl: string, contentType: 'video' | 'image' | 'audio') => {
    if (!user) return;
    
    try {
      const moodTagsArray = newMoodTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error } = await supabase
        .from('vibe_gallery_items')
        .insert({
          user_id: user.id,
          content_type: contentType,
          file_url: fileUrl,
          caption: newCaption || null,
          mood_tags: moodTagsArray,
          is_public: true
        });

      if (error) throw error;

      toast({
        title: "Vibe added!",
        description: "Your vibe has been added to the gallery.",
      });

      setNewCaption('');
      setNewMoodTags('');
      setIsAddingItem(false);
      await loadVibeGallery();
    } catch (error) {
      console.error('Error adding vibe gallery item:', error);
      toast({
        title: "Error",
        description: "Failed to add vibe gallery item.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadVibeGallery();
  }, [userId, isOwnProfile]);

  const renderVibeItem = (item: VibeGalleryItem) => (
    <Card key={item.id} className="overflow-hidden">
      <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        {item.content_type === 'image' ? (
          <img 
            src={item.file_url} 
            alt={item.caption || 'Vibe'}
            className="w-full h-full object-cover"
          />
        ) : item.content_type === 'video' ? (
          <div className="w-full h-full flex items-center justify-center">
            <video 
              src={item.file_url}
              className="w-full h-full object-cover"
              muted
              loop
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎵</div>
              <p className="text-sm font-medium">Audio Vibe</p>
            </div>
          </div>
        )}
        
        {/* Mood tags overlay */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {item.mood_tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-black/50 text-white">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {item.caption && (
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground">{item.caption}</p>
          {item.user_name && !isOwnProfile && (
            <p className="text-xs text-muted-foreground mt-1">by {item.user_name}</p>
          )}
        </CardContent>
      )}

      {/* Interaction buttons */}
      <div className="flex items-center justify-between p-3 border-t">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vibe gallery...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isEchoActive && isOwnProfile) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✨</span>
              <CardTitle className="text-lg">Vibe Gallery</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Echo
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Express your authentic self through creative vibes
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Available with Unlocked Echo subscription
          </p>
          <Button size="sm" className="w-full" onClick={() => window.location.href = '/pricing'}>
            <Plus className="h-4 w-4 mr-2" />
            Upgrade to Echo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">✨</span>
            Vibe Gallery
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">Echo</Badge>
          </h2>
          <p className="text-muted-foreground">
            {isOwnProfile ? 'Your collection of vibes and moments' : 'Discover authentic vibes from the community'}
          </p>
        </div>
        
        {isOwnProfile && isEchoActive && (
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vibe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Vibe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Caption</label>
                  <Textarea
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="What's the vibe? How are you feeling?"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Mood Tags</label>
                  <Input
                    value={newMoodTags}
                    onChange={(e) => setNewMoodTags(e.target.value)}
                    placeholder="cozy, dreamy, confident (comma separated)"
                    className="mt-1"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {moodTagSuggestions.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => {
                          const tags = newMoodTags ? `${newMoodTags}, ${tag}` : tag;
                          setNewMoodTags(tags);
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    File upload coming soon! For now, share your vibes through captions and mood tags.
                  </p>
                  <Button 
                    onClick={() => handleAddItem('/placeholder-vibe.jpg', 'image')}
                    disabled={!newCaption.trim()}
                  >
                    Add This Vibe
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-semibold mb-2">
              {isOwnProfile ? 'No vibes yet' : 'No public vibes found'}
            </h3>
            <p className="text-muted-foreground">
              {isOwnProfile 
                ? 'Start building your vibe gallery to show your authentic self'
                : 'Check back later for new vibes from the community'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(renderVibeItem)}
        </div>
      )}
    </div>
  );
};
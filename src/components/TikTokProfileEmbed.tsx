import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Edit, Sparkles } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEchoSubscription } from '@/hooks/useEchoSubscription';
import { EmotionalSoundtrackPrompt } from './EmotionalSoundtrackPrompt';
import { SoundtrackPlayer } from './SoundtrackPlayer';

interface TikTokProfileEmbedProps {
  isEditMode?: boolean;
}

export const TikTokProfileEmbed = ({ isEditMode = false }: TikTokProfileEmbedProps) => {
  const { profile, updateProfile } = useProfile();
  const { isEchoActive } = useEchoSubscription();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSoundtrackPrompt, setShowSoundtrackPrompt] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState(profile?.tiktok_embed_url || '');
  const [emotionalSoundtrack, setEmotionalSoundtrack] = useState(profile?.emotional_soundtrack || '');

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          tiktok_embed_url: tiktokUrl,
          emotional_soundtrack: emotionalSoundtrack,
        })
        .eq('id', profile?.id);

      if (error) throw error;

      await updateProfile({});
      setIsEditing(false);
      
      toast({
        title: "Profile updated!",
        description: "Your TikTok embed and emotional soundtrack have been saved.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSoundtrackSelect = (title: string, artist: string, tiktokUrl: string, mood: string) => {
    setTiktokUrl(tiktokUrl);
    setEmotionalSoundtrack(`${mood} vibes: ${title} by ${artist}`);
    setShowSoundtrackPrompt(false);
    
    toast({
      title: "Soundtrack selected!",
      description: `Your vibe is now set to ${title} by ${artist}`,
    });
  };

  // Extract TikTok video ID from URL for embedding
  const getTikTokVideoId = (url: string) => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const videoId = tiktokUrl ? getTikTokVideoId(tiktokUrl) : null;

  // Show soundtrack prompt modal if active
  if (showSoundtrackPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Emotional Soundtrack Prompting</h2>
            <Button variant="ghost" onClick={() => setShowSoundtrackPrompt(false)}>
              ✕
            </Button>
          </div>
          <div className="p-4">
            <EmotionalSoundtrackPrompt onSoundtrackSelect={handleSoundtrackSelect} />
          </div>
        </div>
      </div>
    );
  }

  if (!isEchoActive) {
    return (
      <Card className="w-full max-w-md mx-auto border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <CardTitle className="text-lg">TikTok Profile Embed</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Echo
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Express your vibe through TikTok-style content
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Available with Unlocked Echo subscription
          </p>
          <div className="space-y-2">
            <Button size="sm" className="w-full" variant="outline" onClick={() => window.location.href = '/pricing'}>
              <Sparkles className="h-4 w-4 mr-2" />
              Get Echo Monthly ($4/mo)
            </Button>
            <div className="text-center text-xs text-muted-foreground">or</div>
            <Button size="sm" className="w-full" onClick={() => window.location.href = '/pricing'}>
              <Sparkles className="h-4 w-4 mr-2" />
              Unlock Echo Forever ($12)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEditMode || isEditing) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            TikTok Profile Embed
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">Echo</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Soundtrack Prompting */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-800">Echo Enhancement</span>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              Let AI curate the perfect soundtrack based on your mood
            </p>
            <Button
              onClick={() => setShowSoundtrackPrompt(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Find My Soundtrack
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium">TikTok Video URL</label>
            <Input
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/video/123456789"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste a TikTok video URL that represents your vibe
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Emotional Soundtrack</label>
            <Input
              value={emotionalSoundtrack}
              onChange={(e) => setEmotionalSoundtrack(e.target.value)}
              placeholder="Describe the mood/feeling this represents"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              What emotion or vibe does this video capture for you?
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tiktokUrl) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">🎵</div>
          <h3 className="font-semibold mb-2">No TikTok Embed</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Add a TikTok video to show your vibe
          </p>
          {isEditMode && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Add TikTok Video
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="relative aspect-[9/16] bg-black">
        {videoId ? (
          <iframe
            src={`https://www.tiktok.com/embed/v2/${videoId}`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-lg font-semibold">TikTok Vibes</p>
              <p className="text-sm opacity-80">Coming Soon</p>
            </div>
          </div>
        )}
        
        {/* Overlay controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-black/50 text-white hover:bg-black/70"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-black/50 text-white hover:bg-black/70"
            onClick={handleMuteToggle}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Echo badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-purple-500 text-white">
            Echo
          </Badge>
        </div>
      </div>

      {emotionalSoundtrack && (
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-lg">💭</span>
            <span className="italic flex-1">"{emotionalSoundtrack}"</span>
            <SoundtrackPlayer text={emotionalSoundtrack} />
          </div>
        </CardContent>
      )}

      {isEditMode && (
        <CardContent className="p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="w-full"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit TikTok Embed
          </Button>
        </CardContent>
      )}
    </Card>
  );
};
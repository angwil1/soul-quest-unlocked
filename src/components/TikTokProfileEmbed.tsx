import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Edit } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TikTokProfileEmbedProps {
  isEditMode?: boolean;
}

export const TikTokProfileEmbed = ({ isEditMode = false }: TikTokProfileEmbedProps) => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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

  // Extract TikTok video ID from URL for embedding
  const getTikTokVideoId = (url: string) => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const videoId = tiktokUrl ? getTikTokVideoId(tiktokUrl) : null;

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
            <span className="italic">"{emotionalSoundtrack}"</span>
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
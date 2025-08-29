import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, Volume2, VolumeX, Edit, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { EmotionalSoundtrackPrompt } from './EmotionalSoundtrackPrompt';
import { SoundtrackPlayer } from './SoundtrackPlayer';

interface TikTokProfileEmbedProps {
  isEditMode?: boolean;
}

export const TikTokProfileEmbed = ({ isEditMode = false }: TikTokProfileEmbedProps) => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  // For now, show coming soon placeholder
  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <CardTitle className="text-lg">TikTok Profile Embed</CardTitle>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Express your vibe through TikTok-style content
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Coming soon - Link your TikTok to show your personality
        </p>
        <Button size="sm" className="w-full" variant="outline" disabled>
          <Sparkles className="h-4 w-4 mr-2" />
          Feature Coming Soon
        </Button>
      </CardContent>
    </Card>
  );
};
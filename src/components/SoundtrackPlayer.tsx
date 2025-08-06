import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SoundtrackPlayerProps {
  text: string;
  className?: string;
}

export const SoundtrackPlayer: React.FC<SoundtrackPlayerProps> = ({
  text,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePlay = async () => {
    if (isPlaying) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!window.speechSynthesis) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Take only first few words for a short preview
      const shortText = text.split(' ').slice(0, 6).join(' ');
      
      const utterance = new SpeechSynthesisUtterance(shortText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        toast({
          title: "Playback Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing soundtrack:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate audio preview",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handlePlay}
      disabled={isLoading}
      className={`h-8 w-8 p-0 ${className}`}
    >
      {isLoading ? (
        <Volume2 className="h-3 w-3 animate-pulse" />
      ) : isPlaying ? (
        <Pause className="h-3 w-3" />
      ) : (
        <Play className="h-3 w-3" />
      )}
    </Button>
  );
};
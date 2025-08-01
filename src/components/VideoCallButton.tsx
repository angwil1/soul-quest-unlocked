import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import VideoCallModal from '@/components/VideoCallModal';

interface VideoCallButtonProps {
  matchName: string;
  matchId?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const VideoCallButton = ({ 
  matchName, 
  matchId, 
  variant = "default", 
  size = "default",
  className = ""
}: VideoCallButtonProps) => {
  const { isUnlockedPlus, isUnlockedBeyond } = useSubscription();
  const { toast } = useToast();
  const [showVideoCall, setShowVideoCall] = useState(false);

  const hasVideoAccess = isUnlockedPlus || isUnlockedBeyond;

  const handleVideoCallClick = () => {
    if (!hasVideoAccess) {
      toast({
        title: "Video Chat is Premium",
        description: "Upgrade to Unlocked+ to access video chat with your matches",
        action: (
          <Button size="sm" onClick={() => window.location.href = '/pricing'}>
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        ),
      });
      return;
    }

    setShowVideoCall(true);
  };

  const handleCallStart = () => {
    // Here you could integrate with a real video calling service
    // For now, we'll just show a success message
    toast({
      title: "Video call feature",
      description: "Video calling integration would be implemented here with services like Twilio, Agora, or WebRTC",
    });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${className} ${!hasVideoAccess ? 'opacity-75' : ''}`}
        onClick={handleVideoCallClick}
      >
        <Video className="h-4 w-4 mr-2" />
        {hasVideoAccess ? "Video Chat" : "Video Chat (Premium)"}
        {!hasVideoAccess && <Crown className="h-3 w-3 ml-1" />}
      </Button>

      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        matchName={matchName}
        onCallStart={handleCallStart}
      />
    </>
  );
};
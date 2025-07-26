import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Phone, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchName: string;
  onCallStart?: () => void;
}

const VideoCallModal = ({ isOpen, onClose, matchName, onCallStart }: VideoCallModalProps) => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(5);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isBlurred, setIsBlurred] = useState(true);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const softTexts = [
    "Not here to impress. Just here.",
    "This is a judgment-free zone. Blurry hearts welcome.",
    "Take your time. Connection over perfection.",
    "Authentic moments happen when we're ourselves."
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (isOpen && !isCallActive) {
      const textInterval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % softTexts.length);
      }, 3000);
      return () => clearInterval(textInterval);
    }
  }, [isOpen, isCallActive, softTexts.length]);

  const startCountdown = async () => {
    setIsCountingDown(true);
    
    try {
      // Get user media
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Start countdown
      let count = 5;
      setCountdown(count);
      
      const countInterval = setInterval(() => {
        count--;
        setCountdown(count);
        
        if (count === 0) {
          clearInterval(countInterval);
          setIsCallActive(true);
          setIsCountingDown(false);
          onCallStart?.();
          
          toast({
            title: "Video call started",
            description: `You're now connected with ${matchName}`,
          });
        }
      }, 1000);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera/microphone access needed",
        description: "Please allow camera and microphone access to start the video call",
        variant: "destructive"
      });
      setIsCountingDown(false);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCallActive(false);
    setIsCountingDown(false);
    setCountdown(5);
    onClose();
    
    toast({
      title: "Call ended",
      description: "Thanks for connecting authentically",
    });
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-background/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isCallActive ? `Video call with ${matchName}` : `Ready to connect with ${matchName}?`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Video Area */}
          <div className="flex-1 relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg overflow-hidden">
            {isCallActive || isCountingDown ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className={`w-full h-full object-cover ${
                    isBlurred ? 'blur-md' : ''
                  } ${!isVideoEnabled ? 'hidden' : ''}`}
                />
                
                {!isVideoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <VideoOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Countdown overlay */}
                {isCountingDown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white">
                      <div className="text-6xl font-bold mb-4">{countdown}</div>
                      <p className="text-xl">Starting video call...</p>
                    </div>
                  </div>
                )}

                {/* Blur indicator */}
                {isBlurred && isCallActive && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      Blurred
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="h-32 w-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto flex items-center justify-center">
                    <Video className="h-16 w-16 text-white" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Ready for a genuine connection?</h3>
                    
                    <div className="h-12 flex items-center justify-center">
                      <p className="text-lg text-muted-foreground italic transition-opacity duration-500">
                        "{softTexts[currentTextIndex]}"
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        <span>Start with blur enabled for comfort</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MicOff className="h-4 w-4 text-primary" />
                        <span>Toggle to audio-only anytime</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>Exit whenever you need to</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {isCallActive ? (
              <>
                <Button
                  variant={isVideoEnabled ? "secondary" : "destructive"}
                  size="lg"
                  onClick={toggleVideo}
                  className="rounded-full w-14 h-14"
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isAudioEnabled ? "secondary" : "destructive"}
                  size="lg"
                  onClick={toggleAudio}
                  className="rounded-full w-14 h-14"
                >
                  {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isBlurred ? "secondary" : "outline"}
                  size="lg"
                  onClick={toggleBlur}
                  className="rounded-full w-14 h-14"
                >
                  {isBlurred ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  className="rounded-full w-14 h-14"
                >
                  <Phone className="h-5 w-5 rotate-135" />
                </Button>
              </>
            ) : (
              <div className="flex gap-4">
                <Button variant="outline" onClick={onClose} size="lg">
                  Maybe later
                </Button>
                <Button 
                  onClick={startCountdown} 
                  disabled={isCountingDown}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {isCountingDown ? "Starting..." : "Start video call"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
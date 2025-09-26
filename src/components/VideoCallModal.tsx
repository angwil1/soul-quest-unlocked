import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Phone, Eye, EyeOff, Sparkles, Palette } from 'lucide-react';
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
  const [currentFilter, setCurrentFilter] = useState('none');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoFilters = [
    { name: 'None', value: 'none', css: '' },
    { name: 'Warm', value: 'warm', css: 'sepia(0.3) saturate(1.2) contrast(1.1)' },
    { name: 'Cool', value: 'cool', css: 'hue-rotate(10deg) saturate(1.1) brightness(1.1)' },
    { name: 'Vintage', value: 'vintage', css: 'sepia(0.5) contrast(1.2) brightness(0.9)' },
    { name: 'Soft', value: 'soft', css: 'contrast(0.9) brightness(1.1) saturate(0.9)' },
    { name: 'Dramatic', value: 'dramatic', css: 'contrast(1.3) saturate(1.3) brightness(0.95)' },
    { name: 'Glow', value: 'glow', css: 'brightness(1.2) contrast(0.9) saturate(1.1)' }
  ];

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

  const cycleFilter = () => {
    const currentIndex = videoFilters.findIndex(f => f.value === currentFilter);
    const nextIndex = (currentIndex + 1) % videoFilters.length;
    setCurrentFilter(videoFilters[nextIndex].value);
    
    toast({
      title: "Filter changed",
      description: `Applied ${videoFilters[nextIndex].name} filter`,
    });
  };

  const getVideoStyle = () => {
    const filter = videoFilters.find(f => f.value === currentFilter);
    let style = filter?.css || '';
    
    if (isBlurred) {
      style += style ? ' blur(8px)' : 'blur(8px)';
    }
    
    return style;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] md:h-[80vh] bg-background/95 backdrop-blur-sm border-primary/20 p-3 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-xl">
            {isCallActive ? `Video call with ${matchName}` : `Ready to connect with ${matchName}?`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Video Area */}
          <div className="flex-1 relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg overflow-hidden min-h-[200px] md:min-h-[300px]">
            {isCallActive || isCountingDown ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className={`w-full h-full object-cover transition-all duration-300 ${!isVideoEnabled ? 'hidden' : ''}`}
                  style={{ filter: getVideoStyle() }}
                />
                
                {!isVideoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <VideoOff className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm md:text-base">Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Countdown overlay */}
                {isCountingDown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white">
                      <div className="text-4xl md:text-6xl font-bold mb-4">{countdown}</div>
                      <p className="text-lg md:text-xl">Starting video call...</p>
                    </div>
                  </div>
                )}

                {/* Filter and Blur indicators */}
                {(isBlurred || currentFilter !== 'none') && isCallActive && (
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 flex gap-2">
                    {isBlurred && (
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Blurred
                      </Badge>
                    )}
                    {currentFilter !== 'none' && (
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {videoFilters.find(f => f.value === currentFilter)?.name}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
                <div className="max-w-md mx-auto space-y-4 md:space-y-6">
                  <div className="h-20 w-20 md:h-32 md:w-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto flex items-center justify-center">
                    <Video className="h-10 w-10 md:h-16 md:w-16 text-white" />
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-lg md:text-2xl font-semibold">Ready for a genuine connection?</h3>
                    
                    <div className="h-10 md:h-12 flex items-center justify-center">
                      <p className="text-sm md:text-lg text-muted-foreground italic transition-opacity duration-500 px-2">
                        "{softTexts[currentTextIndex]}"
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 md:p-4 space-y-2 text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                        <span>Tap through beautiful filters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                        <span>Start with blur enabled for comfort</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MicOff className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                        <span>Toggle to audio-only anytime</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                        <span>Exit whenever you need to</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 md:mt-6 flex items-center justify-center gap-2 md:gap-3 pb-2">
            {isCallActive ? (
              <>
                <Button
                  variant={isVideoEnabled ? "secondary" : "destructive"}
                  size="lg"
                  onClick={toggleVideo}
                  className="rounded-full w-10 h-10 md:w-12 md:h-12 touch-manipulation"
                >
                  {isVideoEnabled ? <Video className="h-3 w-3 md:h-4 md:w-4" /> : <VideoOff className="h-3 w-3 md:h-4 md:w-4" />}
                </Button>

                <Button
                  variant={isAudioEnabled ? "secondary" : "destructive"}
                  size="lg"
                  onClick={toggleAudio}
                  className="rounded-full w-10 h-10 md:w-12 md:h-12 touch-manipulation"
                >
                  {isAudioEnabled ? <Mic className="h-3 w-3 md:h-4 md:w-4" /> : <MicOff className="h-3 w-3 md:h-4 md:w-4" />}
                </Button>

                <Button
                  variant={isBlurred ? "secondary" : "outline"}
                  size="lg"
                  onClick={toggleBlur}
                  className="rounded-full w-10 h-10 md:w-12 md:h-12 touch-manipulation"
                >
                  {isBlurred ? <EyeOff className="h-3 w-3 md:h-4 md:w-4" /> : <Eye className="h-3 w-3 md:h-4 md:w-4" />}
                </Button>

                <Button
                  variant={currentFilter !== 'none' ? "secondary" : "outline"}
                  size="lg"
                  onClick={cycleFilter}
                  className="rounded-full w-10 h-10 md:w-12 md:h-12 touch-manipulation"
                >
                  <Palette className="h-3 w-3 md:h-4 md:w-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  className="rounded-full w-10 h-10 md:w-12 md:h-12 touch-manipulation"
                >
                  <Phone className="h-3 w-3 md:h-4 md:w-4 rotate-135" />
                </Button>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-sm">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  size="lg"
                  className="flex-1 min-h-[48px] touch-manipulation"
                >
                  Maybe later
                </Button>
                <Button 
                  onClick={startCountdown} 
                  disabled={isCountingDown}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 min-h-[48px] touch-manipulation"
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
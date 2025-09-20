import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, X, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const { toast } = useToast();

  const startCamera = async (mode: 'user' | 'environment' = 'user') => {
    try {
      console.log('🎥 Starting camera with mode:', mode);
      
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      console.log('🎥 Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      console.log('🎥 Camera access granted!', stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setFacingMode(mode);
        console.log('🎥 Camera streaming started successfully');
      }
    } catch (error: any) {
      console.error('🎥 Camera access error:', error);
      
      let errorMessage = 'Unable to access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Camera permission was denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage += 'Camera constraints not supported.';
      } else if (error.name === 'SecurityError') {
        errorMessage += 'Camera access blocked for security reasons.';
      } else {
        errorMessage += error.message || 'Unknown camera error occurred.';
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });

      // Automatic fallback to native photo picker
      if (fileInputRef.current) {
        // Ensure attribute present for mobile camera
        fileInputRef.current.setAttribute('capture', 'environment');
        fileInputRef.current.click();
      }

    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const capturePhoto = () => {
    console.log('🎥 Attempting to capture photo...');
    
    if (!videoRef.current || !canvasRef.current || !streamRef.current) {
      console.error('🎥 Missing required elements:', {
        video: !!videoRef.current,
        canvas: !!canvasRef.current,
        stream: !!streamRef.current
      });
      toast({
        title: "Capture Error",
        description: "Camera components not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('🎥 Could not get canvas context');
      toast({
        title: "Capture Error", 
        description: "Canvas not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log('🎥 Canvas dimensions:', canvas.width, 'x', canvas.height);

      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('🎥 Photo captured successfully:', blob);
          const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { 
            type: 'image/jpeg' 
          });
          onCapture(file);
          handleClose();
        } else {
          console.error('🎥 Failed to create blob from canvas');
          toast({
            title: "Capture Error",
            description: "Failed to capture photo. Please try again.",
            variant: "destructive"
          });
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('🎥 Error during photo capture:', error);
      toast({
        title: "Capture Error",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    startCamera(newMode);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Take Photo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            <canvas
              ref={canvasRef}
              className="hidden"
            />

            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Starting camera...</p>
                </div>
              </div>
            )}

            {/* Camera overlay UI */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner guides */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/50"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/50"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/50"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/50"></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={switchCamera}
                disabled={!isStreaming}
                title="Switch camera"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                onClick={capturePhoto}
                disabled={!isStreaming}
                className="bg-primary hover:bg-primary/90 px-8"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Position yourself in the frame and click capture when ready
          </p>

          {/* Hidden native photo picker for fallback */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onCapture(file);
                handleClose();
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
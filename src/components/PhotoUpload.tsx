import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, X, Camera, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export const PhotoUpload = ({ photos, onPhotosChange, maxPhotos = 1 }: PhotoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload photos.",
        variant: "destructive",
      });
      return;
    }

    if (photos.length + acceptedFiles.length > maxPhotos) {
      toast({
        title: "Too many photos",
        description: `Maximum ${maxPhotos} photos allowed.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const newPhotos = [...photos];
    
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
      
      const photoUrl = await uploadPhoto(file);
      if (photoUrl) {
        newPhotos.push(photoUrl);
      }
    }

    onPhotosChange(newPhotos);
    setUploading(false);
    setUploadProgress(0);

    if (newPhotos.length > photos.length) {
      toast({
        title: "Photos uploaded",
        description: `${newPhotos.length - photos.length} photo(s) uploaded successfully.`,
      });
    }
  }, [user, photos, maxPhotos, onPhotosChange, toast]);

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: uploading || photos.length >= maxPhotos
  });

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <Card key={index} className="relative group aspect-square overflow-hidden">
            <CardContent className="p-0 h-full">
              <Avatar className="w-full h-full rounded-lg">
                <AvatarImage 
                  src={photo} 
                  alt={`Photo ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="w-full h-full rounded-lg">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={() => removePhoto(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Main
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <Card 
            {...getRootProps()} 
            className={`aspect-square cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-dashed border-muted-foreground/50 hover:border-primary hover:bg-muted/50'
            }`}
          >
            <input {...getInputProps()} />
            <CardContent className="p-0 h-full flex items-center justify-center">
              <div className="text-center">
                {uploading ? (
                  <div className="space-y-2">
                    <Upload className="h-6 w-6 mx-auto text-primary animate-pulse" />
                    <Progress value={uploadProgress} className="w-16" />
                  </div>
                ) : (
                  <>
                    <Plus className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Add Photo</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Add your profile picture.
        </p>
        <p className="text-xs text-muted-foreground">
          Drag and drop or click to upload. Supports JPG, PNG, WebP.
        </p>
      </div>
    </div>
  );
};
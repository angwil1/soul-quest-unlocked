import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, Profile } from '@/hooks/useProfile';
import { AgeVerification } from '@/components/AgeVerification';
import { ArrowLeft, Upload, X, Camera, MapPin, Search } from 'lucide-react';

const ProfileEdit = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile, addPhoto, removePhoto, setAsAvatar } = useProfile();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newInterest, setNewInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  // Check if user needs age verification
  useEffect(() => {
    const checkAgeVerification = () => {
      const ageVerified = localStorage.getItem('ageVerified');
      const isNewUser = !profile?.name; // Assume new user if no name set
      
      // Show age verification for new users who haven't verified yet
      if (isNewUser && ageVerified !== 'true') {
        setShowAgeVerification(true);
      }
    };

    if (user && !profileLoading) {
      checkAgeVerification();
    }
  }, [user, profile, profileLoading]);

  useEffect(() => {
    if (profile) {
      // Auto-populate zip_code from location if it looks like a zip code and zip_code is empty
      let autoZipCode = profile.zip_code || '';
      if (!autoZipCode && profile.location) {
        const locationZipMatch = profile.location.match(/^\d{5}(-\d{4})?$/);
        if (locationZipMatch) {
          autoZipCode = profile.location;
          console.log('🏠 Auto-populated zip code from location:', autoZipCode);
        }
      }
      
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        age: profile.age || undefined,
        gender: profile.gender || '',
        location: profile.location || '',
        interests: profile.interests || [],
        date_of_birth: profile.date_of_birth || '',
        height: profile.height || undefined,
        occupation: profile.occupation || '',
        education: profile.education || '',
        looking_for: profile.looking_for || '',
        distance_preference: profile.distance_preference || 50,
        age_preference_min: profile.age_preference_min || 18,
        age_preference_max: profile.age_preference_max || 65,
        zip_code: autoZipCode,
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && formData.interests) {
      const interests = [...formData.interests, newInterest.trim()];
      setFormData(prev => ({ ...prev, interests }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    const interests = formData.interests?.filter((_, i) => i !== index) || [];
    setFormData(prev => ({ ...prev, interests }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await addPhoto(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      // Create a video element to show camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Create a modal for camera capture
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold mb-4">Take Photo</h3>
          <div class="relative">
            <video id="camera-preview" class="w-full rounded-lg" autoplay></video>
            <canvas id="camera-canvas" class="hidden"></canvas>
          </div>
          <div class="flex gap-2 mt-4">
            <button id="capture-btn" class="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Capture
            </button>
            <button id="cancel-btn" class="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      const videoElement = modal.querySelector('#camera-preview') as HTMLVideoElement;
      videoElement.srcObject = stream;
      
      const cleanup = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };
      
      modal.querySelector('#cancel-btn')?.addEventListener('click', cleanup);
      
      modal.querySelector('#capture-btn')?.addEventListener('click', () => {
        const canvas = modal.querySelector('#camera-canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context?.drawImage(videoElement, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            await addPhoto(file);
          }
          cleanup();
        }, 'image/jpeg', 0.8);
      });
      
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access not available. Please use the upload option instead.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await updateProfile(formData);
    
    if (!error) {
      navigate('/profile');
    }
    
    setIsSubmitting(false);
  };

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('ProfileEdit - Auth state:', { user: !!user, authLoading });
    if (!authLoading && !user) {
      console.log('ProfileEdit - Redirecting to auth');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  console.log('ProfileEdit - Current state:', { userExists: !!user, authLoading, profileLoading });

  // Show loading while checking authentication
  if (authLoading) {
    console.log('ProfileEdit - Showing auth loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Loading...</h2>
          <p className="text-sm text-muted-foreground mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting to auth
  if (!user) {
    console.log('ProfileEdit - No user, should redirect');
    return null;
  }

  // Show loading while fetching profile data
  if (profileLoading) {
    console.log('ProfileEdit - Showing profile loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Loading Profile...</h2>
          <p className="text-sm text-muted-foreground mt-2">Setting up your profile editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <Button form="profile-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Age Verification Modal for New Users */}
        {showAgeVerification && (
          <div className="mb-8">
            <AgeVerification 
              forceOpen={true}
              onVerificationComplete={() => {
                setShowAgeVerification(false);
              }}
            />
          </div>
        )}

        <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Photos Section */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Add up to 6 photos to show your best self</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCameraCapture}>
                    <Camera className="h-4 w-4 mr-2" />
                    Take Picture
                  </Button>
                </div>
                
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Additional Photos */}
              {profile?.photos && profile.photos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Additional Photos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Profile photo ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border border-border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setAsAvatar(photo)}
                              className="text-xs"
                            >
                              Set as Main
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removePhoto(photo)}
                              className="text-xs"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add More Photos */}
              {(!profile?.photos || profile.photos.length < 6) && (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="text-muted-foreground">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Add more photos to show your personality</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.photos?.length || 0} of 6 photos
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => document.getElementById('additional-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCameraCapture}>
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                    </div>
                    <input
                      id="additional-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="woman">Woman</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value) || undefined)}
                    placeholder="170"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation || ''}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    placeholder="Your job title"
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    value={formData.education || ''}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Your education level"
                  />
                </div>

                <div>
                  <Label htmlFor="looking_for">Looking for</Label>
                  <Select value={formData.looking_for || ''} onValueChange={(value) => handleInputChange('looking_for', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What are you looking for?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relationship">Long-term relationship</SelectItem>
                      <SelectItem value="casual">Casual dating</SelectItem>
                      <SelectItem value="friends">New friends</SelectItem>
                      <SelectItem value="unsure">Not sure yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell others about yourself..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <CardDescription>Add interests to help others know what you're passionate about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                />
                <Button type="button" onClick={handleAddInterest}>Add</Button>
              </div>
              
              {formData.interests && formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Dating Preferences & Search Settings</CardTitle>
              <CardDescription>Set your preferences for finding matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location-based Search */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location-Based Search
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <Label htmlFor="zip_code_pref">Your Zip Code</Label>
                    <Input
                      id="zip_code_pref"
                      value={formData.zip_code || ''}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      placeholder="12345"
                      maxLength={10}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Used for accurate distance calculations
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="distance">Search Distance (miles)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={formData.distance_preference || ''}
                      onChange={(e) => handleInputChange('distance_preference', parseInt(e.target.value) || undefined)}
                      min="1"
                      max="500"
                      placeholder="25"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Find matches within this distance from your zip code
                    </p>
                  </div>
                </div>
              </div>

              {/* Age Preferences */}
              <div className="space-y-4">
                <h4 className="font-medium">Age Range</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age_min">Min Age</Label>
                    <Input
                      id="age_min"
                      type="number"
                      value={formData.age_preference_min || ''}
                      onChange={(e) => handleInputChange('age_preference_min', parseInt(e.target.value) || undefined)}
                      min="18"
                      max="100"
                    />
                  </div>
                
                  <div>
                    <Label htmlFor="age_max">Max Age</Label>
                    <Input
                      id="age_max"
                      type="number"
                      value={formData.age_preference_max || ''}
                      onChange={(e) => handleInputChange('age_preference_max', parseInt(e.target.value) || undefined)}
                      min="18"
                      max="100"
                    />
                  </div>
                </div>
                
              </div>
            </CardContent>
          </Card>

        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
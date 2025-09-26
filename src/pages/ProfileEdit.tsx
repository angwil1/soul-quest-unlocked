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
import { CameraCapture } from '@/components/CameraCapture';
import { ArrowLeft, Upload, X, Camera, MapPin, Search } from 'lucide-react';

// Helper functions for height conversion
const heightToInches = (heightStr: string): number => {
  const match = heightStr.match(/(\d+)'(\d+)"/);
  if (match) {
    const feet = parseInt(match[1]);
    const inches = parseInt(match[2]);
    return feet * 12 + inches;
  }
  return 0;
};

const inchesToHeight = (inches: number): string => {
  if (!inches) return '';
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
};

const ProfileEdit = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile, addPhoto, removePhoto, setAsAvatar } = useProfile();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newInterest, setNewInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

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
    if (field === 'height' && typeof value === 'string' && value) {
      // Convert height string to inches for storage
      const inches = heightToInches(value);
      setFormData(prev => ({ ...prev, [field]: inches }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
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
    console.log('📸 Photo upload triggered!');
    const file = event.target.files?.[0];
    if (file) {
      console.log('📸 File selected:', file.name, file.type, file.size);
      await addPhoto(file);
    } else {
      console.log('📸 No file selected');
    }
  };

  const handleCameraCapture = (file: File) => {
    addPhoto(file);
  };

  const submitProfile = async () => {
    console.log('🔧 Profile form submitProfile called');
    setIsSubmitting(true);

    try {
      const { error } = await updateProfile(formData);
      if (!error) {
        console.log('🔧 Profile saved successfully!');
        navigate('/profile');
      } else {
        console.error('🔧 Profile save error:', error);
      }
    } catch (error) {
      console.error('🔧 Profile save exception:', error);
    }

    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitProfile();
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => navigate('/profile')} className="self-start sm:self-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <div className="flex flex-col items-end">
            <Button type="button" disabled={isSubmitting} onClick={submitProfile}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">All fields required to save</p>
          </div>
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
                
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button variant="outline" size="sm" type="button" className="flex-1 sm:flex-none" onClick={() => {
                    console.log('📤 Upload button clicked!');
                    document.getElementById('avatar-upload')?.click();
                  }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Picture
                    </label>
                  </Button>
                </div>
                
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Additional Photos - only show as grid if more than one photo */}
              {profile?.photos && profile.photos.length > 1 && (
                <div>
                  <h4 className="font-medium mb-2">Additional Photos</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {profile.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Profile photo ${index + 1}`}
                          className="w-full aspect-[3/4] sm:aspect-square object-cover object-center rounded-lg border border-border"
                          loading="lazy"
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
              
              {/* Single photo management - show if exactly one photo */}
              {profile?.photos && profile.photos.length === 1 && (
                <div className="flex flex-col items-center space-y-2">
                  <h4 className="font-medium">Your Photo</h4>
                  <div className="relative group w-24 h-24">
                    <img 
                      src={profile.photos[0]} 
                      alt="Profile photo"
                      className="w-full h-full object-cover object-center rounded-lg border border-border"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removePhoto(profile.photos[0])}
                        className="text-xs p-1 h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
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
                        asChild
                      >
                        <label htmlFor="additional-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </label>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="additional-upload" className="cursor-pointer">
                          <Camera className="h-4 w-4 mr-2" />
                          Camera
                        </label>
                      </Button>
                    </div>
                    <input
                      id="additional-upload"
                      type="file"
                      accept="image/*"
                      capture="environment"
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
                  <Label htmlFor="height">Height</Label>
                  <Select value={formData.height ? inchesToHeight(formData.height as number) : ''} onValueChange={(value) => handleInputChange('height', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="4'8&quot;">4'8"</SelectItem>
                      <SelectItem value="4'9&quot;">4'9"</SelectItem>
                      <SelectItem value="4'10&quot;">4'10"</SelectItem>
                      <SelectItem value="4'11&quot;">4'11"</SelectItem>
                      <SelectItem value="5'0&quot;">5'0"</SelectItem>
                      <SelectItem value="5'1&quot;">5'1"</SelectItem>
                      <SelectItem value="5'2&quot;">5'2"</SelectItem>
                      <SelectItem value="5'3&quot;">5'3"</SelectItem>
                      <SelectItem value="5'4&quot;">5'4"</SelectItem>
                      <SelectItem value="5'5&quot;">5'5"</SelectItem>
                      <SelectItem value="5'6&quot;">5'6"</SelectItem>
                      <SelectItem value="5'7&quot;">5'7"</SelectItem>
                      <SelectItem value="5'8&quot;">5'8"</SelectItem>
                      <SelectItem value="5'9&quot;">5'9"</SelectItem>
                      <SelectItem value="5'10&quot;">5'10"</SelectItem>
                      <SelectItem value="5'11&quot;">5'11"</SelectItem>
                      <SelectItem value="6'0&quot;">6'0"</SelectItem>
                      <SelectItem value="6'1&quot;">6'1"</SelectItem>
                      <SelectItem value="6'2&quot;">6'2"</SelectItem>
                      <SelectItem value="6'3&quot;">6'3"</SelectItem>
                      <SelectItem value="6'4&quot;">6'4"</SelectItem>
                      <SelectItem value="6'5&quot;">6'5"</SelectItem>
                      <SelectItem value="6'6&quot;">6'6"</SelectItem>
                      <SelectItem value="6'7&quot;">6'7"</SelectItem>
                      <SelectItem value="6'8&quot;">6'8"</SelectItem>
                      <SelectItem value="6'9&quot;">6'9"</SelectItem>
                      <SelectItem value="6'10&quot;">6'10"</SelectItem>
                      <SelectItem value="6'11&quot;">6'11"</SelectItem>
                      <SelectItem value="7'0&quot;">7'0"</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="distance_preference">Search Radius</Label>
                  <Select value={formData.distance_preference?.toString() || ''} onValueChange={(value) => handleInputChange('distance_preference', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How far to search?" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border shadow-md z-50">
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="15">15 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                      <SelectItem value="100">100 miles</SelectItem>
                      <SelectItem value="250">250 miles</SelectItem>
                      <SelectItem value="500">500+ miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Select value={formData.occupation || ''} onValueChange={(value) => handleInputChange('occupation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your occupation" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border shadow-md z-50">
                      <SelectItem value="Business & Finance">Business & Finance</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Creative Arts">Creative Arts</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Marketing & Sales">Marketing & Sales</SelectItem>
                      <SelectItem value="Science & Research">Science & Research</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Nonprofit">Nonprofit</SelectItem>
                      <SelectItem value="Hospitality & Tourism">Hospitality & Tourism</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Media & Communications">Media & Communications</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Select value={formData.education || ''} onValueChange={(value) => handleInputChange('education', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border shadow-md z-50">
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Some College">Some College</SelectItem>
                      <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                      <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                      <SelectItem value="PhD/Doctorate">PhD/Doctorate</SelectItem>
                      <SelectItem value="Professional Degree">Professional Degree</SelectItem>
                      <SelectItem value="Trade School">Trade School</SelectItem>
                      <SelectItem value="Certification Program">Certification Program</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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

        </form>
        
        <CameraCapture
          isOpen={showCamera}  
          onClose={() => setShowCamera(false)}
          onCapture={handleCameraCapture}
        />
      </div>
    </div>
  );
};

export default ProfileEdit;

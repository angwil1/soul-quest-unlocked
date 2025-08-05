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
import { ArrowLeft, Upload, X, Camera } from 'lucide-react';

const ProfileEdit = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile, addPhoto, removePhoto, setAsAvatar } = useProfile();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newInterest, setNewInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo mode - allow viewing without authentication

  useEffect(() => {
    if (profile) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await updateProfile(formData);
    
    if (!error) {
      navigate('/profile');
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Loading...</h2>
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
        <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Photos Section */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Add up to 6 photos to show your best self</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Avatar */}
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Profile photo ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setAsAvatar(photo)}
                        >
                          Set as Avatar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removePhoto(photo)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                    placeholder="City, Country"
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
              <CardTitle>Dating Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div>
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={formData.distance_preference || ''}
                    onChange={(e) => handleInputChange('distance_preference', parseInt(e.target.value) || undefined)}
                    min="1"
                    max="500"
                  />
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
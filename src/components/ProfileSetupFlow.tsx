import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Upload, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CameraCapture } from '@/components/CameraCapture';

interface ProfileData {
  name: string;
  age: string;
  location: string;
  occupation: string;
  education: string;
  bio: string;
  interests: string[];
  photos: string[];
  lookingFor: string;
  ageRange: { min: number; max: number };
  distance: number;
  personality: Record<string, string>;
  values: string[];
}

export const ProfileSetupFlow: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    age: '',
    location: '',
    occupation: '',
    education: '',
    bio: '',
    interests: [],
    photos: [],
    lookingFor: 'men',
    ageRange: { min: 18, max: 35 },
    distance: 25,
    personality: {},
    values: []
  });
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [compatibilityQuestions, setCompatibilityQuestions] = useState<any[]>([]);
  const [compatibilityAnswers, setCompatibilityAnswers] = useState<Record<number, string>>({});
  const [showCamera, setShowCamera] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompatibilityQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('id');

        if (error) {
          console.error('Error fetching questions:', error);
        } else {
          const formattedQuestions = (data || []).map(q => ({
            ...q,
            question_type: q.question_type as 'likert' | 'singleSelect',
            options: Array.isArray(q.options) ? q.options as string[] : undefined
          }));
          setCompatibilityQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCompatibilityQuestions();
  }, []);

  // Initialize profile data from user metadata and age verification
  useEffect(() => {
    const initializeProfileData = async () => {
      if (!user) return;
      
      try {
        // Get user metadata from auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser?.user_metadata) {
          const metadata = authUser.user_metadata;
          
          // Update profile data with stored preferences
          setProfileData(prev => ({
            ...prev,
            lookingFor: metadata.looking_for || prev.lookingFor
          }));
        }

        // Fetch age from date of birth in age verification
        const { data: ageVerification } = await supabase
          .from('age_verifications')
          .select('date_of_birth')
          .eq('user_id', user.id)
          .eq('is_verified', true)
          .single();

        if (ageVerification?.date_of_birth) {
          // Calculate age from date of birth
          const birthDate = new Date(ageVerification.date_of_birth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          // Pre-populate age
          setProfileData(prev => ({
            ...prev,
            age: age.toString()
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    initializeProfileData();
  }, [user]);

  const progress = 50; // Static progress since it's one unified form

  const interestOptions = [
    'Travel', 'Photography', 'Cooking', 'Fitness', 'Reading', 'Music',
    'Art', 'Dancing', 'Hiking', 'Movies', 'Gaming', 'Yoga', 'Sports',
    'Wine', 'Coffee', 'Dogs', 'Cats', 'Fashion', 'Technology', 'Science'
  ];

  const occupationOptions = [
    'Business & Finance', 'Technology', 'Healthcare', 'Education', 'Creative Arts',
    'Engineering', 'Legal', 'Marketing & Sales', 'Science & Research', 'Government',
    'Nonprofit', 'Hospitality & Tourism', 'Retail', 'Construction', 'Transportation',
    'Media & Communications', 'Real Estate', 'Consulting', 'Agriculture', 'Self-Employed',
    'Student', 'Retired', 'Other'
  ];

  const educationOptions = [
    'High School', 'Some College', 'Associate Degree', 'Bachelor\'s Degree',
    'Master\'s Degree', 'PhD/Doctorate', 'Professional Degree', 'Trade School',
    'Certification Program', 'Other'
  ];

  const personalityQuestions = [
    {
      id: 'social_energy',
      question: 'How do you recharge?',
      options: [
        { value: 'extrovert', label: 'Being around people energizes me' },
        { value: 'introvert', label: 'I need alone time to recharge' },
        { value: 'ambivert', label: 'I enjoy both social and quiet time' }
      ]
    },
    {
      id: 'communication_style',
      question: 'How do you prefer to communicate?',
      options: [
        { value: 'direct', label: 'Direct and straightforward' },
        { value: 'gentle', label: 'Gentle and considerate' },
        { value: 'playful', label: 'Playful and humorous' }
      ]
    },
    {
      id: 'lifestyle',
      question: 'Your ideal weekend looks like?',
      options: [
        { value: 'adventure', label: 'Exploring new places and experiences' },
        { value: 'cozy', label: 'Relaxing at home with loved ones' },
        { value: 'social', label: 'Hanging out with friends and family' }
      ]
    }
  ];

  const valueOptions = [
    'Family', 'Career Growth', 'Adventure', 'Stability', 'Creativity', 
    'Health & Wellness', 'Spirituality', 'Education', 'Community', 
    'Environmental Care', 'Honesty', 'Loyalty', 'Independence', 'Tradition'
  ];

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleValueToggle = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      values: prev.values.includes(value)
        ? prev.values.filter(v => v !== value)
        : [...prev.values, value]
    }));
  };

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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (profileData.photos.length + files.length > 6) {
      toast({
        title: "Too many photos",
        description: "Maximum 6 photos allowed.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhotos(true);
    
    const newPhotoUrls: string[] = [];
    
    for (const file of files) {
      const photoUrl = await uploadPhoto(file);
      if (photoUrl) {
        newPhotoUrls.push(photoUrl);
      }
    }

    if (newPhotoUrls.length > 0) {
      setProfileData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotoUrls].slice(0, 6)
      }));
      
      toast({
        title: "Photos uploaded",
        description: `${newPhotoUrls.length} photo(s) uploaded successfully.`,
      });
    }

    setUploadingPhotos(false);
  };

  const handleCameraCapture = async (file: File) => {
    console.log('Camera capture received file:', file);
    if (profileData.photos.length >= 6) {
      toast({
        title: "Too many photos",
        description: "Maximum 6 photos allowed.",
        variant: "destructive",
      });
      return;
    }

    setUploadingPhotos(true);
    
    const photoUrl = await uploadPhoto(file);
    if (photoUrl) {
      console.log('Photo uploaded successfully:', photoUrl);
      setProfileData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl].slice(0, 6)
      }));
      
      toast({
        title: "Photo captured",
        description: "Photo captured and uploaded successfully!",
      });
    } else {
      console.error('Failed to upload photo');
    }

    setUploadingPhotos(false);
  };

  const handlePersonalityAnswer = (questionId: string, answer: string) => {
    setProfileData(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        [questionId]: answer
      }
    }));
  };

  const handleCompatibilityAnswer = (questionId: number, value: string) => {
    setCompatibilityAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateForm = () => {
    return (
      profileData.name && 
      profileData.age && 
      profileData.location && 
      profileData.occupation && 
      profileData.education &&
      profileData.bio.length >= 10 &&
      profileData.interests.length >= 3 &&
      profileData.photos.length >= 1 &&
      Object.keys(profileData.personality).length >= personalityQuestions.length &&
      profileData.values.length >= 2 &&
      Object.keys(compatibilityAnswers).length === compatibilityQuestions.length
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    if (!validateForm()) {
      toast({
        title: "Please complete all fields",
        description: "Fill out all required fields to complete your profile setup.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Save profile data to Supabase with photo URLs
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          age: parseInt(profileData.age),
          location: profileData.location,
          occupation: profileData.occupation,
          education: profileData.education,
          bio: profileData.bio,
          interests: profileData.interests,
          photos: profileData.photos, // Save all photo URLs
          looking_for: profileData.lookingFor,
          age_preference_min: profileData.ageRange.min,
          age_preference_max: profileData.ageRange.max,
          distance_preference: profileData.distance,
          personality_type: JSON.stringify(profileData.personality),
          communication_style: profileData.personality.communication_style || 'friendly',
          avatar_url: profileData.photos[0] || '', // Set first photo as avatar
          values: profileData.values,
          created_at: new Date().toISOString()
        });

       if (error) throw error;

      // Save quiz answers and mark quiz as completed
      if (compatibilityAnswers && Object.keys(compatibilityAnswers).length > 0) {
        await supabase
          .from('user_events')
          .insert({
            user_id: user.id,
            event_type: 'quiz_completed',
            event_data: compatibilityAnswers
          });
      }

      toast({
        title: "Profile completed! 🎉",
        description: "Your profile and compatibility quiz are complete!",
      });

      // Navigate to quiz results page
      navigate('/quiz-results');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Fill out all sections below to create your complete profile and compatibility quiz
          </p>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="What should we call you?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Select 
                    value={profileData.age} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, age: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={profileData.age || "Select your age"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 62 }, (_, i) => i + 18).map(age => (
                        <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {profileData.age && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Auto-filled from your date of birth
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Select onValueChange={(value) => setProfileData(prev => ({ ...prev, occupation: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupationOptions.map(occupation => (
                        <SelectItem key={occupation} value={occupation}>{occupation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="education">Education *</Label>
                  <Select onValueChange={(value) => setProfileData(prev => ({ ...prev, education: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationOptions.map(education => (
                        <SelectItem key={education} value={education}>{education}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About You */}
          <Card>
            <CardHeader>
              <CardTitle>Tell Your Story</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="bio">About You * (minimum 10 characters)</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself - your interests, what makes you unique..."
                  className="mt-1 min-h-[120px]"
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {profileData.bio.length}/500 characters
                </p>
              </div>

              <div className="mt-6">
                <Label htmlFor="lookingFor">What are you looking for?</Label>
                <Select value={profileData.lookingFor} onValueChange={(value) => setProfileData(prev => ({ ...prev, lookingFor: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="anyone">Anyone</SelectItem>
                    <SelectItem value="non-binary">Non-binary people</SelectItem>
                    <SelectItem value="transgender-women">Transgender Women</SelectItem>
                    <SelectItem value="transgender-men">Transgender Men</SelectItem>
                    <SelectItem value="lgbtq-community">LGBTQ+ Community</SelectItem>
                    <SelectItem value="casual-friends">Casual friends</SelectItem>
                    <SelectItem value="activity-partners">Activity partners</SelectItem>
                    <SelectItem value="travel-buddies">Travel buddies</SelectItem>
                    <SelectItem value="serious-relationship">Serious relationship</SelectItem>
                    <SelectItem value="casual-dating">Casual dating</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This helps us find your ideal matches
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
              <CardDescription>Select at least 3 things you love (select up to 10)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <Badge
                    key={interest}
                    variant={profileData.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Selected: {profileData.interests.length}/10
              </p>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Add Your Photos
              </CardTitle>
              <CardDescription>Add at least 1 photo (up to 6 total)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profileData.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img src={photo} alt={`Profile ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                
                {profileData.photos.length < 6 && (
                  <>
                    <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                        disabled={uploadingPhotos}
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer text-center p-2">
                        <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground text-center">Upload Photo</p>
                      </label>
                    </div>

                    <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCamera(true)}
                        className="h-full w-full flex-col gap-1"
                        disabled={uploadingPhotos}
                      >
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground text-center">Take Photo</p>
                      </Button>
                    </div>
                  </>
                )}
              </div>
              
              {uploadingPhotos && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Uploading photos...
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-4">
                Added: {profileData.photos.length}/6 photos (minimum 1 required)
              </p>
            </CardContent>
          </Card>

          {/* Personality Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Personality Questions</CardTitle>
              <CardDescription>Help us understand your personality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {personalityQuestions.map(question => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">{question.question}</Label>
                  <div className="space-y-2">
                    {question.options.map(option => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={profileData.personality[question.id] === option.value}
                          onChange={(e) => handlePersonalityAnswer(question.id, e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          profileData.personality[question.id] === option.value
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground'
                        }`} />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Values */}
          <Card>
            <CardHeader>
              <CardTitle>Your Values</CardTitle>
              <CardDescription>Select at least 2 values that are important to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {valueOptions.map(value => (
                  <Badge
                    key={value}
                    variant={profileData.values.includes(value) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleValueToggle(value)}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Selected: {profileData.values.length} values
              </p>
            </CardContent>
          </Card>

          {/* Compatibility Quiz */}
          <Card>
            <CardHeader>
              <CardTitle>Compatibility Quiz</CardTitle>
              <CardDescription>Answer these questions to help us find your best matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {compatibilityQuestions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">
                    Question {index + 1}: {question.Text}
                  </Label>
                  <div className="space-y-2">
                    {question.question_type === 'likert' ? (
                      // Likert scale options
                      <>
                        {[
                          { value: 'strongly_disagree', label: 'Strongly Disagree' },
                          { value: 'disagree', label: 'Disagree' },
                          { value: 'neutral', label: 'Neutral' },
                          { value: 'agree', label: 'Agree' },
                          { value: 'strongly_agree', label: 'Strongly Agree' }
                        ].map(option => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question_${question.id}`}
                              value={option.value}
                              checked={compatibilityAnswers[question.id] === option.value}
                              onChange={(e) => handleCompatibilityAnswer(question.id, e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              compatibilityAnswers[question.id] === option.value
                                ? 'bg-primary border-primary'
                                : 'border-muted-foreground'
                            }`} />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </>
                    ) : (
                      // Multiple choice options
                      question.options?.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question_${question.id}`}
                            value={option}
                            checked={compatibilityAnswers[question.id] === option}
                            onChange={(e) => handleCompatibilityAnswer(question.id, e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            compatibilityAnswers[question.id] === option
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          }`} />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center py-8">
            <Button 
              size="lg" 
              onClick={handleComplete}
              disabled={loading || !validateForm()}
              className="px-8"
            >
              {loading ? 'Completing Profile...' : 'Complete Profile & Quiz'}
            </Button>
            
            {!validateForm() && (
              <p className="text-sm text-muted-foreground mt-2">
                Please complete all required fields above
              </p>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <CameraCapture
            isOpen={showCamera}
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Camera, Upload, Heart, Star, MapPin, Calendar, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CameraCapture } from '@/components/CameraCapture';

interface ProfileData {
  name: string;
  age: string;
  location: string;
  bio: string;
  interests: string[];
  photos: string[];  // Changed from File[] to string[] for photo URLs
  lookingFor: string;
  ageRange: { min: number; max: number };
  distance: number;
  personality: Record<string, string>;
  values: string[];
}

export const ProfileSetupFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    age: '',
    location: '',
    bio: '',
    interests: [],
    photos: [],
    lookingFor: 'serious-relationship',
    ageRange: { min: 18, max: 35 },
    distance: 25,
    personality: {},
    values: []
  });
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [hasCompletedMainQuiz, setHasCompletedMainQuiz] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user completed main compatibility quiz and skip personality step
  useEffect(() => {
    const checkQuizCompletion = async () => {
      if (!user) return;

      try {
        // Check if user has completed the main compatibility quiz
        const { data: quizData } = await supabase
          .from('user_events')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_type', 'quiz_completed')
          .limit(1);
        
        const hasCompletedQuiz = quizData && quizData.length > 0;
        setHasCompletedMainQuiz(hasCompletedQuiz);
        
        // If user has completed the quiz, skip the personality step (step 5)
        if (hasCompletedQuiz && currentStep === 5) {
          setCurrentStep(6); // Skip to values step
          toast({
            title: "Personality questions skipped",
            description: "Since you already completed the compatibility quiz, we'll use those results for your personality profile!",
          });
        }
      } catch (error) {
        console.error('Error checking quiz completion:', error);
      }
    };

    checkQuizCompletion();
  }, [currentStep, user, toast]);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const interestOptions = [
    'Travel', 'Photography', 'Cooking', 'Fitness', 'Reading', 'Music',
    'Art', 'Dancing', 'Hiking', 'Movies', 'Gaming', 'Yoga', 'Sports',
    'Wine', 'Coffee', 'Dogs', 'Cats', 'Fashion', 'Technology', 'Science'
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  const validateStep = () => {
    const isValid = (() => {
      switch (currentStep) {
        case 1:
          return profileData.name && profileData.age && profileData.location;
        case 2:
          return profileData.bio.length >= 20;
        case 3:
          return profileData.interests.length >= 3;
        case 4:
          return profileData.photos.length >= 2;
        case 5:
          // If user completed main quiz, personality questions are optional
          return hasCompletedMainQuiz || Object.keys(profileData.personality).length >= personalityQuestions.length;
        case 6:
          return profileData.values.length >= 3;
        default:
          return true;
      }
    })();
    
    // Debug logging
    console.log('Profile Setup Debug:', {
      currentStep,
      isValid,
      hasCompletedMainQuiz,
      profileData: {
        bioLength: profileData.bio.length,
        interestsCount: profileData.interests.length,
        photosCount: profileData.photos.length,
        personalityAnswers: Object.keys(profileData.personality).length,
        valuesCount: profileData.values.length
      }
    });
    
    return isValid;
  };

  const handleComplete = async () => {
    if (!user) return;

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
          created_at: new Date().toISOString()
        });

       if (error) throw error;

      console.log('✅ Profile setup saved');

      // Navigate to matches page
      navigate('/matches');
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Let's start with the basics</h2>
              <p className="text-muted-foreground">Tell us a little about yourself</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="What should we call you?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Select onValueChange={(value) => setProfileData(prev => ({ ...prev, age: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your age" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 62 }, (_, i) => i + 18).map(age => (
                      <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Tell your story</h2>
              <p className="text-muted-foreground">Share what makes you unique</p>
            </div>

            <div>
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Share your interests, what you're passionate about, and what you're looking for in a relationship..."
                className="mt-1 min-h-[120px]"
                maxLength={500}
              />
              <div className="text-right text-sm mt-1">
                <span className={profileData.bio.length >= 20 ? "text-green-600" : "text-muted-foreground"}>
                  {profileData.bio.length}/500 characters (minimum 20 required)
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="looking-for">Looking For</Label>
              <Select 
                value={profileData.lookingFor}
                onValueChange={(value) => setProfileData(prev => ({ ...prev, lookingFor: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serious-relationship">Serious Relationship</SelectItem>
                  <SelectItem value="casual-dating">Casual Dating</SelectItem>
                  <SelectItem value="friendship">Friendship First</SelectItem>
                  <SelectItem value="open-to-all">Open to All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What do you love?</h2>
              <p className="text-muted-foreground">Choose at least 3 interests</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interestOptions.map(interest => (
                <Badge
                  key={interest}
                  variant={profileData.interests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer p-3 text-center hover:scale-105 transition-transform"
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Selected: {profileData.interests.length} (need at least 3)
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Show your best self</h2>
              <p className="text-muted-foreground">Add at least 2 photos (up to 6)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-square border-2 border-dashed border-muted rounded-lg flex items-center justify-center relative">
                  {profileData.photos[index] ? (
                    <>
                      <img
                        src={profileData.photos[index]}
                        alt={`Profile ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setProfileData(prev => ({
                            ...prev,
                            photos: prev.photos.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Main
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-4 w-full h-full">
                      {uploadingPhotos ? (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-primary animate-pulse mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground text-center">Add Photo</span>
                          <div className="flex flex-col gap-2 w-full">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                console.log('Camera button clicked!');
                                console.log('Navigator.mediaDevices available:', !!navigator.mediaDevices);
                                console.log('getUserMedia available:', !!navigator.mediaDevices?.getUserMedia);
                                console.log('Current protocol:', window.location.protocol);
                                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                                  setShowCamera(true);
                                } else {
                                  const input = document.getElementById(`photo-upload-${index}`) as HTMLInputElement | null;
                                  if (input) {
                                    input.setAttribute('capture', 'user');
                                    input.click();
                                  }
                                }
                              }}
                              disabled={uploadingPhotos}
                              className="w-full"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Take Photo
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                console.log('Upload button clicked!');
                                document.getElementById(`photo-upload-${index}`)?.click();
                              }}
                              disabled={uploadingPhotos}
                              className="w-full"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload File
                            </Button>
                          </div>
                        </>
                      )}
                      <input
                        id={`photo-upload-${index}`}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhotos}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Photos: {profileData.photos.length}/6 (need at least 2)
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Let's understand you better</h2>
              <p className="text-muted-foreground">Answer these quick questions</p>
            </div>

            <div className="space-y-6">
              {personalityQuestions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="font-medium">{index + 1}. {question.question}</h3>
                  <div className="space-y-2">
                    {question.options.map(option => (
                      <Button
                        key={option.value}
                        variant={profileData.personality[question.id] === option.value ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto py-3 px-4"
                        onClick={() => handlePersonalityAnswer(question.id, option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What matters to you?</h2>
              <p className="text-muted-foreground">Choose your core values (select at least 3)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {valueOptions.map(value => (
                <Badge
                  key={value}
                  variant={profileData.values.includes(value) ? "default" : "outline"}
                  className="cursor-pointer p-3 text-center hover:scale-105 transition-transform"
                  onClick={() => handleValueToggle(value)}
                >
                  {value}
                </Badge>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Selected: {profileData.values.length} values (need at least 3)
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-3">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-lg sm:text-xl">Complete Your Profile</CardTitle>
            </div>
            <Progress value={progress} className="w-full mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </CardHeader>

          <CardContent>
            {renderStep()}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <div className="flex flex-col items-center sm:items-end">
                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleComplete}
                    disabled={!validateStep() || loading || uploadingPhotos}
                    className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  >
                    {loading ? (
                      "Saving..."
                    ) : uploadingPhotos ? (
                      "Uploading Photos..."
                    ) : (
                      <>
                        Complete Profile
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className="w-full sm:w-auto"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-1 text-center sm:text-right">
                  All fields required to save
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={handleCameraCapture}
        />
      </div>
    </div>
  );
};
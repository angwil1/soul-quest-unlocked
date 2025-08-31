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

interface ProfileData {
  name: string;
  age: string;
  location: string;
  bio: string;
  interests: string[];
  photos: File[];
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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProfileData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 6) // Max 6 photos
    }));
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
    switch (currentStep) {
      case 1:
        return profileData.name && profileData.age && profileData.location;
      case 2:
        return profileData.bio.length >= 50;
      case 3:
        return profileData.interests.length >= 3;
      case 4:
        return profileData.photos.length >= 2;
      case 5:
        return Object.keys(profileData.personality).length >= personalityQuestions.length;
      case 6:
        return profileData.values.length >= 3;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Save profile data to Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          age: parseInt(profileData.age),
          location: profileData.location,
          bio: profileData.bio,
          interests: profileData.interests,
          looking_for: profileData.lookingFor,
          age_preference_min: profileData.ageRange.min,
          age_preference_max: profileData.ageRange.max,
          distance_preference: profileData.distance,
          personality_type: JSON.stringify(profileData.personality),
          communication_style: profileData.personality.communication_style || 'friendly',
          avatar_url: '', // Will be handled separately for photo uploads
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Complete! 🎉",
        description: "Welcome to AI Complete Me. Let's find your perfect match!",
      });

      // Navigate based on subscription status
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
              <div className="text-right text-sm text-muted-foreground mt-1">
                {profileData.bio.length}/500 characters (minimum 50)
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
                <div key={index} className="aspect-square border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
                  {profileData.photos[index] ? (
                    <img
                      src={URL.createObjectURL(profileData.photos[index])}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 p-4">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
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
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <CardTitle>Complete Your Profile</CardTitle>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </CardHeader>

          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={handleComplete}
                  disabled={!validateStep() || loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    "Saving..."
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
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReportUser } from '@/components/ReportUser';
import { BlockUser } from '@/components/BlockUser';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Heart, Shield, MapPin, Briefcase } from 'lucide-react';

const SampleUserProfile = () => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // Sample user data to demonstrate safety features
  const sampleUser = {
    id: "sample-user-123",
    name: "Taylor Chen",
    age: 26,
    bio: "Love exploring new cities, trying different cuisines, and weekend hiking trips. Looking for someone genuine to share adventures with!",
    location: "Portland, OR",
    occupation: "Software Engineer",
    interests: ["Hiking", "Photography", "Cooking", "Travel", "Tech", "Art"],
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b6c5?w=400",
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400"
    ],
    verified: true
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleMessage = () => {
    // In a real app, this would navigate to chat
    alert("Message feature would open here!");
  };

  const handleBlock = () => {
    navigate('/sample-profiles');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/sample-profiles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profiles
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Age Verified
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Photos */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Main Photo */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={sampleUser.photos[0]} 
                      alt={sampleUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Additional Photos */}
                  {sampleUser.photos.slice(1).map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={photo} 
                        alt={`${sampleUser.name} photo ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{sampleUser.name}, {sampleUser.age}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {sampleUser.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {sampleUser.occupation}
                      </div>
                    </div>
                  </div>
                  {sampleUser.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {sampleUser.bio}
                </p>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sampleUser.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={handleLike}
                className={`flex-1 ${isLiked ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked!' : 'Like'}
              </Button>
              
              <Button 
                onClick={handleMessage}
                variant="outline"
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>

            {/* Safety Actions */}
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Shield className="h-5 w-5" />
                  Safety Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <ReportUser 
                    reportedUserId={sampleUser.id}
                    reportedUserName={sampleUser.name}
                  />
                  <BlockUser 
                    blockedUserId={sampleUser.id}
                    blockedUserName={sampleUser.name}
                    onBlock={handleBlock}
                  />
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-3">
                  Use these tools if this user makes you uncomfortable or violates community guidelines.
                </p>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Safety Reminder</p>
                    <p>Always meet in public places, tell a friend your plans, and trust your instincts. Your safety is our priority.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleUserProfile;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReportUser } from '@/components/ReportUser';
import { BlockUser } from '@/components/BlockUser';
import { SaveToVaultButton } from '@/components/SaveToVaultButton';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Heart, Shield, MapPin, Briefcase, Eye } from 'lucide-react';
import { founderCuratedProfiles } from '@/data/sampleProfiles';

const SampleUserProfile = () => {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [isLiked, setIsLiked] = useState(false);

  // Find the profile from the sample data
  const profile = founderCuratedProfiles.find(p => p.id === profileId);

  // Fallback if profile not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/browse')}>
            Back to Browse
          </Button>
        </Card>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleMessage = () => {
    // In a real app, this would navigate to chat
    alert("Message feature would open here!");
  };

  const handleBlock = () => {
    navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/browse')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Sample Profile
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
                   {/* Main Photo - Responsive */}
                  <div className="aspect-[3/4] sm:aspect-square rounded-lg overflow-hidden bg-muted">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative cursor-pointer group">
                          <img 
                            src={profile.photos[0]} 
                            alt={profile.name}
                            className="w-full h-full object-cover object-center"
                            loading="eager"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full">
                        <img 
                          src={profile.photos[0]} 
                          alt={profile.name}
                          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {/* Additional Photos - Responsive Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-4">
                    {profile.photos.slice(1).map((photo, index) => (
                      <div key={index} className="aspect-[3/4] sm:aspect-square rounded-lg overflow-hidden bg-muted">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="relative cursor-pointer group">
                              <img 
                                src={photo} 
                                alt={`${profile.name} photo ${index + 2}`}
                                className="w-full h-full object-cover object-center"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] max-h-[90vh] w-full">
                            <img 
                              src={photo} 
                              alt={`${profile.name} photo ${index + 2}`}
                              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </div>
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
                    <CardTitle className="text-2xl">{profile.name}, {profile.age}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {profile.occupation}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SaveToVaultButton
                      type="match"
                      data={{
                        matched_user_id: profile.id,
                        notes: `${profile.name} - Sample Profile`,
                        tags: ['sample-profile', 'viewed']
                      }}
                      variant="outline"
                      size="sm"
                      className="h-8"
                    />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Sample Profile
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio}
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
                  {profile.interests.map((interest) => (
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
                    reportedUserId={profile.id}
                    reportedUserName={profile.name}
                  />
                  <BlockUser 
                    blockedUserId={profile.id}
                    blockedUserName={profile.name}
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
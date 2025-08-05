import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Briefcase, Heart } from 'lucide-react';
import alexProfileMain from '@/assets/alex-profile-main.jpg';
import alexProfilePhotography from '@/assets/alex-profile-photography.jpg';

const Profile = () => {
  const navigate = useNavigate();

  // Demo profile data
  const profile = {
    name: "Alex Johnson",
    age: 28,
    bio: "Adventure seeker and coffee enthusiast. Love hiking, photography, and exploring new places. Looking for genuine connections and someone to share new experiences with.",
    location: "San Francisco, CA",
    occupation: "Product Designer",
    interests: ["Photography", "Hiking", "Coffee", "Travel", "Music", "Art"],
    photos: [
      alexProfileMain,
      alexProfilePhotography
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => navigate('/profile/edit')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
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
                      src={profile.photos[0]} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Additional Photos */}
                  <div className="grid grid-cols-2 gap-2">
                    {profile.photos.slice(1).map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={photo} 
                          alt={`Photo ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  {profile.name}, {profile.age}
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                    ✨ Demo Profile
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{profile.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.occupation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/matches')} 
                  className="w-full"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Find Matches
                </Button>
                
                <Button 
                  onClick={() => navigate('/sample-profiles')} 
                  variant="outline" 
                  className="w-full"
                >
                  View Sample Profiles
                </Button>
                
                <Button 
                  onClick={() => navigate('/questions')} 
                  variant="outline" 
                  className="w-full"
                >
                  Take Compatibility Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
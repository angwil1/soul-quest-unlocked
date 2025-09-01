import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShippingProgressTracker } from '@/components/ShippingProgressTracker';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Briefcase, Heart } from 'lucide-react';
import profileSilhouette from '@/assets/profile-silhouette.jpg';
import { useProfile } from '@/hooks/useProfile';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  if (loading) {
    return <PageLoadingSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No profile found</p>
            <Button onClick={() => navigate('/profile/edit')}>
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                {/* Single photo - compact display */}
                {(!profile.photos || profile.photos.length <= 1) && (
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={profile.avatar_url || profile.photos?.[0] || profileSilhouette} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                {/* Multiple photos - full layout */}
                {profile.photos && profile.photos.length > 1 && (
                  <div className="space-y-4">
                    {/* Main Photo */}
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted mx-auto">
                      <img 
                        src={profile.avatar_url || profile.photos[0]} 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Additional Photos */}
                    <div className="grid grid-cols-3 gap-2 justify-center">
                      {profile.photos.slice(1).map((photo, index) => (
                        <div key={index} className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  {profile.name || 'Your Profile'}{profile.age ? `, ${profile.age}` : ''}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio && (
                  <p className="text-muted-foreground">{profile.bio}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.occupation && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.occupation}</span>
                    </div>
                  )}
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
                  {profile.interests?.length ? (
                    profile.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No interests added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Progress Tracker */}
            <ShippingProgressTracker />

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
                  onClick={() => navigate('/browse-profiles')} 
                  variant="outline" 
                  className="w-full"
                >
                  Explore Sample Profiles
                </Button>
                
                <Button 
                  onClick={() => navigate('/matches')} 
                  variant="outline" 
                  className="w-full"
                >
                  Explore Community Features
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
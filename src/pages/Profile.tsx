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
            <Button 
              onClick={() => navigate('/profile/edit')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Create your profile to get started"
            >
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <header className="bg-card border-b" role="banner">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Go back to homepage"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back
          </Button>
          <Button 
            onClick={() => navigate('/profile/edit')}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Edit your profile information"
          >
            <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
            Edit Profile
          </Button>
        </div>
      </header>

      <main 
        id="main-content"
        className="max-w-4xl mx-auto px-4 py-8"
        role="main"
        aria-labelledby="profile-heading"
      >
        <h1 id="profile-heading" className="sr-only">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Photos */}
          <aside className="lg:col-span-1" role="complementary" aria-labelledby="photos-heading">
            <h2 id="photos-heading" className="sr-only">Profile Photos</h2>
            
            {/* Compact card for single photo */}
            {(!profile.photos || profile.photos.length <= 1) && (
              <Card className="w-fit mx-auto">
                <CardContent className="p-3">
                  <div className="w-20 h-28 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={profile.avatar_url || profile.photos?.[0] || profileSilhouette} 
                      alt={`${profile.name || 'Your'} profile photo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Full size card for multiple photos */}
            {profile.photos && profile.photos.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Main Photo */}
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted mx-auto">
                      <img 
                        src={profile.avatar_url || profile.photos[0]} 
                        alt={`${profile.name || 'Your'} main profile photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Additional Photos */}
                    <div className="grid grid-cols-3 gap-2 justify-center" role="group" aria-label="Additional profile photos">
                      {profile.photos.slice(1).map((photo, index) => (
                        <div key={index} className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={photo} 
                            alt={`${profile.name || 'Your'} profile photo ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Profile Details */}
          <section className="lg:col-span-2 space-y-6" aria-labelledby="details-heading">
            <h2 id="details-heading" className="sr-only">Profile Details</h2>
            
            {/* Basic Info */}
            <Card role="region" aria-labelledby="basic-info-title">
              <CardHeader>
                <CardTitle id="basic-info-title" className="flex items-center gap-2 flex-wrap">
                  {profile.name || 'Your Profile'}{profile.age ? `, ${profile.age}` : ''}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio && (
                  <div>
                    <h3 className="sr-only">Biography</h3>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.location && (
                    <div className="flex items-center gap-2" role="group" aria-label="Location information">
                      <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.occupation && (
                    <div className="flex items-center gap-2" role="group" aria-label="Occupation information">
                      <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span>{profile.occupation}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card role="region" aria-labelledby="interests-title">
              <CardHeader>
                <CardTitle id="interests-title">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Your interests">
                  {profile.interests?.length ? (
                    profile.interests.map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        tabIndex={0}
                      >
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
            <Card role="region" aria-labelledby="actions-title">
              <CardHeader>
                <CardTitle id="actions-title">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/matches')} 
                  className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Find and browse potential matches"
                >
                  <Heart className="h-4 w-4 mr-2" aria-hidden="true" />
                  Find Matches
                </Button>
                
                <Button 
                  onClick={() => navigate('/browse-profiles')} 
                  variant="outline" 
                  className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Explore sample profiles to see examples"
                >
                  Explore Sample Profiles
                </Button>
                
                <Button 
                  onClick={() => navigate('/matches')} 
                  variant="outline" 
                  className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Discover community features and connect with others"
                >
                  Explore Community Features
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Accessibility Information */}
        <section className="mt-16 p-6 bg-muted/50 rounded-lg" aria-labelledby="accessibility-info">
          <h2 id="accessibility-info" className="text-xl font-semibold mb-3 text-foreground">
            Accessibility Features
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            This profile page is designed to be accessible to all users, including those using assistive technologies.
          </p>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Screen Readers:</span>
              <span>All content is properly labeled and structured for assistive technology</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Navigation:</span>
              <span>Use Tab to navigate, Enter/Space to activate buttons and links</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-0 flex-shrink-0">Images:</span>
              <span>All profile photos include descriptive alternative text</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
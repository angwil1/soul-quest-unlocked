// Profile Page - Main user profile view (v2.1)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShippingProgressTracker } from '@/components/ShippingProgressTracker';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Briefcase, Heart, Settings, Share2, Eye, Users, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import profileSilhouette from '@/assets/profile-silhouette.jpg';
import { useProfile } from '@/hooks/useProfile';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading } = useProfile();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    let completed = 0;
    const totalFields = 6;
    
    if (profile.name) completed++;
    if (profile.bio) completed++;
    if (profile.location) completed++;
    if (profile.occupation) completed++;
    if (profile.interests?.length) completed++;
    if (profile.photos?.length || profile.avatar_url) completed++;
    
    return Math.round((completed / totalFields) * 100);
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.name || 'User'}'s Profile - AI Complete Me`,
        text: `Check out ${profile?.name || 'this user'}'s profile on AI Complete Me`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Could add toast notification here
    }
  };

  if (authLoading || loading) {
    return <PageLoadingSkeleton />;
  }

  // Don't render anything if redirecting to auth
  if (!user) {
    return null;
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Mobile Layout - Single Row */}
          <div className="flex md:hidden items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
              <span className="hidden xs:inline">Back</span>
            </Button>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/matches')}
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2 px-2"
                aria-label="View your matches"
              >
                <Users className="h-4 w-4 xs:mr-1" aria-hidden="true" />
                <span className="hidden xs:inline">Matches</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/browse')}
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2 px-2"
                aria-label="Browse and discover people"
              >
                <Eye className="h-4 w-4 xs:mr-1" aria-hidden="true" />
                <span className="hidden xs:inline">Browse</span>
              </Button>
              
              <Button 
                onClick={() => navigate('/profile/edit')}
                size="sm"
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2 px-2"
                aria-label="Edit your profile information"
              >
                <Edit className="h-4 w-4 xs:mr-1" aria-hidden="true" />
                <span className="hidden xs:inline">Edit</span>
              </Button>
              
              <DropdownMenu open={isShareMenuOpen} onOpenChange={setIsShareMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2 px-2"
                    aria-label="More profile options"
                    aria-expanded={isShareMenuOpen}
                  >
                    <MoreVertical className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={handleShareProfile}
                    className="flex items-center gap-2 focus:bg-muted cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    Share Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/privacy')}
                    className="flex items-center gap-2 focus:bg-muted cursor-pointer"
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Privacy Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => navigate('/faq')}
                    className="flex items-center gap-2 focus:bg-muted cursor-pointer"
                  >
                    Help & FAQ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back
            </Button>
            
            <div className="flex items-center gap-6">
              {/* Navigation Buttons */}
              <nav className="flex items-center gap-3" role="navigation" aria-label="Profile navigation">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/matches')}
                  className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[120px]"
                  aria-label="View your matches"
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Matches
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/browse')}
                  className="flex items-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[120px]"
                  aria-label="Browse and discover people"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Browse
                </Button>
              </nav>
              
              {/* Profile Actions */}
              <div className="flex items-center gap-2 border-l border-border pl-6" role="group" aria-label="Profile actions">
                <Button 
                  onClick={() => navigate('/profile/edit')}
                  className="focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[110px]"
                  aria-label="Edit your profile information"
                >
                  <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                  Edit Profile
                </Button>
                
                <DropdownMenu open={isShareMenuOpen} onOpenChange={setIsShareMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
                      aria-label="More profile options"
                      aria-expanded={isShareMenuOpen}
                    >
                      <MoreVertical className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={handleShareProfile}
                      className="flex items-center gap-2 focus:bg-muted cursor-pointer"
                    >
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                      Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/privacy')}
                      className="flex items-center gap-2 focus:bg-muted cursor-pointer"
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                      Privacy Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigate('/faq')}
                      className="flex items-center gap-2 focus:bg-muted cursor-pointer"
                    >
                      Help & FAQ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
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
            
            {/* Profile Completion Progress */}
            <Card role="region" aria-labelledby="completion-title">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle id="completion-title" className="text-lg">Profile Completion</CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {calculateProfileCompletion()}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress 
                    value={calculateProfileCompletion()} 
                    className="h-2"
                    aria-label={`Profile is ${calculateProfileCompletion()}% complete`}
                  />
                  <p className="text-sm text-muted-foreground">
                    {calculateProfileCompletion() === 100 
                      ? "🎉 Your profile is complete! You're ready to find amazing matches."
                      : calculateProfileCompletion() >= 80
                      ? "Almost there! A few more details will help you get better matches."
                      : "Complete your profile to improve match quality and visibility."
                    }
                  </p>
                  {calculateProfileCompletion() < 100 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate('/profile/edit')}
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Continue completing your profile"
                    >
                      Complete Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
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
                  onClick={() => navigate('/browse')} 
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useEchoSubscription } from '@/hooks/useEchoSubscription';
import { useSubscription } from '@/hooks/useSubscription';
import { TikTokProfileEmbed } from '@/components/TikTokProfileEmbed';
import { VibeGallery } from '@/components/VibeGallery';
import { EchoBadgeToggle } from '@/components/EchoBadgeToggle';
import { ArrowLeft, Edit, MapPin, Briefcase, GraduationCap, Heart, Settings } from 'lucide-react';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading } = useProfile();
  const { subscription, loading: subscriptionLoading, manageBilling } = useSubscription();
  const { isEchoActive } = useEchoSubscription();
  const navigate = useNavigate();

  console.log('Profile page - authLoading:', authLoading, 'user:', user, 'profile:', profile, 'loading:', loading);

  // Temporarily return a simple test render
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-white text-2xl">Profile Page Test - Are you seeing this?</div>
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl">Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile not found</CardTitle>
            <CardDescription>There was an issue loading your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profile.date_of_birth);

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
                  {/* Main Avatar */}
                  <div className="flex justify-center">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl">
                        {profile.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Additional Photos */}
                  {profile.photos && profile.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {profile.photos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img 
                            src={photo} 
                            alt={`Profile photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
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
                  {profile.name || 'Anonymous'}
                  {age && <span className="text-muted-foreground">, {age}</span>}
                  
                  {/* Subscription Tier Badge */}
                  {subscription?.subscribed && subscription.subscription_tier === 'Pro' && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      <span className="text-xs">🔮 Unlocked Beyond</span>
                    </Badge>
                  )}
                  
                  {subscription?.subscribed && subscription.subscription_tier === 'Premium' && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <span className="text-xs">💬 Unlocked+</span>
                    </Badge>
                  )}
                  
                  {/* Echo Badge */}
                  {profile?.echo_badge_enabled && isEchoActive && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                      <span className="text-xs">✨ Echo</span>
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio && (
                  <p className="text-muted-foreground">{profile.bio}</p>
                )}

                {/* Quick Info */}
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
                  
                  {profile.education && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.education}</span>
                    </div>
                  )}
                  
                  {profile.looking_for && (
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{profile.looking_for}</span>
                    </div>
                  )}
                </div>

                {profile.height && (
                  <div>
                    <span className="text-sm text-muted-foreground">Height: </span>
                    <span>{Math.floor(profile.height / 100)}'{(profile.height % 100 * 0.39).toFixed(0)}"</span>
                    <span className="text-muted-foreground ml-1">({profile.height}cm)</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
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
            )}

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!subscriptionLoading && subscription ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={subscription.subscribed ? "default" : "secondary"}>
                        {subscription.subscribed ? "Active" : "Free"}
                      </Badge>
                    </div>
                    
                    {subscription.subscribed && subscription.subscription_tier && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Plan:</span>
                        <div className="flex items-center gap-2">
                          {subscription.subscription_tier === 'Pro' && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                              🔮 Unlocked Beyond
                            </Badge>
                          )}
                          {subscription.subscription_tier === 'Premium' && (
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                              💬 Unlocked+
                            </Badge>
                          )}
                          {!subscription.subscription_tier.includes('Pro') && !subscription.subscription_tier.includes('Premium') && (
                            <span className="font-medium">{subscription.subscription_tier}</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Echo Subscription Status */}
                    {isEchoActive && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Add-on:</span>
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                          ✨ Echo Active
                        </Badge>
                      </div>
                    )}
                    
                    {subscription.subscribed && subscription.subscription_end && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Renews:</span>
                        <span className="text-sm">
                          {new Date(subscription.subscription_end).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {subscription.subscribed ? (
                        <Button onClick={manageBilling} variant="outline" size="sm">
                          Manage Billing
                        </Button>
                      ) : (
                        <Button onClick={() => navigate('/pricing')} size="sm">
                          Upgrade Plan
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <span className="text-muted-foreground">Loading subscription...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.age_preference_min && profile.age_preference_max && (
                  <div>
                    <span className="text-sm text-muted-foreground">Age range: </span>
                    <span>{profile.age_preference_min} - {profile.age_preference_max} years</span>
                  </div>
                )}
                {profile.distance_preference && (
                  <div>
                    <span className="text-sm text-muted-foreground">Distance: </span>
                    <span>Within {profile.distance_preference} km</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Echo Features */}
            {profile?.echo_badge_enabled && (
              <>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    Echo Features
                  </h3>
                  
                  <TikTokProfileEmbed isEditMode={true} />
                  
                  <VibeGallery isOwnProfile={true} userId={user?.id} />
                </div>
              </>
            )}

            {/* Echo Settings */}
            <EchoBadgeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
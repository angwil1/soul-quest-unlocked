import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import { useProfile } from '@/hooks/useProfile';
import { Search, MapPin, Users, Heart, Settings, Filter } from 'lucide-react';

const Matches = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Find Your Match</h1>
            <p className="text-muted-foreground">
              Discover compatible people using distance-based search
            </p>
          </div>
          <Button onClick={() => navigate('/profile/edit')}>
            <Settings className="h-4 w-4 mr-2" />
            Search Settings
          </Button>
        </div>

        {/* Search Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/match-search')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Distance-Based Search
              </CardTitle>
              <CardDescription>
                Find matches within your specified distance using zip codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>
                    Your Zip: <strong>{profile?.zip_code || 'Not set'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Filter className="h-4 w-4 text-primary" />
                  <span>
                    Distance: <strong>{profile?.distance_preference || 'Not set'} miles</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    Age: <strong>{profile?.age_preference_min || '??'}-{profile?.age_preference_max || '??'}</strong>
                  </span>
                </div>
                <Button className="w-full mt-4">
                  Start Searching
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-muted-foreground" />
                AI-Powered Matching
                <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
              </CardTitle>
              <CardDescription>
                Advanced compatibility analysis based on personality and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>• Personality compatibility scoring</div>
                <div>• Interest-based matching</div>
                <div>• Communication style analysis</div>
                <div>• Long-term relationship potential</div>
                <Button disabled className="w-full mt-4">
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup Guide */}
        {(!profile?.zip_code || !profile?.distance_preference) && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800">Complete Your Search Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                To start finding matches, please complete your search preferences:
              </p>
              <div className="space-y-2 mb-4">
                {!profile?.zip_code && (
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <MapPin className="h-4 w-4" />
                    <span>Add your zip code for location-based matching</span>
                  </div>
                )}
                {!profile?.distance_preference && (
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <Filter className="h-4 w-4" />
                    <span>Set your preferred search distance</span>
                  </div>
                )}
              </div>
              <Button onClick={() => navigate('/profile/edit')}>
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Matches;
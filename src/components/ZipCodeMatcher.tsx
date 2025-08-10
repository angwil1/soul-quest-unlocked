import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { useDistance } from '@/hooks/useDistance';
import { MapPin, Users } from 'lucide-react';

interface MatchPreview {
  id: string;
  name: string;
  zipCode: string;
  distance?: number;
  avatar_url?: string;
}

export const ZipCodeMatcher = () => {
  const { profile } = useProfile();
  const { calculateDistance } = useDistance();
  const [nearbyMatches, setNearbyMatches] = useState<MatchPreview[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample nearby profiles for demonstration
  const sampleProfiles: MatchPreview[] = [
    { id: '1', name: 'Alex', zipCode: '10002' },
    { id: '2', name: 'Jordan', zipCode: '10003' },
    { id: '3', name: 'Casey', zipCode: '10001' },
    { id: '4', name: 'Riley', zipCode: '10004' },
    { id: '5', name: 'Morgan', zipCode: '10010' },
  ];

  useEffect(() => {
    if (profile?.zip_code) {
      findNearbyMatches();
    }
  }, [profile?.zip_code]);

  const findNearbyMatches = async () => {
    if (!profile?.zip_code) return;

    setLoading(true);
    const matchesWithDistance = [];

    for (const match of sampleProfiles) {
      const result = await calculateDistance(profile.zip_code, match.zipCode);
      if (result) {
        matchesWithDistance.push({
          ...match,
          distance: result.distance
        });
      }
    }

    // Filter by distance preference and sort by distance
    const filteredMatches = matchesWithDistance
      .filter(match => !profile.distance_preference || match.distance! <= profile.distance_preference)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));

    setNearbyMatches(filteredMatches);
    setLoading(false);
  };

  if (!profile?.zip_code) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Matches
          </CardTitle>
          <CardDescription>
            Add your zip code to see potential matches nearby
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Nearby Matches
        </CardTitle>
        <CardDescription>
          Potential matches within {profile.distance_preference || 50} miles of {profile.zip_code}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Finding matches nearby...
          </div>
        ) : nearbyMatches.length > 0 ? (
          <div className="space-y-3">
            {nearbyMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    {match.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{match.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {match.zipCode}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {match.distance !== undefined && (
                    <Badge variant="outline">
                      {match.distance < 1 
                        ? `${(match.distance * 5280).toFixed(0)} ft`
                        : `${match.distance.toFixed(1)} mi`
                      }
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No matches found within your distance preference.
            Try increasing your distance range in settings.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
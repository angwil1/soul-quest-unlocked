import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useDistance } from '@/hooks/useDistance';
import { MapPin, Calculator } from 'lucide-react';

export const DistanceChecker = () => {
  const [zipCode1, setZipCode1] = useState('');
  const [zipCode2, setZipCode2] = useState('');
  const [result, setResult] = useState<any>(null);
  const { calculateDistance, loading } = useDistance();

  const handleCalculate = async () => {
    const distance = await calculateDistance(zipCode1, zipCode2);
    setResult(distance);
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 5280).toFixed(0)} feet`;
    }
    return `${distance.toFixed(1)} miles`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Distance Calculator
        </CardTitle>
        <CardDescription>
          Calculate distance between two zip codes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zip1">From Zip Code</Label>
            <Input
              id="zip1"
              value={zipCode1}
              onChange={(e) => setZipCode1(e.target.value)}
              placeholder="10001"
              maxLength={10}
            />
          </div>
          <div>
            <Label htmlFor="zip2">To Zip Code</Label>
            <Input
              id="zip2"
              value={zipCode2}
              onChange={(e) => setZipCode2(e.target.value)}
              placeholder="90210"
              maxLength={10}
            />
          </div>
        </div>

        <Button 
          onClick={handleCalculate} 
          disabled={!zipCode1 || !zipCode2 || loading}
          className="w-full"
        >
          {loading ? 'Calculating...' : 'Calculate Distance'}
        </Button>

        {result && (
          <div className="space-y-3 p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Distance:</span>
              <Badge variant="outline" className="text-base font-semibold">
                {formatDistance(result.distance)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{result.zipCode1}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{result.zipCode2}</span>
              </div>
            </div>

            {result.coordinates && (
              <div className="text-xs text-muted-foreground border-t pt-2">
                <div>From: {result.coordinates.zipCode1.lat.toFixed(4)}, {result.coordinates.zipCode1.lon.toFixed(4)}</div>
                <div>To: {result.coordinates.zipCode2.lat.toFixed(4)}, {result.coordinates.zipCode2.lon.toFixed(4)}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
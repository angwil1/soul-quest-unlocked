import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Heart, Settings } from 'lucide-react';

const Matches = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Find Your Match</h1>
            <p className="text-muted-foreground">
              Discover compatible people through advanced matching
            </p>
          </div>
          <Button onClick={() => navigate('/profile/edit')}>
            <Settings className="h-4 w-4 mr-2" />
            Profile Settings
          </Button>
        </div>

        {/* AI Matching Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              AI-Powered Matching
              <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
            </CardTitle>
            <CardDescription>
              Advanced compatibility analysis based on personality and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground mb-6">
              <div>• Personality compatibility scoring</div>
              <div>• Interest-based matching</div>
              <div>• Communication style analysis</div>
              <div>• Long-term relationship potential</div>
            </div>
            <Button disabled className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Matches;
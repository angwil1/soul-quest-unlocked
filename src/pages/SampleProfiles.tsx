import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, MapPin, Briefcase, Sparkles, Copy, RefreshCw, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { founderCuratedProfiles, echoStarters, vibeTags, poeticMicrocopy } from '@/data/sampleProfiles';
import { useToast } from '@/hooks/use-toast';
import { SoundtrackPlayer } from '@/components/SoundtrackPlayer';
import { useEchoSubscription } from '@/hooks/useEchoSubscription';
import { EchoPurchasePrompt } from '@/components/EchoPurchasePrompt';

const SampleProfiles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isEchoActive } = useEchoSubscription();
  const [selectedProfile, setSelectedProfile] = useState(founderCuratedProfiles[0]);
  const [showInspiration, setShowInspiration] = useState(false);

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const getRandomInspiration = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Check if user has Echo access - TEMPORARILY DISABLED FOR DEMO
  const showDemo = true; // Override for demo purposes
  if (!showDemo && !isEchoActive) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-20">
          <EchoPurchasePrompt />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              Founder-Curated Echo Profiles
            </h1>
            <p className="text-sm text-muted-foreground">
              Poetic demos crafted to spark your authentic Echo
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-2xl mx-auto">
              These are not real users. They're poetic examples curated by the founder to help you imagine connection beyond the scroll.
            </p>
          </div>
          <Dialog open={showInspiration} onOpenChange={setShowInspiration}>
            <DialogTrigger asChild>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Get Inspired
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Echo Inspiration Generator</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="starters" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="starters">Echo Starters</TabsTrigger>
                  <TabsTrigger value="vibes">Vibe Tags</TabsTrigger>
                  <TabsTrigger value="copy">Microcopy</TabsTrigger>
                </TabsList>
                <TabsContent value="starters" className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Deep conversation starters from our sample profiles
                    </p>
                    {echoStarters.slice(0, 8).map((starter, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">{starter}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCopyText(starter, "Echo starter")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleCopyText(getRandomInspiration(echoStarters), "Random echo starter")}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Get Random Starter
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="vibes" className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Expressive vibe tags to describe your essence
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {vibeTags.map((tag, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleCopyText(tag, "Vibe tag")}
                        >
                          <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="copy" className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Poetic microcopy for your dating intentions
                    </p>
                    {poeticMicrocopy.map((copy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm italic">"{copy}"</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCopyText(copy, "Poetic microcopy")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile List */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-4">Profiles</h3>
              {founderCuratedProfiles.map((profile) => (
                <Card 
                  key={profile.id}
                  className={`cursor-pointer transition-all ${
                    selectedProfile.id === profile.id 
                      ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.photos[0]} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{profile.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {profile.vibeTag}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Demo Profile Overlay */}
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-3 py-1">
                  ✨ Poetic Demo Profile
                </Badge>
              </div>
              <div className="absolute top-12 right-4 z-10">
                <Badge variant="outline" className="bg-background/90 text-xs">
                  Created to spark your Echo
                </Badge>
              </div>
            </div>

            {/* Profile Photos */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProfile.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={photo} 
                        alt={`${selectedProfile.name} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 flex-wrap">
                  {selectedProfile.name}, {selectedProfile.age}
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                    ✨ {selectedProfile.vibeTag}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProfile.bio}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedProfile.occupation}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800 dark:text-purple-200">Emotional Soundtrack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-purple-700 dark:text-purple-300 flex-1">
                      {selectedProfile.emotionalSoundtrack}
                    </p>
                    <SoundtrackPlayer text={selectedProfile.emotionalSoundtrack} />
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm italic text-muted-foreground">
                    "{selectedProfile.poeticMicrocopy}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests & Passions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Echo Starters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Echo Conversation Starters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedProfile.echoStarters.map((starter, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">{starter}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleCopyText(starter, "Echo starter")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vibe Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✨ Vibe Gallery
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">Echo</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProfile.vibeGallery.map((vibe, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={vibe.image} 
                          alt={`${vibe.mood} vibe`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium capitalize text-purple-600">{vibe.mood}</span>
                          <Badge variant="secondary" className="text-xs">Vibe</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{vibe.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {vibe.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Aesthetic & Personality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aesthetic Preference</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedProfile.aestheticPreference}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Type: </span>
                    <span className="text-sm text-muted-foreground">{selectedProfile.personalityType}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Love Language: </span>
                    <span className="text-sm text-muted-foreground">{selectedProfile.loveLanguage}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to craft your own Echo?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use these profiles as inspiration to create your authentic, emotionally rich dating profile.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => {
                    console.log('Create My Echo Profile button clicked - navigating to /profile/edit');
                    navigate('/profile/edit');
                  }}>
                    Create My Echo Profile
                  </Button>
                  <Button variant="outline" onClick={() => setShowInspiration(true)}>
                    Get More Inspiration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleProfiles;
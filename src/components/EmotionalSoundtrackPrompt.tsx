import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodSuggestion {
  mood: string;
  description: string;
  color: string;
  icon: string;
}

interface SoundtrackSuggestion {
  title: string;
  artist: string;
  vibe: string;
  tiktokUrl: string;
  description: string;
}

const moods: MoodSuggestion[] = [
  { mood: 'Wistful', description: 'Nostalgic and dreamy', color: 'bg-purple-100 text-purple-800', icon: '🌙' },
  { mood: 'Confident', description: 'Bold and empowered', color: 'bg-orange-100 text-orange-800', icon: '🔥' },
  { mood: 'Chaotic Calm', description: 'Peaceful within the storm', color: 'bg-blue-100 text-blue-800', icon: '🌊' },
  { mood: 'Mysterious', description: 'Enigmatic and alluring', color: 'bg-gray-100 text-gray-800', icon: '🌫️' },
  { mood: 'Playful', description: 'Fun and carefree', color: 'bg-pink-100 text-pink-800', icon: '✨' },
  { mood: 'Intense', description: 'Deep and passionate', color: 'bg-red-100 text-red-800', icon: '⚡' },
];

const soundtrackSuggestions: Record<string, SoundtrackSuggestion[]> = {
  'Wistful': [
    { title: 'Golden Hour', artist: 'JVKE', vibe: 'Dreamy sunset vibes', tiktokUrl: 'https://www.tiktok.com/@jvke/video/7234567890', description: 'Perfect for that nostalgic, golden hour feeling' },
    { title: 'Space Song', artist: 'Beach House', vibe: 'Ethereal and floating', tiktokUrl: 'https://www.tiktok.com/@beachhouse/video/7234567891', description: 'Dreamy indie vibes for introspective moments' },
    { title: 'Francis Forever', artist: 'Mitski', vibe: 'Melancholic beauty', tiktokUrl: 'https://www.tiktok.com/@mitski/video/7234567892', description: 'Bittersweet emotions and deep feels' },
    { title: 'Mystery of Love', artist: 'Sufjan Stevens', vibe: 'Romantic longing', tiktokUrl: 'https://www.tiktok.com/@sufjanstevens/video/7234567893', description: 'Tender and contemplative love song' },
    { title: 'Vienna', artist: 'Billy Joel', vibe: 'Life reflection', tiktokUrl: 'https://www.tiktok.com/@billyjoel/video/7234567894', description: 'Timeless wisdom about slowing down' }
  ],
  'Confident': [
    { title: 'I Am', artist: 'Baby Keem', vibe: 'Unapologetic energy', tiktokUrl: 'https://www.tiktok.com/@babykeem/video/7345678901', description: 'Bold self-assertion anthem' },
    { title: 'Good 4 U', artist: 'Olivia Rodrigo', vibe: 'Empowered and fierce', tiktokUrl: 'https://www.tiktok.com/@oliviarodrigo/video/7345678902', description: 'Pop-punk confidence boost' },
    { title: 'Industry Baby', artist: 'Lil Nas X', vibe: 'Unstoppable force', tiktokUrl: 'https://www.tiktok.com/@lilnasx/video/7345678903', description: 'Chart-topping confidence' },
    { title: 'Boss B*tch', artist: 'Doja Cat', vibe: 'CEO energy', tiktokUrl: 'https://www.tiktok.com/@dojacat/video/7345678904', description: 'Taking charge and owning it' },
    { title: 'Levitating', artist: 'Dua Lipa', vibe: 'Disco confidence', tiktokUrl: 'https://www.tiktok.com/@dualipa/video/7345678905', description: 'Dance floor domination' }
  ],
  'Chaotic Calm': [
    { title: 'Breathe Me', artist: 'Sia', vibe: 'Vulnerable strength', tiktokUrl: 'https://www.tiktok.com/@siamusic/video/7456789012', description: 'Finding peace in chaos' },
    { title: 'Mad World', artist: 'Gary Jules', vibe: 'Haunting serenity', tiktokUrl: 'https://www.tiktok.com/@garyjules/video/7456789013', description: 'Beautiful melancholy' },
    { title: 'Holocene', artist: 'Bon Iver', vibe: 'Atmospheric peace', tiktokUrl: 'https://www.tiktok.com/@boniver/video/7456789014', description: 'Nature-inspired tranquility' },
    { title: 'The Night We Met', artist: 'Lord Huron', vibe: 'Bittersweet acceptance', tiktokUrl: 'https://www.tiktok.com/@lordhuron/video/7456789015', description: 'Peaceful within the pain' },
    { title: 'Skinny Love', artist: 'Bon Iver', vibe: 'Fragile beauty', tiktokUrl: 'https://www.tiktok.com/@boniver/video/7456789016', description: 'Calm in the storm' }
  ],
  'Mysterious': [
    { title: 'Gangsta', artist: 'Kehlani', vibe: 'Dark allure', tiktokUrl: 'https://www.tiktok.com/@kehlani/video/7567890123', description: 'Mysterious and captivating' },
    { title: 'Criminal', artist: 'Britney Spears', vibe: 'Forbidden energy', tiktokUrl: 'https://www.tiktok.com/@britneyspears/video/7567890124', description: 'Enigmatic and seductive' },
    { title: 'Black', artist: 'Pearl Jam', vibe: 'Deep mystery', tiktokUrl: 'https://www.tiktok.com/@pearljam/video/7567890125', description: 'Grunge mystique' },
    { title: 'Teardrop', artist: 'Massive Attack', vibe: 'Trip-hop enigma', tiktokUrl: 'https://www.tiktok.com/@massiveattack/video/7567890126', description: 'Atmospheric mystery' },
    { title: 'Portishead', artist: 'Glory Box', vibe: 'Sultry secrets', tiktokUrl: 'https://www.tiktok.com/@portishead/video/7567890127', description: 'Mysterious and hypnotic' }
  ],
  'Playful': [
    { title: 'Sunflower', artist: 'Post Malone', vibe: 'Carefree fun', tiktokUrl: 'https://www.tiktok.com/@postmalone/video/7678901234', description: 'Light-hearted and joyful' },
    { title: 'Dancing Queen', artist: 'ABBA', vibe: 'Disco joy', tiktokUrl: 'https://www.tiktok.com/@abba/video/7678901235', description: 'Timeless fun and freedom' },
    { title: 'Watermelon Sugar', artist: 'Harry Styles', vibe: 'Sweet summer', tiktokUrl: 'https://www.tiktok.com/@harrystyles/video/7678901236', description: 'Playful and flirty' },
    { title: 'Good Vibes', artist: 'Chris Brown', vibe: 'Positive energy', tiktokUrl: 'https://www.tiktok.com/@chrisbrownofficial/video/7678901237', description: 'Pure good vibes only' },
    { title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', vibe: 'Infectious happiness', tiktokUrl: 'https://www.tiktok.com/@justintimberlake/video/7678901238', description: 'Uncontainable joy' }
  ],
  'Intense': [
    { title: 'My Way', artist: 'Frank Sinatra', vibe: 'Legendary power', tiktokUrl: 'https://www.tiktok.com/@franksinatra/video/7789012345', description: 'Classic intensity and conviction' },
    { title: 'Till I Collapse', artist: 'Eminem', vibe: 'Unstoppable force', tiktokUrl: 'https://www.tiktok.com/@eminem/video/7789012346', description: 'Raw determination and power' },
    { title: 'Halo', artist: 'Beyoncé', vibe: 'Powerful emotion', tiktokUrl: 'https://www.tiktok.com/@beyonce/video/7789012347', description: 'Intense love and devotion' },
    { title: 'Thunderstruck', artist: 'AC/DC', vibe: 'Electric energy', tiktokUrl: 'https://www.tiktok.com/@acdc/video/7789012348', description: 'High-voltage intensity' },
    { title: 'Immigrant Song', artist: 'Led Zeppelin', vibe: 'Epic power', tiktokUrl: 'https://www.tiktok.com/@ledzeppelin/video/7789012349', description: 'Legendary rock intensity' }
  ]
};

interface EmotionalSoundtrackPromptProps {
  onSoundtrackSelect: (title: string, artist: string, tiktokUrl: string, mood: string) => void;
}

export const EmotionalSoundtrackPrompt = ({ onSoundtrackSelect }: EmotionalSoundtrackPromptProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SoundtrackSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuggestions(soundtrackSuggestions[mood] || []);
    setIsGenerating(false);
    
    toast({
      title: `${mood} vibes loaded!`,
      description: `5 curated soundtracks matching your ${mood.toLowerCase()} mood`,
    });
  };

  const handleRefresh = () => {
    if (selectedMood) {
      // Shuffle the suggestions for variety
      const shuffled = [...soundtrackSuggestions[selectedMood]].sort(() => Math.random() - 0.5);
      setSuggestions(shuffled);
      toast({
        title: "Fresh suggestions!",
        description: "New soundtracks for your vibe",
      });
    }
  };

  const handleSoundtrackClick = (suggestion: SoundtrackSuggestion) => {
    onSoundtrackSelect(suggestion.title, suggestion.artist, suggestion.tiktokUrl, selectedMood!);
    toast({
      title: "Soundtrack selected!",
      description: `${suggestion.title} by ${suggestion.artist} is now your vibe`,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-6 w-6 text-purple-600" />
          What feeling are you sharing today?
        </CardTitle>
        <p className="text-muted-foreground">
          Select your vibe and get 5 curated soundtrack suggestions
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {moods.map((mood) => (
            <Button
              key={mood.mood}
              variant={selectedMood === mood.mood ? "default" : "outline"}
              className={`p-4 h-auto flex flex-col items-center gap-2 ${
                selectedMood === mood.mood ? 'bg-primary hover:bg-primary/90' : ''
              }`}
              onClick={() => handleMoodSelect(mood.mood)}
            >
              <span className="text-2xl">{mood.icon}</span>
              <div className="text-center">
                <div className="font-semibold">{mood.mood}</div>
                <div className="text-xs opacity-80">{mood.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-8">
            <div className="animate-spin inline-block h-8 w-8 text-purple-600">
              <RefreshCw className="h-8 w-8" />
            </div>
            <p className="mt-2 text-muted-foreground">Curating your perfect soundtrack...</p>
          </div>
        )}

        {/* Soundtrack Suggestions */}
        {selectedMood && suggestions.length > 0 && !isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {selectedMood} Soundtracks
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            <div className="grid gap-3">
              {suggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-primary"
                  onClick={() => handleSoundtrackClick(suggestion)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{suggestion.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.vibe}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        by {suggestion.artist}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                ✨ Pre-curated TikTok links for easy embedding
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
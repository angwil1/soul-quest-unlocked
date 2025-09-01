import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageSquare, Star, Plus, Trash2 } from 'lucide-react';

interface VaultMatch {
  id: string;
  matched_user_id: string;
  notes: string;
  tags: string[];
  saved_at: string;
}

interface VaultPrompt {
  id: string;
  prompt_text: string;
  response_text: string;
  prompt_source: string;
  notes: string;
  tags: string[];
  saved_at: string;
}

interface VaultMoment {
  id: string;
  moment_type: string;
  title: string;
  description: string;
  content: any;
  notes: string;
  tags: string[];
  is_favorite: boolean;
  saved_at: string;
  moment_date: string;
}

const MemoryVault = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Sample data for demo
  const [matches, setMatches] = useState<VaultMatch[]>([
    {
      id: '1',
      matched_user_id: 'sample-4',
      notes: 'Taylor Brooks - Really interesting person with great sustainability focus!',
      tags: ['sample-profile', 'viewed', 'environmental'],
      saved_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2', 
      matched_user_id: 'sample-2',
      notes: 'Casey Chen - Love their dog photos and outdoor adventures',
      tags: ['sample-profile', 'dog-lover', 'adventurous'],
      saved_at: '2024-01-10T14:20:00Z'
    }
  ]);
  const [prompts, setPrompts] = useState<VaultPrompt[]>([
    {
      id: '1',
      prompt_text: 'What\'s something you\'ve learned about yourself through dating that surprised you?',
      response_text: 'I discovered I\'m much more of a homebody than I thought. I used to think I wanted someone super adventurous, but I actually love cozy nights in with deep conversations.',
      prompt_source: 'ai-compatibility',
      notes: 'Perfect for understanding relationship preferences and self-awareness',
      tags: ['self-discovery', 'dating-insights', 'compatibility'],
      saved_at: '2024-01-12T09:15:00Z'
    },
    {
      id: '2',
      prompt_text: 'If we matched, what\'s one thing you\'d want me to know about how you show affection?',
      response_text: 'I\'m a big acts of service person - I show love by doing little thoughtful things like making coffee in the morning or remembering important details.',
      prompt_source: 'connection-builder', 
      notes: 'Great for understanding love languages early',
      tags: ['love-language', 'affection', 'connection'],
      saved_at: '2024-01-08T16:45:00Z'
    },
    {
      id: '3',
      prompt_text: 'What\'s a relationship green flag that instantly makes you more interested in someone?',
      response_text: '',
      prompt_source: 'ai-generated', 
      notes: 'Excellent conversation starter - reveals values and priorities',
      tags: ['green-flags', 'values', 'attraction'],
      saved_at: '2024-01-05T14:30:00Z'
    },
    {
      id: '4',
      prompt_text: 'Describe your ideal lazy Sunday with a romantic partner.',
      response_text: 'Sleeping in, making breakfast together, maybe a farmers market, then reading books in the same room while it rains outside.',
      prompt_source: 'lifestyle-compatibility',
      notes: 'Perfect for understanding relationship dynamics and lifestyle compatibility',
      tags: ['lifestyle', 'romantic', 'compatibility'],
      saved_at: '2024-01-03T11:20:00Z'
    }
  ]);
  const [moments, setMoments] = useState<VaultMoment[]>([
    {
      id: '1',
      moment_type: 'reflection',
      title: 'our first kiss',
      description: 'It happened at the coffee shop during our third date. Everything felt perfect.',
      content: {},
      notes: '',
      tags: ['romance', 'milestone'],
      is_favorite: true,
      saved_at: '2024-01-14T20:30:00Z',
      moment_date: '2024-01-14T20:30:00Z'
    },
    {
      id: '2',
      moment_type: 'milestone',
      title: 'First Match Connection',
      description: 'Had my first really meaningful conversation on the app today. We talked for hours about travel dreams and life goals.',
      content: {},
      notes: 'Remember to ask about their trip to New Zealand next time',
      tags: ['first-match', 'meaningful', 'travel'],
      is_favorite: true,
      saved_at: '2024-01-14T20:30:00Z',
      moment_date: '2024-01-14T20:30:00Z'
    },
    {
      id: '3',
      moment_type: 'insight',
      title: 'Dating App Breakthrough',
      description: 'Realized I was focusing too much on perfect messages. Started being more genuine and conversations became so much more natural.',
      content: {},
      notes: 'Authenticity > perfection',
      tags: ['insight', 'authenticity', 'breakthrough'],
      is_favorite: true,
      saved_at: '2024-01-02T13:45:00Z',
      moment_date: '2024-01-02T13:45:00Z'
    }
  ]);
  const [loading, setLoading] = useState(true);

  // New moment form state
  const [newMoment, setNewMoment] = useState({
    title: '',
    description: '',
    moment_type: 'reflection',
    notes: '',
    tags: ''
  });

  const isUnlockedBeyond = true; // Demo: showing premium experience

  useEffect(() => {
    // Skip database fetch since we're using demo data
    setLoading(false);
  }, [user, isUnlockedBeyond]);

  const addMoment = async () => {
    if (!newMoment.title.trim()) return;

    try {
      const { error } = await supabase
        .from('memory_vault_moments')
        .insert({
          user_id: user?.id,
          title: newMoment.title,
          description: newMoment.description,
          moment_type: newMoment.moment_type,
          notes: newMoment.notes,
          tags: newMoment.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          moment_date: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Moment saved!",
        description: "Your memory has been added to the vault."
      });

      setNewMoment({
        title: '',
        description: '',
        moment_type: 'reflection',
        notes: '',
        tags: ''
      });

    } catch (error) {
      console.error('Error adding moment:', error);
      toast({
        title: "Error",
        description: "Failed to save moment",
        variant: "destructive"
      });
    }
  };

  const deleteItem = async (table: 'memory_vault_matches' | 'memory_vault_prompts' | 'memory_vault_moments', id: string) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Item removed from your Memory Vault"
      });

    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your Memory Vault...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Memory Vault</h1>
          <p className="text-xl text-muted-foreground mb-8">Please log in to access your Memory Vault</p>
          <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (!isUnlockedBeyond) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🔮</div>
            <h1 className="text-4xl font-bold mb-4">Memory Vault</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Memory Vault is an exclusive feature for Unlocked Beyond subscribers. 
              Save and revisit your favorite moments, prompts, and matches.
            </p>
            <div className="bg-card rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">What you can save:</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-medium">Favorite Matches</h4>
                  <p className="text-sm text-muted-foreground">Keep track of meaningful connections</p>
                </div>
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-medium">Inspiring Prompts</h4>
                  <p className="text-sm text-muted-foreground">Save questions that sparked great conversations</p>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-medium">Special Moments</h4>
                  <p className="text-sm text-muted-foreground">Preserve memories and reflections</p>
                </div>
              </div>
            </div>
            <Button onClick={() => window.location.href = '/pricing'} size="lg">
              Upgrade to Unlocked Beyond
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-4xl">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">My Saved Items</h1>
          <p className="text-muted-foreground">Your favorite moments, conversations, and connections</p>
        </div>

        {/* Simple Add Button */}
        <div className="flex justify-center mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Save a Moment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save a Moment</DialogTitle>
                <DialogDescription>What would you like to remember?</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="What happened?"
                  value={newMoment.title}
                  onChange={(e) => setNewMoment({...newMoment, title: e.target.value})}
                />
                <Textarea
                  placeholder="Tell me more about it..."
                  value={newMoment.description}
                  onChange={(e) => setNewMoment({...newMoment, description: e.target.value})}
                />
                <Button onClick={addMoment} className="w-full">
                  Save It
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Simple List */}
        <div className="space-y-4">
          {/* Moments */}
          {moments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                My Moments
              </h2>
              <div className="space-y-3">
                {moments.map((moment) => (
                  <Card key={moment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{moment.title}</h3>
                          {moment.description && (
                            <p className="text-sm text-muted-foreground">{moment.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem('memory_vault_moments', moment.id)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Starters */}
          {prompts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation Starters
              </h2>
              <div className="space-y-3">
                {prompts.map((prompt) => (
                  <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium mb-1">"{prompt.prompt_text}"</p>
                          {prompt.response_text && (
                            <p className="text-sm text-muted-foreground italic">
                              Sample: {prompt.response_text}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem('memory_vault_prompts', prompt.id)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Saved Profiles */}
          {matches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Saved Profiles
              </h2>
              <div className="space-y-3">
                {matches.map((match) => (
                  <Card key={match.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{match.notes.split(' - ')[0]}</h3>
                          <p className="text-sm text-muted-foreground">
                            {match.notes.includes(' - ') ? match.notes.split(' - ').slice(1).join(' - ') : match.notes}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem('memory_vault_matches', match.id)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {moments.length === 0 && prompts.length === 0 && matches.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-4xl mb-4">💫</div>
                <h3 className="text-lg font-semibold mb-2">Start saving your special moments</h3>
                <p className="text-muted-foreground mb-4">
                  Keep track of great conversations, connections, and memories
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Save Your First Moment</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save a Moment</DialogTitle>
                      <DialogDescription>What would you like to remember?</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="What happened?"
                        value={newMoment.title}
                        onChange={(e) => setNewMoment({...newMoment, title: e.target.value})}
                      />
                      <Textarea
                        placeholder="Tell me more about it..."
                        value={newMoment.description}
                        onChange={(e) => setNewMoment({...newMoment, description: e.target.value})}
                      />
                      <Button onClick={addMoment} className="w-full">
                        Save It
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryVault;
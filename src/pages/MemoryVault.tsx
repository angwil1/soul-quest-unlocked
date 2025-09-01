import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageSquare, Lightbulb, Star, Search, Plus, Trash2, Tag, Calendar } from 'lucide-react';
import { format } from 'date-fns';

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
      notes: 'Taylor Brooks - Sample Profile. Really interesting person with great sustainability focus!',
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
      id: '2',
      moment_type: 'milestone',
      title: 'Completed Profile Setup',
      description: 'Finally took the time to really craft my profile. Added photos I love and wrote a bio that feels authentic.',
      content: {},
      notes: 'Profile views increased 3x after this update',
      tags: ['profile', 'milestone', 'authentic'],
      is_favorite: false,
      saved_at: '2024-01-05T11:00:00Z', 
      moment_date: '2024-01-05T11:00:00Z'
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('moments');

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

  const fetchVaultData = async () => {
    try {
      const [matchesRes, promptsRes, momentsRes] = await Promise.all([
        supabase.from('memory_vault_matches').select('*').order('saved_at', { ascending: false }),
        supabase.from('memory_vault_prompts').select('*').order('saved_at', { ascending: false }),
        supabase.from('memory_vault_moments').select('*').order('saved_at', { ascending: false })
      ]);

      if (matchesRes.data) setMatches(matchesRes.data);
      if (promptsRes.data) setPrompts(promptsRes.data);
      if (momentsRes.data) setMoments(momentsRes.data);
    } catch (error) {
      console.error('Error fetching vault data:', error);
      toast({
        title: "Error",
        description: "Failed to load your Memory Vault",
        variant: "destructive"
      });
    }
  };

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

      fetchVaultData();
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

      fetchVaultData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const filterItems = (items: any[], searchTerm: string) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prompt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
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
                  <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
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
      
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Memory Vault
          </h1>
          <p className="text-xl text-muted-foreground">
            Your vault of remembered connections, moments, and insights
          </p>
        </div>

        {/* Search and Add */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your vault..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Moment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save a New Moment</DialogTitle>
                <DialogDescription>
                  Capture a special memory, reflection, or insight
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Moment title"
                  value={newMoment.title}
                  onChange={(e) => setNewMoment({...newMoment, title: e.target.value})}
                />
                <Textarea
                  placeholder="Describe this moment..."
                  value={newMoment.description}
                  onChange={(e) => setNewMoment({...newMoment, description: e.target.value})}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={newMoment.tags}
                  onChange={(e) => setNewMoment({...newMoment, tags: e.target.value})}
                />
                <Button onClick={addMoment} className="w-full">
                  Save Moment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="moments">
              <Star className="h-4 w-4 mr-2" />
              Moments ({moments.length})
            </TabsTrigger>
            <TabsTrigger value="prompts">
              <Lightbulb className="h-4 w-4 mr-2" />
              Prompts ({prompts.length})
            </TabsTrigger>
            <TabsTrigger value="matches">
              <Heart className="h-4 w-4 mr-2" />
              Matches ({matches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moments" className="space-y-4">
            {filterItems(moments, searchTerm).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No moments saved yet</h3>
                  <p className="text-muted-foreground">Start building your collection of special memories</p>
                </CardContent>
              </Card>
            ) : (
              filterItems(moments, searchTerm).map((moment) => (
                <Card key={moment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {moment.title}
                          {moment.is_favorite && <Star className="h-4 w-4 text-yellow-500" />}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(moment.saved_at), 'MMM d, yyyy')}
                          <Badge variant="outline">{moment.moment_type}</Badge>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('memory_vault_moments', moment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {moment.description && (
                      <p className="text-sm text-muted-foreground mb-3">{moment.description}</p>
                    )}
                    {moment.notes && (
                      <p className="text-sm mb-3">{moment.notes}</p>
                    )}
                    {moment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {moment.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="prompts" className="space-y-4">
            {filterItems(prompts, searchTerm).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No prompts saved yet</h3>
                  <p className="text-muted-foreground">Save interesting questions and conversation starters</p>
                </CardContent>
              </Card>
            ) : (
              filterItems(prompts, searchTerm).map((prompt) => (
                <Card key={prompt.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-base">{prompt.prompt_text}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(prompt.saved_at), 'MMM d, yyyy')}
                          {prompt.prompt_source && <Badge variant="outline">{prompt.prompt_source}</Badge>}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('memory_vault_prompts', prompt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {prompt.response_text && (
                      <div className="bg-muted rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium mb-1">Your Response:</p>
                        <p className="text-sm">{prompt.response_text}</p>
                      </div>
                    )}
                    {prompt.notes && (
                      <p className="text-sm mb-3">{prompt.notes}</p>
                    )}
                    {prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            {filterItems(matches, searchTerm).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No matches saved yet</h3>
                  <p className="text-muted-foreground">Save your favorite connections and meaningful matches</p>
                </CardContent>
              </Card>
            ) : (
              filterItems(matches, searchTerm).map((match) => (
                <Card key={match.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          Saved Match
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(match.saved_at), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('memory_vault_matches', match.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {match.notes && (
                      <p className="text-sm mb-3">{match.notes}</p>
                    )}
                    {match.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {match.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemoryVault;
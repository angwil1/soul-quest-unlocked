import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Users, Sparkles } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const EchoConnectionToggle = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (enabled: boolean) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ open_to_connection_invites: enabled })
        .eq('id', profile?.id);

      if (error) throw error;

      await updateProfile({});
      
      toast({
        title: enabled ? "Connection invites enabled!" : "Connection invites disabled",
        description: enabled 
          ? "Others can now invite you to deeper connections" 
          : "Connection invites are now turned off",
      });
    } catch (error) {
      console.error('Error updating connection toggle:', error);
      toast({
        title: "Error",
        description: "Failed to update connection settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVisibilityChange = async (level: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ echo_visibility_level: level })
        .eq('id', profile?.id);

      if (error) throw error;

      await updateProfile({});
      
      toast({
        title: "Visibility updated",
        description: `Echo visibility set to ${level}`,
      });
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update visibility settings.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Open to Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Connection Invites</span>
              {profile?.open_to_connection_invites ? (
                <Badge className="bg-gradient-to-r from-pink-600 to-purple-500 text-white">
                  <Heart className="h-3 w-3 mr-1" />
                  Open
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Allow viewers to invite you into 💖 Complete Plus for deeper connection
            </p>
          </div>
          <Switch
            checked={profile?.open_to_connection_invites || false}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="visibility">Echo Visibility Level</Label>
          <Select 
            value={profile?.echo_visibility_level || 'standard'} 
            onValueChange={handleVisibilityChange}
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Standard - Visible to Echo members
                </div>
              </SelectItem>
              <SelectItem value="enhanced">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Enhanced - Featured in Echo discoveries
                </div>
              </SelectItem>
              <SelectItem value="full">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Full - Open to all connection types
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {profile?.open_to_connection_invites && (
          <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-900 dark:text-pink-100">
                "I'm open to resonance that becomes something more."
              </span>
            </div>
            <ul className="text-xs text-pink-700 dark:text-pink-300 space-y-1">
              <li>• Viewers can send connection invites</li>
              <li>• You choose which invites to accept</li>
              <li>• Accepted invites unlock Complete Plus features</li>
              <li>• Experience deeper connection tools together</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
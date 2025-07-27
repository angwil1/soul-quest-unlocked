import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const EchoBadgeToggle = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (enabled: boolean) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ echo_badge_enabled: enabled })
        .eq('id', profile?.id);

      if (error) throw error;

      await updateProfile({});
      
      toast({
        title: enabled ? "Echo badge enabled!" : "Echo badge disabled",
        description: enabled 
          ? "Your Echo badge is now visible on your profile" 
          : "Your Echo badge is now hidden from your profile",
      });
    } catch (error) {
      console.error('Error updating Echo badge:', error);
      toast({
        title: "Error",
        description: "Failed to update Echo badge setting. Please try again.",
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
          <Sparkles className="h-5 w-5 text-purple-500" />
          Echo Badge Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Show Echo Badge</span>
              {profile?.echo_badge_enabled ? (
                <Badge className="bg-purple-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Echo
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hidden
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Display your Echo subscription badge on your profile
            </p>
          </div>
          <Switch
            checked={profile?.echo_badge_enabled || false}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
        </div>

        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Your Profile</span>
            {profile?.echo_badge_enabled && (
              <Badge className="bg-purple-500 text-white text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Echo
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {profile?.echo_badge_enabled 
              ? "Your Echo badge is visible to others, showing your creative expression features"
              : "Your Echo badge is hidden - others won't see your Echo subscription status"
            }
          </p>
        </div>

        {profile?.echo_badge_enabled && (
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Echo Features Active
              </span>
            </div>
            <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
              <li>• TikTok-style profile embed available</li>
              <li>• Emotional soundtrack prompts enabled</li>
              <li>• Discoverable via vibe gallery</li>
              <li>• Enhanced creative visibility</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
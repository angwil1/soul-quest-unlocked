import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UnlockedBeyondBadgeToggle = () => {
  const { profile, loading, refreshProfile } = useProfile();
  const { toast } = useToast();

  const handleToggleBadge = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ unlocked_beyond_badge_enabled: enabled })
        .eq('id', profile?.id);

      if (error) throw error;

      await refreshProfile();
      
      toast({
        title: enabled ? "Unlocked Beyond badge enabled!" : "Unlocked Beyond badge disabled",
        description: enabled 
          ? "Your Unlocked Beyond badge is now visible on your profile" 
          : "Your Unlocked Beyond badge is now hidden from your profile",
      });
    } catch (error) {
      console.error('Error updating Unlocked Beyond badge:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update Unlocked Beyond badge setting. Please try again.",
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-card h-[200px] rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Unlocked Beyond Badge Settings
        </CardTitle>
        <CardDescription>
          Control the visibility of your premium subscription badge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-medium">Show Unlocked Beyond Badge</span>
            {profile?.unlocked_beyond_badge_enabled ? (
              <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-purple-500 to-primary text-white">
                <Crown className="h-3 w-3 mr-1" />
                Unlocked Beyond
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground ml-2">(Hidden)</span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Display your Unlocked Beyond subscription badge on your profile
          </p>
          
          <Switch
            checked={profile?.unlocked_beyond_badge_enabled || false}
            onCheckedChange={handleToggleBadge}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Preview</h4>
          <div className="p-3 bg-muted rounded-lg">
            {profile?.unlocked_beyond_badge_enabled && (
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-primary text-white">
                <Crown className="h-3 w-3 mr-1" />
                Unlocked Beyond
              </Badge>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {profile?.unlocked_beyond_badge_enabled 
                ? "Your Unlocked Beyond badge is visible to others, showing your premium subscription status"
                : "Your Unlocked Beyond badge is hidden - others won't see your subscription status"
              }
            </p>
          </div>
        </div>

        {profile?.unlocked_beyond_badge_enabled && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm font-medium">✨ Premium Visibility Active</p>
            <p className="text-sm text-muted-foreground">
              Your Unlocked Beyond badge shows others you're invested in meaningful connections
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
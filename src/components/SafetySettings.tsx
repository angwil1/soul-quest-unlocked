import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Settings, Eye, MessageSquare, MapPin } from "lucide-react";

interface SafetySettings {
  allow_messages_from_new_matches: boolean;
  require_age_verification: boolean;
  block_explicit_content: boolean;
  location_sharing_enabled: boolean;
  profile_visibility: string;
}

export const SafetySettings = () => {
  const [settings, setSettings] = useState<SafetySettings>({
    allow_messages_from_new_matches: true,
    require_age_verification: true,
    block_explicit_content: true,
    location_sharing_enabled: false,
    profile_visibility: 'public'
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSafetySettings();
    }
  }, [user]);

  const loadSafetySettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('safety_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Load settings error:', error);
        return;
      }

      if (data) {
        setSettings({
          allow_messages_from_new_matches: data.allow_messages_from_new_matches,
          require_age_verification: data.require_age_verification,
          block_explicit_content: data.block_explicit_content,
          location_sharing_enabled: data.location_sharing_enabled,
          profile_visibility: data.profile_visibility
        });
      }
    } catch (error) {
      console.error('Load settings error:', error);
    }
  };

  const updateSetting = (key: keyof SafetySettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save settings",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('safety_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your safety settings have been updated",
        variant: "default"
      });

      setHasChanges(false);
    } catch (error) {
      console.error('Save settings error:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Safety & Privacy Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Messaging Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messaging
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="allow-messages">Allow messages from new matches</Label>
              <p className="text-sm text-muted-foreground">
                Let new matches send you messages immediately
              </p>
            </div>
            <Switch
              id="allow-messages"
              checked={settings.allow_messages_from_new_matches}
              onCheckedChange={(checked) => updateSetting('allow_messages_from_new_matches', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="block-explicit">Block explicit content</Label>
              <p className="text-sm text-muted-foreground">
                Automatically filter inappropriate messages
              </p>
            </div>
            <Switch
              id="block-explicit"
              checked={settings.block_explicit_content}
              onCheckedChange={(checked) => updateSetting('block_explicit_content', checked)}
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </h3>

          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select 
              value={settings.profile_visibility} 
              onValueChange={(value) => updateSetting('profile_visibility', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to all users</SelectItem>
                <SelectItem value="matches_only">Matches Only - Only visible to matches</SelectItem>
                <SelectItem value="private">Private - Hidden from discovery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="location-sharing">Enable location sharing</Label>
              <p className="text-sm text-muted-foreground">
                Share your general location for better matches
              </p>
            </div>
            <Switch
              id="location-sharing"
              checked={settings.location_sharing_enabled}
              onCheckedChange={(checked) => updateSetting('location_sharing_enabled', checked)}
            />
          </div>
        </div>

        {/* Verification Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Verification
          </h3>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="require-age">Require age verification</Label>
              <p className="text-sm text-muted-foreground">
                Only match with age-verified users
              </p>
            </div>
            <Switch
              id="require-age"
              checked={settings.require_age_verification}
              onCheckedChange={(checked) => updateSetting('require_age_verification', checked)}
            />
          </div>
        </div>

        {hasChanges && (
          <div className="pt-4 border-t">
            <Button 
              onClick={saveSettings} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
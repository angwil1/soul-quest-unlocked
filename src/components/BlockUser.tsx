import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Ban, UserX } from "lucide-react";

interface BlockUserProps {
  blockedUserId: string;
  blockedUserName?: string;
  onBlock?: () => void;
}

export const BlockUser = ({ blockedUserId, blockedUserName, onBlock }: BlockUserProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBlockUser = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to block users",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_blocks')
        .insert({
          blocker_id: user.id,
          blocked_user_id: blockedUserId
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Blocked",
            description: "This user is already blocked",
            variant: "default"
          });
          return;
        }
        throw error;
      }

      toast({
        title: "User Blocked",
        description: `${blockedUserName || "User"} has been blocked. They won't be able to contact you.`,
        variant: "default"
      });

      onBlock?.();
    } catch (error) {
      console.error('Block user error:', error);
      toast({
        title: "Block Failed",
        description: "Unable to block user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleBlockUser}
      disabled={loading}
      className="text-orange-600 hover:text-orange-700"
    >
      {loading ? (
        <UserX className="h-4 w-4 mr-2 animate-pulse" />
      ) : (
        <Ban className="h-4 w-4 mr-2" />
      )}
      {loading ? "Blocking..." : "Block"}
    </Button>
  );
};
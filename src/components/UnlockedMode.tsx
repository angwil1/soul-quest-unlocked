import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Sparkles, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

export const UnlockedMode = () => {
  const { isUnlockedBeyond } = useSubscription();

  if (!isUnlockedBeyond) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Unlocked Mode: Values-First Compatibility
        </CardTitle>
        <CardDescription>
          Experience deeper, more meaningful connection journeys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60">
            <Heart className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium text-sm">Emotional Depth</h4>
              <p className="text-xs text-muted-foreground">Prioritize emotional intelligence and vulnerability</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60">
            <Users className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium text-sm">Shared Values</h4>
              <p className="text-xs text-muted-foreground">Connect through core beliefs and life philosophies</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60">
            <Sparkles className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium text-sm">Intentional Matching</h4>
              <p className="text-xs text-muted-foreground">Quality over quantity in every connection</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-primary text-white">
            <Crown className="h-3 w-3 mr-1" />
            Unlocked Beyond Active
          </Badge>
          <span className="text-sm text-muted-foreground">
            Enhanced compatibility journeys enabled
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
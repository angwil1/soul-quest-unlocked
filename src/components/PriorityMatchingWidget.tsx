import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Users, Target, Crown, TrendingUp } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

export const PriorityMatchingWidget = () => {
  const { isUnlockedPlus, isUnlockedBeyond } = useSubscription();

  const hasPriorityAccess = isUnlockedPlus || isUnlockedBeyond;

  if (!hasPriorityAccess) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Priority Matching</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
          <CardDescription>
            Get seen by more people with enhanced visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Available with Unlocked+ subscription
          </p>
          <Link to="/pricing">
            <Button size="sm" className="w-full">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Access
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Priority Matching Active</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-primary text-white">
            <Crown className="h-3 w-3 mr-1" />
            {isUnlockedBeyond ? "Beyond" : "Plus"}
          </Badge>
        </div>
        <CardDescription>
          Your profile has enhanced visibility and priority placement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60">
            <Target className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium text-sm">Higher Visibility</h4>
              <p className="text-xs text-muted-foreground">Your profile appears first in discovery</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60">
            <Users className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium text-sm">More Matches</h4>
              <p className="text-xs text-muted-foreground">3x more likely to be seen and matched</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60">
            <TrendingUp className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium text-sm">Boost Algorithm</h4>
              <p className="text-xs text-muted-foreground">AI prioritizes your profile in matching</p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/10 p-3 rounded-lg">
          <p className="text-sm font-medium">✨ Priority Status Active</p>
          <p className="text-xs text-muted-foreground">
            Your premium subscription gives you priority placement in discovery and matching algorithms
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
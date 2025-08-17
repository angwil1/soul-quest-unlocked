import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const FloatingQuizButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const { user } = useAuth();

  // Check if user has completed quiz
  useEffect(() => {
    const checkQuizCompletion = async () => {
      if (!user) {
        setHasCompletedQuiz(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_events')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_type', 'quiz_completed')
          .limit(1);
        
        setHasCompletedQuiz(data && data.length > 0);
      } catch (error) {
        console.error('Error checking quiz completion:', error);
        setHasCompletedQuiz(false);
      }
    };

    checkQuizCompletion();
  }, [user]);

  // Don't show if user is not logged in, if dismissed, or if quiz is completed
  if (!user || !isVisible || hasCompletedQuiz) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 md:bottom-6 md:right-6 sm:bottom-4 sm:right-4">
      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-background border border-border shadow-sm hover:bg-muted"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3 w-3" />
        </Button>
        
        <Link to="/profile/edit">
          <Button 
            size="lg" 
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-primary-foreground border-0"
          >
            <Brain className="h-5 w-5 mr-2" />
            Complete Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};
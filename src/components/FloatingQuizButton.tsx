import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const FloatingQuizButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();

  // Don't show if user is not logged in or if dismissed
  if (!user || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-background border border-border shadow-sm hover:bg-muted"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3 w-3" />
        </Button>
        
        <Link to="/questions">
          <Button 
            size="lg" 
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-primary-foreground border-0"
          >
            <Brain className="h-5 w-5 mr-2" />
            Take Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
};
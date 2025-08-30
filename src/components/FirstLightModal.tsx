import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FirstLightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirstLightModal = ({ isOpen, onClose }: FirstLightModalProps) => {
  const navigate = useNavigate();

  const handleTakeQuiz = () => {
    onClose();
    navigate('/profile/edit');
  };

  const handleBrowsePrompts = () => {
    onClose();
    navigate('/browse');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-background to-muted/20 border border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-foreground mb-4">
            🪞 You're early—and that's beautiful.
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <p className="text-muted-foreground text-lg leading-relaxed">
            The space is still forming. Your presence helps define it.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-start gap-3 text-left">
              <span className="text-primary text-xl">✓</span>
              <span className="text-foreground">Explore sample prompts</span>
            </div>
            <div className="flex items-center justify-start gap-3 text-left">
              <span className="text-primary text-xl">✓</span>
              <span className="text-foreground">Complete Your Profile</span>
            </div>
            <div className="flex items-center justify-start gap-3 text-left">
              <span className="text-primary text-xl">✓</span>
              <span className="text-foreground">Leave your emotional fingerprint</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground italic mt-6">
            Connection begins here, with quiet courage
          </p>
          
          <div className="flex flex-col gap-3 mt-8">
            <Button 
              onClick={handleTakeQuiz}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              size="lg"
            >
              Complete Your Profile
            </Button>
            <Button 
              onClick={handleBrowsePrompts}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Explore Sample Prompts
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
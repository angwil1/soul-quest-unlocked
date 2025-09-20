import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useMemoryVault } from '@/hooks/useMemoryVault';
import { BookmarkPlus, BookmarkCheck, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SaveToVaultButtonProps {
  type: 'match' | 'prompt' | 'moment';
  data: {
    // For matches
    matched_user_id?: string;
    match_id?: string;
    // For prompts  
    prompt_text?: string;
    prompt_source?: string;
    response_text?: string;
    // For moments
    moment_type?: string;
    title?: string;
    description?: string;
    content?: any;
    related_user_id?: string;
    // Common
    notes?: string;
    tags?: string[];
  };
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  iconOnly?: boolean; // New prop for icon-only display
}

export const SaveToVaultButton = ({ 
  type, 
  data, 
  variant = 'ghost', 
  size = 'sm',
  className = '',
  iconOnly = false
}: SaveToVaultButtonProps) => {
  const { saveMatch, savePrompt, saveMoment, loading } = useMemoryVault();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const isUnlockedBeyond = true; // Demo: showing premium experience

  const handleSave = async () => {
    if (!isUnlockedBeyond) {
      toast({
        title: "Memory Vault is Premium",
        description: "Upgrade to Unlocked Beyond to save items to your Memory Vault",
        action: (
          <Button onClick={() => window.location.href = '/pricing'} size="sm">
            Upgrade
          </Button>
        )
      });
      return;
    }

    // Demo: simulate successful save
    setTimeout(() => {
      setIsSaved(true);
      toast({
        title: "Saved to Memory Vault!",
        description: "Profile saved successfully to your Memory Vault",
      });
    }, 500);
  };

  if (!isUnlockedBeyond) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleSave}
        title={iconOnly ? "Save to Vault (Premium Feature)" : undefined}
      >
        <Crown className={`h-4 w-4 text-yellow-500 ${iconOnly ? '' : 'mr-1'}`} />
        {!iconOnly && (
          <>
            Save to Vault
            <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSave}
      disabled={loading || isSaved}
      title={iconOnly ? (isSaved ? "Saved to Vault" : "Save to Vault") : undefined}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className={`h-4 w-4 text-green-500 ${iconOnly ? '' : 'mr-1'}`} />
          {!iconOnly && 'Saved'}
        </>
      ) : (
        <>
          <BookmarkPlus className={`h-4 w-4 ${iconOnly ? '' : 'mr-1'}`} />
          {!iconOnly && 'Save to Vault'}
        </>
      )}
    </Button>
  );
};
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
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
}

export const SaveToVaultButton = ({ 
  type, 
  data, 
  variant = 'ghost', 
  size = 'sm',
  className = ''
}: SaveToVaultButtonProps) => {
  const { subscription } = useSubscription();
  const { saveMatch, savePrompt, saveMoment, loading } = useMemoryVault();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const isUnlockedBeyond = subscription?.subscription_tier === 'Pro' && subscription?.subscribed;

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

    let result;
    switch (type) {
      case 'match':
        result = await saveMatch({
          matched_user_id: data.matched_user_id!,
          match_id: data.match_id,
          notes: data.notes,
          tags: data.tags
        });
        break;
      case 'prompt':
        result = await savePrompt({
          prompt_text: data.prompt_text!,
          prompt_source: data.prompt_source,
          response_text: data.response_text,
          notes: data.notes,
          tags: data.tags
        });
        break;
      case 'moment':
        result = await saveMoment({
          moment_type: data.moment_type || 'reflection',
          title: data.title!,
          description: data.description,
          content: data.content,
          related_user_id: data.related_user_id,
          notes: data.notes,
          tags: data.tags
        });
        break;
    }

    if (result && !result.error) {
      setIsSaved(true);
    }
  };

  if (!isUnlockedBeyond) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleSave}
      >
        <Crown className="h-4 w-4 mr-1 text-yellow-500" />
        Save to Vault
        <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
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
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="h-4 w-4 mr-1 text-green-500" />
          Saved
        </>
      ) : (
        <>
          <BookmarkPlus className="h-4 w-4 mr-1" />
          Save to Vault
        </>
      )}
    </Button>
  );
};
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/contexts/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface VoteControlProps {
  upvotes: number;
  downvotes: number;
  onVote: (voteType: 'up' | 'down' | 'none') => void;
}

export function VoteControl({ upvotes, downvotes, onVote }: VoteControlProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [localVote, setLocalVote] = useState<'up' | 'down' | 'none'>('none');
  
  const handleVote = async (newVote: 'up' | 'down') => {
    if (!user) {
      toast({ 
        title: 'Please log in to vote.', 
        variant: 'destructive',
        action: <Button asChild variant="secondary" size="sm"><Link href="/login">Log In</Link></Button>
       });
      return;
    }
    
    // In a real app, you would call a function here to update the vote count
    // For this mock version, we'll just update the local state to give UI feedback
    if (newVote === localVote) {
        setLocalVote('none');
        onVote('none');
    } else {
        setLocalVote(newVote);
        onVote(newVote);
    }
    
    toast({
        title: "Vote Submitted (Mock)",
        description: "In a real app, this would be saved to a database.",
    });
  };
  
  // This is a simplified calculation for the demo
  let displayVotes = (upvotes || 0) - (downvotes || 0);
  if (localVote === 'up') displayVotes++;
  if (localVote === 'down') displayVotes--;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("h-9 w-9", localVote === 'up' && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
        onClick={() => handleVote('up')}
      >
        <ThumbsUp className="h-5 w-5" />
      </Button>
      <span className="font-bold text-lg">{displayVotes}</span>
      <Button 
        variant="ghost"
        size="icon" 
        className={cn("h-9 w-9", localVote === 'down' && "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground")}
        onClick={() => handleVote('down')}
      >
        <ThumbsDown className="h-5 w-5" />
      </Button>
    </div>
  );
}

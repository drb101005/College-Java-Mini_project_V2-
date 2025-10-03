'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoteControlProps {
  upvotes: number;
  downvotes: number;
  docPath: string; // e.g., "questions/qid1" or "answers/aid1"
}

export function VoteControl({ upvotes, downvotes, docPath }: VoteControlProps) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  // Note: This local state is for immediate UI feedback.
  // In a real app, you might want to fetch the user's vote status from the DB.
  const [localVote, setLocalVote] = useState(0); // -1 for down, 0 for none, 1 for up
  
  const handleVote = async (newVote: 1 | -1) => {
    if (!user || !firestore) {
      toast({ title: 'Please log in to vote.', variant: 'destructive' });
      return;
    }

    const docRef = doc(firestore, docPath);

    // Determine the operation: upvote, downvote, or remove vote
    let upvoteIncrement = 0;
    let downvoteIncrement = 0;
    
    if (newVote === localVote) { // User is undoing their vote
      if (newVote === 1) upvoteIncrement = -1;
      else downvoteIncrement = -1;
      setLocalVote(0);
    } else { // New vote or changing vote
      if (localVote === 1) upvoteIncrement = -1; // was upvoted
      if (localVote === -1) downvoteIncrement = -1; // was downvoted

      if (newVote === 1) upvoteIncrement = 1;
      else downvoteIncrement = 1;
      setLocalVote(newVote);
    }
    
    try {
      await updateDoc(docRef, {
        upvotes: increment(upvoteIncrement),
        downvotes: increment(downvoteIncrement),
      });
    } catch (error) {
      toast({ title: 'Vote failed', variant: 'destructive' });
      // Revert local state on failure
      setLocalVote(localVote);
    }
  };
  
  const totalVotes = (upvotes + (localVote === 1 ? (localVote !== 1 ? 1 : 0) : 0)) - 
                     (downvotes + (localVote === -1 ? (localVote !== -1 ? 1: 0): 0));


  return (
    <div className="flex flex-col items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("h-9 w-9", localVote === 1 && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
        onClick={() => handleVote(1)}
        disabled={!user}
      >
        <ThumbsUp className="h-5 w-5" />
      </Button>
      <span className="font-bold text-lg">{upvotes - downvotes}</span>
      <Button 
        variant="ghost"
        size="icon" 
        className={cn("h-9 w-9", localVote === -1 && "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground")}
        onClick={() => handleVote(-1)}
        disabled={!user}
      >
        <ThumbsDown className="h-5 w-5" />
      </Button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface VoteControlProps {
  upvotes: number;
  downvotes: number;
  docPath: string; // e.g., "questions/qid1" or "answers/aid1"
}

export function VoteControl({ upvotes, downvotes, docPath }: VoteControlProps) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [localVote, setLocalVote] = useState(0); // -1 for down, 0 for none, 1 for up
  
  const handleVote = async (newVote: 1 | -1) => {
    if (!user || !firestore) {
      toast({ 
        title: 'Please log in to vote.', 
        variant: 'destructive',
        action: <Button asChild variant="secondary" size="sm"><Link href="/login">Log In</Link></Button>
       });
      return;
    }

    const docRef = doc(firestore, docPath);

    let upvoteIncrement = 0;
    let downvoteIncrement = 0;
    
    if (newVote === localVote) { 
      if (newVote === 1) upvoteIncrement = -1;
      else downvoteIncrement = -1;
      setLocalVote(0);
    } else { 
      if (localVote === 1) upvoteIncrement = -1; 
      if (localVote === -1) downvoteIncrement = -1; 

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
      setLocalVote(localVote);
    }
  };
  
  const totalVotes = (upvotes - downvotes);

  return (
    <div className="flex flex-col items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("h-9 w-9", localVote === 1 && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
        onClick={() => handleVote(1)}
      >
        <ThumbsUp className="h-5 w-5" />
      </Button>
      <span className="font-bold text-lg">{totalVotes}</span>
      <Button 
        variant="ghost"
        size="icon" 
        className={cn("h-9 w-9", localVote === -1 && "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground")}
        onClick={() => handleVote(-1)}
      >
        <ThumbsDown className="h-5 w-5" />
      </Button>
    </div>
  );
}

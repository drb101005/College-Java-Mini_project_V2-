'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface VoteControlProps {
  upvotes: number;
  downvotes: number;
}

export function VoteControl({ upvotes, downvotes }: VoteControlProps) {
  const [currentVote, setCurrentVote] = useState(0); // -1 for down, 0 for none, 1 for up
  
  const handleUpvote = () => {
    setCurrentVote(currentVote === 1 ? 0 : 1);
  };

  const handleDownvote = () => {
    setCurrentVote(currentVote === -1 ? 0 : -1);
  };
  
  const totalVotes = (upvotes - downvotes) + currentVote;

  return (
    <div className="flex flex-col items-center gap-1">
      <Button 
        variant={currentVote === 1 ? 'default' : 'ghost'} 
        size="icon" 
        className="h-9 w-9"
        onClick={handleUpvote}
      >
        <ThumbsUp className="h-5 w-5" />
      </Button>
      <span className="font-bold text-lg">{totalVotes}</span>
      <Button 
        variant={currentVote === -1 ? 'destructive' : 'ghost'} 
        size="icon" 
        className="h-9 w-9"
        onClick={handleDownvote}
      >
        <ThumbsDown className="h-5 w-5" />
      </Button>
    </div>
  );
}

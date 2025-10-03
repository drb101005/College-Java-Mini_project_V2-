'use client';

import type { Answer, Question } from '@/lib/types';
import { AnswerCard } from './answer-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Link from 'next/link';
import { postAnswer } from '@/lib/data';

interface AnswerSectionProps {
  answers: Answer[];
  question: Question;
  onAnswerPosted: () => void;
}

export function AnswerSection({ answers, question, onAnswerPosted }: AnswerSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedAnswers = [...answers].sort((a, b) => {
    if (question.acceptedAnswerId) {
      if (a.id === question.acceptedAnswerId) return -1;
      if (b.id === question.acceptedAnswerId) return 1;
    }
    return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
  });

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please log in to post an answer.", variant: "destructive" });
      return;
    }
    if (newAnswer.trim().length < 20) {
      toast({ title: "Answer is too short.", description: "Please provide a more detailed answer.", variant: "destructive"});
      return;
    }

    setIsSubmitting(true);
    
    try {
      await postAnswer(question.id, user.id, newAnswer);

      toast({ title: "Answer posted successfully!" });
      setNewAnswer('');
      onAnswerPosted();
    } catch (error) {
      console.error("Error posting answer: ", error);
      toast({ title: "Failed to post answer", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="font-headline text-2xl font-bold mb-4">{answers.length} Answers</h2>
      <div className="space-y-6">
        {sortedAnswers.map((answer) => (
          <AnswerCard 
            key={answer.id} 
            answer={answer} 
            questionId={question.id}
            questionAuthorId={question.authorId}
            isAccepted={question.acceptedAnswerId === answer.id}
            onAccept={onAnswerPosted}
          />
        ))}
      </div>

      <div className="mt-12">
        <h3 className="font-headline text-2xl font-bold mb-4">Your Answer</h3>
        {user ? (
            <Card>
                <CardContent className="p-4">
                    <form onSubmit={handlePostAnswer} className="space-y-4">
                        <Textarea 
                            rows={8} 
                            placeholder="Write your detailed answer here."
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Posting...' : 'Post Your Answer'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        ) : (
            <p>You must be <Link href="/login" className="text-primary hover:underline">logged in</Link> to post an answer.</p>
        )}
      </div>
    </div>
  );
}

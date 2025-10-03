'use client';

import type { Answer, Question } from '@/lib/types';
import { AnswerCard } from './answer-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-provider';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, updateDoc, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Link from 'next/link';

interface AnswerSectionProps {
  answers: Answer[];
  question: Question;
}

export function AnswerSection({ answers, question }: AnswerSectionProps) {
  const { user } = useAuth();
  const firestore = useFirestore();
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
    if (!user || !firestore) {
      toast({ title: "Please log in to post an answer.", variant: "destructive" });
      return;
    }
    if (newAnswer.trim().length < 20) {
      toast({ title: "Answer is too short.", description: "Please provide a more detailed answer.", variant: "destructive"});
      return;
    }

    setIsSubmitting(true);
    
    const answerCollectionRef = collection(firestore, `questions/${question.id}/answers`);
    const newAnswerData = {
      content: newAnswer,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };

    try {
      await addDocumentNonBlocking(answerCollectionRef, newAnswerData);

      const questionRef = doc(firestore, 'questions', question.id);
      await updateDoc(questionRef, {
        answerCount: (question.answerCount || 0) + 1,
      });

      toast({ title: "Answer posted successfully!" });
      setNewAnswer('');
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

'use client';
import type { Answer, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { VoteControl } from './vote-control';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommentList } from './comment-list';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

interface AnswerCardProps {
  answer: Answer;
  questionId: string;
  questionAuthorId: string;
  isAccepted: boolean;
}

export function AnswerCard({ answer, questionId, questionAuthorId, isAccepted }: AnswerCardProps) {
  const firestore = useFirestore();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const authorRef = useMemoFirebase(() => {
    if (!firestore || !answer.authorId) return null;
    return doc(firestore, 'users', answer.authorId);
  }, [firestore, answer.authorId]);
  const { data: author } = useDoc<User>(authorRef);

  const isQuestionOwner = currentUser?.id === questionAuthorId;

  const handleAcceptAnswer = async () => {
    if (!firestore) return;
    if (!currentUser) {
        toast({ title: 'Please log in to accept an answer.', variant: 'destructive'});
        return;
    }
    const questionRef = doc(firestore, 'questions', questionId);
    try {
      await updateDoc(questionRef, {
        acceptedAnswerId: answer.id,
        isSolved: true,
      });
      toast({ title: 'Answer accepted!' });
    } catch (error) {
      toast({ title: 'Failed to accept answer.', variant: 'destructive' });
    }
  };

  return (
    <div className={cn("flex gap-6 border-t pt-6", isAccepted && "bg-green-500/10 p-4 rounded-lg")}>
      <div className="flex flex-col items-center">
        <VoteControl 
            upvotes={answer.upvotes} 
            downvotes={answer.downvotes}
            docPath={`questions/${questionId}/answers/${answer.id}`}
        />
        {isAccepted && (
          <div className="mt-2" title="Accepted Answer">
            <CheckCircle className="h-7 w-7 text-green-600" />
          </div>
        )}
        {isQuestionOwner && !isAccepted && (
            <Button variant="outline" size="icon" className="mt-2 h-7 w-7" title="Mark as accepted answer" onClick={handleAcceptAnswer}>
                <CheckCircle className="h-4 w-4 text-muted-foreground hover:text-green-600" />
            </Button>
        )}
      </div>
      <div className="w-full">
        <div className="prose prose-zinc w-full max-w-none dark:prose-invert">
          <p>{answer.content}</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            {/* Action buttons like edit/delete could go here */}
          </div>
          <div className="flex w-full items-center justify-end sm:w-auto">
            {author && (
              <div className="rounded-md bg-secondary p-3 text-sm w-full sm:w-auto">
                  <div className="mb-2 flex items-center gap-2">
                      <Link href={`/profile/${author?.id}`}>
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                              <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                      </Link>
                      <div>
                          <Link href={`/profile/${author?.id}`} className="font-semibold text-foreground hover:underline">
                              {author?.name}
                          </Link>
                          <p className="text-muted-foreground">{author?.reputation.toLocaleString()} reputation</p>
                      </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                      answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                  </p>
              </div>
            )}
          </div>
        </div>
        <CommentList answerId={answer.id} questionId={questionId} />
      </div>
    </div>
  );
}

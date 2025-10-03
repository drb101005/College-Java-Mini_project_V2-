'use client';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import type { Comment, User } from '@/lib/types';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface CommentItemProps {
  comment: Comment;
  questionId: string;
  answerId: string;
}

function CommentItem({ comment, questionId, answerId }: CommentItemProps) {
  const firestore = useFirestore();
  const authorRef = useMemoFirebase(() => {
    if (!firestore || !comment.authorId) return null;
    return doc(firestore, 'users', comment.authorId);
  }, [firestore, comment.authorId]);
  const { data: author } = useDoc<User>(authorRef);

  if (!author) return null;

  return (
    <li className="flex items-start gap-2 text-sm">
        <Avatar className="h-6 w-6 mt-0.5">
            <AvatarImage src={author?.avatarUrl} alt={author?.name} />
            <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <span className="font-semibold">{author?.name}</span>
            <span className="text-muted-foreground mx-1">&middot;</span>
            <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            <p className="text-foreground/90">{comment.content}</p>
        </div>
    </li>
  );
}


interface CommentListProps {
  questionId: string;
  answerId: string;
}

export function CommentList({ questionId, answerId }: CommentListProps) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `questions/${questionId}/answers/${answerId}/comments`);
  }, [firestore, questionId, answerId]);
  const { data: comments } = useCollection<Comment>(commentsQuery);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || newComment.trim() === '') return;

    setIsSubmitting(true);
    const commentCollectionRef = collection(firestore, `questions/${questionId}/answers/${answerId}/comments`);
    
    try {
      await addDocumentNonBlocking(commentCollectionRef, {
        content: newComment,
        authorId: user.id,
        createdAt: new Date().toISOString(),
      });
      setNewComment('');
    } catch (error) {
        toast({title: 'Failed to add comment', variant: 'destructive'})
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <ul className="space-y-3">
        {comments?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} questionId={questionId} answerId={answerId} />
        ))}
      </ul>
      {user && (
        <form className="mt-4 flex items-center gap-2" onSubmit={handleSubmitComment}>
            <Input 
                placeholder="Add a comment..." 
                className="h-9" 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
            />
            <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? '...' : 'Add'}
            </Button>
        </form>
      )}
    </div>
  );
}

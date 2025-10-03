'use client';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-provider';
import type { Comment, User } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getComments, postComment, getUser } from '@/lib/data';
import Link from 'next/link';

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  const [author, setAuthor] = useState<User | null>(null);

  useEffect(() => {
    getUser(comment.authorId).then(setAuthor);
  }, [comment.authorId]);


  if (!author) return null;

  return (
    <li className="flex items-start gap-2 text-sm">
        <Link href={`/profile/${author.id}`}>
            <Avatar className="h-6 w-6 mt-0.5">
                <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
        </Link>
        <div className="flex-1">
            <Link href={`/profile/${author.id}`} className="font-semibold">{author?.name}</Link>
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    getComments(answerId).then(setComments);
  }, [answerId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || newComment.trim() === '') return;

    setIsSubmitting(true);
    
    try {
      const createdComment = await postComment(answerId, user.id, newComment);
      setComments(prev => [...prev, createdComment]);
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
            <CommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
      {user ? (
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
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">Log in</Link> to add a comment.
        </p>
      )}
    </div>
  );
}

'use client';
import type { Question, User } from '@/lib/types';
import { TagBadge } from './tag-badge';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { VoteControl } from './vote-control';
import { Button } from '../ui/button';
import { Bookmark } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface QuestionDetailsProps {
  question: Question;
  author: User | undefined | null;
}

export function QuestionDetails({ question, author }: QuestionDetailsProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{question.title}</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmark
            </Button>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-4 border-b pb-4 text-sm text-muted-foreground">
        <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
        <span>Viewed {(question.views || 0).toLocaleString()} times</span>
      </div>
      <div className="flex gap-6">
        <VoteControl 
            upvotes={question.upvotes || 0} 
            downvotes={question.downvotes || 0}
            onVote={() => {}}
        />
        <div className="prose prose-zinc w-full max-w-none dark:prose-invert">
          <p>{question.description}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(question.tags || []).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <div className="flex w-full items-center justify-end sm:w-auto">
            {author ? (
                <div className="rounded-md bg-secondary p-3 text-sm">
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
                        asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                    </p>
                </div>
            ) : <Skeleton className="h-20 w-48" />}
        </div>
      </div>
    </div>
  );
}

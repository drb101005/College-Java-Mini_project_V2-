'use client';
import type { Question, User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TagBadge } from './tag-badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { StatsBadge } from './stats-badge';
import { ThumbsUp, MessageSquare, Eye } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getUser } from '@/lib/data';
import { useEffect, useState } from 'react';

interface QuestionCardProps {
  question: Question;
  onSelectQuestion: (questionId: string) => void;
}

export function QuestionCard({ question, onSelectQuestion }: QuestionCardProps) {
  const [author, setAuthor] = useState<User | null>(null);
  const [isLoadingAuthor, setIsLoadingAuthor] = useState(true);

  useEffect(() => {
    setIsLoadingAuthor(true);
    getUser(question.authorId).then(user => {
      setAuthor(user);
      setIsLoadingAuthor(false);
    });
  }, [question.authorId]);


  const totalVotes = (question.upvotes || 0) - (question.downvotes || 0);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent interfering with clicks on links inside the card
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    onSelectQuestion(question.id);
  };

  return (
    <Card 
        className="hover:border-primary/50 transition-colors cursor-pointer"
        onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
          <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-2">
            {isLoadingAuthor ? (
                <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
                <Link href={`/profile/${author?.id}`} className="flex-shrink-0">
                <Avatar>
                    <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                    <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                </Link>
            )}
            <div className="sm:hidden">
              {isLoadingAuthor ? <Skeleton className="h-4 w-24" /> : (
                <Link href={`/profile/${author?.id}`} className="font-semibold hover:underline">
                    {author?.name}
                </Link>
              )}
              <p className="text-xs text-muted-foreground">
                asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="font-headline text-xl font-semibold tracking-tight hover:text-primary transition-colors">
              {question.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {(question.tags || []).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="hidden items-center gap-2 sm:flex">
                {isLoadingAuthor ? <Skeleton className="h-4 w-32" /> : (
                    <Link href={`/profile/${author?.id}`} className="text-sm font-semibold hover:underline">
                    {author?.name}
                    </Link>
                )}
                <span className="text-sm text-muted-foreground">
                  • asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <StatsBadge count={totalVotes} label="Votes" icon={<ThumbsUp size={16} />} />
                <StatsBadge count={question.answerCount || 0} label="Answers" icon={<MessageSquare size={16} />} />
                <StatsBadge count={question.views || 0} label="Views" icon={<Eye size={16} />} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import type { Question } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TagBadge } from './tag-badge';
import Link from 'next/link';
import { mockUsers } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { StatsBadge } from './stats-badge';
import { ThumbsUp, MessageSquare, Eye } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const author = mockUsers.find((user) => user.id === question.authorId);
  const totalVotes = question.upvotes - question.downvotes;

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
          <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-2">
            <Link href={`/profile/${author?.id}`} className="flex-shrink-0">
              <Avatar>
                <AvatarImage src={author?.avatarUrl} alt={author?.name} />
                <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="sm:hidden">
              <Link href={`/profile/${author?.id}`} className="font-semibold hover:underline">
                {author?.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Link href={`/questions/${question.id}`}>
              <h2 className="font-headline text-xl font-semibold tracking-tight hover:text-primary transition-colors">
                {question.title}
              </h2>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {question.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="hidden items-center gap-2 sm:flex">
                <Link href={`/profile/${author?.id}`} className="text-sm font-semibold hover:underline">
                  {author?.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  • asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <StatsBadge count={totalVotes} label="Votes" icon={<ThumbsUp size={16} />} />
                <StatsBadge count={2} label="Answers" icon={<MessageSquare size={16} />} />
                <StatsBadge count={question.views} label="Views" icon={<Eye size={16} />} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

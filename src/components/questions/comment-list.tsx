import { mockComments, mockUsers } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CommentListProps {
  answerId: string;
}

export function CommentList({ answerId }: CommentListProps) {
  const comments = mockComments.filter((c) => c.answerId === answerId);

  return (
    <div className="mt-4 border-t pt-4">
      <ul className="space-y-3">
        {comments.map((comment) => {
          const author = mockUsers.find((u) => u.id === comment.authorId);
          return (
            <li key={comment.id} className="flex items-start gap-2 text-sm">
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
        })}
      </ul>
      <form className="mt-4 flex items-center gap-2">
        <Input placeholder="Add a comment..." className="h-9" />
        <Button type="submit" size="sm">Add</Button>
      </form>
    </div>
  );
}

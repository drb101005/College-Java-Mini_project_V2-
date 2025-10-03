'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { askQuestion } from '@/lib/data';

export function AskQuestionForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: 'You must be logged in to ask a question.', variant: 'destructive'});
        return;
    }

    if (title && description && tags.length > 0) {
      setIsSubmitting(true);
      
      try {
        const newQuestion = await askQuestion({
            title,
            description,
            tags,
            authorId: user.id
        });
        
        toast({
          title: 'Question Posted!',
          description: 'Your question is now live.',
        });
        
        router.push(`/`); // Go back to home page to see the question
      } catch (error) {
        console.error("Error adding document: ", error);
        toast({
          title: 'Error',
          description: 'Could not post your question. Please try again.',
          variant: 'destructive'
        });
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill out the title, description, and add at least one tag.',
        variant: 'destructive'
      });
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">Title</Label>
            <p className="text-sm text-muted-foreground">Be specific and imagine you’re asking a question to another person.</p>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., How to implement authentication in Next.js?" disabled={isSubmitting}/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">Description</Label>
            <p className="text-sm text-muted-foreground">Include all the information someone would need to answer your question.</p>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={10} disabled={isSubmitting}/>
          </div>

           <div className="space-y-2">
            <Label htmlFor="tags" className="text-base font-semibold">Tags</Label>
            <p className="text-sm text-muted-foreground">Add up to 5 tags to describe what your question is about.</p>
            <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
                {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="rounded-full hover:bg-muted-foreground/20">
                            <X size={12} />
                        </button>
                    </Badge>
                ))}
                <Input 
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={tags.length < 5 ? 'Add a tag...' : ''}
                    className="flex-1 border-none shadow-none focus-visible:ring-0"
                    disabled={tags.length >= 5 || isSubmitting}
                />
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : 'Post Your Question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

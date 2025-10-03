'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestTags } from '@/ai/flows/ai-suggest-tags';
import { useDebounce } from '@/hooks/use-debounce';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { Question } from '@/lib/types';

export function AskQuestionForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const debouncedDescription = useDebounce(description, 1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (debouncedDescription.trim().length > 50) {
      setIsSuggesting(true);
      suggestTags({ question: debouncedDescription })
        .then(result => {
          setSuggestedTags(result.tags.filter(t => !tags.includes(t)));
        })
        .catch(() => {
          toast({
            title: "Couldn't fetch AI suggestions.",
            description: "Please check your API key or try again later.",
            variant: "destructive"
          });
        })
        .finally(() => setIsSuggesting(false));
    } else {
      setSuggestedTags([]);
    }
  }, [debouncedDescription, tags, toast]);

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
  
  const addTag = (tagToAdd: string) => {
    if (!tags.includes(tagToAdd)) {
        setTags([...tags, tagToAdd]);
    }
    setSuggestedTags(suggestedTags.filter(t => t !== tagToAdd));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
        toast({ title: 'You must be logged in to ask a question.', variant: 'destructive'});
        return;
    }

    if (title && description && tags.length > 0) {
      setIsSubmitting(true);
      
      const newQuestion: Omit<Question, 'id'> = {
        title,
        description,
        tags,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSolved: false,
        views: 0,
        upvotes: 0,
        downvotes: 0,
        answerCount: 0,
      };

      try {
        const questionsCollection = collection(firestore, 'questions');
        const docRef = await addDoc(questionsCollection, newQuestion);
        
        toast({
          title: 'Question Posted!',
          description: 'Your question is now live.',
        });
        
        router.push(`/questions/${docRef.id}`);
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
            {isSuggesting || suggestedTags.length > 0 ? (
                <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">AI Suggestions</Label>
                        {isSuggesting && <Loader2 size={16} className="animate-spin text-primary" />}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestedTags.map(tag => (
                            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent/50" onClick={() => addTag(tag)}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            ) : null}
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

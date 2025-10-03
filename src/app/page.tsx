'use client';

import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { QuestionCard } from '@/components/questions/question-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagBadge } from '@/components/questions/tag-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Question } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { QuestionView } from '@/components/questions/question-view';

export default function Home() {
  const firestore = useFirestore();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const questionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'questions');
  }, [firestore]);
  const { data: questions, isLoading: isLoadingQuestions } = useCollection<Question>(questionsQuery);
  
  const popularTags = useMemo(() => {
    if (!questions) return [];
    const tagCounts = questions.flatMap(q => q.tags || []).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [questions]);
  
  const selectedQuestion = useMemo(() => {
    return questions?.find(q => q.id === selectedQuestionId);
  }, [questions, selectedQuestionId]);


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4">
          <div className="md:col-span-3">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <h1 className="font-headline text-3xl font-bold tracking-tight">All Questions</h1>
              <Link href="/ask-question">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ask Question
                </Button>
              </Link>
            </div>

            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <div className="relative w-full sm:max-w-xs">
                <Input placeholder="Search questions..." className="pr-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {isLoadingQuestions && (
                <>
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </>
              )}
              {questions?.map((question) => (
                <QuestionCard 
                    key={question.id} 
                    question={question} 
                    onSelectQuestion={setSelectedQuestionId}
                />
              ))}
            </div>
          </div>

          <aside className="space-y-8 md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {isLoadingQuestions ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  popularTags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
       <Dialog open={!!selectedQuestionId} onOpenChange={(isOpen) => !isOpen && setSelectedQuestionId(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            {selectedQuestion ? (
                <>
                <DialogHeader>
                    <DialogTitle className="truncate pr-8">{selectedQuestion.title}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-6 -mr-6">
                    <QuestionView questionId={selectedQuestion.id} />
                </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p>Loading question...</p>
                </div>
            )}
        </DialogContent>
       </Dialog>
    </div>
  );
}

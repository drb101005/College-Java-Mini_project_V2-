'use client';
import { notFound } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { QuestionDetails } from '@/components/questions/question-details';
import { AnswerSection } from '@/components/questions/answer-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, collection, query, where, limit, updateDoc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Question, Answer, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useEffect } from 'react';

export default function QuestionPage({ params: { id } }: { params: { id: string } }) {
  const firestore = useFirestore();

  const questionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'questions', id);
  }, [firestore, id]);
  const { data: question, isLoading: isLoadingQuestion } = useDoc<Question>(questionRef);

  useEffect(() => {
    if (questionRef && question) {
      updateDoc(questionRef, {
        views: (question.views || 0) + 1,
      });
    }
  }, [questionRef, question]);

  const authorRef = useMemoFirebase(() => {
    if (!firestore || !question?.authorId) return null;
    return doc(firestore, 'users', question.authorId);
  }, [firestore, question?.authorId]);
  const { data: author, isLoading: isLoadingAuthor } = useDoc<User>(authorRef);

  const answersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `questions/${id}/answers`);
  }, [firestore, id]);
  const { data: answers, isLoading: isLoadingAnswers } = useCollection<Answer>(answersQuery);

  const relatedQuestionsQuery = useMemoFirebase(() => {
    if (!firestore || !question?.tags || question.tags.length === 0) return null;
    return query(
      collection(firestore, 'questions'),
      where('tags', 'array-contains-any', question.tags),
      where('id', '!=', question.id),
      limit(5)
    );
  }, [firestore, question]);
  const { data: relatedQuestions, isLoading: isLoadingRelated } = useCollection<Question>(relatedQuestionsQuery);
  
  const isLoading = isLoadingQuestion || isLoadingAuthor || isLoadingAnswers || isLoadingRelated;

  if (isLoading) {
    return (
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background">
             <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4">
                <div className="md:col-span-3 space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <aside className="space-y-8 md:col-span-1">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-48 w-full" />
                </aside>
             </div>
          </main>
          <Footer />
        </div>
    )
  }

  if (!question) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4">
          <div className="md:col-span-3">
            <QuestionDetails question={question} author={author} />
            <AnswerSection answers={answers || []} question={question} />
          </div>
          <aside className="space-y-8 md:col-span-1">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Question Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Votes</span>
                  <span className="font-bold">{(question.upvotes || 0) - (question.downvotes || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Answers</span>
                  <span className="font-bold">{answers?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-bold">{(question.views || 0).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            {relatedQuestions && relatedQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Related Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {relatedQuestions.filter(rq => rq.id !== question.id).map(rq => (
                        <li key={rq.id}>
                            <Link href={`/questions/${rq.id}`} className="text-sm text-primary hover:underline">
                                {rq.title}
                            </Link>
                        </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

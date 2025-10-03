'use client';

import { notFound } from 'next/navigation';
import { QuestionDetails } from '@/components/questions/question-details';
import { AnswerSection } from '@/components/questions/answer-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, collection, query, where, limit, updateDoc, increment } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Question, Answer, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useEffect } from 'react';

export function QuestionView({ questionId }: { questionId: string }) {
  const firestore = useFirestore();

  const questionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'questions', questionId);
  }, [firestore, questionId]);
  const { data: question, isLoading: isLoadingQuestion } = useDoc<Question>(questionRef);

  useEffect(() => {
    if (questionRef && question) {
      updateDoc(questionRef, {
        views: increment(1),
      }).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]); // Run only when the questionId changes

  const authorRef = useMemoFirebase(() => {
    if (!firestore || !question?.authorId) return null;
    return doc(firestore, 'users', question.authorId);
  }, [firestore, question?.authorId]);
  const { data: author, isLoading: isLoadingAuthor } = useDoc<User>(authorRef);

  const answersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `questions/${questionId}/answers`);
  }, [firestore, questionId]);
  const { data: answers, isLoading: isLoadingAnswers } = useCollection<Answer>(answersQuery);

  const relatedQuestionsQuery = useMemoFirebase(() => {
    if (!firestore || !question?.tags || question.tags.length === 0) return null;
    return query(
      collection(firestore, 'questions'),
      where('tags', 'array-contains-any', question.tags),
      where('id', '!=', question.id),
      limit(5)
    );
  }, [firestore, question?.tags, question?.id]);
  const { data: relatedQuestions, isLoading: isLoadingRelated } = useCollection<Question>(relatedQuestionsQuery);
  
  if (isLoadingQuestion) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!question) {
    return <p className="text-center text-destructive">Question not found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <div className="md:col-span-3">
        <QuestionDetails question={question} author={author} />
        {isLoadingAnswers ? <Skeleton className="h-64 w-full" /> : <AnswerSection answers={answers || []} question={question!} />}
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
        {isLoadingRelated ? <Skeleton className="h-48 w-full" /> : (
          relatedQuestions && relatedQuestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Related Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {relatedQuestions.filter(rq => rq.id !== question!.id).map(rq => (
                    <li key={rq.id}>
                        {/* In a real app, this would open another dialog. For now, it does nothing. */}
                        <span className="text-sm text-primary cursor-pointer hover:underline">
                            {rq.title}
                        </span>
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          )
        )}
      </aside>
    </div>
  );
}

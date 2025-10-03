'use client';

import { QuestionDetails } from '@/components/questions/question-details';
import { AnswerSection } from '@/components/questions/answer-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Question, Answer, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { getQuestion, getAnswers, getRelatedQuestions, incrementQuestionView, getUser } from '@/lib/data';

export function QuestionView({ questionId }: { questionId: string }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    const fetchedQuestion = await getQuestion(questionId);
    if (!fetchedQuestion) {
      setIsLoading(false);
      return;
    }

    incrementQuestionView(questionId);

    const [fetchedAuthor, fetchedAnswers, fetchedRelated] = await Promise.all([
      getUser(fetchedQuestion.authorId),
      getAnswers(questionId),
      getRelatedQuestions(fetchedQuestion)
    ]);
    
    setQuestion(fetchedQuestion);
    setAuthor(fetchedAuthor as User | null);
    setAnswers(fetchedAnswers);
    setRelatedQuestions(fetchedRelated);

    setIsLoading(false);
  }, [questionId]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  if (isLoading) {
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
        <AnswerSection answers={answers || []} question={question} onAnswerPosted={fetchData} />
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
        )}
      </aside>
    </div>
  );
}

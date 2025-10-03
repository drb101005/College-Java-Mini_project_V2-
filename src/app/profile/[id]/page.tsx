'use client';
import { notFound } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import type { User, Question, Answer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getUser, getQuestionsByAuthor, getAnswersByAuthor } from '@/lib/data';

export default function ProfilePage({ params: { id } }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const fetchedUser = await getUser(id);
      if (fetchedUser) {
        setUser(fetchedUser);
        const [fetchedQuestions, fetchedAnswers] = await Promise.all([
            getQuestionsByAuthor(id),
            getAnswersByAuthor(id),
        ]);
        setQuestions(fetchedQuestions);
        setAnswers(fetchedAnswers);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [id]);


  if (isLoading) {
    return (
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background">
            <div className="container mx-auto max-w-5xl px-4 py-8">
              <Skeleton className="h-48 w-full mb-8" />
              <Skeleton className="h-64 w-full" />
            </div>
          </main>
          <Footer />
        </div>
    )
  }
  
  if (!user) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <ProfileHeader user={user} questionCount={questions.length} answerCount={answers.length} />
          <ProfileTabs questions={questions} answers={answers} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

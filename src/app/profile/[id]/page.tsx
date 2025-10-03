'use client';
import { notFound } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { User, Question, Answer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'users', params.id);
  }, [firestore, params.id]);
  const { data: user, isLoading: isLoadingUser } = useDoc<User>(userRef);

  const questionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'questions'), where('authorId', '==', params.id));
  }, [firestore, params.id]);
  const { data: questions, isLoading: isLoadingQuestions } = useCollection<Question>(questionsQuery);

  const answersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'answers'), where('authorId', '==', params.id));
  }, [firestore, params.id]);
  const { data: answers, isLoading: isLoadingAnswers } = useCollection<Answer>(answersQuery);

  if (isLoadingUser || isLoadingQuestions || isLoadingAnswers) {
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
          <ProfileHeader user={user} questionCount={questions?.length || 0} answerCount={answers?.length || 0} />
          <ProfileTabs questions={questions || []} answers={answers || []} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

'use client';
import { AskQuestionForm } from '@/components/questions/ask-question-form';
import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';
import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AskQuestionPage() {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'You need to be logged in to ask a question.',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [user, isUserLoading, router, toast]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold tracking-tight">Ask a Public Question</h1>
          </div>
          <AskQuestionForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

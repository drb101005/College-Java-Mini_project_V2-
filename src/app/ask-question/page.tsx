'use client';
import { AskQuestionForm } from '@/components/questions/ask-question-form';
import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';
import { useAuth } from '@/contexts/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
        action: <Button asChild variant="secondary"><Link href="/login">Login</Link></Button>
      });
    }
  }, [user, isUserLoading, router, toast]);

  if (isUserLoading) {
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
          {user ? (
            <AskQuestionForm />
          ) : (
             <Card>
                <CardHeader>
                    <CardTitle>Please Log In</CardTitle>
                    <CardDescription>You need to be logged in to ask a question. Please log in or create an account to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Button asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                         <Button asChild variant="secondary">
                            <Link href="/register">Sign Up</Link>
                        </Button>
                    </div>
                </CardContent>
             </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

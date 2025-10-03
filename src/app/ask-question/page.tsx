import { AskQuestionForm } from '@/components/questions/ask-question-form';
import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';

export default function AskQuestionPage() {
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

import { notFound } from 'next/navigation';
import { mockUsers, mockQuestions, mockAnswers } from '@/lib/data';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = mockUsers.find((u) => u.id === params.id);
  
  if (!user) {
    notFound();
  }
  
  const questions = mockQuestions.filter(q => q.authorId === user.id);
  const answers = mockAnswers.filter(a => a.authorId === user.id);

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

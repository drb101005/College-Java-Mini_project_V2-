import { notFound } from 'next/navigation';
import { mockQuestions, mockAnswers, mockUsers } from '@/lib/data';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { QuestionDetails } from '@/components/questions/question-details';
import { AnswerSection } from '@/components/questions/answer-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagBadge } from '@/components/questions/tag-badge';

export default function QuestionPage({ params }: { params: { id: string } }) {
  const question = mockQuestions.find((q) => q.id === params.id);

  if (!question) {
    notFound();
  }

  const answers = mockAnswers.filter((a) => a.questionId === question.id);
  const author = mockUsers.find((u) => u.id === question.authorId);

  // Suggest related questions based on tags (simple logic)
  const relatedQuestions = mockQuestions
    .filter(
      (q) =>
        q.id !== question.id && q.tags.some((tag) => question.tags.includes(tag))
    )
    .slice(0, 5);


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4">
          <div className="md:col-span-3">
            <QuestionDetails question={question} author={author} />
            <AnswerSection answers={answers} question={question} />
          </div>
          <aside className="space-y-8 md:col-span-1">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Question Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Votes</span>
                  <span className="font-bold">{question.upvotes - question.downvotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Answers</span>
                  <span className="font-bold">{answers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-bold">{question.views.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            {relatedQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Related Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {relatedQuestions.map(rq => (
                        <li key={rq.id}>
                            <a href={`/questions/${rq.id}`} className="text-sm text-primary hover:underline">
                                {rq.title}
                            </a>
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

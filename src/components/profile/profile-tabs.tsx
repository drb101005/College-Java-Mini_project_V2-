import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Question, Answer } from "@/lib/types";
import { QuestionCard } from "../questions/question-card";
import { Card, CardContent } from "../ui/card";
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";
import { mockQuestions } from "@/lib/data";

interface ProfileTabsProps {
    questions: Question[];
    answers: Answer[];
}

export function ProfileTabs({ questions, answers }: ProfileTabsProps) {

  return (
    <Tabs defaultValue="questions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
        <TabsTrigger value="answers">Answers ({answers.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="questions" className="mt-4 space-y-4">
        {questions.length > 0 ? (
            questions.map(q => <QuestionCard key={q.id} question={q} />)
        ) : (
            <p className="text-center text-muted-foreground py-8">No questions asked yet.</p>
        )}
      </TabsContent>
      <TabsContent value="answers" className="mt-4 space-y-4">
        {answers.length > 0 ? (
            answers.map(answer => {
                const question = mockQuestions.find(q => q.id === answer.questionId);
                return (
                    <Card key={answer.id}>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">Answered on <Link href={`/questions/${question?.id}`} className="text-primary hover:underline">{question?.title}</Link></p>
                            <p className="mt-2 text-foreground/90 line-clamp-3">{answer.content}</p>
                            <p className="mt-2 text-xs text-muted-foreground">answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</p>
                        </CardContent>
                    </Card>
                )
            })
        ) : (
             <p className="text-center text-muted-foreground py-8">No answers posted yet.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}

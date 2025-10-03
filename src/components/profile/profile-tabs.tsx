'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Question, Answer } from "@/lib/types";
import { QuestionCard } from "../questions/question-card";
import { Card, CardContent } from "../ui/card";
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase";

interface AnswerItemProps {
    answer: Answer;
}

function AnswerItem({ answer }: AnswerItemProps) {
    const firestore = useFirestore();
    const questionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'questions', answer.questionId);
    }, [firestore, answer.questionId]);
    const { data: question } = useDoc<Question>(questionRef);

    if (!question) {
        return (
            <Card>
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Answer on a question</p>
                    <p className="mt-2 text-foreground/90 line-clamp-3">{answer.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                    Answered on <Link href={`/questions/${question?.id}`} className="text-primary hover:underline">{question?.title || 'a question'}</Link>
                </p>
                <p className="mt-2 text-foreground/90 line-clamp-3">{answer.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</p>
            </CardContent>
        </Card>
    );
}

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
            questions.map(q => <QuestionCard key={q.id} question={q} onSelectQuestion={() => {}} />)
        ) : (
            <p className="text-center text-muted-foreground py-8">No questions asked yet.</p>
        )}
      </TabsContent>
      <TabsContent value="answers" className="mt-4 space-y-4">
        {answers.length > 0 ? (
            answers.map(answer => <AnswerItem key={answer.id} answer={answer} />)
        ) : (
             <p className="text-center text-muted-foreground py-8">No answers posted yet.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}

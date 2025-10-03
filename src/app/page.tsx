import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { mockQuestions, mockUsers, mockTags } from '@/lib/data';
import { QuestionCard } from '@/components/questions/question-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TagBadge } from '@/components/questions/tag-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  const topContributors = mockUsers
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 5);

  const popularTags = Object.entries(
    mockQuestions.flatMap((q) => q.tags).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4">
          <div className="md:col-span-3">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <h1 className="font-headline text-3xl font-bold tracking-tight">All Questions</h1>
              <Link href="/ask-question">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ask Question
                </Button>
              </Link>
            </div>

            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <div className="relative w-full sm:max-w-xs">
                <Input placeholder="Search questions..." className="pr-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {mockQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          </div>

          <aside className="space-y-8 md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {topContributors.map((user) => (
                    <li key={user.id} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.reputation} points</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

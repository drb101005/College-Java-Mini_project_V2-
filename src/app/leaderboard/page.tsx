import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { mockUsers } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal } from 'lucide-react';

export default function LeaderboardPage() {
  const sortedUsers = [...mockUsers].sort((a, b) => b.reputation - a.reputation);

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400';
    if (rank === 1) return 'text-gray-400';
    if (rank === 2) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight">Leaderboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              See who the top contributors are in the NexusLearn community.
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {sortedUsers.map((user, index) => (
                  <li key={user.id} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                    <div className="flex items-center gap-4">
                      <div className="flex w-12 items-center justify-center gap-1">
                        <span className={`text-xl font-bold ${getRankColor(index)}`}>{index + 1}</span>
                        {index < 3 && <Medal size={20} className={getRankColor(index)} />}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-lg text-primary">{user.reputation.toLocaleString()}</p>
                       <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

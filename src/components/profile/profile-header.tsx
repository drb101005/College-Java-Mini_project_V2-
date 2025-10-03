'use client';

import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-provider';
import { Mail, Calendar, GraduationCap, Building } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileHeaderProps {
  user: User;
  questionCount: number;
  answerCount: number;
}

export function ProfileHeader({ user, questionCount, answerCount }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="mb-8 rounded-lg border bg-card p-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
            <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                        <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    {isOwnProfile && <Button variant="outline">Edit Profile</Button>}
                </div>
                <p className="mt-4 text-foreground/80">{user.bio}</p>
                 <div className="mt-4 flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                </div>
            </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6 text-sm sm:grid-cols-4">
            <div className="flex items-center gap-2">
                <Building size={16} className="text-muted-foreground" />
                <span>{user.department}</span>
            </div>
            {user.year && (
                 <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-muted-foreground" />
                    <span>{user.year}{user.year === 1 ? 'st' : user.year === 2 ? 'nd' : user.year === 3 ? 'rd' : 'th'} year</span>
                </div>
            )}
             <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span>Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span>
            </div>
        </div>
    </div>
  );
}

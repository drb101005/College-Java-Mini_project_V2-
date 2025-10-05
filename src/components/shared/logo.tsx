import Link from 'next/link';
import { BookMarked } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <BookMarked className="h-7 w-7 text-primary" />
      <span className="hidden font-headline text-xl font-bold text-foreground sm:inline-block">
        Student Query Hub
      </span>
    </Link>
  );
}

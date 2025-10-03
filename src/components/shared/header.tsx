import { Logo } from '@/components/shared/logo';
import { DarkModeToggle } from '@/components/shared/dark-mode-toggle';
import { UserNav } from '@/components/shared/user-nav';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Logo />
        <nav className="ml-6 hidden items-center space-x-4 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Questions
            </Link>
             <Link href="/tags" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Tags
            </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="relative hidden w-full max-w-sm lg:block">
            <Input
              type="search"
              placeholder="Search questions..."
              className="h-9 pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <DarkModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

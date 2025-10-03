'use client';

import { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import type { User as AppUser } from '@/lib/types';
import { users } from '@/lib/data';

interface AuthContextType {
  user: AppUser | null;
  isUserLoading: boolean;
  login: (email: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    // Check if a user session exists in localStorage
    const storedUser = localStorage.getItem('nexuslearn-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsUserLoading(false);
  }, []);

  const login = (email: string): boolean => {
    // This is a fake login. In a real app, you'd validate credentials.
    // For the demo, we'll find a user by email or default to the first mock user.
    const mockUser = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users[0];
    if (mockUser) {
        setUser(mockUser);
        localStorage.setItem('nexuslearn-user', JSON.stringify(mockUser));
        return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexuslearn-user');
  };

  const value = useMemo(() => ({ user, isUserLoading, login, logout }), [user, isUserLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

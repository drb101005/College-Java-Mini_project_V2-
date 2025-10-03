"use client";

import { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = (email: string) => {
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      return true;
    }
    toast({
        title: "Login Failed",
        description: "User not found. Please try again.",
        variant: "destructive",
      });
    return false;
  };

  const logout = () => {
    setUser(null);
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

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

"use client";

import { createContext, useContext, ReactNode, useMemo, useEffect, useState } from 'react';
import type { User as AppUser } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth as useFirebaseAuth, useUser as useFirebaseUser, useFirestore } from '@/firebase';

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  isUserLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
  signup: (name: string, email: string, department: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const { user: firebaseUser, isUserLoading } = useFirebaseUser();
  const [appUser, setAppUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (firebaseUser) {
      // This is where you would fetch the user profile from Firestore
      // For now, we'll create a mock AppUser from the FirebaseUser
      const newUser: AppUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'New User',
        email: firebaseUser.email!,
        avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200/200`,
        role: 'student', // default role
        department: 'Not specified',
        bio: '',
        skills: [],
        reputation: 0,
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
      };
      setAppUser(newUser);
    } else {
      setAppUser(null);
    }
  }, [firebaseUser]);

  const login = (email: string) => {
    // NOTE: In a real app, you'd collect a password.
    // This mock login is being replaced. We'll just use a dummy password.
    initiateEmailSignIn(auth, email, "password123");
  };

  const signup = async (name: string, email: string, department: string) => {
    try {
      // NOTE: In a real app, you'd collect a password.
      // We will use a dummy password for now.
      await initiateEmailSignUp(auth, email, "password123");
      
      // Because onAuthStateChanged will handle the user state,
      // we can get the user from auth.currentUser after a short delay.
      // A better approach is to use onAuthStateChanged to trigger user profile creation.
      
      setTimeout(async () => {
        const user = auth.currentUser;
        if (user) {
          const userProfile: AppUser = {
            id: user.uid,
            name: name,
            email: user.email!,
            avatarUrl: `https://picsum.photos/seed/${user.uid}/200/200`,
            role: 'student',
            department: department,
            year: 1,
            bio: 'New user on NexusLearn!',
            skills: [],
            reputation: 0,
            createdAt: new Date().toISOString(),
          };

          await setDoc(doc(firestore, "users", user.uid), userProfile);

          toast({
            title: "Account Created",
            description: "Welcome to NexusLearn!",
          });
        }
      }, 1000);


    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    signOut(auth);
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
  };

  const value = useMemo(() => ({ user: appUser, firebaseUser, isUserLoading, login, logout, signup }), [appUser, firebaseUser, isUserLoading]);

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

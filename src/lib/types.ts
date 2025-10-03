
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'student' | 'teacher' | 'admin';
  department: string;
  year?: number; // Optional for teachers/admins
  bio: string;
  skills: string[];
  reputation: number;
  createdAt: string;
};

export type Question = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isSolved: boolean;
  acceptedAnswerId?: string;
  views: number;
  upvotes: number;
  downvotes: number;
  answerCount: number;
};

export type Answer = {
  id: string;
  questionId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
};

export type Comment = {
  id: string;
  answerId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

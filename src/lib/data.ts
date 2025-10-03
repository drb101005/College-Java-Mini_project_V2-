import type { User, Question, Answer, Comment } from './types';
import placeholderData from './placeholder-images.json';

// Utility to get a placeholder image URL
const getAvatar = (id: string) => placeholderData.placeholderImages.find(p => p.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/200/200`;

// --- MOCK USERS ---
export let users: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatarUrl: getAvatar('user-1'),
    role: 'student',
    department: 'Computer Science',
    year: 3,
    bio: 'Third-year CS student passionate about web development and AI. Trying to learn Next.js and Tailwind.',
    skills: ['react', 'next.js', 'typescript', 'python'],
    reputation: 1250,
    createdAt: '2023-08-15T10:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Bob Williams',
    email: 'bob@example.com',
    avatarUrl: getAvatar('user-2'),
    role: 'student',
    department: 'Data Science',
    year: 4,
    bio: 'Final year Data Science student. Interested in machine learning models and data visualization.',
    skills: ['python', 'pandas', 'scikit-learn', 'tensorflow'],
    reputation: 850,
    createdAt: '2023-09-01T14:30:00Z',
  },
  {
    id: 'user-3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    avatarUrl: getAvatar('user-3'),
    role: 'teacher',
    department: 'Software Engineering',
    bio: 'Professor in Software Engineering with 15 years of experience. Specializing in cloud architecture and distributed systems.',
    skills: ['java', 'spring', 'aws', 'docker', 'kubernetes'],
    reputation: 5600,
    createdAt: '2022-01-20T09:00:00Z',
  },
   {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@example.com',
    avatarUrl: getAvatar('user-6'),
    role: 'admin',
    department: 'University Administration',
    bio: 'System administrator for NexusLearn.',
    skills: ['system administration', 'networking', 'firebase'],
    reputation: 9999,
    createdAt: '2022-01-01T00:00:00Z',
  }
];

// --- MOCK QUESTIONS ---
export let questions: Question[] = [
  {
    id: 'q-1',
    title: 'How to handle state management in Next.js 14 with the App Router?',
    description: "I'm building a new application with Next.js 14 and the App Router, and I'm confused about the best way to handle global state. I've read about Server Components and Client Components, but it's unclear how they should share state. Should I use Zustand, Redux, or just React Context? What are the pros and cons of each in this new paradigm?",
    tags: ['next.js', 'react', 'state-management', 'app-router'],
    authorId: 'user-1',
    createdAt: '2024-05-20T10:30:00Z',
    updatedAt: '2024-05-20T12:00:00Z',
    isSolved: true,
    acceptedAnswerId: 'ans-1-2',
    views: 1250,
    upvotes: 45,
    downvotes: 2,
    answerCount: 2,
  },
  {
    id: 'q-2',
    title: 'Best practices for training a custom TensorFlow model with a small dataset?',
    description: 'I have a small dataset of about 500 images for a classification task and I want to train a custom model. I\'m worried about overfitting. What are the best practices to get a good result? Should I use data augmentation, transfer learning, or something else? I\'m using TensorFlow and Keras.',
    tags: ['tensorflow', 'machine-learning', 'data-science', 'overfitting'],
    authorId: 'user-2',
    createdAt: '2024-05-21T14:00:00Z',
    updatedAt: '2024-05-21T14:00:00Z',
    isSolved: false,
    views: 890,
    upvotes: 30,
    downvotes: 1,
    answerCount: 1,
  },
  {
    id: 'q-3',
    title: 'How to deploy a Next.js application to Vercel with environment variables?',
    description: 'I have a Next.js application that uses a database connection string, which I have stored in a `.env.local` file. How do I make sure this variable is available in my production deployment on Vercel? I don\'t want to commit my secret key to git.',
    tags: ['next.js', 'deployment', 'vercel', 'environment-variables'],
    authorId: 'user-1',
    createdAt: '2024-05-18T09:00:00Z',
    updatedAt: '2024-05-18T09:00:00Z',
    isSolved: false,
    views: 2300,
    upvotes: 102,
    downvotes: 0,
    answerCount: 0,
  }
];

// --- MOCK ANSWERS ---
export let answers: Answer[] = [
  {
    id: 'ans-1-1',
    questionId: 'q-1',
    authorId: 'user-2',
    content: 'For simple state that doesn\'t need to be shared across many components, you can often just use React Context with the `useContext` hook. It\'s built into React, so there are no external dependencies. However, it can cause performance issues if the context value changes often, as all consuming components will re-render.',
    createdAt: '2024-05-20T11:00:00Z',
    updatedAt: '2024-05-20T11:00:00Z',
    upvotes: 15,
    downvotes: 1,
  },
  {
    id: 'ans-1-2',
    questionId: 'q-1',
    authorId: 'user-3',
    content: "Excellent question. In the Next.js App Router paradigm, the key is to keep state as close to the leaves of your component tree as possible. Here's my recommendation:\n\n1.  **Use Server Components by default.** Fetch data on the server and pass it down as props. This reduces client-side JavaScript and improves performance.\n2.  **Use React Context for UI state.** For things like theme (dark/light mode) or modal open/close state, a client-side context provider is perfect. Wrap your client components that need this state in the provider.\n3.  **Use Zustand for complex client-side state.** If you have complex client state that is shared between many components and updated frequently, Zustand is a great lightweight option. It avoids the performance pitfalls of context and is much simpler to set up than Redux.\n\nAvoid using Redux unless you're working on a very large-scale application with a team that is already familiar with it. The boilerplate can be overkill for most projects.",
    createdAt: '2024-05-20T11:45:00Z',
    updatedAt: '2024-05-20T11:45:00Z',
    upvotes: 52,
    downvotes: 0,
  },
  {
    id: 'ans-2-1',
    questionId: 'q-2',
    authorId: 'user-3',
    content: "With a small dataset, **transfer learning** is definitely the way to go. Don't train a model from scratch.\n\n1.  **Choose a pre-trained model:** Start with a model like MobileNetV2, ResNet50, or EfficientNet, which has been pre-trained on the large ImageNet dataset.\n2.  **Freeze the base layers:** The early layers of these models have learned to detect general features like edges and textures. You should freeze these layers so their weights don't update during training.\n3.  **Add a custom classification head:** Remove the original top layer of the pre-trained model and add your own new `Dense` layers for your specific classification task.\n4.  **Train only the new head:** Initially, only train the weights of your new classification layers on your dataset.\n5.  **Fine-tuning (optional):** After the head has been trained, you can unfreeze some of the later layers of the base model and re-train the whole thing with a very low learning rate. This allows the model to adapt its feature detection slightly to your specific dataset.\n\nAnd yes, definitely use data augmentation (random rotations, flips, zooms) on your training set to artificially increase its size and make your model more robust.",
    createdAt: '2024-05-21T15:00:00Z',
    updatedAt: '2024-05-21T15:00:00Z',
    upvotes: 25,
    downvotes: 0,
  }
];

// --- MOCK COMMENTS ---
export let comments: Comment[] = [
    {
        id: 'com-1-1',
        answerId: 'ans-1-2',
        authorId: 'user-1',
        content: "This is incredibly helpful, thank you! I think I'll go with Zustand for the more complex parts. The point about keeping state at the leaves makes a lot of sense.",
        createdAt: '2024-05-20T12:00:00Z',
    },
    {
        id: 'com-2-1',
        answerId: 'ans-2-1',
        authorId: 'user-2',
        content: 'Thank you for the detailed breakdown! I was trying to train from scratch and it was a disaster. Transfer learning seems like the right approach.',
        createdAt: '2024-05-21T15:15:00Z',
    },
     {
        id: 'com-2-2',
        answerId: 'ans-2-1',
        authorId: 'user-3',
        content: "You're welcome! It's a common pitfall. Let me know if you run into any issues implementing it.",
        createdAt: '2024-05-21T15:20:00Z',
    }
];

// --- MOCK API FUNCTIONS ---
// These functions simulate asynchronous API calls to a database.

const simulateLatency = (delay: number) => new Promise(res => setTimeout(res, delay));

export async function getQuestions(): Promise<Question[]> {
  await simulateLatency(500);
  return questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getQuestion(id: string): Promise<Question | null> {
  await simulateLatency(300);
  return questions.find(q => q.id === id) || null;
}

export async function getAnswers(questionId: string): Promise<Answer[]> {
  await simulateLatency(400);
  return answers.filter(a => a.questionId === questionId);
}

export async function getComments(answerId: string): Promise<Comment[]> {
    await simulateLatency(200);
    return comments.filter(c => c.answerId === answerId);
}

export async function getUser(id: string): Promise<User | null> {
  await simulateLatency(100);
  return users.find(u => u.id === id) || null;
}

export async function getTags(): Promise<string[]> {
    await simulateLatency(200);
    const tagCounts = questions.flatMap(q => q.tags || []).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
}

export async function getQuestionsByAuthor(authorId: string): Promise<Question[]> {
    await simulateLatency(300);
    return questions.filter(q => q.authorId === authorId);
}

export async function getAnswersByAuthor(authorId: string): Promise<Answer[]> {
    await simulateLatency(300);
    return answers.filter(a => a.authorId === authorId);
}

export async function askQuestion(data: { title: string; description: string; tags: string[]; authorId: string; }): Promise<Question> {
    await simulateLatency(600);
    const newQuestion: Question = {
        id: `q-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSolved: false,
        views: 0,
        upvotes: 0,
        downvotes: 0,
        answerCount: 0,
    };
    questions.unshift(newQuestion);
    return newQuestion;
}

export async function postAnswer(questionId: string, authorId: string, content: string): Promise<Answer> {
    await simulateLatency(500);
    const question = questions.find(q => q.id === questionId);
    if (!question) throw new Error("Question not found");

    const newAnswer: Answer = {
        id: `ans-${Date.now()}`,
        questionId,
        authorId,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
    };
    answers.push(newAnswer);
    question.answerCount++;
    return newAnswer;
}

export async function postComment(answerId: string, authorId: string, content: string): Promise<Comment> {
    await simulateLatency(300);
    const newComment: Comment = {
        id: `com-${Date.now()}`,
        answerId,
        authorId,
        content,
        createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    return newComment;
}

export async function getRelatedQuestions(currentQuestion: Question): Promise<Question[]> {
    await simulateLatency(300);
    return questions.filter(q => 
        q.id !== currentQuestion.id &&
        q.tags.some(tag => currentQuestion.tags.includes(tag))
    ).slice(0, 5);
}

export async function incrementQuestionView(questionId: string) {
    const question = questions.find(q => q.id === questionId);
    if(question) {
        question.views++;
    }
}

export async function acceptAnswer(questionId: string, answerId: string) {
    await simulateLatency(300);
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.isSolved = true;
        question.acceptedAnswerId = answerId;
    }
}

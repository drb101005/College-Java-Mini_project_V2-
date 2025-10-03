# NexusLearn - Student Discussion Forum

NexusLearn is a full-stack web application built with Next.js, designed as a discussion forum where students and teachers can ask and answer academic or project-related questions. All data is mocked and runs locally without a database.

## Core Features

- **User Management**: Mocked user registration and login.
- **Profile Management**: Users can manage their profiles with details like name, bio, and skills.
- **Question & Answer System**: Post questions with titles, descriptions, and tags. Provide, edit, and delete answers.
- **Voting & Acceptance**: Upvote/downvote answers and mark the best one as accepted.
- **Search & Filter**: Filter questions by tags, popularity, or date.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Fully responsive UI for both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

Once the installation is complete, you can run the development server:

```bash
npm run dev
```

This will start the Next.js application, which you can access at [http://localhost:9002](http://localhost:9002).

### How It Works

- The application uses a **mocked authentication system**. You can "log in" by entering any valid email format (e.g., `user@example.com`) on the login page. No password is required.
- All data (users, questions, answers) is static and served from `src/lib/data.ts`. There is no database.

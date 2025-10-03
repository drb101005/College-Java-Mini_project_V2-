# NexusLearn - Student Discussion Forum

NexusLearn is a full-stack web application built with Next.js, designed as a discussion forum where students and teachers can ask and answer academic or project-related questions.

## Core Features

- **User Management**: Mocked user registration and login.
- **Profile Management**: Users can manage their profiles with details like name, bio, and skills.
- **Question & Answer System**: Post questions with titles, descriptions, and tags. Provide, edit, and delete answers.
- **Voting & Acceptance**: Upvote/downvote answers and mark the best one as accepted.
- **AI-Powered Tag Suggestions**: When asking a question, the app suggests relevant tags using Google's Gemini model.
- **Search & Filter**: Filter questions by tags, popularity, or date.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Fully responsive UI for both desktop and mobile devices.
- **Leaderboard**: View top contributors based on reputation.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: Google Gemini via [Genkit](https://firebase.google.com/docs/genkit)

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

3.  **Set up Environment Variables:**

    This project uses Google's Generative AI for tag suggestions. You need to obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    Create a file named `.env.local` in the root of your project and add your API key:

    ```env
    GOOGLE_GENAI_API_KEY=your_google_api_key_here
    ```

### Running the Development Server

Once the installation and setup are complete, you can run the development server:

```bash
npm run dev
```

This will start the Next.js application, which you can access at [http://localhost:9002](http://localhost:9002).

### How It Works

- The application uses a **mocked authentication system**. You can "log in" with any of the user emails found in `src/lib/data.ts`. For example, `alice@example.com`. No password is required.
- All data (users, questions, answers) is static and served from `src/lib/data.ts`. There is no database connection in this build.
- The AI Tag Suggestion feature is live and will make API calls to the Google Gemini model when you type in the description field on the "Ask a Question" page.

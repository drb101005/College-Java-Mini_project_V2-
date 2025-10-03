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

---

## Getting The Code

### Step 1: Push to Your Own GitHub Repository

To get this code into your own GitHub account, run these commands in your terminal from the project's root directory.

1.  **Initialize Git:**
    ```bash
    git init -b main
    ```
2.  **Add all files:**
    ```bash
    git add .
    ```
3.  **Create your first commit:**
    ```bash
    git commit -m "Initial commit"
    ```
4.  **Link to your GitHub repo (replace the URL with your own):**
    ```bash
    git remote add origin <your-github-repository-url>
    ```
5.  **Push the code to GitHub:**
    ```bash
    git push -u origin main
    ```

### Step 2: Download (Clone) From Your GitHub to Your PC

Now, on your personal computer, open a terminal and run this command to download the code:

```bash
git clone <your-github-repository-url>
cd <project-directory>
```
---

## Running the Development Server

Once you have the code on your local machine, follow these steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- Git

### Installation

Navigate into the project directory and install the required dependencies:
```bash
npm install
```

### Run the App

Once the installation is complete, you can run the development server:

```bash
npm run dev
```

This will start the Next.js application, which you can access at [http://localhost:9002](http://localhost:9002).

### How It Works

- The application uses a **mocked authentication system**. You can "log in" by entering any valid email format (e.g., `user@example.com`) on the login page. No password is required.
- All data (users, questions, answers) is static and served from `src/lib/data.ts`. There is no database.

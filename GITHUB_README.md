# Compass Study: AI-Powered Ethiopian High School Learning Platform

Part of the **Compass** ecosystem.

## 📖 Overview
Compass Study is a full-stack, AI-driven educational application designed specifically for Ethiopian high school students (Grades 9–12). It provides a gamified, personalized learning experience by aligning perfectly with the Ethiopian Ministry of Education's curriculum.

The app features dynamic, AI-generated practice quizzes, an AI Coach, multilingual support, and progress tracking to help students master their subjects and prepare for national exams.

---

## ✨ Key Features
- **Curriculum-Aligned:** Includes all subjects, units, and sub-units for Grades 9, 10, 11, and 12 (including Natural and Social Science streams).
- **AI Practice Quizzes:** Uses Google's Gemini AI to generate infinite, high-quality multiple-choice questions on-the-fly based on specific lesson topics.
- **AI Coach & Explanations:** Provides step-by-step explanations and study tips for every question, featuring virtual subject-specific teachers (e.g., Teacher Mufariat for Math, Teacher Tesfaye for Biology).
- **Multilingual Support:** Supports English, Amharic, and Afaan Oromo languages.
- **Gamification & Progress Tracking:** Tracks student readiness, daily streaks, and mastery scores for each subject using a "Brain/Readiness" metric.
- **Cloud Synchronization:** Uses Firebase Authentication and Firestore to save user profiles, quiz results, and progress securely in the cloud.
- **Secure Premium Tier:** Premium status is granted only by a verified server-side webhook and stored in a Firestore collection the client can never write to — see [Premium Security Model](#-premium-security-model) below.

---

## 🛠️ Tech Stack
### Frontend
- **React (Vite):** Modern, fast UI rendering.
- **Tailwind CSS:** Utility-first styling for a clean, responsive, and beautiful interface.
- **Lucide React:** Beautiful, consistent iconography.
- **TypeScript:** For strict typing and robust code architecture.

### Backend & AI
- **Vercel Serverless Functions (Node.js):** Each API route lives as its own function under `/api`, deployed automatically by Vercel — no long-running server process.
- **Google Gemini API:** Powers the dynamic generation of quizzes and the AI coach logic.
- **Firebase:**
  - *Firestore:* Database for storing user progress, a locked entitlements collection, and a global question bank.
  - *Auth:* Secure user login and identification.
  - *Admin SDK:* Used server-side only, authenticated via a Service Account key — never exposed to the client.

> **Note:** This app previously ran a single Express.js server (`server.ts`). It has since been migrated to Vercel serverless functions, because Vercel does not support long-running Express servers. Each old Express route is now its own file in `/api`.

---

## 📂 Project Architecture & Hierarchy
Here is a breakdown of the core project structure for developers or AI models analyzing the codebase:

```text
.
├── api/                       # Vercel Serverless Functions (replaces server.ts)
│   ├── _lib/
│   │   ├── gemini.ts          # Gemini client + response fallback + JSON parsing
│   │   ├── firebaseAdmin.ts   # Firebase Admin SDK init (Service Account auth)
│   │   ├── auth.ts            # Verifies the student's Firebase ID token
│   │   └── helpers.ts         # Teacher personas, language detection, quota checks
│   ├── health.ts              # GET  /api/health
│   ├── cache-stats.ts         # GET  /api/cache-stats (dev dashboard)
│   ├── generate-lesson.ts     # POST /api/generate-lesson
│   ├── translate-lesson.ts    # POST /api/translate-lesson
│   ├── generate-quiz.ts       # POST /api/generate-quiz
│   ├── check-understanding.ts # POST /api/check-understanding
│   ├── chat-coach.ts          # POST /api/chat-coach
│   ├── flag-answer.ts         # POST /api/flag-answer
│   ├── log-feedback.ts        # POST /api/log-feedback
│   ├── tts.ts                 # POST /api/tts
│   └── premium-webhook.ts     # POST /api/premium-webhook (payment provider only)
│
├── public/                    # Static assets (App icons, manifests)
├── src/                       # Main Frontend Source Code
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Main application routing and state shell
│   ├── index.css              # Global Tailwind CSS configurations
│   ├── types.ts                # Global TypeScript interfaces (User profile, Quiz models, etc.)
│   ├── data.ts                 # Hardcoded Ethiopian curriculum structure (Grades 9-12)
│   │
│   ├── components/            # UI Components
│   │   ├── Home.tsx           # Main dashboard
│   │   ├── QuizExplorer.tsx   # Interface for navigating subjects and units
│   │   ├── PracticeQuiz.tsx   # The core quiz-taking engine and Gemini API integration
│   │   ├── AICoach.tsx        # AI tutor chat interface
│   │   ├── Profile.tsx        # User settings and language preferences
│   │   ├── Progress.tsx       # Gamified stats and readiness scores
│   │   ├── Onboarding.tsx     # Initial setup for new users (Grade/Stream selection)
│   │   └── ...
│   │
│   ├── utils/                 # Helper functions
│   │   ├── aiBrain.ts         # Logic for calculating student readiness scores
│   │   ├── storage.ts         # IndexedDB local caching/offline queue
│   │   └── teacherLookup.tsx  # Hardcoded teacher personas for the AI Coach
│   │
│   └── lib/
│       └── firebase.ts        # Firebase client initialization
│
├── firestore.rules            # Database security rules (see Premium Security Model)
├── package.json                # Project dependencies and build scripts
├── vercel.json                 # Vercel build + function configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## ⚙️ How It Works (The Data Flow)
1. **Onboarding:** A user logs in via Firebase Auth, selects their Grade, Stream (if applicable), and preferred Language.
2. **Navigation:** The user browses the `data.ts` curriculum tree via `QuizExplorer.tsx` and selects a specific Sub-Unit to practice.
3. **Quiz Generation:**
   - `PracticeQuiz.tsx` calls `fetch("/api/generate-quiz")`, which Vercel routes to `api/generate-quiz.ts`.
   - That function securely contacts the **Gemini API** using a highly detailed prompt containing the selected topic, language, and strict formatting rules.
   - The AI generates JSON containing questions, options, the correct answer, and an explanation.
   - The function saves these questions to the Firestore `questionBank` (server-write-only) for future reuse and returns them to the frontend.
4. **Practice & Feedback:** The user answers the questions. If they get one wrong, the AI Coach provides a detailed, encouraging explanation.
5. **Progress Calculation:** Once the quiz finishes, `aiBrain.ts` calculates the user's new mastery score and saves it to the user's own Firestore document.

---

## 🔒 Premium Security Model
Premium/paid status is **never** trusted from data the client can edit. It works like this:

1. Each user has a normal `users/{uid}` document they can read and write themselves (profile, streaks, scores).
2. Premium status lives in a **separate** `entitlements/{uid}` document. `firestore.rules` allows the user to *read* it (so the UI can show a "Premium" badge) but `allow write: if false` — the client can never set it, not even from devtools.
3. The only thing that can write to `entitlements/{uid}` is the Firebase **Admin SDK**, running server-side inside `api/premium-webhook.ts`.
4. That webhook is protected by a shared secret header and is meant to be called only by your payment provider (Stripe, Chapa, Telebirr, etc.) after a real, verified payment — never by the app itself.
5. `api/_lib/helpers.ts` → `checkQuota()` reads premium status from `entitlements`, not from the user's own profile — so quota bypass isn't possible by editing your own data.

**To go live with real payments:** swap the placeholder shared-secret check in `premium-webhook.ts` for your payment provider's real signature verification, and point their webhook at `https://yourapp.vercel.app/api/premium-webhook`.

---

## 🚀 Note for AI Models
If you are an AI assistant (like Claude, ChatGPT, or Gemini) reading this repository to help the developer:
- This is a full-stack Vite + Vercel Serverless application. There is **no** `server.ts` and **no** `app.listen()` — do not reintroduce a long-running Express server, it will not deploy correctly on Vercel.
- Every backend route is its own file under `/api`, exporting a default `handler(req, res)` function using `@vercel/node` types.
- The Gemini API key and Firebase Service Account key are kept strictly in Vercel environment variables, read only inside `/api` functions. Never move them to the client or hardcode them in `src/`.
- Never write premium/entitlement status from client-side code or from any `/api` route other than `premium-webhook.ts`. Always read it from the `entitlements` collection, never from the user's own profile document.
- When generating new features, adhere to the existing Tailwind CSS aesthetic and the gamified educational tone of the app.

export interface UserProfile {
  name: string;
  gradeGroup: "9-10" | "11-12";
  grade: string; // "9", "10", "11", "12"
  stream?: "Natural" | "Social";
  language: "English" | "Amharic" | "Oromo";
  isOnboarded: boolean;
  learningGoal: string;
  isPremium?: boolean; // Premium / Monetization tier
  subscriptionStatus?: "guest" | "google" | "premium";
  emotionalState?: "Motivated" | "Focused" | "Tired" | "Sleepy" | "Anxious" | "Overwhelmed";
  emotionalStateLog?: Array<{ mood: string; timestamp: string; subject?: string }>;
  
  // Personalized properties from 18-question student profile system
  subjectConfidence: {
    biology?: "Confident" | "Okay" | "Weak";
    chemistry?: "Confident" | "Okay" | "Weak";
    physics?: "Confident" | "Okay" | "Weak";
    maths?: "Confident" | "Okay" | "Weak";
    english?: "Confident" | "Okay" | "Weak";
    civics?: "Confident" | "Okay" | "Weak";
  };
  studyTimePreference?: "Morning" | "Afternoon" | "Night";
  sessionLengthPreference?: "Short" | "Focused" | "Marathon";
  studyDisturbances?: "Phone" | "Noise" | "Fatigue";
  targetScoreGoal?: "Star" | "Strong" | "Pass";
  targetHigherEducPath?: "Medicine" | "Engineering" | "SocialStudy";
  examPreparationUrgency?: "Urgent" | "Medium" | "LongTerm";
  learningStylePreference?: "Visual" | "Practice" | "Reading";
  commonStruggleKeywords?: "Memory" | "Concepts" | "Time";
  weeklyStudyHoursGoal?: "Light" | "Moderate" | "Hardcore";
  studyGroupPreference?: "Alone" | "Buddy" | "Group";
  coachingTonePreference?: "Kind" | "Strict" | "Data";
  averageSleepPreference?: "Healthy" | "Short" | "Low";
  
  // Student Study Memory Layer
  memory?: {
    weakSubjects: string[];              // e.g. ["Biology", "Chemistry"]
    strongSubjects: string[];            // e.g. ["Mathematics"]
    topicsConfusedRepeatedly: string[];   // lists of subUnitIds triggering retakes or low scores
    bestStudiedTimeOfDay?: string;       // e.g. "Morning"
    averageStudySessionDuration?: number;// average duration in minutes
    mostEncouragingFeedbackType?: string;// derived over time e.g. "Gamified", "Strict"
    alreadySeenLessons: string[];         // subUnitIds
    alreadySeenQuizzes: string[];         // subUnitIds
  };

  studyPreferences?: Record<string, string>; // 18-question personalization survey findings
  dataSaverMode?: boolean; // Offline-first low-end mobile optimization setting
  ambientEffectsEnabled?: boolean; // Dynamic Background Graphics toggle
  autoPlanActive?: boolean; // Auto Plan generation status

  // Dynamic Learning Readiness Score system (computed + synced in App.tsx)
  learningReadinessScore?: number;
  currentSubject?: string;
  currentUnit?: string;
  currentSubUnit?: string;
}

export interface Task {
  id: string;
  title: string;
  subjectName: string;
  subUnitId: string;
  completed: boolean;
}

export interface UserStats {
  streak: number;
  lastActiveDate?: string;
  lessonsCompleted: string[]; // subUnitIds
  bookmarks: string[]; // subUnitIds
  quizHighScores: Record<string, number>; // subUnitId -> percentage score
  completedTaskIds: string[]; // list of task IDs completed today
  streakDates: string[]; // arrays of ISO string dates of activity
  coachChatCount?: number; // Tracks sent messages for daily demo limitation quota
  booksGeneratedToday?: number; // Track generated books per day
}

export interface GeneratedLesson {
  explanation: string;
  formula?: string;
  workedExample?: {
    problem: string;
    solution: string;
  };
  keyPoints: string[];
  isDemoMode?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface GeneratedQuiz {
  questions: QuizQuestion[];
  isDemoMode?: boolean;
}

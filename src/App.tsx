import React, { useState, useEffect } from "react";
import { 
  Home as HomeIcon, BookOpen, Sparkles, TrendingUp, User, 
  HelpCircle, AlertCircle, Sparkle, X, CheckCircle, Users
} from "lucide-react";

import { CURRICULUM_DATA, Subject, Unit, SubUnit } from "./data";
import { UserProfile, UserStats, Task, GeneratedLesson } from "./types";

import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Books from "./screens/Books";
import LessonConcept from "./screens/LessonConcept";
import PracticeQuiz from "./screens/PracticeQuiz";
import QuizExplorer from "./screens/QuizExplorer";
import AICoach from "./screens/AICoach";
import Progress from "./screens/Progress";
import Profile from "./screens/Profile";
import RoleSelect from "./screens/RoleSelect";
import TeacherDashboard from "./screens/TeacherDashboard";
import FamilyDashboard from "./screens/FamilyDashboard";
import ConnectionRequests from "./screens/ConnectionRequests";
import ChatThread from "./screens/ChatThread";

import { auth, db, googleProvider, signInWithRedirect, signInWithPopup, getRedirectResult, signOut, onAuthStateChanged } from "./lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { calculateReadiness2_0 } from "./utils/readiness";
import { apiCall } from "./utils/apiClient";

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof localStorage !== "undefined") {
      const cached = localStorage.getItem("compass_profile");
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return null;
  });
  const [stats, setStats] = useState<UserStats>(() => {
    const today = new Date().toISOString().split('T')[0];
    if (typeof localStorage !== "undefined") {
      const cached = localStorage.getItem("compass_stats");
      if (cached) {
        try { 
          const parsed = JSON.parse(cached); 
          if (parsed.lastActiveDate !== today) {
            parsed.lastActiveDate = today;
            parsed.coachChatCount = 0;
            parsed.booksGeneratedToday = 0;
            localStorage.setItem("compass_stats", JSON.stringify(parsed));
          }
          return parsed;
        } catch (e) {}
      }
    }
    return {
      streak: 3,
      lastActiveDate: today,
      coachChatCount: 0,
      booksGeneratedToday: 0,
      lessonsCompleted: [],
      bookmarks: [],
      quizHighScores: {},
      completedTaskIds: [],
      streakDates: []
    };
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof localStorage !== "undefined") {
      const cached = localStorage.getItem("compass_tasks");
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return [];
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [verifiedTeachbacks, setVerifiedTeachbacks] = useState<string[]>(() => {
    if (typeof localStorage !== "undefined") {
      const cached = localStorage.getItem("compass_verified_teachback_passes_v2");
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return [];
  });
  const [loadingAuth, setLoadingAuth] = useState(() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("compass_profile")) {
      return false; // Fast path: local cache exists, skip blank screen
    }
    return true;
  });
  const [activeTab, setActiveTab] = useState<"Home" | "Books" | "Coach" | "Progress" | "Profile" | "Quiz" | "Dashboard">("Home");
  const [userRole, setUserRole] = useState<"student" | "teacher" | "family" | null | undefined>(undefined); // undefined = not fetched yet
  const [activeChatStudent, setActiveChatStudent] = useState<{ id: string; name: string } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  // Unintrusive PWA Install states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Fetches the account's role (student/teacher/family) once signed in, so
  // the Dashboard tab knows whether to show RoleSelect, TeacherDashboard,
  // FamilyDashboard, or ConnectionRequests. null = signed in but no role
  // chosen yet; undefined = still loading.
  useEffect(() => {
    if (!currentUser) {
      setUserRole(undefined);
      return;
    }
    apiCall("/api/get-my-id")
      .then((data) => setUserRole(data.role))
      .catch(() => setUserRole(null));
  }, [currentUser]);


  // Real-time Floating Notification states
  const [liveToast, setLiveToast] = useState<{ title: string; message: string; icon?: string } | null>(null);

  useEffect(() => {
    // Fire off a real real-time notification alert after 6 seconds
    const timer = setTimeout(() => {
      const targetMsg = profile?.language === "Amharic"
        ? "🔥 የጥናት ጊዜ ደርሷል! የዕለታዊ የባዮሎጂ እና ኬሚስትሪ ትምህርቶች ይጠብቁዎታል።"
        : profile?.language === "Oromo"
        ? "🔥 Yeroo barnootaa gaheera! Barumsa Bio fi Chem har'aa dursa fannisi."
        : "🔥 Study Hour Is Burning! Your daily quiz mission and AI Coach topics are waiting. Secure your streak target!";

      const notifObj = {
        title: profile?.language === "Amharic" ? "የጥናት ኮከብ ማሳሰቢያ" : profile?.language === "Oromo" ? "Hubachiisa Qorannoo" : "AI Study Coach Alert",
        message: targetMsg,
        icon: "🧠"
      };

      setLiveToast(notifObj);
      
      // Auto-dismiss after 1 second as requested
      setTimeout(() => {
        setLiveToast(null);
      }, 1000);

      // Trigger standard native OS notification if allowed in browser environment
      // This will use the device's default notification sound
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          try {
            new Notification(notifObj.title, { body: notifObj.message });
          } catch (err) {}
        }
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [profile?.language]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      // Store the event so it can be prompted on demand
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA response outcome: ${outcome}`);
    setDeferredPrompt(null);
  };

  // Subunit reading drill down states
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedSubUnit, setSelectedSubUnit] = useState<SubUnit | null>(null);
  const [quizLessonContent, setQuizLessonContent] = useState<GeneratedLesson | null>(null);

  // Link for direct navigation from task click
  const [initialSelectedSubUnitId, setInitialSelectedSubUnitId] = useState<string | null>(null);

  // Active Subject-Teacher active handoff state
  const [coachActiveTeacherSubject, setCoachActiveTeacherSubject] = useState<string | null>(null);
  const [coachInitialPrompt, setCoachInitialPrompt] = useState<string | null>(null);

  const handleAskTeacher = (subjectName: string) => {
    setCoachActiveTeacherSubject(subjectName);
    setActiveTab("Coach");
  };

  const handleAskCoachMistake = (teacherSubject: string, promptText: string) => {
    setCoachActiveTeacherSubject(teacherSubject);
    setCoachInitialPrompt(promptText);
    setActiveTab("Coach");
    setSelectedSubUnit(null);
    setQuizLessonContent(null);
  };

  // Helper to persist to Google Cloud Firestore under users/{uid}
  const writeToFirestore = async (newProfile: UserProfile | null, newStats: UserStats | null, newTasks: Task[] | null) => {
    if (!auth.currentUser) return;
    const { debouncedFirebaseSync } = await import("./utils/storage");
    
    // Save to localStorage immediately as source of truth
    if (newProfile !== null) localStorage.setItem("compass_profile", JSON.stringify(newProfile));
    if (newStats !== null) localStorage.setItem("compass_stats", JSON.stringify(newStats));
    if (newTasks !== null) localStorage.setItem("compass_tasks", JSON.stringify(newTasks));

    // Queue sync for Firestore
    debouncedFirebaseSync(async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser!.uid);
        const updates: any = {};
        
        // Grab latest from localStorage right before syncing
        const p = localStorage.getItem("compass_profile");
        const s = localStorage.getItem("compass_stats");
        const t = localStorage.getItem("compass_tasks");
        const tp = localStorage.getItem("compass_verified_teachback_passes_v2");
        
        if (p) updates.compass_user_profile_v2 = JSON.parse(p);
        if (s) updates.compass_user_stats_v2 = JSON.parse(s);
        if (t) updates.compass_user_tasks_v2 = JSON.parse(t);
        if (tp) updates.compass_verified_teachback_passes_v2 = JSON.parse(tp);

        await setDoc(userDocRef, updates, { merge: true });
        console.log("[Compass Sync] Batch write to Firestore successful");
      } catch (e) {
        console.error("[Compass Cloud] Failed to update Firestore:", e);
      }
    }, 5000); // 5 second debounce
  };

  const handleSignInWithGoogle = async () => {
    setAuthError(null);
    try {
       await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
       console.error("[Compass Auth] Google sign-in failed:", err);
       const msg = err.message || "";
       if (err.code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
         setAuthError("unauthorized-domain");
       } else if (err.code === "auth/popup-blocked" || msg.includes("popup-blocked") || err.code === "auth/cancelled-popup-request" || msg.includes("cancelled-popup")) {
         const isAmharic = profile?.language === "Amharic";
         const isOromo = profile?.language === "Oromo";
         setAuthError(isAmharic 
           ? "⚠️ ብቅ-ባይ መስኮት በብሮውዘርዎ ታግዷል! እባክዎ ብቅ-ባዮችን (Pop-ups) ይፍቀዱ ወይም በ'Guest' ሆነው ይማሩ።" 
           : isOromo 
           ? "⚠️ Pop-up'n cufameera! Hayyama pop-up banuun ykn akka 'Guest'tti fufaa." 
           : "⚠️ Sign-in popup was blocked! Access or cookie storage is restricted. Please allow popups or use Guest Mode."
         );
       } else {
         setAuthError(msg || "Sign-in failed");
       }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("[Compass Auth] Sign-out failed:", err);
    } finally {
      // Clean ALL local storage & states on logout to start from zero
      localStorage.clear();
      setProfile(null);
      setStats({
        streak: 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
        coachChatCount: 0,
        booksGeneratedToday: 0,
        lessonsCompleted: [],
        bookmarks: [],
        quizHighScores: {},
        completedTaskIds: [],
        streakDates: []
      });
      setTasks([]);
      setVerifiedTeachbacks([]);
      setActiveTab("Home");
      setCurrentUser(null);
      window.location.href = "/";
    }
  };

  // Auth & FireStore real-time synchronization
  useEffect(() => {
    // Handle URL parameters (URL sync tokens first)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const syncToken = params.get("syncToken");
      if (syncToken) {
        try {
          const decoded = decodeURIComponent(escape(atob(syncToken.trim())));
          const parsed = JSON.parse(decoded);
          if (parsed.profile) {
            localStorage.setItem("compass_profile", JSON.stringify(parsed.profile));
            if (parsed.stats) localStorage.setItem("compass_stats", JSON.stringify(parsed.stats));
            if (parsed.tasks) localStorage.setItem("compass_tasks", JSON.stringify(parsed.tasks));
            
            const cleanUrl = window.location.origin + window.location.pathname;
            window.location.href = cleanUrl;
            return;
          }
        } catch (err) {
          console.error("[Compass Linker] Failed to auto-decode query sync token:", err);
        }
      }
    }

    // Set initial local verified teachback passes
    const cachedPasses = localStorage.getItem("compass_verified_teachback_passes_v2") || "[]";
    try {
      setVerifiedTeachbacks(JSON.parse(cachedPasses));
    } catch (e) {}

    // Check redirect login results
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log("[Compass Cloud] Caught login redirect result successfully:", result.user.email);
          setCurrentUser(result.user);
        }
      })
      .catch((err) => {
        console.error("[Compass Cloud] Error capturing redirect auth outcome:", err);
        const msg = err.message || "";
        if (err.code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
          setAuthError("unauthorized-domain");
        } else if (msg) {
          setAuthError(msg);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("[Compass Cloud] Authenticated via Google UID:", user.uid);
        setCurrentUser(user);
        
        // Listen to changes in Firestore user record
        const userDocRef = doc(db, "users", user.uid);
        const unsubDoc = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.compass_user_profile_v2 !== undefined) {
              const remoteProfile = data.compass_user_profile_v2;
              if (remoteProfile.subscriptionStatus !== "premium") {
                remoteProfile.subscriptionStatus = "google";
              }
              setProfile(remoteProfile);
            }
            if (data.compass_user_stats_v2 !== undefined) {
              const remoteStats = data.compass_user_stats_v2;
              const today = new Date().toISOString().split('T')[0];
              if (remoteStats.lastActiveDate !== today) {
                remoteStats.lastActiveDate = today;
                remoteStats.coachChatCount = 0;
                remoteStats.booksGeneratedToday = 0;
              }
              setStats(remoteStats);
            }
            if (data.compass_user_tasks_v2 !== undefined) {
              setTasks(data.compass_user_tasks_v2 || []);
            }
            if (data.compass_verified_teachback_passes_v2 !== undefined) {
              setVerifiedTeachbacks(data.compass_verified_teachback_passes_v2 || []);
              localStorage.setItem("compass_verified_teachback_passes_v2", JSON.stringify(data.compass_verified_teachback_passes_v2 || []));
            }
          } else {
            console.log("[Compass Cloud] Document missing, checking local caches for backup/migration...");
            const cachedProfile = localStorage.getItem("compass_profile");
            const cachedStats = localStorage.getItem("compass_stats");
            const cachedTasks = localStorage.getItem("compass_tasks");
            const cachedPassesLocal = localStorage.getItem("compass_verified_teachback_passes_v2") || "[]";
            
            if (cachedProfile) {
              const p = JSON.parse(cachedProfile);
              const s = cachedStats ? JSON.parse(cachedStats) : {
                streak: 3,
                lessonsCompleted: [],
                bookmarks: [],
                quizHighScores: {},
                completedTaskIds: [],
                streakDates: [new Date().toISOString().split('T')[0]]
              };
              const t = cachedTasks ? JSON.parse(cachedTasks) : [];
              let passes = [];
              try { passes = JSON.parse(cachedPassesLocal); } catch (e) {}
              
              setDoc(userDocRef, {
                compass_user_profile_v2: p,
                compass_user_stats_v2: s,
                compass_user_tasks_v2: t,
                compass_verified_teachback_passes_v2: passes
              }).catch(err => console.error("[Compass Cloud] Migration error:", err));
            } else {
              // They are a completely new user signing up. Let's auto-create a default profile in Firestore
              // so they can bypass Onboarding and enter the app immediately with their Google Display Name!
              const displayName = user.displayName || "Google Scholar";
              const defaultProfile: UserProfile = {
                name: displayName,
                gradeGroup: "11-12",
                grade: "12",
                stream: "Natural",
                language: "English",
                isOnboarded: true,
                learningGoal: "Prepare for national exams and continuous assessment mastery",
                subjectConfidence: {
                  biology: "Okay",
                  chemistry: "Okay",
                  physics: "Okay",
                  maths: "Okay",
                  english: "Okay",
                  civics: "Okay"
                },
                studyTimePreference: "Morning",
                sessionLengthPreference: "Focused",
                studyDisturbances: "Phone",
                targetScoreGoal: "Strong",
                targetHigherEducPath: "Engineering",
                examPreparationUrgency: "Medium",
                learningStylePreference: "Practice",
                commonStruggleKeywords: "Concepts",
                weeklyStudyHoursGoal: "Moderate",
                studyGroupPreference: "Alone",
                coachingTonePreference: "Kind",
                averageSleepPreference: "Healthy",
                memory: {
                  weakSubjects: [],
                  strongSubjects: [],
                  topicsConfusedRepeatedly: [],
                  alreadySeenLessons: [],
                  alreadySeenQuizzes: []
                },
                dataSaverMode: false
              };
              
              const freshStats: UserStats = {
                streak: 3,
                lessonsCompleted: [],
                bookmarks: [],
                quizHighScores: {},
                completedTaskIds: [],
                streakDates: [new Date().toISOString().split('T')[0]]
              };
              
              const freshTasks = getInitialTasksForGrade("12", "Natural");

              // Save to local caches first for instant rendering
              localStorage.setItem("compass_profile", JSON.stringify(defaultProfile));
              localStorage.setItem("compass_stats", JSON.stringify(freshStats));
              localStorage.setItem("compass_tasks", JSON.stringify(freshTasks));
              
              setProfile(defaultProfile);
              setStats(freshStats);
              setTasks(freshTasks);

              // Set Firestore document
              setDoc(userDocRef, {
                compass_user_profile_v2: defaultProfile,
                compass_user_stats_v2: freshStats,
                compass_user_tasks_v2: freshTasks,
                compass_verified_teachback_passes_v2: []
              }).catch(err => console.error("[Compass Cloud] Error saving default profile:", err));
            }
          }
          setLoadingAuth(false);
        }, (err) => {
          console.error("[Compass Cloud] Firestore subscription failed:", err);
          setLoadingAuth(false);
        });
        
        return () => unsubDoc();
      } else {
        console.log("[Compass Cloud] Google Account inactive. Running in local/offline database mode.");
        setCurrentUser(null);
        
        const cachedProfile = localStorage.getItem("compass_profile");
        const cachedStats = localStorage.getItem("compass_stats");
        const cachedTasks = localStorage.getItem("compass_tasks");
        const cachedPassesLocal = localStorage.getItem("compass_verified_teachback_passes_v2") || "[]";
        
        if (cachedProfile) setProfile(JSON.parse(cachedProfile));
        else setProfile(null);
        if (cachedStats) setStats(JSON.parse(cachedStats));
        if (cachedTasks) setTasks(JSON.parse(cachedTasks));
        try { setVerifiedTeachbacks(JSON.parse(cachedPassesLocal)); } catch (e) {}
        
        setLoadingAuth(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Compute dynamic Learning Readiness Score & sync current studying context directly to Firestore user path
  useEffect(() => {
    if (profile) {
      const report = calculateReadiness2_0(profile, stats, CURRICULUM_DATA, verifiedTeachbacks);
      const score = report.overallReadiness;
      
      const currentSubject = selectedSubject ? selectedSubject.name : (profile.currentSubject || "All");
      const currentUnit = selectedUnit ? selectedUnit.name : (profile.currentUnit || "Syllabus Overview");
      const currentSubUnit = selectedSubUnit ? selectedSubUnit.name : (profile.currentSubUnit || "");
      
      if (
        profile.learningReadinessScore !== score ||
        profile.currentSubject !== currentSubject ||
        profile.currentUnit !== currentUnit ||
        profile.currentSubUnit !== currentSubUnit
      ) {
        const nextP = { 
          ...profile, 
          learningReadinessScore: score,
          currentSubject,
          currentUnit,
          currentSubUnit
        };
        setProfile(nextP);
        localStorage.setItem("compass_profile", JSON.stringify(nextP));
        if (currentUser) {
          writeToFirestore(nextP, null, null);
        }
      }
    }
  }, [profile, stats, verifiedTeachbacks, selectedSubject, selectedUnit, selectedSubUnit, currentUser]);

  // Helper to generate dynamic tasks based on Grade selection
  const getInitialTasksForGrade = (grade: string, stream?: "Natural" | "Social"): Task[] => {
    if (grade === "9") {
      return [
        { id: "t1", title: "Complete Concept of Real Numbers Notes", subjectName: "Mathematics", subUnitId: "g9-math-u1-s1", completed: false },
        { id: "t2", title: "Study Review of SI Units", subjectName: "Physics", subUnitId: "g9-phys-u1-s1", completed: false },
        { id: "t3", title: "Understand Subatomic Particles Discovery", subjectName: "Chemistry", subUnitId: "g9-chem-u1-s1", completed: false }
      ];
    }
    if (grade === "10") {
      return [
        { id: "t1", title: "Understand Definition of Polynomials", subjectName: "Mathematics", subUnitId: "g10-math-u1-s1", completed: false },
        { id: "t2", title: "Study Concept of Force & Laws", subjectName: "Physics", subUnitId: "g10-phys-u1-s1", completed: false },
        { id: "t3", title: "Resolve Polynomial Division Remainder theorem", subjectName: "Mathematics", subUnitId: "g10-math-u1-s2", completed: false }
      ];
    }
    if (grade === "11") {
      if (stream === "Social") {
        return [
          { id: "t1", title: "Study Coordinate Distance formulas", subjectName: "Mathematics (Social)", subUnitId: "g11s-math-u1-s1", completed: false },
          { id: "t2", title: "Navigate Map reading & grid scales", subjectName: "Geography", subUnitId: "g11s-geo-u1-s1", completed: false },
          { id: "t3", title: "Learn RISE & FALL of Aksumite Empire", subjectName: "History", subUnitId: "g11s-hist-u1-s1", completed: false }
        ];
      } else {
        return [
          { id: "t1", title: "Study composition of Functions", subjectName: "Mathematics (Natural)", subUnitId: "g11n-math-u1-s1", completed: false },
          { id: "t2", title: "Examine Quantum Numbers atomic orbitals", subjectName: "Chemistry (Natural)", subUnitId: "g11n-chem-u1-s1", completed: false },
          { id: "t3", title: "Verify cell membrane structure dynamics", subjectName: "Biology", subUnitId: "g11n-bio-u1-s1", completed: false }
        ];
      }
    }
    // Grade 12
    if (stream === "Social") {
      return [
        { id: "t1", title: "Learn statistics measures of central tendency", subjectName: "Mathematics (Social)", subUnitId: "g12s-math-u1-s1", completed: false },
        { id: "t2", title: "Distinguish resource Scarcity & Opportunity Cost", subjectName: "Economics", subUnitId: "g12s-econ-u1-s1", completed: false },
        { id: "t3", title: "Solve Law of Demand schedule functions", subjectName: "Economics", subUnitId: "g12s-econ-u2-s1", completed: false }
      ];
    } else {
      return [
        { id: "t1", title: "Grasp Calculus rate of change & limits continuity", subjectName: "Mathematics (Natural)", subUnitId: "g12n-math-u1-s1", completed: false },
        { id: "t2", title: "Understand Laws of Thermodynamics", subjectName: "Physics", subUnitId: "g12n-phys-u1-s1", completed: false },
        { id: "t3", title: "Resolve standard functions derivative limits", subjectName: "Mathematics (Natural)", subUnitId: "g12n-math-u1-s2", completed: false }
      ];
    }
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    if (!newProfile.subscriptionStatus) {
      newProfile.subscriptionStatus = currentUser ? "google" : "guest";
    }
    localStorage.setItem("compass_profile", JSON.stringify(newProfile));
    setProfile(newProfile);

    // Populate initial tasks
    const initialTasks = getInitialTasksForGrade(newProfile.grade, newProfile.stream);
    localStorage.setItem("compass_tasks", JSON.stringify(initialTasks));
    setTasks(initialTasks);

    // Keep stats standard
    const freshStats: UserStats = {
      streak: 3,
      lessonsCompleted: [],
      bookmarks: [],
      quizHighScores: {},
      completedTaskIds: [],
      streakDates: [new Date().toISOString().split('T')[0]]
    };
    localStorage.setItem("compass_stats", JSON.stringify(freshStats));
    setStats(freshStats);
    
    if (auth.currentUser) {
      writeToFirestore(newProfile, freshStats, initialTasks);
    }
    setActiveTab("Home");
  };

  const syncStats = (updatedStats: UserStats) => {
    localStorage.setItem("compass_stats", JSON.stringify(updatedStats));
    setStats(updatedStats);
    if (auth.currentUser) {
      writeToFirestore(null, updatedStats, null);
    }
  };

  // Toggle tasks checklist checkboxes
  const handleToggleTask = (taskId: string) => {
    let updatedTasks = tasks;
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        // If they checked it off, maybe mark the sub-unit as completed too!
        if (nextState && !stats.lessonsCompleted.includes(t.subUnitId)) {
          const nextLessons = [...stats.lessonsCompleted, t.subUnitId];
          syncStats({ ...stats, lessonsCompleted: nextLessons });
        }
        return { ...t, completed: nextState };
      }
      return t;
    });
    updatedTasks = updated;
    localStorage.setItem("compass_tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    if (auth.currentUser) {
      writeToFirestore(null, null, updatedTasks);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = (subUnitId: string) => {
    const currentBookmarks = stats.bookmarks || [];
    let nextBookmarks;
    if (currentBookmarks.includes(subUnitId)) {
      nextBookmarks = currentBookmarks.filter(id => id !== subUnitId);
    } else {
      nextBookmarks = [...currentBookmarks, subUnitId];
    }
    syncStats({ ...stats, bookmarks: nextBookmarks });
  };

  // Toggle Mastery
  const handleToggleMastery = (subUnitId: string) => {
    const currentCompleted = stats.lessonsCompleted || [];
    let nextCompleted;
    if (currentCompleted.includes(subUnitId)) {
      nextCompleted = currentCompleted.filter(id => id !== subUnitId);
    } else {
      nextCompleted = [...currentCompleted, subUnitId];
    }
    
    // Also toggle completed tasks corresponding to this leaf node
    const updatedTasks = tasks.map(t => {
      if (t.subUnitId === subUnitId) {
        return { ...t, completed: nextCompleted.includes(subUnitId) };
      }
      return t;
    });
    localStorage.setItem("compass_tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    if (auth.currentUser) {
      writeToFirestore(null, null, updatedTasks);
    }

    syncStats({ ...stats, lessonsCompleted: nextCompleted });
  };

  // Record practice quiz results
  const handleQuizCompleted = (scorePercentage: number) => {
    if (!selectedSubUnit) return;
    
    const previousHighScore = stats.quizHighScores[selectedSubUnit.id] || 0;
    const nextHighScores = {
      ...stats.quizHighScores,
      [selectedSubUnit.id]: Math.max(previousHighScore, scorePercentage)
    };

    // If they score high (>=60%), count lesson as fully completed and ticked off!
    let nextCompleted = stats.lessonsCompleted;
    if (scorePercentage >= 60 && !stats.lessonsCompleted.includes(selectedSubUnit.id)) {
      nextCompleted = [...stats.lessonsCompleted, selectedSubUnit.id];
    }

    // Dynamic streak logic
    let nextStreak = stats.streak || 3;
    const todayStr = new Date().toISOString().split('T')[0];
    const nextStreakDates = stats.streakDates ? [...stats.streakDates] : [];
    if (!nextStreakDates.includes(todayStr)) {
      nextStreakDates.push(todayStr);
      nextStreak = nextStreak + 1;
    }

    // Toggle corresponding tasks
    const updatedTasks = tasks.map(t => {
      if (t.subUnitId === selectedSubUnit.id) {
        return { ...t, completed: nextCompleted.includes(selectedSubUnit.id) };
      }
      return t;
    });
    localStorage.setItem("compass_tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);

    const nextStats = {
      ...stats,
      lessonsCompleted: nextCompleted,
      quizHighScores: nextHighScores,
      streak: nextStreak,
      streakDates: nextStreakDates
    };

    // Compute updated dynamic Learning Readiness Score
    const report = calculateReadiness2_0(profile || {}, nextStats, CURRICULUM_DATA, verifiedTeachbacks);
    const score = report.overallReadiness;

    let nextProfile = profile;
    if (profile) {
      nextProfile = {
        ...profile,
        learningReadinessScore: score
      };
      setProfile(nextProfile);
      localStorage.setItem("compass_profile", JSON.stringify(nextProfile));
    }

    if (auth.currentUser) {
      writeToFirestore(nextProfile, nextStats, updatedTasks);
    }

    syncStats(nextStats);
  };

  // Start study on click task
  const handleNavigateToBooks = (subUnitId?: string) => {
    if (subUnitId) {
      setInitialSelectedSubUnitId(subUnitId);
    }
    setActiveTab("Books");
  };

  // Reset progress and onboarding
  const handleResetData = async () => {
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, {
          compass_user_profile_v2: null,
          compass_user_stats_v2: null,
          compass_user_tasks_v2: null
        }, { merge: true });
      } catch (e) {
        console.error("[Compass Cloud] Reset error:", e);
      }
      try {
        await signOut(auth);
      } catch (e) {
        console.error("[Compass Auth] Sign out error:", e);
      }
    }
    
    // Fallback manual clearance
    localStorage.clear();

    // Wipe React state directly to avoid iframe reload glitches
    setProfile(null);
    setStats({
      streak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      coachChatCount: 0,
      booksGeneratedToday: 0,
      lessonsCompleted: [],
      bookmarks: [],
      quizHighScores: {},
      completedTaskIds: [],
      streakDates: []
    });
    setTasks([]);
    setVerifiedTeachbacks([]);
    setActiveTab("Home");
    setCurrentUser(null);
    window.location.href = "/";
  };

  const handleUpdateName = (newName: string) => {
    if (profile) {
      const nextP = { ...profile, name: newName };
      localStorage.setItem("compass_profile", JSON.stringify(nextP));
      setProfile(nextP);
      if (auth.currentUser) {
        writeToFirestore(nextP, null, null);
      }
    }
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const nextP = { ...profile, ...updates };
      localStorage.setItem("compass_profile", JSON.stringify(nextP));
      setProfile(nextP);
      if (auth.currentUser) {
        writeToFirestore(nextP, null, null);
      }
    }
  };

  const handleUpdateStats = (updates: Partial<UserStats>) => {
    const nextS = { ...stats, ...updates };
    localStorage.setItem("compass_stats", JSON.stringify(nextS));
    setStats(nextS);
    if (auth.currentUser) {
      writeToFirestore(null, nextS, null);
    }
  };

  // Render subpage content based on Tab router state
  const renderTabContent = () => {
    if (!profile) return null;

    if (activeTab === "Home") {
      return (
        <Home 
          profile={profile}
          stats={stats}
          tasks={tasks}
          toggleTask={handleToggleTask}
          onNavigateToBooks={handleNavigateToBooks}
          onTabChange={setActiveTab}
          onUpdateProfile={handleUpdateProfile}
          onUpdateStats={handleUpdateStats}
          deferredPrompt={deferredPrompt}
          onInstallClick={handleInstallClick}
          isOnline={isOnline}
        />
      );
    }

    if (activeTab === "Books") {
      // Drill down level 2: Quiz taking
      if (selectedSubject && selectedUnit && selectedSubUnit && quizLessonContent) {
        return (
          <PracticeQuiz 
            profile={profile}
            subject={selectedSubject}
            unit={selectedUnit}
            subUnit={selectedSubUnit}
            lessonContent={quizLessonContent}
            onBack={() => setQuizLessonContent(null)}
            onQuizCompleted={handleQuizCompleted}
            onAskCoachMistake={handleAskCoachMistake}
          />
        );
      }

      // Drill down level 1: Concept Reading / Lesson view
      if (selectedSubject && selectedUnit && selectedSubUnit) {
        return (
          <LessonConcept
            profile={profile}
            subject={selectedSubject}
            unit={selectedUnit}
            subUnit={selectedSubUnit}
            stats={stats}
            onBack={() => setSelectedSubUnit(null)}
            onGenerateQuiz={(lesson) => setQuizLessonContent(lesson)}
            onToggleMastery={handleToggleMastery}
            onToggleBookmark={handleToggleBookmark}
            onAskTeacher={handleAskTeacher}
            onUpdateStats={handleUpdateStats}
          />
        );
      }

      // Overall subjects index lists
      return (
        <Books 
          profile={profile}
          stats={stats}
          curriculum={CURRICULUM_DATA}
          onSelectSubUnit={(subject, u, sub) => {
            setSelectedSubject(subject);
            setSelectedUnit(u);
            setSelectedSubUnit(sub);
            setQuizLessonContent(null);
          }}
          initialSelectedSubUnitId={initialSelectedSubUnitId}
          clearInitialSubUnitId={() => setInitialSelectedSubUnitId(null)}
        />
      );
    }

    if (activeTab === "Coach") {
      return (
        <AICoach 
          profile={profile}
          stats={stats}
          onUpdateProfile={handleUpdateProfile}
          onUpdateStats={handleUpdateStats}
          activeTeacherSubject={coachActiveTeacherSubject}
          onClearActiveTeacherSubject={() => setCoachActiveTeacherSubject(null)}
          initialPrompt={coachInitialPrompt}
          onClearInitialPrompt={() => setCoachInitialPrompt(null)}
        />
      );
    }

    if (activeTab === "Progress") {
      return (
        <Progress 
          profile={profile}
          stats={stats}
          curriculum={CURRICULUM_DATA}
        />
      );
    }

    if (activeTab === "Quiz") {
      return (
        <QuizExplorer
          profile={profile}
          stats={stats}
          curriculum={CURRICULUM_DATA}
          onQuizCompleted={handleQuizCompleted}
        />
      );
    }

    if (activeTab === "Dashboard") {
      if (activeChatStudent) {
        return (
          <ChatThread
            language={profile.language}
            studentId={activeChatStudent.id}
            studentName={activeChatStudent.name}
            onBack={() => setActiveChatStudent(null)}
          />
        );
      }
      if (userRole === undefined) {
        return <div className="glass-card p-4 rounded-xl">Loading…</div>;
      }
      if (!userRole) {
        return <RoleSelect language={profile.language} onDone={(role) => setUserRole(role)} />;
      }
      if (userRole === "teacher") {
        return <TeacherDashboard language={profile.language} />;
      }
      if (userRole === "family") {
        return (
          <FamilyDashboard
            language={profile.language}
            onOpenChat={(id, name) => setActiveChatStudent({ id, name })}
          />
        );
      }
      return <ConnectionRequests language={profile.language} />;
    }

    if (activeTab === "Profile") {
      return (
        <Profile 
          profile={profile}
          stats={stats}
          verifiedTeachbacks={verifiedTeachbacks}
          onUpdateProfile={handleUpdateProfile}
          onResetData={handleResetData}
          deferredPrompt={deferredPrompt}
          onInstallClick={handleInstallClick}
          onTabChange={setActiveTab}
          currentUser={currentUser}
          onSignInWithGoogle={handleSignInWithGoogle}
          onSignOut={handleSignOut}
          authError={authError}
        />
      );
    }

    return null;
  };



  // While Firebase is authenticating, show a clean, blank background to avoid glitches/flickers
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col justify-between items-center sm:py-6">
        <div 
          id="applet-viewport-loading" 
          className="w-full max-w-md bg-[var(--color-bg-elevated)] sm:rounded-3xl sm:border sm:border-slate-800/70 flex flex-col h-[100dvh] sm:h-[780px] sm:max-h-[95vh] overflow-hidden relative"
        >
        </div>
      </div>
    );
  }

  // If there is no profile stored, trigger splash onboarding sequence
  if (!profile) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete} 
        currentUser={currentUser}
        authError={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col justify-between items-center sm:py-6">
      {/* Outer viewport simulating high-fidelity futuristic phone frame */}
      <div 
        id="applet-viewport" 
        className="w-full max-w-md bg-[var(--color-bg-elevated)] sm:rounded-3xl sm:border sm:border-slate-800/70 flex flex-col h-[100dvh] sm:h-[780px] sm:max-h-[95vh] overflow-hidden relative"
      >
        {/* Real-time floating notification glassmorphism toast */}
        {liveToast && (
          <div className="absolute top-4 left-4 right-4 z-55 bg-[var(--color-bg-elevated)]/95 border border-violet-500/40 rounded-2xl p-3.5 shadow-[0_12px_45px_rgba(0,0,0,0.7)] flex items-start gap-3 animate-slideDown select-none">
            <div className="text-xl p-2 bg-violet-950/60 border border-violet-800/35 rounded-xl">
              {liveToast.icon || "🔔"}
            </div>
            <div className="flex-1 space-y-0.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">{liveToast.title}</span>
                <span className="text-[8px] font-mono font-bold text-violet-400">JUST NOW</span>
              </div>
              <p className="text-[10px] text-slate-205 leading-relaxed font-semibold">{liveToast.message}</p>
            </div>
            <button 
              onClick={() => setLiveToast(null)}
              className="text-slate-500 hover:text-slate-200 p-0.5 cursor-pointer flex-shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Global Offline Safe-zone Banner */}
        {!isOnline && (
          <div className="bg-amber-950/90 border-b border-amber-800/45 px-3.5 py-2 flex items-center justify-center gap-2 z-40 mt-1.5 animate-bounce shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></span>
            <span className="text-[9px] font-black text-amber-200 uppercase tracking-widest text-center leading-normal">
              {profile?.language === "Amharic" 
                ? "የተቀመጡ ትምህርቶች ከመስመር ውጭ እየታዩ ነው።" 
                : profile?.language === "Oromo"
                ? "Barnoota kuufaman offline dubbisaa jirtu." 
                : "Viewing cached content offline. No new API calls possible."}
            </span>
          </div>
        )}

        {/* Inner page container */}
        {activeTab === "Coach" || (activeTab === "Dashboard" && activeChatStudent) ? (
          <section className="flex-1 flex flex-col overflow-hidden pb-14 relative z-10 w-full text-slate-100 select-text">
            {renderTabContent()}
          </section>
        ) : (
          <main className="flex-1 overflow-y-auto px-5 py-5 pb-32 text-slate-100 no-scrollbar relative z-10">
            {renderTabContent()}
          </main>
        )}

        {/* Floating Bottom Nav Rail (Fixed Dark Futuristic look) */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-elevated)] border-t border-slate-800/60 shadow-[0_-8px_25px_rgba(0,0,0,0.3)]">
          <nav 
            id="applet-bottom-navbar" 
            className="h-[72px] px-2 flex items-center justify-between"
          >
            {[
              { id: "Home", label: "Home", icon: <HomeIcon className="w-[22px] h-[22px]" /> },
              { id: "Books", label: "Books", icon: <BookOpen className="w-[22px] h-[22px]" /> },
              { id: "Coach", label: "Coach", icon: <Sparkles className="w-[28px] h-[28px] fill-current" /> },
              { id: "Progress", label: "Progress", icon: <TrendingUp className="w-[22px] h-[22px]" /> },
              { id: "Dashboard", label: "Connect", icon: <Users className="w-[22px] h-[22px]" /> },
              { id: "Quiz", label: "Quiz", icon: <CheckCircle className="w-[22px] h-[22px]" /> },
            ].map(tab => {
              const isSel = activeTab === tab.id;
              const isCoach = tab.id === "Coach";
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                     setActiveTab(tab.id as any);
                     // Reset books collapsible directory status if switching tabs
                     if (tab.id !== "Books") {
                       setSelectedSubUnit(null);
                       setQuizLessonContent(null);
                     }
                     if (tab.id !== "Dashboard") {
                       setActiveChatStudent(null);
                     }
                  }}
                  className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSel 
                      ? "text-emerald-400 font-extrabold scale-105" 
                      : "text-slate-500 hover:text-slate-400 font-medium"
                  } ${isCoach ? "relative z-50 -mt-5" : ""}`}
                >
                  <div className={`transition-all duration-300 flex items-center justify-center ${
                    isCoach 
                      ? "w-14 h-14 rounded-full bg-emerald-600 shadow-[0_4px_15px_rgba(16,185,129,0.35)] text-white border-4 border-[#0d1527] " + (isSel ? "scale-110 shadow-[0_4px_25px_rgba(16,185,129,0.6)] bg-emerald-500" : "scale-100")
                      : `p-1.5 rounded-xl ${isSel ? "bg-emerald-900/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] border border-emerald-800/30 -translate-y-1" : "translate-y-0"}`
                  }`}>
                    {tab.icon}
                  </div>
                  <span className={`text-[10px] tracking-wider uppercase transition-all ${isSel ? "font-bold" : "font-semibold"} ${isCoach ? "text-[11px] text-emerald-500 mt-1 font-bold" : "mt-1"}`}>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

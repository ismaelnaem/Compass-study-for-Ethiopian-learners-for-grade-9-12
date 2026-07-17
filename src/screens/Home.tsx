import React, { useState, useEffect, useMemo } from "react";
import { 
  Sparkles, Flame, Check, ChevronRight, Play, BookOpen, 
  HelpCircle, TrendingUp, Calendar, ListTodo, GraduationCap, ChevronDown,
  X, Share2, Copy, Bell, Info, ArrowRight, ShieldAlert, CheckCircle, RefreshCw,
  Trophy, Brain, Heart, ChevronLast, Sparkle, AlertCircle, Award, Smartphone, Download, Settings, Crown
} from "lucide-react";
import { UserProfile, Task, UserStats } from "../types";
import { CURRICULUM_DATA, Subject, SubUnit } from "../data";
import { getEthiopianTime } from "../utils/timeUtils";
import CustomIconText from "./CustomIconText";
import { calculateReadiness2_0 } from "../utils/readiness";
import { calculateStudyNextRecommendation } from "../utils/aiBrain";

interface HomeProps {
  profile: UserProfile;
  stats: UserStats;
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  onNavigateToBooks: (subUnitId?: string) => void;
  onTabChange: (tabName: "Home" | "Books" | "Coach" | "Progress" | "Profile" | "Quiz") => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateStats: (updates: Partial<UserStats>) => void;
  deferredPrompt?: any;
  onInstallClick?: () => void;
  isOnline?: boolean;
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  tag: string;
  actionTab: "Home" | "Books" | "Coach" | "Progress" | "Profile";
  read: boolean;
  date: string;
}

const VIBS = [
  { emoji: "😀", label: "Motivated" as const, text: "harder challenges awaits you!" },
  { emoji: "🙂", label: "Focused" as const, text: "maintaining steady consistency!" },
  { emoji: "😐", label: "Sleepy" as const, text: "let's maintain solid progress!" },
  { emoji: "🥱", label: "Tired" as const, text: "shorter high-yield study sessions." },
  { emoji: "😟", label: "Anxious" as const, text: "rebuilding core confidence first." },
  { emoji: "🤯", label: "Overwhelmed" as const, text: "exactly one simple task to complete!" }
];

export default function Home({ 
  profile, stats, tasks, toggleTask, onNavigateToBooks, onTabChange, onUpdateProfile, onUpdateStats,
  deferredPrompt, onInstallClick, isOnline = true
}: HomeProps) {
  const [showNotificationsTray, setShowNotificationsTray] = useState(false);
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [verifiedTeachbacks, setVerifiedTeachbacks] = useState<string[]>([]);
  const [ethioTime, setEthioTime] = useState(getEthiopianTime());
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);

  const isStandalone = typeof window !== "undefined" && (
    window.matchMedia("(display-mode: standalone)").matches || 
    (navigator as any).standalone === true
  );

  const isIOS = typeof navigator !== "undefined" && (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );

  // Keep local time ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setEthioTime(getEthiopianTime());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load verified teachbacks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("compass_verified_teachback_passes_v2");
      if (stored) {
        setVerifiedTeachbacks(JSON.parse(stored));
      } else {
        // Look up legacy key
        const legacy = localStorage.getItem("compass_verified_teachback_passes");
        if (legacy) {
          setVerifiedTeachbacks(JSON.parse(legacy));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Filter CURRICULUM_DATA to match the current student's level
  const getActiveSubUnits = (): { subUnit: SubUnit; subjectName: string }[] => {
    const list: { subUnit: SubUnit; subjectName: string }[] = [];
    CURRICULUM_DATA.forEach(sub => {
      if (sub.grade === profile.grade) {
        if (profile.gradeGroup === "11-12" && sub.stream && sub.stream !== profile.stream) {
          return;
        }
        sub.units.forEach(unit => {
          unit.subUnits.forEach(su => {
            list.push({ subUnit: su, subjectName: sub.name });
          });
        });
      }
    });
    return list;
  };

  const globalReadinessReport = useMemo(() => {
    return calculateReadiness2_0(profile, stats, CURRICULUM_DATA, verifiedTeachbacks);
  }, [profile, stats, verifiedTeachbacks]);

  /**
   * NO GUESSING RULE: Mastery levels/scores must come strictly from evidence
   * and use the advanced Readiness 2.0 engine.
   */
  const getSubjectMasteryInfo = (subjectName: string) => {
    const report = globalReadinessReport;
    const matchingKey = Object.keys(report.subjectBreakdown).find(
      key => key.toLowerCase() === subjectName.toLowerCase()
    );
    if (!matchingKey) return null;
    const subRep = report.subjectBreakdown[matchingKey];
    if (subRep.evidenceCount === 0 && subRep.coverage === 0) return null; // No evidence
    return {
      score: subRep.readiness, // advanced math-grounded Readiness 2.0 score
      evidenceCount: subRep.evidenceCount,
      totalCount: parseInt(subRep.masteryRatio.split("/")[1]) || 12
    };
  };

  /**
   * Overall Readiness Score based strictly on averaged subject scores with evidence.
   * If there's absolutely no evidence on any subject, return null (Assessment Required).
   */
  const getOverallReadiness = (): number | null => {
    const report = globalReadinessReport;
    if (report.completedSubUnitsCount === 0) {
      return null;
    }
    return report.overallReadiness;
  };

  const handleSelectVibe = (vibeName: "Motivated" | "Focused" | "Tired" | "Sleepy" | "Anxious" | "Overwhelmed") => {
    onUpdateProfile({ emotionalState: vibeName });
  };

  // Generate real-time tailored notification alerts
  useEffect(() => {
    const alerts: SmartNotification[] = [];
    const dateStr = "Today";

    if (stats.streak && stats.streak > 0) {
      alerts.push({
        id: "streak-act",
        title: "Streak is Burning!",
        message: `Excellent job! You are keeping a ${stats.streak}-day streak alive right now.`,
        tag: "[FIRE]",
        actionTab: "Books",
        read: false,
        date: dateStr
      });
    }

    const readiness = getOverallReadiness();
    if (readiness !== null && readiness < 65) {
      alerts.push({
        id: "read-improve",
        title: "Boost Readiness Score",
        message: "Your current assessments indicate spaces for improvement. Let's fix that!",
        tag: "[TARGET]",
        actionTab: "Progress",
        read: false,
        date: dateStr
      });
    }

    setNotifications(alerts);
  }, [stats.streak, stats.quizHighScores, verifiedTeachbacks.length]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = (notif: SmartNotification) => {
    const updated = notifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
    setNotifications(updated);
    setShowNotificationsTray(false);
    onTabChange(notif.actionTab);
  };

  // Determine the active units & upcoming missions
  const activeMissions = tasks.slice(0, 3);

  // Safe AI Brain Logic for "Study Next"
  const recommendedAction = useMemo(() => {
    return calculateStudyNextRecommendation(profile, stats, verifiedTeachbacks);
  }, [profile, stats, verifiedTeachbacks]);

  return (
    <div className="space-y-4 text-left pb-16 relative">
      
      {/* 1. HEADER SECTION */}
      <div className="flex items-center justify-between text-left">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onTabChange("Profile")}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest text-[#128c30] flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Study Coach</span>
            </span>
            <h2 className="text-xl font-black text-white leading-tight mt-0.5">
              {ethioTime.greeting},
            </h2>
            <h3 className="text-xs font-bold text-slate-300 leading-none mt-0.5">
              {profile.name === "Serious Student" ? "Scholar" : profile.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!profile.isPremium && (
            <button 
              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 transition"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Premium</span>
            </button>
          )}

          <button 
            onClick={() => setShowNotificationsTray(!showNotificationsTray)}
            className="p-2.5 bg-[#0a1021] hover:bg-slate-850 border border-slate-800/80 rounded-xl relative cursor-pointer text-slate-400 hover:text-slate-100 transition"
          >
            <Bell className="w-4 h-4 text-amber-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-650 text-white font-black text-[8px] px-1.5 py-0.2 rounded-full border border-[#04060d]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS CONTAINER Overlay */}
      {showNotificationsTray && (
        <div className="p-4 glass-card rounded-2xl relative z-40 space-y-3 shadow-2xl animate-slideDown">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">Study Alerts (EAT)</span>
            <button onClick={() => setShowNotificationsTray(false)} className="text-slate-500 p-0.5"><X className="w-3.5 h-3.5" /></button>
          </div>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-[10px] text-slate-500 text-center py-2">No active notifications</p>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => handleNotifClick(n)}
                  className="p-3 bg-slate-950/45 border border-white/5 rounded-xl hover:bg-slate-950 flex justify-between items-center cursor-pointer text-left gap-2.5"
                >
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-white">{n.title}</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{n.message}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Clean offline status alert */}
      {!isOnline && (
        <div className="p-3 bg-amber-950/35 border border-amber-800/40 rounded-2xl flex items-start gap-2.5 shadow-sm text-slate-150 relative overflow-hidden transition-all">
          <div className="p-1 px-1.5 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 font-extrabold text-[9px] tracking-wider uppercase">OFFLINE</div>
          <div className="flex-1 space-y-1">
            <p className="text-[11px] font-extrabold text-amber-200">Local Cache Safety Mode Active</p>
            <p className="text-[10px] text-slate-300 leading-normal">
              Your exam practice progress, streaks, and studying updates are safely saved locally in your browser. They will automatically save to your cloud account once you are reconnected.
            </p>
          </div>
        </div>
      )}

      {/* Mental vibe status quick check */}
      <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/35 space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[8.5px] font-black uppercase text-violet-400 tracking-wider font-mono">🧠 Mental Vibe Track</span>
          {profile.emotionalState && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 font-black uppercase border border-violet-850">
              {profile.emotionalState}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {VIBS.map(v => (
            <button
              key={v.label}
              onClick={() => handleSelectVibe(v.label)}
              className={`p-2 rounded-xl flex flex-col items-center flex-1 min-w-[52px] border cursor-pointer transition-all ${
                profile.emotionalState === v.label 
                  ? "bg-violet-650 border-violet-500 text-white shadow-md shadow-violet-950" 
                  : "bg-[#0b1021]/80 border-slate-850 text-slate-400 hover:text-slate-250 hover:bg-slate-900"
              }`}
              title={v.label}
            >
              <span className="text-base leading-none mb-0.5">{v.emoji}</span>
              <span className="text-[7.5px] font-black uppercase truncate max-w-full">
                {v.label}
              </span>
            </button>
          ))}
        </div>
      </div>



      {/* ==============================================================================
          PRIMARY ACTION: STUDY NEXT
          ============================================================================== */}
      <div 
        onClick={() => {
          if (recommendedAction.targetSubUnit) {
            onNavigateToBooks(recommendedAction.targetSubUnit);
          } else if (recommendedAction.targetTab) {
            onTabChange(recommendedAction.targetTab);
          } else {
            onTabChange("Progress");
          }
        }}
        className="p-4 bg-[#070b16]/80 rounded-3xl border border-emerald-900/30 relative overflow-hidden flex flex-col gap-3 shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:border-emerald-800/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 px-3 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 font-mono text-[10px] font-black uppercase tracking-widest leading-none">
              Study Next
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="space-y-1.5 mt-1 text-left">
          <h4 className="text-sm font-bold text-slate-100 leading-snug">
            {recommendedAction.title}
          </h4>
          <p className="text-xs leading-relaxed text-slate-400">
            {recommendedAction.desc}
          </p>
        </div>
      </div>

      {/* ==============================================================================
          MY SUBJECTS (Quick Access)
          ============================================================================== */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest pl-1">My Subjects</h4>
        <div className="grid grid-cols-2 gap-3">
          {["Mathematics", "Physics", "Chemistry", "Biology"].map(sub => (
            <div 
              key={sub}
              onClick={() => onTabChange("Books")}
              className="p-3 bg-[#0a1021]/80 rounded-2xl border border-slate-850 flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:border-slate-700"
            >
              <span className="text-xs font-bold text-slate-200">{sub}</span>
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            </div>
          ))}
        </div>
      </div>

      {/* ==============================================================================
          MY PROGRESS
          ============================================================================== */}
      <div 
        onClick={() => onTabChange("Progress")}
        className="p-4 bg-[#0a1021]/80 rounded-3xl border border-slate-850 flex flex-col gap-3 text-left shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:border-slate-700"
      >
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">My Progress</h4>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="p-3 bg-[#050812]/90 border border-slate-900 rounded-2xl">
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Study Streak</p>
            <p className="text-lg font-black text-slate-200">{stats.streak || 0} Days</p>
          </div>
          <div className="p-3 bg-[#050812]/90 border border-slate-900 rounded-2xl">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mastered Topics</p>
            <p className="text-lg font-black text-slate-200">{verifiedTeachbacks.length}</p>
          </div>
        </div>
      </div>

      {/* ==============================================================================
          TIPS & SUGGESTIONS
          ============================================================================== */}
      <div className="p-4 bg-[#070b16]/80 rounded-3xl border border-amber-900/30 text-left relative overflow-hidden flex flex-col gap-3 shadow-sm">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-20 h-20 bg-amber-500/5 rounded-full pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Tips & Suggestions</h4>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        <div className="space-y-1.5 mt-1">
          {(() => {
            const readiness = getOverallReadiness();
            if (readiness === null) {
              return (
                <p className="text-xs leading-relaxed text-slate-400">
                  Pick a topic and practice in the Books section so I can give you personalized tips!
                </p>
              );
            }

            const weakSubject = ["Chemistry", "Physics", "Biology"].find(sub => {
              const info = getSubjectMasteryInfo(sub);
              return info !== null && info.score < 75;
            });

            if (weakSubject) {
              return (
                <p className="text-xs leading-relaxed text-slate-350">
                  <strong className="text-amber-400">Suggestion:</strong> Review <strong className="text-slate-200">{weakSubject}</strong> topics today. Improving this will boost your overall exam progress.
                </p>
              );
            }

            return (
              <p className="text-xs leading-relaxed text-slate-350">
                <strong className="text-emerald-400">Great Job!</strong> Your progress is solid. Keep taking quizzes to maintain your understanding.
              </p>
            );
          })()}
        </div>
      </div>

    </div>
  );
}

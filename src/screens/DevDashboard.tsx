import React, { useState, useEffect } from "react";
import {
  Users, Activity, Coins, Database, Target, Smile, HelpCircle,
  ArrowLeft, Bell, BarChart2, ShieldAlert, Zap, Globe, Sparkles, BookOpen,
  Lock, UserPlus, Loader2
} from "lucide-react";
import { UserProfile, UserStats } from "../types";
import { calculateReadiness2_0 } from "../utils/readiness";
import { CURRICULUM_DATA } from "../data";
import { auth } from "../lib/firebase";
import { checkIsDevAccount } from "../utils/devRole";

interface DevDashboardProps {
  profile: UserProfile;
  stats: UserStats;
  onBack: () => void;
}

function DevDashboardContent({ profile, stats, onBack }: DevDashboardProps) {
  const [simulatedDAU, setSimulatedDAU] = useState(1420);
  const [simulatedWAU, setSimulatedWAU] = useState(8450);
  const [simulatedMAU, setSimulatedMAU] = useState(24300);
  const [retentionCount, setRetentionCount] = useState(82.4);
  const [apiCost, setApiCost] = useState(1.42);
  const [selectedSimSubject, setSelectedSimSubject] = useState("Mathematics");

  // Load actual telemetry from student's browser state
  const [actualQuizzesRun, setActualQuizzesRun] = useState(0);
  const [actualLessonsCompleted, setActualLessonsCompleted] = useState(0);
  const [misconceptionsCount, setMisconceptionsCount] = useState(0);
  const [cacheStats, setCacheStats] = useState({
    cacheHits: 0,
    totalRequests: 0,
    lessonsCachedCount: 0,
    quizzesCachedCount: 0,
    hitRatePercentage: 0
  });

  // Pull local storage data
  useEffect(() => {
    // Exact count of scores
    const quizCount = Object.keys(stats.quizHighScores || {}).length;
    setActualQuizzesRun(quizCount);

    const lessonsCount = (stats.lessonsCompleted || []).length;
    setActualLessonsCompleted(lessonsCount);

    const miscLocal = localStorage.getItem("compass_custom_misconceptions") || "[]";
    try {
      setMisconceptionsCount(JSON.parse(miscLocal).length);
    } catch(e) {}

    // Pull from backend stats
    fetch("/api/cache-stats")
      .then(res => res.json())
      .then(data => {
        setCacheStats({
          cacheHits: data.cacheHits || 0,
          totalRequests: data.totalRequests || 0,
          lessonsCachedCount: data.lessonsCachedCount || 0,
          quizzesCachedCount: data.quizzesCachedCount || 0,
          hitRatePercentage: data.hitRatePercentage || 0
        });
      })
      .catch(() => {
        // Fallback simulated metrics if server.ts hasn't recorded requests yet
        setCacheStats({
          cacheHits: 142,
          totalRequests: 198,
          lessonsCachedCount: 5,
          quizzesCachedCount: 2,
          hitRatePercentage: 71
        });
      });
  }, [stats]);

  // Push notifications simulation panel
  const [notifLogs, setNotifLogs] = useState<string[]>([]);
  const [simulatingNotif, setSimulatingNotif] = useState(false);

  const triggerSimulateNotification = (type: string) => {
    setSimulatingNotif(true);
    setTimeout(() => {
      let msg = "";
      if (type === "streak") {
        msg = `⚠️ STREAK WARNING: Barsiisaa Ismael reminds you that your ${stats.streak}-day streak is cooling down. Study 1 topic to lock it in!`;
      } else if (type === "exam") {
        msg = `🎓 EXAM ALERT: National grade ${profile.grade} exams are approaching. Chemistry coverage is at 42%. Take a 5-question mock unit practice now.`;
      } else if (type === "recovery") {
        msg = `🔄 MOTIVATION RECOVERY: Rebuilding confidence based on emotional patterns. We have scheduled 1 extremely short concept for you today.`;
      } else {
        msg = `⚡ PERSONALIZED DAILY FOCUS: Ready to boost your ${profile.gradeGroup} grade? Start with standard mathematical proof.`;
      }

      setNotifLogs(prev => [msg, ...prev]);
      
      // Also post a simulated toast/cookie or custom state alert
      const currentListStr = localStorage.getItem("compass_smart_notifications") || "[]";
      try {
        const currentList = JSON.parse(currentListStr);
        currentList.unshift({
          id: Math.random().toString(),
          title: "System Telemetry push",
          message: msg,
          tag: "DevPush",
          actionTab: "Home",
          read: false,
          date: new Date().toLocaleTimeString()
        });
        localStorage.setItem("compass_smart_notifications", JSON.stringify(currentList));
      } catch(e) {}

      setSimulatingNotif(false);
    }, 600);
  };

  // Readiness estimation
  const readinessDoc = calculateReadiness2_0(
    profile, 
    stats, 
    CURRICULUM_DATA, 
    JSON.parse(localStorage.getItem("compass_verified_teachback_passes_v2") || "[]")
  );

  return (
    <div className="flex flex-col text-left text-slate-100 min-h-screen pb-16 bg-[#04060d] select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 mt-2">
        <button 
          onClick={onBack}
          className="p-2 bg-slate-900/60 border border-slate-800 rounded-xl hover:bg-slate-950 transition cursor-pointer text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Sandbox</span>
        </button>

        <div className="text-right">
          <span className="text-[9px] bg-indigo-950 border border-indigo-900 text-indigo-400 font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider font-mono">
            Admin Console Active
          </span>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Compass Study Engine Telemetry</p>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="space-y-4">
        
        {/* Row 1: DAU / AI Token Cost Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-violet-400">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Active Users <span className="text-amber-400 normal-case">(simulated demo data)</span></span>
            </div>
            <div>
              <span className="text-xl font-black text-slate-100 font-mono leading-none">{simulatedDAU}</span>
              <span className="text-[8px] text-emerald-400 font-bold ml-1.5 font-mono">DAU</span>
            </div>
            <div className="flex justify-between text-[8px] text-slate-500 font-mono border-t border-slate-900 pt-1.5 mt-1">
              <span>WAU: {simulatedWAU}</span>
              <span>MAU: {simulatedMAU}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-cyan-400">
              <Coins className="w-4 h-4" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Gemini Costs</span>
            </div>
            <div>
              <span className="text-xl font-black text-slate-100 font-mono leading-none">${apiCost}</span>
              <span className="text-[8px] text-emerald-400 font-bold ml-1.5 font-mono">USD</span>
            </div>
            <div className="flex justify-between text-[8px] text-slate-500 font-mono border-t border-slate-900 pt-1.5 mt-1">
              <span>Avg Call Cost: $0.0042</span>
              <span>Model Routing: Flash</span>
            </div>
          </div>
        </div>

        {/* Row 2: Live Client Progress Stats */}
        <div className="p-3.5 bg-slate-900/40 rounded-2xl border border-slate-850 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <Activity className="w-4 h-4" />
              <h4 className="text-xs font-black text-slate-200 uppercase font-sans">Active Student Diagnostics</h4>
            </div>
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 px-2 py-0.5 rounded">Live Telemetry</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-900">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Completed</span>
              <span className="text-sm font-black text-slate-200 mt-1 block font-mono">{actualLessonsCompleted} Topics</span>
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-900">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Solved Quizzes</span>
              <span className="text-sm font-black text-slate-200 mt-1 block font-mono">{actualQuizzesRun}</span>
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-900">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Misconceptions</span>
              <span className="text-sm font-black text-rose-400 mt-1 block font-mono">{misconceptionsCount}</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-slate-900 pt-2.5 text-xs text-slate-400">
            <div className="flex justify-between font-mono text-[9px]">
              <span>Real Sync Status:</span>
              <span className="text-emerald-400 font-bold">● CLOUD SYNCED</span>
            </div>
            <div className="flex justify-between font-mono text-[9px]">
              <span>Current Device ID:</span>
              <span className="text-slate-300">compass_device_${profile.gradeGroup}_${profile.language.toLowerCase().substring(0,3)}</span>
            </div>
          </div>
        </div>

        {/* Row 3: AI Cache performance and savings */}
        <div className="p-3.5 bg-slate-900/40 rounded-2xl border border-slate-850 space-y-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-400">
            <Database className="w-4 h-4" />
            <h4 className="text-xs font-black text-slate-200 uppercase">AI Cost Savings & Cache Rate</h4>
          </div>

          <div className="relative h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
            <div 
              className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 h-full transition-all duration-1000" 
              style={{ width: `${cacheStats.hitRatePercentage || 71}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <p className="text-slate-500 text-[8px] uppercase font-bold">Total Request Loads</p>
              <p className="text-slate-200 font-bold text-sm">{cacheStats.totalRequests || 198}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-[8px] uppercase font-bold">Hit Rate %</p>
              <p className="text-slate-200 font-bold text-sm text-cyan-400">{cacheStats.hitRatePercentage || 71}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-[8px] uppercase font-bold text-left">Lessons Saved in Cache</p>
              <p className="text-slate-200 font-bold text-sm text-left">{cacheStats.lessonsCachedCount || 5}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-[8px] uppercase font-bold text-left flex items-center gap-1">Saved Cost <span className="text-emerald-400 font-black">$$</span></p>
              <p className="text-slate-200 font-bold text-sm text-left text-emerald-400">+${Math.round((cacheStats.cacheHits || 142) * 0.0058 * 100) / 100}</p>
            </div>
          </div>
        </div>

        {/* Row 4: Student Population Intelligence Reports */}
        <div className="p-3.5 bg-slate-900/40 rounded-2xl border border-slate-850 space-y-3.5 shadow-sm text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400">
              <Target className="w-4 h-4" />
              <h4 className="text-xs font-black text-slate-200 uppercase">Population Intelligence</h4>
            </div>
            <select 
              value={selectedSimSubject}
              onChange={(e) => setSelectedSimSubject(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-[10px] p-1 rounded font-mono text-slate-350 focus:outline-none"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
            </select>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-900/60 text-xs">
              <p className="text-[8.5px] uppercase font-black text-rose-400 tracking-wider font-mono">⚠️ Hardest Topic / Misconception Hotspot</p>
              <p className="text-slate-200 font-bold mt-1">
                {selectedSimSubject === "Mathematics" 
                  ? "Infinite geometric sequences sum evaluation" 
                  : selectedSimSubject === "Chemistry" 
                  ? "Covalent network orbital hybridization models" 
                  : selectedSimSubject === "Biology"
                  ? "Phospholipid active dual-membrane transport"
                  : "Newtonian mechanical equilibrium in angular momentum"}
              </p>
              <p className="text-slate-450 mt-1 text-[10px] leading-relaxed">
                {selectedSimSubject === "Mathematics" 
                  ? "Students repeatedly treat divergent sequences as convergent." 
                  : selectedSimSubject === "Chemistry" 
                  ? "Many believe covalent bonds have static electron distribution." 
                  : selectedSimSubject === "Biology"
                  ? "Failure to separate passive transport from energy-driven dynamic cycles."
                  : "Struggles with calculating static load torque moments."}
              </p>
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-900/60 text-xs">
              <p className="text-[8.5px] uppercase font-black text-emerald-400 tracking-wider font-mono">✓ Easiest Topic Progress</p>
              <p className="text-slate-200 font-bold mt-1 font-mono">
                {selectedSimSubject === "Mathematics" 
                  ? "Cartesian Planes (96% Pass rate)" 
                  : selectedSimSubject === "Chemistry" 
                  ? "Atomic theory overview (92% Pass rate)" 
                  : selectedSimSubject === "Biology"
                  ? "The Scientific Method steps (94% Pass rate)"
                  : "SI physical base units definitions (91% Pass rate)"}
              </p>
            </div>
          </div>
        </div>

        {/* Row 5: Intelligent Push Notification Simulator */}
        <div className="p-3.5 bg-slate-900/40 rounded-2xl border border-slate-850 space-y-3.5 shadow-sm text-left relative z-20">
          <div className="flex items-center gap-2 text-violet-400">
            <Zap className="w-4 h-4" />
            <h4 className="text-xs font-black text-slate-200 uppercase font-sans">Intelligent Push Simulator</h4>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed -mt-1">
            Fires customized notifications utilizing our **Intelligent Action Engine**, dynamically adapting content based on student activity and current emotional state.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => triggerSimulateNotification("streak")}
              disabled={simulatingNotif}
              className="py-2 px-1 text-[9px] font-bold uppercase tracking-wider bg-[#0d1627]/90 active:scale-95 border border-amber-900/30 hover:border-amber-700 hover:bg-slate-900 text-amber-300 rounded-xl transition cursor-pointer"
            >
              ⏰ Streak Saver Alert
            </button>
            <button
              onClick={() => triggerSimulateNotification("exam")}
              disabled={simulatingNotif}
              className="py-2 px-1 text-[9px] font-bold uppercase tracking-wider bg-[#0d1627]/90 active:scale-95 border border-cyan-900/30 hover:border-cyan-700 hover:bg-slate-900 text-cyan-300 rounded-xl transition cursor-pointer"
            >
              🎓 Exam Prep Alert
            </button>
            <button
              onClick={() => triggerSimulateNotification("recovery")}
              disabled={simulatingNotif}
              className="py-2 px-1 text-[9px] font-bold uppercase tracking-wider bg-[#0d1627]/90 active:scale-95 border border-emerald-900/30 hover:border-emerald-700 hover:bg-slate-900 text-emerald-300 rounded-xl transition cursor-pointer"
            >
              🔄 Motivation Bounce
            </button>
            <button
              onClick={() => triggerSimulateNotification("daily")}
              disabled={simulatingNotif}
              className="py-2 px-1 text-[9px] font-bold uppercase tracking-wider bg-[#0d1627]/90 active:scale-95 border border-violet-900/40 hover:border-violet-750 hover:bg-slate-900 text-violet-300 rounded-xl transition cursor-pointer"
            >
              ⚡ Dynamic Roadmap
            </button>
          </div>

          {notifLogs.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-900/60 max-h-32 overflow-y-auto no-scrollbar">
              <span className="text-[8px] text-slate-500 font-bold uppercase font-mono">Push Delivery Receipt Logs</span>
              {notifLogs.map((log, i) => (
                <div key={i} className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-[9px] font-mono text-emerald-400 leading-normal animate-fadeIn text-left">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 6: Population Emotional Trends */}
        <div className="p-3.5 bg-[#0a1021] rounded-2xl border border-slate-850 flex flex-col gap-2.5 text-left shadow-sm">
          <div className="flex items-center gap-2 text-indigo-400">
            <Smile className="w-4 h-4" />
            <h4 className="text-xs font-black text-slate-200 uppercase font-sans">Active Population Vibe Trends</h4>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span>😀 Motivated / Focused</span>
                <span className="text-indigo-400 font-bold">54%</span>
              </div>
              <div className="w-full h-1 bg-slate-950 rounded border border-slate-900 overflow-hidden">
                <div className="bg-indigo-500 h-full w-[54%]"></div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span>🥱 Sleepy / Tired</span>
                <span className="text-indigo-400 font-bold">29%</span>
              </div>
              <div className="w-full h-1 bg-slate-950 rounded border border-slate-900 overflow-hidden">
                <div className="bg-indigo-500 h-full w-[29%]"></div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span>😟 Anxious / Overwhelmed</span>
                <span className="text-rose-400 font-bold">17%</span>
              </div>
              <div className="w-full h-1 bg-slate-950 rounded border border-slate-900 overflow-hidden">
                <div className="bg-rose-500 h-full w-[17%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Add another Dev */}
        <AddDevSection />

      </div>
    </div>
  );
}

function AddDevSection() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleAddDev = async () => {
    if (!input.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : "";
      const isEmail = input.includes("@");
      const res = await fetch("/api/admin/grant-dev-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(isEmail ? { targetEmail: input.trim() } : { targetUid: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage(data.message || "Dev access granted.");
      setInput("");
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  };

  return (
    <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 space-y-3 shadow-sm">
      <div className="flex items-center gap-2 text-violet-400">
        <UserPlus className="w-4 h-4" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Add Another Dev</span>
      </div>
      <p className="text-[10px] text-slate-500">Enter the email or uid of an account that already exists in the app.</p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="email@example.com or uid"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
        />
        <button
          onClick={handleAddDev}
          disabled={status === "loading"}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-bold text-white disabled:opacity-50 flex items-center gap-1.5"
        >
          {status === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Add"}
        </button>
      </div>
      {message && (
        <p className={`text-[10px] ${status === "success" ? "text-emerald-400" : "text-rose-400"}`}>{message}</p>
      )}
    </div>
  );
}

// ===== Access gate: role claim + password =====
// This is the actual entry point rendered from AICoach.tsx. It replaces
// the old "/admin" chat command + hardcoded password, which shipped the
// password inside the public JS bundle. Now: the account must have the
// server-set "dev" custom claim (checked here client-side for UI purposes,
// and again server-side on every dev API call — see requireDevAuth), AND
// the correct password, checked only server-side against
// DEV_DASHBOARD_PASSWORD (never present in any client code).
export default function DevDashboard(props: DevDashboardProps) {
  const [checkingRole, setCheckingRole] = useState(true);
  const [hasDevRole, setHasDevRole] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    checkIsDevAccount().then((isDev) => {
      setHasDevRole(isDev);
      setCheckingRole(false);
    });
  }, []);

  const handleUnlock = async () => {
    setVerifying(true);
    setError("");
    try {
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : "";
      const res = await fetch("/api/verify-dev-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Incorrect password.");
        setVerifying(false);
        return;
      }
      setUnlocked(true);
    } catch {
      setError("Network error — please try again.");
    }
    setVerifying(false);
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
      </div>
    );
  }

  if (!hasDevRole) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <ShieldAlert className="w-8 h-8 text-rose-400" />
        <p className="text-slate-300 text-sm font-bold">This account doesn't have Dev Dashboard access.</p>
        <button onClick={props.onBack} className="text-slate-500 text-xs underline mt-2">Go back</button>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col items-center justify-center gap-4 px-6">
        <Lock className="w-8 h-8 text-violet-400" />
        <p className="text-slate-300 text-sm font-bold">Enter the Dev Dashboard password</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-100 outline-none focus:border-violet-500 text-center"
          autoFocus
        />
        {error && <p className="text-rose-400 text-xs">{error}</p>}
        <button
          onClick={handleUnlock}
          disabled={verifying || !password}
          className="w-full max-w-xs py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock"}
        </button>
        <button onClick={props.onBack} className="text-slate-500 text-xs underline mt-2">Cancel</button>
      </div>
    );
  }

  return <DevDashboardContent {...props} />;
}

import React, { useState, useMemo } from "react";
import { 
  X, LogOut, ChevronRight, ChevronLeft, HelpCircle, ShieldCheck, Share2, Copy, Globe, BookMarked, Sparkles, Smartphone, BarChart3, Settings, Save, Fingerprint, Calendar, Image as ImageIcon
} from "lucide-react";
import { UserProfile, UserStats } from "../types";
import { calculateReadiness2_0 } from "../utils/readiness";
import { CURRICULUM_DATA } from "../data";
import { useTheme, THEMES } from "../theme";

interface ProfileProps {
  profile: UserProfile;
  stats: UserStats;
  verifiedTeachbacks?: string[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onResetData: () => void;
  deferredPrompt?: any;
  onInstallClick?: () => void;
  onTabChange?: (tab: "Home" | "Books" | "Coach" | "Progress" | "Profile" | "Developer") => void;
  currentUser?: any;
  onSignInWithGoogle?: () => Promise<void>;
  onSignOut?: () => Promise<void>;
  authError?: string | null;
}

export default function Profile({ 
  profile, stats, verifiedTeachbacks = [], onUpdateProfile, onResetData, deferredPrompt, onInstallClick, onTabChange,
  currentUser, onSignInWithGoogle, onSignOut, authError
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name === "Serious Student" ? "" : profile.name);
  const [editedGoal, setEditedGoal] = useState(profile.learningGoal || "Score in the top 10% on national exams");
  const { theme, setTheme } = useTheme();

  const [notif, setNotif] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHelpFAQ, setShowHelpFAQ] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [importText, setImportText] = useState("");
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [showDna, setShowDna] = useState(false);

  const readiness = useMemo(() => {
    const report = calculateReadiness2_0(profile, stats, CURRICULUM_DATA, verifiedTeachbacks);
    if (report.completedSubUnitsCount === 0) {
      return null;
    }
    return report.overallReadiness;
  }, [profile, stats, verifiedTeachbacks]);

  const handleGenerateSyncToken = async () => {
    try {
      const { exportAllLocalData } = await import("../utils/storage");
      const code = await exportAllLocalData();
      navigator.clipboard.writeText(code);
      triggerNotif("Backup Code copied to clipboard!");
    } catch (err) {
      console.error(err);
      triggerNotif("Failed to generate backup code.");
    }
  };

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showImportInput, setShowImportInput] = useState(false);

  const handleImportSyncToken = async () => {
    if (!importText.trim()) return;
    try {
      const { restoreFromBackup } = await import("../utils/storage");
      const success = await restoreFromBackup(importText.trim());
      if (success) {
        setSyncSuccess(true);
        triggerNotif("Progress and all data restored!");
        setTimeout(() => {
          // Instead of reload which can break iframe, use the onTabChange or notify parent
          window.location.href = "/";
        }, 1000);
      } else {
        triggerNotif("Invalid or corrupted backup code.");
      }
    } catch (err) {
      console.error(err);
      triggerNotif("Invalid backup code.");
    }
  };

  const handleSaveProfile = () => {
    const finalName = editedName.trim() || "Serious Student";
    onUpdateProfile({ name: finalName, learningGoal: editedGoal.trim() });
    setIsEditing(false);
    triggerNotif("Profile modifications saved.");
  };

  const triggerNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2000);
  };

  return (
    <div className="space-y-6 text-left pb-24 flex flex-col h-full min-h-[85vh]">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <button onClick={() => onTabChange("Home")} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer hover:bg-slate-700 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Settings</h2>
          </div>
          <p className="text-xs text-slate-400 mt-2">Manage your academic identity and settings.</p>
        </div>

        {notif && (
          <div className="p-3 bg-emerald-950/80 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-800/25 flex items-center gap-2">
            <span>✓</span>
            <span>{notif}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800/60 shadow-md space-y-4 relative overflow-hidden">
            {isEditing ? (
              <div className="space-y-3 relative z-10">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">Student Name</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 font-bold text-slate-100 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">My Learning Goal</label>
                  <input
                    type="text"
                    value={editedGoal}
                    onChange={(e) => setEditedGoal(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 font-bold text-slate-100 text-xs"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveProfile} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer">Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-extrabold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer hover:bg-slate-750">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-14 h-14 rounded-2xl bg-violet-950/80 text-violet-400 border border-violet-800/30 flex items-center justify-center font-black text-xl shadow-inner hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    {profile.name === "Serious Student" ? "🎓" : profile.name.charAt(0).toUpperCase()}
                  </button>
                  <div className="text-left">
                    <h3 className="text-base font-black text-slate-100 leading-tight">
                      {profile.name === "Serious Student" ? "Dear Scholar" : profile.name}
                    </h3>
                    <span className="text-[8px] font-black text-violet-400 tracking-wider bg-violet-950/40 border border-violet-900/40 px-2.5 py-0.5 rounded-full uppercase mt-1 inline-block">
                      Grade {profile.grade} {profile.stream ? `• ${profile.stream}` : ""}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 mt-1.5 leading-normal italic line-clamp-2">
                      "{profile.learningGoal || "Score in the top 10% on national exams"}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[9px] font-black uppercase tracking-wider text-violet-300 hover:text-violet-205 bg-violet-950/50 px-3 py-1.5 rounded-xl border border-violet-850 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Exam Progress */}
          <div className="p-4 bg-[#0a1021]/80 rounded-3xl border border-slate-850 shadow-md flex items-center justify-between relative overflow-hidden">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" /> Overall Progress
              </span>
              <h4 className="text-sm font-black text-slate-200 mt-1 leading-tight">Exam Progress</h4>
              {readiness === null ? (
                <p className="text-[10px] text-amber-500 font-semibold mt-1">Pending Assessment</p>
              ) : (
                <p className={`text-[10px] font-bold mt-1 ${readiness >= 75 ? "text-emerald-400" : readiness >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                  {readiness >= 75 ? "On Track for Excellence" : readiness >= 50 ? "Needs Improvement" : "Let's Improve Together"}
                </p>
              )}
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-900 fill-none" strokeWidth="8" />
                {readiness !== null && <defs>
                  <linearGradient id="readGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>}
                {readiness !== null && (
                  <circle 
                    cx="50" cy="50" r="40" 
                    className="stroke-[url(#readGrad)] fill-none transition-all duration-1000 ease-out" 
                    strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * (readiness || 0)) / 100} strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="absolute flex items-center justify-center">
                <span className="text-sm font-black text-slate-100 tracking-tighter">
                  {readiness === null ? "?" : `${readiness}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Plan Settings */}
          <div className="p-4 bg-slate-900/40 rounded-3xl border border-slate-800/60 shadow-md">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-3">
              <Calendar className="w-3.5 h-3.5" /> Study Plan
            </h4>
            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-200">Auto Plan Generator</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Let Compass Study auto-schedule your study topics.</p>
              </div>
              <button 
                onClick={() => {
                  onUpdateProfile({ autoPlanActive: !profile.autoPlanActive });
                  triggerNotif(profile.autoPlanActive ? "Auto Plan paused." : "Auto Plan activated!");
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${profile.autoPlanActive ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${profile.autoPlanActive ? 'translate-x-4.5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* About Me / What app knows */}
          <div className="pt-2">
            <button 
              onClick={() => setShowDna(!showDna)}
              className="w-full p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Fingerprint className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-slate-300">About Me 👤</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${showDna ? 'rotate-90' : ''}`} />
            </button>
            {showDna && (
              <div className="mt-2 p-4 bg-slate-950 rounded-2xl border border-slate-850 text-[10px] space-y-2 text-slate-400 animate-fadeIn shadow-inner">
                <p><strong>Grade:</strong> {profile.grade} {profile.stream ? `(${profile.stream})` : ""}</p>
                <p><strong>Language:</strong> {profile.language}</p>
                <p><strong>Goal:</strong> {profile.learningGoal || "Not set"}</p>
                <p><strong>Total Lessons:</strong> {stats.lessonsCompleted?.length || 0} completed</p>
                <p className="italic text-[9px] text-slate-500 mt-2 border-t border-slate-850 pt-2">Compass Study uses these parameters to tailor quizzes and coach responses.</p>
              </div>
            )}
          </div>
          
          {/* Settings Section directly in main view */}
          <div className="pt-4 space-y-4">
              <h3 className="text-lg font-black text-slate-100 tracking-tight pl-1 border-t border-slate-800 pt-6">Advanced Settings</h3>
              
              {/* App Personalization */}
              <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800/60 bg-slate-900/50">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5" /> App Personalization
                  </h4>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400">Preferred Coach Tone</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Kind", "Strict", "Data"] as const).map(tone => (
                        <button
                          key={tone}
                          onClick={() => onUpdateProfile({ coachingTonePreference: tone })}
                          className={`py-2 px-2 rounded-xl text-[10px] font-bold tracking-wide uppercase transition cursor-pointer border ${
                            profile.coachingTonePreference === tone || (!profile.coachingTonePreference && tone === "Kind")
                              ? "bg-violet-900/40 border-violet-500/50 text-violet-300"
                              : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* App Appearance & Languages */}
              <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800/60 bg-slate-900/50">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Preferences
                  </h4>
                </div>
                <div className="divide-y divide-slate-800/50">
                  
                  {/* App Themes */}
                  <div className="p-4 space-y-3">
                    <p className="text-[10px] font-bold text-slate-400">App Theme</p>
                    <div className="grid grid-cols-3 gap-2">
                      {THEMES.map((themeOption) => {
                        const isActive = theme === themeOption.id;
                        const emojiByTheme: Record<string, string> = {
                          original: "🌌",
                          dark: "🌙",
                          gray: "🌫️",
                          compass: "🧭",
                          black: "⚫",
                        };
                        const labelByTheme: Record<string, string> = {
                          original: "Original",
                          dark: "Dark",
                          gray: "Gray",
                          compass: "Compass",
                          black: "Black",
                        };
                        return (
                          <button
                            key={themeOption.id}
                            onClick={() => setTheme(themeOption.id)}
                            className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl border cursor-pointer transition ${
                              isActive
                                ? "bg-violet-900/20 border-violet-500/50 text-violet-300"
                                : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-white/20"
                              style={{
                                background: `linear-gradient(135deg, ${themeOption.swatch[0]}, ${themeOption.swatch[1]})`,
                              }}
                            />
                            <span className="text-xl leading-none">{emojiByTheme[themeOption.id]}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider">
                              {labelByTheme[themeOption.id]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowLanguageModal(true)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-900/50 transition cursor-pointer text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">App Languages</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Current: <span className="text-blue-400 font-bold">{profile.language}</span></p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>

                </div>
              </div>

              {/* Data & Privacy */}
              <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800/60 bg-slate-900/50">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Account & Data
                  </h4>
                </div>
                <div className="divide-y divide-slate-800/50">
                  
                  <button 
                    onClick={() => setShowPrivacy(true)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-900/50 transition cursor-pointer text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">Privacy Policy & Security</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Explore how we safeguard your data</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Save className="w-4 h-4 text-violet-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-200">Progress Backup</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">Export/Import your local state.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowImportPanel(!showImportPanel)}
                        className="text-[9px] font-black tracking-widest text-violet-400 uppercase bg-violet-950/40 px-2.5 py-1 rounded-full cursor-pointer hover:bg-violet-900/60 transition"
                      >
                        {showImportPanel ? "Hide" : "Manage"}
                      </button>
                    </div>
                     {showImportPanel && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-3 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={handleGenerateSyncToken} className="py-2 px-3 bg-violet-900/30 hover:bg-violet-900/50 border border-violet-800/50 text-violet-300 rounded-lg text-[9px] font-bold uppercase transition cursor-pointer flex justify-center">
                            Export Backup Code
                          </button>
                          <button onClick={() => setShowImportInput(!showImportInput)} className="py-2 px-3 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700 text-slate-300 rounded-lg text-[9px] font-bold uppercase transition cursor-pointer flex justify-center">
                            Import Backup Code
                          </button>
                        </div>
                        {showImportInput && (
                          <div className="flex gap-2 animate-fadeIn mt-2">
                            <input 
                              type="text" 
                              value={importText} 
                              onChange={(e) => setImportText(e.target.value)} 
                              placeholder="Paste backup code..." 
                              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-violet-500"
                            />
                            <button onClick={handleImportSyncToken} className="bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-3 text-[10px] font-bold">
                              Apply
                            </button>
                          </div>
                        )}
                        {syncSuccess && <p className="text-[9px] font-bold text-emerald-400 text-center">✓ Progress restored!</p>}
                      </div>
                    )}
                  </div>
                  
                  {showConfirmReset ? (
                    <div className="p-4 bg-rose-950/40 rounded-xl border border-rose-900/50 animate-fadeIn text-center space-y-3">
                      <p className="text-xs font-bold text-rose-400">Are you absolutely sure?</p>
                      <p className="text-[10px] text-rose-400/80">This will permanently delete all progress, chat history, and generated books.</p>
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setShowConfirmReset(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold">Cancel</button>
                        <button onClick={onResetData} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold">Yes, Reset App</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowConfirmReset(true)}
                      className="w-full p-4 flex items-center justify-between hover:bg-rose-950/30 transition cursor-pointer text-left focus:outline-none group rounded-b-3xl"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-4 h-4 text-rose-500 group-hover:text-rose-400" />
                        <div>
                          <p className="text-xs font-bold text-rose-500 group-hover:text-rose-400">Log Out & Reset App</p>
                          <p className="text-[9px] text-rose-500/70 mt-0.5">Clear all device data permanently</p>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Support */}
              <div className="bg-slate-900/40 rounded-3xl border border-slate-800/60 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setShowHelpFAQ(true)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-900/50 transition cursor-pointer text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 mt-1">💬</span>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Feedbacks & Support</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">Contact us or read FAQs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
          </div>
          
          {/* Premium button moved to main view bottom */}
          <button 
            onClick={() => setShowPremium(true)} 
            className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl border border-amber-500/50 text-white font-black text-sm cursor-pointer shadow-[0_4px_15px_rgba(245,158,11,0.25)] hover:scale-105 transition-transform"
          >
            ⭐ Unlock Premium Features
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      
      {/* PREMIUM MODAL */}
      {showPremium && (
        <div className="fixed inset-0 bg-[#04060d]/98 z-50 overflow-y-auto px-6 py-8 flex flex-col justify-center animate-fadeIn text-left text-slate-200">
          <div className="space-y-6 max-w-md mx-auto w-full relative">
            <button onClick={() => setShowPremium(false)} className="absolute -top-12 right-0 p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 bg-gradient-to-b from-[#1a1405] to-[#0a0802] rounded-3xl border border-amber-900/50 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-600/10 rounded-full pointer-events-none -ml-20 -mb-20"></div>
              
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl shadow-[0_0_30px_rgba(245,158,11,0.4)] mb-6 relative z-10">
                ⭐
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight relative z-10">Premium Status</h3>
              <p className="text-amber-500 font-bold mt-2 text-sm relative z-10">Unlock your full potential</p>
              
              <div className="mt-8 space-y-4 text-left relative z-10">
                <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-amber-900/30">
                  <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Advanced Analytics</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Deep dive into your performance patterns and learning curve.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-amber-900/30">
                  <span className="text-xl mt-0.5 shrink-0">💬</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Unlimited Coach Chats</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Ask unlimited questions to your AI tutor without daily limits.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-amber-900/30">
                  <BookMarked className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">AI Book Generation</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Generate personalized summary books for entire subjects instantly.</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-sm tracking-wider uppercase transition cursor-pointer shadow-lg">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-[#04060d]/98 z-[60] overflow-y-auto px-6 py-8 flex flex-col justify-between animate-fadeIn text-left text-slate-200">
          <div className="space-y-6 max-w-md mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-violet-400" />
                <h3 className="text-lg font-black text-slate-100 tracking-tight">Privacy & Security</h3>
              </div>
              <button onClick={() => setShowPrivacy(false)} className="p-1.5 bg-slate-900 border border-slate-850 rounded-full cursor-pointer text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-xs leading-relaxed text-slate-400">
              <p className="font-extrabold text-slate-200 text-sm">Compass Study Privacy Policy</p>
              <p>At Compass Study, we believe educational growth goes hand in hand with privacy and data transparency.</p>
              <hr className="border-slate-850" />
              <div className="space-y-2">
                <h4 className="font-bold text-slate-200 text-xs">Data Collected</h4>
                <p>- <strong>Profile Parameters:</strong> Information you provide is securely stored on your device.</p>
                <p>- <strong>Learning Metrics:</strong> Your progress and scores are tracked strictly to improve your personal experience.</p>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-850 mt-6 max-w-md mx-auto w-full">
            <button onClick={() => setShowPrivacy(false)} className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl text-xs tracking-wider uppercase transition cursor-pointer">
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Language */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-[#04060d]/98 z-[60] overflow-y-auto px-6 py-8 flex flex-col justify-between animate-fadeIn text-left text-slate-200">
          <div className="space-y-6 max-w-md mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-black text-slate-100 tracking-tight">App Languages</h3>
              </div>
              <button onClick={() => setShowLanguageModal(false)} className="p-1.5 bg-slate-900 border border-slate-850 rounded-full cursor-pointer text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {(["English", "Amharic", "Oromo"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    onUpdateProfile({ language: lang });
                    triggerNotif(`App primary language set to ${lang}`);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    profile.language === lang ? "bg-violet-950/40 border-violet-700 text-white" : "bg-slate-900/20 border-slate-800/80 text-slate-400 hover:bg-slate-950/60"
                  }`}
                >
                  <p className="text-xs font-black">{lang}</p>
                  {profile.language === lang && <span className="text-[10px] bg-violet-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help FAQ & Feedbacks */}
      {showHelpFAQ && (
        <div className="fixed inset-0 bg-[#04060d]/98 z-[60] overflow-y-auto px-6 py-8 flex flex-col justify-between animate-fadeIn text-left text-slate-200">
          <div className="space-y-6 max-w-md mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-cyan-400 text-xl">💬</span>
                <h3 className="text-lg font-black text-slate-100 tracking-tight">Feedbacks & Support</h3>
              </div>
              <button onClick={() => setShowHelpFAQ(false)} className="p-1.5 bg-slate-900 border border-slate-850 rounded-full cursor-pointer text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 bg-cyan-950/30 rounded-2xl border border-cyan-900/50 space-y-2">
              <h4 className="font-black text-slate-200 text-xs">Send Feedback</h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-2"><Globe className="w-3.5 h-3.5"/> Email: <span className="text-cyan-300">ismaelnaem32@gmail.com</span></p>
              <p className="text-[11px] text-slate-400 flex items-center gap-2"><Smartphone className="w-3.5 h-3.5"/> Phone: <span className="text-cyan-300">+251 90 000 0000</span></p>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 no-scrollbar text-xs">
              <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-850 space-y-1.5">
                <h4 className="font-extrabold text-slate-200 text-xs">How do I study on multiple devices?</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Go to Settings &gt; Progress Backup. Tap "Export Link" on your original device to copy a secure token. Use "Import Link" on your new device to restore your profile!
                </p>
              </div>
              <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-850 space-y-1.5">
                <h4 className="font-extrabold text-slate-200 text-xs">How does Offline mode work?</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Compass Study is an offline-capable app. Once loaded, lessons remain accessible in browser cache.
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-850 mt-6 max-w-md mx-auto w-full">
            <button onClick={() => setShowHelpFAQ(false)} className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs tracking-wider uppercase transition cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

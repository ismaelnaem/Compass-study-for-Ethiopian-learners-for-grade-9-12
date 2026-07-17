import React, { useState } from "react";
import { 
  Calculator, Zap, FlaskConical, Dna, Globe, History, TrendingUp, BookOpen,
  ChevronRight, ArrowLeft, CheckCircle2, ChevronDown, Laptop, HelpCircle
} from "lucide-react";
import { Subject, Unit, SubUnit } from "../data";
import { UserProfile, UserStats } from "../types";
import PracticeQuiz from "./PracticeQuiz";
import { SubjectIcon } from "./Books";

interface QuizExplorerProps {
  profile: UserProfile;
  stats: UserStats;
  curriculum: Subject[];
  onQuizCompleted: (scorePercent: number, subjectName: string) => void;
}

export default function QuizExplorer({ 
  profile, stats, curriculum, onQuizCompleted
}: QuizExplorerProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeQuizTarget, setActiveQuizTarget] = useState<{subject: Subject, unit: Unit, subUnit: SubUnit} | null>(null);
  const [expandedUnitIds, setExpandedUnitIds] = useState<Record<string, boolean>>({});

  // Get subjects appropriate for user's grade and stream
  const filteredSubjects = curriculum.filter(subject => {
    if (subject.grade !== profile.grade) return false;
    if (profile.gradeGroup === "11-12") {
      if (subject.stream && subject.stream !== profile.stream) return false;
    }
    return true;
  });

  const getQuizHighScore = (subUnitId: string) => {
    return stats.quizHighScores[subUnitId] || 0;
  };

  if (activeQuizTarget) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#050811]">
        <PracticeQuiz 
          subject={activeQuizTarget.subject}
          unit={activeQuizTarget.unit}
          subUnit={activeQuizTarget.subUnit}
          profile={profile}
          onBack={() => setActiveQuizTarget(null)}
          onQuizCompleted={(score) => {
            onQuizCompleted(score, activeQuizTarget.subject.name);
            setActiveQuizTarget(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative z-10 pb-24 space-y-5 px-3.5 sm:px-4 text-left">
      
      {!selectedSubject ? (
        <>
          <div className="pt-5 space-y-1">
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Quiz Platform
            </h1>
            <p className="text-xs text-slate-400">
              Select a topic to test your knowledge.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-8">
            {filteredSubjects.map(subject => {
              // Calculate average quiz score for subject if we wanted, but let's just show completion
              let takenQuizzes = 0;
              let totalQuizzes = 0;
              subject.units.forEach(u => u.subUnits.forEach(su => {
                totalQuizzes++;
                if (stats.quizHighScores[su.id] !== undefined) takenQuizzes++;
              }));
              
              const progressPercent = totalQuizzes > 0 ? Math.round((takenQuizzes / totalQuizzes) * 100) : 0;

              return (
                <div 
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className="bg-[#0c1224] border border-slate-800/80 hover:border-violet-500/40 rounded-3xl p-4 text-left transition cursor-pointer relative overflow-hidden group shadow-sm flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-white">
                    <SubjectIcon name={subject.icon} className="w-24 h-24" />
                  </div>

                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-3 shadow-inner">
                      <SubjectIcon name={subject.icon} />
                    </div>
                    <h3 className="font-bold text-slate-200 text-sm leading-tight relative z-10">{subject.name}</h3>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] mb-1.5 relative z-10">
                      <span className="text-slate-500 font-semibold">{takenQuizzes}/{totalQuizzes} Taken</span>
                      <span className="text-emerald-400 font-black">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative z-10">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="pt-4 pb-8 space-y-4 animate-fadeIn">
          {/* Back Button & Header */}
          <button 
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition px-1 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subjects</span>
          </button>

          <div className="p-4 rounded-3xl text-left bg-gradient-to-br from-[#0c1224] to-[#070a14] border border-slate-800/60 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <SubjectIcon name={selectedSubject.icon} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{selectedSubject.name} Quizzes</h2>
                <p className="text-xs text-slate-400">Select a sub-unit to begin</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {selectedSubject.units.map((unit) => {
              const isExpanded = expandedUnitIds[unit.id] !== false; 

              return (
                <div key={unit.id} className="bg-[#0c1224] border border-slate-800/60 rounded-2xl shadow overflow-hidden">
                  <button 
                    onClick={() => setExpandedUnitIds(prev => ({ ...prev, [unit.id]: !isExpanded }))}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-800/40 transition text-left"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="text-sm font-bold text-slate-200">{unit.name}</h3>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="divide-y divide-slate-800/50 bg-[#0a0f1d]/50">
                      {unit.subUnits.map((subunit) => {
                        const score = getQuizHighScore(subunit.id);
                        const hasTaken = stats.quizHighScores[subunit.id] !== undefined;

                        return (
                          <div 
                            key={subunit.id}
                            onClick={() => setActiveQuizTarget({subject: selectedSubject, unit, subUnit: subunit})}
                            className="p-4 hover:bg-slate-800/50 transition cursor-pointer flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                                hasTaken 
                                  ? (score >= 70 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400')
                                  : 'bg-slate-800 border-slate-700 text-slate-500 group-hover:text-violet-400'
                              }`}>
                                {hasTaken ? <CheckCircle2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition">
                                  {subunit.name}
                                </p>

                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {hasTaken ? `Highest Score: ${score}%` : 'Not attempted yet'}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

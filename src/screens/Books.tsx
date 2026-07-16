import React, { useState } from "react";
import { 
  Calculator, Zap, FlaskConical, Dna, Globe, History, TrendingUp, BookOpen,
  ChevronRight, ChevronLeft, ArrowLeft, CheckCircle2, ChevronDown, Laptop
} from "lucide-react";
import { Subject, Unit, SubUnit } from "../data";
import { UserProfile, UserStats } from "../types";

// Dynamic mapper from data.ts string icon name to actual Lucide component
export function SubjectIcon({ name, className }: { name: string; className?: string }) {
  const iconProps = { className: className || "w-3.5 h-3.5" };
  switch (name) {
    case "Calculator": return <Calculator {...iconProps} />;
    case "Zap": return <Zap {...iconProps} />;
    case "FlaskConical": return <FlaskConical {...iconProps} />;
    case "Dna": return <Dna {...iconProps} />;
    case "Globe": return <Globe {...iconProps} />;
    case "History": return <History {...iconProps} />;
    case "TrendingUp": return <TrendingUp {...iconProps} />;
    case "Laptop": return <Laptop {...iconProps} />;
    default: return <BookOpen {...iconProps} />;
  }
}

interface BooksProps {
  profile: UserProfile;
  stats: UserStats;
  curriculum: Subject[];
  onSelectSubUnit: (subject: Subject, unit: Unit, subUnit: SubUnit) => void;
  initialSelectedSubUnitId?: string | null;
  clearInitialSubUnitId?: () => void;
}

export default function Books({ 
  profile, stats, curriculum, onSelectSubUnit, initialSelectedSubUnitId, clearInitialSubUnitId 
}: BooksProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [expandedUnitIds, setExpandedUnitIds] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState("All");

  // Get subjects that are appropriate for user's grade and stream
  const filteredSubjects = curriculum.filter(subject => {
    // Subject grade must match user's set grade
    if (subject.grade !== profile.grade) return false;
    // Subject stream must match user's stream if Grade 11/12
    if (profile.gradeGroup === "11-12") {
      if (subject.stream && subject.stream !== profile.stream) return false;
    }
    return true;
  });

  // Calculate subject progress percentage
  const calculateSubjectProgress = (subject: Subject): number => {
    let totalSubUnits = 0;
    let completedCount = 0;

    subject.units.forEach(unit => {
      unit.subUnits.forEach(subunit => {
        totalSubUnits++;
        if (stats.lessonsCompleted.includes(subunit.id)) {
          completedCount++;
        }
      });
    });

    return totalSubUnits > 0 ? Math.round((completedCount / totalSubUnits) * 100) : 0;
  };

  // Calculate individual unit progress
  const calculateUnitProgress = (unit: Unit): number => {
    let completedCount = 0;
    unit.subUnits.forEach(subunit => {
      if (stats.lessonsCompleted.includes(subunit.id)) {
        completedCount++;
      }
    });
    return unit.subUnits.length > 0 ? Math.round((completedCount / unit.subUnits.length) * 100) : 0;
  };

  // Handle Collapsible Chapters
  const toggleUnitExpand = (unitId: string) => {
    setExpandedUnitIds(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  // Filter dynamic classifications
  const parentFilterTabs = ["All", "Science", "Mathematics", "Humanities"];

  const matchesFilter = (subject: Subject) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Science") {
      return ["Physics", "Chemistry", "Biology"].some(s => subject.name.includes(s));
    }
    if (activeFilter === "Mathematics") {
      return subject.name.includes("Mathematics");
    }
    if (activeFilter === "Humanities") {
      return ["History", "Geography", "Economics", "English"].some(s => subject.name.includes(s));
    }
    return true;
  };

  const visibleSubjects = filteredSubjects.filter(matchesFilter);

  // If a direct navigate path was requested from Home screen, search and drill down
  React.useEffect(() => {
    if (initialSelectedSubUnitId) {
      let foundSubject: Subject | null = null;
      let foundUnit: Unit | null = null;
      let foundSub: SubUnit | null = null;

      for (const s of filteredSubjects) {
        for (const u of s.units) {
          const sub = u.subUnits.find(sub => sub.id === initialSelectedSubUnitId);
          if (sub) {
            foundSubject = s;
            foundUnit = u;
            foundSub = sub;
            break;
          }
        }
        if (foundSubject) break;
      }

      if (foundSubject && foundUnit && foundSub) {
        setSelectedSubject(foundSubject);
        setExpandedUnitIds(prev => ({ ...prev, [foundUnit!.id]: true }));
        onSelectSubUnit(foundSubject, foundUnit, foundSub);
        if (clearInitialSubUnitId) clearInitialSubUnitId();
      }
    }
  }, [initialSelectedSubUnitId, filteredSubjects]);

  return (
    <div className="space-y-6">
      {!selectedSubject ? (
        /* SUBJECTS OVERVIEW PAGE */
        <div className="space-y-5">
          <div className="flex flex-col text-left">
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Books & Subjects</h2>
            <p className="text-xs text-slate-400 mt-1">Choose a subject from your Grade {profile.grade} curriculum.</p>
          </div>

          {/* Filter Categories */}
          <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar">
            {parentFilterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer z-10 ${
                  activeFilter === tab
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40 glow-violet border border-violet-500/20"
                    : "bg-slate-900 text-slate-400 border border-slate-800/80 hover:border-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Subject Grid List */}
          <div className="space-y-3.5">
            {visibleSubjects.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/60 rounded-3xl border border-slate-800/40">
                <p className="text-xs text-slate-400">No subjects matches found for this filter classification.</p>
              </div>
            ) : (
              visibleSubjects.map(subject => {
                const subjectProgress = calculateSubjectProgress(subject);
                return (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject);
                      // Expand first unit by default
                      if (subject.units.length > 0) {
                        setExpandedUnitIds({ [subject.units[0].id]: true });
                      }
                    }}
                    className="w-full text-left p-3.5 glass-card hover:bg-slate-900/40 rounded-2xl transition flex gap-3 items-center group cursor-pointer relative overflow-hidden shadow-md"
                  >
                    {/* Subject Icon wrapper */}
                    <div className="w-7 h-7 rounded-lg bg-violet-950/80 text-violet-400 flex items-center justify-center border border-violet-800/30 group-hover:scale-105 transition shadow-inner">
                      <SubjectIcon name={subject.icon} className="w-2.5 h-2.5 stroke-[2]" />
                    </div>

                    {/* Book Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-violet-400 tracking-wider bg-violet-950/40 border border-violet-900/40 px-2 py-0.5 rounded-full uppercase">
                          Grade {subject.grade} {subject.stream ? `• ${subject.stream}` : ""}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-100 mt-1.5 truncate group-hover:text-violet-300 transition">{subject.name}</h4>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-bold">
                        <span>{subject.units.length} Units</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-violet-400">{subjectProgress}% Completed</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2.5 overflow-hidden border border-slate-800/40">
                        <div className="bg-violet-600 h-full transition-all duration-300" style={{ width: `${subjectProgress}%` }}></div>
                      </div>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* SUBJECT CHAPTER COLLAPSIBLE DIRECTORY */
        <div className="space-y-4">
          {/* Header & Back Button */}
          <div className="flex items-center gap-3 text-left">
            <button
              onClick={() => setSelectedSubject(null)}
              className="p-2 bg-slate-900 hover:bg-slate-950 rounded-full border border-slate-800/60 shadow flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3 text-slate-300" />
            </button>
            <div>
              <div className="text-[8px] font-black text-violet-400 tracking-widest uppercase font-mono">
                Browse Chapters
              </div>
              <h3 className="text-base font-black text-slate-100 tracking-tight leading-none mt-1">
                {selectedSubject.name}
              </h3>
            </div>
          </div>

          {/* overall subject progress header */}
          <div className="glass-card p-4 rounded-3xl text-left">
            <div className="flex justify-between text-[11px] font-bold text-violet-300 mb-2">
              <span>Overall Subject Status</span>
              <span>{calculateSubjectProgress(selectedSubject)}% Mastered</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/40">
              <div className="bg-violet-600 h-full transition-all duration-300" style={{ width: `${calculateSubjectProgress(selectedSubject)}%` }}></div>
            </div>
          </div>

          {/* collapsible unit index */}
          <div className="space-y-2.5 text-left">
            {selectedSubject.units.map((unit) => {
              const uProgress = calculateUnitProgress(unit);
              const isExpanded = expandedUnitIds[unit.id];

              return (
                <div key={unit.id} className="glass-card rounded-2xl shadow overflow-hidden">
                  {/* Collapsible Trigger Section */}
                  <div
                    onClick={() => toggleUnitExpand(unit.id)}
                    className="p-3 flex items-center justify-between cursor-pointer select-none hover:bg-slate-900 transition"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-slate-100 leading-snug">{unit.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[9.5px] text-slate-400 font-bold">
                        <span>
                          {unit.subUnits.length} Lessons
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-violet-400">{uProgress}% Mastered</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uProgress === 100 && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      )}
                      <div className={`p-1 bg-slate-950 text-slate-400 rounded-lg border border-slate-800 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Leaf Nodes List */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/60 bg-slate-950/30 p-2 space-y-1">
                      {unit.subUnits.map((subunit, index) => {
                        const isRead = stats.lessonsCompleted.includes(subunit.id);
                        return (
                          <div
                            key={subunit.id}
                            onClick={() => onSelectSubUnit(selectedSubject, unit, subunit)}
                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/30 cursor-pointer group active:scale-[0.99] transition"
                          >
                            <div className="flex items-center gap-3">
                              {/* Lessons Count Indicator */}
                              <div className={`w-5 h-5 rounded-md text-[9px] font-black flex items-center justify-center transition-all ${
                                isRead 
                                  ? "bg-emerald-500 text-slate-900" 
                                  : "bg-violet-950/80 text-violet-400 group-hover:bg-violet-900"
                              }`}>
                                {isRead ? "✓" : index + 1}
                              </div>
                              <span className="text-xs font-bold text-slate-200 truncate max-w-[210px] group-hover:text-violet-300 transition">
                                {subunit.name}
                              </span>
                            </div>

                            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-violet-400 transition group-hover:translate-x-0.5" />
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

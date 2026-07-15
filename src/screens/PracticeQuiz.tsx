import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Brain, Sparkles, Check, X, ArrowRight,
  Award, HelpCircle, RefreshCw, ChevronRight, CheckCircle2
} from "lucide-react";
import { Subject, Unit, SubUnit } from "../data";
import { GeneratedLesson, GeneratedQuiz, QuizQuestion, UserProfile } from "../types";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getQuizForSubject } from "../curriculum-data/quizBank";

interface PracticeQuizProps {
  profile: UserProfile;
  subject: Subject;
  unit: Unit;
  subUnit: SubUnit;
  lessonContent?: GeneratedLesson;
  onBack: () => void;
  onQuizCompleted: (scorePercentage: number) => void;
  onAskCoachMistake?: (teacherSubject: string, promptText: string) => void;
}

function generateLocalQuiz(
  subjectName: string,
  unitName: string,
  subUnitName: string,
  grade: string,
  stream?: string
): GeneratedQuiz {

  const cleanSubject = subjectName.trim();
  const cleanUnit = unitName.replace(/^Unit \d+:\s*/i, "").trim();
  
  let teacherName = "Teacher Mufariat";
  if (cleanSubject.toLowerCase().includes("phys")) teacherName = "Teacher Hanan";
  else if (cleanSubject.toLowerCase().includes("biol")) teacherName = "Teacher Tesfaye";
  else if (cleanSubject.toLowerCase().includes("chem")) teacherName = "Teacher Biruk";
  else if (cleanSubject.toLowerCase().includes("geog")) teacherName = "Teacher Wazir";
  else if (cleanSubject.toLowerCase().includes("hist")) teacherName = "Teacher Bekele";
  else if (cleanSubject.toLowerCase().includes("ict") || cleanSubject.toLowerCase().includes("computer")) teacherName = "Teacher Ismael";
  else if (cleanSubject.toLowerCase().includes("engl")) teacherName = "Teacher Nuri";

  return {
    questions: [
      {
        id: `local_q1_${Date.now()}`,
        question: `According to the Ethiopian national Grade ${grade} curriculum for ${cleanSubject}, what is the principal objective or core definition of "${subUnitName}"?`,
        options: [
          `To study the foundational properties and systems that govern ${subUnitName}.`,
          `To isolate the physical elements of "${cleanUnit}" without practical integration.`,
          `To calculate empirical values solely for standardized examination templates.`,
          `To categorize different physical configurations independent of natural laws.`
        ],
        answerIndex: 0,
        explanation: `Under the Grade ${grade} guidelines, studying "${subUnitName}" in ${cleanSubject} aims to establish a complete structural and conceptual understanding of its basic systems.`
      },
      {
        id: `local_q2_${Date.now()}`,
        question: `Which of the following represents a key formula, identity, or process described under Unit: "${cleanUnit}"?`,
        options: [
          `An isolated, arbitrary constant with no practical application.`,
          `A consistent theoretical framework that explains how various elements relate to "${subUnitName}".`,
          `An obsolete manual process replaced entirely by automated software.`,
          `A non-standardized set of units used only in local experiments.`
        ],
        answerIndex: 1,
        explanation: `Unit concepts in "${cleanUnit}" are designed to connect local scientific theories with general mathematical, physical, or historical frameworks.`
      },
      {
        id: `local_q3_${Date.now()}`,
        question: `${teacherName} is presenting a lecture on "${cleanUnit}". Which essential student misconception does they warn about?`,
        options: [
          "Assuming that theoretical concepts don't require empirical testing.",
          "Confusing superficial formulas with the underlying principles of this unit.",
          "Failing to memorize historical dates down to the exact millisecond.",
          "Relying purely on complex computer simulations instead of analytical steps."
        ],
        answerIndex: 1,
        explanation: `${teacherName} emphasizes checking the underlying physical, mathematical, or scientific properties to build authentic exam readiness rather than rote memorization.`
      },
      {
        id: `local_q4_${Date.now()}`,
        question: `In a standard Ethiopian secondary laboratory or analytical scenario involving "${subUnitName}", what is the most critical first step?`,
        options: [
          "Hypothesizing general assumptions without checking local parameters.",
          "Ensuring all key terms and values are aligned with the proper Grade ${grade} scientific guidelines.",
          "Applying a generalized random formula immediately to save calculation time.",
          "Postponing basic conceptual validation until secondary tests are complete."
        ],
        answerIndex: 1,
        explanation: "Before deep analytical or empirical exercises, students must clarify coordinate planes, units of measurement, or baseline historical timelines."
      },
      {
        id: `local_q5_${Date.now()}`,
        question: `How does our master understanding of "${subUnitName}" prepare Grade ${grade} students for standard ministry entrance examinations?`,
        options: [
          "By limiting their awareness to simple true/false questions.",
          "By building adaptive critical thinking, allowing students to tackle complex cross-topic conceptual questions.",
          "By encouraging memorization of identical question databases.",
          "By focusing exclusively on regional definitions instead of global science standards."
        ],
        answerIndex: 1,
        explanation: "Mastering these specific subunits helps students answer higher-order cognitive problems on the Ethiopian National Exam."
      }
    ]
  };
}

export default function PracticeQuiz({
  profile, subject, unit, subUnit, lessonContent, onBack, onQuizCompleted, onAskCoachMistake
}: PracticeQuizProps) {
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  // Variant index: 0, 1, or 2 to request/cache bounded alternative versions
  const [variantIdx, setVariantIdx] = useState(0);

  // Practice session state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({}); // question index -> option index chosen
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({}); // index -> shown bool
  const [isFinished, setIsFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState(false); // See previous logs in detail

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Partition local cache key by language and variantIdx
  useEffect(() => {
    setIsCached(false);
    fetchQuiz();
  }, [subUnit.id, profile.language, variantIdx]);

  const fetchQuiz = async () => {
    const { getCachedAIResponse, setCachedAIResponse } = await import("../utils/storage");
    const cacheKey = `quiz_${subUnit.id}_lang${profile.language}_var${variantIdx}`;
    
    // Check if we have a hardcoded bank for this subject/unit
    const localBank = getQuizForSubject(profile.grade, subject.name, unit.name, subject.stream);
    if (localBank && localBank.length > 0) {
      setQuiz({ questions: localBank } as GeneratedQuiz);
      setIsCached(true);
      setCurrentIdx(0);
      setSelectedOptions({});
      setShowExplanation({});
      setIsFinished(false);
      setReviewMode(false);
      setLoading(false);
      return;
    }

    if (!navigator.onLine) {
      console.log("[Compass Engine] Network offline. Loading optimized curriculum quiz...");

      const offlineQuiz = generateLocalQuiz(subject.name, unit.name, subUnit.name, subject.grade, subject.stream);
      setQuiz(offlineQuiz);
      setIsCached(true);
      setCurrentIdx(0);
      setSelectedOptions({});
      setShowExplanation({});
      setIsFinished(false);
      setReviewMode(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Check IndexedDB cache first
      const cached = await getCachedAIResponse(cacheKey);
      if (cached) {
        setQuiz(cached);
        setIsCached(true);
        setCurrentIdx(0);
        setSelectedOptions({});
        setShowExplanation({});
        setIsFinished(false);
        setReviewMode(false);
        setLoading(false);
        return;
      }

      // 2. Fetch from Gemini
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : "";
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: auth.currentUser?.uid || null,
          subject: subject.name,
          unit: unit.name,
          subUnit: subUnit.name,
          grade: subject.grade,
          stream: subject.stream,
          language: profile.language,
          variantIndex: variantIdx,
          lessonContent: lessonContent,
          profile: profile
        })
      });

      if (!response.ok) {
        throw new Error("Unable to create exam questions.");
      }

      const data = await response.json();
      
      setQuiz(data);
      setIsCached(false);
      setCurrentIdx(0);
      setSelectedOptions({});
      setShowExplanation({});
      setIsFinished(false);
      setReviewMode(false);

      // 3. Save to local cache for next time
      await setCachedAIResponse(cacheKey, data);

      // Track quiz view in profile memory
      if (profile && profile.memory) {
        const seen = profile.memory.alreadySeenQuizzes || [];
        const seenKey = `${subUnit.id}_v${variantIdx}`;
        if (!seen.includes(seenKey)) {
          const updatedSeen = [...seen, seenKey];
          const updatedProfile = {
            ...profile,
            memory: { ...profile.memory, alreadySeenQuizzes: updatedSeen }
          };
          localStorage.setItem("compass_profile", JSON.stringify(updatedProfile));
        }
      }
    } catch (e: any) {
      console.warn("[Compass Engine] Quiz generation error, falling back to local curriculum questions:", e);
      const offlineQuiz = generateLocalQuiz(subject.name, unit.name, subUnit.name, subject.grade, subject.stream);
      setQuiz(offlineQuiz);
      setIsCached(true);
      setCurrentIdx(0);
      setSelectedOptions({});
      setShowExplanation({});
      setIsFinished(false);
      setReviewMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQuiz = () => {
    // Cycle variation index between 0, 1, and 2
    setVariantIdx(prev => (prev + 1) % 3);
  };

  if (loading) {
    return (
      <div className="space-y-6 text-left p-2">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center cursor-pointer">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
          <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse"></div>
        </div>

        <div className="p-8 bg-slate-900/60 border border-slate-800/60 rounded-3xl text-center space-y-5 glow-pulse">
          <div className="w-16 h-16 rounded-3xl bg-violet-950/80 text-violet-400 flex items-center justify-center mx-auto border border-violet-800/30 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-spin">
            <Sparkles className="w-8 h-8 fill-violet-400" />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-black text-violet-400 tracking-wider uppercase font-mono">Working</span>
            <p className="text-[11px] text-slate-300 max-w-xs mx-auto leading-relaxed font-semibold">
              Our AI is crafting 5 exam-grade practice questions matching current Ethiopian Educational Ministry specifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz || quiz.questions.length === 0) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800/60 rounded-3xl text-center space-y-4 text-left shadow-lg shadow-black/20">
        <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-805/30 text-rose-500 flex items-center justify-center mx-auto text-lg">⚠️</div>
        <p className="text-xs font-bold text-slate-400 text-center leading-snug">{error || "Could not assemble questions list."}</p>
        <button
          onClick={fetchQuiz}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow hover:scale-103"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Quiz Compilation</span>
        </button>
      </div>
    );
  }

  const qList = quiz.questions;
  const activeQ = qList[currentIdx];
  const totalQuestions = qList.length;

  const currentSelection = selectedOptions[currentIdx];
  const isSelected = currentSelection !== undefined;

  const handleOptionSelect = (optIdx: number) => {
    if (isSelected) return; // Prevent double selecting once answer revealed or locks
    setSelectedOptions((prev) => ({
      ...prev,
      [currentIdx]: optIdx
    }));
    setShowExplanation((prev) => ({
      ...prev,
      [currentIdx]: true
    }));
  };

  const handleNext = async () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate correct score
      let correctCount = 0;
      qList.forEach((q, qIndex) => {
        if (selectedOptions[qIndex] === q.answerIndex) {
          correctCount++;
        }
      });
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);
      setIsFinished(true);

      // Track weak subjects and personal context
      try {
        const { updateStudentPersonalization } = await import("../utils/storage");
        await updateStudentPersonalization(profile, scorePercent, subject.name);
      } catch (err) {
        console.error("Personalization tracking error:", err);
      }

      // Real-Time Score Syncing: Save immediately to Cloud Firestore under users/{uid}/quiz_history/{quizId}
      const quizId = `${subUnit.id}_${Date.now()}`;
      try {
        if (auth.currentUser) {
          const historyRef = doc(db, "users", auth.currentUser.uid, "quiz_history", quizId);
          await setDoc(historyRef, {
            quizId,
            subjectId: subject.id,
            subjectName: subject.name,
            unitId: unit.id,
            unitName: unit.name,
            subUnitId: subUnit.id,
            subUnitName: subUnit.name,
            accuracy: scorePercent,
            correctCount,
            totalQuestions,
            timestamp: new Date().toISOString(),
            isOfflineGenerated: isCached
          }, { merge: true });
          console.log(`[Compass Cloud] Firestore quiz history successfully synced under users/${auth.currentUser.uid}/quiz_history/${quizId}`);
        }
      } catch (dbErr) {
        console.error("[Compass Cloud] Failed to sync quiz history to Firestore:", dbErr);
      }

      onQuizCompleted(scorePercent);
    }
  };

  // Score statistics
  let correctCount = 0;
  qList.forEach((q, qIndex) => {
    if (selectedOptions[qIndex] === q.answerIndex) {
      correctCount++;
    }
  });
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="flex-1 space-y-6 text-left pb-48 overflow-y-auto px-4 pt-4">
      {!isFinished ? (
        /* ACTIVE TEST QUESTIONS SCREEN */
        <div className="space-y-5">
          {/* Progress Bar & Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center cursor-pointer text-slate-300 hover:bg-slate-950"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-right">
              <span className="text-xs font-black text-violet-400 uppercase tracking-wider font-mono">
                Q. {currentIdx + 1} {!lessonContent ? "" : `/ ${totalQuestions}`}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/60 shadow-inner">
            <div 
              className="bg-violet-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>

          {/* Question Display Card */}
          <div className="p-6 glass-card rounded-3xl shadow-md space-y-3 relative overflow-hidden">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[8px] font-black text-violet-400 tracking-widest bg-violet-950/40 border border-violet-800/20 px-2.5 py-1 rounded-full uppercase font-mono">
                Practice Drill
              </span>
              <span className="text-[8px] font-black text-emerald-400 tracking-widest bg-emerald-950/40 border border-emerald-800/20 px-2.5 py-1 rounded-full uppercase font-mono">
                {subject.name}
              </span>
              <span className="text-[8px] font-black text-amber-400 tracking-widest bg-amber-950/40 border border-amber-800/20 px-2.5 py-1 rounded-full uppercase font-mono truncate max-w-[140px]">
                {unit.name.split(":")[0]}
              </span>
            </div>
            <p className="text-xs font-black text-slate-100 leading-relaxed pt-1.5">
              {activeQ.question}
            </p>
          </div>

          {/* Multiple choice selections */}
          <div className="space-y-2.5">
            {activeQ.options.map((opt, optIndex) => {
              const letter = ["A", "B", "C", "D"][optIndex];
              const isCurrChoice = currentSelection === optIndex;
              const isCorrectChoice = activeQ.answerIndex === optIndex;

              let btnStyle = "border-slate-800 bg-slate-900/40 text-slate-200 hover:border-slate-700 hover:bg-slate-900/65";
              if (isSelected) {
                if (isCorrectChoice) {
                  btnStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold ring-1 ring-emerald-500";
                } else if (isCurrChoice) {
                  btnStyle = "border-rose-500 bg-rose-950/40 text-rose-300 font-bold ring-1 ring-rose-500";
                } else {
                  btnStyle = "border-slate-850 bg-slate-900/10 text-slate-500 pointer-events-none";
                }
              } else if (isCurrChoice) {
                btnStyle = "border-violet-600 bg-violet-950 text-violet-400 font-semibold";
              }

              return (
                <button
                  key={optIndex}
                  onClick={() => handleOptionSelect(optIndex)}
                  disabled={isSelected}
                  className={`w-full text-left p-4.5 rounded-2xl border-2 transition flex items-center gap-3.5 cursor-pointer ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center transition ${
                    isSelected && isCorrectChoice
                      ? "bg-emerald-500 text-slate-950"
                      : isSelected && isCurrChoice
                        ? "bg-rose-500 text-white"
                        : "bg-slate-950 text-slate-400 border border-slate-800"
                  }`}>
                    {letter}
                  </span>
                  <span className="text-xs font-semibold leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Immediate explanation expansion block */}
          {isSelected && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-1.5 shadow-inner">
                <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest font-mono">Expert Coach Explanation</span>
                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed whitespace-pre-line">
                  {activeQ.explanation}
                </p>
              </div>
              
              {currentSelection !== activeQ.answerIndex && (
                <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl space-y-1.5">
                  <span className="text-[8px] font-black text-amber-500 block uppercase tracking-widest font-mono flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Study Tip</span>
                  <p className="text-[11px] text-amber-200/80 font-semibold leading-relaxed">
                    To master this topic, try breaking down the core concepts from the explanation above. Don't just memorize the answer; focus on understanding the "why" behind it!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
              }}
              disabled={currentIdx === 0}
              className="w-1/3 py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow border border-slate-700"
            >
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={!isSelected}
              className="w-2/3 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow hover:scale-102 border border-violet-500/20 glow-violet"
            >
              <span>{currentIdx === totalQuestions - 1 ? "Calculate Results" : "Next Question"}</span>
              <ArrowRight className="w-4 h-4 text-violet-100" />
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ SUMMARY & RESULTS FEEDBACK VIEW */
        <div className="space-y-6">
          <div className="text-center p-6 glass-card rounded-3xl shadow-lg space-y-5">
            {/* Score Ring */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              {/* Outer SVG circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#101726"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={scorePercent >= 60 ? "#10B981" : "#EE4663"}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scorePercent / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-slate-100">{scorePercent}%</span>
                <span className="text-[8px] block text-slate-500 font-black tracking-widest uppercase mt-0.5 font-mono">SCORE</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-100">
                {scorePercent >= 80 ? "Excellence Achieved! 🎉" : scorePercent >= 60 ? "Nice Try! 👍" : "Need Re-reading 📚"}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
                You answered {correctCount} of {totalQuestions} correctly.
              </p>
            </div>

            {/* correct / wrong breakdowns count labels */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/30 rounded-2xl text-center">
                <span className="block text-lg font-black text-emerald-400">{correctCount}</span>
                <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-wider">Correct</span>
              </div>
              <div className="p-3 bg-rose-950/40 border border-rose-900/30 rounded-2xl text-center">
                <span className="block text-lg font-black text-rose-400">{totalQuestions - correctCount}</span>
                <span className="text-[8px] text-rose-500 font-bold uppercase tracking-wider">Incorrect</span>
              </div>
            </div>

            {/* Practice Session Parameters */}
            <div className="p-3.5 bg-slate-950/85 border border-slate-850 rounded-2xl text-left space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black text-slate-500 block uppercase tracking-widest font-mono">Practice Session Parameters</span>
                {isCached && (
                  <span className="text-[7.5px] font-black bg-amber-950/60 border border-amber-800/40 text-amber-400 px-1.5 py-0.5 rounded uppercase font-mono animate-pulse">
                    Saved Offline
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                 Solving alternative sets of questions expands your active recall capability and boosts your general subject performance!
              </p>
              {isOnline ? (
                <button
                  type="button"
                  onClick={handleRegenerateQuiz}
                  className="text-[9.5px] text-violet-400 font-black uppercase tracking-wider hover:text-violet-300 block pt-1.5 cursor-pointer text-left"
                >
                  ↻ Generate alternative questions (Set {variantIdx === 0 ? "B" : variantIdx === 1 ? "C" : "A"})
                </button>
              ) : (
                <p className="text-[9px] text-slate-600 font-extrabold uppercase tracking-wider pt-1 select-none">
                  (Go online to request new questions)
                </p>
              )}
            </div>

            {correctCount < totalQuestions && onAskCoachMistake && (
              <button
                onClick={() => {
                  const missedQuestions = qList.filter((q, idx) => selectedOptions[idx] !== q.answerIndex);
                  const mistakesBreakdown = missedQuestions.map((q, idx) => {
                    const userChoice = q.options[selectedOptions[qList.indexOf(q)] || 0];
                    const correctChoice = q.options[q.answerIndex];
                    return `Question ${idx + 1}: "${q.question}"\n   * My Choice: "${userChoice}"\n   * Correct Choice: "${correctChoice}"`;
                  }).join("\n\n");

                  const promptStr = `Hi Coach! I just finished a Practice Quiz for "${subject.name} - ${unit.name} - ${subUnit.name}" and scoring ${scorePercent}%. I got some questions wrong and want to understand my mistakes:\n\n${mistakesBreakdown}\n\nCan you explain the concepts behind these specific errors step-by-step and provide a brief study strategy to help me master this topic?`;
                  onAskCoachMistake(subject.name, promptStr);
                }}
                className="w-full py-3 bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/40 hover:border-violet-400 text-violet-300 rounded-2xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-violet-900/10 active:scale-[0.98] glow-violet"
              >
                <Brain className="w-4 h-4 text-violet-400 animate-pulse animate-duration-1000" />
                <span>Ask AI Coach about my mistakes</span>
              </button>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setReviewMode(true)}
                className="flex-1 py-3 text-violet-400 bg-violet-950/50 hover:bg-violet-900/60 border border-violet-850 rounded-xl font-bold text-xs tracking-wider cursor-pointer transition active:scale-[0.98]"
              >
                Review Items
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs tracking-wider cursor-pointer shadow transition active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          </div>

          {/* review answers expanded directory */}
          {reviewMode && (
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Detailed Questions Review</h4>
              <div className="space-y-3.5">
                {qList.map((q, index) => {
                  const gotRight = selectedOptions[index] === q.answerIndex;
                  return (
                    <div key={q.id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/60 space-y-2.5 text-left">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] text-slate-500 font-extrabold uppercase font-mono">Q. {index + 1}</span>
                        {gotRight ? (
                          <span className="text-[8px] font-black text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-800/30 uppercase flex items-center gap-1 font-mono">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Pass
                          </span>
                        ) : (
                          <span className="text-[8px] font-black text-rose-500 bg-rose-950/40 px-2.5 py-0.5 rounded border border-rose-800/30 uppercase flex items-center gap-1 font-mono">
                            <X className="w-2.5 h-2.5 stroke-[3]" /> Fail
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-extrabold text-slate-200 leading-normal">{q.question}</p>
                      
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1.5 leading-snug">
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Correct Choice: <strong className="text-emerald-450">{q.options[q.answerIndex]}</strong>
                        </p>
                        {!gotRight && (
                          <p className="text-[10px] text-slate-400 font-semibold">
                            Your Choice: <strong className="text-rose-400">{q.options[selectedOptions[index] || 0]}</strong>
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-900 italic">
                          💡 {q.explanation}
                        </p>
                      </div>

                      {!gotRight && onAskCoachMistake && (
                        <button
                          onClick={() => {
                            const userChoice = q.options[selectedOptions[index] || 0];
                            const correctChoice = q.options[q.answerIndex];
                            const promptStr = `Hi Coach! I made a mistake on this question from my Practice Quiz on "${subject.name} - ${unit.name} - ${subUnit.name}":
                            
Question: "${q.question}"
Correct Choice: "${correctChoice}"
My Chosen Answer: "${userChoice}"

Could you explain why the correct choice corresponds to the curriculum material, why my choice was incorrect, and what core formula or analogy I can use to remember this?`;
                            onAskCoachMistake(subject.name, promptStr);
                          }}
                          className="mt-2 w-full py-2 bg-violet-950/30 hover:bg-violet-900/45 border border-violet-850/60 hover:border-violet-700/80 rounded-xl font-bold text-[10px] text-violet-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Brain className="w-3 h-3 text-violet-400 animate-pulse" />
                          <span>Ask Coach to explain this mistake</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

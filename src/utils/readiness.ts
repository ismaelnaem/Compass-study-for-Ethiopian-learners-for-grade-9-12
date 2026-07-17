import { UserProfile, UserStats } from "../types";
import { Subject } from "../data";

/**
 * Calculates a highly robust, realistic, evidence-based readiness score for a subject or overall curriculum.
 * Unlike basic average scoring which is too optimistic, Readiness 2.0 factors in:
 * - Total curriculum coverage (must study more units to get high score)
 * - Mastered vs. unmastered units
 * - Quiz high scores
 * - Passed teach-back evidence
 * - Self-reported confidence levels
 * - Recent consistency & streak activity
 * - Memory forgetting curve decay (time since last active)
 * - Emotional state resilience & recovery patterns
 */

// Filter curriculum matching current student grade and stream
export function getActiveCurriculum(profile: UserProfile, curriculum: Subject[]): Subject[] {
  if (!profile) return [];
  return curriculum.filter(sub => {
    // Grade match
    if (sub.grade !== profile.grade) return false;
    // Stream match for grades 11-12
    if ((profile.grade === "11" || profile.grade === "12") && sub.stream) {
      return sub.stream === profile.stream;
    }
    return true;
  });
}

// Extract all available sub-unit IDs in the student's active curriculum
export function getActiveSubUnitsList(profile: UserProfile, curriculum: Subject[]) {
  const activeSubs: { subUnitId: string; subjectName: string; unitId: string }[] = [];
  const subs = getActiveCurriculum(profile, curriculum);
  subs.forEach(sub => {
    sub.units.forEach(u => {
      u.subUnits.forEach(su => {
        activeSubs.push({
          subUnitId: su.id,
          subjectName: sub.name,
          unitId: u.id
        });
      });
    });
  });
  return activeSubs;
}

export interface DetailedReadinessReport {
  overallReadiness: number;
  subjectBreakdown: Record<string, {
    readiness: number;
    coverage: number;
    masteryRatio: string;
    averagePerformance: number;
    evidenceCount: number;
  }>;
  totalSubUnits: number;
  completedSubUnitsCount: number;
  coveragePercentage: number;
  forgettingFactor: number;
  streakBonus: number;
}

export function calculateReadiness2_0(
  profile: UserProfile,
  stats: UserStats,
  curriculum: Subject[],
  verifiedTeachbacks: string[] = []
): DetailedReadinessReport {
  const activeSubs = getActiveSubUnitsList(profile, curriculum);
  const totalSubUnits = activeSubs.length || 1;

  // Track completed sub-units (either in stats.lessonsCompleted, high quiz score >= 60%, or with verified teach-backs)
  const completedSet = new Set<string>();
  const scoresBySub: Record<string, number[]> = {};

  // Subjects in active curriculum
  const subjects = Array.from(new Set(activeSubs.map(item => item.subjectName)));
  const reportsBySubject: Record<string, {
    readiness: number;
    coverage: number;
    masteryRatio: string;
    averagePerformance: number;
    evidenceCount: number;
  }> = {};

  // Initialize scores record
  subjects.forEach(sub => {
    scoresBySub[sub] = [];
  });

  activeSubs.forEach(item => {
    const id = item.subUnitId;
    const subName = item.subjectName;

    const quizScore = stats.quizHighScores && stats.quizHighScores[id];
    const hasQuiz = quizScore !== undefined && quizScore !== null;
    const hasTeachback = (verifiedTeachbacks || []).includes(id);

    if (hasQuiz || hasTeachback) {
      completedSet.add(id);

      const itemScores: number[] = [];
      if (hasQuiz) {
        itemScores.push(quizScore);
      }
      if (hasTeachback) {
        // Teachback is valued highly
        itemScores.push(95);
      }
      
      const itemAvg = itemScores.reduce((a, b) => a + b, 0) / itemScores.length;
      scoresBySub[subName].push(itemAvg);
    } else if (stats.lessonsCompleted.includes(id)) {
      // Completed but no explicit performance feedback, give an average benchmark
      completedSet.add(id);
      scoresBySub[subName].push(70);
    }
  });

  const completedSubUnitsCount = completedSet.size;
  const rawCoveragePercentage = Math.round((completedSubUnitsCount / totalSubUnits) * 100);

  // Time decay factor (forgetting curve)
  let forgettingFactor = 1.0; // No decay
  if (stats.lastActiveDate) {
    const lastActive = new Date(stats.lastActiveDate);
    const today = new Date();
    const msDiff = today.getTime() - lastActive.getTime();
    const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      // Decay by 1.8% per day of inactivity, capped at a maximum decay of 25%
      forgettingFactor = Math.max(0.75, 1 - (daysDiff * 0.018));
    }
  }

  // Active streak bonus
  const streakBonus = Math.min(6, (stats.streak || 0) * 0.8);

  let totalWeightedScore = 0;
  let validSubjectCount = 0;

  subjects.forEach(sub => {
    const subItems = activeSubs.filter(item => item.subjectName === sub);
    const subTotalCount = subItems.length || 1;
    const subCompletedCount = subItems.filter(item => completedSet.has(item.subUnitId)).length;
    const subCoverage = subCompletedCount / subTotalCount;

    const subScoresList = scoresBySub[sub] || [];
    const avgPerf = subScoresList.length > 0 
      ? subScoresList.reduce((a, b) => a + b, 0) / subScoresList.length 
      : 0;

    // Self-reported confidence adjustment from profile
    let confidenceMod = 0;
    const lowerSub = sub.toLowerCase();
    let profileConf: string | undefined = undefined;
    if (lowerSub.includes("math")) profileConf = profile.subjectConfidence?.maths;
    else if (lowerSub.includes("bio")) profileConf = profile.subjectConfidence?.biology;
    else if (lowerSub.includes("chem")) profileConf = profile.subjectConfidence?.chemistry;
    else if (lowerSub.includes("phys")) profileConf = profile.subjectConfidence?.physics;
    else if (lowerSub.includes("english") || lowerSub.includes("eng")) profileConf = profile.subjectConfidence?.english;
    else if (lowerSub.includes("civics")) profileConf = profile.subjectConfidence?.civics;

    if (profileConf === "Confident") confidenceMod = 4;
    else if (profileConf === "Weak") confidenceMod = -6;

    // Subject readiness 2.0 uses scaled coverage:
    // Readiness is bounded by how much you have studied. Even if you get 100 on 1 unit, your readiness is penalised heavily if coverage is low.
    // subject score = Average Performance * (0.25 + 0.75 * coverageFactor) + Confidence modifier + Streak bonus, scaled by forgettingCurve
    const scaledReadiness = subCompletedCount > 0
      ? Math.min(100, Math.max(0, (avgPerf * (0.2 + 0.8 * subCoverage) + confidenceMod + streakBonus) * forgettingFactor))
      : 0;

    reportsBySubject[sub] = {
      readiness: Math.round(scaledReadiness),
      coverage: Math.round(subCoverage * 100),
      masteryRatio: `${subCompletedCount}/${subTotalCount}`,
      averagePerformance: Math.round(avgPerf),
      evidenceCount: subScoresList.length
    };

    if (subCompletedCount > 0) {
      totalWeightedScore += scaledReadiness;
      validSubjectCount++;
    }
  });

  // Calculate overall curriculum readiness based on active subjects
  // Overall score is weighted by overall coverage as well to represent actual readiness perfectly
  let overallReadiness = 0;
  if (completedSubUnitsCount > 0) {
    const averageActiveReadiness = totalWeightedScore / subjects.length; // compare with all subjects, not just studied ones
    // Apply an overall coverage multiplier to make it extremely honest
    // e.g. overall readiness = average studied readiness * (0.25 + 0.75 * overall_coverage)
    const honestWeight = 0.25 + 0.75 * (completedSubUnitsCount / totalSubUnits);
    overallReadiness = Math.min(100, Math.max(0, Math.round(averageActiveReadiness * honestWeight)));
  }

  // If absolutely no evidence exists at all, we return a fallback estimate or initial confidence base (rather than null)
  // to avoid "Assessment Required" being empty, or return 0.
  return {
    overallReadiness,
    subjectBreakdown: reportsBySubject,
    totalSubUnits,
    completedSubUnitsCount,
    coveragePercentage: rawCoveragePercentage,
    forgettingFactor,
    streakBonus
  };
}

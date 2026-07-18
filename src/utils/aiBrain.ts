import { UserProfile, UserStats } from "../types";
import { CURRICULUM_DATA } from "../data";

// ----------------------------------------------------------------------
// COMPASS AI BRAIN LOGIC v1 (SAFE PRODUCTION VERSION)
// ----------------------------------------------------------------------

interface TopicPriority {
  subjectId: string;
  unitId: string;
  subUnitId: string;
  title: string;
  score: number;
  reason: string;
}

export function calculateStudyNextRecommendation(
  profile: UserProfile | null,
  stats: UserStats | null,
  verifiedTeachbacks: string[] = []
): { title: string; desc: string; targetSubUnit?: string; targetTab?: any } {
  // Fallback if no data
  const defaultRec = {
    title: "Continue Mathematics",
    desc: "Start with numbers and their operations to build a strong foundation.",
    targetTab: "Books" as any
  };

  if (!profile || !stats) return defaultRec;

  let candidates: TopicPriority[] = [];
  
  const now = Date.now();

  // Iterate over curriculum to score topics
  CURRICULUM_DATA.forEach(subject => {
    subject.units.forEach((unit, uIdx) => {
      unit.subUnits.forEach((subUnit, suIdx) => {
        let score = 0;
        let reason = "Suggested next step.";

        // 1. Weakness Factor (Base: 0 to 40)
        // Check if student failed this topic recently
        const recentScores = stats.quizHighScores?.[subUnit.id] || 0;
        const isMastered = verifiedTeachbacks.includes(subUnit.id);
        
        if (isMastered) {
          score -= 50; // De-prioritize already mastered topics
        } else if (recentScores > 0 && recentScores < 60) {
          score += 40; // High weakness
          reason = "Review recommended based on your recent quiz scores.";
        } else if (recentScores >= 60 && recentScores < 85) {
          score += 20; // Medium weakness
          reason = "You are close to mastering this! Let's solidify it.";
        } else if (recentScores === 0) {
          score += 10; // Untested
          reason = "New topic to explore.";
        }

        // 2. Urgency / Progression Factor (Base: 0 to 30)
        // Favor topics that are early in the curriculum if not yet touched
        const progressionWeight = 30 - (uIdx * 2) - suIdx;
        if (recentScores === 0 && !isMastered) {
          score += progressionWeight;
        }

        // 3. Forgetting Risk (Base: 0 to 30)
        // If studied long ago, risk increases
        const lastStudied = stats.lastActiveDate ? new Date(stats.lastActiveDate).getTime() : 0;
        const daysSinceLast = (now - lastStudied) / (1000 * 60 * 60 * 24);
        if (recentScores >= 85 && !isMastered && daysSinceLast > 3) {
          score += 15;
          reason = "Spaced repetition: review this topic to keep it fresh.";
        }

        // 4. Curriculum Weight (Personalization)
        if ((profile as any).personalization?.weakSubjects?.includes(subject.name)) {
          score += 15;
          reason = `Focusing on ${subject.name} to boost your overall progress.`;
        }

        candidates.push({
          subjectId: subject.id,
          unitId: unit.id,
          subUnitId: subUnit.id,
          title: `${subject.name}: ${subUnit.name}`,
          score,
          reason
        });
      });
    });
  });

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  if (candidates.length > 0 && candidates[0].score > 0) {
    const best = candidates[0];
    return {
      title: best.title,
      desc: best.reason,
      targetSubUnit: best.subUnitId
    };
  }

  return defaultRec;
}

// ----------------------------------------------------------------------
// COMPASS AI BRAIN LOGIC v2 (ADVANCED INTELLIGENCE SYSTEM - STUBS)
// ----------------------------------------------------------------------
// This layer builds on v1 by introducing emotional state tracking, 
// motivation engines, and behavioral modeling. Currently runs invisibly
// in the background to gather metrics without altering the v1 safe output.

export function updateAdvancedBehavioralModel(
  sessionData: any, 
  profile: UserProfile
) {
  // Track learning speed, accuracy vs speed, avoidance patterns
  // Adjust internal difficulty parameters implicitly
  // Output remains simple v1 Study Next
}

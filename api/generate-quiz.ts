import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient, generateContentWithFallback, parseCleanJson, sanitizeAIPayload } from "./_lib/gemini";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { checkQuota, getMockQuiz } from "./_lib/helpers";
import { addQuestionsToBank, getQuestionsFromBank } from "./_lib/contentCache";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // SECURITY: generating a NEW AI quiz requires login (guests get the
  // pre-built quiz bank instead, handled entirely client-side — this
  // endpoint is Gemini-backed and must never run for free/anonymous callers).
  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const hasQuota = await checkQuota(adminDb, uid, "quizzesGeneratedToday");
  if (!hasQuota) {
    return res.status(429).json({ error: "Daily limit reached for AI-generated quizzes. Upgrade to premium." });
  }

  const {
    subject, unit, subUnit, grade, stream, lessonContent,
    language = "English", variantIndex = 0, profile,
  } = req.body || {};

  if (!subUnit) {
    return res.status(400).json({ error: "Missing required parameters: subUnit" });
  }

  const targetVariantIdx = Math.min(Math.max(0, parseInt(variantIndex as any) || 0), 2);

  try {
    const ai = getGeminiClient();
    const streamText = stream ? `(${stream} Stream)` : "";

    let quizPersonalizationInstructions = "";
    if (profile) {
      const goal = profile.targetScoreGoal || "Strong";
      const style = profile.learningStylePreference || "Practice";
      const confidence = profile.subjectConfidence?.[subject ? subject.toLowerCase() : "maths"] || "Okay";

      quizPersonalizationInstructions = `
- Quiz Tailoring Parameters:
  * Target Score Goal: ${goal}.
  * Learning Style Preference: ${style}.
  * Student Subject Confidence Level: ${confidence}.
`;
    }

    const questionCount = lessonContent ? 5 : 15;

    const prompt = `You are a professional high school examiner for the Ethiopian Ministry of Education.
Generate an interactive multiple-choice practice quiz based on:
- Lesson Content: ${JSON.stringify(lessonContent || {})}
- Sub-unit: ${subUnit}
- Subject: ${subject || ""} Grade ${grade || ""} ${streamText}
- Target Language: ${language}
- Question Variant Index: ${targetVariantIdx} (make this variant unique vs other variants)

RULES:
1. Generate exactly ${questionCount} high-quality multiple-choice questions.
2. Difficulty Distribution: Easy (30%), Medium (45%), Hard (25%).
3. Use a natural mix of question styles (conceptual, applied, numerical, reasoning).
4. Each question must have exactly four choices, only one correct.
${quizPersonalizationInstructions}

Language Requirement:
Write all content ENTIRELY in ${language}. No LaTeX syntax, use plain Unicode subscripts/superscripts. No pictorial emojis.

You must respond with raw JSON only, matching exactly:
{
  "questions": [
    {
      "id": "q1_${targetVariantIdx}",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0,
      "explanation": "Why this answer is correct."
    }
  ]
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const rawQuizData = parseCleanJson(response.text || "");
    const { data: quizData, wasCorrupted } = sanitizeAIPayload(rawQuizData);

    if (wasCorrupted) {
      console.warn(
        `[Content Sanitizer] Corrupted output detected and cleaned for ${subject}/${grade}/${subUnit}. This is logged for monitoring — the cleaned version was still shown to the student.`
      );
    }

    // Save generated questions to the shared question bank (fire-and-forget).
    // Moved to Supabase — this was the biggest single contributor to
    // Firestore's 1GB quota (one row per generated question).
    if (!lessonContent && quizData.questions && quizData.questions.length > 0) {
      const bankRows = quizData.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        answer_index: q.answerIndex,
        explanation: q.explanation,
        subject: subject || "General",
        grade: grade || "Unknown",
        unit,
        sub_unit: subUnit,
        language,
      }));
      addQuestionsToBank(bankRows).catch(console.error);
    }

    // Mix in existing questions from the bank for this sub-unit
    if (!lessonContent) {
      const existingQs = await getQuestionsFromBank(subject, grade, subUnit, 100);
      if (existingQs.length > 0) {
        const normalized = existingQs.map((q) => ({
          question: q.question,
          options: q.options,
          answerIndex: q.answer_index,
          explanation: q.explanation,
        }));
        const merged = [...quizData.questions, ...normalized];
        const uniqueQs = Array.from(new Map(merged.map((item) => [item.question, item])).values());
        uniqueQs.sort(() => 0.5 - Math.random());
        quizData.questions = uniqueQs.slice(0, 200);
      }
    }

    return res.status(200).json(quizData);
  } catch (error: any) {
    console.error("Gemini quiz generator error:", error);
    const fallback = getMockQuiz(subUnit);
    return res.status(200).json({
      ...fallback,
      isDemoMode: true,
      debugMessage: error.message || String(error),
    });
  }
}

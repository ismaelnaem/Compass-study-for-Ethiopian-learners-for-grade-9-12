import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient, generateContentWithFallback, parseCleanJson } from "./_lib/gemini";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { checkQuota } from "./_lib/helpers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const hasQuota = await checkQuota(adminDb, uid, "aiUtilityCallsToday");
  if (!hasQuota) {
    return res.status(429).json({ error: "Daily limit reached. Upgrade to premium." });
  }

  const { subUnitId, subUnitName, subjectName, studentExplanation, profile, checkType } = req.body || {};

  if (!studentExplanation) {
    return res.status(400).json({ error: "Missing parameter: studentExplanation" });
  }

  try {
    const ai = getGeminiClient();
    const grade = profile?.grade || "9";
    const language = profile?.language || "English";
    const checkMode = checkType || "teachBack";

    const systemPrompt = `You are Some, an expert education evaluation system for high school students (Grade 9-12) in Ethiopia.
Analyze the student's explanation for scientific accuracy, conceptual depth, confidence level, and misconceptions.

Check Mode requested: ${checkMode}

Return your answer as JSON matching this exact structure:
{
  "detectedSubject": "string",
  "detectedTopic": "string",
  "confidenceScore": "Low" | "Medium" | "High",
  "understandingScore": "Low" | "Medium" | "High",
  "detectedMisconception": {
    "name": "string",
    "correctedSimply": "string",
    "example": "string",
    "checkQuestion": "string"
  } | null,
  "passed": boolean,
  "gapReport": "string",
  "microCorrection": "string",
  "challengeQuestion": {
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answerIndex": 0,
    "explanation": "string"
  },
  "feedbackText": "Warm, encouraging response written entirely in ${language}."
}`;

    const prompt = `Student Profile: Grade ${grade}, Language: ${language}, Subject: ${subjectName || "General"}, Topic: ${subUnitName || "Syllabus topic"}.
Check Type Mode: ${checkMode}
Student's Explanation: "${studentExplanation}"`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: { systemInstruction: systemPrompt, responseMimeType: "application/json" },
    });

    let parsedResult;
    try {
      parsedResult = parseCleanJson(response.text || "{}");
    } catch (parseError) {
      console.warn("parseCleanJson failed for check-understanding, using fallback:", parseError);
      parsedResult = {
        confidenceScore: "Medium",
        understandingScore: "Medium",
        detectedMisconception: null,
        passed: true,
        gapReport: "Thank you for explaining! Let's practice some more questions together.",
        microCorrection: "Your explanation shows solid initial work. Let's practice more to build a robust foundation.",
        challengeQuestion: {
          question: "Which of the following describes the most important starting point of precision in this topic?",
          options: ["Carefully master key definitions", "Relying on initial practice", "Skipping advanced concepts", "Avoiding quizzes"],
          answerIndex: 0,
          explanation: "Ensuring secure basic understanding is always the foundation.",
        },
        feedbackText: "Great effort explaining your thoughts! Let's continue by tackling interactive challenges together.",
      };
    }

    return res.status(200).json(parsedResult);
  } catch (err: any) {
    console.error("Error in check-understanding:", err);
    return res.status(500).json({ error: err.message || "Failed to process understanding check." });
  }
}

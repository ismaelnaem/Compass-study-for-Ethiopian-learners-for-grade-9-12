import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient, generateContentWithFallback, parseCleanJson, sanitizeAIPayload } from "./_lib/gemini";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { checkQuota, getMockLesson } from "./_lib/helpers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // SECURITY: this endpoint calls Gemini (real cost) and must be logged in.
  // uid comes ONLY from the verified token — never from req.body.
  const decoded = await requireAuth(req, res);
  if (!decoded) return; // requireAuth already sent the 401 response
  const uid = decoded.uid;

  const { subject, unit, subUnit, grade, stream, language = "English", profile } = req.body || {};

  const hasQuota = await checkQuota(adminDb, uid, "booksGeneratedToday");
  if (!hasQuota) {
    return res.status(429).json({ error: "Daily limit reached for book generations. Upgrade to premium." });
  }

  if (!subject || !unit || !subUnit || !grade) {
    return res.status(400).json({ error: "Missing required parameters: subject, unit, subUnit, grade" });
  }

  try {
    const ai = getGeminiClient();
    const streamText = stream ? `(${stream} Stream)` : "";

    let personalizationInstructions = "";
    if (profile) {
      const tone = profile.coachingTonePreference || "Kind";
      const style = profile.learningStylePreference || "Practice";
      const session = profile.sessionLengthPreference || "Focused";
      const struggle = profile.commonStruggleKeywords || "Concepts";

      personalizationInstructions = `
- Personalized Studying Adaptations:
  * Coaching Tone: Respond with a ${tone} tone.
  * Learning Style: Focus especially on ${style} style explanations.
  * Session Duration Target: The student prefers ${session} sessions.
  * Core Struggle Trigger: The student struggles with ${struggle}.
`;
    }

    const prompt = `You are a professional, motivating Ethiopian High School educator and Study Coach.
Generate structured, curriculum-appropriate lesson content for:
- Grade: ${grade}
- Subject: ${subject} ${streamText}
- Unit: ${unit}
- Sub-unit / Lesson Title: ${subUnit}
- Target Language: ${language}

Language Requirement & LaTeX/Math Formatting Rules:
1. Write all textual content ENTIRELY in ${language}.
2. Do not use LaTeX syntax. Use plain text with Unicode subscript/superscript characters (e.g. H₂O, x² + 5x + 6 = 0).
3. Do not use standard pictorial emojis.
${personalizationInstructions}

You must respond with raw JSON only, matching exactly:
{
  "explanation": "Detailed, clear study notes explaining the topic.",
  "formula": "Single crucial formula/equation/definition (leave empty if not applicable).",
  "workedExample": {
    "problem": "A worked practice problem.",
    "solution": "Step-by-step solution."
  },
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const lessonData = parseCleanJson(response.text || "");
    const { data: cleanLessonData, wasCorrupted } = sanitizeAIPayload(lessonData);

    if (wasCorrupted) {
      console.warn(
        `[Content Sanitizer] Corrupted output detected and cleaned for ${subject}/${grade}/${subUnit}. This is logged for monitoring — the cleaned version was still shown to the student.`
      );
    }

    return res.status(200).json(cleanLessonData);
  } catch (error: any) {
    console.error("Gemini lesson generator error:", error);
    const fallback = getMockLesson(subject, unit, subUnit, grade);
    return res.status(200).json({
      ...fallback,
      isDemoMode: true,
      debugMessage: error.message || String(error),
    });
  }
}

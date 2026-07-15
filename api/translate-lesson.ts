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

  const { lessonContent, targetLanguage, subUnitId } = req.body || {};

  if (!lessonContent || !targetLanguage || !subUnitId) {
    return res.status(400).json({ error: "Missing required parameters: lessonContent, targetLanguage, subUnitId" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are an expert professional Ethiopian educational translator specializing in secondary school curriculums.
Translate the following High School lesson content into clear, natural, grammatically perfect ${targetLanguage}.

Lesson content to translate:
${JSON.stringify(lessonContent)}

Strict Rules:
1. Return your translation as raw JSON matching this exact structure:
   {
     "explanation": "Translated explanation text...",
     "formula": "Translated formulas/concepts if applicable...",
     "workedExample": {
       "problem": "Translated problem...",
       "solution": "Translated step-by-step solution..."
     },
     "keyPoints": ["Translated keypoint 1...", "Translated keypoint 2...", "Translated keypoint 3..."]
   }
2. Do not use LaTeX syntax. Use plain text with unicode subscript/superscript characters.
3. Do not output pictographic emojis.
4. Return ONLY pure raw JSON, no markdown codeblocks.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const translatedData = parseCleanJson(response.text || "");
    return res.status(200).json(translatedData);
  } catch (err: any) {
    console.error("Lesson translation error:", err);
    return res.status(500).json({ error: "Failed to translate lesson content." });
  }
}

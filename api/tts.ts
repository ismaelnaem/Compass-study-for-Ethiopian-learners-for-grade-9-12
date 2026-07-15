import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient } from "./_lib/gemini";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { checkQuota, detectLanguageOfText, prependWavHeader } from "./_lib/helpers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const hasQuota = await checkQuota(adminDb, uid, "aiUtilityCallsToday");
  if (!hasQuota) {
    return res.status(429).json({ error: "Daily limit reached for voice playback. Upgrade to premium." });
  }

  const { text, speakerName, language, gender } = req.body || {};

  if (!text) {
    return res.status(400).json({ error: "Missing parameter: text" });
  }

  try {
    const ai = getGeminiClient();

    const detectedLang = detectLanguageOfText(text || "");
    const finalLang =
      detectedLang === "English" && (language === "Amharic" || language === "Oromo") ? language : detectedLang;

    let finalGender = gender || "female";
    const lowSpeaker = (speakerName || "").toLowerCase();
    const isMaleTeacher = ["alemu", "tesfaye", "biruk", "dawit", "bekele", "samuel"].some((n) => lowSpeaker.includes(n));
    const isFemaleTeacher = ["hana", "ruth"].some((n) => lowSpeaker.includes(n));
    if (isMaleTeacher) finalGender = "male";
    else if (isFemaleTeacher) finalGender = "female";

    let voiceName = "Kore";
    let systemInstruction =
      "Read the provided text in crystal clear English. Adopt a warm, pleasant female voice. Speak slowly and clearly. Do not read any bracket tags, only conversational words.";

    if (finalLang === "Oromo") {
      voiceName = "Fenrir";
      systemInstruction = "Read the provided text in crystal clear Afaan Oromoo, deep friendly masculine tone. Do not read brackets, tags, or formatting.";
      if (finalGender === "female") {
        voiceName = "Kore";
        systemInstruction = "Read the provided text in crystal clear Afaan Oromoo, warm female voice. Do not read brackets, tags, or formatting.";
      }
    } else if (finalLang === "Amharic") {
      if (finalGender === "female") {
        voiceName = "Kore";
        systemInstruction = "Read the provided text in crystal clear Amharic, warm female voice. Do not read brackets, tags, or formatting.";
      } else {
        voiceName = "Zephyr";
        systemInstruction = "Read the provided text in crystal clear Amharic, clear male voice. Do not read brackets, tags, or formatting.";
      }
    } else {
      if (finalGender === "male") {
        voiceName = "Zephyr";
        systemInstruction = "Read the provided text in crystal clear English, clear male voice. Do not read brackets, tags, or formatting.";
      } else {
        voiceName = "Kore";
        systemInstruction = "Read the provided text in crystal clear English, warm female voice. Do not read brackets, tags, or formatting.";
      }
    }

    const cleanTtsText = text
      .replace(/\[[A-Z0-9_\-]+\]/gi, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/`/g, "")
      .trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: cleanTtsText }] }],
      config: {
        responseModalities: ["AUDIO"],
        systemInstruction,
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const pcmBuffer = Buffer.from(base64Audio, "base64");
      const wavBuffer = prependWavHeader(pcmBuffer, 24000);
      return res.status(200).json({ audio: wavBuffer.toString("base64") });
    }
    return res.status(500).json({ error: "No audio generated from Google GenAI model" });
  } catch (error: any) {
    console.error("Gemini TTS generator error:", error);
    const errMsg = String(error?.message || error || "").toLowerCase();
    if (errMsg.includes("quota") || errMsg.includes("limit") || errMsg.includes("429") || errMsg.includes("resource_exhausted")) {
      return res.status(429).json({ error: "TTS free tier limit reached." });
    }
    return res.status(500).json({ error: error.message || String(error) });
  }
}

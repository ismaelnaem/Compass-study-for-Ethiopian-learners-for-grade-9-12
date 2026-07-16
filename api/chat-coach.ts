import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient, generateContentWithFallback, sanitizeAIText } from "./_lib/gemini";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { checkQuota, getTeacherForSubject, detectLanguageOfText, generateOfflineCoachReply, prependWavHeader } from "./_lib/helpers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // SECURITY: AI Coach chat always requires login (per product decision — no
  // guest chat, no exceptions). uid comes ONLY from the verified token.
  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { message, profile, history, attachment, activeTeacherSubject, isVoiceMode } = req.body || {};

  const hasQuota = await checkQuota(adminDb, uid, "coachChatCount");
  if (!hasQuota) {
    return res.status(429).json({ error: "Daily limit reached for AI Coach. Upgrade to premium." });
  }

  if (!message) {
    return res.status(400).json({ error: "Missing parameter: message" });
  }

  try {
    const ai = getGeminiClient();

    let currentSubject = "All";
    let currentUnit = "Syllabus Overview";
    let currentSubUnit = "";
    let learningReadinessScore = 70;

    try {
      const userDoc = await adminDb.collection("users").doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data() || {};
        const firestoreProfile = userData.compass_user_profile_v2 || {};
        if (firestoreProfile.currentSubject) currentSubject = firestoreProfile.currentSubject;
        if (firestoreProfile.currentUnit) currentUnit = firestoreProfile.currentUnit;
        if (firestoreProfile.currentSubUnit) currentSubUnit = firestoreProfile.currentSubUnit;
        if (firestoreProfile.learningReadinessScore !== undefined) {
          learningReadinessScore = firestoreProfile.learningReadinessScore;
        }
      }
    } catch (dbErr) {
      console.error("Failed to read user profile from Firestore:", dbErr);
    }

    const prefsText = profile?.studyPreferences
      ? `Student Preferences: ${JSON.stringify(profile.studyPreferences)}`
      : "No advanced preferences filled yet.";

    const selectedTeacher = getTeacherForSubject(activeTeacherSubject);
    const emotionalState = profile?.emotionalState || "Focused";

    const isProactiveStart = message === "PROACTIVE_START";
    const detectedUserLang = detectLanguageOfText(message || "");
    const profileLang = profile?.language || "English";
    const responseLanguage = isProactiveStart
      ? profileLang
      : detectedUserLang === "English" && profileLang !== "English"
      ? profileLang
      : detectedUserLang;

    let languagePromptInstruction = "";
    if (responseLanguage === "Amharic") {
      languagePromptInstruction = `\nCRITICAL LANGUAGE REQUIREMENT: Reply entirely in natural Amharic (Ge'ez script). Do not translate the teacher name (${selectedTeacher ? selectedTeacher.name : "Some"}).`;
    } else if (responseLanguage === "Oromo") {
      languagePromptInstruction = `\nCRITICAL LANGUAGE REQUIREMENT: Reply entirely in natural Afaan Oromo (Qubee spelling). Do not translate the teacher name (${selectedTeacher ? selectedTeacher.name : "Some"}).`;
    } else {
      languagePromptInstruction = `\nCRITICAL LANGUAGE REQUIREMENT: Reply in clear, fluent English. You are fully multilingual (English, Amharic, Afaan Oromo) — if the student switches languages, switch too.`;
    }

    let personaPrompt = "";
    if (selectedTeacher) {
      personaPrompt = `You are ${selectedTeacher.name}, the dedicated ${activeTeacherSubject} High School Teacher on the Compass Study platform.
Your teaching style: ${selectedTeacher.style}. Your bio: ${selectedTeacher.bio}.
Explain concepts relevant to Grade ${profile?.grade || "9"} ${activeTeacherSubject} curriculum in Ethiopia.
The teacher for ${activeTeacherSubject} is ALWAYS named ${selectedTeacher.name} — never use any other name.`;
    } else {
      personaPrompt = `You are "Some", the permanent primary AI Companion and academic advisor on the Compass Study platform. Speak with high companionship, encouragement, and emotional intelligence.`;
    }

    let voiceModePromptInstruction = "";
    if (isVoiceMode) {
      voiceModePromptInstruction = `\nCRITICAL SPEAKING REQUIREMENT (LIVE VOICE MODE):
- Keep your answer to 1-2 short conversational sentences (15-25 words max).
- No bullet points, markdown, or bracket tags of any kind.
- If this is a PROACTIVE_START, warmly greet the student by name (${profile?.name || "student"}) and ask a proactive question about ${activeTeacherSubject || "their studies"}.`;
    }

    const systemPrompt = `${personaPrompt}

${isVoiceMode ? voiceModePromptInstruction : "Keep responses concise and friendly (1-2 short paragraphs, or 3-4 short bullet points)."}
${languagePromptInstruction}

Do not repeat introductory greetings on every turn — respond directly to the student's message.

Student details:
- Name: ${profile?.name || "student"}
- Grade: ${profile?.grade || "9"}
- Stream: ${profile?.stream || "General"}
- Language: ${responseLanguage}
- Emotional state: ${emotionalState}
- Current Subject/Unit/Sub-unit: ${currentSubject} / ${currentUnit} / ${currentSubUnit}
- Learning Readiness Score: ${learningReadinessScore}%
- ${prefsText}

${isVoiceMode ? "" : `Visual tags: use at most one of [STREAK] [BOOK] [TARGET] [TROPHY] [IDEA] [CHECK] [STAR] [ROCKET] [CLOCK] [PENCIL] [HEART] [TRENDING] [THUMBSUP] [BRAIN] [CELEBRATE] [ALARM] per message, most messages need none. Never use standard pictorial emojis.`}

Do not use LaTeX syntax. Use plain text with Unicode subscript/superscript characters (e.g. H₂O, x² + 5x + 6 = 0).`;

    const userParts: any[] = [{ text: isProactiveStart ? "Greeting start" : message }];

    if (attachment && attachment.data && attachment.mimeType) {
      let base64Body = attachment.data;
      if (base64Body.includes(";base64,")) {
        base64Body = base64Body.split(";base64,")[1];
      }
      userParts.push({ inlineData: { mimeType: attachment.mimeType, data: base64Body } });
    }

    const finalContents: any[] = [];
    const rawHistory = history || [];

    for (const h of rawHistory) {
      if (!h.text || !h.text.trim()) continue;
      const role = h.role === "model" ? "model" : "user";
      const lastItem = finalContents[finalContents.length - 1];
      if (lastItem && lastItem.role === role) {
        lastItem.parts[0].text += "\n" + h.text;
      } else {
        finalContents.push({ role, parts: [{ text: h.text }] });
      }
    }

    while (finalContents.length > 0 && finalContents[0].role === "model") {
      finalContents.shift();
    }

    const lastItem = finalContents[finalContents.length - 1];
    if (lastItem && lastItem.role === "user") {
      lastItem.parts[0].text += "\n" + (message || "");
      if (userParts.length > 1) lastItem.parts.push(...userParts.slice(1));
    } else {
      finalContents.push({ role: "user", parts: userParts });
    }

    let replyText = "";
    let base64Audio = "";

    if (isVoiceMode) {
      try {
        let voiceName = "Kore";
        const isMaleTeacher =
          selectedTeacher &&
          ["Alemu", "Tesfaye", "Biruk", "Dawit", "Bekele", "Samuel"].some((n) => selectedTeacher.name.includes(n));
        const isFemaleTeacher = selectedTeacher && ["Hana", "Ruth"].some((n) => selectedTeacher.name.includes(n));
        const finalGender = isMaleTeacher ? "male" : isFemaleTeacher ? "female" : "female";

        if (responseLanguage === "Oromo") {
          voiceName = finalGender === "female" ? "Kore" : "Fenrir";
        } else if (responseLanguage === "Amharic") {
          voiceName = finalGender === "female" ? "Kore" : "Zephyr";
        } else {
          voiceName = finalGender === "female" ? "Kore" : "Zephyr";
        }

        const voiceResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: finalContents,
          config: {
            systemInstruction: systemPrompt,
            responseModalities: ["TEXT", "AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
          },
        });

        const textPart = voiceResponse.candidates?.[0]?.content?.parts?.find((p: any) => p.text);
        replyText = textPart?.text || voiceResponse.text || "";

        const audioPart = voiceResponse.candidates?.[0]?.content?.parts?.find(
          (p: any) => p.inlineData && p.inlineData.mimeType?.startsWith("audio/")
        );
        if (audioPart?.inlineData?.data) {
          const pcmBuffer = Buffer.from(audioPart.inlineData.data, "base64");
          const wavBuffer = prependWavHeader(pcmBuffer, 24000);
          base64Audio = wavBuffer.toString("base64");
        }
      } catch (voiceErr) {
        console.warn("Voice mode generation failed, falling back to text-only:", voiceErr);
        replyText = "";
        base64Audio = "";
      }
    }

    if (!replyText) {
      const response = await generateContentWithFallback(ai, {
        contents: finalContents,
        config: { systemInstruction: systemPrompt },
      });
      replyText = response.text || "";
    }

    const { text: cleanReplyText } = sanitizeAIText(replyText);
    return res.status(200).json({ reply: cleanReplyText, audio: base64Audio || undefined });
  } catch (error: any) {
    console.error("Gemini chat coach error:", error);
    const offlineReply = generateOfflineCoachReply(message || "", profile, activeTeacherSubject || "");
    return res.status(200).json({ reply: offlineReply });
  }
}

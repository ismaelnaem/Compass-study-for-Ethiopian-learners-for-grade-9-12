import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiClient, generateContentWithFallback, parseCleanJson, sanitizeAIPayload, sanitizeAIText } from "./_lib/gemini";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { checkQuota, getMockLesson, getMockQuiz, getTeacherForSubject, detectLanguageOfText, generateOfflineCoachReply, prependWavHeader } from "./_lib/helpers";
import { addQuestionsToBank, getQuestionsFromBank } from "./_lib/contentCache";

// Merged endpoint: combines generate-lesson, generate-quiz, translate-lesson,
// tts, chat-coach, and check-understanding into ONE Vercel Function.
//
// WHY: Vercel's Hobby (free) plan caps deployments at 12 serverless
// functions. This app has 23+ distinct API endpoints, so related endpoints
// are grouped into a handful of files that route internally by an `_fn`
// query parameter. vercel.json rewrites map the original public URLs
// (e.g. /api/generate-lesson) to this file, so the frontend code and all
// external URLs are completely unchanged — only the internal file layout
// changed. Each branch below is the exact, unmodified logic from the
// original standalone file.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fn = String(req.query._fn || "");

  switch (fn) {
    case "generate-lesson":
      return generateLesson(req, res);
    case "generate-quiz":
      return generateQuiz(req, res);
    case "translate-lesson":
      return translateLesson(req, res);
    case "tts":
      return tts(req, res);
    case "chat-coach":
      return chatCoach(req, res);
    case "check-understanding":
      return checkUnderstanding(req, res);
    default:
      return res.status(404).json({ error: "Unknown AI endpoint." });
  }
}

// ---------- generate-lesson ----------
async function generateLesson(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
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

// ---------- generate-quiz ----------
async function generateQuiz(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

// ---------- translate-lesson ----------
async function translateLesson(req: VercelRequest, res: VercelResponse) {
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

// ---------- tts ----------
async function tts(req: VercelRequest, res: VercelResponse) {
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

// ---------- chat-coach ----------
async function chatCoach(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

// ---------- check-understanding ----------
async function checkUnderstanding(req: VercelRequest, res: VercelResponse) {
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

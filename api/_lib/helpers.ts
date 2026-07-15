// This file holds pure helper logic copied from your original server.ts,
// used by multiple /api routes: teacher personas, language detection,
// offline fallback replies, and mock lesson/quiz content.

export const SUBJECT_TEACHERS: Record<string, { name: string; style: string; bio: string }> = {
  maths: {
    name: "Teacher Mufariat",
    style: "strict but brilliant geometric/algebraic visualization",
    bio: "Sparsely utilizes visual spatial models and holds highly rigorous proofs. Encourages precise derivation.",
  },
  mathematics: {
    name: "Teacher Mufariat",
    style: "strict but brilliant geometric/algebraic visualization",
    bio: "Sparsely utilizes visual spatial models and holds highly rigorous proofs. Encourages precise derivation.",
  },
  biology: {
    name: "Teacher Tesfaye",
    style: "fun, practical storytelling style, relates structures to Ethiopia's ecosystems",
    bio: "Enjoys connecting human biomechanics and cellular pathways directly to local context.",
  },
  physics: {
    name: "Teacher Hanan",
    style: "direct, logical formulas breakdown, interactive everyday mechanics analogies",
    bio: "Passionate about simplifying mechanical dynamics and quantum state variables using everyday analogies.",
  },
  chemistry: {
    name: "Teacher Biruk",
    style: "engaging molecular diagrams, laboratory walkthroughs",
    bio: "Translates atomic reaction formulas and molecular geometries into vivid conceptual stories.",
  },
  english: {
    name: "Teacher Nuri",
    style: "patient grammar structures, conversational vocabulary exercises",
    bio: "Empathetic linguistics guide focusing on structured vocabulary acquisition in simple lessons.",
  },
  geography: {
    name: "Teacher Wazir",
    style: "vivid geographic mapping, agricultural and topographic examples",
    bio: "Brings maps, soils, and demographic grids to life with real-life Ethiopian terrain studies.",
  },
  history: {
    name: "Teacher Bekele",
    style: "epic historical timelines, narrates battles and global events like a movie",
    bio: "Transports you back to legendary moments in Ethiopian and world civilizations with rich, vivid pacing.",
  },
  ict: {
    name: "Teacher Ismael",
    style: "modern, code-packed, practical computing concepts",
    bio: "High-tech software engineer and hardware expert explaining binary, databases, and algorithms directly.",
  },
  information: {
    name: "Teacher Ismael",
    style: "modern, code-packed, practical computing concepts",
    bio: "High-tech software engineer and hardware expert explaining binary, databases, and algorithms directly.",
  },
};

export const getTeacherForSubject = (subj?: string) => {
  if (!subj) return null;
  const norm = subj.toLowerCase().trim();

  if (norm.includes("math") || norm.includes("ሒሳብ") || norm.includes("herrega") || norm.includes("hisab")) {
    return SUBJECT_TEACHERS.mathematics;
  }
  if (norm.includes("phys") || norm.includes("ፊዚክስ") || norm.includes("fiiziksii") || norm.includes("fiziks")) {
    return SUBJECT_TEACHERS.physics;
  }
  if (
    norm.includes("biol") ||
    norm.includes("ባዮሎጂ") ||
    norm.includes("baayoloojii") ||
    norm.includes("bioloojii") ||
    norm.includes("bayoloji")
  ) {
    return SUBJECT_TEACHERS.biology;
  }
  if (norm.includes("chem") || norm.includes("ኬሚስትሪ") || norm.includes("keemistrii") || norm.includes("kemistri")) {
    return SUBJECT_TEACHERS.chemistry;
  }
  if (norm.includes("engl") || norm.includes("እንግሊዝኛ") || norm.includes("ingiliffa") || norm.includes("english")) {
    return SUBJECT_TEACHERS.english;
  }
  if (norm.includes("geog") || norm.includes("ጂኦግራፊ") || norm.includes("jiyoogiraafii") || norm.includes("geografi")) {
    return SUBJECT_TEACHERS.geography;
  }
  if (norm.includes("hist") || norm.includes("ታሪክ") || norm.includes("seenaa") || norm.includes("tarik")) {
    return SUBJECT_TEACHERS.history;
  }
  if (
    norm.includes("ict") ||
    norm.includes("አይሲቲ") ||
    norm.includes("kompuyutara") ||
    norm.includes("saayinsii") ||
    norm.includes("computing") ||
    norm.includes("information")
  ) {
    return SUBJECT_TEACHERS.ict;
  }

  for (const key in SUBJECT_TEACHERS) {
    if (norm.includes(key)) return SUBJECT_TEACHERS[key];
  }
  return null;
};

export function detectLanguageOfText(text: string): "Amharic" | "Oromo" | "English" {
  if (!text) return "English";

  if (/[\u1200-\u137F]/.test(text)) {
    return "Amharic";
  }

  const lower = text.toLowerCase().trim();

  const amharicTriggers = [
    "amharic", "amarigna", "amharigna", "selam", "tadias", "astemari", "temari",
    "እንደምን", "አማርኛ", "ጎበዝ",
  ];
  for (const trigger of amharicTriggers) {
    if (lower.includes(trigger)) return "Amharic";
  }

  const oromoTriggers = [
    "akkam", "oromo", "oromoo", "oromif", "afaan", "qubee", "galatoom", "barsiis",
    "barat", "gaaff", "deebii", "herreg", "fiiziks", "keemist", "barnoot", "seenaa",
  ];
  for (const trigger of oromoTriggers) {
    if (lower.includes(trigger)) return "Oromo";
  }

  return "English";
}

// Simple canned reply used only if Gemini totally fails on /api/generate-lesson etc. is not needed here;
// this offline reply is specifically for /api/chat-coach when Gemini fails.
export function generateOfflineCoachReply(message: string, profile: any, activeTeacherSubject: string): string {
  const name = profile?.name || "Serious Student";
  const grade = profile?.grade || "9";
  const detectedLang = detectLanguageOfText(message || "");
  const profileLang = profile?.language || "English";
  const language = detectedLang === "English" && profileLang !== "English" ? profileLang : detectedLang;
  const activeSubject = (activeTeacherSubject || "General").trim();
  const lowMsg = message.toLowerCase();

  const teacher = getTeacherForSubject(activeSubject);
  const teacherPrefix = teacher
    ? `[BRAIN] Hi ${name}! I am ${teacher.name}, your ${activeSubject} teacher. Even though my connection with our brain center is a bit slow right now, my offline curriculum database is fully ready to guide you.`
    : `[STAR] Hi ${name}! I am Some, your AI study companion. Our connection is currently experiencing high demand, but my offline study engines are completely armed with your Grade ${grade} profile. Let's keep studying!`;

  const translationMap: Record<string, any> = {
    Amharic: {
      quizPrompt: "ለእርስዎ ፈጣን ጥያቄ ይኸውና (Here is a quiz question for you):",
      explanation: "ማብራሪያ (Explanation):",
      greeting: `ሰላም ${name}! እኔ ሳም (Some) ነኝ። አሁን አጭር የኢንተርኔት መቆራረጥ ስላጋጠመን የቅርብ የጥናት ረዳትዎ ሆኜ እቀጥላለሁ።`,
    },
    Oromo: {
      quizPrompt: "Gaaffii fi deebii siif qopheesseen jira (Here is a quiz question):",
      explanation: "Ibsa (Explanation):",
      greeting: `Akkam ${name}! Ani Some dha. Sababa qunnamtii xiqqoo kanaan yeroof offline ta'us si gargaaruuf qophiidha.`,
    },
    English: {
      quizPrompt: "Let's challenge your brain with this practice question:",
      explanation: "Explanation:",
      greeting: `[STAR] Hello ${name}! Some is here as your offline companion during this network slowdown.`,
    },
  };

  const t = translationMap[language] || translationMap["English"];

  if (
    lowMsg.includes("hello") || lowMsg.includes("hi ") || lowMsg.length < 4 ||
    lowMsg.includes("hey") || lowMsg.includes("who are you") || lowMsg.includes("welcome")
  ) {
    if (language === "Amharic") {
      return `${t.greeting} ዛሬ 9ኛ-12ኛ ክፍል ትምህርት የትኛውን ርዕስ ማጥናት ይፈልጋሉ? [CHECK]`;
    } else if (language === "Oromo") {
      return `${t.greeting} Har'a barnoota maalii barachuu barbaadda? [CHECK]`;
    }
    return `${teacherPrefix}\nI am fully optimized to help you with your Ethiopian Ministry of Education curriculum. What topic, formula, or practice quiz would you like to tackle today for Grade ${grade} ${activeSubject}? [CHECK]`;
  }

  return `${teacherPrefix}\nAs your study guide, I recommend we review the core syllabus outline for Grade ${grade}. A solid approach is to study key terms sequentially, complete five short self-quiz problems daily, and record any equations in your notebook.\n\n[CHECK] What specific sub-topic would you like us to explain further now? I'm listening.`;
}

// Fallback content used only if Gemini totally fails on /api/generate-lesson
export function getMockLesson(subject: string, unit: string, subUnit: string, grade: string) {
  return {
    explanation: `This is a curriculum-aligned summary explaining "${subUnit}" under "${unit}" for Grade ${grade} ${subject}. In the Ethiopian high school curriculum, understanding this core topic is crucial for building robust knowledge, mastering exams, and preparing for national assessments.`,
    formula: "Key Study Concept: Break down extensive chapters into active recall summaries and quiz patterns.",
    workedExample: {
      problem: `Practice question for ${subUnit}: Explain the practical application of this topic in Ethiopian secondary studies.`,
      solution: "1. Identify the fundamental principles of the topic.\n2. Apply the concepts to continuous classroom exercises.\n3. Complete self-quizzes to lock in key facts and definitions.",
    },
    keyPoints: [
      "Review key terms and summaries sequentially.",
      "Solve five core quiz questions daily to boost your subject confidence.",
      "Capture important formulas and definitions in your physical study notebook.",
    ],
  };
}

// Fallback content used only if Gemini totally fails on /api/generate-quiz
export function getMockQuiz(subUnit: string) {
  return {
    questions: [
      {
        id: "q1",
        question: `What is the primary governing principle of ${subUnit}?`,
        options: [
          "It scales linearly with initial system conditions.",
          "It remains completely static and independent of external variables.",
          "It represents a local equilibrium state.",
          "It relies entirely on empirical constant measurements.",
        ],
        answerIndex: 0,
        explanation: "Linear scaling allows simple proportional calculations, which is standard for secondary level studies.",
      },
      {
        id: "q2",
        question: `Which of the following is most critical when analyzing a question in ${subUnit}?`,
        options: [
          "Disregarding all minor decimal values.",
          "Ensuring all measurement units match standard SI coordinates.",
          "Memorizing only final static definitions.",
          "Relying solely on digital calculations.",
        ],
        answerIndex: 1,
        explanation: "SI unit alignment is critical to ensure equations compile correctly without dimensional errors.",
      },
      {
        id: "q3",
        question: `In standard terms, how would you best summarize ${subUnit}?`,
        options: [
          "A tool of purely historical theoretical importance.",
          "An applied mechanism representing structural, physical, or logical balance.",
          "A complex study restricted only to postgraduate scholars.",
          "A random series of unlinked equations.",
        ],
        answerIndex: 1,
        explanation: "Balance and applied mechanisms form the foundations of both natural and social sciences in grades 9 through 12.",
      },
    ],
  };
}

// Turns raw PCM audio bytes from Gemini TTS into a playable WAV file
export function prependWavHeader(pcmBuffer: Buffer, sampleRate: number = 24000): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const chunkSize = 36 + dataSize;

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(chunkSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Checks and increments a user's daily free-tier usage quota, stored in Firestore.
// SECURITY: premium status is read from the locked "entitlements" collection, which
// the client can never write to (see firestore.rules) — only a verified server-side
// payment webhook can set it. Never trust an "isPremium" field on the user's own
// self-editable profile document for this check.
export async function checkQuota(
  adminDb: FirebaseFirestore.Firestore,
  uid: string,
  type: "booksGeneratedToday" | "coachChatCount" | "quizzesGeneratedToday" | "aiUtilityCallsToday"
): Promise<boolean> {
  if (!uid) return false;

  const entitlementDoc = await adminDb.collection("entitlements").doc(uid).get();
  const isPremium = entitlementDoc.exists && entitlementDoc.data()?.isPremium === true;
  if (isPremium) return true;

  const userRef = adminDb.collection("users").doc(uid);
  const doc = await userRef.get();
  if (!doc.exists) return false;

  const data = doc.data() || {};
  const stats = data.compass_user_stats_v2 || {};
  const profile = data.compass_user_profile_v2 || {};

  const isGoogleUser = profile.subscriptionStatus === "google";
  const today = new Date().toISOString().split("T")[0];
  const lastActive =
    stats.streakDates && stats.streakDates.length > 0 ? stats.streakDates[stats.streakDates.length - 1] : today;

  let currentCount = stats[type] || 0;
  if (lastActive !== today) {
    currentCount = 0;
  }

  const limitsByType: Record<string, { google: number; free: number }> = {
    booksGeneratedToday: { google: 10, free: 5 },
    coachChatCount: { google: 15, free: 5 },
    quizzesGeneratedToday: { google: 10, free: 5 },
    aiUtilityCallsToday: { google: 20, free: 10 },
  };
  const bounds = limitsByType[type] || { google: 10, free: 5 };
  const limit = isGoogleUser ? bounds.google : bounds.free;

  if (currentCount >= limit) {
    return false;
  }

  stats[type] = currentCount + 1;
  stats.streakDates = stats.streakDates || [today];
  if (stats.streakDates[stats.streakDates.length - 1] !== today) {
    stats.streakDates.push(today);
  }
  await userRef.update({ compass_user_stats_v2: stats });
  return true;
}

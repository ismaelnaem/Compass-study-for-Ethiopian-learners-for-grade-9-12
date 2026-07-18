import React, { useState } from "react";
import { Sparkles, GraduationCap, ChevronRight, Check } from "lucide-react";
import { UserProfile } from "../types";
import { auth, googleProvider, signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged } from "../lib/firebase";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  currentUser?: any;
  authError?: string | null;
}

export default function Onboarding({ onComplete, currentUser, authError: propAuthError }: OnboardingProps) {
  const [name, setName] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [localAuthError, setLocalAuthError] = useState<string | null>(null);
  const [gradeGroup, setGradeGroup] = useState<"9-10" | "11-12">("9-10");
  const [grade, setGrade] = useState("9");
  const [stream, setStream] = useState<"Natural" | "Social" | undefined>(undefined);
  const [language, setLanguage] = useState<"English" | "Amharic" | "Oromo">("English");
  const [step, setStep] = useState(1); // 1: Splash/Highlights, 2: Profile inputs, 3: Personalization questionnaire
  const [qIndex, setQIndex] = useState(0);
  const [prefs, setPrefs] = useState<Record<string, string>>({});

  const authError = propAuthError || localAuthError;

  // Sync Google user attributes if present to skip step 1 splash
  React.useEffect(() => {
    if (currentUser) {
      const fallbackName = currentUser.displayName || "Google Scholar";
      setName(fallbackName);
      setStep(2);
    }
  }, [currentUser]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setLocalAuthError(null);
    try {
      // Prefer signInWithPopup first, it's MUCH more reliable and safe from storage-partitioning issues!
      const result = await signInWithPopup(auth, googleProvider);
      if (result && result.user) {
        console.log("[Compass Onboarding] Popup Sign-In Success:", result.user.email);
        setName(result.user.displayName || "Google Scholar");
        setStep(2);
      }
    } catch (popupErr: any) {
      console.warn("[Compass Onboarding] Popup Sign-In was blocked or failed:", popupErr);
      const msg = popupErr.message || "";
      if (popupErr.code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
        setLocalAuthError("unauthorized-domain");
      } else if (popupErr.code === "auth/popup-blocked" || msg.includes("popup-blocked") || popupErr.code === "auth/cancelled-popup-request" || msg.includes("cancelled-popup")) {
        const isAmharic = language === "Amharic";
        const isOromo = language === "Oromo";
        setLocalAuthError(isAmharic 
          ? "⚠️ ብቅ-ባይ መስኮት ተዘግቷል! እባክዎ በስልክዎ/ብሮውዘርዎ ብቅ-ባዮችን (Pop-ups) ይፍቀዱ ወይም በ'Guest' ሆነው ይግቡ።" 
          : isOromo 
          ? "⚠️ Pop-up'n cufameera! Hayyama pop-up banuun ykn akka 'Guest'tti fufaa." 
          : "⚠️ Sign-in popup was blocked! Access or cookie storage is restricted. Please enable popups or use Guest Mode."
        );
      } else {
        setLocalAuthError(msg || "Sign in failed");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const PERSONALIZATION_QUESTIONS = [
    {
      id: "pref_bio",
      title: { English: "Biology confidence level?", Amharic: "የባዮሎጂ ትምህርት በራስ መተማመንዎ እንዴት ነው?", Oromo: "Gahumsi kee Biology irratti akkam?" },
      options: [
        { text: { English: "Confident (Score 80%+)", Amharic: "በጣም እርግጠኛ (80%+) ", Oromo: "Nan Amana (85%+)" }, value: "Confident" },
        { text: { English: "Okay / Clear on basics", Amharic: "መካከለኛ / መሰረቱን አውቃለሁ", Oromo: "Giddu-galeessa / Bu'ura nan beeka" }, value: "Okay" },
        { text: { English: "Weak / Struggle on tests", Amharic: "ደካማ / በፈተና እቸገራለሁ", Oromo: "Laafaa / Qormaata irratti nan rakkadha" }, value: "Weak" }
      ]
    },
    {
      id: "pref_chem",
      title: { English: "Chemistry confidence level?", Amharic: "የኬሚስትሪ ትምህርት በራስ መተማመንዎ?", Oromo: "Gahumsi kee Chemistry irratti akkam?" },
      options: [
        { text: { English: "Confident (Score 80%+)", Amharic: "በጣም እርግጠኛ (80%+)", Oromo: "Nan Amana (80%+)" }, value: "Confident" },
        { text: { English: "Okay / Clear on basics", Amharic: "መካከለኛ / መሰረቱን አውቃለሁ", Oromo: "Giddu-galeessa / Bu'ura nan beeka" }, value: "Okay" },
        { text: { English: "Weak / Struggle on tests", Amharic: "ደካማ / በፈተና እቸገራለሁ", Oromo: "Laafaa / Qormaata irratti nan rakkadha" }, value: "Weak" }
      ]
    },
    {
      id: "pref_phys",
      title: { English: "Physics confidence level?", Amharic: "የፊዚክስ ትምህርት በራስ መተማመንዎ?", Oromo: "Gahumsi kee Physics irratti akkam?" },
      options: [
        { text: { English: "Confident (Score 80%+)", Amharic: "በጣም እርግጠኛ (80%+)", Oromo: "Nan Amana (80%+)" }, value: "Confident" },
        { text: { English: "Okay / Clear on basics", Amharic: "መካከለኛ / መሰረቱን አውቃለሁ", Oromo: "Giddu-galeessa / Bu'ura nan beeka" }, value: "Okay" },
        { text: { English: "Weak / Struggle on tests", Amharic: "ደካማ / በፈተና እቸገራለሁ", Oromo: "Laafaa / Qormaata irratti nan rakkadha" }, value: "Weak" }
      ]
    },
    {
      id: "pref_math",
      title: { English: "Maths confidence level?", Amharic: "የሂሳብ (Maths) ትምህርት በራስ መተማመንዎ?", Oromo: "Gahumsi kee Herrega irratti akkam?" },
      options: [
        { text: { English: "Confident (Score 80%+)", Amharic: "በጣም እርግጠኛ (80%+)", Oromo: "Nan Amana (80%+)" }, value: "Confident" },
        { text: { English: "Okay / Clear on basics", Amharic: "መካከለኛ / መሰረቱን አውቃለሁ", Oromo: "Giddu-galeessa / Bu'ura nan beeka" }, value: "Okay" },
        { text: { English: "Weak / Struggle on tests", Amharic: "ደካማ / በፈተና እቸገራለሁ", Oromo: "Laafaa / Qormaata irratti nan rakkadha" }, value: "Weak" }
      ]
    },
    {
      id: "pref_eng",
      title: { English: "English language confidence?", Amharic: "የእንግሊዘኛ ቋንቋ በራስ መተማመንዎ?", Oromo: "Miliyoona kee Afaan Inglizii irratti akkam?" },
      options: [
        { text: { English: "Confident (Score 80%+)", Amharic: "በጣም እርግጠኛ (80%+)", Oromo: "Nan Amana (80%+)" }, value: "Confident" },
        { text: { English: "Okay / Clear on basics", Amharic: "መካከለኛ / መሰረቱን አውቃለሁ", Oromo: "Giddu-galeessa / Bu'ura nan beeka" }, value: "Okay" },
        { text: { English: "Weak / Struggle on tests", Amharic: "ደካማ / በፈተና እቸገራለሁ", Oromo: "Laafaa / Qormaata irratti nan rakkadha" }, value: "Weak" }
      ]
    },
    {
      id: "pref_civ",
      title: { English: "Civics / Social Studies confidence?", Amharic: "የስነ-ዜጋ (Civics) ትምህርት በራስ መተማመንዎ?", Oromo: "Gahumsi kee Civics irratti akkam?" },
      options: [
        { text: { English: "Confident (Score 80%+)", Amharic: "በጣም እርግጠኛ (80%+)", Oromo: "Nan Amana (80%+)" }, value: "Confident" },
        { text: { English: "Okay / Clear on basics", Amharic: "መካከለኛ / መሰረቱን አውቃለሁ", Oromo: "Giddu-galeessa / Bu'ura nan beeka" }, value: "Okay" },
        { text: { English: "Weak / Struggle on tests", Amharic: "ደካማ / በፈተና እቸገራለሁ", Oromo: "Laafaa / Qormaata irratti nan rakkadha" }, value: "Weak" }
      ]
    },
    {
      id: "pref_time",
      title: { English: "When do you study best?", Amharic: "በይበልጥ የሚያጠኑት መቼ ነው?", Oromo: "Yoom caalaatti qorachuu jaallatta?" },
      options: [
        { text: { English: "Early Morning (5 - 9 AM)", Amharic: "ማለዳ ውሉድ (ከ11 - 3 ሰዓት)", Oromo: "Ganama Gari (11 - 3)" }, value: "Morning" },
        { text: { English: "Afternoon (2 - 5 PM)", Amharic: "ከሰዓት በኋላ (ከ8 - 11 ሰዓት)", Oromo: "Itti-aansee (8 - 11)" }, value: "Afternoon" },
        { text: { English: "Night owl (7 - 11 PM)", Amharic: "ምሽት (ከ1 - 5 ሰዓት)", Oromo: "Halkan (1 - 5)" }, value: "Night" }
      ]
    },
    {
      id: "pref_duration",
      title: { English: "How long do you usually study for?", Amharic: "በአንድ ጊዜ በአማካኝ ለምን ያህል ጊዜ ያጠናሉ?", Oromo: "Yeroo tokkotti giddu-galeessaan hammam qoratta?" },
      options: [
        { text: { English: "Short intervals (<45 mins)", Amharic: "አጫጭር ጊዜያት (<45 ደቂቃ)", Oromo: "Yeroo gabaabaa (<45 min)" }, value: "Short" },
        { text: { English: "Deep focus (1 - 2 hours)", Amharic: "ጥልቅ ትኩረት (ከ1 - 2 ሰዓት)", Oromo: "Focus gadi fagoo (ሰዓት 1-2)" }, value: "Focused" },
        { text: { English: "Marathon study (3+ hours)", Amharic: "ለረጅም ሰዓት (3+ ሰዓት)", Oromo: "Yeroo dheeraa (ሰዓት 3+)" }, value: "Marathon" }
      ]
    },
    {
      id: "pref_distract",
      title: { English: "Your biggest study distraction?", Amharic: "ለትምህርትዎ ዋነኛ እንቅፋት የሚሆንብዎት ነገር?", Oromo: "Wanti caalaatti qorannoo kee jeeqee?" },
      options: [
        { text: { English: "Social Media / Phone notifications", Amharic: "ማህበራዊ ሚዲያ / የስልክ ንዝረት", Oromo: "Miidiyaa Hawaasaa / Bilbila" }, value: "Phone" },
        { text: { English: "Family house noise", Amharic: "የቤተሰብ / የቤት ድምፅ", Oromo: "Sagalee maatii / Mana keessaa" }, value: "Noise" },
        { text: { English: "Fatigue / Sleepiness", Amharic: "ድካም / ድብርት / እንቅልፍ", Oromo: "Dadhabbiifi hirriba" }, value: "Fatigue" }
      ]
    },
    {
      id: "pref_score_goal",
      title: { English: "Target score on National Exams?", Amharic: "በሀገር አቀፍ ፈተናዎች ላይ የታለመው ውጤት?", Oromo: "Qabxiin National Exam irratti target goote?" },
      options: [
        { text: { English: "Top Rank (85%+ / 600+ points)", Amharic: "ደረጃ 1 (85%+ / 600+)", Oromo: "Qabxii Olaana (85%+ / 600+)" }, value: "Star" },
        { text: { English: "Strong pass (70%+ / 500+)", Amharic: "ጥሩ ማለፊያ (70%+ / 500+)", Oromo: "Gahumsa gaarii (70%+ / 500+)" }, value: "Strong" },
        { text: { English: "Secure Entry (50%+ / 400+)", Amharic: "ዩኒቨርሲቲ መግቢያ (50%+ / 400+)", Oromo: "Seensa University (50%+)" }, value: "Pass" }
      ]
    },
    {
      id: "pref_uni",
      title: { English: "Target Higher Educational Path?", Amharic: "የወደፊት የትምህርት መስክ ምርጫዎ?", Oromo: "Kallattii Barnoota Olaanaa kee?" },
      options: [
        { text: { English: "Medicine / STEM", Amharic: "ህክምና / ሳይንስ (STEM)", Oromo: "Qoricha / Saayinsii (STEM)" }, value: "Medicine" },
        { text: { English: "Engineering / Tech", Amharic: "ምህንድስና / ቴክኖሎጂ", Oromo: "Injiinaringii / Teeknoolojii" }, value: "Engineering" },
        { text: { English: "Business / Social studies", Amharic: "ቢዝነስ / ማህበራዊ ሳይንስ", Oromo: "Daldala / Hawaasummaa" }, value: "SocialStudy" }
      ]
    },
    {
      id: "pref_urgency",
      title: { English: "Exam preparation urgency?", Amharic: "የፈተና ዝግጅት አጣዳፊነትዎ?", Oromo: "Ariifannaan qophii qormaataa kee?" },
      options: [
        { text: { English: "Exams in < 3 months!", Amharic: "ፈተና አለብኝ (< 3 ወር!)", Oromo: "Qormaata qaba (< ji'a 3!)" }, value: "Urgent" },
        { text: { English: "Exams in 6 - 12 months", Amharic: "ፈተና ከ6 - 12 ወራት ውስጥ", Oromo: "Qormaata ji'oota 6-12" }, value: "Medium" },
        { text: { English: "Long term prep (Grades 9-11)", Amharic: "የረጅም ጊዜ ዝግጅት (ከ9-11ኛ ክፍል)", Oromo: "Qophii yeroo dheeraa (Kutaa 9-11)" }, value: "LongTerm" }
      ]
    },
    {
      id: "pref_style",
      title: { English: "Best learning style preference?", Amharic: "በይበልጥ የሚማሩት በየትኛው መንገድ ነው?", Oromo: "Mali dhuunfaan ati caalaatti barattu?" },
      options: [
        { text: { English: "Visual (Diagrams, Charts)", Amharic: "በምስልና ዲያግራም", Oromo: "Fakkii fi diagram" }, value: "Visual" },
        { text: { English: "Practice-heavy (Solving quizzes)", Amharic: "በልምምድ (ጥያቄ በመስራት)", Oromo: "Shaakalaan (Qormaata hoorachuu)" }, value: "Practice" },
        { text: { English: "Reading summaries & text", Amharic: "ማጠቃለያና ፅሁፎችን በማንበብ", Oromo: "Summaries fi barreessuu dubbisuun" }, value: "Reading" }
      ]
    },
    {
      id: "pref_weakness",
      title: { English: "Current biggest struggle?", Amharic: "በአሁኑ ሰዓት ዋነኛ ተግዳሮትዎ?", Oromo: "Dhiphina ati amma qabdu?" },
      options: [
        { text: { English: "Memorizing formulas / names", Amharic: "ፎርሙላዎችን/ስሞችን ማስታወስ", Oromo: "Formulas / Maqaa qabachuu" }, value: "Memory" },
        { text: { English: "Understanding core concepts", Amharic: "ዋና ሀሳቦችን በሚገባ መረዳት", Oromo: "Yaadolee core gadi fageenyaan" }, value: "Concepts" },
        { text: { English: "Time management during test", Amharic: "በፈተና ሰዓት ሰዓት መቆጣጠር", Oromo: "Yeroo qormaataa bulchuu" }, value: "Time" }
      ]
    },
    {
      id: "pref_hours_weekly",
      title: { English: "Target weekly study hours?", Amharic: "በሳምንት ለማጥናት የታቀደው ሰዓት?", Oromo: "Sa'aatii qorannoo torban kee?" },
      options: [
        { text: { English: "Light (5 - 10 hours)", Amharic: "ቀላል (ከ5 - 10 ሰዓት)", Oromo: "Salphaa (sa'aatii 5-10)" }, value: "Light" },
        { text: { English: "Moderate (10 - 20 hours)", Amharic: "መካከለኛ (ከ10 - 20 ሰዓት)", Oromo: "Giddu-galeessa (10-20)" }, value: "Moderate" },
        { text: { English: "High Focus (20+ hours)", Amharic: "ከፍተኛ (20+ ሰዓት)", Oromo: "Lafeefi Laferee (sa'aatii 20+)" }, value: "Hardcore" }
      ]
    },
    {
      id: "pref_groups",
      title: { English: "Prefer studying alone or with peers?", Amharic: "ማጥናት የሚመርጡት ብቻዎን ወይስ ከባልደረቦች ጋር?", Oromo: "Kophaadhaan qorachuu filatta moo hiriyaan?" },
      options: [
        { text: { English: "Strictly Alone (Max focus)", Amharic: "ብቻዬን (ለከፍተኛ ትኩረት)", Oromo: "Kophaakoo (Xiyyeeffannoo full)" }, value: "Alone" },
        { text: { English: "With study buddy (1-2 friends)", Amharic: "ከ1-2 ጓደኛ ጋር", Oromo: "Hiriyaa 1-2 wajjin" }, value: "Buddy" },
        { text: { English: "Study Group dynamic", Amharic: "በጥናት ቡድን ውስጥ", Oromo: "Garee qorannoo wajjin" }, value: "Group" }
      ]
    },
    {
      id: "pref_coaching_style",
      title: { English: "Preferred Coaching Tone?", Amharic: "የአሰልጣኝ ኤአይ የንግግር ዘይቤ ምርጫ?", Oromo: "Haala dubbii Leenjisaa AI?" },
      options: [
        { text: { English: "Encouraging & supportive", Amharic: "አበረታች እና ደጋፊ", Oromo: "Nama jajjabeessu" }, value: "Kind" },
        { text: { English: "Strict & exam-focused", Amharic: "ጠንካራ እና ፈተና-ተኮር", Oromo: "Cimaa fi direct" }, value: "Strict" },
        { text: { English: "Analytical & metric-heavy", Amharic: "በመረጃ እና ስታቲስቲክስ የሚመራ", Oromo: "Analytical & data-driven" }, value: "Data" }
      ]
    },
    {
      id: "pref_sleep",
      title: { English: "Average daily sleep hours?", Amharic: "በቀን አማካኝ የእንቅልፍ ሰዓትዎ?", Oromo: "Giddu-galeessa hirriba keetii?" },
      options: [
        { text: { English: "Healthy (7 - 8 hours)", Amharic: "በቂ እንቅልፍ (ከ7 - 8 ሰዓት)", Oromo: "Mijataa (sa'aatii 7-8)" }, value: "Healthy" },
        { text: { English: "Short sleep (5 - 6 hours)", Amharic: "አነስተኛ እንቅልፍ (ከ5 - 6 ሰዓት)", Oromo: "Gabaabaa (sa'aatii 5-6)" }, value: "Short" },
        { text: { English: "Unregulated (< 5 hours)", Amharic: "ያልተስተካከለ (< 5 ሰዓት)", Oromo: "Kan hin risky (< sa'aatii 5)" }, value: "Low" }
      ]
    }
  ];

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = (currentPrefs = prefs) => {
    // Validate name
    const studentName = name.trim() || "Serious Student";
    
    // Derive initial weak and strong subjects based on survey answers
    const weakList: string[] = [];
    const strongList: string[] = [];
    
    const confidenceMap = {
      Biology: currentPrefs.pref_bio,
      Chemistry: currentPrefs.pref_chem,
      Physics: currentPrefs.pref_phys,
      Mathematics: currentPrefs.pref_math,
      English: currentPrefs.pref_eng,
      Civics: currentPrefs.pref_civ
    };

    Object.entries(confidenceMap).forEach(([sub, conf]) => {
      if (conf === "Weak") weakList.push(sub);
      if (conf === "Confident") strongList.push(sub);
    });

    onComplete({
      name: studentName,
      gradeGroup,
      grade,
      stream: gradeGroup === "11-12" ? (stream || "Natural") : undefined,
      language,
      isOnboarded: true,
      learningGoal: "Prepare for final exams and continuous assessment mastery",
      subjectConfidence: {
        biology: (currentPrefs.pref_bio as any) || "Okay",
        chemistry: (currentPrefs.pref_chem as any) || "Okay",
        physics: (currentPrefs.pref_phys as any) || "Okay",
        maths: (currentPrefs.pref_math as any) || "Okay",
        english: (currentPrefs.pref_eng as any) || "Okay",
        civics: (currentPrefs.pref_civ as any) || "Okay"
      },
      studyTimePreference: (currentPrefs.pref_time as any) || "Morning",
      sessionLengthPreference: (currentPrefs.pref_duration as any) || "Focused",
      studyDisturbances: (currentPrefs.pref_distract as any) || "Phone",
      targetScoreGoal: (currentPrefs.pref_score_goal as any) || "Strong",
      targetHigherEducPath: (currentPrefs.pref_uni as any) || "Engineering",
      examPreparationUrgency: (currentPrefs.pref_urgency as any) || "Medium",
      learningStylePreference: (currentPrefs.pref_style as any) || "Practice",
      commonStruggleKeywords: (currentPrefs.pref_weakness as any) || "Concepts",
      weeklyStudyHoursGoal: (currentPrefs.pref_hours_weekly as any) || "Moderate",
      studyGroupPreference: (currentPrefs.pref_groups as any) || "Alone",
      coachingTonePreference: (currentPrefs.pref_coaching_style as any) || "Kind",
      averageSleepPreference: (currentPrefs.pref_sleep as any) || "Healthy",
      memory: {
        weakSubjects: weakList,
        strongSubjects: strongList,
        topicsConfusedRepeatedly: [],
        bestStudiedTimeOfDay: currentPrefs.pref_time || "Morning",
        averageStudySessionDuration: currentPrefs.pref_duration === "Short" ? 30 : currentPrefs.pref_duration === "Focused" ? 90 : 180,
        mostEncouragingFeedbackType: currentPrefs.pref_coaching_style === "Kind" ? "Supportive" : currentPrefs.pref_coaching_style === "Strict" ? "High pressure" : "Data comparison",
        alreadySeenLessons: [],
        alreadySeenQuizzes: []
      },
      studyPreferences: currentPrefs
    });
  };

  const handleSelection = (questionId: string, value: string) => {
    const updated = { ...prefs, [questionId]: value };
    setPrefs(updated);
    if (qIndex < PERSONALIZATION_QUESTIONS.length - 1) {
      setQIndex(prev => prev + 1);
    } else {
      finishOnboarding(updated);
    }
  };

  const handleSkipQuestion = () => {
    if (qIndex < PERSONALIZATION_QUESTIONS.length - 1) {
      setQIndex(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleGradeGroupChange = (group: "9-10" | "11-12") => {
    setGradeGroup(group);
    if (group === "9-10") {
      setGrade("9");
      setStream(undefined);
    } else {
      setGrade("11");
      setStream("Natural");
    }
  };

  return (
    <div className="min-h-screen bg-[#04060d] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Simple System Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#04060d]"></div>
      </div>

      {/* Top National Identity Accent Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-50 ethiopian-gp-accent opacity-90"></div>

      <div 
        id="onboarding-card" 
        className="w-full max-w-md bg-[#090e1a] sm:rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden border border-slate-800/80 flex flex-col min-h-[620px] justify-between relative"
      >
        {step === 1 ? (
          /* Step 1: Rich Splash Landing Screen */
          <div className="flex flex-col justify-between p-7.5 flex-1 text-slate-100">
            {/* Header / Brand */}
            <div className="text-center mt-4">
              <div id="compass-study-logo" className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-400 to-cyan-450 bg-clip-text text-transparent font-extrabold text-4xl tracking-wider font-mono filter drop-shadow-[0_0_10px_rgba(139,92,246,0.4)]">
                <span>Compass Study</span>
                <Sparkles className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse mt-1" />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Your AI Study Coach</p>
            </div>

            {/* Core Animated-vibe Tagline */}
            <div className="text-center my-6">
              <h2 className="text-xl font-black text-slate-100 leading-tight">
                Smarter study. Better results.
              </h2>
              <div className="mt-2.5 text-xs font-black flex flex-wrap justify-center gap-x-2">
                <span className="text-indigo-400">Plan.</span>
                <span className="text-violet-400">Learn.</span>
                <span className="text-emerald-400 font-mono">Practice.</span>
                <span className="text-amber-400">Improve.</span>
                <span className="text-rose-400">Succeed.</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-4 max-w-xs mx-auto leading-relaxed font-semibold">
                Compass Study targets the Ethiopian National Curriculum Grades 9-12 to prepare you for supreme exam results.
              </p>
            </div>

            {/* Student Avatar / Mascot */}
            <div className="relative my-4 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-violet-950/40 flex items-center justify-center relative overflow-hidden border-4 border-slate-850 shadow-inner">
                {/* Simulated cartoon student */}
                <div className="absolute bottom-0 w-20 h-20 bg-violet-600 rounded-t-full flex items-end justify-center shadow-lg shadow-black/40">
                  <div className="w-9 h-9 rounded-full bg-[#182136] -translate-y-4 flex items-center justify-center border-2 border-slate-700">
                    <span className="text-[10px] font-bold">🎓</span>
                  </div>
                </div>
                {/* Glow or Sparks */}
                <div className="absolute top-2 right-6 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Feature Cards Checklist - Dark aesthetic */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col gap-1 items-start text-left shadow">
                <span className="text-base">📅</span>
                <span className="text-xs font-bold text-slate-200">Daily Plan</span>
                <span className="text-[9px] text-slate-500 font-bold">Step-by-step goals</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col gap-1 items-start text-left shadow">
                <span className="text-base">🤖</span>
                <span className="text-xs font-bold text-slate-200">AI Coach</span>
                <span className="text-[9px] text-slate-500 font-bold">Interactive advice</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col gap-1 items-start text-left shadow">
                <span className="text-base">✓</span>
                <span className="text-xs font-bold text-slate-200">Practice</span>
                <span className="text-[9px] text-slate-500 font-bold">Exam mock drills</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex flex-col gap-1 items-start text-left shadow">
                <span className="text-base">📈</span>
                <span className="text-xs font-bold text-slate-200">Progress</span>
                <span className="text-[9px] text-slate-500 font-bold">Mastery logs tracker</span>
              </div>
            </div>

            {/* Google Sign In Call-To-Action (Real Production Backup System) */}
            <div className="space-y-3">
              <button
                id="google-signup-btn"
                disabled={isLoggingIn}
                onClick={handleGoogleSignIn}
                className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-extrabold tracking-wide text-xs flex items-center justify-center gap-2.5 transition duration-200 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#ea4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.143 4.114-3.477 0-6.3-2.823-6.3-6.3s2.823-6.3 6.3-6.3c1.513 0 2.89.536 3.974 1.414l3.12-3.12C19.123 2.5 15.938 1.43 12.24 1.43c-5.833 0-10.56 4.727-10.56 10.56s4.727 10.56 10.56 10.56c5.845 0 10.37-4.103 10.37-10.56 0-.671-.06-1.316-.17-1.945H12.24Z" />
                </svg>
                <span>{isLoggingIn ? "Connecting with Google..." : "Continue with Google"}</span>
              </button>

              <button
                id="guest-onboarding-btn"
                onClick={handleNextStep}
                className="w-full py-4.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-extrabold tracking-wider uppercase text-xs flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-violet-400/20 active:scale-[0.98]"
              >
                <span>🚀 Enter as Guest (Instant Access)</span>
                <ChevronRight className="w-4.5 h-4.5 text-white animate-bounce-right" />
              </button>

              {/* Kid-friendly help bubble */}
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/45 rounded-xl text-center space-y-1">
                <p className="text-[10px] text-indigo-300 font-bold leading-normal">
                  💡 <span className="text-white font-black">Can't log in with Google?</span> That's because of browser cookie limits inside this preview box! 
                </p>
                <div className="text-[9px] text-indigo-400 font-semibold space-y-1">
                  <p>1. Press the purple <strong className="text-indigo-200">"Enter as Guest"</strong> button above to enter immediately! 🚀</p>
                  <p>2. Or click the square arrow icon <strong className="text-indigo-200">↗</strong> in the top right corner of the browser so it runs in a new full tab!</p>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-xl text-left space-y-2 animate-fadeIn">
                  <div className="text-[10px] text-rose-400 font-bold leading-normal">
                    {authError === "unauthorized-domain" ? (
                      <>
                        <span className="text-xs">⚠️</span> <strong className="text-rose-300">Unauthorized Domain</strong>: Firebase Auth blocks sign-in from this domain. To fix this:
                        <ol className="list-decimal pl-4 mt-2 space-y-1.5 font-semibold text-[9px] text-rose-300">
                          <li>Go to the <strong className="underline">Firebase Console</strong> &gt; Authentication &gt; Settings &gt; Authorized Domains.</li>
                          <li>Add these active domains to authorized domains list:
                            <code className="block mt-1.5 font-mono bg-rose-950/80 p-2 rounded text-[8px] break-all select-all border border-rose-900/40 text-rose-200">
                              ais-dev-2szfzkp3cuqujhsfkxz45v-922718190934.europe-west2.run.app<br />
                              ais-pre-2szfzkp3cuqujhsfkxz45v-922718190934.europe-west2.run.app
                            </code>
                          </li>
                        </ol>
                      </>
                    ) : (
                      `⚠️ Google Auth failed: ${authError}`
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : step === 2 ? (
          /* Step 2: Configure Name, Grade Group, Specific Grade, Stream & Language */
          <div className="flex flex-col justify-between p-7.5 flex-1 text-slate-100">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-slate-100">Customize Your Coach</h3>
                <p className="text-xs text-slate-400 mt-1 leading-snug">Adjust curriculum parameters exactly per your level.</p>
              </div>

              {/* Name field */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase font-mono">Your Name</label>
                <input
                  id="student-name-input"
                  type="text"
                  placeholder="e.g. Martha Tesfaye"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold text-slate-100 text-xs"
                />
              </div>

              {/* Grade Group Toggle */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase font-mono">Class Grade Group</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleGradeGroupChange("9-10")}
                    className={`p-3 rounded-xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      gradeGroup === "9-10"
                        ? "border-violet-600 bg-violet-950/40 text-violet-300"
                        : "border-slate-850 hover:border-slate-800 bg-slate-900/60 text-slate-500"
                    }`}
                  >
                    <span className="font-extrabold text-xs">Grades 9 – 10</span>
                    <span className="text-[9px] font-semibold text-slate-500">General Studies</span>
                  </button>

                  <button
                    onClick={() => handleGradeGroupChange("11-12")}
                    className={`p-3 rounded-xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      gradeGroup === "11-12"
                        ? "border-violet-600 bg-violet-950/40 text-violet-300"
                        : "border-slate-850 hover:border-slate-800 bg-slate-900/60 text-slate-500"
                    }`}
                  >
                    <span className="font-extrabold text-xs">Grades 11 – 12</span>
                    <span className="text-[9px] font-semibold text-slate-500">Stream Tracks</span>
                  </button>
                </div>
              </div>

              {/* Specific Grade Selection & Stream Selection */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase font-mono">Select Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-200 text-xs font-semibold"
                  >
                    {gradeGroup === "9-10" ? (
                      <>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                      </>
                    ) : (
                      <>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                      </>
                    )}
                  </select>
                </div>

                {gradeGroup === "11-12" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase font-mono">Select Stream</label>
                    <select
                      value={stream}
                      onChange={(e) => setStream(e.target.value as "Natural" | "Social")}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-200 text-xs font-semibold"
                    >
                      <option value="Natural">Natural Science</option>
                      <option value="Social">Social Science</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Language Selection */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[9px] font-black text-slate-400 tracking-widest uppercase font-mono">App Language</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "English", label: "English", sub: "English" },
                    { key: "Amharic", label: "አማርኛ", sub: "Amharic" },
                    { key: "Oromo", label: "Oromoo", sub: "Oromo" }
                  ].map((lang) => (
                    <button
                      key={lang.key}
                      onClick={() => setLanguage(lang.key as any)}
                      className={`py-2 px-1 rounded-xl border text-center flex flex-col gap-0.5 transition-all cursor-pointer ${
                        language === lang.key
                          ? "border-violet-600 bg-violet-950/40 text-violet-300 font-bold"
                          : "border-slate-850 hover:border-slate-800 bg-slate-900/40 text-slate-500"
                      }`}
                    >
                      <span className="text-xs">{lang.label}</span>
                      <span className="text-[8px] text-slate-500 font-bold">{lang.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Complete Setup/Onboard Button */}
            <button
              id="lets-get-started-btn"
              onClick={handleNextStep}
              className="w-full mt-6 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-lg shadow-violet-950/40 glow-violet border border-violet-500/25"
            >
              <span>{language === "Amharic" ? "ቀጥል" : language === "Oromo" ? "Itti fufi" : "Proceed to Survey"}</span>
              <ChevronRight className="w-5 h-5 text-violet-200" />
            </button>
          </div>
        ) : (
          /* Step 3: 18-Question Interactive Personalized Questionnaire */
          <div className="flex flex-col justify-between p-7.5 flex-1 text-slate-100 min-h-[580px] relative">
            <div className="space-y-5">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="text-left">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-violet-400">
                    Question {qIndex + 1} of {PERSONALIZATION_QUESTIONS.length}
                  </span>
                  <h3 className="text-xs font-black text-slate-300 mt-0.5">
                    {language === "Amharic" ? "አሰልጣኝዎን ያብጁ" : language === "Oromo" ? "Leenjisaa AI Sirreessi" : "Personalize Your Study Style"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => finishOnboarding()}
                  className="text-[9px] font-mono font-bold uppercase tracking-wide text-amber-500 bg-amber-950/30 border border-amber-900/30 px-2.5 py-1 rounded"
                >
                  {language === "Amharic" ? "አልፍ" : language === "Oromo" ? "Tarqi Seeni" : "Skip All"}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((qIndex + 1) / PERSONALIZATION_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Title */}
              <div className="text-left py-1">
                <h4 className="text-xs font-extrabold text-slate-100 leading-relaxed min-h-12">
                  {PERSONALIZATION_QUESTIONS[qIndex].title[language] || PERSONALIZATION_QUESTIONS[qIndex].title["English"]}
                </h4>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {PERSONALIZATION_QUESTIONS[qIndex].options.map((opt, oIdx) => {
                  const labelStr = opt.text[language] || opt.text["English"];
                  const isSelected = prefs[PERSONALIZATION_QUESTIONS[qIndex].id] === opt.value;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelection(PERSONALIZATION_QUESTIONS[qIndex].id, opt.value)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "border-violet-600 bg-violet-950/45 text-violet-200"
                          : "border-slate-850 hover:border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-[11px] font-bold leading-relaxed">{labelStr}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-violet-500 bg-violet-600" : "border-slate-800"
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3.5px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Back / Skip Actions */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-850 pt-4">
              <button
                type="button"
                onClick={() => {
                  if (qIndex > 0) setQIndex(prev => prev - 1);
                }}
                disabled={qIndex === 0}
                className="px-3.5 py-2 bg-slate-905 border border-slate-850 text-slate-400 hover:text-slate-200 rounded-xl text-[10px] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                {language === "Amharic" ? "ወደኋላ" : language === "Oromo" ? "Gara Boodaa" : "Previous"}
              </button>

              <button
                type="button"
                onClick={handleSkipQuestion}
                className="px-3.5 py-2 bg-violet-950/20 hover:bg-violet-950/40 border border-violet-900/30 text-violet-300 rounded-xl text-[10px] font-extrabold transition cursor-pointer"
              >
                {language === "Amharic" ? "ይህን ዝለል" : language === "Oromo" ? "Gaaffii Tarqi" : "Skip Question"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import React, { useState, useRef, useEffect } from "react";
import { checkIsDevAccount } from "../utils/devRole";
import {
  Sparkles,
  Send,
  MessageSquare,
  Brain,
  HelpCircle,
  GraduationCap,
  Mic,
  MicOff,
  Paperclip,
  X,
  Loader2,
  Crown,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  Volume2,
  VolumeX,
  UserCheck,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
} from "lucide-react";
import { UserProfile, UserStats } from "../types";
import {
  getTeacherForSubject,
  getTeacherNameInitial,
} from "../utils/teacherLookup";
import CustomIconText from "./CustomIconText";
import { auth } from "../lib/firebase";

interface Message {
  id: string;
  sender: "user" | "coach";
  speakerName: string; // "Some" or Teacher Name
  text: string;
  timestamp: Date;
  attachmentName?: string;
  attachmentType?: string;
  attachmentBase64?: string;
}

interface AICoachProps {
  profile: UserProfile;
  stats: UserStats;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateStats: (updates: Partial<UserStats>) => void;

  // Flow connections from books/lessons
  activeTeacherSubject?: string | null;
  onClearActiveTeacherSubject?: () => void;

  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

interface AttachmentState {
  name: string;
  mimeType: string;
  data: string; // Base64 representation
}

const COACH_STRINGS = {
  English: {
    statusBadge: "Active Companion",
    limitRemaining: "chats remaining today",
    unlimited: "Unlimited Access Active",
    upgradeHeader: "Unlock Compass Premium ⚡",
    upgradeDesc:
      "Unlock unlimited expert AI questions, image/PDF explanations, high-definition voice commands, and exclusive Ministry stream preparation templates.",
    upgradeBtn: "Enable Gamma Premium Access (Free)",
    placeholder: "Ask Some or your Subject Teacher anything about Grade",
    chipStudy: "🎓 Help me review my study plan today",
    chipQuiz: "📝 Ask me a challenging practice question",
    chipHabits: "📚 Best habits for the Ministry Exams",
    working: "Thinking...",
    attachmentAdded: "Attachment ready",
    recognitionStart: "Listening... speak now",
    recognitionEnd: "Audio transcribed",
    quotaReached: "Free Chat Limit Reached",
    congratsTitle: "Congratulations!",
    congratsBody:
      "You have unlocked Compass Premium status! You now have unlimited study logs, chat coach explanations, and stream blueprints.",
  },
  Amharic: {
    statusBadge: "ገቢር አጋዥ",
    limitRemaining: "ቀሪ ነጻ ጥያቄዎች",
    unlimited: "ያልተገደበ ፕሪሚየም ገቢር ነው",
    upgradeHeader: "Compass Premiumን ይክፈቱ ⚡",
    upgradeDesc:
      "ያልተገደቡ የፈጣን አሰልጣኝ ክፍለ ጊዜዎችን፣ የምስል እና የፒዲኤፍ ትንታኔዎችን፣ እና የሀገር አቀፍ የፈተና መስመሮችን ይክፈቱ።",
    upgradeBtn: "ፕሪሚየምን በነጻ ይክፈቱ",
    placeholder: "ለሳም ወይም ለክፍል አስተማሪዎ ጥያቄ ይጠይቁ",
    chipStudy: "🎓 የዛሬውን የጥናት ዕቅዴን ገምግምልኝ",
    chipQuiz: "📝 ከባድ የክለሳ ጥያቄ ጠይቀኝ",
    chipHabits: "📚 ለሀገር አቀፍ ፈተና ምርጥ ልምዶች",
    working: "በማሰላሰል ላይ...",
    attachmentAdded: "ፋይል ተያይዟል",
    recognitionStart: "እያዳመጥኩ ነው... ይናገሩ",
    recognitionEnd: "ድምጽዎ ተተርጉሟል",
    quotaReached: "የነጻ ጥያቄዎች ገደብ ላይ ደርሰዋል",
    congratsTitle: "እንኳን ደስ አለዎት!",
    congratsBody:
      "Compass Premiumን በነጻ ከፍተዋል! አሁን ሁሉንም ጥያቄዎች እና ሰነዶች መመርመር ይችላሉ።",
  },
  Oromo: {
    statusBadge: "Miri Saffisaa",
    limitRemaining: "gaaffiiwwan hafan",
    unlimited: "Premium Daangaa Malee Banamedha",
    upgradeHeader: "Compass Premium Bani ⚡",
    upgradeDesc:
      "Barnoota dabalataa gaaffii fi deebii daangaa malee, qorannoo fakkii fi PDF, fi qophii qormaata biyyoolessaa guutuu argadhu.",
    upgradeBtn: "Premium Bilisaan Bani",
    placeholder: "Some ykn Barsiisaa kee waan hunda gaafadhu kutaa",
    chipStudy: "🎓 Karoora qo'annaa kiyya har'aa naaf ilaali",
    chipQuiz: "📝 Gaaffii shaakala cimaa na gaafadhu",
    chipHabits: "📚 Qabxii qormaataa fiduuf maal qaba?",
    working: "Hojjechaa jira...",
    attachmentAdded: "Faayilli qabameera",
    recognitionStart: "Dhaga'amaa jira... dubbadhu",
    recognitionEnd: "Sagaleen fayerameera",
    quotaReached: "Daangaan Gaaffii Bilisaa Dhumeera",
    congratsTitle: "Baga Gamaddan!",
    congratsBody:
      "Premium Compass bilisaan banitanii jirtu! Amma gaaffii bilisaan fi daangaa malee gaafachuu dandeessu.",
  },
};

import DevDashboard from "./DevDashboard";

export default function AICoach({
  profile,
  stats,
  onUpdateProfile,
  onUpdateStats,
  activeTeacherSubject,
  onClearActiveTeacherSubject,
  initialPrompt,
  onClearInitialPrompt,
}: AICoachProps) {
  // The Dev Dashboard is now gated by a real server-verified role claim +
  // password (see DevDashboard.tsx's access-gate wrapper). This client-side
  // check just controls whether the entry point below is even shown —
  // it is not the security boundary itself.
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isDevAccount, setIsDevAccount] = useState(false);

  useEffect(() => {
    checkIsDevAccount().then(setIsDevAccount);
  }, []);

  const language =
    profile.language === "Amharic" || profile.language === "Oromo"
      ? profile.language
      : "English";
  const strings = COACH_STRINGS[language] || COACH_STRINGS.English;

  const getInitialGreetings = () => {
    if (activeTeacherSubject) {
      const teacher = getTeacherForSubject(activeTeacherSubject);
      return teacher.langGreeting[language] || teacher.langGreeting.English;
    }

    // Normal Some greeting
    const studentDispName =
      profile.name === "Serious Student"
        ? language === "Amharic"
          ? "ውድ ተማሪ"
          : language === "Oromo"
            ? "gargaaramaa"
            : "young scholar"
        : profile.name;

    if (language === "Amharic") {
      return `ሰላም ${studentDispName}! እኔ ሳም (Some) ነኝ - የእርስዎ የጥናት አጋዥ። [HEART] የክፍል ${profile.grade} ትምህርቶችን፣ ፎርሙላዎችን እና የሀገር አቀፍ ፈተናዎችን በዝርዝር ልረዳዎት እችላለሁ። ዛሬ ምን እንስራ? [BRAIN]`;
    } else if (language === "Oromo") {
      return `Akkam ${studentDispName}! Ani Some - gargaaraa qo'annoo keeti. [HEART] Barnoota kutaa ${profile.grade} fi dhimma qormaataa hunda irratti si gargaaruu nan danda'a. Har'a maal barannu? [BRAIN]`;
    } else {
      return `Hi ${studentDispName}! I am Some, your permanent AI Study Companion. [HEART] I can explain complex terms, configure personalized schedules, and coordinate with subject teachers to ready you for your Grade ${profile.grade} national exams. What can we master today? [BRAIN]`;
    }
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const { getChatSession } = await import("../utils/storage");
      const savedMessages = await getChatSession("default_session");
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        setMessages([
          {
            id: "m0",
            sender: "coach",
            speakerName: activeTeacherSubject
              ? getTeacherForSubject(activeTeacherSubject).name
              : "Some",
            text: getInitialGreetings(),
            timestamp: new Date(),
          },
        ]);
      }
      setSessionLoaded(true);
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (sessionLoaded && messages.length > 0) {
      const saveSession = async () => {
        const { saveChatSession } = await import("../utils/storage");
        await saveChatSession("default_session", messages);
      };
      saveSession();
    }
  }, [messages, sessionLoaded]);

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (input === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input]);

  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<AttachmentState | null>(null);
  const [recording, setRecording] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  // Audio Playback states for Voice Output TTS
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [ttsLoadingMsgId, setTtsLoadingMsgId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, "up" | "down">>({});
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const [autoSpeak, setAutoSpeak] = useState(false); // Silent by default for standard text chat as requested
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female"); // Active voice actor gender (Kore/Zephyr)

  const unlockAudio = () => {
    try {
      const AudioCtx =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const dummyCtx = new AudioCtx();
        if (dummyCtx.state === "suspended") {
          dummyCtx.resume();
        }
      }
      const silentAudio = new Audio(
        "data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAAD",
      );
      silentAudio.play().catch(() => {});
    } catch (e) {
      console.warn("Audio Context unlock failed:", e);
    }
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => {
      setCopiedMsgId(null);
    }, 1500);
  };

  const handleFeedback = async (msgId: string, type: "up" | "down", msgText: string, index: number) => {
    const currentState = feedbackState[msgId];
    if (currentState === type) {
      setFeedbackState(prev => ({ ...prev, [msgId]: undefined as any }));
      return;
    }
    setFeedbackState(prev => ({ ...prev, [msgId]: type }));

    if (type === "down") {
      // Find previous user message
      let previousQuestion = "";
      for (let i = index - 1; i >= 0; i--) {
        if (messages[i].sender === "user") {
          previousQuestion = messages[i].text;
          break;
        }
      }
      try {
        const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : "";
        fetch("/api/flag-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(idToken ? { "Authorization": `Bearer ${idToken}` } : {})
          },
          body: JSON.stringify({
            uid: auth.currentUser?.uid || "anonymous",
            subject: activeTeacherSubject || "General",
            question: previousQuestion || "Unknown previous context",
            answer: msgText
          })
        }).catch(() => {});
      } catch (e) {}
    } else {
      try {
        const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : "";
        fetch("/api/log-feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(idToken ? { "Authorization": `Bearer ${idToken}` } : {})
          },
          body: JSON.stringify({
            uid: auth.currentUser?.uid || "anonymous",
            subject: activeTeacherSubject || "General",
            feedback: 1
          })
        }).catch(() => {});
      } catch (e) {}
    }
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Triggered when a new subject teacher is pre-loaded/handed-off
  useEffect(() => {
    if (activeTeacherSubject) {
      const teacher = getTeacherForSubject(activeTeacherSubject);
      const greetingText =
        teacher.langGreeting[language] || teacher.langGreeting.English;

      // Append a seamless transition handoff message from Some
      const handoffId = `handoff-${Date.now()}`;
      const introText =
        language === "Amharic"
          ? `እየመራሁዎት ነው! አሁን ከክፍል አስተማሪዎ ከ${teacher.name} ጋር ያጠናሉ። [ROCKET]`
          : language === "Oromo"
            ? `Qajeelfama keetiin! Amma barsiisaa koorsii kee ${teacher.name} waliin qo'atta. [ROCKET]`
            : `Connecting study context... [CLOCK] I'm handing you over to ${teacher.name} for ${activeTeacherSubject}! [ROCKET]`;

      setMessages((prev) => [
        ...prev,
        {
          id: handoffId + "-intro",
          sender: "coach",
          speakerName: "Some",
          text: introText,
          timestamp: new Date(),
        },
        {
          id: handoffId + "-teacher",
          sender: "coach",
          speakerName: teacher.name,
          text: greetingText,
          timestamp: new Date(),
        },
      ]);
    }
  }, [activeTeacherSubject]);

  useEffect(() => {
    if (initialPrompt) {
      const promptTimer = setTimeout(() => {
        handleSendMessage(initialPrompt);
        if (onClearInitialPrompt) {
          onClearInitialPrompt();
        }
      }, 550);
      return () => clearTimeout(promptTimer);
    }
  }, [initialPrompt]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // Clean up audio on unmount
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
    };
  }, []);

  const isPremium =
    profile.subscriptionStatus === "premium" || !!profile.isPremium;
  const isGoogleUser = profile.subscriptionStatus === "google";
  const MAX_FREE_MESSAGES = isPremium ? Infinity : isGoogleUser ? 15 : 5;
  const currentChatCount = stats.coachChatCount || 0;
  const remainingChats = isPremium
    ? Infinity
    : Math.max(0, MAX_FREE_MESSAGES - currentChatCount);

  // Highly optimized scroll to bottom utilizing container top offset direct write
  // to avoid browser layout jumps or body overflow hopping
  const scrollToBottom = (isSmooth: boolean = true) => {
    const container = chatScrollContainerRef.current;
    if (!container) return;
    const targetScrollTop = container.scrollHeight - container.clientHeight;

    // Execute inside animation frames so state mutations have completely flushed to DOM
    requestAnimationFrame(() => {
      container.scrollTo({
        top: targetScrollTop,
        behavior: isSmooth ? "smooth" : "auto",
      });
    });
  };

  useEffect(() => {
    scrollToBottom(true);
    // Double check fallback for loaded images / media / text layout shifts
    const timer = setTimeout(() => scrollToBottom(true), 120);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;

      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 640;
          const scale = Math.min(1, MAX_WIDTH / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setAttachment({
            name: file.name,
            mimeType: "image/jpeg",
            data: compressedDataUrl,
          });
        };
        img.src = result;
      } else {
        setAttachment({
          name: file.name,
          mimeType: file.type || "application/pdf",
          data: result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Voice speech recognition is not supported in this browser version. Please write manually.",
      );
      return;
    }

    if (recording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
      setRecording(false);
      return;
    }

    // Stop and clear any existing session
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    rec.continuous = false;
    rec.interimResults = false;

    if (language === "Amharic") {
      rec.lang = "am-ET";
    } else if (language === "Oromo") {
      rec.lang = "om-ET";
    } else {
      rec.lang = "en-US";
    }

    rec.onstart = () => {
      setRecording(true);
    };

    rec.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + speechToText : speechToText));
    };

    rec.onerror = (err: any) => {
      console.warn("Speech recognition error:", err);
      setRecording(false);
    };

    rec.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
    };

    rec.start();
  };

  const speakMessage = async (
    messageText: string,
    speakerName: string,
    msgId: string,
  ) => {
    if (playingMsgId === msgId) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        setPlayingMsgId(null);
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    // Skip/Ignore custom icon bracket tags (e.g. [STREAK], [HEART]) inside the audio output
    const cleanSpokenText = messageText
      .replace(/\[[A-Z0-9_\-]+\]/gi, "")
      .trim();

    setPlayingMsgId(msgId);
    setTtsLoadingMsgId(msgId);

    // Stop any ongoing speech synthesis first
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const idToken = auth.currentUser
        ? await auth.currentUser.getIdToken()
        : "";
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: auth.currentUser?.uid || null,
          text: cleanSpokenText,
          speakerName: speakerName,
          language: language,
          gender: voiceGender,
        }),
      });

      if (!response.ok) throw new Error("Server TTS generator failed");
      const data = await response.json();

      if (data.audio) {
        if (activeAudioRef.current) {
          activeAudioRef.current.pause();
        }
        const audioUrl = `data:audio/wav;base64,${data.audio}`;
        const audio = new Audio(audioUrl);
        activeAudioRef.current = audio;

        audio.onended = () => {
          setPlayingMsgId(null);
        };

        audio.onerror = () => {
          setPlayingMsgId(null);
        };

        await audio.play();
      } else {
        throw new Error("No audio payload");
      }
    } catch (err) {
      console.warn(
        "Server TTS failed, falling back to local speech synthesis:",
        err,
      );
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
          if (language === "Amharic") {
            utterance.lang = "am-ET";
          } else if (language === "Oromo") {
            utterance.lang = "om-ET";
          } else {
            utterance.lang = "en-US";
          }

          const voices = window.speechSynthesis.getVoices();
          if (language === "Amharic") {
            const amVoice = voices.find((v) => v.lang.startsWith("am"));
            if (amVoice) utterance.voice = amVoice;
          } else if (language === "Oromo") {
            const omVoice = voices.find((v) => v.lang.startsWith("om"));
            if (omVoice) utterance.voice = omVoice;
          } else {
            const femaleVoice = voices.find(
              (v) =>
                v.lang.toLowerCase().includes("en") &&
                (v.name.toLowerCase().includes("female") ||
                  v.name.toLowerCase().includes("zira") ||
                  v.name.toLowerCase().includes("samantha")),
            );
            if (femaleVoice) utterance.voice = femaleVoice;
          }

          utterance.rate = 0.95;
          utterance.onend = () => {
            setPlayingMsgId(null);
          };
          utterance.onerror = () => {
            setPlayingMsgId(null);
          };
          window.speechSynthesis.speak(utterance);
        } catch (spErr) {
          console.error("Local SpeechSynthesis failed:", spErr);
          setPlayingMsgId(null);
        }
      } else {
        setPlayingMsgId(null);
      }
    } finally {
      setTtsLoadingMsgId(null);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text && !attachment) return;

    // NOTE: the old "/admin" chat command + hardcoded client-side password
    // has been removed — it shipped the password in the JS bundle for anyone
    // to read, which is a real vulnerability, not a placeholder one. Admin/
    // teacher dashboard access is being rebuilt as a real server-verified
    // role check (Firebase custom claim + password + optional biometric),
    // per the Compass Architecture doc. Until that's wired up, this dashboard
    // is intentionally unreachable rather than left open through a fake gate.

    const userMsg: Message = {
      id: `m-u-${Date.now()}`,
      sender: "user",
      speakerName: profile.name === "Serious Student" ? "You" : profile.name,
      text: text || `Please analyze my document: ${attachment?.name}`,
      timestamp: new Date(),
      attachmentName: attachment?.name,
      attachmentType: attachment?.mimeType,
      attachmentBase64: attachment?.data,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const activeAttachment = attachment;
    setAttachment(null);
    setLoading(true);

    if (!isOnline) {
      setTimeout(() => {
        const coachMsg: Message = {
          id: `m-c-offline-${Date.now()}`,
          sender: "coach",
          speakerName: "Some",
          text:
            language === "Amharic"
              ? "የጥናት አሰልጣኙ ለመመለስ የበይነመረብ ግንኙነት ያስፈልገዋል። [CLOCK] እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡ።"
              : language === "Oromo"
                ? "Marii gaggessuuf Interneetiin sirriitti hin hojjetu. [CLOCK] Maaloo quunnamtii interneetii kee mirkaneeffadhu."
                : "Some needs an active internet connection to respond. [CLOCK] Please check your network connection.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, coachMsg]);
        setLoading(false);
      }, 750);
      return;
    }

    onUpdateStats({ coachChatCount: currentChatCount + 1 });

    try {
      const idToken = auth.currentUser
        ? await auth.currentUser.getIdToken()
        : "";
      const activeTeacherObj = activeTeacherSubject
        ? getTeacherForSubject(activeTeacherSubject)
        : null;
      const response = await fetch("/api/chat-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: auth.currentUser?.uid || null,
          message:
            text ||
            `Analyze or summarize this files attachment in detail: ${userMsg.attachmentName}`,
          profile: profile,
          attachment: activeAttachment,
          activeTeacherSubject: activeTeacherSubject || null,
          history: messages.slice(-8).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to contact backend coach.");
      }

      const data = await response.json();
      const replyVal =
        data.reply ||
        "I completed examining your concept! Let's schedule more practice rounds under the Books panel. [TROPHY]";

      const coachMsg: Message = {
        id: `m-c-${Date.now()}`,
        sender: "coach",
        speakerName: activeTeacherObj ? activeTeacherObj.name : "Some",
        text: replyVal,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, coachMsg]);
      if (autoSpeak) {
        speakMessage(replyVal, coachMsg.speakerName, coachMsg.id);
      }
    } catch (e: any) {
      console.error("AI Coach connection or execution error:", e);
      const coachMsg: Message = {
        id: `m-c-err-${Date.now()}`,
        sender: "coach",
        speakerName: activeTeacherSubject
          ? getTeacherForSubject(activeTeacherSubject).name
          : "Some",
        text:
          language === "Amharic"
            ? "አሁን ከመስመር ጋር መገናኘት አልቻልኩም፣ እባክዎ በድጋሚ ይሞክሩ። [CLOCK]"
            : language === "Oromo"
              ? "Yeroo ammaa quunnamtii uumuun rakkisaa dha, maaloo irra deebi'ii yaali. [CLOCK]"
              : "I'm having trouble connecting right now, please try again in a moment. [CLOCK]",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeActivation = () => {
    onUpdateProfile({ isPremium: true });
    setShowUpgradeModal(false);
    setShowCongrats(true);
  };

  if (showAdminPanel) {
    return (
      <DevDashboard
        profile={profile}
        stats={stats}
        onBack={() => setShowAdminPanel(false)}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050914] border border-slate-900/40 rounded-3xl overflow-hidden text-left relative z-10 select-text">
      {/* Dynamic Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-905 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {activeTeacherSubject ? (
            <div
              className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${getTeacherForSubject(activeTeacherSubject).color} flex items-center justify-center border text-slate-100 relative shadow-[0_0_15px_rgba(139,92,246,0.2)]`}
            >
              <span className="font-mono text-sm font-black uppercase">
                {getTeacherNameInitial(
                  getTeacherForSubject(activeTeacherSubject).name,
                )}
              </span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-slate-100 flex items-center justify-center border border-violet-500/25 relative glow-violet">
              <Sparkles className="w-4 h-4 fill-violet-300" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-black text-slate-100 leading-none">
                {activeTeacherSubject
                  ? getTeacherForSubject(activeTeacherSubject).name
                  : "Some Companion"}
              </h4>
              {isPremium && (
                <span className="bg-amber-450/10 text-amber-400 border border-amber-500/25 px-1 py-0.2 rounded text-[7px] font-mono font-black uppercase flex items-center gap-0.5">
                  PRO
                </span>
              )}
            </div>
            <span className="text-[9px] font-extrabold text-violet-400 tracking-wider uppercase mt-1 inline-block">
              {activeTeacherSubject
                ? `${activeTeacherSubject} Teacher`
                : `Mentor • Gr. ${profile.grade}`}
            </span>
          </div>
        </div>

        {/* Dynamic Controls / Clear Teacher option */}
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          {/* Quick Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
            <span className="text-[8px] font-black tracking-wider text-slate-500 uppercase">
              Lang:
            </span>
            {(["English", "Amharic", "Oromo"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onUpdateProfile({ language: lang })}
                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase transition cursor-pointer ${
                  language === lang
                    ? "bg-violet-600 text-white font-black"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lang === "English" ? "EN" : lang === "Amharic" ? "AM" : "OM"}
              </button>
            ))}
          </div>

          {/* Dev Dashboard entry — only ever rendered for accounts with the
              server-set "dev" role claim. See DevDashboard.tsx for the real
              access gate (role + password) that runs regardless of this. */}
          {isDevAccount && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-violet-600 py-1 px-2.5 rounded-xl text-[9px] font-black uppercase text-violet-400 transition cursor-pointer"
              title="Dev Dashboard"
            >
              <ShieldAlert className="w-3 h-3" />
            </button>
          )}

          {/* Voice Gender Selection */}
          <button
            onClick={() =>
              setVoiceGender((prev) => (prev === "female" ? "male" : "female"))
            }
            className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 py-1 px-2.5 rounded-xl text-[9px] font-black uppercase text-slate-300 transition cursor-pointer"
            title={`Active Voice actor: ${voiceGender === "female" ? "Female (Kore)" : "Male (Zephyr/Fenrir)"}`}
          >
            <span>{voiceGender === "female" ? "👩" : "👨"}</span>
            <span className="text-[8px]">
              Voice: {voiceGender === "female" ? "Female" : "Male"}
            </span>
          </button>

          {activeTeacherSubject && onClearActiveTeacherSubject && (
            <button
              onClick={() => {
                onClearActiveTeacherSubject();
                // Send return message
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `return-${Date.now()}`,
                    sender: "coach",
                    speakerName: "Some",
                    text:
                      language === "Amharic"
                        ? "ወደ እኔ ተመልሰዋል! ተስፋ አደርጋለሁ አስተማሪዎ በደንብ አስረድቷል። ቀጥለን ምን እንስራ? [CELEBRATE]"
                        : language === "Oromo"
                          ? "Gara kootti deebiteetta! Barsiisaan kee siif ibseera natti fakkaata. Maal goona? [CELEBRATE]"
                          : "Welcome back to Some! [HEART] Hope the teacher made that concept crystal clear. What study target shall we conquer next? [CELEBRATE]",
                    timestamp: new Date(),
                  },
                ]);
              }}
              className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 py-1 px-2.5 rounded-xl text-[9px] font-bold uppercase text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Return to Some Primary Coach"
            >
              <UserCheck className="w-3 h-3 text-violet-400" />
              <span>Talk to Some</span>
            </button>
          )}

          {/* Dynamic Auto-Speak Volume Toggle */}
          <button
            onClick={() => setAutoSpeak((prev) => !prev)}
            className={`flex items-center gap-1.5 border py-1 px-2.5 rounded-xl text-[9px] font-bold uppercase transition cursor-pointer ${
              autoSpeak
                ? "bg-violet-950/40 border-violet-500/40 text-violet-300 hover:bg-violet-900/55"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
            }`}
            title={
              autoSpeak
                ? "Auto Voice Feedback Activated"
                : "Auto Voice Feedback Deactivated"
            }
          >
            {autoSpeak ? (
              <Volume2 className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>Voice Feedback</span>
          </button>

          <div className="hidden sm:flex gap-1.5 items-center bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              {strings.statusBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Bubble Stream */}
      <div
        ref={chatScrollContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-slate-950/15"
      >
        {messages.map((m, index) => {
          const isUser = m.sender === "user";
          const isSome = m.speakerName === "Some";
          const isTtsLoading = ttsLoadingMsgId === m.id;
          const isPlaying = playingMsgId === m.id;

          return (
            <div
              key={m.id}
              className={`flex ${isUser ? "justify-end text-right" : "justify-start text-left ml-1"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed transition-all duration-300 ${
                  isUser
                    ? "bg-violet-600/90 text-white rounded-br-none glow-violet animate-fadeIn"
                    : "bg-[#0c1224]/90 text-slate-200 rounded-bl-none border border-slate-850/80 animate-fadeIn"
                }`}
              >
                {m.attachmentBase64 && m.attachmentType?.startsWith("image/") && (
                  <img 
                    src={m.attachmentBase64.startsWith("data:") ? m.attachmentBase64 : `data:${m.attachmentType};base64,${m.attachmentBase64}`} 
                    alt="attachment" 
                    className="w-full max-w-[200px] rounded-lg mb-2 object-cover border border-white/20"
                  />
                )}
                {m.attachmentName && !m.attachmentType?.startsWith("image/") && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-black/20 rounded-lg">
                    <span className="text-xl">📄</span>
                    <span className="text-[10px] opacity-80 truncate">{m.attachmentName}</span>
                  </div>
                )}
                {!isUser && (
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span
                      className={`text-[8.5px] font-black uppercase tracking-widest font-mono ${
                        isSome ? "text-violet-450" : "text-amber-450"
                      }`}
                    >
                      {m.speakerName === "Some"
                        ? "FIY COMPANION"
                        : m.speakerName.toUpperCase()}
                    </span>

                    {/* TTS Speaker icon play trigger */}
                    <button
                      onClick={() => speakMessage(m.text, m.speakerName, m.id)}
                      className="text-slate-500 hover:text-violet-400 p-0.5 hover:bg-slate-900 rounded transition cursor-pointer"
                      title="Convert replies to voice"
                    >
                      {isTtsLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                      ) : isPlaying ? (
                        <div className="flex items-center gap-0.5">
                          <span className="w-0.5 h-2.5 bg-violet-400 animate-bounce"></span>
                          <span
                            className="w-0.5 h-1.5 bg-violet-400 animate-bounce"
                            style={{ animationDelay: "0.15s" }}
                          ></span>
                          <span
                            className="w-0.5 h-2 bg-violet-400 animate-bounce"
                            style={{ animationDelay: "0.3s" }}
                          ></span>
                        </div>
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Text Block content rendered with brand custom inline PNG icons */}
                <span className="whitespace-pre-line font-medium text-slate-200">
                  <CustomIconText text={m.text} />
                </span>

                {/* Attachment bubble */}
                {m.attachmentName && (
                  <div className="mt-2.5 p-2 bg-slate-950/40 rounded-lg border border-slate-800/80 flex items-center gap-2 text-[10px] text-cyan-400 font-bold">
                    <FileText className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="truncate max-w-[150px]">
                      {m.attachmentName}
                    </span>
                    <span className="text-[8px] bg-cyan-950 text-cyan-300 px-1 py-0.5 rounded ml-auto uppercase">
                      {m.attachmentType?.split("/")[1]}
                    </span>
                  </div>
                )}

                {!isUser && (
                  <div className="flex items-center gap-2 mt-1.5 opacity-70 hover:opacity-100 transition">
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="text-slate-500 hover:text-violet-400 p-0.5 hover:bg-slate-900 rounded transition cursor-pointer"
                      title="Copy message"
                    >
                      {copiedMsgId === m.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleFeedback(m.id, "up", m.text, index)}
                      className={`p-0.5 hover:bg-slate-900 rounded transition cursor-pointer ${
                        feedbackState[m.id] === "up" ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(m.id, "down", m.text, index)}
                      className={`p-0.5 hover:bg-slate-900 rounded transition cursor-pointer ${
                        feedbackState[m.id] === "down" ? "text-rose-400" : "text-slate-500 hover:text-rose-400"
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    {feedbackState[m.id] === "down" && (
                      <span className="text-[8px] text-slate-500 font-bold animate-fadeOut delay-2000">Noted</span>
                    )}
                  </div>
                )}

                <span className="block text-[8px] text-slate-550 mt-2 font-bold font-mono">
                  {m.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex justify-start text-left pl-1">
            <div className="bg-[#0c1224]/90 border border-violet-800/20 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 h-10">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-850 relative z-20">
        {/* Attachment preview panel */}
        {attachment && (
          <div className="absolute -top-12 left-3 right-3 p-1 px-3 bg-cyan-950 border border-cyan-800 rounded-xl flex items-center justify-between text-cyan-300 text-[10px] z-50 shadow-lg animate-slideUp">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {strings.attachmentAdded}: <strong>{attachment.name}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="p-1 hover:bg-cyan-900 rounded text-cyan-400 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Recording active mic status overlay with a close button */}
        {recording && (
          <div className="absolute -top-12 left-3 right-3 p-1.5 px-3.5 bg-red-950/95 border border-red-800/60 rounded-xl flex items-center justify-between text-red-200 text-[10px] z-50 shadow-lg animate-slideUp">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Microphone is active & listening... speak now!</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.abort();
                  } catch (e) {}
                  recognitionRef.current = null;
                }
                setRecording(false);
              }}
              className="px-2 py-1 bg-red-650 hover:bg-red-750 font-black uppercase text-[9px] tracking-wider rounded-lg text-white flex items-center gap-1 cursor-pointer transition shadow-sm border border-red-550/35"
              title="Stop listening now"
            >
              <MicOff className="w-2.5 h-2.5 text-red-100" />
              <span>Close Mic</span>
            </button>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach study document"
            className="p-3 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer flex items-center justify-center"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={`${strings.placeholder} ${profile.grade}...`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            className="flex-1 px-3 py-3 bg-[#0a0f1d] border border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500 text-xs font-semibold text-slate-100 placeholder-slate-500 font-sans resize-none overflow-y-auto min-h-[44px] max-h-[250px]"
            style={{ height: "auto", overflowY: "auto" }}
          />

          {/* Speech recording mic button */}
          {recording ? (
            <button
              type="button"
              onClick={() => {
                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.abort();
                  } catch (e) {}
                  recognitionRef.current = null;
                }
                setRecording(false);
              }}
              title="Close Microphone"
              className="px-3 py-3 bg-red-650 border border-red-550 text-white rounded-xl animate-pulse shadow-md shadow-red-950 cursor-pointer flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider transition hover:bg-red-750"
            >
              <MicOff className="w-4 h-4" />
              <span>Close Mic</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startVoiceRecognition}
              title="Voice Command Recording"
              className="p-3 rounded-xl border transition cursor-pointer flex items-center justify-center bg-slate-900 border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleSendMessage(input)}
            className="p-3 bg-gradient-to-tr from-violet-650 to-indigo-650 hover:from-violet-750 hover:to-indigo-750 text-white rounded-xl shadow transition cursor-pointer border border-violet-500/10 flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-violet-100" />
          </button>
        </div>
      </div>

      {/* paywall */}
      {showUpgradeModal && (
        <div className="absolute inset-0 bg-slate-950/95 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#090e18] border border-violet-500/20 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative glow-violet">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center mx-auto scale-110">
              👑
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-100">
                {strings.upgradeHeader}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {strings.upgradeDesc}
              </p>
            </div>

            <div className="bg-[#05080e]/90 p-3 rounded-2xl border border-slate-850 space-y-2 text-left">
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                <span>Unlimited Some and Teacher Chats</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                <span>Lightweight Document Upload Tools</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                <span>Speech & Translation Modules</span>
              </div>
            </div>

            <button
              onClick={handleUpgradeActivation}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-violet-950/50 cursor-pointer transition flex items-center justify-center gap-1 border border-violet-500/20"
            >
              <span>{strings.upgradeBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* congrats */}
      {showCongrats && (
        <div className="absolute inset-0 bg-[#040812]/95 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xs bg-slate-950 border border-emerald-500/20 rounded-3xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-100">
                {strings.congratsTitle}
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {strings.congratsBody}
              </p>
            </div>

            <button
              onClick={() => setShowCongrats(false)}
              className="w-full py-2.5 bg-emerald-605 hover:bg-emerald-705 text-slate-100 rounded-xl text-xs font-bold uppercase cursor-pointer"
            >
              Great! Let's Go
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Push notification templates — Compass Study's notification "voice."
// Style: a study buddy who's a little proud of the student, not a nagging
// parent or a corporate app. Short, warm, direct, one idea per notification.
//
// Amharic and Tigrinya use gender-inclusive suffix formatting (e.g. ነህ/ነሽ,
// ካ/ኪ) so the "study buddy" voice addresses both male and female students
// naturally — keep this pattern for any new Amharic/Tigrinya notification
// text added later.
//
// Used server-side when sending FCM push notifications. {placeholders} get
// filled in with real data at send time — never translate or move them.

import { Language } from "../../src/translations";

export interface NotificationTemplate {
  title: string;
  body: string;
}

export type NotificationKey =
  | "dailyMorning"
  | "dailyAfternoon"
  | "dailyEvening"
  | "streakRisk"
  | "weakSubject"
  | "reengagement"
  | "examApproaching"
  | "quotaReached"
  | "newChatMessage"
  | "chatLimitWarning"
  | "newFileFromTeacher"
  | "connectionAccepted";

export const NOTIFICATION_TEMPLATES: Record<NotificationKey, Record<Language, NotificationTemplate>> = {
  dailyMorning: {
    English: { title: "Good morning! 🌅", body: "A few minutes of Grade {grade} today keeps you ahead. Ready?" },
    Amharic: { title: "እንደምን አደርክ/ሽ! 🌅", body: "የዛሬ ጥቂት ደቂቃዎች የ{grade}ኛ ክፍል ጥናት ወደፊት ያራምድሃል/ሻል። ዝግጁ ነህ/ነሽ?" },
    Oromo: { title: "Akkam bulte! 🌅", body: "Daqiiqaan muraasni qo'annaa kutaa {grade} har'aa fuulduratti si tarkaanfachiisa. Qophiidhaa?" },
    Tigrinya: { title: "ከመይ ሓዲርካ/ኪ! 🌅", body: "ናይ ሎሚ ቁሩብ ደቓይቕ መጽናዕቲ {grade} ክፍሊ ንቕድሚት ይስጉመካ/ኪ። ድሉው ዲኻ/ኺ?" },
  },
  dailyAfternoon: {
    English: { title: "Study break? 📚", body: "Your {subject} lesson is waiting whenever you have 10 minutes." },
    Amharic: { title: "የጥናት እረፍት? 📚", body: "10 ደቂቃ ሲኖርህ/ሽ የ{subject} ትምህርትህ/ሽ ይጠብቅሃል/ሻል።" },
    Oromo: { title: "Boqonnaa qo'annaa? 📚", body: "Barnootni {subject} kee yeroo daqiiqaa 10 qabaattutti si eegaa jira." },
    Tigrinya: { title: "ዕረፍቲ መጽናዕቲ? 📚", body: "10 ደቓይቕ ኣብ ዝህልወካ/ኪ እዋን ትምህርቲ {subject} ይጽበየካ/ኪ ኣሎ።" },
  },
  dailyEvening: {
    English: { title: "Finish today strong 🌙", body: "Pick up where you left off in {subject}." },
    Amharic: { title: "የዛሬውን ቀን በጠንካራ ሁኔታ አጠናቅ/ቂ 🌙", body: "በ{subject} ያቆምክበት/ሽበት ቦታ ላይ ቀጥል/ይ።" },
    Oromo: { title: "Guyyaa har'aa ciminaan xumuri 🌙", body: "Qo'annaa {subject} bakka dhaabde irraa itti fufi." },
    Tigrinya: { title: "ንናይ ሎሚ መዓልቲ ብጥንካረ ዛዝሞ/ምያ 🌙", body: "ኣብ {subject} ካብ ዘቋረጽካ/ኪዮ ቦታ ቀጽል/ሊ።" },
  },
  streakRisk: {
    English: { title: "Don't lose your streak! 🔥", body: "You're on a {streak}-day streak — study today to keep it alive." },
    Amharic: { title: "ተከታታይ የጥናት ቀናትህን/ሽን አታቋርጥ/ጪ! 🔥", body: "በ{streak} ተከታታይ የጥናት ቀናት ላይ ነህ/ነሽ — ይህን ለማስቀጠል ዛሬም አጥና/ኚ።" },
    Oromo: { title: "Hordoffii kee hin addaan kutin! 🔥", body: "Guyyoota {streak} walitti aanuuf qo'atteetta — kana itti fufsiisuuf har'as qo'adhu." },
    Tigrinya: { title: "ተኸታታሊ መዓልታትካ/ኪ ኣይተቋርጽ/ጺ! 🔥", body: "ኣብ ናይ {streak} ተኸታታሊ መዓልታት መጽናዕቲ ኣለኻ/ኺ — ነዚ ንምቕጻል ሎሚ እውን ኣጽንዕ/ዒ።" },
  },
  weakSubject: {
    English: { title: "Let's strengthen {subject} 💪", body: "You've been finding {subject} tricky — one topic today can help." },
    Amharic: { title: "{subject}ን እናጠናክር 💪", body: "{subject} ትንሽ ከበድ እያለህ/ሽ እንደሆነ አስተውለናል — የዛሬው አንድ ርዕስ ሊረዳህ/ሽ ይችላል።" },
    Oromo: { title: "{subject} haa cimsannu 💪", body: "{subject}n si rakkisaa akka jiru hubanneerra — mata dureen har'aa tokko si gargaaruu danda'a." },
    Tigrinya: { title: "ን{subject} ነደልድል 💪", body: "{subject} ቁሩብ እናኸበደካ/ኪ ምዃኑ ተዓዚብና — ናይ ሎሚ ሓደ ርእሲ ክሕግዘካ/ኪ ይኽእል እዩ።" },
  },
  reengagement: {
    English: { title: "We miss you at Compass Study 🧭", body: "Your progress is saved — pick up right where you left off." },
    Amharic: { title: "በCompass Study ናፍቀኸናል/ሻል 🧭", body: "ያጠናኸው/ሽው ተቀምጧል — ልክ ካቆምክበት/ሽበት ቀጥል/ይ።" },
    Oromo: { title: "Compass Study irratti si yaadneerra 🧭", body: "Guddinni kee qusatameera — bakka itti dhaabde irraa itti fufi." },
    Tigrinya: { title: "ኣብ Compass Study ናፊቕናካ/ኪ 🧭", body: "ዕቤትካ/ኪ ተዓቂቡ ኣሎ — ልክዕ ካብ ዘቋረጽካ/ኪዮ ቀጽል/ሊ።" },
  },
  examApproaching: {
    English: { title: "Exams are getting closer 📅", body: "A little {subject} practice each day adds up. Let's review together." },
    Amharic: { title: "ፈተናዎች እየተቃረቡ ነው 📅", body: "በየቀኑ ጥቂት የ{subject} ልምምድ ማድረግ ትልቅ ለውጥ ያመጣል። አብረን እንከልስ።" },
    Oromo: { title: "Qormaanni dhihaachaa jira 📅", body: "Guyyaa guyyaan shaakalli {subject} xiqqoon bu'aa guddaa fida. Waliin haa irra deebinu." },
    Tigrinya: { title: "ፈተናታት ይቐርቡ ኣለው 📅", body: "መዓልታዊ ቁሩብ ናይ {subject} ልምምድ ምግባር ተደሚሩ ዓቢ ለውጢ የምጽእ። ብሓንሳብ ንከለስ።" },
  },
  quotaReached: {
    English: { title: "You've used today's free AI questions 🎯", body: "Upgrade for unlimited chats with your AI Coach." },
    Amharic: { title: "የዛሬውን ነፃ የAI ጥያቄዎች ተጠቅመሃል/ሻል 🎯", body: "ከAI አሰልጣኝህ/ሽ ጋር ላልተገደበ ውይይት አካውንትህን/ሽን አሳድግ/ጊ።" },
    Oromo: { title: "Gaaffiilee AI bilisaa kan har'aa fayyadamteetta 🎯", body: "Leenjisaa AI kee wajjin daangaa malee haasa'uuf fooyyessi." },
    Tigrinya: { title: "ናይ ሎሚ ናጻ ናይ AI ሕቶታት ተጠቒምካ/ኪ ኣለኻ/ኺ 🎯", body: "ምስ AI ኣሰልጣኒኻ/ኺ ደረት ንዘይብሉ ዕላል ኣካውንትካ/ኪ ኣዕቢ/ብዪ።" },
  },
  newChatMessage: {
    English: { title: "New message from {senderName} 💬", body: "Tap to reply about {studentName}'s progress." },
    Amharic: { title: "አዲስ መልዕክት ከ{senderName} 💬", body: "ስለ {studentName} መሻሻል ምላሽ ለመስጠት ተጫን/ኚ።" },
    Oromo: { title: "Ergaa haaraa {senderName} irraa 💬", body: "Waa'ee guddina {studentName} deebii kennuuf tuqi." },
    Tigrinya: { title: "ሓድሽ መልእኽቲ ካብ {senderName} 💬", body: "ብዛዕባ ምዕባለ {studentName} ምላሽ ንምሃብ ጠውቕ/ቒ።" },
  },
  chatLimitWarning: {
    English: { title: "A few messages left today", body: "You have {remaining} messages left in this chat." },
    Amharic: { title: "ዛሬ ጥቂት መልዕክቶች ብቻ ቀርተዋል", body: "በዚህ ውይይት ውስጥ {remaining} መልዕክቶች ቀርተውሃል/ሻል።" },
    Oromo: { title: "Har'aaf ergaawwan muraasatu hafe", body: "Haasaa kana keessatti ergaawwan {remaining} tu siif hafe." },
    Tigrinya: { title: "ሎሚ ሒደት መልእኽትታት ጥራይ ተሪፎም", body: "ኣብዚ ዕላል {remaining} መልእኽትታት ተሪፎምኻ/ኪ ኣለው።" },
  },
  newFileFromTeacher: {
    English: { title: "New file from {teacherName} 📎", body: "Shared something for {className} — tap to view." },
    Amharic: { title: "አዲስ ፋይል ከ{teacherName} 📎", body: "ለ{className} የተላከ ነገር አለ — ለማየት ተጫን/ኚ።" },
    Oromo: { title: "Faayilii haaraa {teacherName} irraa 📎", body: "Kutaa {className}f wanta tokko qoodameera — ilaaluuf tuqi." },
    Tigrinya: { title: "ሓድሽ ፋይል ካብ {teacherName} 📎", body: "ን{className} ዝተኻፈለ ነገር ኣሎ — ንምርኣይ ጠውቕ/ቒ።" },
  },
  connectionAccepted: {
    English: { title: "You're connected! ✅", body: "{name} can now see your progress." },
    Amharic: { title: "ተገናኝተሃል/ሻል! ✅", body: "{name} አሁን መሻሻልህን/ሽን ማየት ይችላል/ትችላለች።" },
    Oromo: { title: "Wal qunnamteetta! ✅", body: "{name} amma guddina kee arguu danda'a." },
    Tigrinya: { title: "ተራኺብኩም ኣለኹም! ✅", body: "{name} ሕጂ ምዕባለኻ/ኺ ክርኢ ይኽእል እዩ/እያ።" },
  },
};

// Fills {placeholders} in a template with real values, e.g.:
//   renderNotification("streakRisk", "Amharic", { streak: "7" })
export function renderNotification(
  key: NotificationKey,
  language: Language,
  values: Record<string, string | number>
): NotificationTemplate {
  const template = NOTIFICATION_TEMPLATES[key][language];
  const fill = (text: string) =>
    text.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
  return { title: fill(template.title), body: fill(template.body) };
}

// Push notification templates — Compass Study's notification "voice."
// Style: a study buddy who's a little proud of the student, not a nagging
// parent or a corporate app. Short, warm, direct, one idea per notification.
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
    Amharic: { title: "መልካም ጧት! 🌅", body: "ለGrade {grade} ጥቂት ደቂቃዎችን መስጠት ወደፊት ያራምዳል። ዝግጁ?" },
    Oromo: { title: "Ganama gaarii! 🌅", body: "Har'a daqiiqaa muraasaaf Grade {grade} qo'achuun fuulduratti si tarkaanfachiisa. Qophiidhaa?" },
  },
  dailyAfternoon: {
    English: { title: "Study break? 📚", body: "Your {subject} lesson is waiting whenever you have 10 minutes." },
    Amharic: { title: "የጥናት እረፍት? 📚", body: "10 ደቂቃዎች ሲኖሩህ የ{subject} ትምህርትህ ዝግጁ ነው።" },
    Oromo: { title: "Boqonnaa qo'annoo? 📚", body: "Yeroo daqiiqaa 10 qabaattutti barumsi {subject} kee si eegaa jira." },
  },
  dailyEvening: {
    English: { title: "Finish today strong 🌙", body: "Pick up where you left off in {subject}." },
    Amharic: { title: "ቀኑን በጥሩ ሁኔታ አጠናቅ 🌙", body: "የ{subject} ትምህርትህን ካቆምክበት ቀጥል።" },
    Oromo: { title: "Har'a haala gaariin xumuri 🌙", body: "Barnoota {subject} bakka dhaabdetti itti fufi." },
  },
  streakRisk: {
    English: { title: "Don't lose your streak! 🔥", body: "You're on a {streak}-day streak — study today to keep it alive." },
    Amharic: { title: "የጥናት ሪከርድህን አታቋርጥ! 🔥", body: "የ{streak}-ቀናት ተከታታይ ጥናት አለህ — ዛሬም በማጥናት አስቀጥለው።" },
    Oromo: { title: "Walitti fufiinsa kee hin citiin! 🔥", body: "Guyyaa {streak} walitti fuftee qo'atteetta — har'as qo'achuun itti fufsiisi." },
  },
  weakSubject: {
    English: { title: "Let's strengthen {subject} 💪", body: "You've been finding {subject} tricky — one topic today can help." },
    Amharic: { title: "የ{subject} ትምህርትን እናጠናክር 💪", body: "{subject} ትንሽ ከበድ ብሎህ ሊሆን ይችላል — ዛሬ አንድ ርዕስ ማየት ሊረዳህ ይችላል።" },
    Oromo: { title: "{subject} haa cimsannu 💪", body: "{subject} xiqqoo sitti ulfaataa tureera — har'a mata duree tokko qo'achuun si gargaara." },
  },
  reengagement: {
    English: { title: "We miss you at Compass Study 🧭", body: "Your progress is saved — pick up right where you left off." },
    Amharic: { title: "Compass Study ላይ ናፍቀኸናል 🧭", body: "ያጠናኸው ተቀምጧል — ልክ ካቆምክበት ቀጥል።" },
    Oromo: { title: "Compass Study irratti si yaadneerra 🧭", body: "Guddinni kee qusatameera — bakka dhaabdetti itti fufi." },
  },
  examApproaching: {
    English: { title: "Exams are getting closer 📅", body: "A little {subject} practice each day adds up. Let's review together." },
    Amharic: { title: "ፈተናዎች እየተቃረቡ ነው 📅", body: "በየቀኑ ጥቂት የ{subject} ልምምድ ማድረግ ትልቅ ለውጥ ያመጣል። አብረን እንከልስ።" },
    Oromo: { title: "Qormaanni dhiyaachaa jira 📅", body: "Guyyuma guyyaan {subject} xiqqoo shaakaluun bu'aa fida. Waliin haa irra deebinu." },
  },
  quotaReached: {
    English: { title: "You've used today's free AI questions 🎯", body: "Upgrade for unlimited chats with your AI Coach." },
    Amharic: { title: "የዛሬዎቹን ነፃ የAI ጥያቄዎች ተጠቅመሃል 🎯", body: "ከAI Coach ጋር ያለገደብ ለመወያየት መለያህን አሻሽል (Upgrade)።" },
    Oromo: { title: "Gaaffilee AI bilisaa har'aa fayyadamteetta 🎯", body: "AI Coach kee waliin daangaa malee haasa'uuf akaawuntii kee guddisi." },
  },
  newChatMessage: {
    English: { title: "New message from {senderName} 💬", body: "Tap to reply about {studentName}'s progress." },
    Amharic: { title: "ከ{senderName} አዲስ መልእክት መጥቷል 💬", body: "ስለ {studentName} ሂደት ምላሽ ለመስጠት ይጫኑ።" },
    Oromo: { title: "{senderName} irraa ergaa haaraa 💬", body: "Guddina {studentName} irratti deebii kennuuf cuqaasi." },
  },
  chatLimitWarning: {
    English: { title: "A few messages left today", body: "You have {remaining} messages left in this chat." },
    Amharic: { title: "ለዛሬ ጥቂት መልእክቶች ቀርተዋል", body: "በዚህ ውይይት ውስጥ {remaining} መልእክቶች ብቻ ቀርተውሃል።" },
    Oromo: { title: "Har'aaf ergaawwan muraasatu hafe", body: "Haasaa kana keessatti ergaawwan {remaining} siif hafaniiru." },
  },
  newFileFromTeacher: {
    English: { title: "New file from {teacherName} 📎", body: "Shared something for {className} — tap to view." },
    Amharic: { title: "ከ{teacherName} አዲስ ፋይል 📎", body: "ለ{className} የተላከ ነገር አለ — ለማየት ይጫኑ።" },
    Oromo: { title: "Faayilii haaraa {teacherName} irraa 📎", body: "Waan {className} fi qoodameera — ilaaluuf cuqaasi." },
  },
  connectionAccepted: {
    English: { title: "You're connected! ✅", body: "{name} can now see your progress." },
    Amharic: { title: "ተገናኝተዋል! ✅", body: "አሁን {name} የጥናትህን ሂደት ማየት ይችላል።" },
    Oromo: { title: "Wal qunnamtaniittu! ✅", body: "Amma {name} guddina kee ilaaluu danda'a." },
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

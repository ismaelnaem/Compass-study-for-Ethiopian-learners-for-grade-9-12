import { adminDb } from "./firebaseAdmin";

// V1 simplification, flagged explicitly rather than hidden: a "chat thread"
// exists per STUDENT, shared by every Teacher and Family member who has an
// accepted connection to that student — not a separate thread per
// individual pair. This is simpler to build and reason about than
// per-pair threading, and still matches the locked rule "Teacher <-> Family
// communication is supported" through their shared connection to the
// student. If per-pair private threads are needed later, this is the file
// to revisit.
//
// Not yet implemented (locked design exists, this is a smaller first
// version): AI-judged topic-drift auto-pause, and the exact
// server/device retention window numbers. What IS implemented: a daily
// per-user message cap, and manual block/report.

export const DAILY_MESSAGE_LIMIT = 20;
export const MESSAGE_VISIBLE_HOURS = 48; // how long a message stays visible when the thread is read

export function threadIdForStudent(studentId: string): string {
  return `student_${studentId}`;
}

// Confirms the caller (teacher or family) actually has an accepted
// connection to this student — the only thing that unlocks access to the
// thread. Returns their role in the thread, or null if not allowed.
export async function verifyThreadAccess(
  uid: string,
  studentId: string
): Promise<"teacher" | "family" | "student" | null> {
  if (uid === studentId) return null; // students don't participate in this chat (locked: private AI chat only for students)

  const snap = await adminDb
    .collection("connections")
    .where("initiatorId", "==", uid)
    .where("studentId", "==", studentId)
    .where("status", "==", "accepted")
    .limit(1)
    .get();
  if (snap.empty) return null;
  const type = snap.docs[0].data().type;
  return type === "teacher-student" ? "teacher" : "family";
}

export async function countMessagesSentToday(threadId: string, uid: string): Promise<number> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const snap = await adminDb
    .collection("chatThreads")
    .doc(threadId)
    .collection("messages")
    .where("senderId", "==", uid)
    .where("createdAtMs", ">=", since.getTime())
    .get();
  return snap.size;
}

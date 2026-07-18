import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { getUserDisplayName } from "./_lib/connections";
import { threadIdForStudent, verifyThreadAccess, countMessagesSentToday, DAILY_MESSAGE_LIMIT, MESSAGE_VISIBLE_HOURS } from "./_lib/chat";
import { FieldValue } from "firebase-admin/firestore";

// Merged endpoint: combines list-messages, send-message, and report-chat
// into ONE Vercel Function to stay under the Hobby plan's 12-function cap.
// Routed internally by an `_fn` query parameter — vercel.json rewrites keep
// the original public paths (e.g. /api/send-message) working unchanged.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fn = String(req.query._fn || "");

  switch (fn) {
    case "list-messages":
      return listMessages(req, res);
    case "send-message":
      return sendMessage(req, res);
    case "report-chat":
      return reportChat(req, res);
    default:
      return res.status(404).json({ error: "Unknown messaging endpoint." });
  }
}

// ---------- list-messages ----------
async function listMessages(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const studentId = String(req.query.studentId || "");
  if (!studentId) {
    return res.status(400).json({ error: "studentId is required." });
  }

  try {
    const role = await verifyThreadAccess(uid, studentId);
    if (!role) {
      return res.status(403).json({ error: "You don't have access to this conversation." });
    }

    const threadId = threadIdForStudent(studentId);
    const threadRef = adminDb.collection("chatThreads").doc(threadId);
    const threadSnap = await threadRef.get();
    const blocked = (threadSnap.data()?.blockedBy || []).length > 0;

    const cutoff = Date.now() - MESSAGE_VISIBLE_HOURS * 60 * 60 * 1000;
    const msgSnap = await threadRef
      .collection("messages")
      .where("createdAtMs", ">=", cutoff)
      .orderBy("createdAtMs", "asc")
      .get();
    const messages = msgSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return res.status(200).json({ messages, blocked });
  } catch (error) {
    console.error("Error listing messages:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ---------- send-message ----------
async function sendMessage(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { studentId, text } = req.body || {};
  if (!studentId || !text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Missing required parameters." });
  }
  if (text.length > 1000) {
    return res.status(400).json({ error: "Message is too long." });
  }

  try {
    const senderRole = await verifyThreadAccess(uid, studentId);
    if (!senderRole) {
      return res.status(403).json({ error: "You don't have access to this conversation." });
    }

    const threadId = threadIdForStudent(studentId);
    const threadRef = adminDb.collection("chatThreads").doc(threadId);
    const threadSnap = await threadRef.get();
    const blockedBy: string[] = threadSnap.data()?.blockedBy || [];
    if (blockedBy.length > 0) {
      return res.status(403).json({ error: "This conversation has been blocked." });
    }

    const sentToday = await countMessagesSentToday(threadId, uid);
    if (sentToday >= DAILY_MESSAGE_LIMIT) {
      return res.status(429).json({
        error: `You've reached today's ${DAILY_MESSAGE_LIMIT}-message limit for this conversation.`,
      });
    }

    const senderName = await getUserDisplayName(uid);
    const now = Date.now();
    await threadRef.set({ studentId, lastMessageAtMs: now }, { merge: true });
    await threadRef.collection("messages").add({
      senderId: uid,
      senderRole,
      senderName,
      text: text.trim(),
      createdAt: FieldValue.serverTimestamp(),
      createdAtMs: now,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ---------- report-chat ----------
async function reportChat(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { studentId, action } = req.body || {};
  if (!studentId || (action !== "report" && action !== "block")) {
    return res.status(400).json({ error: "Missing or invalid parameters." });
  }

  try {
    const role = await verifyThreadAccess(uid, studentId);
    if (!role) {
      return res.status(403).json({ error: "You don't have access to this conversation." });
    }

    const threadId = threadIdForStudent(studentId);

    if (action === "report") {
      await adminDb.collection("chatReports").add({
        threadId,
        studentId,
        reportedBy: uid,
        reportedByRole: role,
        createdAt: FieldValue.serverTimestamp(),
      });
      return res.status(200).json({ success: true, action: "report" });
    }

    // action === "block"
    await adminDb.collection("chatThreads").doc(threadId).set(
      { blockedBy: FieldValue.arrayUnion(uid) },
      { merge: true }
    );
    return res.status(200).json({ success: true, action: "block" });
  } catch (error) {
    console.error("Error handling chat report/block:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

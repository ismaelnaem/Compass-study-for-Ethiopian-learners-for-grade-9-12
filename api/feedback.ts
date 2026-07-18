import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

// Merged endpoint: combines flag-answer and log-feedback into ONE Vercel
// Function to stay under the Hobby plan's 12-function cap. Routed
// internally by an `_fn` query parameter — vercel.json rewrites keep the
// original public paths working exactly as before.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fn = String(req.query._fn || "");

  switch (fn) {
    case "flag-answer":
      return flagAnswer(req, res);
    case "log-feedback":
      return logFeedback(req, res);
    default:
      return res.status(404).json({ error: "Unknown feedback endpoint." });
  }
}

// ---------- flag-answer ----------
async function flagAnswer(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { subject, question, answer } = req.body || {};
  if (!question || !answer) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    await adminDb.collection("flaggedAnswers").add({
      uid,
      subject: subject || "General",
      question,
      answer,
      ts: FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error flagging answer:", error);
    return res.status(200).json({ success: true, _internalError: true });
  }
}

// ---------- log-feedback ----------
async function logFeedback(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { subject, feedback } = req.body || {};
  if (feedback === undefined) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    const expireAt = Timestamp.fromMillis(Date.now() + ninetyDaysMs);

    await adminDb.collection("interactions").add({
      uid,
      subject: subject || "General",
      feedback,
      ts: FieldValue.serverTimestamp(),
      expireAt,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error logging feedback:", error);
    return res.status(200).json({ success: true, _internalError: true });
  }
}

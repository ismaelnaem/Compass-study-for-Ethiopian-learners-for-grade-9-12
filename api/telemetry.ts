import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

// Merged from the old separate api/flag-answer.ts and api/log-feedback.ts
// endpoints to stay under Vercel Hobby's 12-Serverless-Function-per-deployment
// limit. Pick which one you want with body.type = "flag" or "feedback".
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Not a Gemini-cost endpoint, but uid still comes from the verified token —
  // never trust a client-supplied uid when writing data tied to an account.
  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { type, subject, question, answer, feedback } = req.body || {};

  if (type === "flag") {
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

  if (type === "feedback") {
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

  return res.status(400).json({ error: "Missing or invalid parameter: type must be 'flag' or 'feedback'" });
}

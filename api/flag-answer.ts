import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Not a Gemini-cost endpoint, but uid still comes from the verified token —
  // never trust a client-supplied uid when writing data tied to an account.
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

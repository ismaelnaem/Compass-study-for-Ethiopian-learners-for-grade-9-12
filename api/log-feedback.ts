import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
